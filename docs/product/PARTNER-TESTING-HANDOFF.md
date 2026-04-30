# RX Guard Partner Testing Handoff

Use this guide to test RX Guard and give structured feedback.

## Primary partner test path

Use the public staging site:

```text
https://rx-guard-iota.vercel.app
```

No Prompt Opinion account, GitHub account, Node install, npm install, or local server is required for partner UI testing.

## Goal

Validate that RX Guard's clinician-facing workflow is clear, readable, and useful for a synthetic controlled-substance prescribing review.

The staging site demonstrates the RX Guard UI and Prompt Opinion-compatible decision-support contract. It does **not** make a live API call into Prompt Opinion. Prompt Opinion remains the published A2A/BYO agent layer for the final submission; the staging site is the low-friction review surface for partners.

## Data safety

Use **synthetic data only**.

Do not enter:
- real patient names
- real dates of birth
- real prescriptions
- medical record numbers
- addresses, phone numbers, emails, or other identifiers
- real clinical notes

The default Sheila Bankston case is synthetic and should be used for the primary test.

## What RX Guard is supposed to do

RX Guard should:
- start from the native medication workflow
- auto-run a synthetic controlled-substance safety review when a controlled medication is selected
- identify documentation and contextual medication-risk concerns
- display deterministic PDMP-style evidence rows
- stay clinician-supportive, precise, and non-punitive
- avoid unsupported claims or overreaching conclusions
- suggest concise chart-ready language a clinician could adapt
- clearly frame itself as support guidance, not an autonomous prescribing decision

## What RX Guard should emphasize most

For the default case, RX Guard should focus on:
- patient-reported history mismatch with synthetic PDMP-style evidence
- recent controlled-substance fills
- multiple prescribers and pharmacies
- PDMP documentation gap
- opioid/benzodiazepine-type risk context when shown by the synthetic evidence

## What RX Guard should avoid

Please watch for and flag any UI copy or result that:
- sounds accusatory or moralizing
- implies misuse, diversion, abuse, or wrongdoing without direct evidence
- sounds like a final prescribing decision instead of clinician-support guidance
- overstates certainty when the note is incomplete
- buries the main issue under too much text
- exposes raw JSON, internal Prompt Opinion payloads, or developer-only contract text in the front end
- is hard to tap or read on mobile

## Step-by-step staging test flow

1. Open `https://rx-guard-iota.vercel.app` on phone or desktop.
2. Confirm the medication page and **+ Add Medication** workflow are visible.
3. Select **Xanax 1 mg tablet** from the medication search results.
4. Confirm RX Guard starts automatically without a separate tools menu or module launch.
5. Review the risk score, recommendation, PDMP-style rows, suggested documentation, and workflow buttons.
6. Confirm **Re-run RXGuard** appears beside the pending Xanax prescription.
7. Try **Do Not Prescribe** and confirm the simulated order/documentation status updates clearly.
8. Send feedback using the format below.

## Optional Prompt Opinion path

If specifically asked to test Prompt Opinion itself, use the published RX Guard agent through the **chat / A2A path**, not MCP tool screens.

For Prompt Opinion chat testing, use synthetic key `RXG-SB-001` rather than entering direct patient identifiers. The expected compact response contract is:

```json
{
  "risk_score": 80,
  "risk_level": "high",
  "pdmp_summary_status": "matched",
  "flags": ["History mismatch", "Multiple prescribers (4 in 90d)", "Multiple pharmacies (4 in 90d)"],
  "recommendation": "Not recommended — verify with patient before prescribing",
  "compliance_flag": "PDMP review not documented",
  "auto_note": "PDMP shows five controlled-substance fills in the past 90 days involving four prescribers and four pharmacies. Patient report of no recent controlled-substance use is inconsistent with recent PDMP-style records."
}
```

This JSON is for Prompt Opinion contract validation only. It should not appear as the main front-end UX in the Vercel staging site.

## Feedback format to send back

```text
DEVICE/BROWSER:
[iPhone Safari, Android Chrome, desktop Chrome, etc.]

OVERALL:
Pass / Needs work

WHAT WORKED:
- ...

WHAT FELT OFF OR CONFUSING:
- ...

MOBILE READABILITY/TAPPING:
Good / Mixed / Hard

CLINICAL WORKFLOW:
Would this help a clinician understand the prescribing concern quickly?

TONE:
Too aggressive / Good / Too vague

SUGGESTED DOCUMENTATION LANGUAGE:
Usable / Needs tightening / Too long / Too generic

ANY RAW JSON OR INTERNAL TECHNICAL OUTPUT VISIBLE IN THE UI:
No / Yes — [where]
```

## One-sentence standard for success

RX Guard passes if the staging workflow gives a clinician a quick, defensible, non-punitive explanation of the main synthetic prescribing risk and offers concise language they could realistically adapt into the chart.
