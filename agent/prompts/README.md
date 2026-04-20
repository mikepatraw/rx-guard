# Agent prompts

This directory contains prompt assets for RX Guard.

## Main prompt file

- `review-prompt-spec.md` - primary prompt guidance for RX Guard's clinician-support review behavior

## Current Prompt Opinion direction

RX Guard is currently being shaped for use as a **Prompt Opinion chat / A2A agent**.

That means prompt behavior should prioritize:
- concise clinician-support guidance
- clear emphasis on opioid + benzodiazepine overlap when present
- explicit documentation-gap framing
- short, defensible suggested chart language
- human-in-the-loop safety language

Avoid prompt behavior that feels:
- punitive
- accusatory
- overly narrative
- overly confident when context is incomplete
