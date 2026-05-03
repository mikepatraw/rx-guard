# RXGuard Medication MCP Server

RXGuard now has a local stdio MCP-compatible medication/context server for the deterministic synthetic database that previously lived only inside the Prompt Opinion system prompt.

This is intentionally **synthetic/demo-only**. It does not connect to real EHR, PDMP, Surescripts, RXNorm, pharmacy, billing, or patient systems.

## Architecture

```text
EHR medication selection
  -> RXGuard adapter/event
  -> RXGuard Medication MCP Server
  -> Prompt Opinion / RX Guard BYO Agent
  -> compact risk JSON
  -> RXGuard UI + chart documentation
```

Separation of responsibilities:

- **MCP server**: deterministic medication, synthetic patient-case, and synthetic PDMP-style lookup.
- **Prompt Opinion**: reasoning layer that converts retrieved context into compact decision support.
- **RXGuard UI**: EHR workflow renderer, provider actions, and chart documentation insertion.

## Local server command

Build and run the local stdio server:

```bash
npm run mcp:medication
```

The script compiles TypeScript and starts:

```bash
node dist/mcp/medication-server.js
```

For hosted/HTTP planning, the repo now exposes the same JSON-RPC tool contract through a Vercel-compatible function path:

```text
POST /api/mcp
```

The local Node server also exposes a development-only route:

```text
POST /mcp
```

`/api/mcp` is intended as the hosted transport boundary for the Prompt Opinion hosted MCP connection. A later deployment step can put this route behind HTTPS and attach it in Prompt Opinion's **Additional Tools / MCP Servers** UI.

The implementation lives in:

```text
src/mcp/medication-server.ts
src/mcp/synthetic-data.ts
src/mcp/medication-server.test.ts
```

## Tools

### `lookup_medication`

Looks up synthetic medication metadata by brand, generic, or display name.

Input:

```json
{
  "query": "Xanax"
}
```

Output includes:

```json
{
  "matched": true,
  "medication": {
    "canonical_name": "Xanax 1 mg tablet",
    "generic_name": "alprazolam",
    "controlled_substance": true,
    "dea_schedule": "C-IV",
    "class": "benzodiazepine",
    "risk_notes": [],
    "documentation_considerations": []
  }
}
```

### `lookup_patient_medication_context`

Looks up synthetic patient, medication, PDMP-style, risk-factor, and documentation context for a proposed prescribing event.

Input:

```json
{
  "patient_key": "RXG-SB-001",
  "proposed_medication": "Xanax 1 mg tablet"
}
```

Output includes:

```json
{
  "matched": true,
  "patient_key": "RXG-SB-001",
  "display_name": "Sheila Bankston",
  "pdmp_summary_status": "matched",
  "recent_controlled_substances": [],
  "risk_factors": [],
  "documentation_flags": [],
  "recommended_response": {
    "risk_score": 80,
    "risk_level": "high",
    "recommendation": "do_not_prescribe",
    "documentation": "nonprescribing_rationale"
  }
}
```

### `get_demo_case`

Returns the full synthetic demo case for a safe synthetic key.

Input:

```json
{
  "patient_key": "RXG-CW-002"
}
```

Current demo keys:

- `RXG-SB-001` — Sheila Bankston / Xanax / high risk / do not prescribe
- `RXG-CW-002` — Charlie Williams / Hydrocodone-APAP / moderate risk / proceed with caution
- `RXG-GK-003` — Grover Keeling / Oxycodone solution / pediatric dosing guardrails

## Local MCP smoke test

After `npm run build`, this line exercises the JSON-RPC MCP tool call path using the same `Content-Length` framing used by stdio MCP clients:

```bash
python3 - <<'PY'
import json, subprocess
msgs = [
  {"jsonrpc":"2.0","id":1,"method":"initialize","params":{}},
  {"jsonrpc":"2.0","method":"notifications/initialized","params":{}},
  {"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}},
  {"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"lookup_patient_medication_context","arguments":{"patient_key":"RXG-SB-001","proposed_medication":"Xanax 1 mg tablet"}}},
]
payload = ''.join('Content-Length: %d\\r\\n\\r\\n%s' % (len(json.dumps(m).encode()), json.dumps(m)) for m in msgs)
proc = subprocess.run(['node','dist/mcp/medication-server.js'], input=payload.encode(), stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, timeout=10)
print(proc.stdout.decode())
PY
```

The server also accepts newline-delimited JSON-RPC during simple terminal debugging, but stdio MCP clients should use framed messages.

Expected result:

- `initialize` returns server info for `rxguard-medication-mcp`, tool capability metadata, the exact Prompt Opinion FHIR context extension declaration at `capabilities.extensions["ai.promptopinion/fhir-context"]`, synthetic/demo-only FHIR metadata, and FHIR-style resource capability discovery
- `resources/list` returns a synthetic FHIR CapabilityStatement resource plus one synthetic Patient resource per demo case
- `resources/read` returns `application/fhir+json` content for the synthetic CapabilityStatement or patient resource
- `tools/list` returns the three tools above
- `tools/call` returns matched synthetic context for `RXG-SB-001`

## Prompt Opinion hosted MCP plan

For the final hosted Prompt Opinion path, deploy an HTTP/StreamableHTTP version of this same contract and connect it in Prompt Opinion's **Additional Tools / MCP Servers** area.

Recommended deployment steps:

1. Keep the local stdio server as the development/test source of truth.
2. Use the existing `/api/mcp` hosted JSON-RPC function as the hosted transport boundary.
3. Keep the exact Prompt Opinion FHIR context extension declaration in the `initialize` response so Prompt Opinion can recognize the server as healthcare/FHIR-capable. RXGuard requests no SMART scopes in the hackathon demo because it uses synthetic data and does not connect real FHIR, EHR, PDMP, or pharmacy systems.
4. Configure Prompt Opinion with the hosted MCP URL.
5. Use the MCP-only Prompt Opinion system prompt from `docs/product/PROMPT-OPINION-SYSTEM-PROMPT.md`.
6. Do not duplicate synthetic PDMP rows, patient records, FHIR resources, or fallback databases in Prompt Opinion System Prompt, Content, or Guardrails.
7. Record final evidence showing Prompt Opinion using the hosted MCP-backed lookup and RXGuard UI mapping the response into provider workflow.

Do **not** connect live patient, pharmacy, PDMP, or medication databases during the hackathon demo unless that scope is explicitly approved. The hosted MCP should expose only this synthetic dataset for submission.

## Prompt Opinion MCP-only system prompt direction

The live Prompt Opinion system prompt should say:

```text
When medication or synthetic PDMP context is needed, call the RXGuard MCP tools.
Use lookup_patient_medication_context for synthetic patient keys and proposed medications.
Use lookup_medication for medication metadata.
Do not invent PDMP records, medication metadata, patient details, or workflow actions.
Return compact JSON only for the RXGuard UI adapter.
```

Keep the compact response schema unchanged:

```json
{
  "risk_score": 0,
  "risk_level": "low|moderate|high",
  "pdmp_summary_status": "matched|not_found",
  "flags": ["max 3 short labels"],
  "recommendation": "one line",
  "compliance_flag": "string or null",
  "auto_note": "one or two short chart-ready sentences"
}
```
