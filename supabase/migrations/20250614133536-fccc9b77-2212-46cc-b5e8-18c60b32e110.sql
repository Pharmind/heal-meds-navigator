
-- Criar tabela para medicamentos de terapia sequencial
CREATE TABLE public.sequential_therapy_medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medication_name TEXT NOT NULL,
  iv_dosage TEXT NOT NULL,
  iv_posology TEXT NOT NULL,
  oral_dosage TEXT NOT NULL,
  oral_posology TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar alguns dados iniciais baseados na tabela da imagem
INSERT INTO public.sequential_therapy_medications (medication_name, iv_dosage, iv_posology, oral_dosage, oral_posology) VALUES
('Aciclovir', '250 mg', '500 mg 8/8 horas', '200 mg', '600 mg 8/8 horas'),
('Ciprofloxacino', '200 mg', '400 mg 12/12 horas', '500 mg', '500 mg 12/12 horas'),
('Claritromicina', '500 mg', '500 mg 12/12 horas', '500 mg', '500 mg 12/12 horas'),
('Clindamicina', '600 mg', '600 mg 6/6 horas', '300 mg', '600 mg 6/6 horas'),
('Dexametasona', '4 mg', '4 mg 6/6 horas', '4 mg', '4 mg 6/6 horas'),
('Dipirona', '1000 mg', '1 ampola 6/6 horas', '10 ml', '40 gotas 6/6 horas'),
('Fenitoína', '250 mg*', '100 mg 8/8 horas', '100 mg', '100 mg 8/8 horas'),
('Fluconazol', '200 mg', '400 mg 1 vez ao dia', '200 mg', '400 mg 1 vez ao dia'),
('Furosemida', '20 mg', '20 mg 6/6 horas', '20 mg', '20 mg 6/6 horas'),
('Hidrocortisona', '100 mg*', '50 mg 6/6 horas', 'Prednisolona 20 mg**', '40 mg 1 vez'),
('Metadona', '10 mg', '10 mg 8/8 horas', '10 mg', '10 mg 8/8 horas'),
('Metoclopramida', '10 mg', '10 mg 8/8 horas', '10 mg', '10 mg 8/8 horas'),
('Metoprolol', '40 mg', '40 mg 8/8 horas', 'Prednisolona 20 mg**', '40 mg 1 vez ao dia');

-- Habilitar RLS (Row Level Security) - opcional, mas recomendado
ALTER TABLE public.sequential_therapy_medications ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura pública (pode ser ajustado conforme necessário)
CREATE POLICY "Allow public read access" ON public.sequential_therapy_medications
  FOR SELECT USING (true);

-- Criar política para permitir escrita para usuários autenticados (pode ser ajustado)
CREATE POLICY "Allow authenticated users to insert" ON public.sequential_therapy_medications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update" ON public.sequential_therapy_medications
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to delete" ON public.sequential_therapy_medications
  FOR DELETE USING (true);
