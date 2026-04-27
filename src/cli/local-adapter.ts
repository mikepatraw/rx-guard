import { findPdmpRecord, loadPdmpDatabase, type PdmpPrescription } from '../engine/pdmp.js';
import { normalizeReviewRequest } from '../fhir/normalize.js';
import type { ReviewRequest, ReviewResponse, RiskLevel } from '../types/review.js';
import { reviewEncounter } from '../api/review.js';

const SYNTHETIC_PATIENT_KEYS = new Map<string, string>([
  ['sheila bankston|1960-06-13', 'RXG-SB-001']
]);

export interface LocalCliInput {
  name: string;
  dob: string;
  medication: string;
  directions: string;
  history: string;
  note: string;
}

export interface PromptOpinionPayload {
  synthetic_patient_key: string;
  proposed_medication: string;
  directions: string;
  patient_reported_history: string;
  encounter_note: string;
}

export interface PromptOpinionResponse {
  risk_score: number;
  risk_level: 'low' | 'moderate' | 'high';
  pdmp_summary_status: 'matched' | 'not_found' | 'not_checked';
  flags: string[];
  recommendation: string;
  compliance_flag: string | null;
  auto_note: string;
}

export interface LocalCliReview {
  syntheticPatientKey: string;
  promptOpinionPayload: PromptOpinionPayload;
  promptOpinionResponse: PromptOpinionResponse;
  rxGuardReview: ReviewResponse;
  pdmpRows: PdmpPrescription[];
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

function resolveSyntheticPatientKey(name: string, dob: string): string | null {
  return SYNTHETIC_PATIENT_KEYS.get(`${normalizeName(name)}|${dob.trim()}`) ?? null;
}

function required(value: string | undefined, flag: string): string {
  const trimmed = value?.trim();
  if (!trimmed) throw new Error(`Missing required ${flag}`);
  return trimmed;
}

export function parseCliArgs(args: string[]): LocalCliInput {
  const values = new Map<string, string>();
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    if (!flag?.startsWith('--')) throw new Error(`Unexpected argument: ${flag ?? ''}`.trim());
    if (value === undefined || value.startsWith('--')) throw new Error(`Missing value for ${flag}`);
    values.set(flag, value);
  }

  return {
    name: required(values.get('--name'), '--name'),
    dob: required(values.get('--dob'), '--dob'),
    medication: required(values.get('--medication'), '--medication'),
    directions: required(values.get('--directions'), '--directions'),
    history: required(values.get('--history'), '--history'),
    note: required(values.get('--note'), '--note')
  };
}

function splitMedication(medication: string): { name: string; dose?: string } {
  const doseMatch = medication.match(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml)\b/i);
  if (!doseMatch) return { name: medication };
  const name = medication.slice(0, doseMatch.index).trim() || medication;
  return { name, dose: doseMatch[0] };
}

function scheduleClassFor(medication: string): string | undefined {
  const normalized = medication.toLowerCase();
  if (normalized.includes('xanax') || normalized.includes('alprazolam') || normalized.includes('lorazepam')) {
    return 'Schedule IV';
  }
  if (normalized.includes('oxycodone') || normalized.includes('hydrocodone') || normalized.includes('adderall')) {
    return 'Schedule II';
  }
  return undefined;
}

function riskScore(level: RiskLevel): number {
  if (level === 'high') return 80;
  if (level === 'moderate') return 55;
  if (level === 'low') return 25;
  return 0;
}

function buildReviewRequest(input: LocalCliInput): ReviewRequest {
  const med = splitMedication(input.medication);
  return normalizeReviewRequest({
    requestId: 'local-cli-demo',
    synthetic: true,
    patient: {
      id: 'local-cli-patient',
      name: input.name,
      dob: input.dob
    },
    encounter: {
      id: 'local-cli-encounter',
      type: 'office visit',
      date: '2026-04-19',
      setting: 'outpatient'
    },
    conditions: [
      { name: 'generalized anxiety', status: 'active' }
    ],
    activeMedications: [],
    allergies: [],
    proposedMedication: {
      name: med.name,
      dose: med.dose,
      sig: input.directions,
      scheduleClass: scheduleClassFor(input.medication)
    },
    monitoringSummary: {
      pdmpReviewed: true,
      pdmpDocumented: !/not\s+yet\s+documented|not\s+documented/i.test(input.note),
      udsAvailable: false,
      earlyRefillConcern: false,
      painAgreementOnFile: false
    },
    riskIndicators: [],
    noteText: `${input.history}. ${input.note}`,
    source: {
      platform: 'local-cli-adapter',
      fhirContext: false
    }
  });
}

