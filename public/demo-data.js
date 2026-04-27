window.RXGUARD_LOCAL_DEMO = {
  "generatedFrom": "src/cli/local-adapter.ts",
  "demoInput": {
    "name": "Sheila Bankston",
    "dob": "1960-06-13",
    "medication": "Xanax 1 mg tablet",
    "directions": "1 tablet PO BID PRN for anxiety",
    "history": "no recent narcotic or controlled-substance use",
    "note": "PDMP review not yet documented"
  },
  "resolvedSyntheticKey": "RXG-SB-001",
  "promptOpinionPayload": {
    "synthetic_patient_key": "RXG-SB-001",
    "proposed_medication": "Xanax 1 mg tablet",
    "directions": "1 tablet PO BID PRN for anxiety",
    "patient_reported_history": "no recent narcotic or controlled-substance use",
    "encounter_note": "PDMP review not yet documented"
  },
  "promptOpinionResponse": {
    "risk_score": 80,
    "risk_level": "high",
    "pdmp_summary_status": "matched",
    "flags": [
      "PDMP review may have occurred but was not documented.",
      "PDMP history shows 4 distinct prescribers for controlled substances in the last 90 days.",
      "PDMP history shows 4 distinct pharmacies used for controlled substances in the last 90 days."
    ],
    "recommendation": "Not recommended — verify with patient before prescribing",
    "compliance_flag": "PDMP review documentation",
    "auto_note": "PDMP shows five controlled-substance fills in the past 90 days involving 4 prescribers and 4 pharmacies. Patient-reported history should be reconciled with recent PDMP-style records before finalizing the prescription."
  },
  "rxGuardReview": {
    "riskLevel": "high",
    "summary": "High-priority concerns include pdmp history shows 4 distinct prescribers for controlled substances in the last 90 days. and pdmp history shows 4 distinct pharmacies used for controlled substances in the last 90 days.. Additional review is warranted because pdmp review may have occurred but was not documented., encounter note is sparse for a controlled-substance review., pdmp history shows overlapping stimulant and sedative therapy in the last 90 days., the note does not clearly connect the prescription to a functional treatment goal., and the note provides limited narrative evidence of risk review or mitigation planning.. Documentation gaps were also detected, including functional goal or treatment objective, monitoring or follow-up plan, and risk discussion or counseling. Overall, RX Guard recommends clinician review before finalizing the Xanax prescribing decision.",
    "flags": [
      {
        "code": "missing_pdmp_documentation",
        "severity": "moderate",
        "message": "PDMP review may have occurred but was not documented."
      },
      {
        "code": "sparse_note",
        "severity": "moderate",
        "message": "Encounter note is sparse for a controlled-substance review."
      },
      {
        "code": "pdmp_multi_prescriber_pattern",
        "severity": "high",
        "message": "PDMP history shows 4 distinct prescribers for controlled substances in the last 90 days."
      },
      {
        "code": "pdmp_multi_pharmacy_pattern",
        "severity": "high",
        "message": "PDMP history shows 4 distinct pharmacies used for controlled substances in the last 90 days."
      },
      {
        "code": "pdmp_stimulant_sedative_pattern",
        "severity": "moderate",
        "message": "PDMP history shows overlapping stimulant and sedative therapy in the last 90 days."
      },
      {
        "code": "missing_functional_goal_context",
        "severity": "moderate",
        "message": "The note does not clearly connect the prescription to a functional treatment goal."
      },
      {
        "code": "limited_risk_narrative",
        "severity": "moderate",
        "message": "The note provides limited narrative evidence of risk review or mitigation planning."
      }
    ],
    "pdmpCrossReference": {
      "matched": true,
      "name": "Sheila Bankston",
      "dob": "1960-06-13",
      "totalPrescriptions": 5,
      "prescriberCount90d": 4,
      "pharmacyCount90d": 4,
      "lastFillDate": "2026-04-05",
      "activeOverlaps": []
    }
  },
  "localPdmpRows": [
    {
      "date": "2026-04-05",
      "medication": "Alprazolam 1 mg",
      "qty": 30,
      "days": 10,
      "prescriber": "Dr. R. Collins",
      "pharmacy": "Capitol Rx",
      "scheduleClass": "Schedule IV"
    },
    {
      "date": "2026-03-28",
      "medication": "Oxycodone 10 mg",
      "qty": 40,
      "days": 5,
      "prescriber": "Dr. J. Landry",
      "pharmacy": "Riverbend Pharmacy",
      "scheduleClass": "Schedule II"
    },
    {
      "date": "2026-03-21",
      "medication": "Adderall 20 mg",
      "qty": 60,
      "days": 30,
      "prescriber": "Dr. K. Holt",
      "pharmacy": "QuickFill Pharmacy",
      "scheduleClass": "Schedule II"
    },
    {
      "date": "2026-03-10",
      "medication": "Lorazepam 1 mg",
      "qty": 20,
      "days": 7,
      "prescriber": "Dr. R. Collins",
      "pharmacy": "Capitol Rx",
      "scheduleClass": "Schedule IV"
    },
    {
      "date": "2026-03-02",
      "medication": "Hydrocodone/APAP",
      "qty": 30,
      "days": 5,
      "prescriber": "Dr. M. Bell",
      "pharmacy": "St. Anne Pharmacy",
      "scheduleClass": "Schedule II"
    }
  ],
  "patient": {
    "displayName": "Sheila Bankston",
    "chartName": "BANKSTON, SHEILA",
    "dobDisplay": "06/13/1960",
    "age": 65,
    "mrn": "458293",
    "patientId": "284756",
    "sex": "F"
  },
  "encounter": {
    "pdmpQueryDate": "04/19/2026 10:32 AM",
    "provider": "Smith, John DC",
    "organization": "Advanced Pain & Spine"
  }
};
