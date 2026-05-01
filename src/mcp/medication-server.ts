import process from 'node:process';
import { medications, demoCases } from './synthetic-data.js';

export type McpToolDescription = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

type ToolTextResult = {
  content: [{ type: 'text'; text: string }];
  isError?: boolean;
};

type MedicationLookupInput = {
  query?: unknown;
};

type PatientMedicationContextInput = {
  patient_key?: unknown;
  proposed_medication?: unknown;
};

type DemoCaseInput = {
  patient_key?: unknown;
};

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: {
    name?: string;
    arguments?: Record<string, unknown>;
  } & Record<string, unknown>;
};

export function listRxGuardMcpTools(): McpToolDescription[] {
  return [
    {
      name: 'lookup_medication',
      description:
        'Look up a synthetic RXGuard medication by brand, generic, or canonical display name. Returns deterministic medication metadata for Prompt Opinion reasoning.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Medication search text, such as Xanax or oxycodone.' },
        },
        required: ['query'],
        additionalProperties: false,
      },
    },
    {
      name: 'lookup_patient_medication_context',
      description:
        'Return synthetic patient, medication, PDMP-style, risk-factor, and documentation context for a proposed controlled-substance order.',
      inputSchema: {
        type: 'object',
        properties: {
          patient_key: { type: 'string', description: 'Synthetic RXGuard patient key, for example RXG-SB-001.' },
          proposed_medication: { type: 'string', description: 'Selected medication name from the EHR prescribing workflow.' },
        },
        required: ['patient_key', 'proposed_medication'],
        additionalProperties: false,
      },
    },
    {
      name: 'get_demo_case',
      description:
        'Return the full synthetic RXGuard demo case for one patient key. Contains no real PHI and is intended for demo/dev use only.',
      inputSchema: {
        type: 'object',
        properties: {
          patient_key: { type: 'string', description: 'Synthetic RXGuard patient key, for example RXG-CW-002.' },
        },
        required: ['patient_key'],
        additionalProperties: false,
      },
    },
  ];
}

export function lookupMedication(input: MedicationLookupInput) {
  const query = normalizeString(input.query);
  if (!query) {
    return {
      matched: false,
      medication: null,
      message: 'Medication query is required.',
    };
  }

  const medication = medications.find((candidate) =>
    [candidate.canonical_name, candidate.generic_name, ...candidate.aliases]
      .map((value) => value.toLowerCase())
      .some((value) => value.includes(query) || query.includes(value))
  );

  if (!medication) {
    return {
      matched: false,
      medication: null,
      message: `Medication not found in RXGuard synthetic medication database: ${query}`,
    };
  }

  return {
    matched: true,
    medication,
    message: 'Synthetic medication record matched.',
  };
}

export function lookupPatientMedicationContext(input: PatientMedicationContextInput) {
  const patientKey = normalizeString(input.patient_key).toUpperCase();
  const proposedMedication = normalizeString(input.proposed_medication);
  const demoCase = demoCases.find((candidate) => candidate.patient_key === patientKey);
  const medicationLookup = lookupMedication({ query: proposedMedication });

  if (!demoCase) {
    return {
      matched: false,
      patient_key: patientKey || null,
      medication: medicationLookup.medication,
      pdmp_summary_status: 'not_found',
      recent_controlled_substances: [],
      risk_factors: [],
      documentation_flags: [],
      recommended_response: {
        risk_score: 0,
        risk_level: 'low',
        recommendation: 'not_found',
        documentation: 'unavailable',
      },
      message: 'Synthetic patient key not found. Do not invent patient or PDMP facts.',
    };
  }

  return {
    matched: true,
    patient_key: demoCase.patient_key,
    display_name: demoCase.display_name,
    medication: medicationLookup.medication,
    pdmp_summary_status: demoCase.pdmp_summary_status,
    progress_note_summary: demoCase.progress_note.summary,
    recent_controlled_substances: demoCase.pdmp_records,
    risk_factors: demoCase.risk_factors,
    documentation_flags: demoCase.documentation_flags,
    recommended_response: demoCase.recommended_response,
    message: medicationLookup.matched
      ? 'Synthetic patient and medication context matched.'
      : 'Synthetic patient matched; proposed medication was not found in medication database.',
  };
}

