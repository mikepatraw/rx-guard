# PreSignRx Final Submission Evidence Guide

Use this guide for the last Prompt Opinion / Devpost pass. It is intentionally narrow: capture proof that PreSignRx is published/invocable as a Prompt Opinion A2A/BYO agent using the embedded synthetic medication-record prompt, then show the polished PreSignRx workflow renderer.

## Current verified public endpoints

Last checked from the repo workspace on 2026-04-30:

- Public staging UI: `https://rx-guard-iota.vercel.app/`
- A2A agent card: `https://app.promptopinion.ai/api/workspaces/019d881e-b5b2-7bae-b3ef-c1df241d8e01/ai-agents/019d8868-ce0e-78bb-9f77-97a09fae4a8e/.well-known/agent-card.json`
- Local MCP dev command, if future supporting-tool work is revisited: `npm run mcp:medication`
- Hosted MCP route, if future supporting-tool work is revisited: `/api/mcp` on the hosted PreSignRx server

The agent card endpoint returned HTTP 200 and identifies the agent as **PreSignRx**. The Vercel staging UI returned HTTP 200. The staging UI is still a synthetic public renderer; it is not proof of live Prompt Opinion API invocation.

## Final evidence to capture

Capture these four artifacts before Devpost submission:

1. **Prompt Opinion marketplace/listing evidence**
   - PreSignRx name visible.
   - Published/discoverable state visible.
   - A2A/BYO agent state visible if the UI exposes it cleanly.
   - Final marketplace/listing URL or concise discoverability path.

2. **Prompt Opinion invocation evidence**
   - Published PreSignRx agent selected in Prompt Opinion chat or A2A flow.
   - PreSignRx System Prompt restored to the embedded synthetic `PDMP_DATABASE` version.
   - PreSignRx MCP server removed/disabled from the active agent for the final A2A submission recording.
   - Synthetic prompt submitted with `Synthetic patient key: RXG-TW-001`.
   - JSON-only response visible with the compact contract.
   - `pdmp_summary_status` should be `"matched"` for the Tamera and Lincoln cases; Grover should render a low/no-recent-fill safety context.

3. **PreSignRx renderer evidence**
   - Open `https://rx-guard-iota.vercel.app/`.
   - Show the synthetic medication workflow for Tamera164 Wisozk929, Lincoln623 Bednar518, and Grover Keeling.
   - Click **+ Add Medication**, show the `Xanax` search, and select **Xanax 1 mg tablet**.
   - Show PreSignRx starting automatically from the controlled-medication selection.
   - Show the EHR-style modal, risk score, PDMP-style rows, recommendation, and workflow buttons.
   - Show **Re-run PreSignRx** as the manual provider-control option after the automatic review.
   - Click **Do Not Prescribe** after the viewer can read the recommendation.

4. **Safety / submission framing evidence**
   - State or show that all data is synthetic.
   - State that PreSignRx is clinician-support only, not an autonomous prescriber.
   - State that the public staging UI is Prompt Opinion-compatible but does not call live Prompt Opinion APIs.

## Exact Prompt Opinion test prompt

Use this in the final Prompt Opinion chat/A2A invocation. Do not include real patient data.

```text
Review this synthetic controlled-substance prescribing encounter as PreSignRx.

Synthetic patient key: RXG-TW-001
Proposed medication: Xanax 1 mg tablet
Directions: 1 tablet PO BID PRN for anxiety
Patient-reported history: no recent narcotic or controlled-substance use
Encounter note: PDMP review not yet documented

Return JSON only using exactly these top-level keys:
risk_score, risk_level, pdmp_summary_status, flags, recommendation, compliance_flag, auto_note.

Do not include PDMP table rows.
Set pdmp_summary_status to "matched" if the synthetic case key resolves to a PDMP-style record.
Do not make the prescribing decision. Provide clinician-support guidance only.
No markdown. No explanation.
```

A usable response should look approximately like this shape. Values may vary slightly, but the keys and safety framing should not.

```json
{
  "risk_score": 80,
  "risk_level": "high",
  "pdmp_summary_status": "matched",
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
| 0:00-0:20 | PreSignRx title / Prompt Opinion agent page | Controlled-substance prescribing is high-stakes and documentation-heavy. |
| 0:20-0:50 | Prompt Opinion PreSignRx agent selected | PreSignRx is published as a Prompt Opinion BYO/A2A healthcare agent. |
| 0:50-1:10 | Submit `RXG-SB-001` prompt and show compact JSON response | Prompt Opinion returns compact decision support, not the whole UI. |
| 1:10-1:55 | Vercel medication selection + modal | PreSignRx auto-runs from controlled-medication selection and renders the clinician workflow with synthetic PDMP-style evidence. |
| 1:55-2:20 | Workflow buttons / Do Not Prescribe action | Clinician stays in control; PreSignRx packages suggested documentation and simulated workflow action. |
| 2:20-2:45 | Closing screen / repo + staging link | Synthetic only; human-in-the-loop; production path is authorized EHR/PDMP/FHIR integration. |

## Pass/fail checks before uploading video

- [ ] Video is under 3 minutes.
- [ ] No real PHI appears.
- [ ] Prompt Opinion selected agent is PreSignRx.
- [ ] Prompt Opinion System Prompt uses the embedded synthetic `PDMP_DATABASE` prompt.
- [ ] PreSignRx MCP is removed/disabled for the active agent during the final A2A recording.
- [ ] Prompt uses `RXG-SB-001`, not direct name and DOB.
- [ ] Response has `risk_score`, `risk_level`, `pdmp_summary_status`, `flags`, `recommendation`, `compliance_flag`, and `auto_note`.
- [ ] Response does not include nested PDMP table rows.
- [ ] Vercel/UI demo starts from medication selection and auto-triggers PreSignRx for the three-patient sequence.
- [ ] Vercel UI does not show raw expected JSON or internal Prompt Opinion payload panels.
- [ ] The demo states staging is synthetic and not live Prompt Opinion-connected.
- [ ] Devpost includes GitHub URL, staging URL, Prompt Opinion listing/discoverability details, and video URL.

## If the Prompt Opinion response is messy

Do not spend the video debugging raw JSON. Use the cleanest response available, show it briefly as the agent contract, and transition quickly to the PreSignRx UI. If the final response is contract-wrong, record another invocation before submitting rather than editing the video around a broken agent response.

If Prompt Opinion guardrails reject the user prompt before generation, disable the custom PreSignRx JSON guardrail for live chat unless Prompt Opinion can scope it to assistant output only. Keep the System Prompt and Response Format in place.
