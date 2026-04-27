# RX Guard

RX Guard is a Prompt Opinion-published, A2A-enabled prescribing safety agent for controlled-substance workflows. It reviews synthetic prescribing encounters, identifies documentation gaps and contextual risk factors, and returns explainable clinician-support guidance before a prescription is finalized.

## Why this project exists

Controlled-substance prescribing workflows are high-friction and high-stakes. Clinicians often need to combine note content, medication context, risk factors, and policy expectations under time pressure. RX Guard is designed to make that review faster, clearer, and more defensible.

## Hackathon framing

This project is being scoped for the **Agents Assemble: The Healthcare AI Endgame** challenge.

RX Guard is intentionally framed as:
- an interoperable healthcare agent
- human-in-the-loop decision support
- synthetic/de-identified data only
- FHIR-context-aware
- focused on documentation quality and prescribing safety review

RX Guard is intentionally **not** framed as:
- an autonomous prescribing decision-maker
- a live EHR/PDMP integration product for day one
- a fraud accusation engine
- a replacement for clinician judgment

## MVP

The current MVP:
- ingests a synthetic prescribing encounter
- inspects note text and structured clinical context
- flags missing documentation and prescribing risk signals
- generates hybrid rule-based and AI-style review output
- explains why each issue matters
- suggests chart-ready language for clinician review

## Inputs

- synthetic patient context
- encounter summary
- note text
- medication request
- active medications
- diagnoses / conditions
- allergies
- optional prior-fill or monitoring summary

## Outputs

- risk summary
- missing documentation checklist
- explainable findings
- suggested documentation language
- structured review result for downstream agent/tool use

## Initial repository structure

```text
rx-guard/
├── README.md
├── docs/
│   ├── product/
│   ├── architecture/
│   └── research/
├── agent/
│   ├── prompts/
│   ├── schemas/
│   └── examples/
├── data/
│   ├── synthetic/
│   └── fixtures/
├── src/
│   ├── api/
│   ├── cli/
│   ├── engine/
│   ├── fhir/
│   └── types/
└── .gitignore
```

## Current status

RX Guard now has:
- a working hybrid MVP review engine
- synthetic demo cases
- Prompt Opinion marketplace publication
- A2A enabled on the published agent
- free-tier Prompt Opinion model configuration validated
- repo docs aligned to the Prompt Opinion chat/A2A path
- a provisional BYO/A2A wrapper endpoint for local shaping
- a local CLI adapter that accepts realistic encounter fields, resolves the synthetic case key, and renders Prompt Opinion-style decision support
- a connected static EHR-style demo UI that reads the local adapter's generated Sheila Bankston payload, renders deterministic PDMP rows, and drives workflow buttons

## Current MVP status

The repository now includes a working hybrid MVP foundation with:
- request and response schemas
- synthetic demo cases
- a Prompt Opinion submission checklist and wrapper plan
- a prompt spec for the AI review layer
- a TypeScript rules engine skeleton
- AI-style explanation synthesis layered on top of rules
- a simple local HTTP server
- a provisional BYO/A2A adapter endpoint for shaping external invocation
- CLI-style case runners for demo review
- a local CLI adapter for the realistic encounter → synthetic key → Prompt Opinion-safe JSON → RX Guard-rendered PDMP flow
- basic test coverage for the review core
- demo script and Devpost draft
- Prompt Opinion chat/A2A calibration guidance

## Repo docs

- Product requirements: `docs/product/PRD.md`
- Architecture: `docs/architecture/ARCHITECTURE.md`
- Prompt Opinion wrapper plan: `docs/architecture/PROMPT-OPINION-WRAPPER-SPEC.md`
- BYO/A2A integration plan: `docs/architecture/BYO-A2A-INTEGRATION-PLAN.md`
- Submission checklist: `docs/product/SUBMISSION-CHECKLIST.md`
- Competition rules and compliance review: `docs/product/COMPETITION-RULES-AND-COMPLIANCE.md`
- Demo script: `docs/product/DEMO-SCRIPT.md`
- Demo UI walkthrough: `docs/product/DEMO-UI-WALKTHROUGH.md`
- Devpost draft: `docs/product/DEVPOST-DRAFT.md`
- Prompt Opinion chat calibration: `docs/product/PROMPT-OPINION-CHAT-CALIBRATION.md`
- Prompt Opinion BYO Agent configuration: `docs/product/PROMPT-OPINION-BYO-AGENT-CONFIG.md`
- Prompt Opinion copy-paste System Prompt: `docs/product/PROMPT-OPINION-SYSTEM-PROMPT.md`

## Run locally

### Install

