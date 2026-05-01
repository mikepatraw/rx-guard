export type SyntheticMedication = {
  canonical_name: string;
  generic_name: string;
  aliases: string[];
  controlled_substance: boolean;
  dea_schedule: 'C-II' | 'C-III' | 'C-IV' | 'not_scheduled';
  class: string;
  risk_notes: string[];
  documentation_considerations: string[];
};

export type SyntheticPdmpRecord = {
  medication: string;
  fill_date: string;
  quantity: number;
  days_supply: number;
  prescriber: string;
  pharmacy: string;
};

export type SyntheticDemoCase = {
  patient_key: string;
  display_name: string;
  dob: string;
  progress_note: {
    visit: string;
    chief_complaint: string;
    hpi: string;
    assessment: string;
    summary: string;
  };
  current_medications: { name: string; note?: string }[];
  proposed_medication: string;
  directions: string;
  pdmp_summary_status: 'matched' | 'not_found';
  pdmp_records: SyntheticPdmpRecord[];
  risk_factors: string[];
  documentation_flags: string[];
  recommended_response: {
    risk_score: number;
    risk_level: 'low' | 'moderate' | 'high';
    recommendation: 'proceed' | 'proceed_with_caution' | 'do_not_prescribe';
    documentation: string;
  };
};

export const medications: SyntheticMedication[] = [
  {
    canonical_name: 'Xanax 1 mg tablet',
    generic_name: 'alprazolam',
    aliases: ['xanax', 'alprazolam', 'xanax 0.5 mg tablet'],
    controlled_substance: true,
    dea_schedule: 'C-IV',
    class: 'benzodiazepine',
    risk_notes: [
      'Sedation and dependence risk.',
      'Avoid combining with opioids, alcohol, or sedating medications.',
      'PDMP review and indication documentation are expected before prescribing.',
    ],
    documentation_considerations: ['PDMP review', 'non-benzodiazepine alternatives', 'care coordination'],
  },
  {
    canonical_name: 'Hydrocodone/APAP 5-325 mg tablet',
    generic_name: 'hydrocodone bitartrate / acetaminophen',
    aliases: ['hydrocodone', 'hydrocodone/apap', 'norco', 'hydrocodone/apap 7.5-325 mg tablet'],
    controlled_substance: true,
    dea_schedule: 'C-II',
    class: 'opioid analgesic combination',
    risk_notes: [
      'Opioid sedation and respiratory depression risk.',
      'Avoid alcohol and concurrent sedating medications when possible.',
      'Use the shortest duration and lowest effective quantity for acute pain.',
    ],
    documentation_considerations: ['PDMP review', 'sedation counseling', 'follow-up plan'],
  },
  {
    canonical_name: 'Oxycodone oral solution 5 mg/5 mL',
    generic_name: 'oxycodone',
    aliases: ['oxycodone', 'oxycodone solution', 'oxycodone tablet 5 mg'],
    controlled_substance: true,
    dea_schedule: 'C-II',
    class: 'opioid analgesic',
    risk_notes: [
      'Opioid sedation and respiratory depression risk.',
      'Pediatric use requires weight-based dosing and guardian counseling.',
      'Use limited quantity for acute injury follow-up when clinically justified.',
    ],
    documentation_considerations: ['pediatric dosing', 'guardian counseling', 'acetaminophen correction'],
  },
  {
    canonical_name: 'Adderall 20 mg tablet',
    generic_name: 'amphetamine / dextroamphetamine',
    aliases: ['adderall', 'amphetamine', 'dextroamphetamine'],
    controlled_substance: true,
    dea_schedule: 'C-II',
    class: 'stimulant',
    risk_notes: ['Controlled stimulant; review recent fills and indication consistency.'],
    documentation_considerations: ['PDMP review', 'diagnosis support'],
  },
  {
    canonical_name: 'Trazodone 150 mg tablet',
    generic_name: 'trazodone',
    aliases: ['trazodone'],
    controlled_substance: false,
    dea_schedule: 'not_scheduled',
    class: 'sedating antidepressant',
    risk_notes: ['May increase sedation burden when combined with opioids or alcohol.'],
    documentation_considerations: ['sedation counseling'],
  },
  {
    canonical_name: 'Seroquel / Quetiapine 100 mg tablet',
    generic_name: 'quetiapine',
    aliases: ['seroquel', 'quetiapine'],
    controlled_substance: false,
    dea_schedule: 'not_scheduled',
    class: 'atypical antipsychotic',
    risk_notes: ['Sedating medication; consider additive sedation with opioids.'],
    documentation_considerations: ['sedation counseling'],
  },
  {
    canonical_name: 'Ibuprofen 400 mg tablet',
    generic_name: 'ibuprofen',
    aliases: ['ibuprofen', 'motrin', 'advil'],
    controlled_substance: false,
    dea_schedule: 'not_scheduled',
    class: 'NSAID analgesic',
    risk_notes: ['Non-controlled analgesic; review renal/GI risk as clinically indicated.'],
    documentation_considerations: ['non-opioid analgesia plan'],
  },
  {
    canonical_name: 'Acetaminophen 800 mg',
    generic_name: 'acetaminophen',
    aliases: ['acetaminophen', 'tylenol', 'apap'],
    controlled_substance: false,
    dea_schedule: 'not_scheduled',
    class: 'non-opioid analgesic',
    risk_notes: ['Check total daily dose and weight-based pediatric limits.'],
    documentation_considerations: ['dose correction', 'guardian counseling'],
  },
];

