import { normalizeReviewRequest } from '../fhir/normalize.js';
import { buildAiStyleInsights, buildNarrativeSummary } from '../engine/explanations.js';
import { mergeFlags } from '../engine/merge.js';
import { runPdmpReview } from '../engine/pdmp.js';
import { deriveRiskLevel, runRuleReview } from '../engine/rules.js';
import type { ReviewRequest, ReviewResponse } from '../types/review.js';

export function reviewEncounter(request: ReviewRequest): ReviewResponse {
  const normalized = normalizeReviewRequest(request);
  const ruleResult = runRuleReview(normalized);
  const pdmpResult = runPdmpReview(normalized);
  const aiFlags = buildAiStyleInsights(normalized, ruleResult.flags, ruleResult.missingDocumentation);
  const flags = mergeFlags(mergeFlags(ruleResult.flags, pdmpResult.flags), aiFlags);
  const riskLevel = deriveRiskLevel(flags);
  const summary = buildNarrativeSummary(normalized, flags, ruleResult.missingDocumentation);

  return {
    status: 'review_complete',
    riskLevel,
    summary,
    flags,
    missingDocumentation: ruleResult.missingDocumentation,
    suggestedLanguage: ruleResult.suggestedLanguage,
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
