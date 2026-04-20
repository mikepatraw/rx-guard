import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ReviewFlag, ReviewRequest } from '../types/review.js';

export interface PdmpPrescription {
  date: string;
  medication: string;
  qty: number;
  days: number;
  prescriber: string;
  pharmacy: string;
  scheduleClass?: string;
}

export interface PdmpRecord {
  name: string;
  dob: string;
  prescriptions: PdmpPrescription[];
}

export interface PdmpDatabase {
  source: string;
  generatedAt?: string;
  notes?: string;
  records: PdmpRecord[];
}

export interface PdmpMatchSummary {
  matched: boolean;
  name?: string;
  dob?: string;
  totalPrescriptions: number;
  prescriberCount90d: number;
  pharmacyCount90d: number;
  lastFillDate?: string;
  activeOverlaps: { medA: string; medB: string; date: string }[];
}

const OPIOID_TOKENS = [
  'oxycodone', 'hydrocodone', 'morphine', 'hydromorphone',
  'tramadol', 'codeine', 'fentanyl', 'oxymorphone', 'methadone'
];

const BENZO_TOKENS = [
  'alprazolam', 'lorazepam', 'clonazepam', 'diazepam', 'temazepam',
  'triazolam', 'oxazepam', 'chlordiazepoxide'
];

const STIMULANT_TOKENS = [
  'adderall', 'amphetamine', 'methylphenidate', 'ritalin',
  'vyvanse', 'lisdexamfetamine', 'dexedrine'
];

const SEDATIVE_Z_TOKENS = ['zolpidem', 'ambien', 'eszopiclone', 'zaleplon'];

function isClass(med: string, tokens: string[]): boolean {
  const n = med.toLowerCase();
  return tokens.some((t) => n.includes(t));
}

function isOpioid(med: string): boolean { return isClass(med, OPIOID_TOKENS); }
function isBenzo(med: string): boolean { return isClass(med, BENZO_TOKENS); }
function isStimulant(med: string): boolean { return isClass(med, STIMULANT_TOKENS); }
function isSedativeZ(med: string): boolean { return isClass(med, SEDATIVE_Z_TOKENS); }

function parseDate(iso: string): Date {
  return new Date(iso.includes('T') ? iso : `${iso}T00:00:00Z`);
}

function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

function normalizeName(name: string | undefined): string {
  return (name ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function resolveDbPath(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, '../../data/synthetic/pdmp-database.json');
}

let cachedDb: PdmpDatabase | null = null;

export function loadPdmpDatabase(customPath?: string): PdmpDatabase {
  if (!customPath && cachedDb) return cachedDb;
  const dbPath = customPath ?? resolveDbPath();
  const raw = fs.readFileSync(dbPath, 'utf8');
  const parsed = JSON.parse(raw) as PdmpDatabase;
  if (!customPath) cachedDb = parsed;
  return parsed;
}

export function findPdmpRecord(
  db: PdmpDatabase,
  name: string | undefined,
  dob: string | undefined
): PdmpRecord | null {
  if (!name && !dob) return null;
  const targetName = normalizeName(name);
  for (const rec of db.records) {
    const recName = normalizeName(rec.name);
    if (dob && rec.dob === dob && (!targetName || recName === targetName)) return rec;
    if (!dob && targetName && recName === targetName) return rec;
  }
  return null;
}

function withinDays(date: Date, reference: Date, windowDays: number): boolean {
  return date <= reference && daysBetween(date, reference) <= windowDays;
}

function detectOverlaps(prescriptions: PdmpPrescription[], referenceDate: Date): { medA: string; medB: string; date: string }[] {
  const active = prescriptions
    .map((p) => ({ ...p, start: parseDate(p.date) }))
    .filter((p) => p.start <= referenceDate)
    .map((p) => ({
      ...p,
      end: new Date(p.start.getTime() + p.days * 24 * 60 * 60 * 1000)
    }));

  const overlaps: { medA: string; medB: string; date: string }[] = [];
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i]!;
      const b = active[j]!;
      const overlapStart = a.start > b.start ? a.start : b.start;
      const overlapEnd = a.end < b.end ? a.end : b.end;
      if (overlapStart >= overlapEnd) continue;
      const aOpioid = isOpioid(a.medication);
      const bOpioid = isOpioid(b.medication);
      const aBenzo = isBenzo(a.medication);
      const bBenzo = isBenzo(b.medication);
      if ((aOpioid && bBenzo) || (aBenzo && bOpioid)) {
        overlaps.push({
          medA: a.medication,
          medB: b.medication,
          date: overlapStart.toISOString().slice(0, 10)
        });
      }
    }
  }
  return overlaps;
}

