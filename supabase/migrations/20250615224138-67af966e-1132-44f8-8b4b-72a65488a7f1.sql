
-- Criar tabela para armazenar protocolos de antibióticos
CREATE TABLE public.antibiotic_protocols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pathogen_name TEXT NOT NULL,
  antibiotic_tested TEXT NOT NULL,
  sensitivity_result TEXT NOT NULL CHECK (sensitivity_result IN ('S', 'I', 'R')),
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('escalation', 'deescalation', 'maintain')),
  recommended_antibiotic TEXT NOT NULL,
  dose TEXT NOT NULL,
  route TEXT NOT NULL,
  reason TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  clinical_considerations TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_antibiotic_protocols_pathogen ON public.antibiotic_protocols(pathogen_name);
CREATE INDEX idx_antibiotic_protocols_antibiotic ON public.antibiotic_protocols(antibiotic_tested);
CREATE INDEX idx_antibiotic_protocols_sensitivity ON public.antibiotic_protocols(sensitivity_result);
CREATE INDEX idx_antibiotic_protocols_active ON public.antibiotic_protocols(is_active);

-- Habilitar RLS (não necessário para dados públicos de protocolos clínicos)
ALTER TABLE public.antibiotic_protocols ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura a todos os usuários autenticados
CREATE POLICY "Users can read antibiotic protocols" 
  ON public.antibiotic_protocols 
  FOR SELECT 
  TO authenticated
  USING (is_active = true);

-- Criar política para permitir inserção e atualização apenas para farmacêuticos
CREATE POLICY "Farmaceuticos can insert antibiotic protocols" 
  ON public.antibiotic_protocols 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_farmaceutico(auth.uid()));

CREATE POLICY "Farmaceuticos can update antibiotic protocols" 
  ON public.antibiotic_protocols 
  FOR UPDATE 
  TO authenticated
  USING (public.is_farmaceutico(auth.uid()));

-- Adicionar trigger para atualizar updated_at
CREATE TRIGGER update_antibiotic_protocols_updated_at 
  BEFORE UPDATE ON public.antibiotic_protocols 
  FOR EACH ROW 
  EXECUTE PROCEDURE public.update_updated_at_column();

-- Inserir alguns protocolos iniciais
INSERT INTO public.antibiotic_protocols (
  pathogen_name, antibiotic_tested, sensitivity_result, recommendation_type,
  recommended_antibiotic, dose, route, reason, priority
) VALUES 
-- Staphylococcus aureus
('Staphylococcus aureus', 'Oxacilina', 'S', 'deescalation', 'Oxacilina', '1-2g q4h', 'IV', 'S. aureus sensível à oxacilina (MSSA) - descalonamento de vancomicina', 'high'),
('Staphylococcus aureus', 'Oxacilina', 'R', 'escalation', 'Vancomicina', '15-20mg/kg q8-12h', 'IV', 'S. aureus resistente à oxacilina (MRSA)', 'high'),
('Staphylococcus aureus', 'Oxacilina', 'R', 'escalation', 'Linezolida', '600mg q12h', 'IV/VO', 'Alternativa para MRSA (boa penetração pulmonar/SNC)', 'medium'),

-- Escherichia coli
('Escherichia coli', 'Ceftriaxone', 'S', 'deescalation', 'Ceftriaxone', '1-2g q24h', 'IV', 'E. coli sensível à ceftriaxone - descalonamento de carbapenêmico', 'high'),
('Escherichia coli', 'Ceftriaxone', 'R', 'escalation', 'Meropenem', '1g q8h', 'IV', 'E. coli resistente à ceftriaxone - suspeita ESBL', 'high'),
('Escherichia coli', 'Ceftriaxone', 'R', 'escalation', 'Ertapenem', '1g q24h', 'IV', 'Alternativa para ESBL (sem atividade anti-Pseudomonas)', 'medium'),

-- Pseudomonas aeruginosa
('Pseudomonas aeruginosa', 'Ceftazidima', 'S', 'deescalation', 'Ceftazidima', '2g q8h', 'IV', 'P. aeruginosa sensível - terapia dirigida', 'high'),
('Pseudomonas aeruginosa', 'Cefepime', 'S', 'deescalation', 'Cefepime', '2g q8h', 'IV', 'Alternativa para P. aeruginosa sensível', 'medium'),
('Pseudomonas aeruginosa', 'Meropenem', 'R', 'escalation', 'Colistina', '2,5mg/kg q12h', 'IV', 'P. aeruginosa multirresistente - colistina + segundo agente', 'high'),

-- Streptococcus pneumoniae
('Streptococcus pneumoniae', 'Penicilina G', 'S', 'deescalation', 'Penicilina G', '2-4 milhões UI q4h', 'IV', 'S. pneumoniae sensível à penicilina', 'high'),
('Streptococcus pneumoniae', 'Penicilina G', 'R', 'maintain', 'Ceftriaxone', '2g q12h', 'IV', 'S. pneumoniae resistente à penicilina', 'high'),

-- Klebsiella pneumoniae
('Klebsiella pneumoniae', 'Ceftriaxone', 'R', 'escalation', 'Meropenem', '1g q8h', 'IV', 'K. pneumoniae resistente - suspeita ESBL ou KPC', 'high'),
('Klebsiella pneumoniae', 'Meropenem', 'R', 'escalation', 'Colistina + Meropenem', 'Colistina 2,5mg/kg q12h + Meropenem 2g q8h', 'IV', 'K. pneumoniae KPC - terapia combinada', 'high'),

-- Enterococcus faecalis
('Enterococcus faecalis', 'Ampicilina', 'S', 'deescalation', 'Ampicilina', '2g q4h', 'IV', 'E. faecalis sensível à ampicilina', 'high'),
('Enterococcus faecalis', 'Vancomicina', 'R', 'escalation', 'Linezolida', '600mg q12h', 'IV/VO', 'VRE - Enterococcus resistente à vancomicina', 'high');
