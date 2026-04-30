# Agents Assemble Competition Rules and RX Guard Compliance Review

This document summarizes the rules, requirements, and judging expectations for **Agents Assemble: The Healthcare AI Endgame** and reviews RX Guard’s current repository state against them.

Source material: challenge description provided from Devpost / Prompt Opinion for the March 4, 2026 – May 11, 2026 submission period.

## Competition summary

Agents Assemble asks builders to create interoperable healthcare AI solutions on the Prompt Opinion platform. Submissions should demonstrate how agents or tools can bridge the “last mile” between AI reasoning and actionable healthcare deliverables.

The competition emphasizes:

- interoperability across modern agent standards
- healthcare context propagation using Prompt Opinion’s SHARP extension specs
- FHIR-aware data handling
- marketplace publication inside Prompt Opinion
- practical clinical workflow value
- a short demo showing the solution working inside Prompt Opinion

## Submission period and prizes

- **Submission period:** Monday, March 4, 2026 – Monday, May 11, 2026
- **Winners announced:** on or around Wednesday, May 27, 2026
- **Total prize pool:** $25,000 USD
- **1st prize:** $7,500
- **2nd prize:** $5,000
- **3rd prize:** $2,500
- **Honorable mentions:** 10 awards of $1,000 each

## Allowed technical paths

Submissions can choose one of two paths.

### Option 1: Superpower, powered by MCP

Build an MCP server that exposes healthcare-relevant tools. These tools may or may not use patient data. The intent is to create a reusable capability that agents can invoke.

### Option 2: Agent, powered by A2A

Build or configure an intelligent healthcare agent that can perform a specific workflow and collaborate through Prompt Opinion’s Conversational Interoperability (COIN) and Agent-to-Agent (A2A) support.

Prompt Opinion says builders do not need to implement A2A protocol mechanics directly if they configure an agent on the platform; the platform handles the communication layer.

## Required platform workflow

The challenge requires use of the Prompt Opinion platform:

1. **Register** for the hackathon and create a free Prompt Opinion account.
2. **Build** an MCP server or A2A agent using builder infrastructure, reference implementations, or Prompt Opinion’s no-code / platform agent configuration.
3. **Integrate** using SHARP extension specs for healthcare context such as patient IDs and FHIR tokens.
4. **Publish** the project to the Prompt Opinion Marketplace so it can be discovered and invoked.
5. **Submit** a demo video under 3 minutes showing the project functioning inside Prompt Opinion.

FHIR server data is highly recommended, but the challenge text does not make it strictly required.

## Judging criteria

### AI Factor

The solution should use generative AI for work that traditional rule-based software cannot fully address.

### Potential Impact

The solution should address a meaningful healthcare pain point and explain how it could improve outcomes, reduce cost, or save time.

### Feasibility

The architecture should plausibly fit a real healthcare system and respect privacy, safety, and regulatory constraints.

## RX Guard chosen path

RX Guard is framed as an **A2A healthcare agent**, not an MCP-superpower-first submission.

Current repo evidence:

- README frames RX Guard as a “Prompt Opinion-published, A2A-enabled prescribing safety agent.”
- `docs/product/SUBMISSION-CHECKLIST.md` selects **Path B: A2A Agent**.
- `docs/architecture/BYO-A2A-INTEGRATION-PLAN.md` documents the Prompt Opinion BYO Agent / A2A path.
- `src/api/byo-a2a.ts` and `/byo-a2a/invoke` in `src/api/server.ts` provide a provisional wrapper endpoint for BYO/A2A invocation shaping.
- `src/cli/local-adapter.ts` maps realistic synthetic encounter fields to the safe `RXG-SB-001` key and produces the compact Prompt Opinion-compatible payload/response contract.
- `public/` and `docs/product/STAGING-TEST-GUIDE.md` document the live Vercel staging UI at `https://rx-guard-iota.vercel.app` for public workflow review.

## Compliance review