function detectEarlyRefills(prescriptions: PdmpPrescription[]): { medication: string; prior: string; refill: string; gapDays: number; expectedDays: number }[] {
  const byMed = new Map<string, PdmpPrescription[]>();
  for (const p of prescriptions) {
    const key = p.medication.toLowerCase().split(/\s+/).slice(0, 1).join(' ');
    if (!byMed.has(key)) byMed.set(key, []);
    byMed.get(key)!.push(p);
  }
  const hits: { medication: string; prior: string; refill: string; gapDays: number; expectedDays: number }[] = [];
  for (const [, fills] of byMed) {
    const sorted = [...fills].sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
    for (let i = 1; i < sorted.length; i++) {
      const prior = sorted[i - 1]!;
      const curr = sorted[i]!;
      const gap = daysBetween(parseDate(prior.date), parseDate(curr.date));
      if (prior.days > 0 && gap < prior.days * 0.75) {
        hits.push({
          medication: curr.medication,
          prior: prior.date,
          refill: curr.date,
          gapDays: Math.round(gap),
          expectedDays: prior.days
        });
      }
    }
  }
  return hits;
}

function countUnique<T>(items: T[]): number {
  return new Set(items).size;
}

function isWithinDaysSupply(p: PdmpPrescription, referenceDate: Date): boolean {
  const start = parseDate(p.date);
  const end = new Date(start.getTime() + p.days * 24 * 60 * 60 * 1000);
  return start <= referenceDate && referenceDate < end;
}

function daysRemaining(p: PdmpPrescription, referenceDate: Date): number {
  const start = parseDate(p.date);
  const end = new Date(start.getTime() + p.days * 24 * 60 * 60 * 1000);
  return Math.max(0, Math.ceil((end.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)));
}

