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
2. The provider stays in the native medication workflow and clicks **+ Add Medication**.
3. The medication search shows `Xanax` with two result options:
   - `Xanax 1 mg tablet`
   - `Xanax 0.5 mg tablet`
4. Selecting **Xanax 1 mg tablet** auto-triggers RX Guard because it is a controlled-medication prescribing moment.
5. The UI shows a short transition:
   - controlled medication selected
   - local synthetic PDMP evidence check
   - RX Guard recommendation preparation
6. The RX Guard results modal renders:
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
7. After the first automatic review, the pending prescription row exposes **Re-run RXGuard** so the provider can manually repeat the safety check without leaving the workflow.

## Workflow buttons

| Button | Demo behavior |
| --- | --- |
| Proceed | Continues prescription, moves medication to pending/eRx, and inserts standard PDMP documentation. |
| Proceed with Caution | Continues prescription and inserts stronger risk/coordination documentation. |
| Do Not Prescribe | Cancels the medication order and inserts non-prescribing rationale documentation. |

The recommended demo click is **Do Not Prescribe** because the synthetic case returns high risk and a not-recommended result.

## Recording guidance

Use this order for the final short recording:

1. Open the RX Guard staging/local UI on the medication page.
2. Click **+ Add Medication** and show the `Xanax` medication search.
3. Select **Xanax 1 mg tablet**.
4. Let the automatic RX Guard transition and results modal load.
5. Pause briefly on the risk score, recommendation, documentation, and workflow buttons.
6. Show **Re-run RXGuard** beside the pending Xanax prescription as the manual provider-control option.
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
