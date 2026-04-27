import { normalizeReviewRequest } from '../fhir/normalize.js';
import { buildAiStyleInsights, buildNarrativeSummary } from '../engine/explanations.js';
import { mergeFlags } from '../engine/merge.js';
import { runPdmpReview } from '../engine/pdmp.js';
import { deriveRiskLevel, runRuleReview } from '../engine/rules.js';
import type { ReviewFlag, ReviewRequest, ReviewResponse } from '../types/review.js';

function buildContextAwareSuggestedLanguage(suggestions: string[], pdmpFlags: ReviewFlag[]): string[] {
  const hasPdmpConcern = pdmpFlags.some((flag) => flag.severity === 'moderate' || flag.severity === 'high');
  if (!hasPdmpConcern) return suggestions;

  return suggestions.map((line) => {
    if (!line.toLowerCase().includes('no unexpected recent controlled-substance fills')) return line;
    return 'Reviewed PDMP today; recent controlled-substance history requires verification and care coordination before finalizing the prescription.';
  });
}

export function reviewEncounter(request: ReviewRequest): ReviewResponse {
  const normalized = normalizeReviewRequest(request);
  const ruleResult = runRuleReview(normalized);
  const pdmpResult = runPdmpReview(normalized);
  const aiFlags = buildAiStyleInsights(normalized, ruleResult.flags, ruleResult.missingDocumentation);
  const flags = mergeFlags(mergeFlags(ruleResult.flags, pdmpResult.flags), aiFlags);
  const riskLevel = deriveRiskLevel(flags);
  const summary = buildNarrativeSummary(normalized, flags, ruleResult.missingDocumentation);
  const suggestedLanguage = buildContextAwareSuggestedLanguage(ruleResult.suggestedLanguage, pdmpResult.flags);

  return {
    status: 'review_complete',
    riskLevel,
    summary,
    flags,
    missingDocumentation: ruleResult.missingDocumentation,
    suggestedLanguage,
    pdmpCrossReference: pdmpResult.summary,
    metadata: {
      synthetic: true,
      version: 'mvp-hybrid-review',
      requestId: normalized.requestId,
      reviewMode: 'rules-plus-pdmp-crossref-plus-ai-style-explanations',
      timestamp: new Date().toISOString()
    }
  };
}
