# RX Guard Prompt Opinion Wrapper Specification

## 1. Purpose

This document defines how the current local RX Guard MVP should be wrapped for use inside the Prompt Opinion platform.

The local MVP already provides:
- synthetic input handling
- normalization
- rules-based review
- structured JSON response
- local server endpoint

The missing layer is the **Prompt Opinion-facing agent wrapper** that makes RX Guard invokable as a compliant hackathon submission artifact.

## 2. Wrapper Goal

Turn the current RX Guard engine into a Prompt Opinion-compatible **BYO Agent with A2A enabled** that:
- accepts healthcare-aware context
- invokes the review pipeline
- returns structured, explainable results
- is publishable in the Prompt Opinion Marketplace

## 3. Design Constraints

The wrapper should:
- preserve synthetic/de-identified-only usage for hackathon demo
- keep the clinician-support framing intact
- pass through FHIR-aware context when available
- avoid hard-coding Prompt Opinion UI assumptions until account access confirms them
- minimize changes to the internal review engine

## 4. Current Internal Contract

### Internal request shape
RX Guard already expects a normalized request with:
- requestId
- synthetic flag
- patient
- encounter
- conditions
- active medications
- allergies
- proposed medication
- monitoring summary
- risk indicators
- note text
- optional source metadata

### Internal response shape
RX Guard already returns:
- status
- riskLevel
- summary
- flags
- missingDocumentation
- suggestedLanguage
- metadata

This is good. The wrapper should adapt the platform request into this format, not rewrite the engine.

## 5. Proposed Wrapper Layers

```text
Prompt Opinion Invocation
          |
          v
Prompt Opinion Adapter Layer
          |
          v
RX Guard Request Mapper
          |
          v
normalizeReviewRequest()
          |
          v
reviewEncounter()
          |
          v
RX Guard Response Mapper
          |
          v
Prompt Opinion Agent Response
```

## 6. Responsibilities of the Wrapper

### 6.1 Platform Request Adapter
Responsibilities:
- receive Prompt Opinion invocation payload
- extract user/task/context fields relevant to RX Guard
- identify where synthetic FHIR-like context lives
- validate minimum required inputs

### 6.2 Request Mapper
Responsibilities:
- convert platform payload into RX Guard `ReviewRequest`
- synthesize missing optional fields into safe defaults
- preserve patient/encounter linkage in synthetic-safe metadata

### 6.3 Response Mapper
Responsibilities:
- convert RX Guard response into whatever Prompt Opinion expects for agent output
- retain structured machine-readable content when possible
- present human-readable summary in a clean format for demo use

## 7. Proposed Wrapper Request Inputs

The Prompt Opinion-facing wrapper will likely need to handle some mix of:
- agent invocation metadata
- patient context
- encounter context
- structured healthcare data (FHIR or FHIR-like)
- note text
- medication request context

### Minimum required mapping into RX Guard
- `requestId`
- `synthetic=true`
- `patient.id`
- `encounter.id`
- `encounter.type`
- `proposedMedication.name`
- `noteText`

## 8. Proposed Wrapper Output Strategy

The safest output pattern is dual-layer:

### Human-facing layer
- short review summary
- top concerns
- missing documentation list
- suggested language

### Structured layer
- raw flags array
- risk level
- metadata

If Prompt Opinion supports richer structured outputs, we should preserve the full JSON. If not, we should still serialize it in a way that can be shown or passed along.

## 9. SHARP / FHIR Context Handling

The hackathon page strongly emphasizes SHARP extension specs and FHIR context propagation.

### Wrapper strategy
The wrapper should be prepared to accept:
- patient identifier context
- encounter identifier context
- FHIR token/context references
- structured resource bundles or extracted summaries

### MVP-safe implementation
Even if live FHIR access is unavailable, the wrapper can still demonstrate healthcare-context awareness by:
- accepting synthetic patient and encounter IDs
- consuming FHIR-inspired structured payloads
- documenting how SHARP/FHIR context would be used in production

## 10. Proposed Wrapper Modes

### Mode A: Direct synthetic payload mode
Prompt Opinion invokes RX Guard with a structured synthetic case payload.

Best for:
- fastest hackathon integration
- minimal moving parts
- reliable demo
- simplest path for a BYO Agent with A2A enabled

### Mode B: FHIR-context mapping mode
Prompt Opinion provides healthcare context plus note text, and the wrapper maps that into RX Guard request fields.

Best for:
- stronger standards story
- more authentic healthcare-agent framing

### Recommendation
Start with **Mode A** for reliable integration and publishability, then layer in Mode B if platform setup is straightforward.

## 11. Expected Marketplace Metadata

We cannot confirm exact required fields without platform access, but RX Guard should be prepared with:
- title: `RX Guard`
- one-line description
- longer description
- category/tags
- invocation instructions
- sample input/output
- safety statement

## 12. Suggested Agent Description

**RX Guard** is a FHIR-aware prescribing safety agent that reviews synthetic controlled-substance prescribing encounters, identifies documentation gaps and contextual risk factors, and returns explainable guidance for clinician review before a prescription is finalized.

## 13. Suggested Safety Statement

RX Guard is a clinician-support tool for synthetic or de-identified data. It does not autonomously approve or deny prescriptions, replace clinician judgment, or provide legal determinations.

## 14. Wrapper Implementation Plan

### Step 1
Confirm Prompt Opinion agent creation flow and input/output model.

### Step 2
Create adapter module that maps platform payloads into `ReviewRequest`.

### Step 3
Create response mapper for clean in-platform output.

### Step 4
Validate one synthetic case end-to-end.

### Step 5
Refine for marketplace publication and demo.

## 15. Minimal Technical Deliverable for Wrapper

When account access is available, the smallest acceptable wrapper deliverable is:
- one invokable Prompt Opinion agent
- one reliable synthetic case input path
- one successful review response rendered in-platform
- one marketplace listing

That is enough to satisfy the hackathon structure if the demo is clean.

## 16. Open Questions Requiring Prompt Opinion Access

These are the questions we cannot fully answer until we can inspect the platform directly:
- How are structured outputs displayed in the final chat session UX?
- How are SHARP/FHIR context objects passed into the agent during real Prompt Opinion chat invocation?
- What exact marketplace listing URL pattern is exposed to end users after publication?
- Why can Launchpad still show stale native-template-style copy even after a BYO/A2A agent is published and chat-selectable?
- What is the cleanest user-facing invocation flow for a published BYO/A2A agent from the workspace?

## 16.1 Confirmed live Prompt Opinion endpoints

Current live endpoints captured from Prompt Opinion:
- MCP URL: `https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/mcp`
- A2A URL: `https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/.well-known/agent-card.json`

These confirm that Prompt Opinion has provisioned RX Guard as a concrete BYO agent artifact with both MCP and A2A surfaces, even though the intended end-user/demo path remains the chat/A2A flow rather than a custom MCP-tools experience.

## 17. Decision

Current platform exploration suggests the final hackathon path should target a stable internal engine plus a thin **BYO Agent / A2A** wrapper, rather than relying on native Po Agent templates alone.

That keeps the architecture sane and minimizes rework once the final Prompt Opinion publication requirements are confirmed.
