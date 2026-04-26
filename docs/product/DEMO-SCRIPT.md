# RX Guard Demo Script

## Goal

Deliver a clean, under-3-minute demo showing RX Guard working as a healthcare AI agent for controlled-substance prescribing review.

The demo should clearly show:
- a real workflow problem
- healthcare-aware context
- AI-assisted review value
- feasibility and safety
- a believable before/after improvement loop

## Demo positioning

RX Guard is a **FHIR-aware prescribing safety agent** that reviews synthetic controlled-substance encounters before a prescription is finalized. It helps clinicians catch documentation gaps, contextual medication risks, and note-quality issues, then suggests chart-ready language for review.

## Recommended demo length

Target: **2 minutes 15 seconds to 2 minutes 45 seconds**

This leaves some room under the 3-minute limit.

## Recommended primary case

Use the synthetic **Sheila Bankston / proposed Xanax** case for the EHR-style UI demo.

Why:
- directly matches the current Prompt Opinion/RXGuard consult prompt
- produces an obvious high-risk result for judges to understand quickly
- demonstrates PDMP mismatch, multiple prescribers/pharmacies, opioid + benzodiazepine overlap, and documentation value
- drives the full workflow-button contract, especially **Do Not Prescribe**

## Demo structure

## 1. Opening problem statement (0:00 to 0:20)

Suggested narration:

> Controlled-substance prescribing workflows are high-stakes and documentation-heavy. Important context is often split across the note, medication list, and monitoring history. RX Guard is a FHIR-aware prescribing safety agent that reviews a synthetic encounter before a prescription is finalized and highlights missing documentation and contextual risk factors.

Visuals:
- RX Guard project name
- one-line subtitle
- synthetic demo disclaimer

## 2. Show input context (0:20 to 0:45)

Suggested narration:

> Here we have a synthetic medication workflow for Sheila Bankston. A Xanax prescription is pending, the patient reports no recent controlled-substance use, and PDMP documentation is not yet in the encounter.

Visuals:
- synthetic eCW-style medication page
- Prompt Opinion/RXGuard consult prompt panel
- proposed Xanax prescription
- patient-reported history and PDMP documentation status

Keep this fast. Do not over-explain every field.

## 3. Invoke RX Guard (0:45 to 1:05)

Suggested narration:

> RXGuard receives the synthetic consult prompt, reviews the medication and PDMP-style context, and returns structured JSON that drives this EHR-style risk modal.

Visuals:
- paste the Sheila Bankston consult prompt
- click **Run RXGuard Analysis**
- show the result loading or appearing

Important:
- treat RX Guard as an **A2A/chat agent path**, not an MCP-tool path
- the static UI demonstrates the rendering/workflow contract for the structured Prompt Opinion result
- if Launchpad still shows stale template wording, center the demo on the actual selected agent/session behavior and returned output rather than the misleading card copy

## 4. Show findings (1:05 to 1:40)

Suggested narration:

> RXGuard identifies a history mismatch, recent opioid and benzodiazepine exposure, multiple prescribers and pharmacies, and missing PDMP documentation. The result is high risk and not recommended pending verification and care coordination.

Visuals:
- history mismatch banner
- PDMP summary table
- risk score and risk level
- top flags
- recommendation panel

Focus on clarity, not UI flourish.

## 5. Show suggested documentation language and workflow buttons (1:40 to 2:05)

Suggested narration:

> RXGuard also generates chart-ready documentation. The clinician stays in control: they can proceed, proceed with caution, or choose not to prescribe. In this high-risk case, selecting Do Not Prescribe cancels the order and inserts the non-prescribing rationale.

Visuals:
- suggested note language
- Proceed / Proceed with Caution / Do Not Prescribe buttons
- click **Do Not Prescribe**
- updated documentation/action status

## 6. Close with value and fit (2:05 to 2:30)

Suggested narration:

> RX Guard is designed as a clinician-support agent, not an autonomous prescriber. It uses synthetic healthcare context, fits interoperable workflows, and targets a real last-mile problem: turning fragmented prescribing context into clear, explainable review before a prescription is finalized.

Visuals:
- final summary slide
- three bullets: AI Factor / Impact / Feasibility

## Optional closing line

> RX Guard helps clinicians create safer, more defensible controlled-substance documentation with less friction.

## Demo asset checklist

- [ ] primary synthetic case ready
- [ ] backup synthetic case ready
- [ ] output is visually readable
- [ ] synthetic-only disclaimer present
- [ ] no PHI visible
- [ ] narration under 3 minutes
- [ ] final screen includes product name and value proposition

## If Prompt Opinion access arrives

Update the demo flow to show:
- in-platform invocation through the final **BYO Agent / A2A-enabled** chat path
- marketplace listing only if it helps credibility without adding clutter
- final response displayed in Prompt Opinion
- published/discoverable state, if it can be shown cleanly

Current note:
- RX Guard is already published in Marketplace and A2A-enabled
- the remaining validation step is a clean synthetic-case invocation through Prompt Opinion chat

## If Prompt Opinion access does not arrive in time

Keep the demo prep ready anyway, but note that final hackathon compliance still requires in-platform functioning.

## Recording tips

- show the prompt being pasted before the results screen appears
- keep zoom level high enough to read output on mobile and laptop
- use the Sheila Bankston case, not multiple cases
- avoid scrolling too much
- pause briefly on the loaded modal and workflow buttons
- click **Do Not Prescribe** only after the viewer can see the recommendation and documentation
- do one full dry run before final recording
- cut dead time aggressively

## What not to do

- do not spend 45 seconds on architecture diagrams
- do not present it as a policing or enforcement tool
- do not overclaim regulatory certainty
- do not bury the main finding behind technical setup
- do not use real patient data
