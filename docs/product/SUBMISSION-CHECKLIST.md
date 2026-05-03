# RX Guard Submission Checklist

This checklist translates the **Agents Assemble: The Healthcare AI Endgame** requirements into concrete work for RX Guard.

Last refreshed: 2026-05-02.

## Current submission strategy

RX Guard should stay on one primary path: **A2A Agent**.

```text
Prompt Opinion published A2A/BYO agent
  -> embedded synthetic PDMP_DATABASE in the System Prompt
  -> compact decision-support contract
  -> RX Guard synthetic clinical data adapter
  -> RX Guard EHR-style workflow renderer
```

The hosted MCP work is no longer the submission path. Keep it as experimental/supporting infrastructure in the repo, but do not make MCP the judge-facing product surface or a second category pitch.

The public Vercel site is a partner-testable staging renderer, not a live Prompt Opinion API integration:

```text
https://rx-guard-iota.vercel.app
```

Do not build a live prescription/PDMP database before submission. For this submission, deterministic synthetic fixtures embedded in the Prompt Opinion System Prompt are safer, faster, and easier to explain. In production, RX Guard would connect to authorized EHR/PDMP/FHIR services through a secure clinical data layer and expose only minimum necessary structured context to the Prompt Opinion agent.

## 1. Eligibility and compliance

- [x] Confirm submission uses **synthetic or de-identified data only**
- [x] Confirm no real PHI is included in repo, staging UI, screenshots, or video assets created so far
- [x] Confirm all current repo/submission materials are in English
- [x] Confirm project materials are original or properly licensed
- [x] Confirm staging UI warns/positions the workflow as synthetic-only and not clinical software

## 2. Core submission path

RX Guard is currently planned as:
- **Path B: A2A Agent**

Decision check:
- [x] Use A2A as the primary submission artifact
- [x] Configure/publish RX Guard as a Prompt Opinion BYO/A2A agent
- [x] Use the embedded synthetic `PDMP_DATABASE` System Prompt for the final A2A submission path
- [x] Keep MCP as non-primary implementation research, not as a separate submission category
- [ ] Run one final Prompt Opinion in-platform smoke after restoring the embedded-record prompt
- [ ] Record final Prompt Opinion in-platform invocation evidence for the Devpost video

## 3. Prompt Opinion account and platform setup

- [x] Create Prompt Opinion account
- [x] Access Prompt Opinion workspace
- [x] Configure free-tier workspace model using `Google Gemini (FREE TIER)` with `Gemini 3 Flash Preview`
- [x] Create/configure RX Guard as a **BYO Agent** rather than relying only on native Po Agent scaffolds
- [x] Enable **A2A availability** for RX Guard
- [x] Verify required setup fields for marketplace publication
- [x] Confirm subscription-level publishing entitlement was sufficient to publish
- [x] Capture technical A2A/MCP/agent-card endpoints in docs
- [ ] Capture final polished marketplace/listing URL or discoverability path for Devpost

## 4. Integration requirements

- [x] Connect RX Guard logic to a Prompt Opinion-compatible agent flow
- [x] Confirm the current compact request/response payload shape expected for the demo contract
- [x] Keep Prompt Opinion output compact: `risk_score`, `risk_level`, `pdmp_summary_status`, `flags`, `recommendation`, `compliance_flag`, `auto_note`
- [x] Keep deterministic PDMP rows in RX Guard/local synthetic data instead of asking Prompt Opinion to generate nested table data
- [x] Keep the final Prompt Opinion setup on the embedded synthetic-record System Prompt; no MCP server is required for the A2A submission path
- [x] Keep MCP/FHIR work documented as experimental/supporting infrastructure only, not the final submission path
- [ ] Confirm the restored embedded-record prompt returns the expected `RXG-SB-001` high-risk JSON in Prompt Opinion
- [x] Confirm Prompt Opinion output is clean enough to show briefly before switching to the RX Guard UI renderer

## 5. Healthcare context requirements

From the challenge page:
- SHARP extension specs should be used to propagate healthcare context
- FHIR server data is highly recommended, but not strictly required

Practical checklist for RX Guard:
- [x] Map realistic synthetic encounter input to a safe synthetic key (`RXG-SB-001`) before Prompt Opinion handoff
- [x] Include patient/encounter identifiers in a safe synthetic way
- [x] Document how RX Guard consumes healthcare context and renders the workflow
- [x] Keep FHIR claims precise: FHIR-aware / FHIR-inspired, not a full production FHIR server
- [ ] Add final Prompt Opinion screenshot/video evidence of enabled FHIR context extension if useful for judges

## 6. Marketplace readiness

- [x] Configure RX Guard as an **A2A-enabled BYO Agent**
- [x] Verify RX Guard appears in Marketplace Studio as publishable
- [x] Confirm publishing is allowed on the current Prompt Opinion subscription
- [x] Add marketplace title
- [x] Add marketplace description
- [x] Publish and verify discoverability in the workspace
- [ ] Add/category tags if required by final marketplace form
- [ ] Add usage instructions or invocation notes if required
- [ ] Capture polished marketplace URL/details for Devpost

## 7. Demo/staging readiness

The rules require a video under 3 minutes showing the project functioning within Prompt Opinion.

