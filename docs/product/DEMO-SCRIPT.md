# RX Guard Demo Script

## Goal

Deliver a clean, under-3-minute demo showing RX Guard working as a Prompt Opinion-published, A2A-enabled healthcare safety agent for controlled-substance prescribing review.

The demo should clearly show:
- a real workflow problem
- healthcare-aware context
- Prompt Opinion producing compact decision-support output
- RX Guard rendering a clean clinician-facing EHR-style workflow
- public Vercel staging as a synthetic reviewer surface, not a live Prompt Opinion API integration
- feasibility, safety, and human-in-the-loop control
- a believable before/after improvement loop

## Demo positioning

RX Guard is a **FHIR-aware prescribing safety agent** for synthetic controlled-substance encounters. The demo has a deliberate split:

1. **EHR/local adapter layer:** accepts realistic encounter context, including name, date of birth, proposed medication, directions, history, and note status.
2. **Prompt Opinion agent layer:** receives safe synthetic context and returns compact JSON with risk score, risk level, PDMP match status, flags, recommendation, compliance flag, and chart-ready note language.
3. **RX Guard UI layer:** renders the polished EHR modal, deterministic synthetic PDMP rows, recommendation, documentation language, and workflow buttons.

Framing line:

> Prompt Opinion produces the decision-support payload. RX Guard consumes that payload, combines it with local synthetic PDMP data, and renders the clinician-facing workflow.

Do **not** present raw Prompt Opinion JSON as the main visual artifact. It is the agent contract. The demo visual is the RX Guard EHR-style modal.

## Recommended demo length

Target: **2 minutes 15 seconds to 2 minutes 45 seconds**

This leaves room under the 3-minute limit. Use `docs/product/FINAL-SUBMISSION-EVIDENCE.md` as the recording-day checklist for the exact Prompt Opinion prompt, marketplace/listing evidence, endpoint checks, and pass/fail criteria.

## Recommended primary case

Use the synthetic **Sheila Bankston / proposed Xanax** case for the EHR-style UI demo.

Why:
- directly matches the current Prompt Opinion/RXGuard consult prompt
- uses the synthetic Prompt Opinion case key `RXG-SB-001`
- produces an obvious high-risk result for judges to understand quickly
- demonstrates PDMP mismatch, multiple prescribers/pharmacies, opioid + benzodiazepine exposure, and documentation value
- drives the full workflow-button contract, especially **Do Not Prescribe**

## Demo structure

## 1. Opening problem statement (0:00 to 0:20)

Suggested narration:

> Controlled-substance prescribing workflows are high-stakes and documentation-heavy. Important context is often split across the note, medication list, and monitoring history. RX Guard uses Prompt Opinion as the healthcare agent layer and an EHR-style UI layer to turn that fragmented context into clear prescribing-risk guidance before a prescription is finalized.

Visuals:
- RX Guard project name
- one-line subtitle
- synthetic demo disclaimer

## 2. Show prescribing workflow context (0:20 to 0:45)

Suggested narration:

> This starts where providers already work: inside the medication workflow. Here, the synthetic chart is open to Sheila Bankston's medications. The provider clicks Add Medication, searches for Xanax, and selects Xanax 1 mg tablet. RX Guard resolves that synthetic prescribing moment to the safe case key RXG-SB-001 behind the scenes.

Visuals:
- synthetic eCW-style medication page
- **+ Add Medication** entry point
- medication search showing `Xanax`
- dropdown results for `Xanax 1 mg tablet` and `Xanax 0.5 mg tablet`

Keep this fast. The important point is that the provider is not leaving the prescribing workflow.

## 3. Auto-trigger RX Guard from medication selection (0:45 to 1:05)

Suggested narration:

> Instead of asking providers to run another tool, RX Guard is embedded directly into the prescribing workflow. The moment a controlled medication is selected, it runs automatically and gives a decision-ready output in seconds.

Visuals:
- select **Xanax 1 mg tablet**
- show the controlled-medication transition
- show RX Guard checking local synthetic PDMP evidence
- show the modal loading or appearing

Important:
- treat RX Guard as an **A2A/chat agent path backed by MCP lookup**, not as a standalone MCP-tool demo
- ask Prompt Opinion for compact decision-support fields, not nested PDMP table rows
- hosted MCP owns deterministic synthetic medication/PDMP context once connected
- RX Guard owns deterministic synthetic PDMP table rendering locally
- if Launchpad shows stale template wording, center the demo on the actual selected agent/session behavior and returned output rather than the misleading card copy
- do not show raw expected JSON or Prompt Opinion-safe payload panels in the RX Guard front-end; those details belong in docs/architecture only

