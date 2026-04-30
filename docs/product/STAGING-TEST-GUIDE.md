# RX Guard Staging Test Guide

Use this guide when sending RX Guard to a partner, judge, or reviewer who should test the clinical workflow without cloning the repository.

## Public staging link

```text
https://rx-guard-iota.vercel.app
```

No Prompt Opinion, GitHub, Node, or npm setup is required for this staging test.

## What this staging site is

The Vercel staging site is a public, read-only synthetic workflow test. It shows the RX Guard clinician-facing UI that consumes the same Prompt Opinion-compatible contract used by the local adapter.

Current staging architecture:

```text
Synthetic prescription/PDMP fixture
  -> RX Guard local adapter
  -> Prompt Opinion-compatible compact decision-support payload
  -> RX Guard EHR-style UI on Vercel
```

Important distinction: the staging site is aligned to Prompt Opinion's A2A/agent contract, but it does **not** make a live API call into Prompt Opinion. Prompt Opinion remains the published agent layer for the submission; the Vercel site is the low-friction reviewer UI that demonstrates how RX Guard renders the workflow.

## Data safety rules

- Use synthetic test data only.
- Do not enter real patient information.
- Do not enter real prescriptions, medical history, addresses, phone numbers, or identifiers.
- Do not treat the staging site as clinical software.
- Do not use the staging site for diagnosis, prescribing, treatment, billing, compliance determinations, or live clinical decisions.

## Default synthetic case

The staging UI uses the canonical synthetic case:

| Field | Value |
| --- | --- |
| Patient | Sheila Bankston |
| Medication search | Xanax |
| Selected prescription | Xanax 1 mg tablet |
| Directions | 1 tablet PO BID PRN for anxiety |
| Synthetic key | RXG-SB-001 |

The RX Guard adapter maps this local prescribing event to the safe synthetic key before building the Prompt Opinion-compatible decision-support payload.

## Partner test flow

1. Open `https://rx-guard-iota.vercel.app` on phone or desktop.
2. Confirm the medication page and **+ Add Medication** workflow are easy to understand.
3. Select **Xanax 1 mg tablet** from the medication search results.
4. Confirm RX Guard starts automatically without a separate tools menu or module launch.
5. Review the risk score, recommendation, PDMP-style rows, suggested documentation, and workflow buttons.
6. Confirm **Re-run RXGuard** appears beside the pending Xanax prescription as a manual provider-control option.
7. Try the workflow buttons, especially **Do Not Prescribe**, and confirm the UI clearly updates the simulated action/documentation status.
8. Send feedback on anything confusing, too technical, hard to read, or hard to tap.

## What good feedback looks like

```text
DEVICE/BROWSER:
[iPhone Safari, Android Chrome, desktop Chrome, etc.]

OVERALL:
Pass / Needs work

WHAT WORKED:
- ...

WHAT FELT CONFUSING:
- ...

UI READABILITY:
Easy / Mixed / Hard

CLINICAL WORKFLOW:
Would this help a clinician understand the prescribing concern quickly?

ANYTHING THAT LOOKED LIKE RAW JSON OR INTERNAL TECHNICAL OUTPUT:
Yes / No
If yes, where?
```

## Recommended partner message

```text
Here’s the RX Guard staging test:

https://rx-guard-iota.vercel.app

This is synthetic test data only — please don’t enter any real patient information.

Please test the prescribing review flow on phone or desktop:
1. Open the link.
2. Click “+ Add Medication.”
3. Select “Xanax 1 mg tablet.”
4. Confirm RX Guard starts automatically and the review appears.
5. Confirm “Re-run RXGuard” is visible after the first review.
6. Review the risk score, PDMP-style rows, recommendation, and workflow buttons.
7. Tell me what feels confusing, too technical, hard to read, or hard to tap.
```

## Submission framing

For judges, frame staging accurately:

> RX Guard has a public staging UI showing the prescribing-review workflow using synthetic data and the Prompt Opinion-compatible compact agent contract. Prompt Opinion is the published A2A healthcare agent layer; RX Guard provides the synthetic clinical data adapter and EHR-style workflow renderer. In production, RX Guard would connect to authorized EHR/PDMP/FHIR sources through a secure data service rather than storing clinical data inside Prompt Opinion.

## Known limits

- Staging is static and synthetic.
- Staging does not connect to live Prompt Opinion APIs.
- Staging does not use real EHR, PDMP, pharmacy, claims, or FHIR server data.
- Staging demonstrates the workflow renderer and handoff contract; the final submission still needs the Prompt Opinion in-platform recording/artifact if the competition requires proof of in-platform function.
