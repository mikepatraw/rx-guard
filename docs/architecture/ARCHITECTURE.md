# RX Guard Architecture Specification

## 1. Purpose

This document defines the technical architecture for RX Guard’s hackathon MVP.

RX Guard is a FHIR-aware prescribing safety agent designed for controlled-substance workflow review. The architecture is intentionally narrow, explainable, and feasible for the **Agents Assemble: The Healthcare AI Endgame** challenge.

The goal is to build a believable healthcare agent that can operate with synthetic clinical context, produce useful review output, and integrate cleanly into the Prompt Opinion ecosystem.

## 2. Architecture Principles

RX Guard should be built around the following principles:

- **Interoperable first**: model the system as an agent that receives healthcare context and returns structured output
- **FHIR-aware, not FHIR-maximalist**: support a small useful subset of FHIR resources instead of overbuilding
- **Human-in-the-loop**: provide review guidance, not autonomous prescribing decisions
- **Explainable by default**: every flagged issue should include rationale
- **Synthetic-data safe**: no real PHI required anywhere in MVP
- **Composable**: internal components should be separable enough to evolve into tools or MCP services later
- **Demo-oriented**: architecture must support a clear, fast, under-3-minute demo path

## 3. System Context

### External environment
RX Guard will exist within the Prompt Opinion ecosystem as an **A2A agent**.

The surrounding ecosystem is expected to provide:
- an agent workspace or invocation surface
- context passing compatible with healthcare workflows
- marketplace discovery/invocation
- support for interoperable standards including A2A and SHARP/FHIR context propagation

### RX Guard role
RX Guard’s job is to:
1. receive a prescribing review request
2. consume clinical context and note content
3. analyze documentation completeness and contextual safety concerns
4. produce structured, explainable output
5. return recommended documentation improvements

## 4. High-Level Architecture

```text
Prompt Opinion Platform
        |
        v
  RX Guard A2A Agent
        |
        +-----------------------------+
        |                             |
        v                             v
Context Intake Layer          Review Orchestration Layer
        |                             |
        v                             v
FHIR/Encounter Parser ----> Rules + AI Review Engine
                                      |
                                      v
                           Explanation + Recommendation Layer
                                      |
                                      v
                            Structured Response Formatter
                                      |
                                      v
                         Agent Response / Marketplace Output
```

## 5. Main Components

## 5.1 A2A Agent Interface

This is the externally visible RX Guard agent.

Responsibilities:
- receive requests from the platform
- validate request shape
- invoke the review pipeline
- return structured results
- expose a stable interface suitable for demo and future marketplace publication

Inputs:
- synthetic patient/encounter context
- note text
- medication request context
- optional monitoring history

Outputs:
- review summary
- flags
- explanations
- suggested documentation language
- structured response payload

## 5.2 Context Intake Layer

The intake layer normalizes incoming payloads into a consistent internal format.

Responsibilities:
- accept FHIR-like or simplified structured payloads
- normalize note text, meds, diagnoses, and risk indicators
- reject malformed or unsupported requests
- isolate external platform specifics from internal logic

This layer allows the rest of the system to work with a clean internal object model.

## 5.3 FHIR / Encounter Parser

The parser extracts only the fields needed for the MVP.

### Supported resources for MVP
- Patient
- Encounter
- Condition
- MedicationRequest
- MedicationStatement or medication list equivalent
- AllergyIntolerance
- Observation
- DocumentReference or note text equivalent

### Parsed fields of interest
- patient age / sex if included
- encounter type / timing
- diagnoses relevant to prescription context
- active medications
- proposed medication, dose, and duration
- allergies
- key observations or risk signals
- clinical note text

This parser should be deliberately conservative. If data is missing, the system should surface that as absence rather than inventing context.

## 5.4 Internal Review Model

After normalization, the system should convert input into an internal review object.

Example internal structure:

```json
{
  "encounterId": "enc-001",
  "patientSummary": {
    "age": 47,
    "sex": "female"
  },
  "proposedMedication": {
    "name": "oxycodone",
    "dose": "5 mg",
    "quantity": 14,
    "durationDays": 7
  },
  "activeMedications": ["alprazolam"],
  "conditions": ["chronic low back pain", "anxiety"],
  "noteText": "...",
  "monitoringSummary": {
    "pdmpDocumented": false,
    "udsAvailable": false
  }
}
```

This object becomes the contract passed into the review engine.

## 5.5 Review Orchestration Layer

