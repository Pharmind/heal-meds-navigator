
import { RoundFormData } from '@/types/multiprofessionalRound';

export const getInitialFormData = (): RoundFormData => ({
  round_type: 'Adulto',
  round_date: new Date().toISOString().split('T')[0],
  patient_name: '',
  birth_date: '',
  sector: 'UTI Adulto',
  bed: '',
  mother_name: '',
  hospitalization_days: '',
  
  // Status Atual
  dvas_usage: false,
  dvas_usage_obs: '',
  sedation_analgesia: false,
  sedation_analgesia_obs: '',
  antibiotic_therapy: false,
  antibiotic_therapy_obs: '',
  tev_prophylaxis: false,
  tev_prophylaxis_obs: '',
  lamg_prophylaxis: false,
  lamg_prophylaxis_obs: '',
  
  // Avaliação Funcional
  renal_function: null,
  renal_function_obs: '',
  hepatic_function: null,
  hepatic_function_obs: '',
  pulmonary_function: null,
  pulmonary_function_obs: '',
  evacuation: null,
  evacuation_obs: '',
  diuresis: null,
  diuresis_obs: '',
  
  // Farmacoterapia
  severe_drug_interaction: false,
  severe_drug_interaction_obs: '',
  adequate_administration_route: false,
  adequate_administration_route_obs: '',
  drug_allergy: false,
  drug_allergy_obs: '',
  updated_lab_data: false,
  updated_lab_data_obs: '',
  
  // Antibioticoterapia
  indication_compliance: false,
  adequate_spectrum: false,
  correct_dosage: false,
  treatment_time_defined: false,
  antibiotic_action: null,
  
  // Metas Terapêuticas
  adequate_glycemic_control: false,
  adequate_glycemic_control_obs: '',
  adequate_sedation_level: false,
  adequate_sedation_level_obs: '',
  sedation_can_be_reduced: false,
  sedation_can_be_reduced_obs: '',
  
  // Planejamento de Alta
  discharge_estimate: false,
  discharge_criteria_met: false,
  discharge_pending_issues: '',
  
  // Ações do Round
  pharmacy_actions: '',
  medicine_actions: '',
  nursing_actions: '',
  physiotherapy_actions: '',
  nutrition_actions: '',
  
  // Rodapé
  present_professionals: '',
  next_evaluation: '',
  
  // Problemas Ativos
  active_problems: []
});

export const STORAGE_KEY = 'round_checklist_draft';
