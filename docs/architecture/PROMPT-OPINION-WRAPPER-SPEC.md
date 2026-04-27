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

## 14. Wrapper Implementation Status

### Step 1
Confirm Prompt Opinion agent creation flow and input/output model. **Done for the current BYO/A2A submission path.**

### Step 2
Create adapter module that maps realistic synthetic intake into safe Prompt Opinion context. **Done locally in `src/cli/local-adapter.ts`.**

### Step 3
Create response mapper for compact Prompt Opinion-compatible output. **Done for deterministic local/staging output using `pdmp_summary_status` instead of nested PDMP rows.**

### Step 4
Validate one synthetic case end-to-end. **Done locally and in public staging for `RXG-SB-001`; final Prompt Opinion in-platform recording remains.**

### Step 5
Refine for marketplace publication and demo. **Marketplace publication/A2A enablement is documented; final polished listing URL and recording remain.**

## 15. Minimal Technical Deliverable for Wrapper

The smallest acceptable wrapper deliverable is:
- one invokable Prompt Opinion agent
- one reliable synthetic case input path
- one successful compact review response through the Prompt Opinion chat/A2A path
- one marketplace listing or clear marketplace discoverability path
- one polished RX Guard workflow renderer showing how the agent output becomes clinician-facing UI

The public Vercel staging UI satisfies the renderer/partner-test portion, but the final submission still needs Prompt Opinion in-platform invocation evidence if the rules require it.

## 16. Remaining Prompt Opinion Validation Questions

These should be checked during the final recording pass:
- How cleanly does the final chat session display the compact JSON/decision-support output?
- What exact marketplace listing URL or discoverability path should be copied into Devpost?
- Does the final selected agent/session path avoid stale Launchpad template wording?
- What is the cleanest visible path from marketplace/chat selection to one successful `RXG-SB-001` invocation?

## 16.1 Confirmed live Prompt Opinion endpoints

Current live endpoints captured from Prompt Opinion:
- MCP URL: `https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/mcp`
- A2A URL: `https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/.well-known/agent-card.json`

These confirm that Prompt Opinion has provisioned RX Guard as a concrete BYO agent artifact with both MCP and A2A surfaces, even though the intended end-user/demo path remains the chat/A2A flow rather than a custom MCP-tools experience.

## 17. Decision

Current platform exploration supports a stable RX Guard synthetic data/workflow renderer plus a thin **BYO Agent / A2A** Prompt Opinion contract, rather than relying on native Po Agent templates alone.

Keep the Vercel staging site framed as a Prompt Opinion-compatible synthetic renderer, not as a live Prompt Opinion API integration or a production prescription database.
