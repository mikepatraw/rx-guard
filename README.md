# RX Guard

RX Guard is a FHIR-aware prescribing safety agent for controlled-substance workflows. It reviews synthetic prescribing encounters, identifies documentation gaps and contextual risk factors, and returns explainable guidance before a prescription is finalized.

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
│   ├── engine/
│   ├── fhir/
│   └── types/
└── .gitignore
```

## Current MVP status

The repository now includes a working hybrid MVP foundation with:
- request and response schemas
- synthetic demo cases
- a Prompt Opinion submission checklist and wrapper plan
- a prompt spec for the AI review layer
- a TypeScript rules engine skeleton
- AI-style explanation synthesis layered on top of rules
- a simple local HTTP server
- CLI-style case runners for demo review
- basic test coverage for the review core
- demo script and Devpost draft

## Repo docs

- Product requirements: `docs/product/PRD.md`
- Architecture: `docs/architecture/ARCHITECTURE.md`
- Prompt Opinion wrapper plan: `docs/architecture/PROMPT-OPINION-WRAPPER-SPEC.md`
- Submission checklist: `docs/product/SUBMISSION-CHECKLIST.md`
- Demo script: `docs/product/DEMO-SCRIPT.md`
- Devpost draft: `docs/product/DEVPOST-DRAFT.md`

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
```

### Start the local server

```bash
npm start
```

Then POST a review request to:

```text
http://localhost:8787/review
```

Health endpoint:

```text
http://localhost:8787/health
```

## Remaining work

1. Improve normalization for FHIR-like inputs
2. Replace the local AI-style explanation synthesis with a true model-backed layer when platform/runtime details are finalized
3. Wire the MVP into Prompt Opinion-compatible agent flow
4. Validate marketplace publication and in-platform invocation
5. Record the final in-platform demo

## License

TBD
