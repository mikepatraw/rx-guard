# Prompt Opinion BYO Agent Configuration

Use this guide as the single source of truth for configuring RX Guard in Prompt Opinion’s BYO Agent fields and driving an EHR-style controlled-substance review modal. Product-tone and demo calibration live in `docs/product/PROMPT-OPINION-CHAT-CALIBRATION.md`.

## Goal UI

Render a modal with patient/proposed medication, PDMP summary, history mismatch warning, clinical insights, risk score/level, top flags, recommendation, compliance flags, suggested documentation, and three workflow buttons:

- **Proceed**: continue prescription, move medication to pending/eRx, insert standard documentation.
- **Proceed with Caution**: continue prescription, move medication to pending/eRx, insert stronger risk/coordination documentation.
- **Do NOT Prescribe**: cancel medication order, insert rationale for not prescribing.

## Current PDMP database setup

The current Prompt Opinion setup does **not** have `PDMP_DATABASE` embedded in the System Prompt. The System Prompt references `PDMP_DATABASE`, so the synthetic database must be available somewhere else the agent can read it.

For the current hackathon/demo setup, use one of these paths:

1. **Preferred for now:** put the synthetic `PDMP_DATABASE` in the BYO Agent **Content** field or attached knowledge/content area, and keep the System Prompt focused on instructions.
2. **Acceptable fallback:** paste the synthetic `PDMP_DATABASE` at the end of the System Prompt only if Prompt Opinion does not reliably expose Content to the model during chat.
3. **Future production-style path:** move PDMP lookup and scoring into a deployed RX Guard API or MCP tool.

Keep the database synthetic and de-identified. Do not paste real patient data into System Prompt, Content, tools, screenshots, or demos.

## System Prompt

```text
You are RX Guard, a clinician-support prescribing safety review agent for controlled-substance workflows.

Review supplied synthetic or de-identified encounter context before a controlled-substance prescription is finalized. Combine patient-reported history, current medications, proposed medication, PDMP-style history, documentation status, and FHIR/SHARP context when available.

You do not make the prescribing decision. You provide structured risk review, top clinical concerns, documentation gaps, recommended workflow action, and chart-ready documentation language for clinician review.

Use conservative clinical language:
- Say "not documented" or "not detected in the supplied context" when information is absent.
- Do not accuse the patient or clinician of misuse, diversion, fraud, abuse, or wrongdoing unless directly evidenced.
- Do not invent facts, dates, prescribers, pharmacies, fills, diagnoses, allergies, PDMP results, or workflow effects.
- Do not write "no unexpected fills" or similar reassuring language when supplied PDMP data shows concerning fills, multiple prescribers/pharmacies, duplicate classes, or history mismatch.
- Distinguish patient-reported history from PDMP or medication-list evidence.
- Treat all output as clinician decision support.
```

## Consult Prompt

```text
Review this controlled-substance prescribing encounter as RX Guard.

Return an EHR-modal-ready JSON review with:
1. PDMP summary
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

```json
{
  "risk_score": 0,
  "risk_level": "low|moderate|high",
  "pdmp_summary": [
    {
      "medication": "string",
      "dose": "string",
      "fill_date": "MM/DD/YY",
      "qty": 0,
      "prescriber": "string",
      "pharmacy": "string"
    }
  ],
  "flags": ["max 3 short labels"],
  "recommendation": "one line",
  "compliance_flag": "string or null",
  "auto_note": "one or two short chart-ready sentences"
}
```

The UI can render this as the modal sections:

- `risk_score` / `risk_level` → Risk Assessment panel
- `pdmp_summary` → PDMP Summary table
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

Use the Content field for static RX Guard context that the agent must reference but that should not clutter the System Prompt.

```text
RX Guard is an A2A-enabled Prompt Opinion healthcare agent for controlled-substance prescribing safety review.

Primary use case: before a controlled-substance prescription is finalized, RX Guard reviews synthetic/de-identified encounter context, PDMP-style history, medication list, patient-reported history, and documentation status. It returns an EHR-style risk modal with key flags, risk score, recommendation, workflow actions, and chart-ready documentation.

