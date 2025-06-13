
-- Create table for drug interactions
CREATE TABLE public.drug_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drug1_name TEXT NOT NULL,
  drug2_name TEXT NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('drug-drug', 'drug-nutrient')),
  severity_level TEXT NOT NULL CHECK (severity_level IN ('leve', 'moderada', 'grave', 'contraindicada')),
  clinical_effect TEXT NOT NULL,
  mechanism TEXT NOT NULL,
  management TEXT NOT NULL,
  bibliography TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for interaction checks/sessions
CREATE TABLE public.interaction_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT,
  patient_age TEXT,
  pharmacist_name TEXT,
  medications JSONB NOT NULL,
  interactions_found JSONB,
  check_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.drug_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interaction_checks ENABLE ROW LEVEL SECURITY;

-- Policies for drug_interactions (public read, admin write)
CREATE POLICY "Anyone can view drug interactions" 
  ON public.drug_interactions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage drug interactions" 
  ON public.drug_interactions 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Policies for interaction_checks (anyone can create and view their own)
CREATE POLICY "Anyone can create interaction checks" 
  ON public.interaction_checks 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view interaction checks" 
  ON public.interaction_checks 
  FOR SELECT 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_drug_interactions_drug1 ON public.drug_interactions(drug1_name);
CREATE INDEX idx_drug_interactions_drug2 ON public.drug_interactions(drug2_name);
CREATE INDEX idx_drug_interactions_type ON public.drug_interactions(interaction_type);
CREATE INDEX idx_interaction_checks_date ON public.interaction_checks(check_date);

-- Insert sample drug interactions data
INSERT INTO public.drug_interactions (drug1_name, drug2_name, interaction_type, severity_level, clinical_effect, mechanism, management, bibliography) VALUES
('Varfarina', 'Aspirina', 'drug-drug', 'grave', 'Aumento do risco de sangramento', 'Ambos medicamentos possuem efeitos anticoagulantes/antiplaquetários', 'Monitorar INR frequentemente. Considerar gastroproteção. Avaliar necessidade de ambos medicamentos.', 'Micromedex, UpToDate'),

('Digoxina', 'Furosemida', 'drug-drug', 'moderada', 'Aumento do risco de toxicidade da digoxina', 'Furosemida causa perda de potássio, aumentando sensibilidade à digoxina', 'Monitorar níveis séricos de digoxina e eletrólitos. Suplementar potássio se necessário.', 'Micromedex'),

('Atorvastatina', 'Sinvastatina', 'drug-drug', 'contraindicada', 'Duplicação terapêutica desnecessária', 'Ambos são estatinas com mesmo mecanismo de ação', 'Escolher apenas uma estatina. Não usar simultaneamente.', 'Bulas dos medicamentos'),

('Omeprazol', 'Clopidogrel', 'drug-drug', 'moderada', 'Redução da eficácia antiplaquetar do clopidogrel', 'Omeprazol inibe CYP2C19, enzima necessária para ativação do clopidogrel', 'Considerar pantoprazol como alternativa ao omeprazol ou esomeprazol.', 'FDA, EMA'),

('Captopril', 'Espironolactona', 'drug-drug', 'moderada', 'Risco de hipercalemia', 'Ambos medicamentos podem aumentar os níveis de potássio', 'Monitorar potássio sérico regularmente. Ajustar doses conforme necessário.', 'Micromedex'),

('Metformina', 'Álcool', 'drug-nutrient', 'moderada', 'Aumento do risco de acidose láctica', 'Álcool interfere no metabolismo do lactato', 'Evitar consumo excessivo de álcool. Orientar sobre os riscos.', 'Bula da metformina'),

('Varfarina', 'Vitamina K', 'drug-nutrient', 'moderada', 'Redução do efeito anticoagulante', 'Vitamina K antagoniza o efeito da varfarina', 'Manter consumo constante de alimentos ricos em vitamina K. Monitorar INR.', 'Guidelines de anticoagulação'),

('Levotiroxina', 'Cálcio', 'drug-nutrient', 'leve', 'Redução da absorção da levotiroxina', 'Cálcio forma complexos insolúveis com levotiroxina', 'Administrar cálcio pelo menos 4 horas após a levotiroxina.', 'Bula da levotiroxina'),

('Tetraciclina', 'Leite/Laticínios', 'drug-nutrient', 'moderada', 'Redução significativa da absorção', 'Cálcio e outros minerais quelam a tetraciclina', 'Evitar laticínios 2 horas antes e depois da tetraciclina.', 'Farmacologia clínica'),

('Sinvastatina', 'Toranja', 'drug-nutrient', 'grave', 'Aumento dos níveis séricos e risco de miopatia', 'Toranja inibe CYP3A4, enzima que metaboliza sinvastatina', 'Evitar completamente o consumo de toranja e seu suco.', 'FDA Warning'),

('Amlodipino', 'Diltiazem', 'drug-drug', 'moderada', 'Potencialização do efeito hipotensor', 'Ambos são bloqueadores de canais de cálcio', 'Monitorar pressão arterial. Ajustar doses conforme necessário.', 'Micromedex'),

('Propranolol', 'Insulina', 'drug-drug', 'moderada', 'Mascaramento dos sintomas de hipoglicemia', 'Beta-bloqueadores podem mascarar taquicardia da hipoglicemia', 'Monitorar glicemia mais frequentemente. Orientar sobre sintomas alternativos.', 'Guidelines de diabetes'),

('Fenitoína', 'Ácido Fólico', 'drug-nutrient', 'leve', 'Redução dos níveis de fenitoína', 'Ácido fólico pode acelerar metabolismo da fenitoína', 'Monitorar níveis séricos de fenitoína. Ajustar dose se necessário.', 'Literatura neurológica'),

('Lítio', 'Hidroclorotiazida', 'drug-drug', 'grave', 'Aumento dos níveis séricos de lítio', 'Diuréticos tiazídicos reduzem clearance renal do lítio', 'Monitorar níveis séricos de lítio. Reduzir dose se necessário.', 'Micromedex'),

('Ciprofloxacino', 'Ferro', 'drug-nutrient', 'moderada', 'Redução da absorção do antibiótico', 'Ferro forma complexos com quinolonas', 'Administrar ferro pelo menos 2 horas antes ou 6 horas após ciprofloxacino.', 'Bula do ciprofloxacino');
