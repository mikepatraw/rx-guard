# RXsignal Final Submission Evidence Guide

Use this guide for the last Prompt Opinion / Devpost pass. It is intentionally narrow: capture proof that RXsignal is published/invocable as a Prompt Opinion A2A/BYO agent using the embedded synthetic medication-record prompt, then show the polished RXsignal workflow renderer.

## Current verified public endpoints

Last checked from the repo workspace on 2026-05-05:

- Public staging UI: `https://rx-guard-iota.vercel.app/`
- A2A agent card: `https://app.promptopinion.ai/api/workspaces/[REDACTED_WORKSPACE_ID]/ai-agents/[REDACTED_AGENT_ID]/.well-known/agent-card.json`
- Local MCP dev command, if future supporting-tool work is revisited: `npm run mcp:medication`
- Hosted MCP route, if future supporting-tool work is revisited: `/api/mcp` on the hosted RXsignal server

The agent card endpoint returned HTTP 200 with the live agent name **RXsignal**. Marketplace search for RXsignal returned the published listing, and marketplace search for the previous name returned no results. The Vercel staging UI returned HTTP 200. The staging UI is still a synthetic public renderer; live Prompt Opinion invocation must be evidenced separately from the staging smoke.

## Final evidence to capture

Capture these four artifacts before Devpost submission:

1. **Prompt Opinion marketplace/listing evidence**
   - RXsignal name visible.
   - Published/discoverable state visible.
   - A2A/BYO agent state visible if the UI exposes it cleanly.
   - Final marketplace/listing URL or concise discoverability path.

2. **Prompt Opinion invocation evidence**
   - Published RXsignal agent selected in Prompt Opinion chat or A2A flow.
   - RXsignal System Prompt restored to the embedded synthetic `PDMP_PRESCRIPTION_HISTORY_OVERLAY` version.
   - RXsignal MCP server removed/disabled from the active agent for the final A2A submission recording.
   - Tamera164 Wisozk929 selected in Prompt Opinion Patient/Data Scope, then the Tamera smoke prompt submitted.
   - Compact JSON response visible with the expected contract. Prompt Opinion chat may wrap the JSON in a markdown fence; parse/contract checks matter more than the wrapper for the brief platform evidence cut.
   - `pdmp_summary_status` should be `"matched"` for the Tamera and Lincoln cases; Grover should render a low/no-recent-fill safety context.

3. **RXsignal renderer evidence**
   - Open `https://rx-guard-iota.vercel.app/`.
   - Show the synthetic medication workflow for Tamera164 Wisozk929, Lincoln623 Bednar518, and Grover Keeling.
   - Click **+ Add Medication**, show the `Xanax` search, and select **Xanax 1 mg tablet**.
   - Show RXsignal starting automatically from the controlled-medication selection.
   - Show the EHR-style modal, risk score, PDMP-style rows, recommendation, and workflow buttons.
   - Show **Re-run RXsignal** as the manual provider-control option after the automatic review.
   - Click **Do Not Prescribe** after the viewer can read the recommendation.

4. **Safety / submission framing evidence**
   - State or show that all data is synthetic.
   - State that RXsignal is clinician-support only, not an autonomous prescriber.
   - State that the public staging UI is Prompt Opinion-compatible but does not call live Prompt Opinion APIs.

## Exact Prompt Opinion test prompt

Use this in the final Prompt Opinion chat/A2A invocation. Do not include real patient data.

```text
Review this synthetic controlled-substance prescribing encounter as RXsignal.

Use the current selected Prompt Opinion Patient/Data Scope context if already visible in this chat. Do not call or retry FindPatientId.
Preferred test patient: Tamera164 Wisozk929 selected in Prompt Opinion Patient scope.
PDMP overlay: resolve by current patient display name; expected mapping is PO_PATIENT_TAMERA_WISOZK. The overlay name does not encode risk; calculate risk from prescription rows.
Proposed medication: Xanax 1 mg tablet
Directions: 1 tablet PO BID PRN for anxiety
Patient-reported history: no recent narcotic or controlled-substance use
Encounter note: PDMP review not yet documented

Return JSON only using exactly these top-level keys:
risk_score, risk_level, pdmp_summary_status, native_patient_context_status, flags, recommendation, compliance_flag, auto_note.

Do not include PDMP table rows.
Set pdmp_summary_status to "matched" if the synthetic PDMP overlay resolves. Set native_patient_context_status to "used" only if Prompt Opinion native patient context was actually available; otherwise set it to "unavailable" and do not invent chart facts.
Do not make the prescribing decision. Provide clinician-support guidance only.
No markdown. No explanation.
```

