# RX Guard Prompt Opinion Chat Test Prompt

Use this exact prompt in Prompt Opinion chat with the published **RX Guard** agent selected.

Before testing: disable RXGuard's custom Agent guardrail unless Prompt Opinion clearly scopes it to assistant output only. A JSON-shape guardrail attached to the user-input path will reject this consult prompt before RXGuard can respond.

This version uses Prompt Opinion native patient context for chart/EHR facts when available. RXGuard contributes only a synthetic PDMP-style prescription-history overlay; do not paste a full invented patient or complete medical history into chat.

This version intentionally does **not** ask Prompt Opinion to return PDMP table rows. Live testing showed Prompt Opinion repeatedly transformed nested PDMP row objects into invalid repeated flat arrays. The Prompt Opinion agent should return risk/recommendation status; the RXGuard UI/local adapter owns table rendering for the synthetic overlay.

---

Review this controlled-substance prescribing encounter as RXGuard.

Use the current selected Prompt Opinion patient context if available.
Preferred test patient: Sheila Bankston selected in Prompt Opinion Patient scope.
PDMP overlay: resolve by current patient display name; expected mapping is PO_PATIENT_SHEILA_BANKSTON. The overlay name does not encode risk; calculate risk from prescription rows.
Proposed medication: Xanax 1 mg tablet
Directions: 1 tablet PO BID PRN for anxiety
Patient-reported history: no recent narcotic or controlled-substance use
Encounter note: PDMP review not yet documented

Return JSON only using exactly these top-level keys:
risk_score, risk_level, pdmp_summary_status, native_patient_context_status, flags, recommendation, compliance_flag, auto_note.

Do not include PDMP table rows.
Set pdmp_summary_status to "matched" if the synthetic PDMP overlay resolves.
Set native_patient_context_status to "used" only if Prompt Opinion native patient context was actually available; otherwise set it to "unavailable" and do not invent chart facts.
Do not make the prescribing decision. Provide clinician-support guidance only.
No markdown. No explanation.

---

Expected output shape:

```json
{
  "risk_score": 80,
  "risk_level": "high",
  "pdmp_summary_status": "matched",
  "native_patient_context_status": "used|unavailable",
  "flags": ["History mismatch", "Multiple prescribers (4 in 90d)", "Multiple pharmacies (4 in 90d)"],
  "recommendation": "Not recommended — verify with patient before prescribing",
  "compliance_flag": "PDMP review not documented",
  "auto_note": "Synthetic PDMP-style prescription history shows five recent controlled-substance fills involving multiple prescribers and pharmacies. Patient report of no recent controlled-substance use is inconsistent with the prescription-history overlay."
}
```

Expected high-level themes in a good response:
- the synthetic PDMP overlay resolves to matched
- native patient context is used if available, otherwise explicitly marked unavailable
- risk level and recommendation are derived from the prescription rows, patient report, documentation status, and native chart context
- multiple prescribers/pharmacies in the recent PDMP-style prescription history
- patient-reported history mismatch
- missing PDMP documentation
- chart-ready language that preserves clinician judgment