The orchestration layer coordinates deterministic checks and LLM-based analysis.

Responsibilities:
- run rules checks first
- prepare context for narrative review
- call AI only after deterministic extraction/check steps are complete
- merge findings from both systems
- deduplicate or prioritize results

This separation improves explainability and makes debugging much easier.

## 5.6 Rules Engine

The rules engine handles deterministic checks.

### Rule categories
- missing documentation markers
- medication overlap risks
- unclear duration or quantity
- absence of monitoring language
- absence of rationale or functional-goal cues
- conflicting structured data signals

### Why rules first
- easier to verify
- good for obvious safety/documentation gaps
- reduces unnecessary LLM reasoning load
- produces stable baseline output for demo reliability

Rules should return structured flags like:

```json
{
  "code": "missing_pdmp_documentation",
  "severity": "moderate",
  "source": "rules",
  "message": "No PDMP review documentation was detected in the encounter context."
}
```

## 5.7 AI Review Engine

The AI layer handles contextual interpretation that rules alone cannot do well.

Responsibilities:
- assess whether narrative rationale is present
- evaluate whether note text appears to justify the prescription
- identify likely missing discussion topics
- generate readable explanations
- generate suggested documentation language for clinician review

### Appropriate AI tasks
- interpret messy clinical narrative
- synthesize structured and unstructured context together
- explain why a finding matters in plain language
- propose note additions based on detected gaps

### Inappropriate AI tasks for MVP
- making final prescribing decisions
- predicting legal liability
- diagnosing the patient
- presenting unsupported certainty

## 5.8 Explanation and Recommendation Layer

This layer converts findings into useful human-facing guidance.

Responsibilities:
- transform raw findings into grouped output
- attach explanation to each issue
- generate suggested chart-ready language
- distinguish high-confidence findings from softer observations

The explanation layer is important because the project’s value depends on clarity, not just detection.

## 5.9 Structured Response Formatter

This layer packages the final result for platform output.

### Proposed response sections
- review status
- summary
- flagged issues
- missing documentation checklist
- suggested note language
- metadata

### Example response shape

```json
{
  "status": "review_complete",
  "riskLevel": "moderate",
  "summary": "Encounter has documentation and safety gaps requiring clinician review.",
  "flags": [
    {
      "code": "opioid_benzo_overlap",
      "severity": "high",
      "explanation": "Active benzodiazepine therapy was found alongside the proposed opioid."
    }
  ],
  "missingDocumentation": [
    "PDMP review",
    "functional goal",
    "monitoring plan"
  ],
  "suggestedLanguage": [
    "Reviewed PDMP today with no unexpected fills identified.",
    "Treatment goal is improved daily function over the next 7 days."
  ],
  "metadata": {
    "synthetic": true,
    "version": "mvp"
  }
}
```

## 6. Data Flow

### End-to-end flow
1. Platform invokes RX Guard agent.
2. Agent receives synthetic encounter payload.
3. Intake layer validates and normalizes data.
4. FHIR parser extracts relevant clinical fields.
5. Internal review object is created.
6. Rules engine runs deterministic checks.
7. AI review engine evaluates narrative/contextual gaps.
8. Findings are merged and deduplicated.
9. Explanation layer generates user-facing output.
10. Structured response is returned to platform.

## 7. Minimal FHIR Scope

To stay feasible, RX Guard should support a **minimum viable FHIR subset**.

### Recommended resource subset
- `Patient`
- `Encounter`
- `Condition`
- `MedicationRequest`
- `MedicationStatement`
- `Observation`
- `AllergyIntolerance`
- `DocumentReference` or plain note text field

### Implementation note
The first implementation can accept a simplified JSON payload that is **FHIR-inspired**, then later map to richer FHIR resources if needed.

That is the practical move for a hackathon.

## 8. Interface Contract

### Request contract
The incoming request should contain:
- request ID
- synthetic flag
- patient context
- encounter context
- clinical note text
- medication request
- optional history/monitoring summary

### Response contract
The outgoing response should contain:
- status
- risk level
- summary
- flags with severities and explanations
- missing documentation list
- suggested note language
- trace metadata

## 9. Storage Strategy

For MVP, storage should be minimal.

### Recommended approach
- no persistent PHI storage
- synthetic test cases stored as local JSON fixtures
- optional logging limited to non-sensitive demo traces
- no database required unless needed for demo management

### If persistence is needed
Use a lightweight local store only for:
- demo scenarios
- response examples
- evaluation outputs

## 10. Deployment Shape

