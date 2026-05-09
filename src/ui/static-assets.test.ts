import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('public/index.html', 'utf8');
const css = fs.readFileSync('public/styles.css', 'utf8');
const js = fs.readFileSync('public/app.js', 'utf8');
const demoData = fs.readFileSync('public/demo-data.js', 'utf8');
const promptDoc = fs.readFileSync('docs/product/PROMPT-OPINION-SYSTEM-PROMPT.md', 'utf8');
const visibleUi = `${html}\n${js}`;

assert.match(html, /RXsignal EHR Demo/);
assert.match(html, /<span class="brand-mark">RXsignal<\/span> Controlled Substance Review/);
assert.match(html, /Status: PDMP automatically reviewed/);
assert.match(html, /WISOZK, TAMERA164/);
assert.match(html, /Visit Type:<\/b> Follow-up/);
assert.match(html, /Chief Concern:<\/b> Anxiety \/ medication request/);
assert.match(html, /Summary<\/span><span>Progress Note<\/span><span class="active">Medications<\/span><span>Orders<\/span><span>Documents<\/span>/);
assert.match(html, /PDMP SUMMARY \(Last 90 Days\)/);
assert.match(html, /id="addMedicationBtn"/);
assert.match(html, /id="medicationSearch"/);
assert.match(html, /Search medication/);
assert.match(html, /placeholder="Type medication"/);
assert.doesNotMatch(html, /id="medicationSearch"[^>]*value="Xanax"/);
assert.match(html, /id="selectXanaxBtn"/);
assert.match(html, /Xanax 0\.5 mg tablet/);
assert.match(html, /Xanax 1 mg tablet/);
assert.match(html, /Alprazolam 1 mg tablet/);
assert.match(html, /Lorazepam 1 mg tablet/);
assert.match(html, /Clonazepam 0\.5 mg tablet/);
assert.match(html, /Sertraline 50 mg daily/);
assert.match(html, /Ibuprofen 800 mg PRN/);
assert.match(html, /Lisinopril 10 mg daily/);
assert.match(html, /id="rerunRxsignalBtn"/);
assert.match(html, /Re-run <span class="brand-mark">RXsignal<\/span>/);
assert.match(html, /Selecting a controlled medication automatically triggers RXsignal/);
assert.match(html, /Instead of asking providers to run another tool, RXsignal is embedded directly into the prescribing workflow/);
assert.match(html, /id="ehrActionStatus"/);
assert.match(html, /id="insertedChartNote"/);
assert.match(html, /Chart Documentation Updated/);
assert.match(html, /RXsignal will insert the selected provider rationale/);
assert.match(html, /consult-overlay hidden/);
assert.doesNotMatch(html, /Patient lookup|Enter the prescription you want to review|Run RXsignal Analysis|Expected compact JSON|Prompt Opinion-safe payload|consultPrompt|jsonPreview|Open module/);
assert.doesNotMatch(html, /id="intakeForm"|id="patientName"|id="patientDob"|id="prescriptionMedication"|id="prescriptionDirections"|id="runAnalysisBtn"/);
assert.match(html, /id="proceedBtn"/);
assert.match(html, /Proceed to eRx/);
assert.match(html, /id="cautionBtn"/);
assert.match(html, /Proceed with Caution/);
assert.match(html, /id="doNotPrescribeBtn"/);
assert.match(html, /Do Not Prescribe/);
assert.match(html, /RXsignal does not prescribe independently/);
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
assert.match(css, /\.chart-doc-card/);
assert.match(css, /\.chart-doc-card\.active/);
assert.match(css, /\.inserted-note/);
assert.match(css, /\.brand-mark \{ font-variant-caps: all-small-caps/);

assert.match(js, /td\.dataset\.label = label/);
assert.match(js, /insert_standard_documentation/);
assert.match(js, /insert_enhanced_risk_documentation/);
assert.match(js, /cancel_medication_order/);
assert.match(js, /window\.RXSIGNAL_LOCAL_DEMO/);
assert.match(js, /renderDemo\(/);
assert.match(js, /RXsignal/);
assert.match(js, /eRx review step/);
assert.match(demoData, /RXG-TW-001/);
assert.match(demoData, /pdmp_summary_status/);
assert.match(demoData, /localPdmpRows/);

const expectedUiDob = '02/03/1980';
const expectedAge = '46';
assert.ok(html.includes(`F, ${expectedAge} Y, ${expectedUiDob}`));
assert.ok(html.includes('data-rx-field="patient-dob"'));
assert.ok(demoData.includes(`\"dobDisplay\": \"${expectedUiDob}\"`));
assert.ok(demoData.includes(`\"age\": ${expectedAge}`));
assert.ok(demoData.includes('"resolvedSyntheticKey": "RXG-TW-001"'));
assert.ok(js.includes('medicationResultButtons'));
assert.ok(js.includes('rerunRxsignalBtn'));
assert.ok(js.includes('showRerunAction'));
assert.ok(js.includes('ehrActionStatus'));
assert.ok(js.includes('insertedChartNote'));
assert.ok(js.includes('chartDocumentationCard'));
assert.ok(js.includes('addMedicationBtn'));
assert.ok(js.includes('showAnalysis'));
assert.match(js, /filterMedicationResults/);
assert.match(js, /medicationSearch\.addEventListener\('input', filterMedicationResults\)/);
assert.match(js, /queryTokens\.every/);
assert.match(js, /closeReviewOverlay/);
assert.match(js, /getElementById\('rxOverlay'\)\.classList\.add\('hidden'\)/);
assert.doesNotMatch(js, /patientName|patientDob|prescriptionMedication|prescriptionDirections|intakeForm|runAnalysisBtn/);
assert.doesNotMatch(js, /buildPromptText|jsonPreview|consultPrompt|Return JSON only|Do not return PDMP table rows/);
assert.doesNotMatch(js, /DOB:|05\/12\/1984/);
assert.doesNotMatch(html, /06\/13\/1960/);
assert.ok(!html.includes(['BANKSTON', ', SHEILA'].join('')));

assert.match(promptDoc, /Pronounce RXsignal as ‘R X signal,’ not ‘R Signal\.’/);
[
  ['Pre', 'SignRx'].join(''),
  ['RX', 'Guard'].join(''),
  ['RX', ' Guard'].join(''),
  ['Sheila', ' Bankston'].join(''),
  ['BANKSTON', ', SHEILA'].join(''),
  ['Auto', ' Send Rx'].join(''),
  ['RX', 'Signal'].join(''),
  ['R', 'Signal'].join('')
].forEach((staleName) => assert.ok(!visibleUi.includes(staleName), `visible UI should not include stale name: ${staleName}`));

console.log('static UI asset tests passed');