Include the synthetic PDMP_DATABASE here if it is not embedded in the System Prompt and no external PDMP lookup tool is configured. The System Prompt can then refer to PDMP_DATABASE by name.
```

Content should contain only synthetic/de-identified demo data. If Prompt Opinion chat tests show the agent cannot access Content reliably, move the synthetic `PDMP_DATABASE` into the System Prompt as a temporary demo fallback.

## Tools

Prompt Opinion's **Additional Tools / MCP Servers** section is for attaching callable external tools to the agent. It is not where the synthetic PDMP database belongs when the database is supplied through the Content field or pasted into the System Prompt.

For the current hackathon/demo setup:

- Keep **Additional Tools / MCP Servers** empty unless the Prompt Opinion account has a deployed RX Guard API or MCP server ready to call.
- Put the synthetic `PDMP_DATABASE` in **Content** if the System Prompt only references it by name and no external tool exists.
- Do **not** configure a community MCP server just to hold the synthetic PDMP database.
- Leave default embedded/community tools enabled unless they introduce irrelevant citations, web lookups, or tool calls. If the agent starts using unrelated tools instead of the supplied synthetic PDMP data, disable default tools.

Future production-style setup: move `PDMP_DATABASE` out of Prompt Opinion prompt/content fields, then expose RX Guard service tools for exact PDMP lookup, deterministic risk scoring, and workflow-decision documentation. Until those tools exist, configuring no MCP servers is correct.

## Guardrails

Prompt Opinion guardrails validate or constrain the agent's behavior. They are separate from the System Prompt:

- The **System Prompt** tells RX Guard how to perform the clinical review.
- The **Response Format** tells RX Guard what JSON shape to return.
- The **Guardrail** checks whether the output is safe, valid, and on-policy.

Recommended guardrail type for this demo: **Agent** guardrail.

Use an Agent guardrail first because it can inspect the full response for JSON shape, prohibited language, and clinical-safety framing. HTTP or code-based guardrails are better later when a stable validator endpoint or code hook exists.

Recommended guardrail name:

```text
RX Guard JSON and Safety Validator
```

Recommended guardrail description:

```text
Validates that RX Guard returns JSON-only controlled-substance decision support, does not act as an autonomous prescriber, avoids stigmatizing language, and does not invent PDMP or patient facts.
```

Recommended validation instruction:

```text
Validate the assistant response for RX Guard.

Pass only if all conditions are true:
1. The response is valid JSON only, with no markdown fences, preamble, or trailing prose.
2. The JSON contains exactly these top-level keys: risk_score, risk_level, pdmp_summary, flags, recommendation, compliance_flag, auto_note.
3. risk_score is an integer from 0 to 100.
4. risk_level is one of: low, moderate, high.
5. pdmp_summary is an array of up to 5 entries with medication, dose, fill_date, qty, prescriber, and pharmacy.
6. flags has no more than 3 short labels.
7. recommendation is one line and does not claim to make the prescribing decision.
8. auto_note is neutral, chart-ready, and no more than two short sentences.
9. The response does not use stigmatizing or moralizing terms, including: abuser, addict, shopping, seeker, diversion.
10. The response does not invent PDMP fills, prescribers, pharmacies, dates, patient reports, or workflow actions not present in the prompt/database.
11. The response frames output as decision support for a human clinician, not an autonomous prescription approval or denial.

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

```text
Controlled-substance prescribing risk review. RX Guard accepts synthetic/de-identified encounter context, proposed medication details, PDMP-style history, and documentation status. It returns a structured EHR-modal-ready risk review with clinical insights, risk score, recommendation, compliance flags, suggested documentation, and workflow actions for Proceed, Proceed with Caution, and Do NOT Prescribe.
```

Suggested tags: `healthcare`, `prescribing-safety`, `controlled-substances`, `PDMP`, `FHIR`, `SHARP`, `A2A`, `clinician-support`, `documentation`.

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