export const demoCases: SyntheticDemoCase[] = [
  {
    patient_key: 'RXG-SB-001',
    display_name: 'Sheila Bankston',
    dob: '06/13/1960',
    progress_note: {
      visit: 'New Patient – Primary Care · 04/19/2026',
      chief_complaint: 'Grief, panic attacks, difficulty focusing.',
      hpi:
        '65-year-old female with grief and anxiety after the death of her husband 2 months ago. Reports panic episodes with heart racing and feeling overwhelmed. Requests rapid-onset medication and is reluctant to start SSRI therapy. Also reports difficulty concentrating and completing tasks; denies suicidal ideation.',
      assessment:
        'Acute grief reaction; generalized anxiety / panic symptoms; attention and concentration deficit; elevated blood pressure.',
      summary:
        'New-patient progress note documents acute grief, panic attacks, request for rapid-onset medication, reluctance to start SSRI therapy, and elevated vitals.',
    },
    current_medications: [],
    proposed_medication: 'Xanax 1 mg tablet',
    directions: '1 tablet PO BID PRN for anxiety',
    pdmp_summary_status: 'matched',
    pdmp_records: [
      { medication: 'Alprazolam 1 mg', fill_date: '04/05/2026', quantity: 30, days_supply: 10, prescriber: 'Dr. R. Collins', pharmacy: 'Capitol Rx' },
      { medication: 'Lorazepam 1 mg', fill_date: '03/10/2026', quantity: 20, days_supply: 7, prescriber: 'Dr. R. Collins', pharmacy: 'Capitol Rx' },
      { medication: 'Hydrocodone/APAP', fill_date: '03/02/2026', quantity: 30, days_supply: 5, prescriber: 'Dr. M. Bell', pharmacy: 'St. Anne Pharmacy' },
    ],
    risk_factors: ['rapid-onset benzodiazepine request', 'history mismatch', 'sparse prior relationship'],
    documentation_flags: ['PDMP review', 'nonprescribing_rationale', 'care coordination'],
    recommended_response: {
      risk_score: 80,
      risk_level: 'high',
      recommendation: 'do_not_prescribe',
      documentation: 'nonprescribing_rationale',
    },
  },
  {
    patient_key: 'RXG-CW-002',
    display_name: 'Charlie Williams',
    dob: '11/01/1989',
    progress_note: {
      visit: 'Established Patient – Primary Care · 04/14/2026',
      chief_complaint: 'Lower back pain.',
      hpi:
        '36-year-old male with lower back pain for approximately 2 weeks, likely related to frequent bending and lifting at work. Pain is dull/aching, 5/10, lumbar, no radiation; aggravated by bending and prolonged standing; relieved by rest. Denies numbness, tingling, or weakness.',
      assessment: 'Low back pain likely musculoskeletal strain; tobacco use disorder; alcohol use; history of substance abuse.',
      summary:
        'Progress note documents musculoskeletal low back pain without neurologic deficit, tobacco use, daily alcohol use, history of substance abuse, and sedating nighttime medications.',
    },
    current_medications: [
      { name: 'Trazodone 150 mg nightly' },
      { name: 'Seroquel / Quetiapine 100 mg nightly' },
    ],
    proposed_medication: 'Hydrocodone/APAP 5-325 mg tablet',
    directions: '1 tablet PO q8h PRN severe back pain, 3 days',
    pdmp_summary_status: 'matched',
    pdmp_records: [
      { medication: 'Trazodone 150 mg', fill_date: '04/02/2026', quantity: 30, days_supply: 30, prescriber: 'Dr. E. Carter', pharmacy: 'Denham Springs' },
      { medication: 'Quetiapine 100 mg', fill_date: '04/02/2026', quantity: 30, days_supply: 30, prescriber: 'Dr. E. Carter', pharmacy: 'Denham Springs' },
    ],
    risk_factors: ['history of substance abuse', 'daily alcohol use', 'concurrent sedating medications'],
    documentation_flags: ['substance-use risk documentation', 'sedation counseling', 'follow-up plan'],
    recommended_response: {
      risk_score: 62,
      risk_level: 'moderate',
      recommendation: 'proceed_with_caution',
      documentation: 'enhanced_monitoring_plan',
    },
  },
  {
    patient_key: 'RXG-GK-003',
    display_name: 'Grover Keeling',
    dob: '12/10/2013',
    progress_note: {
      visit: 'Established Patient – Orthopedic Follow-Up · 04/19/2026',
      chief_complaint: 'Follow-up for left tibial fracture.',
      hpi:
        '12-year-old male presents after ER evaluation for non-displaced linear fracture of the left tibia sustained during baseball 5 days ago. Pain 6/10, localized to mid-shaft tibia, worsens with movement, improves with medication. Limited weight-bearing; mother requests stronger medication.',
      assessment:
        'Closed non-displaced fracture left tibia; acute pain. Pediatric dosing flag: acetaminophen 800 mg exceeds recommended 10–15 mg/kg range for 44.5 kg.',
      summary:
        'Pediatric fracture follow-up documents weight 98 lb / 44.5 kg, limited weight-bearing, guardian request for stronger medication, and excessive acetaminophen dosing.',
    },
    current_medications: [
      { name: 'Ibuprofen 400 mg every 4–6 hours PRN', note: 'within weight-based range' },
      { name: 'Acetaminophen 800 mg every 4 hours alternating', note: 'exceeds recommended range' },
    ],
    proposed_medication: 'Oxycodone oral solution 5 mg/5 mL',
    directions: '2.5 mg PO q6h PRN severe fracture pain, 2 days',
    pdmp_summary_status: 'matched',
    pdmp_records: [
      { medication: 'Ibuprofen 400 mg', fill_date: '04/19/2026', quantity: 30, days_supply: 7, prescriber: 'Dr. M. Reynolds', pharmacy: 'Prairieville' },
      { medication: 'Acetaminophen 800 mg', fill_date: '04/19/2026', quantity: 30, days_supply: 4, prescriber: 'Dr. M. Reynolds', pharmacy: 'Prairieville' },
    ],
    risk_factors: ['pediatric patient', 'weight-based dosing required', 'acetaminophen dose exceeds recommended range'],
    documentation_flags: ['pediatric dosing documentation', 'guardian counseling', 'acetaminophen correction'],
    recommended_response: {
      risk_score: 42,
      risk_level: 'moderate',
      recommendation: 'proceed_with_caution',
      documentation: 'pediatric_dosing_guardrails',
    },
  },
];
