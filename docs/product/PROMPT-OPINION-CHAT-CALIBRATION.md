# RX Guard Prompt Opinion Chat / A2A Calibration

## Purpose

This document captures product and demo calibration for the Prompt Opinion chat / A2A version of RX Guard.

For copy-pasteable Prompt Opinion BYO Agent field configuration, use the single source of truth:

- `docs/product/PROMPT-OPINION-BYO-AGENT-CONFIG.md`

This file intentionally does **not** repeat System Prompt, Consult Prompt, Response Format, Tools, Guardrails, or A2A & Skills content. Keeping those fields in one document prevents conflicting Prompt Opinion setup instructions.

## Current product direction

RX Guard should be optimized as a **Prompt Opinion chat / A2A agent**, not as an MCP-tools-first product.

The desired experience is an EHR-style risk-analysis overlay that returns structured content a UI can render into:

- patient and proposed medication summary
- PDMP-style controlled-substance history
- history mismatch warning when supplied history conflicts with PDMP or medication data
- clinical insights
- risk score and risk level
- top key flags
- recommendation
- compliance/documentation flags
- suggested chart documentation
- workflow actions for Proceed, Proceed with Caution, and Do NOT Prescribe

## Product calibration goals

The Prompt Opinion version of RX Guard should:

- stay clinician-supportive and non-punitive
- remain precise and avoid unsupported inference
- focus strongest attention on:
  - opioid + benzodiazepine overlap
  - duplicate same-class controlled-substance fills
  - multiple prescribers or pharmacies when present in supplied PDMP data
  - PDMP documentation gaps
  - monitoring, follow-up, functional-goal, or risk-discussion gaps
  - history mismatch when patient-reported history conflicts with supplied PDMP or medication data
- produce concise chart-ready language that is easy to adapt
- preserve a clear human-in-the-loop disclaimer

## What to reduce or avoid

The Prompt Opinion version should avoid:

- implying misuse, diversion, abuse, or intent unless directly evidenced
- sounding like a compliance enforcement engine
- overstating certainty when the note or PDMP context is sparse
- turning every concern into a high-severity warning
- overly long narrative summaries that are harder to demo
- duplicating the same concern in summary, flags, compliance, and documentation sections without adding new value
- claiming "no unexpected fills" when the supplied PDMP data actually shows concerning fills, multi-prescriber patterns, or patient-history mismatch

## Calibration observations from synthetic testing

The existing hybrid output is directionally useful, but the Prompt Opinion version should improve it by:

1. tightening the summary so it reads like clinician-support guidance instead of a stitched narrative
2. reducing duplicate phrasing between flags and missing documentation
3. making suggested language shorter and more defensible
4. keeping the main emphasis on the most important overlap, mismatch, coordination, and documentation issues
5. explicitly preserving support-tool framing
6. returning structured JSON from the BYO Agent config when a UI needs modal rendering or workflow buttons

## Marketplace / demo cleanup recommendations

To make the Prompt Opinion version cleaner for marketplace and demo use:

1. keep the first line short and immediately clinically relevant
2. show no more than 3 priority findings in the first visible frame
3. avoid words like "misuse" or "abuse" unless directly evidenced in the synthetic case
4. use "not documented" instead of implying missing actions
5. keep suggested chart language concise and tied to the actual supplied facts
6. keep the support-tool disclaimer visible somewhere in the output
7. avoid duplicated wording between summary, findings, and missing-documentation sections
8. ensure recommendation text aligns with the selected workflow action

## Judge-optimized framing

For hackathon judging, RX Guard should signal four things quickly.

### Clarity

The output should be readable in seconds, not paragraphs.

### Safety

The output should avoid unsupported escalation and preserve human oversight.

### Healthcare relevance

The findings should feel grounded in actual prescribing workflow friction.

### Human-in-the-loop practicality

The output should help a clinician improve the note and make a documented workflow decision, not just flag problems.

## Practical output shape

The Prompt Opinion version should prefer:

- one compact JSON response matching `PROMPT-OPINION-BYO-AGENT-CONFIG.md`
- one concise risk headline in the UI derived from `risk_level`, `recommendation`, and `flags`
- up to 3 ranked/highest-impact flags
- one compliance flag when applicable
- one action-specific documentation note
- one explicit clinician-support disclaimer in surrounding UI copy
- button/workflow metadata added by the UI adapter, not invented by the model

That shape is easier to demo, easier to judge, and more defensible than a long narrative summary.
