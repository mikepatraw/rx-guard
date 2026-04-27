import fs from 'node:fs';
import { buildLocalCliReview } from '../cli/local-adapter.js';

const demoInput = {
  name: 'Sheila Bankston',
  dob: '1960-06-13',
  medication: 'Xanax 1 mg tablet',
  directions: '1 tablet PO BID PRN for anxiety',
  history: 'no recent narcotic or controlled-substance use',
  note: 'PDMP review not yet documented'
};

const review = buildLocalCliReview(demoInput);

const uiDemoData = {
  generatedFrom: 'src/cli/local-adapter.ts',
  demoInput,
  resolvedSyntheticKey: review.syntheticPatientKey,
  promptOpinionPayload: review.promptOpinionPayload,
  promptOpinionResponse: review.promptOpinionResponse,
  rxGuardReview: {
    riskLevel: review.rxGuardReview.riskLevel,
    summary: review.rxGuardReview.summary,
    flags: review.rxGuardReview.flags.map((flag) => ({
      code: flag.code,
      severity: flag.severity,
      message: flag.message
    })),
    pdmpCrossReference: review.rxGuardReview.pdmpCrossReference
  },
  localPdmpRows: review.pdmpRows,
  patient: {
    displayName: 'Sheila Bankston',
    chartName: 'BANKSTON, SHEILA',
    dobDisplay: '06/13/1960',
    age: 65,
    mrn: '458293',
    patientId: '284756',
    sex: 'F'
  },
  encounter: {
    pdmpQueryDate: '04/19/2026 10:32 AM',
    provider: 'Smith, John DC',
    organization: 'Advanced Pain & Spine'
  }
};

const output = `window.RXGUARD_LOCAL_DEMO = ${JSON.stringify(uiDemoData, null, 2)};\n`;
fs.writeFileSync('public/demo-data.js', output, 'utf8');
console.log('wrote public/demo-data.js from local CLI adapter');
