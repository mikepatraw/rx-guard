# Prompt Opinion BYO Agent Configuration

Use this guide as the single source of truth for configuring PreSignRx in Prompt Opinion’s BYO Agent fields and driving an EHR-style controlled-substance review modal. Product-tone and demo calibration live in `docs/product/PROMPT-OPINION-CHAT-CALIBRATION.md`.

## Goal UI

Render a modal with patient/proposed medication, PDMP summary, history mismatch warning, clinical insights, risk score/level, top flags, recommendation, compliance flags, suggested documentation, and three workflow buttons:

- **Proceed**: continue prescription, move medication to pending/eRx, insert standard documentation.
- **Proceed with Caution**: continue prescription, move medication to pending/eRx, insert stronger risk/coordination documentation.
- **Do NOT Prescribe**: cancel medication order, insert rationale for not prescribing.

## System Prompt

Use the full copy-paste prompt in:

- `docs/product/PROMPT-OPINION-SYSTEM-PROMPT.md`

That System Prompt uses Prompt Opinion native patient context for chart/EHR facts when available, then adds a synthetic, de-identified `PDMP_PRESCRIPTION_HISTORY_OVERLAY` containing prescription history only. The overlay is keyed to existing Prompt Opinion patient display names for the demo (`Tamera164 Wisozk929`, `Lincoln623 Bednar518`, `Grover Keeling`) so the review can combine native patient context and RXGuard PDMP-style fills. Overlay names do not encode risk; the agent determines risk level from prescription rows, clinician prompt, and native chart context. Do not invent full synthetic patients, demographics, diagnoses, labs, allergies, or entire medical histories in the RX Guard prompt.

Keep the prescription-history overlay synthetic and de-identified. Do not paste real patient data into System Prompt, Content, tools, screenshots, or demos.

## Consult Prompt

```text
Review this controlled-substance prescribing encounter as PreSignRx.

Return an EHR-modal-ready JSON review with:
1. native patient context status (`used` when Prompt Opinion chart context is available, otherwise `unavailable`)
2. history mismatch warning if patient-reported history conflicts with PDMP or medication data
3. clinical insights as short flags
4. risk score from 0 to 100
5. risk level: low, moderate, or high
6. max 3 highest-impact flags
7. one-line recommendation using the HIGH/MODERATE/LOW templates
8. compliance flag for missing PDMP documentation
9. one or two short chart-ready auto_note sentences

The external UI maps risk level and recommendation to the Proceed / Proceed with Caution / Do NOT Prescribe buttons. The model should not claim it clicked buttons, moved a medication to eRx, inserted documentation, or canceled an order.

Use only facts in the supplied case. If a field is missing, mark it unavailable rather than guessing.
```

## Response Format

For the current Prompt Opinion chat/BYO-agent setup, keep the agent output compact and strict. The EHR-style UI should render this JSON and map the recommendation to buttons. Do **not** require the LLM to perform the button action itself.

Live testing showed Prompt Opinion repeatedly failed nested `pdmp_summary` arrays by returning quoted JSON strings, repeated duplicate keys, or flat key/value arrays. For the demo chat path, do **not** ask Prompt Opinion to return PDMP table rows. Use `pdmp_summary_status` and let the PreSignRx UI/local adapter render the table from deterministic synthetic case data.

```json
{
  "risk_score": 0,
  "risk_level": "low|moderate|high",
  "pdmp_summary_status": "matched|not_found",
  "native_patient_context_status": "used|unavailable",
  "flags": ["max 3 short labels"],
  "recommendation": "one line",
  "compliance_flag": "string or null",
  "auto_note": "one or two short chart-ready sentences"
}
```

The UI can render this as the modal sections:

- `risk_score` / `risk_level` → Risk Assessment panel
- `native_patient_context_status` → whether Prompt Opinion native FHIR-style patient context was used
- `pdmp_summary_status` → whether to render the local synthetic PDMP Summary table
- `flags` → Key Flags / Clinical Insights
- `recommendation` → Recommendation panel
- `compliance_flag` → Compliance Flag panel
- `auto_note` → Suggested Documentation box

