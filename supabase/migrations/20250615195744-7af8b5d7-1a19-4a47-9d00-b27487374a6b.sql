
-- Criar tabela para grupos terapêuticos
CREATE TABLE public.therapeutic_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para medicamentos de referência
CREATE TABLE public.reference_medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  therapeutic_group_id UUID REFERENCES public.therapeutic_groups(id) NOT NULL,
  active_ingredient TEXT,
  therapeutic_class TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para alternativas terapêuticas
CREATE TABLE public.therapeutic_alternatives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_medication_id UUID REFERENCES public.reference_medications(id) NOT NULL,
  alternative_name TEXT NOT NULL,
  active_ingredient TEXT,
  dosage TEXT NOT NULL,
  administration_route TEXT NOT NULL,
  equivalent_dose TEXT,
  considerations TEXT,
  contraindications TEXT,
  availability TEXT CHECK (availability IN ('disponivel', 'indisponivel', 'controlado')) DEFAULT 'disponivel',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_reference_medications_therapeutic_group ON public.reference_medications(therapeutic_group_id);
CREATE INDEX idx_therapeutic_alternatives_reference_medication ON public.therapeutic_alternatives(reference_medication_id);
CREATE INDEX idx_reference_medications_name ON public.reference_medications(name);
CREATE INDEX idx_therapeutic_alternatives_alternative_name ON public.therapeutic_alternatives(alternative_name);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.therapeutic_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapeutic_alternatives ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso (todos podem ler, mas apenas usuários autenticados podem modificar)
CREATE POLICY "Allow public read access to therapeutic groups" ON public.therapeutic_groups FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert therapeutic groups" ON public.therapeutic_groups FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to update therapeutic groups" ON public.therapeutic_groups FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow public read access to reference medications" ON public.reference_medications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert reference medications" ON public.reference_medications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to update reference medications" ON public.reference_medications FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow public read access to therapeutic alternatives" ON public.therapeutic_alternatives FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert therapeutic alternatives" ON public.therapeutic_alternatives FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to update therapeutic alternatives" ON public.therapeutic_alternatives FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Inserir dados iniciais com uma gama maior de alternativas terapêuticas

-- Grupos terapêuticos
INSERT INTO public.therapeutic_groups (name, description) VALUES
('Analgésicos e Antipiréticos', 'Medicamentos para alívio da dor e febre'),
('Inibidores da Bomba de Prótons', 'Medicamentos para redução da acidez gástrica'),
('Antibióticos Beta-lactâmicos', 'Antibióticos da família das penicilinas e cefalosporinas'),
('Anti-inflamatórios Não Esteroidais', 'Medicamentos anti-inflamatórios não hormonais'),
('Anticoagulantes', 'Medicamentos para prevenção de coágulos'),
('Anti-hipertensivos IECA', 'Inibidores da enzima conversora de angiotensina'),
('Broncodilatadores', 'Medicamentos para dilatação dos brônquios'),
('Antidiabéticos', 'Medicamentos para controle glicêmico'),
('Ansiolíticos', 'Medicamentos para ansiedade'),
('Antidepressivos ISRS', 'Inibidores seletivos da recaptação de serotonina');

-- Medicamentos de referência
INSERT INTO public.reference_medications (name, therapeutic_group_id, active_ingredient, therapeutic_class) VALUES
('Dipirona', (SELECT id FROM public.therapeutic_groups WHERE name = 'Analgésicos e Antipiréticos'), 'Metamizol', 'Analgésico/Antipirético'),
('Omeprazol', (SELECT id FROM public.therapeutic_groups WHERE name = 'Inibidores da Bomba de Prótons'), 'Omeprazol', 'Inibidor da Bomba de Prótons'),
('Amoxicilina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Beta-lactâmicos'), 'Amoxicilina', 'Penicilina'),
('Diclofenaco', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anti-inflamatórios Não Esteroidais'), 'Diclofenaco', 'AINE'),
('Varfarina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anticoagulantes'), 'Varfarina', 'Anticoagulante oral'),
('Captopril', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anti-hipertensivos IECA'), 'Captopril', 'IECA'),
('Salbutamol', (SELECT id FROM public.therapeutic_groups WHERE name = 'Broncodilatadores'), 'Salbutamol', 'Beta-2 agonista'),
('Metformina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antidiabéticos'), 'Metformina', 'Biguanida'),
('Diazepam', (SELECT id FROM public.therapeutic_groups WHERE name = 'Ansiolíticos'), 'Diazepam', 'Benzodiazepínico'),
('Fluoxetina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antidepressivos ISRS'), 'Fluoxetina', 'ISRS');

-- Alternativas terapêuticas para Dipirona
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Dipirona'), 'Paracetamol', 'Paracetamol', '500-1000mg 6/6h', 'VO/IV', '750mg = 500mg dipirona', 'Hepatotoxicidade em doses elevadas. Máximo 4g/dia.', 'Hepatopatia grave', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Dipirona'), 'Ibuprofeno', 'Ibuprofeno', '400-600mg 8/8h', 'VO', '400mg = 500mg dipirona', 'AINE - cuidado em cardiopatas e nefropatas.', 'Úlcera péptica ativa, ICC descompensada', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Dipirona'), 'Cetoprofeno', 'Cetoprofeno', '100mg 12/12h', 'VO/IV', '100mg = 500mg dipirona', 'AINE - monitorar função renal.', 'Insuficiência renal grave', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Dipirona'), 'Tramadol', 'Tramadol', '50-100mg 6/6h', 'VO/IV', '50mg = 500mg dipirona', 'Opioide fraco. Risco de convulsões.', 'Epilepsia não controlada', 'controlado');

