
-- Atualizar a tabela de estimativas para um modelo mais simples e focado no uso diário
ALTER TABLE public.treatment_estimations 
DROP CONSTRAINT IF EXISTS unique_estimation_per_unit_drug_date;

-- Modificar a estrutura para ser mais simples
ALTER TABLE public.treatment_estimations 
DROP COLUMN IF EXISTS average_treatment_days,
DROP COLUMN IF EXISTS frequency_per_day,
DROP COLUMN IF EXISTS treatment_consumption,
DROP COLUMN IF EXISTS is_stock_sufficient;

-- Adicionar colunas mais relevantes para uso diário
ALTER TABLE public.treatment_estimations 
ADD COLUMN IF NOT EXISTS dose_per_patient DECIMAL(10,3) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS active_patients INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_days INTEGER NOT NULL DEFAULT 7,
ADD COLUMN IF NOT EXISTS daily_total_consumption DECIMAL(12,3) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS days_remaining DECIMAL(8,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS alert_level TEXT NOT NULL DEFAULT 'normal';

-- Renomear colunas para melhor clareza
ALTER TABLE public.treatment_estimations 
RENAME COLUMN daily_dose_per_patient TO dose_per_patient_old;

ALTER TABLE public.treatment_estimations 
RENAME COLUMN total_patients_using TO active_patients_old;

ALTER TABLE public.treatment_estimations 
RENAME COLUMN daily_consumption TO daily_total_consumption_old;

-- Criar nova constraint única mais simples
ALTER TABLE public.treatment_estimations 
ADD CONSTRAINT unique_daily_estimation 
UNIQUE(estimation_date, hospital_unit, antimicrobial_name);

-- Atualizar os check constraints
ALTER TABLE public.treatment_estimations 
DROP CONSTRAINT IF EXISTS check_positive_daily_dose,
DROP CONSTRAINT IF EXISTS check_positive_treatment_days,
DROP CONSTRAINT IF EXISTS check_positive_frequency,
DROP CONSTRAINT IF EXISTS check_positive_patients;

-- Adicionar novos check constraints
ALTER TABLE public.treatment_estimations 
ADD CONSTRAINT check_positive_dose_per_patient 
CHECK (dose_per_patient > 0);

ALTER TABLE public.treatment_estimations 
ADD CONSTRAINT check_positive_active_patients 
CHECK (active_patients > 0);

ALTER TABLE public.treatment_estimations 
ADD CONSTRAINT check_positive_estimated_days 
CHECK (estimated_days > 0);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_treatment_estimations_alert_level 
ON public.treatment_estimations(alert_level, estimation_date);

-- Atualizar comentários
COMMENT ON COLUMN public.treatment_estimations.dose_per_patient IS 'Dose individual por paciente (em gramas/mg/UI)';
COMMENT ON COLUMN public.treatment_estimations.active_patients IS 'Número de pacientes ativos em tratamento';
COMMENT ON COLUMN public.treatment_estimations.estimated_days IS 'Dias estimados de tratamento';
COMMENT ON COLUMN public.treatment_estimations.daily_total_consumption IS 'Consumo diário total da unidade';
COMMENT ON COLUMN public.treatment_estimations.days_remaining IS 'Dias restantes de estoque';
COMMENT ON COLUMN public.treatment_estimations.alert_level IS 'Nível de alerta: normal, baixo, crítico';
