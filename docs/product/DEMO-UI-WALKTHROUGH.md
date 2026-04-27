# RX Guard UI Walkthrough

This document describes the current EHR-style workflow used for local testing, public Vercel staging, and the visual portion of the short hackathon recording.

## Purpose

The UI shows how RX Guard turns a Prompt Opinion-compatible compact decision-support payload into a clinician-facing controlled-substance workflow.

The UI is intentionally synthetic. It does not connect to a live EHR, PDMP, eRx system, Prompt Opinion API, or real patient record.

## Public staging

```text
https://rx-guard-iota.vercel.app
```

Use the public staging link for partner/reviewer feedback. The staging site is static and synthetic. It demonstrates the workflow renderer and contract, not a live Prompt Opinion API call.

## Run locally

```bash
npm run demo:ui
```

Open:

```text
http://localhost:4173
```

## Workflow

1. The screen opens on a synthetic eCW-style medication page for Sheila Bankston.
2. The **RXGuard Consult** panel shows a clean intake form:
   - patient name
   - date of birth
   - prescription
   - directions
3. The default synthetic values are prefilled for the canonical case:
   - Sheila Bankston
   - 1960-06-13
   - Xanax 1 mg tablet
   - 1 tablet PO BID PRN for anxiety
4. Behind the UI, RX Guard maps that synthetic intake to `RXG-SB-001` and uses the generated Prompt Opinion-compatible review payload.
5. Click **Run RXGuard Analysis**.
6. The UI shows a short analysis/loading transition.
7. The RX Guard results modal renders:
   - patient and proposed medication summary
   - history mismatch alert
   - deterministic synthetic PDMP-style evidence rows
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

The recommended demo click is **Do Not Prescribe** because the synthetic case returns high risk and a not-recommended result.

## Recording guidance

Use this order for the final short recording:

1. Briefly show the Prompt Opinion in-platform invocation/output if available and clean.
2. Switch to the RX Guard staging/local UI as the polished workflow renderer.
3. Show the clean patient/DOB/prescription/directions intake.
4. Click **Run RXGuard Analysis**.
5. Let the RX Guard results modal load.
6. Pause briefly on the risk score, recommendation, documentation, and workflow buttons.
7. Click **Do Not Prescribe** to show the documentation/action state.

Keep the video tight. Avoid scrolling and avoid showing setup steps unless needed for Prompt Opinion compliance.

## What not to show in the front end

The tester-facing UI should not show:
- raw expected JSON
- `pdmp_summary_status` field names
- Prompt Opinion-safe payload panels
- full system prompts
- internal contract text

Those details belong in docs and in the Prompt Opinion configuration, not in the clinical workflow UI.

## Safety and compliance notes

- All visible patient data is synthetic.
- RX Guard is clinician-support decision support, not an autonomous prescriber.
- The UI demonstrates an integration contract. Real medication order updates, eRx submission, and documentation insertion would require EHR integration and clinician confirmation.
