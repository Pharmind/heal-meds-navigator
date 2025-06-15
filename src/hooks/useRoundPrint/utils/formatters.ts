
import { MultiprofessionalRound } from '@/types/multiprofessionalRound';

export const formatPatientInfo = (round: MultiprofessionalRound) => {
  const patient = round.patient;
  if (!patient) return 'Informações do paciente não disponíveis';

  const age = patient.birth_date 
    ? `${Math.floor((new Date().getTime() - new Date(patient.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} anos`
    : 'Idade não informada';

  return `
    <div class="patient-info">
      <div class="info-grid">
        <div><strong>Nome:</strong> ${patient.patient_name}</div>
        <div><strong>Idade:</strong> ${age}</div>
        <div><strong>Setor:</strong> ${patient.sector}</div>
        <div><strong>Leito:</strong> ${patient.bed}</div>
        ${patient.mother_name ? `<div><strong>Mãe:</strong> ${patient.mother_name}</div>` : ''}
        ${patient.hospitalization_days ? `<div><strong>Dias internação:</strong> ${patient.hospitalization_days}</div>` : ''}
      </div>
    </div>
  `;
};

export const formatCurrentStatus = (round: MultiprofessionalRound) => {
  const statusItems = [
    { label: 'DVAs', value: round.dvas_usage, obs: round.dvas_usage_obs },
    { label: 'Sedoanalgesia', value: round.sedation_analgesia, obs: round.sedation_analgesia_obs },
    { label: 'Antibióticos', value: round.antibiotic_therapy, obs: round.antibiotic_therapy_obs },
    { label: 'Profilaxia TEV', value: round.tev_prophylaxis, obs: round.tev_prophylaxis_obs },
    { label: 'Profilaxia LAMG', value: round.lamg_prophylaxis, obs: round.lamg_prophylaxis_obs }
  ];

  return statusItems
    .filter(item => item.value)
    .map(item => `
      <div class="compact-item">
        <strong>${item.label}</strong>${item.obs ? `: ${item.obs}` : ''}
      </div>
    `).join('');
};

export const formatFunctionalAssessment = (round: MultiprofessionalRound) => {
  const functions = [
    { label: 'F.Renal', value: round.renal_function, obs: round.renal_function_obs },
    { label: 'F.Hepática', value: round.hepatic_function, obs: round.hepatic_function_obs },
    { label: 'F.Pulmonar', value: round.pulmonary_function, obs: round.pulmonary_function_obs },
    { label: 'Evacuação', value: round.evacuation, obs: round.evacuation_obs },
    { label: 'Diurese', value: round.diuresis, obs: round.diuresis_obs }
  ];

  return functions
    .filter(func => func.value)
    .map(func => `
      <span class="inline-item"><strong>${func.label}:</strong> ${func.value}${func.obs ? ` (${func.obs})` : ''}</span>
    `).join(' • ');
};

export const formatActions = (round: MultiprofessionalRound) => {
  const actions = [
    { label: 'Farm', value: round.pharmacy_actions },
    { label: 'Med', value: round.medicine_actions },
    { label: 'Enf', value: round.nursing_actions },
    { label: 'Fisio', value: round.physiotherapy_actions },
    { label: 'Nutr', value: round.nutrition_actions }
  ];

  return actions
    .filter(action => action.value)
    .map(action => `
      <div class="action-compact">
        <strong>${action.label}:</strong> ${action.value}
      </div>
    `).join('');
};