function formatList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export function analyzePdmpRecord(
  record: PdmpRecord,
  request: ReviewRequest
): { flags: ReviewFlag[]; summary: PdmpMatchSummary } {
  const flags: ReviewFlag[] = [];
  const referenceDate = request.encounter.date ? parseDate(request.encounter.date) : new Date();
  const scripts = record.prescriptions;
  const recent90 = scripts.filter((p) => withinDays(parseDate(p.date), referenceDate, 90));
  const recent30 = scripts.filter((p) => withinDays(parseDate(p.date), referenceDate, 30));

  const prescriberCount90 = countUnique(recent90.map((p) => p.prescriber));
  const pharmacyCount90 = countUnique(recent90.map((p) => p.pharmacy));
  const lastFill = scripts
    .map((p) => parseDate(p.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const overlaps = detectOverlaps(recent90, referenceDate);

  const summary: PdmpMatchSummary = {
    matched: true,
    name: record.name,
    dob: record.dob,
    totalPrescriptions: scripts.length,
    prescriberCount90d: prescriberCount90,
    pharmacyCount90d: pharmacyCount90,
    lastFillDate: lastFill ? lastFill.toISOString().slice(0, 10) : undefined,
    activeOverlaps: overlaps
  };

  if (overlaps.length > 0) {
    const first = overlaps[0]!;
    flags.push({
      code: 'pdmp_opioid_benzo_overlap',
      severity: 'high',
      source: 'rules',
      message: 'PDMP history shows a recent opioid and benzodiazepine fill window overlap.',
      explanation: `Records cross-referenced against the local PDMP dataset show overlapping active days-supply for ${first.medA} and ${first.medB} near ${first.date}. Clarifying the current regimen with the patient and documenting the rationale may be helpful before adding another controlled substance.`
    });
  }

  if (prescriberCount90 >= 3) {
    const names = Array.from(new Set(recent90.map((p) => p.prescriber)));
    flags.push({
      code: 'pdmp_multi_prescriber_pattern',
      severity: prescriberCount90 >= 4 ? 'high' : 'moderate',
      source: 'rules',
      message: `PDMP history shows ${prescriberCount90} distinct prescribers for controlled substances in the last 90 days.`,
      explanation: `Recent controlled-substance fills are associated with ${formatList(names)}. This pattern is worth reviewing with the patient to understand care coordination — for example, multiple specialists, transitions of care, or urgent-care visits — before making a prescribing decision.`
    });
  }

  if (pharmacyCount90 >= 3) {
    const names = Array.from(new Set(recent90.map((p) => p.pharmacy)));
    flags.push({
      code: 'pdmp_multi_pharmacy_pattern',
      severity: pharmacyCount90 >= 4 ? 'high' : 'moderate',
      source: 'rules',
      message: `PDMP history shows ${pharmacyCount90} distinct pharmacies used for controlled substances in the last 90 days.`,
      explanation: `Recent fills are spread across ${formatList(names)}. Consolidating to a single dispensing pharmacy can reduce the chance of unintended drug interactions and simplify monitoring; consider discussing this with the patient as a care-coordination step.`
    });
  }

  const earlyRefills = detectEarlyRefills(recent90);
  if (earlyRefills.length > 0) {
    const e = earlyRefills[0]!;
    flags.push({
      code: 'pdmp_early_refill_pattern',
      severity: 'moderate',
      source: 'rules',
      message: 'PDMP history suggests refills are occurring earlier than expected.',
      explanation: `${e.medication} was refilled on ${e.refill} approximately ${e.gapDays} days after a ${e.expectedDays}-day supply on ${e.prior}. Consider exploring with the patient whether pain control, dosing, or lost/stolen circumstances may be driving the shorter interval.`
    });
  }

  const hasStimulant = recent90.some((p) => isStimulant(p.medication));
  const hasBenzoRecent = recent90.some((p) => isBenzo(p.medication));
  const hasZDrug = recent90.some((p) => isSedativeZ(p.medication));
  if (hasStimulant && (hasBenzoRecent || hasZDrug)) {
    flags.push({
      code: 'pdmp_stimulant_sedative_pattern',
      severity: 'moderate',
      source: 'rules',
      message: 'PDMP history shows overlapping stimulant and sedative therapy in the last 90 days.',
      explanation: 'Concurrent stimulant and sedative/hypnotic therapy is sometimes clinically appropriate but can mask sleep or anxiety concerns. Documenting the rationale and any shared care with behavioral health is worth including in the note.'
    });
  }

  const proposedName = request.proposedMedication.name;
  if (proposedName) {
    const recentSameClass = recent30.filter((p) => {
      if (isOpioid(proposedName) && isOpioid(p.medication)) return true;
      if (isBenzo(proposedName) && isBenzo(p.medication)) return true;
      if (isStimulant(proposedName) && isStimulant(p.medication)) return true;
      return false;
    });
    if (recentSameClass.length > 0) {
      const r = recentSameClass[0]!;
      flags.push({
        code: 'pdmp_duplicate_class_recent_fill',
        severity: 'moderate',
        source: 'rules',
        message: `PDMP history shows a same-class controlled substance filled in the last 30 days (${r.medication} on ${r.date}).`,
        explanation: `The proposed ${proposedName} is in the same therapeutic class as a recent fill (${r.medication} from ${r.prescriber} at ${r.pharmacy}). Confirming whether this is a planned continuation, a transition, or an unrecognized duplicate is a useful documentation step.`
      });
    }
    const activeBenzo = recent90.find((p) => isBenzo(p.medication) && isWithinDaysSupply(p, referenceDate));
    const activeOpioid = recent90.find((p) => isOpioid(p.medication) && isWithinDaysSupply(p, referenceDate));

    if (isOpioid(proposedName) && activeBenzo) {
      const remaining = daysRemaining(activeBenzo, referenceDate);
      flags.push({
        code: 'pdmp_proposed_opioid_with_active_benzo',
        severity: 'high',
        source: 'rules',
        message: `Proposed opioid would be added while ${activeBenzo.medication} is still within its days-supply window.`,
        explanation: `${activeBenzo.medication} was filled on ${activeBenzo.date} (${activeBenzo.days}-day supply, ~${remaining} day(s) remaining at encounter) from ${activeBenzo.prescriber} at ${activeBenzo.pharmacy}. Concurrent opioid + benzodiazepine exposure raises sedation and respiratory-depression risk; reviewing the combined regimen with the patient and documenting the rationale is recommended.`
      });
    } else if (isOpioid(proposedName) && recent90.some((p) => isBenzo(p.medication))) {
      const recentBenzo = recent90.find((p) => isBenzo(p.medication))!;
      flags.push({
        code: 'pdmp_recent_benzo_course_concluded',
        severity: 'low',
        source: 'rules',
        message: `A benzodiazepine course recently concluded (${recentBenzo.medication} filled ${recentBenzo.date}) per PDMP history.`,
        explanation: `The days-supply window for the most recent benzodiazepine appears to have already elapsed, so no active pharmacologic overlap is expected today. It is still worth asking whether the patient has any remaining supply on hand before starting an opioid.`
      });
    }

    if (isBenzo(proposedName) && activeOpioid) {
      const remaining = daysRemaining(activeOpioid, referenceDate);
      flags.push({
        code: 'pdmp_proposed_benzo_with_active_opioid',
        severity: 'high',
        source: 'rules',
        message: `Proposed benzodiazepine would be added while ${activeOpioid.medication} is still within its days-supply window.`,
        explanation: `${activeOpioid.medication} was filled on ${activeOpioid.date} (${activeOpioid.days}-day supply, ~${remaining} day(s) remaining at encounter) from ${activeOpioid.prescriber} at ${activeOpioid.pharmacy}. Starting a benzodiazepine in this context warrants explicit discussion of sedation and overdose risk, and clear documentation of why the combination is being chosen.`
      });
    } else if (isBenzo(proposedName) && recent90.some((p) => isOpioid(p.medication))) {
      const recentOpioid = recent90.find((p) => isOpioid(p.medication))!;
      flags.push({
        code: 'pdmp_recent_opioid_course_concluded',
        severity: 'low',
        source: 'rules',
        message: `An opioid course recently concluded (${recentOpioid.medication} filled ${recentOpioid.date}) per PDMP history.`,
        explanation: `The days-supply window for the most recent opioid appears to have already elapsed, so no active pharmacologic overlap is expected today. It is still worth confirming the patient has no remaining supply on hand before starting a benzodiazepine.`
      });
    }
  }

  return { flags, summary };
}

export function buildNoMatchFlag(nameProvided: boolean, dobProvided: boolean): ReviewFlag | null {
  if (!nameProvided && !dobProvided) return null;
  return {
    code: 'pdmp_no_record_found',
    severity: 'low',
    source: 'rules',
    message: 'No matching patient record was found in the local PDMP dataset.',
    explanation: 'The cross-reference returned no prior controlled-substance fills for this patient. This may simply indicate a first controlled-substance prescription; documenting that the PDMP was reviewed and nothing notable was identified is still good practice.'
  };
}

export function runPdmpReview(request: ReviewRequest): { flags: ReviewFlag[]; summary: PdmpMatchSummary } {
  const db = loadPdmpDatabase();
  const name = request.patient.name;
  const dob = request.patient.dob;
  const record = findPdmpRecord(db, name, dob);

  if (!record) {
    const flag = buildNoMatchFlag(Boolean(name), Boolean(dob));
    return {
      flags: flag ? [flag] : [],
      summary: {
        matched: false,
        totalPrescriptions: 0,
        prescriberCount90d: 0,
        pharmacyCount90d: 0,
        activeOverlaps: []
      }
    };
  }

  return analyzePdmpRecord(record, request);
}
