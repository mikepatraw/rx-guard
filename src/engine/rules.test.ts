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

const case4 = normalizeReviewRequest(loadCase('data/synthetic/case-04-pdmp-crossref-bankston.json'));
const result4 = reviewEncounter(case4);
assert.equal(result4.riskLevel, 'high');
assert.equal(result4.pdmpCrossReference?.matched, true);
assert.ok(result4.flags.some((flag) => flag.code === 'pdmp_multi_prescriber_pattern'));
assert.ok(
  !result4.suggestedLanguage.some((line) => line.toLowerCase().includes('no unexpected recent controlled-substance fills')),
  'high-risk PDMP matches must not receive reassuring no-unexpected-fills documentation'
);

const requestSchema = JSON.parse(fs.readFileSync('agent/schemas/request.schema.json', 'utf8'));
assert.ok(requestSchema.properties.patient.properties.name, 'request schema should allow patient.name for PDMP matching');
assert.ok(requestSchema.properties.patient.properties.dob, 'request schema should allow patient.dob for PDMP matching');

const responseSchema = JSON.parse(fs.readFileSync('agent/schemas/response.schema.json', 'utf8'));
assert.ok(responseSchema.properties.pdmpCrossReference, 'response schema should include pdmpCrossReference');

console.log('hybrid review tests passed');
