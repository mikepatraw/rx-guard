import assert from 'node:assert/strict';
import { createRxGuardServer } from './server.js';

async function request(port: number, path: string, options: RequestInit = {}) {
  return fetch(`http://127.0.0.1:${port}${path}`, options);
}

async function withServer(test: (port: number) => Promise<void>) {
  const server = createRxGuardServer();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  try {
    await test(address.port);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error?: Error) => (error ? reject(error) : resolve()));
    });
  }
}

function assertSecurityHeaders(response: Response) {
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('content-security-policy'), "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
}

await withServer(async (port) => {
  const response = await request(port, '/health');
  assert.equal(response.status, 200);
  assertSecurityHeaders(response);
});

await withServer(async (port) => {
  const response = await request(port, '/missing');
  assert.equal(response.status, 404);
  assertSecurityHeaders(response);
});

await withServer(async (port) => {
  const oversizedBody = JSON.stringify({ note: 'x'.repeat(70_000) });
  const response = await request(port, '/review', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: oversizedBody
  });

  assert.equal(response.status, 413);
  assertSecurityHeaders(response);
  const body = await response.json() as { status: string; message: string };
  assert.equal(body.status, 'input_error');
  assert.match(body.message, /Request body too large/);
});

await withServer(async (port) => {
  const oversizedBody = JSON.stringify({ input: 'x'.repeat(70_000) });
  const response = await request(port, '/byo-a2a/invoke', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: oversizedBody
  });

  assert.equal(response.status, 413);
  assertSecurityHeaders(response);
  const body = await response.json() as { error: { code: string; message: string } };
  assert.equal(body.error.code, 'request_body_too_large');
  assert.match(body.error.message, /Request body too large/);
});

await withServer(async (port) => {
  const response = await request(port, '/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'lookup_patient_medication_context',
        arguments: {
          patient_key: 'RXG-SB-001',
          proposed_medication: 'Xanax 1 mg tablet'
        }
      }
    })
  });

  assert.equal(response.status, 200);
  assertSecurityHeaders(response);
  const body = await response.json() as { result: { content: [{ text: string }] } };
  const payload = JSON.parse(body.result.content[0].text) as { display_name: string; recommended_response: { recommendation: string } };
  assert.equal(payload.display_name, 'Sheila Bankston');
  assert.equal(payload.recommended_response.recommendation, 'do_not_prescribe');
});

console.log('local server hardening tests passed');
