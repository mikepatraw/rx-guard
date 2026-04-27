# RXGuard Demo UI Walkthrough

This document describes the current static EHR-style demo flow used for the short hackathon recording.

## Purpose

The demo UI shows how RXGuard output can drive a clinician-facing controlled-substance workflow after a Prompt Opinion BYO Agent returns structured JSON.

The static UI is intentionally synthetic. It does not connect to a live EHR, PDMP, eRx system, or real patient record.

## Run the demo

```bash
npm run demo:ui
```

Open:

```text
http://localhost:4173
```

## Demo flow

1. The screen opens on a synthetic eCW-style medication page for Sheila Bankston.
2. A **Prompt Opinion BYO Agent / RXGuard Consult** panel appears.
3. Paste or review the clinical consult prompt:

   ```text
   Synthetic patient key: RXG-SB-001
   Proposed medication: Xanax 1 mg tablet
   Directions: 1 tablet PO BID PRN for anxiety
   Patient-reported history: no recent narcotic or controlled substance use
   Encounter: PDMP review not yet documented
   Task: Run RXGuard controlled-substance risk analysis and return the structured result.
   ```

4. Click **Run RXGuard Analysis**.
5. The UI shows a short analysis/loading transition.
6. The RXGuard results modal renders:
   - patient and proposed medication summary
   - history mismatch alert
   - PDMP summary table
   - clinical insights
   - risk score and risk level
   - top flags
   - recommendation
   - compliance flag
   - suggested documentation
   - workflow buttons

## Workflow buttons

| Button | Demo behavior |
| --- | --- |
| Proceed | Continues prescription, moves medication to pending/eRx, and inserts standard PDMP documentation. |
| Proceed with Caution | Continues prescription and inserts stronger risk/coordination documentation. |
| Do Not Prescribe | Cancels the medication order and inserts non-prescribing rationale documentation. |

The current recorded demo clicks **Do Not Prescribe** because the synthetic case returns high risk and a not-recommended result.

## Recording guidance

Use this order for the final short recording:

1. Start on the consult prompt panel.
2. Paste the RXG-SB-001 synthetic case prompt.
3. Click **Run RXGuard Analysis**.
4. Let the RXGuard results modal load.
5. Pause briefly on the risk score, recommendation, documentation, and workflow buttons.
6. Click **Do Not Prescribe** to show the documentation/action state.

Keep the video tight. Avoid scrolling and avoid showing setup steps unless needed for Prompt Opinion compliance.

## Safety and compliance notes

- All visible patient data is synthetic.
- RXGuard is clinician-support decision support, not an autonomous prescriber.
- The UI demonstrates an integration contract. Real medication order updates, eRx submission, and documentation insertion would require EHR integration and clinician confirmation.
