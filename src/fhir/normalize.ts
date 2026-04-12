import type { ReviewRequest } from '../types/review.js';

function asArray<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export function normalizeReviewRequest(input: ReviewRequest): ReviewRequest {
  return {
    ...input,
    conditions: asArray(input.conditions),
    activeMedications: asArray(input.activeMedications),
    allergies: asArray(input.allergies),
    riskIndicators: asArray(input.riskIndicators),
    noteText: input.noteText.trim()
  };
}
