# RX Guard BYO Agent / A2A Integration Plan

## Purpose

This document translates the recent Prompt Opinion platform findings into a concrete implementation direction for RX Guard.

The important shift is that a native `Po Agent` may be useful for platform exploration, but final marketplace publication appears to require a **BYO Agent with A2A enabled**.

## What we now know

From direct platform setup work:

- A free Prompt Opinion account is enough to begin setup.
- Free-tier model configuration works using `Google Gemini (FREE TIER)` with `Gemini 3 Flash Preview`.
- Native `Po Agents` are template-driven and can be useful for exploration, but they appear separate from the marketplace publish path.
- Marketplace Studio explicitly indicates only **A2A-enabled agents** can be published.
- Prompt Opinion directs users to the **BYO Agents** page to enable A2A.
- Publishing may also depend on subscription-level marketplace publishing entitlement.

## Current recommendation

Treat the native Po Agent path as exploratory only.

Treat the likely final submission artifact as:

- **RX Guard external/BYO agent**
- **A2A availability enabled**
- **discoverable from Marketplace Studio**
- **invokable within Prompt Opinion**

## Architectural stance

RX Guard should keep a thin separation between:

1. internal review engine
2. external HTTP transport
3. Prompt Opinion / A2A wrapper behavior

That means we should avoid embedding Prompt Opinion-specific assumptions into the core review logic.

## Existing assets we can reuse

Already in repo:

- `src/api/server.ts` provides a simple HTTP transport
- `src/api/review.ts` exposes a stable review function
- `src/fhir/normalize.ts` gives us a normalization boundary
- `src/types/review.ts` gives us a clear request/response contract

This is good news. We already have the right shape for a wrapper-first adaptation.

## Likely integration model

The most likely BYO/A2A path is:

```text
Prompt Opinion BYO Agent (A2A enabled)
            |
            v
   RX Guard HTTP endpoint / wrapper
            |
            v
     normalizeReviewRequest()
            |
            v
       reviewEncounter()
            |
            v
   Prompt Opinion-facing response mapping
```

## Practical implementation goal

Before we know the exact Prompt Opinion BYO contract, we should prepare an adapter layer rather than rewriting the server directly.

### Proposed near-term server behavior

Keep `/review` as the stable internal endpoint.

Add a second wrapper-oriented endpoint once the contract is clearer, for example:

- `/a2a/review`
- `/agent/invoke`
- `/prompt-opinion/invoke`

The exact path should remain provisional until platform requirements are confirmed.

## Suggested wrapper request model

The wrapper should be able to accept a broader payload and map it into the existing `ReviewRequest`.

### Inputs we should be ready for

- invocation metadata
- patient identifier or patient context
- encounter identifier or encounter context
- note text
- medication request context
- optional structured FHIR-like data
- optional platform metadata

### Internal target shape

Map everything into the existing `ReviewRequest` used by `reviewEncounter()`.

That is the stable internal contract and should remain the source of truth.

## Suggested wrapper response model

We should be ready to return both:

1. the existing structured `ReviewResponse`
2. a thinner Prompt Opinion-facing envelope if required

That means we may want to expose:

- `summary`
- `riskLevel`
- `flags`
- `missingDocumentation`
- `suggestedLanguage`
- lightweight platform metadata

## Near-term code changes worth making

### 1. Introduce an adapter module

Create a module that maps:

- external invocation payload -> `ReviewRequest`
- `ReviewResponse` -> platform-facing response

This avoids polluting the core engine.

### 2. Add a wrapper endpoint

Add a new endpoint that calls the adapter and then calls `reviewEncounter()`.

### 3. Preserve synthetic-only guardrails

Any wrapper should default to synthetic-safe assumptions and reject clearly unsupported payloads.

### 4. Keep prompt/model coupling loose

Do not hardwire Gemini into repo logic. Prompt Opinion may change models later. The repo should stay model-agnostic.

## Risks and unknowns

Still unknown:

- the exact BYO Agent request schema
- whether Prompt Opinion expects a single endpoint or richer A2A metadata
- whether A2A enablement needs additional skill descriptors or manifests
- whether marketplace publication is blocked by plan entitlement on the current account

## Decision for now

The next engineering move should be:

1. preserve the current local review engine
2. add a thin wrapper adapter layer
3. prepare for a BYO/A2A external integration path
4. wait to finalize transport details until the platform reveals the exact contract

This is the lowest-risk path that aligns with what the platform is currently telling us.
