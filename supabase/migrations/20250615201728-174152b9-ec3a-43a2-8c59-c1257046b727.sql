
-- Adicionar mais grupos terapêuticos
INSERT INTO public.therapeutic_groups (name, description) VALUES
('Antifúngicos Azólicos Avançados', 'Antifúngicos de nova geração para infecções resistentes'),
('Antivirais Sistêmicos', 'Medicamentos para tratamento de infecções virais'),
('Antivirais Herpéticos', 'Medicamentos específicos para herpes vírus'),
('Anti-hipertensivos BRA', 'Bloqueadores dos receptores de angiotensina'),
('Anti-hipertensivos Betabloqueadores', 'Bloqueadores dos receptores beta-adrenérgicos'),
('Anti-hipertensivos Diuréticos', 'Medicamentos diuréticos para hipertensão'),
('Antiarrítmicos', 'Medicamentos para controle de arritmias cardíacas'),
('Anticoagulantes Orais Diretos', 'Nova geração de anticoagulantes'),
('Broncodilatadores de Longa Duração', 'Medicamentos para DPOC e asma grave'),
('Corticoides Sistêmicos', 'Anti-inflamatórios hormonais'),
('Antieméticos', 'Medicamentos para náuseas e vômitos'),
('Protetores Gástricos H2', 'Antagonistas dos receptores H2'),
('Antipsicóticos Atípicos', 'Neurolépticos de segunda geração'),
('Anticonvulsivantes', 'Medicamentos para epilepsia e convulsões'),
('Relaxantes Musculares', 'Medicamentos para espasticidade muscular');

