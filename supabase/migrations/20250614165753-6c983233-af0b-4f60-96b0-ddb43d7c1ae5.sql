
-- Criar tabela para armazenar as estimativas de tratamento
CREATE TABLE public.treatment_estimations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimation_date DATE NOT NULL,
  hospital_unit TEXT NOT NULL,
  antimicrobial_name TEXT NOT NULL,
  daily_dose_per_patient DECIMAL NOT NULL,
  average_treatment_days INTEGER NOT NULL,
  frequency_per_day INTEGER NOT NULL,
  total_patients_using INTEGER NOT NULL,
  current_stock DECIMAL NOT NULL,
  stock_unit TEXT NOT NULL DEFAULT 'mg',
  daily_consumption DECIMAL NOT NULL,
  treatment_consumption DECIMAL NOT NULL,
  stock_coverage_days DECIMAL NOT NULL,
  is_stock_sufficient BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(estimation_date, hospital_unit, antimicrobial_name)
);

-- Adicionar comentários para documentação
COMMENT ON TABLE public.treatment_estimations IS 'Estimativas diárias de consumo de antimicrobianos por unidade hospitalar';
COMMENT ON COLUMN public.treatment_estimations.estimation_date IS 'Data da estimativa';
COMMENT ON COLUMN public.treatment_estimations.hospital_unit IS 'Unidade hospitalar (UTI Adulto, UTI Pediátrica, etc.)';
COMMENT ON COLUMN public.treatment_estimations.antimicrobial_name IS 'Nome do antimicrobiano';
COMMENT ON COLUMN public.treatment_estimations.daily_dose_per_patient IS 'Dose diária total por paciente';
COMMENT ON COLUMN public.treatment_estimations.average_treatment_days IS 'Tempo médio de tratamento em dias';
COMMENT ON COLUMN public.treatment_estimations.frequency_per_day IS 'Frequência de administração por dia';
COMMENT ON COLUMN public.treatment_estimations.total_patients_using IS 'Total de pacientes usando o antimicrobiano';
COMMENT ON COLUMN public.treatment_estimations.current_stock IS 'Estoque atual disponível';
COMMENT ON COLUMN public.treatment_estimations.stock_unit IS 'Unidade do estoque (mg, UI, frascos, etc.)';
COMMENT ON COLUMN public.treatment_estimations.daily_consumption IS 'Consumo diário total calculado';
COMMENT ON COLUMN public.treatment_estimations.treatment_consumption IS 'Consumo total do tratamento calculado';
COMMENT ON COLUMN public.treatment_estimations.stock_coverage_days IS 'Dias de cobertura do estoque atual';
COMMENT ON COLUMN public.treatment_estimations.is_stock_sufficient IS 'Indica se o estoque é suficiente para o tratamento';

-- Habilitar RLS na tabela
ALTER TABLE public.treatment_estimations ENABLE ROW LEVEL SECURITY;

-- Criar policy para permitir acesso a todos os usuários autenticados (dados institucionais)
CREATE POLICY "Allow all authenticated users to access treatment estimations" 
  ON public.treatment_estimations 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Criar índices para melhorar performance
CREATE INDEX idx_treatment_estimations_date_unit ON public.treatment_estimations(estimation_date, hospital_unit);
CREATE INDEX idx_treatment_estimations_antimicrobial ON public.treatment_estimations(antimicrobial_name);
CREATE INDEX idx_treatment_estimations_date ON public.treatment_estimations(estimation_date DESC);
