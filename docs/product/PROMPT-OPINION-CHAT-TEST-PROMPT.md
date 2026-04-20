# RX Guard Prompt Opinion Chat Test Prompt

Use this exact prompt in Prompt Opinion chat with the published **RX Guard** agent selected.

---

Review this synthetic controlled-substance prescribing encounter and return:
1. a short risk summary
2. the top documentation gaps
3. the top contextual risk factors
4. suggested chart-ready language for the clinician
5. a brief note confirming this is clinician-support guidance, not an autonomous prescribing decision

Synthetic case data:

```json
{
  "requestId": "case-01",
  "synthetic": true,
  "patient": {
    "id": "patient-001",
    "age": 47,
    "sex": "female"
  },
  "encounter": {
    "id": "enc-001",
    "type": "follow-up",
    "date": "2026-04-10",
    "setting": "outpatient"
  },
  "conditions": [
    { "name": "chronic low back pain", "status": "active" },
    { "name": "anxiety", "status": "active" }
  ],
  "activeMedications": [
    {
      "name": "alprazolam",
      "dose": "0.5 mg",
      "sig": "take 1 tablet nightly as needed",
      "scheduleClass": "Schedule IV"
    }
  ],
  "allergies": [],
  "proposedMedication": {
    "name": "oxycodone",
    "dose": "5 mg",
    "quantity": 14,
    "durationDays": 7,
    "sig": "take 1 tablet every 6 hours as needed for pain",
    "scheduleClass": "Schedule II"
  },
  "monitoringSummary": {
    "pdmpReviewed": true,
    "pdmpDocumented": false,
    "udsAvailable": false,
    "earlyRefillConcern": false,
    "painAgreementOnFile": false
  },
  "riskIndicators": [
    "concurrent benzodiazepine"
  ],
  "noteText": "Patient returns for follow-up for chronic back pain. Reports pain is worse this week after increased lifting at work. Requests something stronger for the next few days. Exam notable for lumbar tenderness. Will prescribe oxycodone for pain control. Follow up if not improving.",
  "source": {
    "platform": "prompt-opinion-demo",
    "fhirContext": true
  }
}
```

---

Expected high-level themes in a good response:
- opioid + benzodiazepine overlap risk
- PDMP reviewed but not clearly documented
- missing functional goal / risk discussion / monitoring support
- chart-ready language that preserves clinician judgment