| Requirement / expectation | Current RX Guard status | Assessment |
| --- | --- | --- |
| Use Prompt Opinion platform | Repo docs state RX Guard is published in Prompt Opinion Marketplace and A2A-enabled; staging docs explain the Prompt Opinion-compatible handoff. | **Appears aligned**, but final in-platform invocation should still be recorded before submission. |
| Choose MCP Superpower or A2A Agent path | RX Guard clearly chooses the A2A Agent path. | **Aligned.** |
| Marketplace publication | README and checklist say RX Guard has been published. | **Appears aligned**, pending final polished marketplace URL/details for submission materials. |
| Demo under 3 minutes inside Prompt Opinion | Demo script exists; public Vercel staging is ready for partner workflow testing. | **Not complete** until final Prompt Opinion in-platform recording is captured. |
| SHARP extension specs / healthcare context propagation | Checklist says FHIR context extension is enabled; architecture describes SHARP/FHIR context propagation. Local code has a `source.fhirContext` marker but no full SHARP payload handling. | **Partially aligned.** Needs final evidence from Prompt Opinion configuration and clearer mapping of SHARP context fields used by RX Guard. |
| FHIR-aware data handling | Repo has `src/fhir/normalize.ts`, FHIR-inspired types, and FHIR-aware architecture docs. | **Directionally aligned**, but current implementation is a simplified FHIR-inspired shape rather than full FHIR resource parsing. This is acceptable for MVP if presented honestly. |
| FHIR server data | Synthetic local fixtures and PDMP-style sample data are used; no live prescription/PDMP database is included. | **Acceptable but not maximized.** The challenge recommends FHIR server data but does not require it. This is the right tradeoff for a safe submission MVP. |
| Synthetic / de-identified data | README, schemas, and docs repeatedly state synthetic/de-identified data only; request schema requires `synthetic: true`. | **Aligned.** Keep all demo screenshots and video synthetic-only. |
| AI Factor | Docs describe Prompt Opinion as the agent layer and RX Guard as the clinical data/UI renderer. Local code keeps deterministic fallback output for reliable staging. | **Partially aligned.** The submission should explicitly show Prompt Opinion producing the compact decision-support payload so judges see the model-backed layer. |
| Human-in-the-loop safety | README and architecture explicitly say RX Guard is not an autonomous prescriber and does not replace clinician judgment. | **Aligned.** |
| Feasibility / privacy / safety | Narrow scope, synthetic data, no persistent PHI storage, and conservative language are documented. | **Aligned for hackathon MVP.** |
| A2A implementation readiness | BYO/A2A configuration, local adapter, contract docs, and staging renderer exist; local tests pass. | **Partially aligned.** Final Prompt Opinion chat/A2A invocation evidence still needs to be captured for submission. |

## Code and repo review findings

### What is within the guidelines

- RX Guard targets a specific healthcare workflow: controlled-substance prescribing safety and documentation review.
- The repo positions the tool as clinician-support guidance rather than autonomous clinical decision-making.
- The request schema requires `synthetic: true`, which supports the synthetic/de-identified-data posture.
- The TypeScript review path runs locally and returns structured, explainable output.
- The provisional A2A wrapper keeps Prompt Opinion transport separate from the internal review engine, which is a good interoperability design.
- The local engine avoids live EHR or live PDMP integration and uses synthetic fixtures, reducing privacy and regulatory risk for the demo.
- The public staging UI starts from medication selection, auto-triggers RX Guard for the controlled-medication case, and hides raw JSON/payload details from partner testers.
- The documentation now clearly separates Prompt Opinion as the published agent layer from Vercel staging as the low-friction workflow renderer.

### Gaps to close before final submission

1. **Record final Prompt Opinion invocation evidence.** The clean chat/A2A path is the most important remaining submission-readiness gap.
2. **Capture marketplace URL/details.** Technical agent URLs are documented, but the Devpost draft still needs the polished marketplace listing URL or final discoverability details.
3. **Record the under-3-minute in-platform demo.** The script exists; the final video remains a required artifact.
4. **Keep the database story scoped.** Do not build a live prescription/PDMP database before submission. RX Guard should describe production data access as future authorized EHR/PDMP/FHIR integration through a secure clinical data layer.
5. **Show the model-backed layer honestly.** The Vercel staging UI is deterministic and synthetic; the final Prompt Opinion clip should show the published agent producing the compact decision-support payload.
6. **Keep FHIR claims precise.** RX Guard is currently FHIR-aware / FHIR-inspired. Avoid claiming full FHIR server integration unless that is added and validated.

## Recommended competition positioning

RX Guard should be submitted as:

> A Prompt Opinion-compatible A2A healthcare agent workflow for synthetic controlled-substance prescribing review. Prompt Opinion provides the compact decision-support agent output; RX Guard provides the synthetic clinical data adapter and EHR-style workflow renderer that turns that output into clinician-readable risk guidance before a prescription is finalized.

Avoid positioning RX Guard as:

- a production clinical decision support system
- a prescribing approval or denial engine
- a fraud, abuse, or diversion detector
- a live EHR / PDMP integration unless those integrations are actually demonstrated
- a Prompt Opinion-hosted prescription database
- a full FHIR server implementation unless that is added

## Submission-readiness verdict

RX Guard is **directionally within the competition guidelines** and is well aligned with the A2A Agent path, synthetic-data posture, human-in-the-loop safety framing, and marketplace-oriented workflow.

It is **not fully submission-ready yet** because the final Prompt Opinion chat/A2A invocation evidence, marketplace URL/details, and under-3-minute demo video still need final validation or capture.

The safest path is to present the current implementation as a narrow, feasible, synthetic-data MVP: Prompt Opinion for the published agent/decision-support layer, RX Guard for the synthetic data adapter and EHR-style workflow renderer, and explicit clinician-review guardrails throughout.
