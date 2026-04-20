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

Use:
- **case-01-opioid-benzo-overlap**

Why:
- obvious clinical relevance
- easy for judges to understand quickly
- demonstrates both safety and documentation value

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

> Here we have a synthetic outpatient follow-up encounter. The patient has chronic back pain, active alprazolam on the medication list, and a new oxycodone prescription is being considered.

Visuals:
- synthetic patient context
- note text snippet
- active medication list
- proposed medication

Keep this fast. Do not over-explain every field.

## 3. Invoke RX Guard (0:45 to 1:05)

Suggested narration:

> RX Guard receives the encounter context, reviews the synthetic note and medication context, and runs a prescribing safety review to identify both documentation gaps and contextual risks.

Visuals:
- start from the live Prompt Opinion chat or launch flow
- select RX Guard through the final **chat/A2A** path, not an MCP tools view
- submit the synthetic case
- show the result loading or appearing

Important:
- treat RX Guard as an **A2A/chat agent path**, not an MCP-tool path
- if Launchpad still shows stale template wording, center the demo on the actual selected agent/session behavior and returned output rather than the misleading card copy

## 4. Show findings (1:05 to 1:40)

Suggested narration:

> In this case, RX Guard flags concurrent opioid and benzodiazepine exposure, identifies that PDMP review was not clearly documented, and notes that the encounter is missing a functional goal and risk discussion. Instead of just warning, it explains why each issue matters.

Visuals:
- risk level
- top flags
- missing documentation list
- short explanations

Focus on clarity, not UI flourish.

## 5. Show suggested documentation language (1:40 to 2:05)

Suggested narration:

> RX Guard also generates suggested chart-ready language that the clinician can review and adapt, helping reduce chart rework while preserving human oversight.

Visuals:
- suggested note language
- short highlighted improvements

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

- keep zoom level high enough to read output on mobile and laptop
- use one clear case, not multiple cases
- avoid scrolling too much
- do one full dry run before final recording
- cut dead time aggressively

## What not to do

- do not spend 45 seconds on architecture diagrams
- do not present it as a policing or enforcement tool
- do not overclaim regulatory certainty
- do not bury the main finding behind technical setup
- do not use real patient data
