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

console.log('static UI asset tests passed');
