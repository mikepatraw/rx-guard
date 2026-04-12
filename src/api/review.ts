import { runRuleReview } from '../engine/rules.js';
import { normalizeReviewRequest } from '../fhir/normalize.js';
import type { ReviewRequest, ReviewResponse } from '../types/review.js';

export function reviewEncounter(request: ReviewRequest): ReviewResponse {
  const normalized = normalizeReviewRequest(request);
  const result = runRuleReview(normalized);

  const summary =
    result.flags.length === 0 && result.missingDocumentation.length === 0
      ? 'No major rule-based concerns detected in this synthetic encounter review.'
      : `Rule-based review found ${result.flags.length} flag(s) and ${result.missingDocumentation.length} documentation gap(s) for clinician review.`;

  return {
    status: 'review_complete',
    riskLevel: result.riskLevel,
    summary,
    flags: result.flags,
    missingDocumentation: result.missingDocumentation,
    suggestedLanguage: result.suggestedLanguage,
    metadata: {
      synthetic: true,
      version: 'mvp-rules-only',
      requestId: normalized.requestId,
      reviewMode: 'rules-only',
      timestamp: new Date().toISOString()
    }
  };
}
