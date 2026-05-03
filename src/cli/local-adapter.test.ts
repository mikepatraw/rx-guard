import assert from 'node:assert/strict';
import { buildLocalCliReview, parseCliArgs, renderCliReview } from './local-adapter.js';

const args = [
  '--name', 'Tamera164 Wisozk929',
  '--dob', '1980-02-03',
  '--medication', 'Xanax 1 mg tablet',
  '--directions', '1 tablet PO BID PRN for anxiety',
  '--history', 'no recent narcotic or controlled-substance use',
  '--note', 'PDMP review not yet documented'
];

const parsed = parseCliArgs(args);
assert.equal(parsed.name, 'Tamera164 Wisozk929');
assert.equal(parsed.dob, '1980-02-03');
assert.equal(parsed.medication, 'Xanax 1 mg tablet');
assert.equal(parsed.directions, '1 tablet PO BID PRN for anxiety');

const review = buildLocalCliReview(parsed);
assert.equal(review.syntheticPatientKey, 'RXG-TW-001');
assert.equal(review.promptOpinionPayload.synthetic_patient_key, 'RXG-TW-001');
assert.equal(review.promptOpinionPayload.proposed_medication, 'Xanax 1 mg tablet');
assert.equal(review.promptOpinionPayload.directions, '1 tablet PO BID PRN for anxiety');
assert.equal(review.promptOpinionPayload.patient_reported_history, 'no recent narcotic or controlled-substance use');
assert.equal(review.promptOpinionPayload.encounter_note, 'PDMP review not yet documented');
assert.equal(review.promptOpinionResponse.pdmp_summary_status, 'matched');
assert.equal(review.promptOpinionResponse.compliance_flag, 'PDMP review documentation');
assert.match(review.promptOpinionResponse.auto_note, /PDMP shows five controlled-substance fills/);
assert.ok(review.promptOpinionResponse.flags.some((flag) => flag.includes('4 distinct prescribers')));
assert.equal(review.rxGuardReview.riskLevel, 'high');
assert.equal(review.rxGuardReview.pdmpCrossReference?.matched, true);
assert.equal(review.pdmpRows.length, 5);
assert.deepEqual(Object.keys(review.promptOpinionPayload), [
  'synthetic_patient_key',
  'proposed_medication',
  'directions',
  'patient_reported_history',
  'encounter_note'
]);

const output = renderCliReview(review);
assert.match(output, /RX Guard Local CLI Adapter/);
assert.match(output, /Resolved synthetic key: RXG-TW-001/);
assert.match(output, /Prompt Opinion-safe payload/);
assert.match(output, /"synthetic_patient_key": "RXG-TW-001"/);
assert.doesNotMatch(output, /"name": "Tamera164 Wisozk929"/);
assert.doesNotMatch(output, /"dob": "1980-02-03"/);
assert.match(output, /PDMP rows rendered locally: 5/);
assert.match(output, /Risk: HIGH/);

assert.throws(
  () => buildLocalCliReview({ ...parsed, dob: '1970-01-01' }),
  /No local synthetic demo patient matched/
);

console.log('local CLI adapter tests passed');