A usable response should look approximately like this shape. Values may vary slightly, but the keys and safety framing should not.

```json
{
  "risk_score": 80,
  "risk_level": "high",
  "pdmp_summary_status": "matched",
  "native_patient_context_status": "used|unavailable",
  "flags": ["History mismatch", "Multiple prescribers (4 in 90d)", "Multiple pharmacies (4 in 90d)"],
  "recommendation": "Not recommended — verify with patient before prescribing",
  "compliance_flag": "PDMP review not documented",
  "auto_note": "PDMP shows five controlled-substance fills in the past 90 days involving four prescribers and four pharmacies. Patient report of no recent controlled-substance use is inconsistent with recent PDMP-style records."
}
```

## Recording flow under 3 minutes

Target length: 2:15 to 2:45.

| Time | Visual | Narration point |
| --- | --- | --- |
| 0:00-0:20 | RXsignal title / Prompt Opinion agent page | Controlled-substance prescribing is high-stakes and documentation-heavy. |
| 0:20-0:50 | Prompt Opinion RXsignal agent selected | RXsignal is published as a Prompt Opinion BYO/A2A healthcare agent. |
| 0:50-1:10 | Submit the Tamera Patient/Data Scope prompt and show compact JSON response | Prompt Opinion returns compact decision support, not the whole UI. |
| 1:10-1:55 | Vercel medication selection + modal | RXsignal auto-runs from controlled-medication selection and renders the clinician workflow with synthetic PDMP-style evidence. |
| 1:55-2:20 | Workflow buttons / Do Not Prescribe action | Clinician stays in control; RXsignal packages suggested documentation and simulated workflow action. |
| 2:20-2:45 | Closing screen / repo + staging link | Synthetic only; human-in-the-loop; production path is authorized EHR/PDMP/FHIR integration. |

## Pass/fail checks before uploading video

- [ ] Video is under 3 minutes.
- [ ] No real PHI appears.
- [ ] Prompt Opinion selected agent is RXsignal.
- [ ] Prompt Opinion System Prompt uses the embedded synthetic `PDMP_PRESCRIPTION_HISTORY_OVERLAY` prompt.
- [ ] RXsignal MCP is removed/disabled for the active agent during the final A2A recording.
- [ ] Prompt uses Tamera164 Wisozk929 through Prompt Opinion Patient/Data Scope and does not paste real PHI.
- [ ] Response has `risk_score`, `risk_level`, `pdmp_summary_status`, `native_patient_context_status`, `flags`, `recommendation`, `compliance_flag`, and `auto_note`.
- [ ] Response does not include nested PDMP table rows.
- [ ] Vercel/UI demo starts from medication selection and auto-triggers RXsignal for the three-patient sequence.
- [ ] Vercel UI does not show raw expected JSON or internal Prompt Opinion payload panels.
- [ ] The demo states staging is synthetic and not live Prompt Opinion-connected.
- [ ] Devpost includes GitHub URL, staging URL, Prompt Opinion listing/discoverability details, and video URL.

## If the Prompt Opinion response is messy

Do not spend the video debugging raw JSON. Use the cleanest response available, show it briefly as the agent contract, and transition quickly to the RXsignal UI. If the final response is contract-wrong, record another invocation before submitting rather than editing the video around a broken agent response.

If Prompt Opinion guardrails reject the user prompt before generation, disable the custom RXsignal JSON guardrail for live chat unless Prompt Opinion can scope it to assistant output only. Keep the System Prompt and Response Format in place.