Recommended workflow mapping:

| Recommendation/risk | Default button emphasis | Medication action | Documentation action |
| --- | --- | --- | --- |
| Low / reasonable to proceed | Proceed | Continue prescription and move medication to pending/eRx. | Insert standard PDMP/risk review documentation from `auto_note`. |
| Moderate / proceed with caution | Proceed with Caution | Continue prescription and move medication to pending/eRx. | Insert stronger documentation covering rationale, monitoring, and follow-up. |
| High / not recommended | Do NOT Prescribe | Cancel/stop medication order unless clinician overrides. | Insert non-prescribing rationale from `auto_note`; document verification/care-coordination plan. |

If the UI needs explicit button metadata, add it in the UI adapter layer rather than the Prompt Opinion response schema.

## Content

Use the Content field only for short product context. Do not put the prescription-history overlay here for the current demo; it belongs in the System Prompt file above.

```text
PreSignRx is an A2A-enabled Prompt Opinion healthcare agent for controlled-substance prescribing safety review.

Primary use case: before a controlled-substance prescription is finalized, PreSignRx reviews Prompt Opinion native FHIR-style patient context when available, patient-reported history, documentation status, and a synthetic PDMP-style prescription-history overlay. It returns strict JSON for an EHR-style risk modal with key flags, risk score, recommendation, workflow actions, and chart-ready documentation.
```

## Tools

Prompt Opinion's **Additional Tools / MCP Servers** section is for attaching callable external tools to the agent. For the current demo, do not attach PreSignRx MCP. Use the selected Prompt Opinion Patient/Data Scope already present in the chat for chart data when available, and keep RXGuard's PDMP/prescription-history overlay in the System Prompt.

For the current hackathon/demo setup:

- Keep **Additional Tools / MCP Servers** empty so PreSignRx remains a Prompt Opinion A2A/BYO agent, not an MCP Superpower submission.
- Do not rely on patient search or patient-ID lookup during the live demo. If Prompt Opinion surfaces a `FindPatientId` failure, stop that path instead of retrying; repeated retries can spend the Gemini/free-tier quota before PreSignRx returns JSON.
- Leave selected Prompt Opinion Patient/Data Scope context available so the agent can use native FHIR-style chart context without resolving a patient ID itself.
- Do **not** configure a community MCP server just to hold the synthetic PDMP prescription-history overlay.
- If selected patient context is unavailable in a chat/session, the agent should continue with `native_patient_context_status: "unavailable"` and avoid inventing chart facts.

Future production-style setup: move the PDMP overlay out of the System Prompt and expose a production PDMP/EHR integration through approved APIs/tools. Until those tools exist, configuring no PreSignRx MCP server is correct for the final A2A demo.

## Guardrails

Prompt Opinion guardrails validate or constrain the agent's behavior. They are separate from the System Prompt:

- The **System Prompt** tells PreSignRx how to perform the clinical review.
- The **Response Format** tells PreSignRx what JSON shape to return.
- The **Guardrail** checks whether the output is safe, valid, and on-policy.

Recommended guardrail setup for this demo: **leave custom guardrails disabled during live chat testing unless Prompt Opinion lets you scope the guardrail to assistant output only**.

Important platform behavior discovered during testing: Prompt Opinion may run the Agent guardrail against the **user's chat prompt** before PreSignRx responds. If the JSON validator below is attached in that mode, a normal consult prompt such as `Synthetic patient key: RXG-SB-001 ...` fails before the agent can answer because the user prompt is not the final JSON response. If this happens, remove/disable the custom guardrail for the demo and rely on the System Prompt + Response Format instead.

Use the Agent guardrail below only when it can inspect the assistant response after generation, because it validates the final JSON shape, prohibited language, and clinical-safety framing. HTTP or code-based guardrails are better later when a stable validator endpoint or code hook exists.

Recommended guardrail name:

```text
PreSignRx JSON and Safety Validator
```

Recommended guardrail description:

```text
Validates that PreSignRx returns JSON-only controlled-substance decision support, does not act as an autonomous prescriber, avoids stigmatizing language, and does not invent PDMP or patient facts.
```

Recommended validation instruction:

```text
Validate the assistant response for PreSignRx.

Pass only if all conditions are true:
1. The response is valid JSON only, with no markdown fences, preamble, or trailing prose.
2. The JSON contains exactly these top-level keys: risk_score, risk_level, pdmp_summary_status, native_patient_context_status, flags, recommendation, compliance_flag, auto_note.
3. risk_score is an integer from 0 to 100.
4. risk_level is one of: low, moderate, high.
5. pdmp_summary_status is one of: matched, not_found.
6. The response does not include a pdmp_summary array or PDMP table rows.
7. flags has no more than 3 short labels.
8. recommendation is one line and does not claim to make the prescribing decision.
9. auto_note is neutral, chart-ready, and no more than two short sentences.
10. The response does not use stigmatizing or moralizing terms, including: abuser, addict, shopping, seeker, diversion.
11. The response does not invent PDMP fills, prescribers, pharmacies, dates, patient reports, or workflow actions not present in the prompt/database.
12. The response frames output as decision support for a human clinician, not an autonomous prescription approval or denial.

If any condition fails, fail the guardrail and request a corrected JSON-only response.
```

Keep these core System Prompt guardrails as well:

```text
- Synthetic or de-identified data only.
- Do not expose, request, or retain real PHI in the demo.
- Do not make autonomous prescribing decisions.
- Do not invent PDMP records or patient history.
- Do not accuse the patient or clinician of misconduct.
- Keep recommendations framed as clinician-support guidance.
- If high risk, recommend verification and care coordination before prescribing.
```

## A2A & Skills

Use this marketplace description:

```text
Controlled-substance pre-sign safety agent for Prompt Opinion patient-context reviews. Uses native FHIR-style chart context when available, checks patient-reported history against synthetic PDMP-style prescription-history overlays, flags documentation gaps and contextual risk factors, and returns EHR-ready JSON with risk score, recommendation, compliance flag, and chart-ready auto-note. Human-in-the-loop: never autonomous prescribing.
```

Publish these skills so the marketplace listing reads as clinician workflow capability instead of implementation plumbing:

### Controlled-Substance Safety Review

```text
Reviews controlled-substance prescribing encounters before signing. Combines Prompt Opinion native FHIR-style patient context when available, proposed medication, patient-reported history, synthetic PDMP-style prescription-history overlay, and documentation status to return risk_score, risk_level, flags, recommendation, compliance_flag, native_patient_context_status, and auto_note.
```

### PDMP Documentation Gap Check

```text
Identifies absent PDMP review documentation and patient-history mismatches. Highlights recent synthetic controlled-substance fills, multi-prescriber or multi-pharmacy patterns, and chart-ready compliance language for clinician review while leaving native chart context to Prompt Opinion.
```

### EHR Auto-Note Draft

```text
Drafts concise, neutral, chart-ready documentation for the selected prescribing safety posture. Supports Proceed, Proceed with Caution, and Do NOT Prescribe workflows without claiming to execute EHR side effects.
```

Suggested tags: `healthcare`, `prescribing-safety`, `controlled-substances`, `PDMP`, `A2A`, `clinician-support`, `documentation`, `EHR-workflow`.

## Button workflow contract

| Button | Medication order action | Documentation action |
| --- | --- | --- |
| Proceed | Continue prescription and move medication to pending/eRx. | Insert standard PDMP/risk review documentation. |
| Proceed with Caution | Continue prescription and move medication to pending/eRx. | Insert stronger documentation covering risks, mismatch, counseling, verification, and follow-up. |
| Do NOT Prescribe | Cancel/stop medication order. | Insert documentation explaining risk rationale, verification need, and care-coordination plan. |

Recommended event payload:

```json
{
  "decision": "proceed|proceed_with_caution|do_not_prescribe",
  "requestId": "rxg-...",
  "selectedDocumentation": "string",
  "ehrActions": ["string"]
}
```
