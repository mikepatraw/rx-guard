import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { invokeByoA2aAgent } from './byo-a2a.js';
import { reviewEncounter } from './review.js';
import { handleJsonRpcMessage } from '../mcp/medication-server.js';
import { normalizeReviewRequest } from '../fhir/normalize.js';
import type { ReviewRequest } from '../types/review.js';

const port = Number(process.env.PORT || 8787);
const maxRequestBodyBytes = 64 * 1024;

const securityHeaders = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'"
};

class RequestBodyTooLargeError extends Error {
  constructor() {
    super(`Request body too large; limit is ${maxRequestBodyBytes} bytes`);
  }
}

function writeJson(res: http.ServerResponse, statusCode: number, payload: unknown) {
  res.writeHead(statusCode, securityHeaders);
  res.end(JSON.stringify(payload, null, 2));
}

async function readJsonBody(req: http.IncomingMessage) {
  let body = '';
  let bytes = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.byteLength;
    if (bytes > maxRequestBodyBytes) {
      throw new RequestBodyTooLargeError();
    }
    body += buffer.toString('utf8');
  }

  return JSON.parse(body);
}

export function createRxGuardServer() {
  return http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
      writeJson(res, 200, { ok: true, service: 'rx-guard' });
      return;
    }

    if (req.method === 'POST' && req.url === '/review') {
      try {
        const parsed = await readJsonBody(req) as ReviewRequest;
        const normalized = normalizeReviewRequest(parsed);
        const result = reviewEncounter(normalized);

        writeJson(res, 200, result);
        return;
      } catch (error) {
        writeJson(res, error instanceof RequestBodyTooLargeError ? 413 : 400, {
          status: 'input_error',
          message: error instanceof Error ? error.message : 'Invalid request'
        });
        return;
      }
    }

    if (req.method === 'OPTIONS' && req.url === '/mcp') {
      res.writeHead(204, {
        ...securityHeaders,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end();
      return;
    }

    if (req.method === 'POST' && req.url === '/mcp') {
      try {
        const parsed = await readJsonBody(req) as unknown;
        const response = handleJsonRpcMessage(JSON.stringify(parsed));
        if (response === null) {
          writeJson(res, 202, { ok: true });
          return;
        }

        writeJson(res, 'error' in response ? 400 : 200, response);
        return;
      } catch (error) {
        writeJson(res, error instanceof RequestBodyTooLargeError ? 413 : 400, {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: error instanceof RequestBodyTooLargeError ? -32001 : -32700,
            message: error instanceof Error ? error.message : 'Invalid MCP request'
          }
        });
        return;
      }
    }

    if (req.method === 'POST' && req.url === '/byo-a2a/invoke') {
      try {
        const parsed = await readJsonBody(req) as Record<string, unknown>;
        const result = invokeByoA2aAgent(parsed as never);

        writeJson(res, result.ok ? 200 : 400, result);
        return;
      } catch (error) {
        writeJson(res, error instanceof RequestBodyTooLargeError ? 413 : 400, {
          ok: false,
          agent: {
            name: 'RX Guard',
            mode: 'byo-a2a-preview'
          },
          error: {
            code: error instanceof RequestBodyTooLargeError ? 'request_body_too_large' : 'invalid_json',
            message: error instanceof Error ? error.message : 'Invalid request body'
          }
        });
        return;
      }
    }

    writeJson(res, 404, { error: 'Not found' });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createRxGuardServer().listen(port, () => {
    console.log(`RX Guard server listening on http://localhost:${port}`);
  });
}
