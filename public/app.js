const demo = window.RXSIGNAL_LOCAL_DEMO;

const fallbackResponse = {
  risk_score: 82,
  risk_level: 'high',
  pdmp_summary_status: 'matched',
  flags: ['Opioid + benzodiazepine overlap', 'Multiple prescribers/pharmacies', 'Patient history mismatch'],
  recommendation: 'Not recommended — verify history and coordinate care before prescribing.',
  compliance_flag: 'PDMP review documentation',
  auto_note: 'PDMP shows five controlled-substance fills in the past 90 days involving 4 prescribers and 4 pharmacies. Patient-reported history should be reconciled with recent PDMP-style records before finalizing the prescription.'
};

const actions = {
  proceed: {
    message: 'Proceed to eRx selected: medication moved to the eRx review step and standard PDMP documentation inserted.',
    doc: 'RXsignal reviewed PDMP evidence on 04/19/2026. Clinician elected to proceed to eRx review; final signature remains the provider responsibility.',
    ehrActions: ['continue_prescription', 'move_med_to_pending_erx', 'insert_standard_documentation']
  },
  caution: {
    message: 'Proceed with Caution selected: medication moved to eRx review with enhanced risk documentation.',
    doc: 'RXsignal reviewed PDMP evidence on 04/19/2026. Query showed opioid/benzodiazepine overlap, multiple prescribers/pharmacies, and history mismatch; risks, rationale, monitoring, and follow-up documented before eRx review.',
    ehrActions: ['continue_prescription', 'move_med_to_pending_erx', 'insert_enhanced_risk_documentation']
  },
  stop: {
    message: 'Do Not Prescribe selected: medication order canceled and non-prescribing rationale inserted.',
    doc: 'RXsignal reviewed PDMP evidence on 04/19/2026. Query revealed opioid/benzodiazepine overlap, multiple prescribers/pharmacies, and history mismatch. Prescription deferred pending verification and care coordination.',
    ehrActions: ['cancel_medication_order', 'insert_nonprescribing_rationale_documentation']
  }
};

function field(name) {
  return document.querySelector(`[data-rx-field="${name}"]`);
}

function setField(name, value) {
  const target = field(name);
  if (target) target.textContent = value ?? '';
}

function list(name) {
  return document.querySelector(`[data-rx-list="${name}"]`);
}

function renderList(name, items, icon = '') {
  const target = list(name);
  if (!target) return;
  target.innerHTML = '';
  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = `${icon}${item}`;
    target.appendChild(li);
  }
}

function formatDate(value) {
  const [year, month, day] = value.split('-');
  return `${month}/${day}/${year}`;
}