- [x] Finalize one primary demo case: Sheila Bankston / `RXG-SB-001`
- [x] Add three-patient demo workflow using the uploaded chart/progress-note content: Sheila Bankston, Charlie Williams, and Grover Keeling
- [x] Build public Vercel staging UI for low-friction partner testing
- [x] Remove raw expected JSON and internal Prompt Opinion payload panels from tester-facing UI
- [x] Verify live staging link loads publicly without Vercel login
- [x] Verify staging UI is usable on iPhone-sized Safari/Chromium viewport
- [x] Ensure no real patient data appears on screen
- [x] Record current no-title-card workflow video with patient lookup, progress notes, medication selection, split-screen Prompt Opinion interworking, RXGuard decisions, and chart documentation insertion
- [ ] Run final Prompt Opinion smoke using restored embedded-record prompt
- [ ] Record the platform flow from invocation to result
- [ ] Keep final video under 3 minutes

## 8. Devpost submission assets

- [x] Project title finalized: RX Guard
- [x] Short tagline drafted
- [x] Full description drafted
- [x] GitHub repo link included in draft
- [x] Architecture / technical notes ready if needed
- [x] Public staging link documented: `https://rx-guard-iota.vercel.app`
- [ ] Prompt Opinion marketplace URL/discoverability details included
- [ ] Demo video link included
- [ ] Final polish pass on screenshots/video captions

## 9. Messaging for judges

The submission should clearly communicate:
- [x] **AI Factor**: Prompt Opinion is the agent layer for compact decision support; RX Guard turns that output into workflow-specific clinical UI
- [x] **Potential Impact**: reduces documentation gaps, improves consistency, and saves clinician review time
- [x] **Feasibility**: synthetic data, human-in-the-loop workflow, narrow scope, healthcare-aware architecture
- [x] **Safety**: clinician support only; not an autonomous prescriber; no real PHI; no live PDMP/EHR claims
- [x] **Production path**: future authorized EHR/PDMP/FHIR integration through a secure clinical data service, not a Prompt Opinion-hosted prescription database

## 10. Repo readiness checklist

- [x] README exists
- [x] PRD exists
- [x] architecture spec exists
- [x] schemas exist
- [x] synthetic demo cases exist
- [x] prompt spec exists
- [x] rules-based MVP core exists
- [x] AI-style explanation layer exists for deterministic local review
- [x] Prompt Opinion-compatible local adapter exists
- [x] local runner exists
- [x] local server exists
- [x] connected static UI exists
- [x] public Vercel staging UI exists
- [x] tests exist
- [x] local RXGuard MCP medication/context server exists
- [x] MCP server tests exist for deterministic synthetic lookup
- [x] MCP setup/hosted Prompt Opinion plan is documented
- [x] polished demo script added
- [x] Devpost draft added
- [x] staging/partner testing handoff added

## 11. Immediate next steps

### Before final submission
- [x] Restore the embedded synthetic-record Prompt Opinion System Prompt as the final A2A submission path
- [ ] Remove/disable RXGuard MCP from the live Prompt Opinion agent so the demo does not depend on the MCP category path
- [ ] Run one final Prompt Opinion chat/A2A invocation pass with `RXG-SB-001` using the embedded-record smoke prompt
- [ ] Capture the final marketplace/listing URL or clear discoverability instructions
- [ ] Record the under-3-minute video showing Prompt Opinion invocation plus RX Guard UI rendering
- [ ] Add the video link to Devpost draft/submission materials
- [ ] Run final repository checks: `npm test`, docs link check/search, and secret-pattern scan over changed assets

### Optional only if time remains
- [ ] Add a second synthetic backup case
- [ ] Add a small `vercel.json` if future Vercel auto-detection becomes unstable
- [ ] Add automated Playwright mobile smoke testing if adding a browser test dependency is acceptable

## 12. Confirmed platform constraints and decisions

- Native `Po Agents` can help explore templates, but marketplace publication appears to require **A2A-enabled agents**.
- Marketplace Studio explicitly points users to the **BYO Agents** page to enable A2A before publish.
- Free-tier model setup is acceptable for initial workspace activation and does not appear to violate hackathon rules.
- `Po Sample Policies` worked as a practical unblocker in policy-list-required template flows, but that path is secondary to the final BYO/A2A submission path.
- Prompt Opinion should not be used as the prescription database.
- For the submission, the synthetic PDMP/prescription data is embedded in the Prompt Opinion System Prompt and mirrored by RX Guard local fixtures. MCP work remains non-primary implementation research and should not be used as a second submission category.

## 13. Definition of submission-ready

RX Guard is submission-ready when all of the following are true:
- it runs locally and predictably
- public staging is usable for partner UI feedback
- it is published to the Prompt Opinion Marketplace
- it can be invoked in-platform on a synthetic case through the intended chat/A2A path
- the demo video shows that workflow clearly in under 3 minutes
- the Devpost submission copy includes GitHub, Prompt Opinion listing/discoverability details, staging link, and video link

## 14. Current live-state note

As of this refresh:
- RX Guard is published in Marketplace
- RX Guard is configured as a BYO Agent with A2A enabled
- Chat Selectable is available
- local RXGuard MCP medication/context tools exist as non-primary supporting research, but the final submission path is the embedded-record A2A agent
- final Prompt Opinion smoke must be rerun after removing MCP from the active agent and restoring the embedded synthetic-record System Prompt
- public staging is live at `https://rx-guard-iota.vercel.app`
- the staging UI starts from medication selection, auto-triggers RX Guard, and does not expose raw JSON/payload panels
- the latest demo evidence shows patient lookup, non-blank progress notes, three medication-selection workflows, split-screen Prompt Opinion interworking, provider actions, and chart-documentation insertion
- the remaining validation gap is recording final in-platform hosted-MCP invocation evidence and the under-3-minute submission video
