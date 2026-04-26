# RX Guard Submission Checklist

This checklist translates the **Agents Assemble: The Healthcare AI Endgame** requirements into concrete work for RX Guard.

## 1. Eligibility and compliance

- [ ] Confirm submission uses **synthetic or de-identified data only**
- [ ] Confirm no real PHI is included in repo, demo, screenshots, or video
- [ ] Confirm all submission materials are in English
- [ ] Confirm project materials are original or properly licensed

## 2. Core submission path

RX Guard is currently planned as:
- **Path B: A2A Agent**

Decision check:
- [x] Use A2A as the primary submission artifact
- [ ] Confirm Prompt Opinion platform can invoke RX Guard in the intended agent pattern

## 3. Prompt Opinion account and platform setup

- [x] Create Prompt Opinion account
- [x] Access Prompt Opinion workspace
- [x] Configure free-tier workspace model using `Google Gemini (FREE TIER)` with `Gemini 3 Flash Preview`
- [x] Create/configure RX Guard as a **BYO Agent** rather than relying only on native Po Agent scaffolds
- [x] Enable **A2A availability** for RX Guard
- [x] Verify required setup fields for marketplace publication
- [x] Confirm subscription-level publishing entitlement was sufficient to publish

## 4. Integration requirements

- [ ] Connect RX Guard logic to Prompt Opinion-compatible agent flow
- [ ] Confirm request/response payload shape expected by the platform
- [ ] Confirm agent can be invoked from Prompt Opinion successfully through the final **chat/A2A path**
- [ ] Confirm output renders cleanly in the platform
- [x] Enable FHIR context extension on the BYO/A2A agent

## 5. Healthcare context requirements

From the challenge page:
- SHARP extension specs should be used to propagate healthcare context
- FHIR server data is highly recommended, but not strictly required

Practical checklist for RX Guard:
- [ ] Map synthetic encounter input to a FHIR-aware request shape
- [ ] Include patient/encounter identifiers in a safe synthetic way
- [ ] Include FHIR-context-aware metadata in wrapper payloads where expected
- [ ] Document how RX Guard consumes healthcare context

## 6. Marketplace readiness

- [x] Configure RX Guard as an **A2A-enabled BYO Agent**
- [x] Verify RX Guard appears in Marketplace Studio as publishable
- [x] Confirm publishing is allowed on the current Prompt Opinion subscription
- [x] Add marketplace title
- [x] Add marketplace description
- [ ] Add category/tags if required
- [ ] Add usage instructions or invocation notes if required
- [x] Publish and verify discoverability

## 7. Demo readiness

The rules require a video under 3 minutes showing the project functioning within Prompt Opinion.

- [x] Finalize one primary demo case
- [ ] Finalize backup demo case
- [ ] Confirm in-platform invocation path is reliable
- [x] Record local prompt-to-results UI flow for review
- [ ] Record the platform flow from invocation to result
- [ ] Keep final video under 3 minutes
- [x] Ensure no real patient data appears on screen

## 8. Devpost submission assets

- [ ] Project title finalized
- [ ] Short tagline finalized
- [ ] Full description finalized
- [ ] GitHub repo link included
- [ ] Prompt Opinion marketplace URL included
- [ ] Demo video link included
- [ ] Architecture / technical notes ready if needed

## 9. Messaging for judges

The submission should clearly communicate:
- [ ] **AI Factor**: AI interprets narrative clinical documentation and generates explainable support, not just rule checks
- [ ] **Potential Impact**: reduces documentation gaps, improves consistency, and saves clinician review time
- [ ] **Feasibility**: synthetic data, human-in-the-loop workflow, narrow scope, healthcare-aware architecture

## 10. Repo readiness checklist

- [x] README exists
- [x] PRD exists
- [x] architecture spec exists
- [x] schemas exist
- [x] synthetic demo cases exist
- [x] prompt spec exists
- [x] rules-based MVP core exists
- [x] local runner exists
- [x] local server exists
- [x] tests exist
- [ ] AI explanation layer integrated
- [ ] Prompt Opinion wrapper implemented
- [ ] polished demo script added
- [ ] final submission copy added

## 11. Immediate next steps

### Before Prompt Opinion account access is required
- [ ] Write Prompt Opinion agent wrapper spec
- [ ] Add AI explanation layer or mock AI response path
- [ ] Draft demo script
- [ ] Draft Devpost submission copy

### Once Prompt Opinion account access is available
- [x] Inspect platform setup flow
- [x] Configure RX Guard as a BYO Agent with A2A enabled
- [x] Publish to marketplace
- [ ] Run end-to-end in-platform validation through the final chat/A2A path
- [ ] Record final demo video

## 12. Newly confirmed platform constraints

- Native `Po Agents` can help explore templates, but marketplace publication appears to require **A2A-enabled agents**.
- Marketplace Studio explicitly points users to the **BYO Agents** page to enable A2A before publish.
- Free-tier model setup is acceptable for initial workspace activation and does not appear to violate hackathon rules.
- `Po Sample Policies` worked as a practical unblocker in policy-list-required template flows, but that path may still be secondary to the final BYO/A2A submission path.

## 12. Definition of submission-ready

RX Guard is submission-ready when all of the following are true:
- it runs locally and predictably
- it is integrated into Prompt Opinion
- it is published to the Prompt Opinion Marketplace
- it can be invoked in-platform on a synthetic case through the intended chat/A2A path
- the demo video shows that workflow clearly
- the Devpost submission copy is complete

## 13. Current live-state note

As of the current Prompt Opinion pass:
- RX Guard is published in Marketplace
- RX Guard is configured as a BYO Agent with A2A enabled
- Chat Selectable is available
- no custom MCP tools are exposed beyond built-in patient helpers
- the remaining validation gap is confirming the clean end-user invocation flow from Prompt Opinion chat, since Launchpad still surfaced an older template-style card during browser verification
