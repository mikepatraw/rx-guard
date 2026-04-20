import { reviewEncounter } from './review.js';
import type { ReviewRequest, ReviewResponse } from '../types/review.js';

export interface ByoAgentInvocationInput {
  requestId?: string;
  patient?: ReviewRequest['patient'];
  encounter?: ReviewRequest['encounter'];
  conditions?: ReviewRequest['conditions'];
  activeMedications?: ReviewRequest['activeMedications'];
  allergies?: ReviewRequest['allergies'];
  proposedMedication?: ReviewRequest['proposedMedication'];
  monitoringSummary?: ReviewRequest['monitoringSummary'];
  riskIndicators?: ReviewRequest['riskIndicators'];
  noteText?: string;
  source?: ReviewRequest['source'];
  input?: Partial<ReviewRequest>;
  metadata?: Record<string, unknown>;
}

export interface ByoAgentInvocationResult {
  ok: boolean;
  agent: {
    name: string;
    mode: 'byo-a2a-preview';
  };
  response?: ReviewResponse;
  error?: {
    code: string;
    message: string;
  };
}

function toReviewRequest(payload: ByoAgentInvocationInput): ReviewRequest {
  const candidate = {
    ...payload.input,
    requestId: payload.requestId ?? payload.input?.requestId ?? `rxg-${Date.now()}`,
    synthetic: true as const,
    patient: payload.patient ?? payload.input?.patient,
    encounter: payload.encounter ?? payload.input?.encounter,
    conditions: payload.conditions ?? payload.input?.conditions,
    activeMedications: payload.activeMedications ?? payload.input?.activeMedications,
    allergies: payload.allergies ?? payload.input?.allergies,
    proposedMedication: payload.proposedMedication ?? payload.input?.proposedMedication,
    monitoringSummary: payload.monitoringSummary ?? payload.input?.monitoringSummary,
    riskIndicators: payload.riskIndicators ?? payload.input?.riskIndicators,
    noteText: payload.noteText ?? payload.input?.noteText,
    source: payload.source ?? payload.input?.source ?? { platform: 'prompt-opinion', fhirContext: true }
  } satisfies Partial<ReviewRequest>;

  if (!candidate.patient) throw new Error('Missing patient context');
  if (!candidate.encounter) throw new Error('Missing encounter context');
  if (!candidate.proposedMedication) throw new Error('Missing proposed medication');
  if (!candidate.noteText) throw new Error('Missing note text');

  return candidate as ReviewRequest;
}

export function invokeByoA2aAgent(payload: ByoAgentInvocationInput): ByoAgentInvocationResult {
  try {
    const request = toReviewRequest(payload);
    const response = reviewEncounter(request);

    return {
      ok: true,
      agent: {
        name: 'RX Guard',
        mode: 'byo-a2a-preview'
      },
      response
    };
  } catch (error) {
    return {
      ok: false,
      agent: {
        name: 'RX Guard',
        mode: 'byo-a2a-preview'
      },
      error: {
        code: 'invalid_byo_agent_request',
        message: error instanceof Error ? error.message : 'Invalid BYO Agent request'
      }
    };
  }
}
