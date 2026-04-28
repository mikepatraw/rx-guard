# Prompt Opinion Account Handoff

You do **not** need a Prompt Opinion account for local RX Guard development.

You **do** need a Prompt Opinion account for the following tasks:
- creating the actual RX Guard agent in-platform
- inspecting required configuration fields
- publishing to the Prompt Opinion Marketplace
- validating in-platform invocation
- recording the final compliant demo video

## Current status

RX Guard has been configured/published as a Prompt Opinion BYO/A2A agent, and local/staging repository work can continue without account access. Account access is still needed for final in-platform validation, marketplace URL capture, and the submission video.

## Trigger point for account access

Account access is needed when we are ready to do any of these:
1. verify the final Prompt Opinion chat/A2A invocation for `RXG-SB-001`
2. capture the polished marketplace/listing URL or discoverability path
3. record the final under-3-minute in-platform demo video

## What to do when that moment comes

1. Open the existing RX Guard BYO/A2A agent in Prompt Opinion.
2. Confirm the agent is chat-selectable and A2A-enabled.
3. Invoke the synthetic `RXG-SB-001` case using the compact contract from `docs/product/FINAL-SUBMISSION-EVIDENCE.md`.
4. Capture the final marketplace/listing URL or clear discoverability instructions.
5. Record the final under-3-minute demo evidence required for submission.

## Current no-account path

Without Prompt Opinion account access, reviewers can still use:
- public staging: `https://rx-guard-iota.vercel.app`
- local clone-to-test guide: `docs/product/LOCAL-TEST-GUIDE.md`
- staging handoff: `docs/product/STAGING-TEST-GUIDE.md`

These paths are synthetic and Prompt Opinion-compatible, but they are not a substitute for the final in-platform Prompt Opinion recording if the competition requires it.