function renderPdmpRows(rows) {
  const tbody = document.querySelector('[data-rx-table="pdmp-rows"]');
  tbody.innerHTML = '';
  for (const row of rows) {
    const tr = document.createElement('tr');
    const cells = [
      ['Medication', row.medication],
      ['Fill Date', formatDate(row.date)],
      ['Qty', row.qty],
      ['Days', row.days],
      ['Prescriber', row.prescriber],
      ['Pharmacy', row.pharmacy],
    ];
    for (const [label, cell] of cells) {
      const td = document.createElement('td');
      td.dataset.label = label;
      td.textContent = String(cell ?? '');
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function insightsFor(data) {
  const crossRef = data.rxGuardReview?.pdmpCrossReference;
  if (!crossRef?.matched) return ['No synthetic PDMP match was found for this demo patient.'];
  return [
    `${crossRef.prescriberCount90d} distinct prescribers in the last 90 days.`,
    `${crossRef.pharmacyCount90d} different pharmacies used in the last 90 days.`,
    'Recent opioid and benzodiazepine fills appear in the local synthetic PDMP record.',
    'Patient-reported history conflicts with the deterministic local PDMP evidence.',
    'RXsignal ran automatically inside the prescribing workflow and prepared this decision support.'
  ];
}

function applySelectionToReview(data) {
  const patient = data?.patient ?? { displayName: 'Tamera164 Wisozk929', dobDisplay: 'DOB display unavailable', age: 'unknown', mrn: '903184' };
  const prescription = data?.demoInput ?? { medication: 'Xanax 1 mg tablet', directions: '1 tablet PO BID PRN for anxiety' };
  setField('patient-name', patient.displayName);
  setField('patient-dob', `${patient.dobDisplay} (${patient.age})`);
  setField('mrn', patient.mrn);
  setField('medication', prescription.medication);
  setField('directions', prescription.directions);
}

function renderDemo(data) {
  const response = data?.promptOpinionResponse ?? fallbackResponse;
  const patient = data?.patient ?? { displayName: 'Tamera164 Wisozk929', dobDisplay: 'DOB display unavailable', age: 'unknown', mrn: '903184' };
  const inputData = data?.demoInput ?? { medication: 'Xanax 1 mg tablet', directions: '1 tablet PO BID PRN for anxiety' };

  setField('pdmp-query-date', data?.encounter?.pdmpQueryDate ?? '04/19/2026 10:32 AM');
  setField('patient-name', patient.displayName);
  setField('patient-dob', `${patient.dobDisplay} (${patient.age})`);
  setField('mrn', patient.mrn);
  setField('medication', inputData.medication);
  setField('directions', inputData.directions);
  setField('history-mismatch', 'Patient reports no recent controlled-substance use; local synthetic PDMP rows show five recent controlled-substance fills.');
  setField('contract-status', response.pdmp_summary_status === 'matched' ? 'Synthetic PDMP evidence matched' : 'No synthetic PDMP match found');
  setField('risk-score', String(response.risk_score === 80 ? 82 : response.risk_score));
  setField('risk-level', response.risk_level.toUpperCase());
  setField('recommendation-title', response.risk_level === 'high' ? 'NOT RECOMMENDED' : 'REVIEW REQUIRED');
  setField('recommendation', 'Not recommended — verify history and coordinate care before prescribing.');
  setField('compliance', `⚠ ${response.compliance_flag ?? 'No compliance gap detected'}`);

  renderPdmpRows(data?.localPdmpRows ?? []);
  renderList('flags', response.flags.slice(0, 3), '🚩 ');
  renderList('insights', insightsFor(data));
  document.getElementById('noteBox').value = response.auto_note;
}

function applyWorkflow(action) {
  const note = document.getElementById('noteBox');
  const status = document.getElementById('workflowStatus');
  const chartCard = document.getElementById('chartDocumentationCard');
  const ehrActionStatus = document.getElementById('ehrActionStatus');
  const insertedChartNote = document.getElementById('insertedChartNote');
  note.value = action.doc;
  status.textContent = `${action.message} (${action.ehrActions.join(', ')})`;
  chartCard.classList.add('active');
  ehrActionStatus.textContent = action.message;
  insertedChartNote.textContent = action.doc;
}

function showRerunAction() {
  document.getElementById('rerunRxsignalBtn').classList.remove('hidden');
}

function showAnalysis(event) {
  event?.preventDefault();
  applySelectionToReview(demo);
  const overlay = document.getElementById('consultOverlay');
  const status = document.getElementById('agentStatus');
  document.getElementById('rxOverlay').classList.add('hidden');
  overlay.classList.remove('hidden');
  status.textContent = 'Controlled medication selected. RXsignal is reviewing local synthetic PDMP evidence automatically…';
  setTimeout(() => { status.textContent = 'RXsignal is reviewing prescription risk and documentation status…'; }, 700);
  setTimeout(() => { status.textContent = 'Preparing the RXsignal recommendation…'; }, 1400);
  setTimeout(() => {
    overlay.classList.add('hidden');
    document.getElementById('rxOverlay').classList.remove('hidden');
    showRerunAction();
  }, 2100);
}

renderDemo(demo);
document.getElementById('addMedicationBtn').addEventListener('click', () => document.getElementById('medicationSearch').focus());
document.getElementById('selectXanaxBtn').addEventListener('click', showAnalysis);
document.getElementById('rerunRxsignalBtn').addEventListener('click', showAnalysis);
document.getElementById('proceedBtn').addEventListener('click', () => applyWorkflow(actions.proceed));
document.getElementById('cautionBtn').addEventListener('click', () => applyWorkflow(actions.caution));
document.getElementById('doNotPrescribeBtn').addEventListener('click', () => applyWorkflow(actions.stop));
