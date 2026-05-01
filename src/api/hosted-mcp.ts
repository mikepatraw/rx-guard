import { handleJsonRpcMessage } from '../mcp/medication-server.js';

type HostedMcpRequest = {
  method?: string;
  body?: unknown;
};

type HostedMcpResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): HostedMcpResponse;
  json(payload: unknown): void;
  end(payload?: string): void;
};

const responseHeaders = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function handleHostedMcpRequest(req: HostedMcpRequest, res: HostedMcpResponse): Promise<void> {
  setHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32601,
        message: 'Method not allowed. RXGuard hosted MCP endpoint accepts POST JSON-RPC requests.',
      },
    });
    return;
  }

  try {
    const requestPayload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const response = handleJsonRpcMessage(JSON.stringify(requestPayload));

    if (response === null) {
      res.status(202).json({ ok: true });
      return;
    }

    res.status('error' in response ? 400 : 200).json(response);
  } catch (error) {
    res.status(400).json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: error instanceof Error ? error.message : 'Invalid RXGuard hosted MCP request.',
      },
    });
  }
}

function setHeaders(res: HostedMcpResponse): void {
  for (const [name, value] of Object.entries(responseHeaders)) {
    res.setHeader(name, value);
  }
}
