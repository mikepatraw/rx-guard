# RX Guard Prompt Opinion Chat / A2A Calibration

## Purpose

This document captures the updated product direction after a successful synthetic-case test in Prompt Opinion.

RX Guard should now be optimized as a **Prompt Opinion chat / A2A agent**, not as an MCP-tools-first product.

## Product calibration goals

The Prompt Opinion version of RX Guard should:

- stay clinician-supportive and non-punitive
- remain precise and avoid unsupported inference
- focus strongest attention on:
  - opioid + benzodiazepine overlap
  - PDMP documentation gaps
  - monitoring gaps
  - missing functional goal / risk discussion
- produce concise chart-ready language that is easy to adapt
- preserve a clear human-in-the-loop disclaimer

## What to reduce

The Prompt Opinion version should avoid:

- implying misuse, diversion, abuse, or intent unless directly evidenced
- sounding like a compliance enforcement engine
- overstating certainty when the note is sparse
- turning every concern into a high-severity warning
- overly long narrative summaries that are harder to demo

## Calibration observations from the successful synthetic test

The existing hybrid output is directionally good, but it can be improved for Prompt Opinion by:

1. tightening the summary so it reads like clinician-support guidance instead of a stitched narrative
2. reducing duplicate phrasing between flags and missing documentation
3. making suggested language shorter and more defensible
4. keeping the main emphasis on the most important overlap/documentation issues
5. explicitly preserving the support-tool framing

## Recommended Prompt Opinion system prompt

```text
You are RX Guard, a clinician-support prescribing safety review agent for synthetic controlled-substance encounters.

Your role is to review the provided encounter context and return concise, explainable guidance that helps a clinician assess documentation completeness and contextual medication risk before a prescription is finalized.

Operating rules:
- You are not the prescribing clinician.
- You do not make the prescribing decision.
- You do not accuse the patient or clinician of misuse, diversion, abuse, or wrongdoing unless that is directly evidenced in the provided input.
- If something is absent from the note, describe it as not documented or not detected, not as proof that it did not occur.
- Use only the provided context.
- If the context is incomplete, say so clearly.
- Prioritize the following when present:
  1. opioid + benzodiazepine overlap
  2. PDMP documentation gaps
  3. monitoring or follow-up gaps
  4. missing functional goal or risk discussion
- Keep the tone clinically respectful, precise, and non-punitive.
- Keep suggested chart language concise and easy for a clinician to adapt.

Your output must remain clinician-support guidance, not an autonomous prescribing decision.
```

## Recommended Prompt Opinion response format

```json
{
  "reviewDisposition": "clinician_review_recommended",
  "riskSummary": {
    "level": "high",
    "oneLiner": "Concurrent opioid and benzodiazepine exposure is present, and key prescribing documentation elements are not clearly documented."
  },
  "priorityFindings": [
    {
      "priority": 1,
      "title": "Opioid + benzodiazepine overlap",
      "severity": "high",
      "whyItMatters": "An active benzodiazepine appears alongside a proposed opioid, which may increase sedation and overdose risk.",
      "confidence": "supported_by_structured_context"
    },
    {
      "priority": 2,
      "title": "PDMP documentation not detected",
      "severity": "moderate",
      "whyItMatters": "PDMP review may have occurred, but it is not clearly documented in the note.",
      "confidence": "supported_by_note_gap"
    },
    {
      "priority": 3,
      "title": "Monitoring and risk discussion are limited",
      "severity": "moderate",
      "whyItMatters": "The note provides limited evidence of monitoring, counseling, or risk-mitigation planning.",
      "confidence": "supported_by_note_gap"
    }
  ],
  "missingDocumentation": [
    "PDMP review documentation",
    "functional goal or treatment objective",
    "monitoring or follow-up plan",
    "risk discussion or counseling"
  ],
  "suggestedChartLanguage": [
    "Reviewed PDMP today; no unexpected recent controlled-substance fills were identified.",
    "Treatment goal is short-term improvement in pain control and daily functioning.",
    "Discussed sedation precautions, medication risks, and follow-up expectations."
  ],
  "safetyNote": "RX Guard provides clinician-support guidance only and does not make autonomous prescribing decisions."
}
```

## Recommended shorter demo-friendly output variant

Use this when the interface needs a faster, cleaner result for judges.

```json
{
  "riskLevel": "high",
  "headline": "Opioid + benzodiazepine overlap with missing prescribing documentation.",
  "topConcerns": [
    "Concurrent opioid and benzodiazepine exposure",
    "PDMP review not clearly documented",
    "Functional goal and risk discussion not clearly documented"
  ],
  "suggestedLanguage": [
    "Reviewed PDMP today; no unexpected recent controlled-substance fills were identified.",
    "Treatment goal is short-term improvement in pain control and daily functioning.",
    "Discussed sedation precautions and follow-up expectations."
  ],
  "disclaimer": "Clinician-support guidance only, not an autonomous prescribing decision."
}
```

## Marketplace / demo cleanup recommendations

To make the Prompt Opinion version cleaner for marketplace and demo use:

1. keep the first line short and immediately clinically relevant
2. show no more than 3 priority findings in the first visible frame
3. avoid words like "misuse" or "abuse" unless directly evidenced in the synthetic case
4. use "not documented" instead of implying missing actions
5. keep suggested chart language to 1 sentence each
6. keep the support-tool disclaimer visible somewhere in the output
7. avoid duplicated wording between summary, findings, and missing-documentation sections

## Judge-optimized framing

For hackathon judging, RX Guard should signal four things quickly:

### Clarity
The output should be readable in seconds, not paragraphs.

### Safety
The output should avoid unsupported escalation and preserve human oversight.

### Healthcare relevance
The findings should feel grounded in actual prescribing workflow friction.

### Human-in-the-loop practicality
The output should help a clinician improve the note, not just flag problems.

## Practical implementation suggestions

The Prompt Opinion version should likely prefer:

- one concise risk headline
- 2 to 4 ranked findings
- one missing-documentation list
- 2 to 3 short suggested-language lines
- one explicit clinician-support disclaimer

That shape is easier to demo, easier to judge, and more defensible than a longer narrative summary.
