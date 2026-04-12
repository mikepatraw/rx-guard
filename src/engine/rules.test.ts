import assert from 'node:assert/strict';
import fs from 'node:fs';
import { reviewEncounter } from '../api/review.js';
import { normalizeReviewRequest } from '../fhir/normalize.js';
import type { ReviewRequest } from '../types/review.js';

function loadCase(path: string): ReviewRequest {
  return JSON.parse(fs.readFileSync(path, 'utf8')) as ReviewRequest;
}

const case1 = normalizeReviewRequest(loadCase('data/synthetic/case-01-opioid-benzo-overlap.json'));
const result1 = reviewEncounter(case1);
assert.equal(result1.riskLevel, 'high');
assert.ok(result1.flags.some((flag) => flag.code === 'opioid_benzo_overlap'));
assert.ok(result1.flags.some((flag) => flag.code === 'missing_functional_goal_context'));

const case3 = normalizeReviewRequest(loadCase('data/synthetic/case-03-lower-risk-balanced.json'));
const result3 = reviewEncounter(case3);
assert.ok(['low', 'moderate'].includes(result3.riskLevel));
assert.ok(result3.flags.some((flag) => flag.code === 'balanced_case'));
assert.ok(!result3.flags.some((flag) => flag.code === 'missing_functional_goal_context'));

console.log('hybrid review tests passed');