function toPromptOpinionPayload(input: LocalCliInput, syntheticPatientKey: string): PromptOpinionPayload {
  return {
    synthetic_patient_key: syntheticPatientKey,
    proposed_medication: input.medication,
    directions: input.directions,
    patient_reported_history: input.history,
    encounter_note: input.note
  };
}

function preferPdmpEntry(entries: string[]): string | undefined {
  return entries.find((entry) => /PDMP/i.test(entry)) ?? entries[0];
}

function complianceFlagFor(review: ReviewResponse): string | null {
  if (review.flags.some((flag) => /PDMP review may have occurred but was not documented/i.test(flag.message))) {
    return 'PDMP review documentation';
  }
  return preferPdmpEntry(review.missingDocumentation) ?? null;
}

function autoNoteFor(review: ReviewResponse): string {
  const pdmp = review.pdmpCrossReference;
  if (pdmp?.matched) {
    const fills = pdmp.totalPrescriptions === 1 ? 'one controlled-substance fill' : `${numberWord(pdmp.totalPrescriptions)} controlled-substance fills`;
    return `PDMP shows ${fills} in the past 90 days involving ${pdmp.prescriberCount90d} prescribers and ${pdmp.pharmacyCount90d} pharmacies. Patient-reported history should be reconciled with recent PDMP-style records before finalizing the prescription.`;
  }
  return preferPdmpEntry(review.suggestedLanguage) ?? review.summary;
}

function numberWord(value: number): string {
  const words = new Map<number, string>([
    [0, 'zero'],
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
    [4, 'four'],
    [5, 'five']
  ]);
  return words.get(value) ?? String(value);
}

function toPromptOpinionResponse(review: ReviewResponse): PromptOpinionResponse {
  const pdmpFlags = review.flags.filter((flag) => /PDMP|prescriber|pharmac/i.test(flag.message));
  const compactFlags = (pdmpFlags.length > 0 ? pdmpFlags : review.flags).slice(0, 3).map((flag) => flag.message);

  return {
    risk_score: riskScore(review.riskLevel),
    risk_level: review.riskLevel === 'unknown' ? 'low' : review.riskLevel,
    pdmp_summary_status: review.pdmpCrossReference?.matched ? 'matched' : 'not_found',
    flags: compactFlags,
    recommendation: review.riskLevel === 'high'
      ? 'Not recommended — verify with patient before prescribing'
      : 'Proceed only after clinician review and documentation',
    compliance_flag: complianceFlagFor(review),
    auto_note: autoNoteFor(review)
  };
}

export function buildLocalCliReview(input: LocalCliInput): LocalCliReview {
  const syntheticPatientKey = resolveSyntheticPatientKey(input.name, input.dob);
  if (!syntheticPatientKey) {
    throw new Error('No local synthetic demo patient matched that name and DOB');
  }

  const request = buildReviewRequest(input);
  const record = findPdmpRecord(loadPdmpDatabase(), input.name, input.dob);
  const rxGuardReview = reviewEncounter(request);

  return {
    syntheticPatientKey,
    promptOpinionPayload: toPromptOpinionPayload(input, syntheticPatientKey),
    promptOpinionResponse: toPromptOpinionResponse(rxGuardReview),
    rxGuardReview,
    pdmpRows: record?.prescriptions ?? []
  };
}

function renderPdmpRows(rows: PdmpPrescription[]): string {
  return rows.map((row) => {
    const med = row.medication.padEnd(18, ' ');
    const prescriber = row.prescriber.padEnd(15, ' ');
    return `  ${row.date}  ${med} qty ${String(row.qty).padStart(2, ' ')}  ${prescriber}  ${row.pharmacy}`;
  }).join('\n');
}

export function renderCliReview(review: LocalCliReview): string {
  const flags = review.promptOpinionResponse.flags.map((flag) => `  - ${flag}`).join('\n');
  return [
    'RX Guard Local CLI Adapter',
    '==========================',
    `Resolved synthetic key: ${review.syntheticPatientKey}`,
    '',
    'Prompt Opinion-safe payload:',
    JSON.stringify(review.promptOpinionPayload, null, 2),
    '',
    'Prompt Opinion compact JSON:',
    JSON.stringify(review.promptOpinionResponse, null, 2),
    '',
    `Risk: ${review.rxGuardReview.riskLevel.toUpperCase()} (${review.promptOpinionResponse.risk_score}/100)`,
    `PDMP rows rendered locally: ${review.pdmpRows.length}`,
    renderPdmpRows(review.pdmpRows),
    '',
    'Top flags:',
    flags || '  - None',
    '',
    `Recommendation: ${review.promptOpinionResponse.recommendation}`,
    `Auto-note: ${review.promptOpinionResponse.auto_note}`
  ].join('\n');
}
