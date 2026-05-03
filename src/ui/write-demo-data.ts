import fs from 'node:fs';
import { buildLocalCliReview } from '../cli/local-adapter.js';

const demoInput = {
  name: 'Tamera164 Wisozk929',
  dob: '1980-02-03',
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
    displayName: 'Tamera164 Wisozk929',
    chartName: 'WISOZK, TAMERA164',
    dobDisplay: '02/03/1980',
    age: 46,
    mrn: '903184',
    patientId: '617290',
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
