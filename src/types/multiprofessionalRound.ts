
export interface RoundPatient {
  id: string;
  patient_name: string;
  birth_date: string | null;
  sector: 'UTI Adulto' | 'UTI Neonatal' | 'UTI Pediátrica';
  bed: string;
  mother_name: string | null;
  hospitalization_days: number | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ActiveProblem {
  id: string;
  round_id: string;
  problem_description: string;
  expected_result: string | null;
  status: 'Atingido' | 'Não atingido' | 'Suspenso' | 'Em andamento' | null;
  observations: string | null;
  problem_order: number;
  created_at: string;
  updated_at: string;
}

export interface MultiprofessionalRound {
  id: string;
  round_type: 'Adulto' | 'Neonatal' | 'Pediátrica';
  round_date: string;
  patient_id: string | null;
  
  // Status Atual
  dvas_usage: boolean;
  dvas_usage_obs: string | null;
  sedation_analgesia: boolean;
  sedation_analgesia_obs: string | null;
  antibiotic_therapy: boolean;
  antibiotic_therapy_obs: string | null;
  tev_prophylaxis: boolean;
  tev_prophylaxis_obs: string | null;
  lamg_prophylaxis: boolean;
  lamg_prophylaxis_obs: string | null;
  
  // Avaliação Funcional
  renal_function: 'Preservada' | 'Alterada' | null;
  renal_function_obs: string | null;
  hepatic_function: 'Preservada' | 'Alterada' | null;
  hepatic_function_obs: string | null;
  pulmonary_function: 'Preservada' | 'Alterada' | null;
  pulmonary_function_obs: string | null;
  evacuation: 'Preservada' | 'Alterada' | null;
  evacuation_obs: string | null;
  diuresis: 'Preservada' | 'Alterada' | null;
  diuresis_obs: string | null;
  
  // Farmacoterapia
  severe_drug_interaction: boolean;
  severe_drug_interaction_obs: string | null;
  adequate_administration_route: boolean;
  adequate_administration_route_obs: string | null;
  drug_allergy: boolean;
  drug_allergy_obs: string | null;
  updated_lab_data: boolean;
  updated_lab_data_obs: string | null;
  
  // Antibioticoterapia
  indication_compliance: boolean;
  adequate_spectrum: boolean;
  correct_dosage: boolean;
  treatment_time_defined: boolean;
  antibiotic_action: 'Iniciar' | 'Ajustar' | 'Suspender' | 'Nenhuma' | null;
  
  // Metas Terapêuticas
  adequate_glycemic_control: boolean;
  adequate_glycemic_control_obs: string | null;
  adequate_sedation_level: boolean;
  adequate_sedation_level_obs: string | null;
  sedation_can_be_reduced: boolean;
  sedation_can_be_reduced_obs: string | null;
  
  // Planejamento de Alta
  discharge_estimate: boolean;
  discharge_criteria_met: boolean;
  discharge_pending_issues: string | null;
  
  // Ações do Round
  pharmacy_actions: string | null;
  medicine_actions: string | null;
  nursing_actions: string | null;
  physiotherapy_actions: string | null;
  nutrition_actions: string | null;
  
  // Rodapé
  present_professionals: string | null;
  next_evaluation: string | null;
  
  user_id: string;
  created_at: string;
  updated_at: string;
  
  // Relações
  patient?: RoundPatient;
  active_problems?: ActiveProblem[];
}

export interface RoundFormData {
  round_type: 'Adulto' | 'Neonatal' | 'Pediátrica';
  round_date: string;
  
  // Dados do Paciente
  patient_name: string;
  birth_date: string;
  sector: 'UTI Adulto' | 'UTI Neonatal' | 'UTI Pediátrica';
  bed: string;
  mother_name: string;
  hospitalization_days: number | string;
  
  // Resto dos campos do round
  [key: string]: any;
}
