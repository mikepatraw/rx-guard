export type Severity = 'low' | 'moderate' | 'high';
export type FlagSource = 'rules' | 'ai' | 'merged';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'unknown';

export interface ConditionInput {
  name: string;
  code?: string;
  status?: string;
}

export interface MedicationInput {
  name: string;
  dose?: string;
  sig?: string;
  scheduleClass?: string;
}

export interface AllergyInput {
  substance: string;
  reaction?: string;
}

export interface PatientInput {
  id: string;
  age?: number;
  sex?: string;
  name?: string;
  dob?: string;
}

export interface PdmpCrossReference {
  matched: boolean;
  name?: string;
  dob?: string;
  totalPrescriptions: number;
  prescriberCount90d: number;
  pharmacyCount90d: number;
  lastFillDate?: string;
  activeOverlaps: { medA: string; medB: string; date: string }[];
}

export interface EncounterInput {
  id: string;
  type: string;
  date?: string;
  setting?: string;
}

export interface ProposedMedicationInput extends MedicationInput {
  quantity?: number;
  durationDays?: number;
}

export interface MonitoringSummaryInput {
  pdmpReviewed?: boolean;
  pdmpDocumented?: boolean;
  udsAvailable?: boolean;
  udsConsistent?: boolean;
  earlyRefillConcern?: boolean;
  painAgreementOnFile?: boolean;
}

export interface ReviewRequest {
  requestId: string;
  synthetic: true;
  patient: PatientInput;
  encounter: EncounterInput;
  conditions?: ConditionInput[];
  activeMedications?: MedicationInput[];
  allergies?: AllergyInput[];
  proposedMedication: ProposedMedicationInput;
  monitoringSummary?: MonitoringSummaryInput;
  riskIndicators?: string[];
  noteText: string;
  source?: {
    platform?: string;
    fhirContext?: boolean;
  };
}

export interface ReviewFlag {
  code: string;
  severity: Severity;
  source: FlagSource;
  message: string;
  explanation: string;
}

export interface ReviewResponse {
  status: 'review_complete' | 'partial_review' | 'input_error';
  riskLevel: RiskLevel;
  summary: string;
  flags: ReviewFlag[];
  missingDocumentation: string[];
  suggestedLanguage: string[];
  pdmpCrossReference?: PdmpCrossReference;
  metadata: {
    synthetic: boolean;
    version: string;
    requestId?: string;
    reviewMode?: string;
    timestamp?: string;
  };
}