-- Alternativas para Omeprazol
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Omeprazol'), 'Pantoprazol', 'Pantoprazol', '40mg 1x/dia', 'VO/IV', '40mg = 20mg omeprazol', 'Menor interação medicamentosa que omeprazol.', 'Hipersensibilidade', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Omeprazol'), 'Esomeprazol', 'Esomeprazol', '40mg 1x/dia', 'VO/IV', '40mg = 20mg omeprazol', 'Enantiômero ativo do omeprazol.', 'Hipersensibilidade', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Omeprazol'), 'Lansoprazol', 'Lansoprazol', '30mg 1x/dia', 'VO', '30mg = 20mg omeprazol', 'Boa eficácia em refluxo gastroesofágico.', 'Hipersensibilidade', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Omeprazol'), 'Ranitidina', 'Ranitidina', '150mg 12/12h', 'VO/IV', '150mg = 20mg omeprazol', 'Antagonista H2 - menor potência que IBP.', 'Porfiria aguda', 'indisponivel');

-- Alternativas para Amoxicilina
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Amoxicilina'), 'Cefalexina', 'Cefalexina', '500mg 6/6h', 'VO', '500mg = 500mg amoxicilina', 'Cefalosporina de 1ª geração. Espectro similar.', 'Alergia a cefalosporinas', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Amoxicilina'), 'Azitromicina', 'Azitromicina', '500mg 1x/dia', 'VO/IV', '500mg = 500mg amoxicilina', 'Macrolídeo - alternativa em alérgicos a β-lactâmicos.', 'Hepatopatia grave', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Amoxicilina'), 'Clindamicina', 'Clindamicina', '300mg 8/8h', 'VO/IV', '300mg = 500mg amoxicilina', 'Boa penetração óssea. Risco de colite pseudomembranosa.', 'Colite prévia por antibióticos', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Amoxicilina'), 'Cefazolina', 'Cefazolina', '1g 8/8h', 'IV', '1g = 500mg amoxicilina', 'Cefalosporina de 1ª geração para uso parenteral.', 'Alergia a cefalosporinas', 'disponivel');

-- Alternativas para Diclofenaco
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Diclofenaco'), 'Ibuprofeno', 'Ibuprofeno', '600mg 8/8h', 'VO', '600mg = 50mg diclofenaco', 'Menor toxicidade gastrointestinal.', 'Úlcera péptica ativa', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Diclofenaco'), 'Naproxeno', 'Naproxeno', '250mg 12/12h', 'VO', '250mg = 50mg diclofenaco', 'Ação prolongada - duas tomadas diárias.', 'Insuficiência cardíaca grave', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Diclofenaco'), 'Meloxicam', 'Meloxicam', '15mg 1x/dia', 'VO', '15mg = 50mg diclofenaco', 'Seletivo COX-2 - menor toxicidade GI.', 'Insuficiência renal grave', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Diclofenaco'), 'Nimesulida', 'Nimesulida', '100mg 12/12h', 'VO', '100mg = 50mg diclofenaco', 'Boa ação anti-inflamatória. Hepatotoxicidade.', 'Hepatopatia, uso > 15 dias', 'disponivel');

-- Alternativas para Varfarina
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Varfarina'), 'Rivaroxabana', 'Rivaroxabana', '20mg 1x/dia', 'VO', '20mg = 5mg varfarina', 'DOAC - não requer monitorização de INR.', 'Sangramento ativo', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Varfarina'), 'Dabigatrana', 'Dabigatrana', '150mg 12/12h', 'VO', '150mg 2x = 5mg varfarina', 'Inibidor direto da trombina.', 'Sangramento ativo, valvopatia', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Varfarina'), 'Apixabana', 'Apixabana', '5mg 12/12h', 'VO', '5mg 2x = 5mg varfarina', 'Menos interações medicamentosas.', 'Sangramento ativo', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Varfarina'), 'Heparina', 'Heparina', '5000-10000UI 12/12h', 'SC', 'Uso parenteral', 'Para uso hospitalar ou situações especiais.', 'Trombocitopenia induzida', 'disponivel');

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_therapeutic_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_therapeutic_groups_updated_at BEFORE UPDATE ON public.therapeutic_groups FOR EACH ROW EXECUTE PROCEDURE update_therapeutic_updated_at_column();
CREATE TRIGGER update_reference_medications_updated_at BEFORE UPDATE ON public.reference_medications FOR EACH ROW EXECUTE PROCEDURE update_therapeutic_updated_at_column();
CREATE TRIGGER update_therapeutic_alternatives_updated_at BEFORE UPDATE ON public.therapeutic_alternatives FOR EACH ROW EXECUTE PROCEDURE update_therapeutic_updated_at_column();