## 4. Show findings in the EHR modal (1:05 to 1:40)

Suggested narration:

> The modal translates the agent result into a clinical workflow. RX Guard identifies a history mismatch, recent opioid and benzodiazepine exposure, multiple prescribers and pharmacies, and missing PDMP documentation. The result is high risk and not recommended pending verification and care coordination.

Visuals:
- history mismatch banner
- deterministic synthetic PDMP summary table
- risk score and risk level
- top flags
- recommendation panel

Focus on clarity. The table is local synthetic demo data; Prompt Opinion only has to say the case matched PDMP-style history.

## 5. Show provider control and documentation (1:40 to 2:05)

Suggested narration:

> RX Guard also produces chart-ready documentation. The clinician stays in control: they can proceed, proceed with caution, choose not to prescribe, or re-run the review from the pending medication row. In this high-risk case, selecting Do Not Prescribe cancels the simulated order and inserts the non-prescribing rationale.

Visuals:
- suggested note language
- Proceed / Proceed with Caution / Do Not Prescribe buttons
- visible **Re-run RXGuard** button next to the pending Xanax prescription
- click **Do Not Prescribe**
- updated documentation/action status

## 6. Close with value and fit (2:05 to 2:30)

Suggested narration:

> RX Guard is designed as clinician support, not an autonomous prescriber. Prompt Opinion provides the agent reasoning layer, RX Guard provides the clinical workflow layer, and all demo data is synthetic. The value is the last mile: turning a compact AI decision-support payload into safer, more defensible prescribing documentation before an order is finalized.

Visuals:
- final summary slide
- three bullets: AI Factor / Impact / Feasibility

## Optional closing line

> RX Guard helps clinicians create safer, more defensible controlled-substance documentation with less friction.

## Demo asset checklist

- [ ] primary synthetic case ready
- [ ] backup synthetic case ready
- [ ] Prompt Opinion response uses `pdmp_summary_status`, not nested PDMP rows
- [ ] local UI renders deterministic synthetic PDMP table rows
- [ ] output is visually readable
- [ ] synthetic-only disclaimer present
- [ ] no PHI visible
- [ ] narration under 3 minutes
- [ ] final screen includes product name and value proposition

## Public staging path

Use this path for partner UI feedback and as the polished workflow visual:

```text
https://rx-guard-iota.vercel.app
```

Describe it accurately:

> This public staging UI uses synthetic data and the Prompt Opinion-compatible agent contract. It is not making a live Prompt Opinion API call.

## Prompt Opinion live path

Show this if the platform session is clean and stable:
- in-platform invocation through the final **BYO Agent / A2A-enabled** chat path
- compact JSON response from Prompt Opinion
- `pdmp_summary_status: "matched"` for the Sheila case
- marketplace listing only if it helps credibility without adding clutter
- published/discoverable state, if it can be shown cleanly

Current note:
- RX Guard is already published in Marketplace and A2A-enabled
- the clean contract is `risk_score`, `risk_level`, `pdmp_summary_status`, `flags`, `recommendation`, `compliance_flag`, and `auto_note`
- disable custom JSON guardrails during live chat unless Prompt Opinion can scope them to assistant output/post-generation validation

## If Prompt Opinion live output is visually ugly

Do not make raw JSON the hero shot. Use it as a quick proof of the agent contract, then move immediately to the RX Guard UI:

1. Point out the compact agent payload.
2. Switch to the EHR-style modal.
3. Explain that RX Guard consumes the payload and renders the clinical workflow.

## If Prompt Opinion access does not work in time

Keep the demo prep ready anyway, but note that final hackathon compliance still requires in-platform functioning if the rules demand it. Use the Vercel/local UI to show the intended rendering/workflow contract honestly, without claiming a live Prompt Opinion invocation if it did not happen.

## Recording tips

- start on the medication page, not a separate tools/menu screen
- show **+ Add Medication** → `Xanax` search → select **Xanax 1 mg tablet**
- say that RX Guard auto-runs when a controlled medication is selected
- keep zoom level high enough to read output on mobile and laptop
- use the Sheila Bankston case, not multiple cases
- avoid scrolling too much
- pause briefly on the loaded modal, workflow buttons, and **Re-run RXGuard** control
- click **Do Not Prescribe** only after the viewer can see the recommendation and documentation
- do one full dry run before final recording
- cut dead time aggressively

## What not to do

- do not spend 45 seconds on architecture diagrams
- do not present raw JSON as the main demo artifact
- do not ask Prompt Opinion to generate nested PDMP table rows
- do not present it as a policing or enforcement tool
- do not overclaim regulatory certainty
- do not bury the main finding behind technical setup
- do not use real patient data
