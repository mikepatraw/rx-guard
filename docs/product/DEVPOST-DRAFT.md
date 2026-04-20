# RX Guard Devpost Draft

## Project name

RX Guard

## Tagline

A FHIR-aware prescribing safety agent that catches documentation gaps and contextual risk factors before controlled-substance prescriptions are finalized.

## Elevator pitch

RX Guard is a clinician-support healthcare AI agent that reviews synthetic controlled-substance prescribing encounters and returns explainable guidance before a prescription is finalized. It combines structured encounter context with note text to identify documentation gaps, contextual medication risks, and note-quality issues, then suggests chart-ready language for clinician review.

## What it does

RX Guard helps clinicians review high-friction prescribing encounters by analyzing synthetic patient and encounter context, active medications, proposed controlled-substance prescriptions, and note text. It flags missing documentation, highlights contextual concerns such as opioid and benzodiazepine overlap, and generates suggested language that can help strengthen the note before finalizing the prescription.

## Problem

Controlled-substance prescribing workflows are high-stakes and documentation-heavy. Important information is often split across the encounter note, medication list, and monitoring context, which can lead to weak documentation, inconsistent review, avoidable chart rework, and overlooked safety concerns. Existing workflows can be fragmented and time-consuming, especially when clinicians have to assemble context manually.

## Solution

RX Guard is designed as a FHIR-aware prescribing safety agent that turns fragmented encounter context into a structured, explainable pre-sign review. Instead of acting as an autonomous prescriber, it works as a human-in-the-loop support tool. It highlights what may be missing, explains why it matters, and suggests chart-ready language that the clinician can review and adapt.

## Why AI

A traditional rules engine can catch fixed thresholds, but it cannot reliably interpret sparse or messy clinical narrative on its own. RX Guard uses AI because the workflow requires combining structured clinical context with free-text note review, recognizing likely documentation gaps, and generating useful explanations and suggested note language. The goal is not just detection, but clearer clinical support.

## How we built it

We built RX Guard as a narrow MVP focused on feasibility and interoperability. The project includes:
- a TypeScript review engine
- structured request and response schemas
- synthetic demo cases
- a rules-based review layer
- a prompt specification for the AI explanation layer
- a local server and testable review flow
- architecture and submission planning for Prompt Opinion integration

The project is now framed as a Prompt Opinion chat / A2A healthcare agent. In the current hackathon setup, RX Guard has been published through Prompt Opinion Marketplace with A2A enabled, and the remaining work is focused on tightening the live chat response quality and final demo flow.

## Key features

- synthetic controlled-substance encounter review
- contextual medication risk detection
- documentation gap detection
- explainable review output
- suggested chart-ready language
- human-in-the-loop support model
- healthcare-agent architecture designed for interoperable workflows

## Impact

RX Guard targets a real workflow problem: helping clinicians create safer, more defensible controlled-substance documentation with less friction. The expected value is reduced chart rework, more consistent review of contextual risk factors, and faster identification of missing documentation before the prescription is finalized.

## Feasibility and safety

RX Guard is intentionally narrow. It uses synthetic or de-identified data only, keeps the clinician in control, and does not autonomously approve or deny prescriptions. The project is framed as documentation and safety review support, not diagnosis, not law enforcement, and not a replacement for clinical judgment.

## What’s next

Next steps include tightening the live Prompt Opinion response style, validating the final synthetic-case chat flow, capturing the final marketplace listing URL/details, and refining the AI explanation layer so the published agent stays concise, clinician-supportive, and demo-ready.

## Built for

Agents Assemble: The Healthcare AI Endgame

## Prompt Opinion endpoints captured

- A2A agent URL: https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e
- A2A HTTP+JSON interface URL: https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/a2a-http-json
- MCP URL: https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/mcp
- A2A agent card URL: https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/.well-known/agent-card.json

These are technical integration endpoints, not polished marketplace landing pages. For judges and end users, RX Guard should be presented through the Prompt Opinion chat/A2A agent experience.

## Repo

https://github.com/RedParrotBerkeley/rx-guard
