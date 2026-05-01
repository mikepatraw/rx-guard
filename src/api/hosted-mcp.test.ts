import assert from 'node:assert/strict';
import { handleHostedMcpRequest } from './hosted-mcp.js';

type MockRequest = {
  method?: string;
  body?: unknown;
};

type HeaderMap = Record<string, string>;

class MockResponse {
  statusCode = 200;
  headers: HeaderMap = {};
  body = '';

  setHeader(name: string, value: string) {
    this.headers[name.toLowerCase()] = value;
  }

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(payload: unknown) {
    this.body = JSON.stringify(payload);
    return this;
  }

  end(payload = '') {
    this.body = payload;
    return this;
  }
}

async function invoke(req: MockRequest) {
  const res = new MockResponse();
  await handleHostedMcpRequest(req, res);
  return res;
}

const optionsResponse = await invoke({ method: 'OPTIONS' });
assert.equal(optionsResponse.statusCode, 204);
assert.equal(optionsResponse.headers['access-control-allow-methods'], 'POST, OPTIONS');
assert.match(optionsResponse.headers['access-control-allow-headers'], /X-RXGuard-Demo-Key/);
assert.equal(optionsResponse.headers['x-content-type-options'], 'nosniff');

const listResponse = await invoke({
  method: 'POST',
  body: { jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} },
});
assert.equal(listResponse.statusCode, 200);
assert.equal(listResponse.headers['content-type'], 'application/json');
const listPayload = JSON.parse(listResponse.body) as { result: { tools: Array<{ name: string }> } };
assert.deepEqual(
  listPayload.result.tools.map((tool) => tool.name).sort(),
  ['get_demo_case', 'lookup_medication', 'lookup_patient_medication_context']
);

const callResponse = await invoke({
  method: 'POST',
  body: {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'lookup_patient_medication_context',
      arguments: {
        patient_key: 'RXG-SB-001',
        proposed_medication: 'Xanax 1 mg tablet',
      },
    },
  },
});
assert.equal(callResponse.statusCode, 200);
const callPayload = JSON.parse(callResponse.body) as { result: { content: [{ text: string }] } };
const contextPayload = JSON.parse(callPayload.result.content[0].text) as {
  display_name: string;
  recommended_response: { recommendation: string };
};
assert.equal(contextPayload.display_name, 'Sheila Bankston');
assert.equal(contextPayload.recommended_response.recommendation, 'do_not_prescribe');

const badMethodResponse = await invoke({ method: 'GET' });
assert.equal(badMethodResponse.statusCode, 405);
const badMethodPayload = JSON.parse(badMethodResponse.body) as { error: { code: number; message: string } };
assert.equal(badMethodPayload.error.code, -32601);
assert.match(badMethodPayload.error.message, /Method not allowed/);

console.log('hosted MCP handler tests passed');
