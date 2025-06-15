
-- Remover tabelas existentes se houver
DROP TABLE IF EXISTS public.round_checklist_items CASCADE;
DROP TABLE IF EXISTS public.multiprofessional_rounds CASCADE;
DROP TABLE IF EXISTS public.round_patients CASCADE;
DROP TABLE IF EXISTS public.round_active_problems CASCADE;

-- Tabela para armazenar informações dos pacientes dos rounds
CREATE TABLE public.round_patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  birth_date DATE,
  sector TEXT NOT NULL CHECK (sector IN ('UTI Adulto', 'UTI Neonatal', 'UTI Pediátrica')),
  bed TEXT NOT NULL,
  mother_name TEXT,
  hospitalization_days INTEGER,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela principal dos rounds multiprofissionais
CREATE TABLE public.multiprofessional_rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  round_type TEXT NOT NULL CHECK (round_type IN ('Adulto', 'Neonatal', 'Pediátrica')),
  round_date DATE NOT NULL DEFAULT CURRENT_DATE,
  patient_id UUID REFERENCES public.round_patients(id) ON DELETE CASCADE,
  
  -- Status Atual
  dvas_usage BOOLEAN DEFAULT FALSE,
  dvas_usage_obs TEXT,
  sedation_analgesia BOOLEAN DEFAULT FALSE,
  sedation_analgesia_obs TEXT,
  antibiotic_therapy BOOLEAN DEFAULT FALSE,
  antibiotic_therapy_obs TEXT,
  tev_prophylaxis BOOLEAN DEFAULT FALSE,
  tev_prophylaxis_obs TEXT,
  lamg_prophylaxis BOOLEAN DEFAULT FALSE,
  lamg_prophylaxis_obs TEXT,
  
  -- Avaliação Funcional
  renal_function TEXT CHECK (renal_function IN ('Preservada', 'Alterada')),
  renal_function_obs TEXT,
  hepatic_function TEXT CHECK (hepatic_function IN ('Preservada', 'Alterada')),
  hepatic_function_obs TEXT,
  pulmonary_function TEXT CHECK (pulmonary_function IN ('Preservada', 'Alterada')),
  pulmonary_function_obs TEXT,
  evacuation TEXT CHECK (evacuation IN ('Preservada', 'Alterada')),
  evacuation_obs TEXT,
  diuresis TEXT CHECK (diuresis IN ('Preservada', 'Alterada')),
  diuresis_obs TEXT,
  
  -- Farmacoterapia
  severe_drug_interaction BOOLEAN DEFAULT FALSE,
  severe_drug_interaction_obs TEXT,
  adequate_administration_route BOOLEAN DEFAULT FALSE,
  adequate_administration_route_obs TEXT,
  drug_allergy BOOLEAN DEFAULT FALSE,
  drug_allergy_obs TEXT,
  updated_lab_data BOOLEAN DEFAULT FALSE,
  updated_lab_data_obs TEXT,
  
  -- Antibioticoterapia
  indication_compliance BOOLEAN DEFAULT FALSE,
  adequate_spectrum BOOLEAN DEFAULT FALSE,
  correct_dosage BOOLEAN DEFAULT FALSE,
  treatment_time_defined BOOLEAN DEFAULT FALSE,
  antibiotic_action TEXT CHECK (antibiotic_action IN ('Iniciar', 'Ajustar', 'Suspender', 'Nenhuma')),
  
  -- Metas Terapêuticas
  adequate_glycemic_control BOOLEAN DEFAULT FALSE,
  adequate_glycemic_control_obs TEXT,
  adequate_sedation_level BOOLEAN DEFAULT FALSE,
  adequate_sedation_level_obs TEXT,
  sedation_can_be_reduced BOOLEAN DEFAULT FALSE,
  sedation_can_be_reduced_obs TEXT,
  
  -- Planejamento de Alta
  discharge_estimate BOOLEAN DEFAULT FALSE,
  discharge_criteria_met BOOLEAN DEFAULT FALSE,
  discharge_pending_issues TEXT,
  
  -- Ações do Round
  pharmacy_actions TEXT,
  medicine_actions TEXT,
  nursing_actions TEXT,
  physiotherapy_actions TEXT,
  nutrition_actions TEXT,
  
  -- Rodapé
  present_professionals TEXT,
  next_evaluation DATE,
  
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para problemas ativos
CREATE TABLE public.round_active_problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  round_id UUID REFERENCES public.multiprofessional_rounds(id) ON DELETE CASCADE,
  problem_description TEXT NOT NULL,
  expected_result TEXT,
  status TEXT CHECK (status IN ('Atingido', 'Não atingido', 'Suspenso', 'Em andamento')),
  observations TEXT,
  problem_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.round_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multiprofessional_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.round_active_problems ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para round_patients
CREATE POLICY "Users can view their own patients" 
  ON public.round_patients 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own patients" 
  ON public.round_patients 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patients" 
  ON public.round_patients 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patients" 
  ON public.round_patients 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para multiprofessional_rounds
CREATE POLICY "Users can view their own rounds" 
  ON public.multiprofessional_rounds 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rounds" 
  ON public.multiprofessional_rounds 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rounds" 
  ON public.multiprofessional_rounds 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rounds" 
  ON public.multiprofessional_rounds 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para round_active_problems
CREATE POLICY "Users can view problems through rounds" 
  ON public.round_active_problems 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.multiprofessional_rounds 
    WHERE id = round_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create problems for their rounds" 
  ON public.round_active_problems 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.multiprofessional_rounds 
    WHERE id = round_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update problems through rounds" 
  ON public.round_active_problems 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.multiprofessional_rounds 
    WHERE id = round_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete problems through rounds" 
  ON public.round_active_problems 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.multiprofessional_rounds 
    WHERE id = round_id AND user_id = auth.uid()
  ));

-- Triggers para atualizar updated_at
CREATE TRIGGER update_round_patients_updated_at
  BEFORE UPDATE ON public.round_patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_multiprofessional_rounds_updated_at
  BEFORE UPDATE ON public.multiprofessional_rounds
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_round_active_problems_updated_at
  BEFORE UPDATE ON public.round_active_problems
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_round_patients_user_id ON public.round_patients(user_id);
CREATE INDEX idx_multiprofessional_rounds_user_id ON public.multiprofessional_rounds(user_id);
CREATE INDEX idx_multiprofessional_rounds_patient_id ON public.multiprofessional_rounds(patient_id);
CREATE INDEX idx_multiprofessional_rounds_date ON public.multiprofessional_rounds(round_date);
CREATE INDEX idx_round_active_problems_round_id ON public.round_active_problems(round_id);
