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

The initial MVP will:
- ingest a synthetic prescribing encounter
- inspect note text and structured clinical context
- flag missing documentation and prescribing risk signals
- explain why each issue matters
- suggest chart-ready language for clinician review

## Proposed inputs

- synthetic patient context
- encounter summary
- note text
- medication request
- active medications
- diagnoses / conditions
- allergies
- optional prior-fill or monitoring summary

## Proposed outputs

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

## Near-term plan

1. Finalize a hackathon-specific product spec
2. Define the A2A agent workflow and FHIR context contract
3. Create synthetic patient cases for demo scenarios
4. Implement a first-pass review engine with explainable output
5. Prepare a short in-platform demo

## License

TBD
