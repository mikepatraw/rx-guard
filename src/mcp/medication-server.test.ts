import assert from 'node:assert/strict';
import {
  listRxGuardMcpTools,
  callRxGuardMcpTool,
  findPatientId,
  lookupMedication,
  lookupPatientMedicationContext,
  getDemoCase,
  handleJsonRpcMessage,
} from './medication-server.js';

const tools = listRxGuardMcpTools();
assert.deepEqual(
  tools.map((tool) => tool.name).sort(),
  ['FindPatientId', 'get_demo_case', 'lookup_medication', 'lookup_patient_medication_context']
);
assert.match(tools.find((tool) => tool.name === 'FindPatientId')?.description ?? '', /compatibility shim/i);

const xanax = lookupMedication({ query: 'Xanax' });
assert.equal(xanax.matched, true);
assert.equal(xanax.medication?.canonical_name, 'Xanax 1 mg tablet');
assert.equal(xanax.medication?.generic_name, 'alprazolam');
assert.equal(xanax.medication?.controlled_substance, true);
assert.equal(xanax.medication?.dea_schedule, 'C-IV');
assert.ok(xanax.medication?.risk_notes.includes('Avoid combining with opioids, alcohol, or sedating medications.'));

const unknownMedication = lookupMedication({ query: 'not-a-demo-medication' });
assert.equal(unknownMedication.matched, false);
assert.equal(unknownMedication.medication, null);
assert.match(unknownMedication.message, /not found/i);

const sheilaContext = lookupPatientMedicationContext({
  patient_key: 'RXG-SB-001',
  proposed_medication: 'Xanax 1 mg tablet',
});
assert.equal(sheilaContext.matched, true);
assert.equal(sheilaContext.patient_key, 'RXG-SB-001');
assert.equal(sheilaContext.medication?.generic_name, 'alprazolam');
assert.equal(sheilaContext.pdmp_summary_status, 'matched');
assert.equal(sheilaContext.recommended_response.risk_level, 'high');
assert.equal(sheilaContext.recommended_response.recommendation, 'do_not_prescribe');
assert.ok((sheilaContext.documentation_flags as string[]).includes('nonprescribing_rationale'));
assert.ok(sheilaContext.recent_controlled_substances.length >= 3);

const groverContext = lookupPatientMedicationContext({
  patient_key: 'RXG-GK-003',
  proposed_medication: 'Oxycodone oral solution 5 mg/5 mL',
});
assert.equal(groverContext.matched, true);
assert.equal(groverContext.recommended_response.documentation, 'pediatric_dosing_guardrails');
assert.ok((groverContext.risk_factors as string[]).includes('pediatric patient'));
assert.ok((groverContext.risk_factors as string[]).includes('weight-based dosing required'));

const unknownContext = lookupPatientMedicationContext({
  patient_key: 'RXG-UNKNOWN',
  proposed_medication: 'Xanax 1 mg tablet',
});
assert.equal(unknownContext.matched, false);
assert.equal(unknownContext.pdmp_summary_status, 'not_found');
assert.equal(unknownContext.recent_controlled_substances.length, 0);

const charlieCase = getDemoCase({ patient_key: 'RXG-CW-002' });
assert.equal(charlieCase.matched, true);
assert.equal(charlieCase.case?.display_name, 'Charlie Williams');
assert.match(charlieCase.case?.progress_note.hpi ?? '', /lower back pain/i);
assert.ok(charlieCase.case?.current_medications.some((med) => med.name.includes('Trazodone')));

const patientIdByName = findPatientId({ patientName: 'Sheila Bankston' });
assert.equal(patientIdByName.matched, true);
assert.equal(patientIdByName.patient_id, 'RXG-SB-001');

const patientIdByIdentifier = findPatientId({ identifier: 'RXG-CW-002' });
assert.equal(patientIdByIdentifier.matched, true);
assert.equal(patientIdByIdentifier.display_name, 'Charlie Williams');

