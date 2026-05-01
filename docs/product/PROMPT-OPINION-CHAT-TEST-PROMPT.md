# RX Guard Prompt Opinion Chat Test Prompt

Use this exact prompt in Prompt Opinion chat with the published **RX Guard** agent selected and the RXGuard Medication Context MCP server attached.

Before testing: disable RXGuard's custom Agent guardrail unless Prompt Opinion clearly scopes it to assistant output only. A JSON-shape guardrail attached to the user-input path will reject this consult prompt before RXGuard can respond.

This version intentionally uses a synthetic patient key instead of direct patient identifiers so Prompt Opinion guardrails do not treat the test input as real PHI.

This version also intentionally does **not** ask Prompt Opinion to return PDMP table rows. The Prompt Opinion agent should call the RXGuard MCP tools, return risk/recommendation status, and leave table rendering to the RXGuard UI/local adapter.

---

Review this synthetic controlled-substance prescribing encounter as RXGuard.

Synthetic patient key: RXG-SB-001
Proposed medication: Xanax 1 mg tablet
Directions: 1 tablet PO BID PRN for anxiety
Patient-reported history: no recent narcotic or controlled-substance use
Encounter note: PDMP review not yet documented

Use the attached RXGuard MCP tools for patient, medication, and PDMP-style context. Do not use embedded or remembered patient/PDMP examples.

Return JSON only using exactly these top-level keys:
risk_score, risk_level, pdmp_summary_status, flags, recommendation, compliance_flag, auto_note.

Do not include PDMP table rows.
Do not include a pdmp_summary array.
Do not include quoted JSON strings.
Set pdmp_summary_status to "matched" if the MCP lookup resolves the synthetic case key.
Do not make the prescribing decision. Provide clinician-support guidance only.
No markdown. No explanation.

---

Expected output shape:

```json
{
  "risk_score": 80,
  "risk_level": "high",
  "pdmp_summary_status": "matched",
  "flags": ["History mismatch", "Multiple prescribers (4 in 90d)", "Multiple pharmacies (4 in 90d)"],
  "recommendation": "Not recommended — verify with patient before prescribing",
  "compliance_flag": "PDMP review not documented",
  "auto_note": "MCP-backed PDMP-style context shows recent controlled-substance fills involving multiple prescribers and pharmacies. Patient report of no recent controlled-substance use is inconsistent with the synthetic MCP record."
}
```

Expected high-level themes in a good response:
- the synthetic case key resolves through the RXGuard MCP server
- high risk or equivalent not-recommended recommendation
- multiple prescribers/pharmacies in the recent MCP-returned PDMP-style context
- patient-reported history mismatch
- missing PDMP documentation
- chart-ready language that preserves clinician judgment
