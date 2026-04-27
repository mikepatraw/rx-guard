import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('public/index.html', 'utf8');
const css = fs.readFileSync('public/styles.css', 'utf8');
const js = fs.readFileSync('public/app.js', 'utf8');

assert.match(html, /RXGuard – Controlled Substance Risk Analysis/);
assert.match(html, /BANKSTON, SHEILA/);
assert.match(html, /PDMP SUMMARY \(Last 90 Days\)/);
assert.match(html, /id="consultPrompt"/);
assert.match(html, /id="runAnalysisBtn"/);
assert.match(html, /id="proceedBtn"/);
assert.match(html, /id="cautionBtn"/);
assert.match(html, /id="doNotPrescribeBtn"/);

assert.match(css, /\.consult-panel/);
assert.match(css, /\.rx-modal/);
assert.match(css, /\.risk-score/);
assert.match(css, /\.btn-danger/);

assert.match(js, /insert_standard_documentation/);
assert.match(js, /insert_enhanced_risk_documentation/);
assert.match(js, /cancel_medication_order/);

const patientFixture = JSON.parse(fs.readFileSync('data/synthetic/case-04-pdmp-crossref-bankston.json', 'utf8'));
const expectedDob = patientFixture.patient.dob;
const expectedAge = String(patientFixture.patient.age);
const expectedUiDob = expectedDob.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3/$1');
assert.ok(html.includes(`F, ${expectedAge} Y, ${expectedUiDob}`));
assert.ok(html.includes(`DOB:</b> ${expectedUiDob} (${expectedAge})`));
assert.ok(js.includes('Synthetic patient key: RXG-SB-001'));
assert.ok(js.includes('pdmp_summary_status'));
assert.ok(js.includes('Do not return PDMP table rows'));
assert.doesNotMatch(js, /DOB:|06\/13\/1960|05\/12\/1984/);
assert.doesNotMatch(html, /05\/12\/1984|F, 42 Y/);

console.log('static UI asset tests passed');
