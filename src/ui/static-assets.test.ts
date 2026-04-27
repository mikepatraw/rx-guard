import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('public/index.html', 'utf8');
const css = fs.readFileSync('public/styles.css', 'utf8');
const js = fs.readFileSync('public/app.js', 'utf8');
const demoData = fs.readFileSync('public/demo-data.js', 'utf8');

assert.match(html, /RXGuard – Controlled Substance Risk Analysis/);
assert.match(html, /BANKSTON, SHEILA/);
assert.match(html, /PDMP SUMMARY \(Last 90 Days\)/);
assert.match(html, /Patient lookup/);
assert.match(html, /id="patientName"/);
assert.match(html, /id="patientDob"/);
assert.match(html, /id="prescriptionMedication"/);
assert.match(html, /id="prescriptionDirections"/);
assert.match(html, /id="runAnalysisBtn"/);
assert.doesNotMatch(html, /Expected compact JSON|Prompt Opinion-safe payload|consultPrompt|jsonPreview/);
assert.match(html, /id="proceedBtn"/);
assert.match(html, /id="cautionBtn"/);
assert.match(html, /id="doNotPrescribeBtn"/);
assert.match(html, /src="demo-data.js"/);
assert.ok(html.includes('data-rx-field="patient-name"'));
assert.ok(html.includes('data-rx-field="risk-score"'));
assert.ok(html.includes('data-rx-table="pdmp-rows"'));
assert.ok(html.includes('data-rx-list="flags"'));

assert.match(css, /\.intake-form/);
assert.match(css, /\.form-grid/);
assert.match(css, /\.form-field/);
assert.match(css, /\.btn-danger/);
assert.match(css, /@media \(max-width: 640px\)/);
assert.match(css, /\.consult-panel, \.rx-modal \{ width: 100%; min-height: 100dvh/);
assert.match(css, /\.analyze-btn \{ position: fixed; left: 0; right: 0; bottom: 0/);
assert.match(css, /\.modal-foot \{ position: fixed; left: 0; right: 0; bottom: 0/);

assert.match(css, /\.pdmp-table td::before \{ content: attr\(data-label\)/);
assert.match(js, /td\.dataset\.label = label/);
assert.match(js, /insert_standard_documentation/);
assert.match(js, /insert_enhanced_risk_documentation/);
assert.match(js, /cancel_medication_order/);
assert.match(js, /window\.RXGUARD_LOCAL_DEMO/);
assert.match(js, /renderDemo\(/);
assert.match(demoData, /RXG-SB-001/);
assert.match(demoData, /pdmp_summary_status/);
assert.match(demoData, /localPdmpRows/);

const patientFixture = JSON.parse(fs.readFileSync('data/synthetic/case-04-pdmp-crossref-bankston.json', 'utf8'));
const expectedDob = patientFixture.patient.dob;
const expectedAge = String(patientFixture.patient.age);
const expectedUiDob = expectedDob.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3/$1');
assert.ok(html.includes(`F, ${expectedAge} Y, ${expectedUiDob}`));
assert.ok(html.includes('data-rx-field="patient-dob"'));
assert.ok(demoData.includes(`\"dobDisplay\": \"${expectedUiDob}\"`));
assert.ok(demoData.includes(`\"age\": ${expectedAge}`));
assert.ok(demoData.includes('"resolvedSyntheticKey": "RXG-SB-001"'));
assert.ok(js.includes('patientName'));
assert.ok(js.includes('patientDob'));
assert.ok(js.includes('prescriptionMedication'));
assert.ok(js.includes('showAnalysis'));
assert.doesNotMatch(js, /buildPromptText|jsonPreview|consultPrompt|Return JSON only|Do not return PDMP table rows/);
assert.doesNotMatch(js, /DOB:|06\/13\/1960|05\/12\/1984/);
assert.doesNotMatch(html, /05\/12\/1984|F, 42 Y/);

console.log('static UI asset tests passed');
