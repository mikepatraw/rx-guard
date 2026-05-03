import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const systemPrompt = readFileSync('docs/product/PROMPT-OPINION-SYSTEM-PROMPT.md', 'utf8');
const byoConfig = readFileSync('docs/product/PROMPT-OPINION-BYO-AGENT-CONFIG.md', 'utf8');
const chatTestPrompt = readFileSync('docs/product/PROMPT-OPINION-CHAT-TEST-PROMPT.md', 'utf8');

assert.match(systemPrompt, /call the RXGuard MCP tools/i);
assert.match(systemPrompt, /lookup_patient_medication_context/);
assert.match(systemPrompt, /lookup_medication/);
assert.match(systemPrompt, /get_demo_case/);
assert.match(systemPrompt, /FREE-TIER EXECUTION RULE/);
assert.match(systemPrompt, /make exactly one MCP data call: lookup_patient_medication_context/);
assert.match(systemPrompt, /Do not call FindPatientId/);
assert.match(systemPrompt, /MCP is the only source/i);
assert.doesNotMatch(systemPrompt, /PDMP_DATABASE/);
assert.doesNotMatch(systemPrompt, /"pdmp_summary"\s*:/);
assert.match(systemPrompt, /Do not include a `pdmp_summary` array/);

assert.match(byoConfig, /MCP-only/i);
assert.doesNotMatch(byoConfig, /currently includes the synthetic, de-identified `PDMP_DATABASE` directly/);
assert.doesNotMatch(byoConfig, /remove the embedded database from the live System Prompt/);
assert.match(byoConfig, /do not duplicate synthetic PDMP rows/i);
assert.match(byoConfig, /5 `generate_content` requests per minute/);
assert.match(byoConfig, /20 `generate_content` requests per day/);
assert.match(byoConfig, /daily quota reset/);
assert.match(byoConfig, /recommended Gemini free-tier setup/);

assert.match(chatTestPrompt, /MCP tools/i);
assert.match(chatTestPrompt, /pdmp_summary_status/);
assert.match(chatTestPrompt, /Ultra-short free-tier smoke prompt/);
assert.match(chatTestPrompt, /Use exactly one MCP data lookup: lookup_patient_medication_context/);
assert.doesNotMatch(chatTestPrompt, /pdmp_summary": \[/);

console.log('prompt opinion config tests passed');