const toolResult = callRxGuardMcpTool('lookup_patient_medication_context', {
  patient_key: 'RXG-GK-003',
  proposed_medication: 'Oxycodone oral solution 5 mg/5 mL',
});
assert.equal(toolResult.isError, false);
assert.equal(toolResult.content[0].type, 'text');
const parsedToolResult = JSON.parse(toolResult.content[0].text);
assert.equal(parsedToolResult.recommended_response.recommendation, 'proceed_with_caution');

const badToolResult = callRxGuardMcpTool('missing_tool', {});
assert.equal(badToolResult.isError, true);
assert.match(badToolResult.content[0].text, /Unknown RXGuard MCP tool/);

const compatibilityToolResult = callRxGuardMcpTool('FindPatientId', { name: 'Sheila Bankston' });
assert.equal(compatibilityToolResult.isError, false);
const parsedCompatibilityToolResult = JSON.parse(compatibilityToolResult.content[0].text);
assert.equal(parsedCompatibilityToolResult.patient_id, 'RXG-SB-001');

const initializeResponse = handleJsonRpcMessage(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} })) as {
  jsonrpc: string;
  id: number;
  result: {
    capabilities: {
      tools: Record<string, unknown>;
      resources: Record<string, unknown>;
      experimental: { fhir: { supported: boolean; fhirVersion: string }; promptOpinion: { fhirExtension: { supported: boolean } } };
    };
    _meta: { 'promptopinion.fhir': { supported: boolean } };
  };
};
assert.equal(initializeResponse.result.capabilities.experimental.fhir.supported, true);
assert.equal(initializeResponse.result.capabilities.experimental.fhir.fhirVersion, 'R4');
assert.equal(initializeResponse.result.capabilities.experimental.promptOpinion.fhirExtension.supported, true);
assert.equal(initializeResponse.result._meta['promptopinion.fhir'].supported, true);

const rpcResourceList = handleJsonRpcMessage(JSON.stringify({ jsonrpc: '2.0', id: 11, method: 'resources/list', params: {} })) as {
  result: { resources: Array<{ uri: string; mimeType: string }> };
};
assert.ok(rpcResourceList.result.resources.some((resource) => resource.uri === 'fhir://CapabilityStatement/rxguard-synthetic-demo'));
assert.ok(rpcResourceList.result.resources.some((resource) => resource.uri === 'fhir://Patient/RXG-SB-001'));
assert.ok(rpcResourceList.result.resources.every((resource) => resource.mimeType === 'application/fhir+json'));

const rpcResourceRead = handleJsonRpcMessage(
  JSON.stringify({ jsonrpc: '2.0', id: 12, method: 'resources/read', params: { uri: 'fhir://CapabilityStatement/rxguard-synthetic-demo' } })
) as unknown as { result: { contents: [{ text: string; mimeType: string }] } };
assert.equal(rpcResourceRead.result.contents[0].mimeType, 'application/fhir+json');
const capabilityStatement = JSON.parse(rpcResourceRead.result.contents[0].text) as { resourceType: string; fhirVersion: string };
assert.equal(capabilityStatement.resourceType, 'CapabilityStatement');
assert.equal(capabilityStatement.fhirVersion, '4.0.1');

const rpcToolList = handleJsonRpcMessage(JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })) as {
  jsonrpc: string;
  id: number;
  result: { tools: unknown[] };
};
assert.equal(rpcToolList.jsonrpc, '2.0');
assert.equal(rpcToolList.id, 2);
assert.equal(rpcToolList.result.tools.length, 4);

const rpcToolCall = handleJsonRpcMessage(
  JSON.stringify({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'lookup_medication',
      arguments: { query: 'hydrocodone/apap' },
    },
  })
) as {
  jsonrpc: string;
  id: number;
  result: { content: [{ type: string; text: string }] };
};
assert.equal(rpcToolCall.jsonrpc, '2.0');
assert.equal(rpcToolCall.id, 3);
assert.equal(rpcToolCall.result.content[0].type, 'text');
const parsedRpcToolCall = JSON.parse(rpcToolCall.result.content[0].text);
assert.equal(parsedRpcToolCall.medication.generic_name, 'hydrocodone bitartrate / acetaminophen');

console.log('rxguard mcp medication server tests passed');
