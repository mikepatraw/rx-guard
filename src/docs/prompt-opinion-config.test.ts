import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const systemPrompt = readFileSync('docs/product/PROMPT-OPINION-SYSTEM-PROMPT.md', 'utf8');
const byoConfig = readFileSync('docs/product/PROMPT-OPINION-BYO-AGENT-CONFIG.md', 'utf8');
const chatTestPrompt = readFileSync('docs/product/PROMPT-OPINION-CHAT-TEST-PROMPT.md', 'utf8');

assert.match(systemPrompt, /Prompt Opinion native patient context/);
assert.match(systemPrompt, /GetPatientData\(resourceType: "Patient"\)/);
assert.match(systemPrompt, /MedicationStatement/);
assert.match(systemPrompt, /Condition/);
assert.match(systemPrompt, /AllergyIntolerance/);
assert.match(systemPrompt, /PDMP_PRESCRIPTION_HISTORY_OVERLAY/);
assert.match(systemPrompt, /PO_PATIENT_SHEILA_BANKSTON_HIGH_RISK/);
assert.match(systemPrompt, /PO_PATIENT_CHARLIE_WILLIAMS_MODERATE_RISK/);
assert.match(systemPrompt, /PO_PATIENT_GROVER_KEELING_LOW_RISK/);
assert.match(systemPrompt, /Alprazolam 1 mg/);
assert.match(systemPrompt, /Oxycodone 10 mg/);
assert.match(systemPrompt, /native_patient_context_status/);
assert.match(systemPrompt, /Do NOT output PDMP table rows/);
assert.match(systemPrompt, /Do NOT include a pdmp_summary array/);
assert.match(systemPrompt, /Output JSON ONLY/);
assert.doesNotMatch(systemPrompt, /PDMP_DATABASE/);
assert.match(systemPrompt, /Sheila Bankston/);
assert.match(systemPrompt, /Charlie Williams/);
assert.match(systemPrompt, /Grover Keeling/);
assert.doesNotMatch(systemPrompt, /RXG-SB-001/);
assert.doesNotMatch(systemPrompt, /call the RXGuard MCP tools/i);
assert.doesNotMatch(systemPrompt, /MCP is the only source/i);
assert.doesNotMatch(systemPrompt, /lookup_patient_medication_context/);

assert.match(byoConfig, /native FHIR-style patient context/);
assert.match(byoConfig, /PDMP_PRESCRIPTION_HISTORY_OVERLAY/);
assert.match(byoConfig, /do not attach RXGuard MCP/i);
assert.match(byoConfig, /Leave Prompt Opinion embedded patient tools enabled/);
assert.match(byoConfig, /native_patient_context_status/);
assert.match(byoConfig, /Controlled-Substance Safety Review/);
assert.match(byoConfig, /PDMP Documentation Gap Check/);
assert.match(byoConfig, /EHR Auto-Note Draft/);
assert.match(byoConfig, /Human-in-the-loop: never autonomous prescribing/);
assert.doesNotMatch(byoConfig, /synthetic, de-identified `PDMP_DATABASE` directly/);
assert.doesNotMatch(byoConfig, /MCP-only/i);
assert.doesNotMatch(byoConfig, /hosted RXGuard MCP server/i);
assert.doesNotMatch(byoConfig, /20 `generate_content` requests per day/);

assert.match(chatTestPrompt, /current selected Prompt Opinion patient context/);
assert.match(chatTestPrompt, /PO_PATIENT_SHEILA_BANKSTON_HIGH_RISK/);
assert.match(chatTestPrompt, /Proposed medication: Xanax 1 mg tablet/);
assert.match(chatTestPrompt, /Patient-reported history: no recent narcotic or controlled-substance use/);
assert.match(chatTestPrompt, /native_patient_context_status/);
assert.match(chatTestPrompt, /pdmp_summary_status/);
assert.match(chatTestPrompt, /Do not include PDMP table rows/);
assert.doesNotMatch(chatTestPrompt, /Synthetic patient key: RXG-SB-001/);
assert.doesNotMatch(chatTestPrompt, /MCP tools/i);
assert.doesNotMatch(chatTestPrompt, /lookup_patient_medication_context/);

console.log('prompt opinion config tests passed');
