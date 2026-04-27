import type { ReviewFlag, ReviewRequest, RiskLevel } from '../types/review.js';

function noteIncludes(text: string, patterns: string[]): boolean {
  const normalized = text.toLowerCase();
  return patterns.some((pattern) => normalized.includes(pattern));
}

function hasActiveBenzo(request: ReviewRequest): boolean {
  const meds = request.activeMedications ?? [];
  return meds.some((med) => {
    const name = med.name.toLowerCase();
    return (
      name.includes('alprazolam') ||
      name.includes('lorazepam') ||
      name.includes('clonazepam') ||
      name.includes('diazepam') ||
      name.includes('temazepam')
    );
  });
}

function proposedMedicationLooksOpioid(request: ReviewRequest): boolean {
  const name = request.proposedMedication.name.toLowerCase();
  return (
    name.includes('oxycodone') ||
    name.includes('hydrocodone') ||
    name.includes('morphine') ||
    name.includes('hydromorphone') ||
    name.includes('tramadol') ||
    name.includes('codeine') ||
    name.includes('fentanyl')
  );
}

function findMissingDocumentation(request: ReviewRequest): string[] {
  const note = request.noteText.toLowerCase();
  const monitoring = request.monitoringSummary ?? {};
  const missing: string[] = [];

  if (!monitoring.pdmpDocumented && !noteIncludes(note, ['pdmp', 'prescription monitoring'])) {
    missing.push('PDMP review documentation');
  }

  if (!noteIncludes(note, ['goal', 'function', 'daily activities', 'return to work'])) {
    missing.push('functional goal or treatment objective');
  }

  if (!noteIncludes(note, ['follow up', 'follow-up', 'reassess', 'monitor', 'monitoring'])) {
    missing.push('monitoring or follow-up plan');
  }

  if (!noteIncludes(note, ['discussed risk', 'sedation', 'overdose', 'precaution', 'consent'])) {
    missing.push('risk discussion or counseling');
  }

  return missing;
}

function buildSuggestedLanguage(missingDocumentation: string[]): string[] {
  const suggestions: string[] = [];

  if (missingDocumentation.includes('PDMP review documentation')) {
    suggestions.push('Reviewed PDMP today; document recent controlled-substance history, care-coordination concerns, and prescribing rationale before finalizing.');
  }

  if (missingDocumentation.includes('functional goal or treatment objective')) {
    suggestions.push('Treatment goal is short-term improvement in pain control and daily functioning.');
  }

  if (missingDocumentation.includes('monitoring or follow-up plan')) {
    suggestions.push('Patient will follow up for reassessment if symptoms worsen or fail to improve.');
  }

  if (missingDocumentation.includes('risk discussion or counseling')) {
    suggestions.push('Discussed medication risks, sedation precautions, and when to seek further evaluation.');
  }

  return suggestions;
}

export function evaluateRules(request: ReviewRequest): ReviewFlag[] {
  const flags: ReviewFlag[] = [];
  const monitoring = request.monitoringSummary ?? {};

  if (proposedMedicationLooksOpioid(request) && hasActiveBenzo(request)) {
    flags.push({
      code: 'opioid_benzo_overlap',
      severity: 'high',
      source: 'rules',
      message: 'Concurrent opioid and benzodiazepine exposure detected.',
      explanation:
        'An active benzodiazepine appears in the medication list while an opioid is being prescribed, which may increase sedation and overdose risk.'
    });
  }

  if (monitoring.pdmpReviewed && !monitoring.pdmpDocumented) {
    flags.push({
      code: 'missing_pdmp_documentation',
      severity: 'moderate',
      source: 'rules',
      message: 'PDMP review may have occurred but was not documented.',
      explanation:
        'The monitoring summary indicates PDMP review, but the encounter note does not clearly document it.'
    });
  }

  if (monitoring.earlyRefillConcern) {
    flags.push({
      code: 'early_refill_concern',
      severity: 'high',
      source: 'rules',
      message: 'Early refill concern present in monitoring summary.',
      explanation:
        'The encounter includes an early refill concern and may require clearer review, rationale, or additional follow-up documentation.'
    });
  }

  if (request.noteText.trim().length < 120) {
    flags.push({
      code: 'sparse_note',
      severity: 'moderate',
      source: 'rules',
      message: 'Encounter note is sparse for a controlled-substance review.',
      explanation:
        'Very limited note detail can make it harder to understand rationale, risk review, and follow-up planning.'
    });
  }

  return flags;
}

export function deriveRiskLevel(flags: ReviewFlag[]): RiskLevel {
  if (flags.some((flag) => flag.severity === 'high')) return 'high';
  if (flags.some((flag) => flag.severity === 'moderate')) return 'moderate';
  if (flags.length > 0) return 'low';
  return 'low';
}

export function runRuleReview(request: ReviewRequest) {
  const flags = evaluateRules(request);
  const missingDocumentation = findMissingDocumentation(request);
  const suggestedLanguage = buildSuggestedLanguage(missingDocumentation);
  const riskLevel = deriveRiskLevel(flags);

  return {
    flags,
    missingDocumentation,
    suggestedLanguage,
    riskLevel
  };
}
