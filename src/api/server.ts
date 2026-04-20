import http from 'node:http';
import { invokeByoA2aAgent } from './byo-a2a.js';
import { reviewEncounter } from './review.js';
import { normalizeReviewRequest } from '../fhir/normalize.js';
import type { ReviewRequest } from '../types/review.js';

const port = Number(process.env.PORT || 8787);

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'rx-guard' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/review') {
    try {
      let body = '';
      for await (const chunk of req) body += chunk;
      const parsed = JSON.parse(body) as ReviewRequest;
      const normalized = normalizeReviewRequest(parsed);
      const result = reviewEncounter(normalized);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result, null, 2));
      return;
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          status: 'input_error',
          message: error instanceof Error ? error.message : 'Invalid request'
        })
      );
      return;
    }
  }

  if (req.method === 'POST' && req.url === '/byo-a2a/invoke') {
    try {
      let body = '';
      for await (const chunk of req) body += chunk;
      const parsed = JSON.parse(body) as Record<string, unknown>;
      const result = invokeByoA2aAgent(parsed as never);

      res.writeHead(result.ok ? 200 : 400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result, null, 2));
      return;
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          ok: false,
          agent: {
            name: 'RX Guard',
            mode: 'byo-a2a-preview'
          },
          error: {
            code: 'invalid_json',
            message: error instanceof Error ? error.message : 'Invalid request body'
          }
        })
      );
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(port, () => {
  console.log(`RX Guard server listening on http://localhost:${port}`);
});
