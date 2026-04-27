# RX Guard Devpost Draft

## Project name

RX Guard

## Tagline

A Prompt Opinion-compatible prescribing safety workflow that turns synthetic controlled-substance context into clear clinician decision support before prescriptions are finalized.

## Elevator pitch

RX Guard is a clinician-support healthcare AI workflow for synthetic controlled-substance prescribing encounters. Prompt Opinion provides the compact agent decision-support layer, while RX Guard provides the synthetic clinical data adapter and EHR-style renderer that turns the result into clear risk guidance, PDMP-style evidence, and chart-ready documentation language before a prescription is finalized.

## What it does

RX Guard helps clinicians review high-friction prescribing encounters by analyzing synthetic patient and encounter context, proposed controlled-substance prescriptions, patient-reported history, and deterministic PDMP-style evidence. It flags missing documentation, highlights contextual concerns such as recent controlled-substance fills across multiple prescribers/pharmacies, and generates suggested language that can help strengthen the note before finalizing the prescription.

## Problem

Controlled-substance prescribing workflows are high-stakes and documentation-heavy. Important information is often split across the encounter note, medication list, and monitoring context, which can lead to weak documentation, inconsistent review, avoidable chart rework, and overlooked safety concerns. Existing workflows can be fragmented and time-consuming, especially when clinicians have to assemble context manually.

## Solution

RX Guard is designed as a FHIR-aware prescribing safety workflow that turns fragmented synthetic encounter context into a structured, explainable pre-sign review. Instead of acting as an autonomous prescriber, it works as a human-in-the-loop support tool. It highlights what may be missing, explains why it matters, and suggests chart-ready language that the clinician can review and adapt.

## Why AI

A traditional rules engine can catch fixed thresholds, but it cannot reliably convert fragmented clinical context into concise, clinician-readable support on its own. RX Guard uses Prompt Opinion as the agent layer because the workflow requires interpreting clinical context, returning compact decision support, and generating useful explanations and suggested note language. The goal is not just detection, but clearer clinical support.

## How we built it

We built RX Guard as a narrow MVP focused on feasibility and interoperability. The project includes:
- a TypeScript review engine
- structured request and response schemas
- synthetic demo cases and deterministic PDMP-style fixtures
- a rules-based review layer
- a Prompt Opinion-compatible compact output contract
- a local adapter that maps realistic synthetic intake to `RXG-SB-001`
- a clean EHR-style public staging UI on Vercel
- architecture and submission planning for Prompt Opinion integration

The project is framed as a Prompt Opinion chat / A2A healthcare agent workflow. In the current hackathon setup, RX Guard has been published through Prompt Opinion Marketplace with A2A enabled. The Vercel staging site is public for partner workflow testing, but it is intentionally synthetic/static and does not call live Prompt Opinion APIs.

## Key features

- synthetic controlled-substance encounter review
- contextual medication risk detection
- documentation gap detection
- explainable review output
- suggested chart-ready language
- human-in-the-loop support model
- healthcare-agent architecture designed for interoperable workflows
- public synthetic staging UI for partner testing

## Impact

RX Guard targets a real workflow problem: helping clinicians create safer, more defensible controlled-substance documentation with less friction. The expected value is reduced chart rework, more consistent review of contextual risk factors, and faster identification of missing documentation before the prescription is finalized.

## Feasibility and safety

RX Guard is intentionally narrow. It uses synthetic or de-identified data only, keeps the clinician in control, and does not autonomously approve or deny prescriptions. The project is framed as documentation and safety review support, not diagnosis, not law enforcement, not a live EHR/PDMP integration, and not a replacement for clinical judgment. Prompt Opinion is not used as a prescription database; a production version would connect RX Guard to authorized EHR/PDMP/FHIR sources through a secure clinical data layer.

## What’s next

Next steps before final submission are to record the live Prompt Opinion synthetic-case invocation, capture the final marketplace listing URL/details, and attach the under-3-minute demo video. Future production work would replace deterministic synthetic fixtures with authorized EHR/PDMP/FHIR integration through a secure data service.

## Built for

Agents Assemble: The Healthcare AI Endgame

## Public staging link

```text
https://rx-guard-iota.vercel.app
```

This is a synthetic public workflow test for partners and judges. It demonstrates the RX Guard UI and Prompt Opinion-compatible contract, but it is not a live Prompt Opinion API integration.

## Prompt Opinion endpoints captured

- A2A agent URL: https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e
- A2A HTTP+JSON interface URL: https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/a2a-http-json
- MCP URL: https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/mcp
- A2A agent card URL: https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/.well-known/agent-card.json

These are technical integration endpoints, not polished marketplace landing pages. For judges and end users, RX Guard should be presented through the Prompt Opinion chat/A2A agent experience.

## Repo

https://github.com/mikepatraw/rx-guard
