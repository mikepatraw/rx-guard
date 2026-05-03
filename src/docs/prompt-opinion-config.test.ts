import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const systemPrompt = readFileSync('docs/product/PROMPT-OPINION-SYSTEM-PROMPT.md', 'utf8');
const byoConfig = readFileSync('docs/product/PROMPT-OPINION-BYO-AGENT-CONFIG.md', 'utf8');
const chatTestPrompt = readFileSync('docs/product/PROMPT-OPINION-CHAT-TEST-PROMPT.md', 'utf8');

assert.match(systemPrompt, /PDMP_DATABASE/);
assert.match(systemPrompt, /Case key for the demo patient: RXG-SB-001/);
assert.match(systemPrompt, /Sheila Bankston/);
assert.match(systemPrompt, /Alprazolam 1 mg/);
assert.match(systemPrompt, /Oxycodone 10 mg/);
assert.match(systemPrompt, /Do NOT output PDMP table rows/);
assert.match(systemPrompt, /Do NOT include a `pdmp_summary` array/);
assert.match(systemPrompt, /Output JSON ONLY/);
assert.doesNotMatch(systemPrompt, /call the RXGuard MCP tools/i);
assert.doesNotMatch(systemPrompt, /MCP is the only source/i);
assert.doesNotMatch(systemPrompt, /lookup_patient_medication_context/);

assert.match(byoConfig, /synthetic, de-identified `PDMP_DATABASE` directly/);
assert.match(byoConfig, /no MCP server is required/);
assert.match(byoConfig, /Keep \*\*Additional Tools \/ MCP Servers\*\* empty/);
assert.match(byoConfig, /Future production-style setup: move `PDMP_DATABASE` out of the System Prompt/);
assert.doesNotMatch(byoConfig, /MCP-only/i);
assert.doesNotMatch(byoConfig, /hosted RXGuard MCP server/i);
assert.doesNotMatch(byoConfig, /20 `generate_content` requests per day/);

assert.match(chatTestPrompt, /Synthetic patient key: RXG-SB-001/);
assert.match(chatTestPrompt, /Proposed medication: Xanax 1 mg tablet/);
assert.match(chatTestPrompt, /Patient-reported history: no recent narcotic or controlled-substance use/);
assert.match(chatTestPrompt, /pdmp_summary_status/);
assert.match(chatTestPrompt, /Do not include PDMP table rows/);
assert.doesNotMatch(chatTestPrompt, /MCP tools/i);
assert.doesNotMatch(chatTestPrompt, /lookup_patient_medication_context/);

console.log('prompt opinion config tests passed');
