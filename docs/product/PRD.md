# RX Guard Product Requirements Document

## 1. Overview

RX Guard is a FHIR-aware prescribing safety agent for controlled-substance workflows. It reviews synthetic clinical encounter context, identifies documentation gaps and contextual prescribing risk factors, and returns explainable guidance before a prescription is finalized.

This project is scoped for the **Agents Assemble: The Healthcare AI Endgame** hackathon and is intentionally designed to fit the challenge’s interoperability, feasibility, and healthcare-safety expectations.

## 2. Problem Statement

Controlled-substance prescribing is clinically sensitive, operationally burdensome, and documentation-heavy. Clinicians may need to combine note content, medication context, patient risk factors, and monitoring expectations in limited time. Important information is often split across structured and unstructured data, which can lead to:

- missing or weak documentation
- inconsistent risk review
- overlooked contextual safety concerns
- avoidable chart rework
- difficulty defending prescribing rationale later

The first version of RX Guard is designed to reduce those failures by acting as a pre-sign review assistant, not as an autonomous prescribing authority.

## 3. Why Now

This is a good fit for the current healthcare-agent landscape because:

- healthcare AI is moving toward interoperable, composable agents
- FHIR-based context propagation makes targeted workflow assistance more realistic
- clinicians face growing documentation burden
- controlled-substance workflows are high-stakes and highly explainable in demo form
- the problem is meaningful without requiring a full enterprise integration stack on day one

## 4. Hackathon Objective

Build a healthcare AI agent that demonstrates successful integration into the Prompt Opinion platform and uses interoperable healthcare context to solve a real workflow problem.

For RX Guard, that objective becomes:

> Build a FHIR-aware Prompt Opinion chat / A2A prescribing safety agent that reviews synthetic controlled-substance prescribing encounters and returns explainable documentation and risk guidance within the Prompt Opinion platform.

## 5. Product Goal

Help clinicians catch documentation gaps and contextual prescribing risks before controlled-substance prescriptions are finalized.

## 6. Non-Goals

RX Guard MVP will **not**:

- autonomously approve or deny prescriptions
- replace clinician judgment
- use live PHI
- require live EHR integration
- require live PDMP integration
- claim fraud detection or law-enforcement capability
- provide production-grade regulatory guarantees across all jurisdictions

## 7. Target Users

### Primary user
- outpatient clinician prescribing a controlled substance in a time-constrained workflow

### Secondary users
- clinical quality reviewer
- compliance or safety stakeholder
- hackathon judges evaluating healthcare relevance and feasibility

## 8. Core Use Case

A clinician has a synthetic patient encounter and is preparing a controlled-substance prescription. RX Guard receives the encounter context, analyzes the note and structured clinical data, identifies documentation and safety issues, and returns explainable recommendations for review before the prescription is finalized.

## 9. User Story

**As a clinician**, I want an agent to review my draft controlled-substance prescribing encounter and tell me what documentation or safety context may be missing, so I can make a safer and more defensible decision without manually assembling every requirement from scratch.

## 10. MVP Scope

### In scope
- ingest synthetic encounter context
- consume structured clinical data and unstructured note text
- identify missing documentation elements
- identify contextual prescribing risk signals
- generate explainable findings
- suggest chart-ready documentation language
- produce structured output suitable for an interoperable agent workflow
- run inside or alongside the Prompt Opinion platform as an A2A agent

### Out of scope
- production EHR integrations
- live pharmacy or PDMP querying
- clinician identity / auth workflows beyond hackathon needs
- billing, coding, or reimbursement optimization
- automated prescription transmission
- longitudinal analytics dashboard beyond simple demo summaries

## 11. Sample Inputs

RX Guard MVP should accept synthetic or de-identified inputs such as:

- patient demographics
- encounter context
- conditions / diagnoses
- active medications
- allergy list
- proposed medication request
- note text
- optional monitoring summary
- optional refill history summary
- optional risk-history indicators

## 12. Sample Outputs

RX Guard should return:

- overall review status or risk level
- list of flagged issues
- missing documentation checklist
- explanation for each issue
- suggested chart language
- structured response object for downstream agent consumption

Example output categories:
- missing PDMP review documentation
- opioid + benzodiazepine overlap risk
- no functional-goal language found
- unclear duration or rationale
- monitoring plan absent

## 13. Why AI is Necessary