-- Adicionar novos medicamentos de referência
INSERT INTO public.reference_medications (name, therapeutic_group_id, active_ingredient, therapeutic_class) VALUES
-- Antifúngicos avançados
('Posaconazol', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antifúngicos Azólicos Avançados'), 'Posaconazol', 'Triazólico de amplo espectro'),
('Isavuconazol', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antifúngicos Azólicos Avançados'), 'Isavuconazol', 'Triazólico'),
('Micafungina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antifúngicos Sistêmicos'), 'Micafungina', 'Equinocandina'),

-- Antivirais
('Aciclovir', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antivirais Herpéticos'), 'Aciclovir', 'Antiviral nucleosídeo'),
('Valaciclovir', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antivirais Herpéticos'), 'Valaciclovir', 'Pró-droga do aciclovir'),
('Oseltamivir', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antivirais Sistêmicos'), 'Oseltamivir', 'Inibidor da neuraminidase'),
('Remdesivir', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antivirais Sistêmicos'), 'Remdesivir', 'Antiviral de amplo espectro'),

-- Cardiovasculares
('Losartana', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anti-hipertensivos BRA'), 'Losartana', 'BRA'),
('Valsartana', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anti-hipertensivos BRA'), 'Valsartana', 'BRA'),
('Propranolol', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anti-hipertensivos Betabloqueadores'), 'Propranolol', 'Betabloqueador não seletivo'),
('Metoprolol', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anti-hipertensivos Betabloqueadores'), 'Metoprolol', 'Betabloqueador seletivo'),
('Furosemida', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anti-hipertensivos Diuréticos'), 'Furosemida', 'Diurético de alça'),
('Hidroclorotiazida', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anti-hipertensivos Diuréticos'), 'Hidroclorotiazida', 'Diurético tiazídico'),
('Amiodarona', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antiarrítmicos'), 'Amiodarona', 'Antiarrítmico classe III'),

-- Anticoagulantes modernos
('Rivaroxabana', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anticoagulantes Orais Diretos'), 'Rivaroxabana', 'Inibidor do fator Xa'),
('Apixabana', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anticoagulantes Orais Diretos'), 'Apixabana', 'Inibidor do fator Xa'),
('Dabigatrana', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anticoagulantes Orais Diretos'), 'Dabigatrana', 'Inibidor direto da trombina'),

-- Respiratórios
('Formoterol', (SELECT id FROM public.therapeutic_groups WHERE name = 'Broncodilatadores de Longa Duração'), 'Formoterol', 'Beta-2 agonista de longa duração'),
('Tiotrópio', (SELECT id FROM public.therapeutic_groups WHERE name = 'Broncodilatadores de Longa Duração'), 'Tiotrópio', 'Anticolinérgico de longa duração'),

-- Corticoides
('Prednisolona', (SELECT id FROM public.therapeutic_groups WHERE name = 'Corticoides Sistêmicos'), 'Prednisolona', 'Corticoide sistêmico'),
('Dexametasona', (SELECT id FROM public.therapeutic_groups WHERE name = 'Corticoides Sistêmicos'), 'Dexametasona', 'Corticoide de alta potência'),

-- Gastroenterológicos
('Ondansetrona', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antieméticos'), 'Ondansetrona', 'Antagonista 5-HT3'),
('Metoclopramida', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antieméticos'), 'Metoclopramida', 'Procinético'),
('Ranitidina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Protetores Gástricos H2'), 'Ranitidina', 'Antagonista H2'),
('Famotidina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Protetores Gástricos H2'), 'Famotidina', 'Antagonista H2'),

-- Neuropsiquiátricos
('Quetiapina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antipsicóticos Atípicos'), 'Quetiapina', 'Antipsicótico atípico'),
('Risperidona', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antipsicóticos Atípicos'), 'Risperidona', 'Antipsicótico atípico'),
('Fenitoína', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anticonvulsivantes'), 'Fenitoína', 'Anticonvulsivante'),
('Carbamazepina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anticonvulsivantes'), 'Carbamazepina', 'Anticonvulsivante'),
('Baclofeno', (SELECT id FROM public.therapeutic_groups WHERE name = 'Relaxantes Musculares'), 'Baclofeno', 'Relaxante muscular central');

-- Alternativas para Posaconazol
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Posaconazol'), 'Voriconazol', 'Voriconazol', '200mg 12/12h', 'VO/IV', '200mg = 300mg posaconazol', 'Triazólico com cobertura para Aspergillus.', 'Distúrbios visuais, hepatotoxicidade', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Posaconazol'), 'Isavuconazol', 'Isavuconazol', '200mg 8/8h x6, depois 200mg/dia', 'VO/IV', '200mg = 300mg posaconazol', 'Triazólico com perfil de segurança melhor.', 'Hipersensibilidade', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Posaconazol'), 'Anfotericina B', 'Anfotericina B', '1mg/kg/dia', 'IV', '1mg/kg = 300mg posaconazol', 'Padrão-ouro para infecções fúngicas graves.', 'Nefrotoxicidade', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Posaconazol'), 'Caspofungina', 'Caspofungina', '70mg ataque, depois 50mg/dia', 'IV', '50mg = 300mg posaconazol', 'Equinocandina para Candida e Aspergillus.', 'Hepatotoxicidade', 'controlado');

-- Alternativas para Aciclovir
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Aciclovir'), 'Valaciclovir', 'Valaciclovir', '1g 8/8h', 'VO', '1g = 800mg aciclovir', 'Melhor biodisponibilidade oral.', 'Insuficiência renal grave', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Aciclovir'), 'Fanciclovir', 'Fanciclovir', '500mg 8/8h', 'VO', '500mg = 800mg aciclovir', 'Pró-droga do penciclovir.', 'Hipersensibilidade', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Aciclovir'), 'Ganciclovir', 'Ganciclovir', '5mg/kg 12/12h', 'IV', '5mg/kg = 10mg/kg aciclovir', 'Para CMV e casos graves de HSV.', 'Mielossupressão', 'controlado');

-- Alternativas para Losartana
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Losartana'), 'Valsartana', 'Valsartana', '80mg 12/12h', 'VO', '80mg = 50mg losartana', 'BRA com meia-vida mais longa.', 'Gravidez, angioedema', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Losartana'), 'Telmisartana', 'Telmisartana', '40mg 1x/dia', 'VO', '40mg = 50mg losartana', 'BRA com ação de 24 horas.', 'Hepatopatia grave', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Losartana'), 'Enalapril', 'Enalapril', '10mg 12/12h', 'VO', '10mg = 50mg losartana', 'IECA - alternativa em caso de custo.', 'Tosse seca, angioedema', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Losartana'), 'Amlodipina', 'Amlodipina', '5mg 1x/dia', 'VO', '5mg = 50mg losartana', 'Bloqueador de canal de cálcio.', 'Edema de MMII', 'disponivel');

-- Alternativas para Propranolol
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Propranolol'), 'Metoprolol', 'Metoprolol', '50mg 12/12h', 'VO', '50mg = 40mg propranolol', 'Betabloqueador cardioseletivo.', 'Bloqueio AV avançado', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Propranolol'), 'Atenolol', 'Atenolol', '50mg 1x/dia', 'VO', '50mg = 40mg propranolol', 'Beta-1 seletivo, dose única diária.', 'Asma brônquica', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Propranolol'), 'Carvedilol', 'Carvedilol', '6,25mg 12/12h', 'VO', '6,25mg = 40mg propranolol', 'Alfa e betabloqueador para ICC.', 'Descompensação cardíaca aguda', 'disponivel');

-- Alternativas para Furosemida
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Furosemida'), 'Hidroclorotiazida', 'Hidroclorotiazida', '25mg 1x/dia', 'VO', '25mg = 40mg furosemida', 'Diurético tiazídico para HAS leve.', 'Anúria, hiponatremia grave', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Furosemida'), 'Espironolactona', 'Espironolactona', '25mg 1x/dia', 'VO', '25mg = 40mg furosemida', 'Diurético poupador de potássio.', 'Hipercalemia, insuficiência renal', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Furosemida'), 'Bumetanida', 'Bumetanida', '1mg 1x/dia', 'VO/IV', '1mg = 40mg furosemida', 'Diurético de alça mais potente.', 'Desidratação grave', 'disponivel');

-- Alternativas para Amiodarona
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Amiodarona'), 'Sotalol', 'Sotalol', '80mg 12/12h', 'VO', '80mg = 200mg amiodarona', 'Antiarrítmico classe III com ação beta.', 'QT longo, insuficiência renal', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Amiodarona'), 'Propafenona', 'Propafenona', '150mg 8/8h', 'VO', '150mg = 200mg amiodarona', 'Antiarrítmico classe IC.', 'Disfunção ventricular grave', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Amiodarona'), 'Adenosina', 'Adenosina', '6-12mg IV rápido', 'IV', '6mg = dose aguda', 'Para TSV paroxística.', 'Asma grave, bloqueio AV', 'disponivel');

-- Alternativas para Ondansetrona
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Ondansetrona'), 'Metoclopramida', 'Metoclopramida', '10mg 8/8h', 'VO/IV', '10mg = 4mg ondansetrona', 'Procinético com ação antiemética.', 'Obstrução intestinal', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Ondansetrona'), 'Bromoprida', 'Bromoprida', '10mg 8/8h', 'VO/IV', '10mg = 4mg ondansetrona', 'Derivado da metoclopramida.', 'Epilepsia não controlada', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Ondansetrona'), 'Dexametasona', 'Dexametasona', '4mg 1x/dia', 'VO/IV', '4mg = 4mg ondansetrona', 'Corticoide com ação antiemética.', 'Infecções sistêmicas', 'disponivel');

-- Alternativas para Quetiapina
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Quetiapina'), 'Risperidona', 'Risperidona', '2mg 12/12h', 'VO', '2mg = 100mg quetiapina', 'Antipsicótico com menor sedação.', 'Demência com fatores de risco CV', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Quetiapina'), 'Olanzapina', 'Olanzapina', '10mg 1x/dia', 'VO', '10mg = 100mg quetiapina', 'Antipsicótico com boa eficácia.', 'Diabetes descompensado', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Quetiapina'), 'Haloperidol', 'Haloperidol', '5mg 1x/dia', 'VO/IV', '5mg = 100mg quetiapina', 'Antipsicótico típico de baixo custo.', 'Parkinson, demência', 'disponivel');

-- Alternativas para Fenitoína
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Fenitoína'), 'Carbamazepina', 'Carbamazepina', '200mg 12/12h', 'VO', '200mg = 300mg fenitoína', 'Anticonvulsivante com menos efeitos cosméticos.', 'Bloqueio AV, porfiria', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Fenitoína'), 'Ácido Valproico', 'Ácido Valproico', '500mg 12/12h', 'VO/IV', '500mg = 300mg fenitoína', 'Anticonvulsivante de amplo espectro.', 'Hepatopatia, gravidez', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Fenitoína'), 'Levetiracetam', 'Levetiracetam', '500mg 12/12h', 'VO/IV', '500mg = 300mg fenitoína', 'Anticonvulsivante moderno com poucos efeitos.', 'Psicose, depressão grave', 'controlado');