```bash
npm install
```

### Run tests

```bash
npm test
```

### Review a synthetic case

```bash
npm run review:case1
npm run review:case2
npm run review:case3
npm run review:case4
```

### Run the local Prompt Opinion adapter demo

```bash
npm run review:local -- \
  --name "Sheila Bankston" \
  --dob "1960-06-13" \
  --medication "Xanax 1 mg tablet" \
  --directions "1 tablet PO BID PRN for anxiety" \
  --history "no recent narcotic or controlled-substance use" \
  --note "PDMP review not yet documented"
```

The local adapter demonstrates the intended handoff without requiring a live Prompt Opinion API call: RX Guard accepts realistic EHR-style encounter fields, resolves the synthetic patient to `RXG-SB-001`, sends only the synthetic key and clinical facts through the Prompt Opinion-safe payload, then renders compact decision-support JSON together with deterministic local PDMP rows.

### Start the local server

```bash
npm start
```

### Launch the static EHR demo UI

```bash
npm run demo:ui
```

Then open:

```text
http://localhost:4173
```

The UI opens on a synthetic eCW-style medication page. `npm run demo:ui` first builds `public/demo-data.js` from the same local adapter used by `npm run review:local`, then the page reads that payload to render the Sheila Bankston RXGuard analysis, deterministic local PDMP rows, and Proceed / Proceed with Caution / Do Not Prescribe workflow buttons. See `docs/product/DEMO-UI-WALKTHROUGH.md` for the recording flow.

Then POST a review request to:

```text
http://localhost:8787/review
```

Health endpoint:

```text
http://localhost:8787/health
```

## Prompt Opinion demo path

The current intended live/demo path is:
1. enter realistic encounter fields locally for the synthetic Sheila Bankston scenario
2. let the RX Guard CLI/local adapter resolve the encounter to `RXG-SB-001`
3. send the synthetic key and clinical facts through the Prompt Opinion-safe compact JSON contract
4. render the deterministic local PDMP rows and EHR-style controlled-substance risk modal in RX Guard
5. click the appropriate workflow action for the synthetic case, usually **Do Not Prescribe** for the high-risk Sheila Bankston scenario
6. reinforce that the output is clinician-support guidance, not an autonomous prescribing decision

## Remaining work

1. Improve normalization for FHIR-like inputs
2. Replace the local AI-style explanation synthesis with a true model-backed layer when platform/runtime details are finalized
3. Validate the end-user Prompt Opinion chat invocation flow on a synthetic case through the published **BYO Agent with A2A enabled** path
4. Capture the final marketplace listing URL/details and fold them into submission materials
5. Record the final in-platform demo

## Current Prompt Opinion findings

Recent platform validation changed the expected integration path:

- A free Prompt Opinion account is sufficient to begin setup
- Free-tier model configuration works with `Google Gemini (FREE TIER)` using `Gemini 3 Flash Preview`
- Native `Po Agents` are useful for learning the platform, but the final publishable path is the **A2A-enabled BYO Agent** flow
- RX Guard is now published in Prompt Opinion Marketplace
- RX Guard has **A2A enabled** and is intended to be used through the **chat/A2A agent path**, not as a custom MCP-tools surface
- No custom MCP tools are exposed beyond built-in patient helpers
- The remaining live validation gap is confirming a clean synthetic-case invocation flow from Prompt Opinion chat, since Launchpad still showed stale template-style copy during browser inspection

Known live endpoints:
- A2A agent URL: `https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e`
- A2A HTTP+JSON interface URL: `https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/a2a-http-json`
- MCP URL: `https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/mcp`
- A2A agent card URL: `https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/.well-known/agent-card.json`

That means the current best submission path is:
1. finish the core RX Guard prompt/behavior
2. validate chat selection and synthetic-case invocation against the published BYO/A2A agent
3. capture the marketplace listing URL/details
4. record the in-platform demo against that final published path

## License

TBD


## Portfolio snapshot

- **Problem:** Controlled-substance prescribing reviews are high-stakes and documentation-heavy under time pressure.
- **Core capability:** FHIR-aware safety review with explainable guidance before finalizing a prescription.
- **Primary stack:** TypeScript agent workflow + healthcare data context.
- **Status:** Active MVP development.


## Related projects

- [rules-of-engagement](https://github.com/mikepatraw/rules-of-engagement) — policy guardrails for AI agents (private).\n- [agent-black-box](https://github.com/mikepatraw/agent-black-box) — flight recorder and incident reporting for agent runs.\n- [Fredsidian](https://github.com/mikepatraw/Fredsidian) — memory architecture for long-running assistants.