export function getDemoCase(input: DemoCaseInput) {
  const patientKey = normalizeString(input.patient_key).toUpperCase();
  const demoCase = demoCases.find((candidate) => candidate.patient_key === patientKey);

  if (!demoCase) {
    return {
      matched: false,
      case: null,
      message: 'Synthetic RXGuard demo case not found. Do not invent patient details.',
    };
  }

  return {
    matched: true,
    case: demoCase,
    message: 'Synthetic RXGuard demo case matched.',
  };
}

export function callRxGuardMcpTool(name: string, args: Record<string, unknown> = {}): ToolTextResult {
  try {
    let payload: unknown;
    if (name === 'lookup_medication') {
      payload = lookupMedication(args);
    } else if (name === 'lookup_patient_medication_context') {
      payload = lookupPatientMedicationContext(args);
    } else if (name === 'get_demo_case') {
      payload = getDemoCase(args);
    } else {
      return textResult(`Unknown RXGuard MCP tool: ${name}`, true);
    }

    return textResult(JSON.stringify(payload, null, 2));
  } catch (error) {
    return textResult(error instanceof Error ? error.message : 'Unknown MCP tool error', true);
  }
}

function textResult(text: string, isError = false): ToolTextResult {
  return {
    content: [{ type: 'text', text }],
    isError,
  };
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

async function runStdioServer(): Promise<void> {
  process.stdin.setEncoding('utf8');
  let buffer = '';
  let framedMode = false;

  for await (const chunk of process.stdin) {
    buffer += chunk;
    if (buffer.startsWith('Content-Length:')) framedMode = true;

    if (framedMode) {
      const parsed = drainFramedMessages(buffer);
      buffer = parsed.remaining;
      for (const message of parsed.messages) {
        const response = handleJsonRpcMessage(message);
        if (response) writeFramedResponse(response);
      }
    } else {
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.trim()) continue;
        const response = handleJsonRpcMessage(line);
        if (response) process.stdout.write(`${JSON.stringify(response)}\n`);
      }
    }
  }
}

function drainFramedMessages(buffer: string): { messages: string[]; remaining: string } {
  const messages: string[] = [];
  let remaining = buffer;

  while (true) {
    const headerEnd = remaining.indexOf('\r\n\r\n');
    if (headerEnd === -1) break;

    const header = remaining.slice(0, headerEnd);
    const lengthMatch = /^Content-Length: (\d+)$/im.exec(header);
    if (!lengthMatch) break;

    const contentLength = Number(lengthMatch[1]);
    const bodyStart = headerEnd + 4;
    const bodyEnd = bodyStart + contentLength;
    if (remaining.length < bodyEnd) break;

    messages.push(remaining.slice(bodyStart, bodyEnd));
    remaining = remaining.slice(bodyEnd);
  }

  return { messages, remaining };
}

function writeFramedResponse(response: unknown): void {
  const body = JSON.stringify(response);
  process.stdout.write(`Content-Length: ${Buffer.byteLength(body, 'utf8')}\r\n\r\n${body}`);
}

export function handleJsonRpcMessage(message: string) {
  let request: JsonRpcRequest;
  try {
    request = JSON.parse(message) as JsonRpcRequest;
  } catch {
    return jsonRpcError(null, -32700, 'Parse error');
  }

  if (request.method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id: request.id ?? null,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'rxguard-medication-mcp', version: '0.1.0' },
      },
    };
  }

  if (request.method === 'notifications/initialized') {
    return null;
  }

  if (request.method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id: request.id ?? null,
      result: { tools: listRxGuardMcpTools() },
    };
  }

  if (request.method === 'tools/call') {
    const toolName = request.params?.name;
    if (!toolName) return jsonRpcError(request.id ?? null, -32602, 'Missing tool name');
    return {
      jsonrpc: '2.0',
      id: request.id ?? null,
      result: callRxGuardMcpTool(toolName, request.params?.arguments ?? {}),
    };
  }

  return jsonRpcError(request.id ?? null, -32601, `Method not found: ${request.method ?? 'unknown'}`);
}

function jsonRpcError(id: JsonRpcRequest['id'], code: number, message: string) {
  return {
    jsonrpc: '2.0',
    id,
    error: { code, message },
  };
}

const invokedPath = process.argv[1] ? new URL(`file://${process.argv[1]}`).href : '';
if (import.meta.url === invokedPath) {
  runStdioServer().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  });
}
