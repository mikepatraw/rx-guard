# RX Guard Prompt Opinion Chat Test Prompt

Use this exact prompt in Prompt Opinion chat with the published **RX Guard** agent selected.

Before testing: disable RXGuard's custom Agent guardrail unless Prompt Opinion clearly scopes it to assistant output only. A JSON-shape guardrail attached to the user-input path will reject this consult prompt before RXGuard can respond.

This version intentionally uses a synthetic patient key instead of direct patient identifiers so Prompt Opinion guardrails do not treat the test input as real PHI.

---

Review this synthetic controlled-substance prescribing encounter as RXGuard.

Synthetic patient key: RXG-SB-001
Proposed medication: Xanax 1 mg tablet
Directions: 1 tablet PO BID PRN for anxiety
Patient-reported history: no recent narcotic or controlled-substance use
Encounter note: PDMP review not yet documented

Return JSON only using the configured RXGuard response schema:
- risk_score
- risk_level
- pdmp_summary
- flags
- recommendation
- compliance_flag
- auto_note

Do not make the prescribing decision. Provide clinician-support guidance only.

---

Expected high-level themes in a good response:
- the synthetic case key resolves to the high-risk demo PDMP record
- multiple prescribers/pharmacies in the recent PDMP-style history
- recent opioid and benzodiazepine controlled-substance history
- patient-reported history mismatch
- missing PDMP documentation
- chart-ready language that preserves clinician judgment