### MVP deployment options
1. **Single service**
   - simplest hackathon path
   - agent interface + review engine in one deployable unit

2. **Agent + helper modules in same repo**
   - still simple
   - keeps internal boundaries clear

### Recommendation
Use **one deployable service** for the hackathon MVP.

This reduces failure points and makes the demo more reliable.

## 11. Suggested Repository-to-Architecture Mapping

```text
agent/
  prompts/         -> LLM prompts and evaluation guidance
  schemas/         -> request/response schemas
  examples/        -> sample invocations and outputs

src/
  api/             -> agent entrypoint / request handlers
  fhir/            -> parsers and normalization helpers
  engine/          -> rules engine, orchestration, explanation logic
  types/           -> shared internal types

data/
  synthetic/       -> synthetic encounter examples
  fixtures/        -> reusable test payloads

docs/
  product/         -> PRD
  architecture/    -> this doc and diagrams
  research/        -> evidence and notes
```

## 12. Safety and Privacy Model

### Safety posture
RX Guard is a support tool, not a prescribing authority.

### Guardrails
- all demo data must be synthetic or de-identified
- outputs must be framed as guidance for clinician review
- no final treatment recommendation language
- no claim of legal or regulatory certainty
- no storage of real patient identifiers

### Response language guidance
Prefer:
- “consider reviewing”
- “documentation not detected”
- “potential concern”
- “suggested note language”

Avoid:
- “illegal”
- “must deny”
- “fraudulent”
- “clinically inappropriate” unless firmly supported and narrowly framed

## 13. Observability and Debugging

For MVP, observability should stay simple.

Log:
- request ID
- input type received
- parser success/failure
- number of rules triggered
- AI invocation success/failure
- response generated

Do not log:
- real PHI
- raw production note text
- secrets or tokens

## 14. Failure Modes

### Possible failure modes
- malformed input payload
- incomplete clinical context
- parser unable to locate medication request
- AI returns vague or overconfident output
- duplicate or conflicting findings

### Mitigations
- validate early
- fallback to partial review mode
- clearly report missing context
- constrain prompts and response schema
- merge and rank findings before output

## 15. Build Order

### Phase 1
- define schemas
- create internal review object
- add 2 to 3 synthetic demo cases
- implement rules engine

### Phase 2
- add AI explanation generation
- add suggested documentation output
- finalize response contract

### Phase 3
- wire into Prompt Opinion-compatible agent flow
- create polished demo path
- prepare marketplace-ready presentation

## 16. Recommended Demo Case Pack

Include at least 3 cases:

1. **Opioid + benzodiazepine overlap**
   - clear safety signal
   - easy for judges to understand

2. **Weak documentation case**
   - no functional goals
   - no PDMP documentation
   - no monitoring plan

3. **Low-risk cleaner case**
   - demonstrates balanced output and avoids feeling alarmist

## 17. Future Architecture Extensions

If the project continues beyond the hackathon, likely next extensions are:
- MCP tool breakout for specialized checks
- deeper FHIR resource coverage
- configurable jurisdiction/policy profiles
- longitudinal case review history
- integration with simulated PDMP or medication-history tools
- feedback loop for clinician acceptance/rejection of suggestions

## 18. Architecture Decisions

### Decision 1
**Use A2A agent as the primary submission artifact**
Reason: best fit for hackathon framing and agent interoperability story.

### Decision 2
**Use a narrow FHIR subset**
Reason: maximizes feasibility while still satisfying healthcare-context expectations.

### Decision 3
**Run rules before AI**
Reason: better determinism, reliability, and explainability.

### Decision 4
**Keep deployment as one service for MVP**
Reason: fewer moving parts, faster build, safer demo.

### Decision 5
**Use synthetic demo cases only**
Reason: required by rules and best for privacy/safety.

## 19. Open Technical Questions

- What exact agent interface does Prompt Opinion expect for marketplace publication?
- Should request payloads be fully FHIR-native or simplified JSON with FHIR mapping?
- Which LLM should be used for best speed vs explanation quality?
- Should suggested language be a separate generation step or part of the main review step?
- Do we want deterministic severity mapping after AI output to keep the response stable?

## 20. Next Recommended Artifacts

The next documents to create are:

1. `agent/schemas/request.schema.json`
2. `agent/schemas/response.schema.json`
3. synthetic case files in `data/synthetic/`
4. prompt spec in `agent/prompts/`
5. demo script in `docs/product/` or `docs/architecture/`
