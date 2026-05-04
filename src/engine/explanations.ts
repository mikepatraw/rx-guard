import type { ReviewFlag, ReviewRequest } from '../types/review.js';

function listToPhrase(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export function buildNarrativeSummary(request: ReviewRequest, flags: ReviewFlag[], missingDocumentation: string[]): string {
  if (flags.length === 0 && missingDocumentation.length === 0) {
    return 'This synthetic encounter appears relatively well documented in the current rules-based review, with no major concerns detected.';
  }

  const highFlags = flags.filter((flag) => flag.severity === 'high').map((flag) => flag.message);
  const moderateFlags = flags.filter((flag) => flag.severity === 'moderate').map((flag) => flag.message);

  const parts: string[] = [];

  if (highFlags.length > 0) {
    parts.push(`High-priority concerns include ${listToPhrase(highFlags.map((item) => item.toLowerCase()))}.`);
  }

  if (moderateFlags.length > 0) {
    parts.push(`Additional review is warranted because ${listToPhrase(moderateFlags.map((item) => item.toLowerCase()))}.`);
  }

  if (missingDocumentation.length > 0) {
    parts.push(
      `Documentation gaps were also detected, including ${listToPhrase(missingDocumentation.map((item) => item.toLowerCase()))}.`
    );
  }

  const medication = request.proposedMedication.name;
  parts.push(`Overall, RXsignal recommends clinician review before finalizing the ${medication} prescribing decision.`);

  return parts.join(' ');
}

export function buildAiStyleInsights(request: ReviewRequest, flags: ReviewFlag[], missingDocumentation: string[]): ReviewFlag[] {
  const insights: ReviewFlag[] = [];
  const note = request.noteText.toLowerCase();

  const hasSupportiveGoalLanguage =
    note.includes('breakthrough pain') ||
    note.includes('short course') ||
    note.includes('return to work') ||
    note.includes('daily activities');

  if (missingDocumentation.includes('functional goal or treatment objective') && !hasSupportiveGoalLanguage) {
    insights.push({
      code: 'missing_functional_goal_context',
      severity: 'moderate',
      source: 'ai',
      message: 'The note does not clearly connect the prescription to a functional treatment goal.',
      explanation:
        'The narrative describes symptoms and a prescribing action, but it does not clearly state what short-term functional improvement the medication is intended to support.'
    });
  }

  if (!note.includes('discuss') && !note.includes('reviewed') && flags.length > 0) {
    insights.push({
      code: 'limited_risk_narrative',
      severity: 'moderate',
      source: 'ai',
      message: 'The note provides limited narrative evidence of risk review or mitigation planning.',
      explanation:
        'The encounter appears to involve prescribing risk, but the note contains little narrative showing how that risk was reviewed, discussed, or mitigated.'
    });
  }

  if (flags.length === 0 && missingDocumentation.length <= 1) {
    insights.push({
      code: 'balanced_case',
      severity: 'low',
      source: 'ai',
      message: 'This case appears relatively balanced in the current MVP review.',
      explanation:
        'The note includes enough supportive detail that the encounter does not stand out as highly concerning in the current synthetic review workflow.'
    });
  }

  return insights;
}