A pure rules engine can flag fixed thresholds, but it struggles to reliably interpret messy note text and narrative justification. RX Guard uses AI because the value lies in:

- synthesizing structured and unstructured data together
- detecting whether rationale is present or absent in free text
- generating clinician-readable explanations
- drafting suggested documentation language

This directly supports the hackathon’s **AI Factor** criterion.

## 14. Why This Matters

This supports the hackathon’s **Potential Impact** criterion because the workflow problem is real and costly:

- clinicians spend time reviewing fragmented context
- missing documentation can create safety and compliance issues
- pre-sign support can reduce avoidable omissions and chart rework
- explainable review can make prescribing workflows more consistent

## 15. Why This Is Feasible

This supports the hackathon’s **Feasibility** criterion because RX Guard is intentionally constrained:

- uses synthetic or de-identified data only
- does not require live EHR or PDMP connectivity for MVP
- keeps humans in control
- focuses on decision support rather than autonomous action
- uses a narrow, clinically plausible workflow instead of a system-wide platform claim

## 16. Product Requirements

### Functional requirements
1. The system must accept synthetic patient and encounter context.
2. The system must ingest unstructured note text.
3. The system must analyze controlled-substance prescribing context.
4. The system must identify missing documentation elements.
5. The system must identify contextual safety concerns.
6. The system must generate explainable findings.
7. The system must generate suggested documentation text.
8. The system must return a structured response for downstream use.
9. The system must be demonstrable within the Prompt Opinion platform.
10. The system must be publishable/discoverable in the Prompt Opinion Marketplace.
11. The Prompt Opinion version must stay clinician-supportive, precise, and non-punitive.
12. The Prompt Opinion version must avoid unsupported inference about misuse or wrongdoing unless directly evidenced.

### Non-functional requirements
1. Must use synthetic or de-identified data only.
2. Must avoid storing real PHI.
3. Must keep the clinician as the final decision-maker.
4. Must produce a demo suitable for a video under 3 minutes.
5. Must be understandable to non-specialist judges.

## 17. Suggested Technical Approach

### Architecture
- **A2A agent** as primary hackathon artifact
- FHIR-context-aware input contract
- rule layer for deterministic checks
- LLM layer for narrative review and explanation
- structured output schema for findings and recommendations

### Suggested modules
- FHIR/context parser
- review engine
- explanation generator
- recommendation formatter
- synthetic-case loader

## 18. Demo Scenario

### Recommended scenario
An outpatient prescribing encounter involving a controlled substance with at least one obvious contextual concern.

Example:
- opioid prescribed for pain follow-up
- concurrent benzodiazepine on active med list
- note lacks functional-goal language
- no monitoring plan documented

### Demo flow
1. Open synthetic encounter in platform.
2. Invoke RX Guard.
3. Show agent receiving FHIR-aware context.
4. Show findings and missing documentation.
5. Show suggested chart-ready language.
6. Show revised result or improved review state.

## 19. Success Criteria

### Hackathon success
- repo and artifact are cleanly scoped
- agent works in Prompt Opinion ecosystem
- synthetic FHIR-aware workflow is demonstrated
- value proposition is obvious in under 3 minutes
- judges can see AI value, clinical relevance, and feasibility

### Product success for MVP
- identifies key missing documentation in synthetic cases
- provides understandable explanations
- generates useful suggested note text
- demonstrates a believable clinician workflow improvement

## 20. Risks and Mitigations

### Risk: project sounds punitive or surveillance-oriented
**Mitigation:** frame as clinician-support and documentation-quality workflow assistance

### Risk: project appears medically overreaching
**Mitigation:** keep human-in-the-loop and avoid treatment recommendation claims

### Risk: integration complexity eats the hackathon
**Mitigation:** use synthetic FHIR inputs and a narrow agent flow

### Risk: demo becomes too abstract
**Mitigation:** build a concrete before/after encounter review scenario

## 21. Open Questions

- Which controlled-substance use case should be the primary demo: opioid, stimulant, or benzodiazepine-related?
- How much FHIR realism is needed versus a simplified structured payload?
- Should the first demo include a separate tool call, or keep everything inside one agent for speed?
- What exact response schema best fits Prompt Opinion marketplace expectations?

## 22. Recommended Next Docs

After this PRD, the next useful documents are:

1. architecture spec
2. synthetic demo case definitions
3. response schema / agent contract
4. demo script
