
-- Adicionar mais grupos terapêuticos para antibióticos
INSERT INTO public.therapeutic_groups (name, description) VALUES
('Antibióticos Quinolonas', 'Antibióticos sintéticos com amplo espectro'),
('Antibióticos Macrolídeos', 'Antibióticos com ação bacteriostática'),
('Antibióticos Aminoglicosídeos', 'Antibióticos para infecções graves'),
('Antibióticos Carbapenêmicos', 'Antibióticos de amplo espectro para infecções graves'),
('Antibióticos Glicopeptídeos', 'Antibióticos para bactérias gram-positivas resistentes'),
('Antibióticos Tetraciclinas', 'Antibióticos de amplo espectro'),
('Antibióticos Lincosaminas', 'Antibióticos para infecções por anaeróbios'),
('Antibióticos Sulfonamidas', 'Antibióticos sintéticos bacteriostáticos'),
('Antifúngicos Sistêmicos', 'Medicamentos para infecções fúngicas sistêmicas'),
('Antivirais', 'Medicamentos para infecções virais');

-- Adicionar novos medicamentos de referência (antibióticos)
INSERT INTO public.reference_medications (name, therapeutic_group_id, active_ingredient, therapeutic_class) VALUES
('Ciprofloxacino', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Quinolonas'), 'Ciprofloxacino', 'Quinolona'),
('Levofloxacino', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Quinolonas'), 'Levofloxacino', 'Quinolona'),
('Claritromicina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Macrolídeos'), 'Claritromicina', 'Macrolídeo'),
('Eritromicina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Macrolídeos'), 'Eritromicina', 'Macrolídeo'),
('Gentamicina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Aminoglicosídeos'), 'Gentamicina', 'Aminoglicosídeo'),
('Amicacina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Aminoglicosídeos'), 'Amicacina', 'Aminoglicosídeo'),
('Meropenem', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Carbapenêmicos'), 'Meropenem', 'Carbapenêmico'),
('Imipenem', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Carbapenêmicos'), 'Imipenem', 'Carbapenêmico'),
('Vancomicina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Glicopeptídeos'), 'Vancomicina', 'Glicopeptídeo'),
('Teicoplanina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Glicopeptídeos'), 'Teicoplanina', 'Glicopeptídeo'),
('Doxiciclina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Tetraciclinas'), 'Doxiciclina', 'Tetraciclina'),
('Minociclina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Tetraciclinas'), 'Minociclina', 'Tetraciclina'),
('Sulfametoxazol + Trimetoprima', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antibióticos Sulfonamidas'), 'Sulfametoxazol + Trimetoprima', 'Sulfonamida'),
('Fluconazol', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antifúngicos Sistêmicos'), 'Fluconazol', 'Antifúngico triazólico'),
('Anfotericina B', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antifúngicos Sistêmicos'), 'Anfotericina B', 'Antifúngico poliênico');

-- Alternativas para Ciprofloxacino
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Ciprofloxacino'), 'Levofloxacino', 'Levofloxacino', '500mg 12/12h', 'VO/IV', '500mg = 500mg ciprofloxacino', 'Quinolona respiratória. Melhor cobertura para pneumonia.', 'Epilepsia, miastenia gravis', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Ciprofloxacino'), 'Ofloxacino', 'Ofloxacino', '400mg 12/12h', 'VO/IV', '400mg = 500mg ciprofloxacino', 'Quinolona de 2ª geração.', 'Gravidez, lactação', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Ciprofloxacino'), 'Moxifloxacino', 'Moxifloxacino', '400mg 1x/dia', 'VO/IV', '400mg = 500mg ciprofloxacino', 'Quinolona de 4ª geração. Boa cobertura anaeróbia.', 'Hepatotoxicidade', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Ciprofloxacino'), 'Azitromicina', 'Azitromicina', '500mg 1x/dia', 'VO/IV', 'Espectro diferente', 'Macrolídeo - alternativa em alérgicos a quinolonas.', 'Arritmias cardíacas', 'disponivel');

-- Alternativas para Levofloxacino
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Levofloxacino'), 'Ciprofloxacino', 'Ciprofloxacino', '500mg 12/12h', 'VO/IV', '500mg = 500mg levofloxacino', 'Melhor cobertura para infecções urinárias e abdominais.', 'Epilepsia, tendinopatias', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Levofloxacino'), 'Ceftriaxona', 'Ceftriaxona', '1-2g 1x/dia', 'IV/IM', '1g = 500mg levofloxacino', 'Cefalosporina de 3ª geração para pneumonia.', 'Alergia a beta-lactâmicos', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Levofloxacino'), 'Claritromicina', 'Claritromicina', '500mg 12/12h', 'VO/IV', '500mg = 500mg levofloxacino', 'Macrolídeo para pneumonia atípica.', 'Hepatopatia grave', 'disponivel');

-- Alternativas para Gentamicina
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Gentamicina'), 'Amicacina', 'Amicacina', '15mg/kg/dia', 'IV/IM', '15mg/kg = 5mg/kg gentamicina', 'Menos resistência que gentamicina.', 'Insuficiência renal', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Gentamicina'), 'Tobramicina', 'Tobramicina', '5mg/kg/dia', 'IV/IM', '5mg/kg = 5mg/kg gentamicina', 'Melhor para Pseudomonas.', 'Ototoxicidade', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Gentamicina'), 'Ciprofloxacino', 'Ciprofloxacino', '400mg 12/12h', 'IV', 'Espectro similar', 'Quinolona oral alternativa.', 'Epilepsia', 'disponivel');

-- Alternativas para Meropenem
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Meropenem'), 'Imipenem', 'Imipenem', '500mg 6/6h', 'IV', '500mg = 1g meropenem', 'Carbapenêmico com inibidor de DHP-1.', 'Epilepsia, alergia a beta-lactâmicos', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Meropenem'), 'Ertapenem', 'Ertapenem', '1g 1x/dia', 'IV/IM', '1g = 1g meropenem', 'Carbapenêmico com dose única diária.', 'Sem cobertura para Pseudomonas', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Meropenem'), 'Piperacilina + Tazobactam', 'Piperacilina + Tazobactam', '4,5g 6/6h', 'IV', '4,5g = 1g meropenem', 'Penicilina de amplo espectro.', 'Alergia a penicilinas', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Meropenem'), 'Cefepime', 'Cefepime', '2g 8/8h', 'IV', '2g = 1g meropenem', 'Cefalosporina de 4ª geração.', 'Encefalopatia em IRC', 'disponivel');

-- Alternativas para Vancomicina
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Vancomicina'), 'Teicoplanina', 'Teicoplanina', '400mg 12/12h x3, depois 1x/dia', 'IV/IM', '400mg = 1g vancomicina', 'Menos nefrotóxico que vancomicina.', 'Hipersensibilidade', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Vancomicina'), 'Linezolida', 'Linezolida', '600mg 12/12h', 'VO/IV', '600mg = 1g vancomicina', 'Oxazolidinona para MRSA. Via oral disponível.', 'Trombocitopenia, neuropatia', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Vancomicina'), 'Daptomicina', 'Daptomicina', '6-10mg/kg 1x/dia', 'IV', '6mg/kg = 1g vancomicina', 'Lipopeptídeo para infecções complicadas.', 'Miopatia, pneumonia', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Vancomicina'), 'Clindamicina', 'Clindamicina', '600mg 8/8h', 'VO/IV', '600mg = 1g vancomicina', 'Para infecções de pele e partes moles.', 'Colite pseudomembranosa', 'disponivel');

-- Alternativas para Fluconazol
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Fluconazol'), 'Itraconazol', 'Itraconazol', '200mg 12/12h', 'VO', '200mg = 200mg fluconazol', 'Triazólico com melhor cobertura para Aspergillus.', 'Insuficiência cardíaca', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Fluconazol'), 'Voriconazol', 'Voriconazol', '200mg 12/12h', 'VO/IV', '200mg = 200mg fluconazol', 'Triazólico de amplo espectro.', 'Hepatotoxicidade, distúrbios visuais', 'controlado'),
((SELECT id FROM public.reference_medications WHERE name = 'Fluconazol'), 'Anfotericina B', 'Anfotericina B', '0,5-1mg/kg/dia', 'IV', '0,7mg/kg = 200mg fluconazol', 'Antifúngico de amplo espectro para casos graves.', 'Nefrotoxicidade', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Fluconazol'), 'Caspofungina', 'Caspofungina', '50mg 1x/dia', 'IV', '50mg = 200mg fluconazol', 'Equinocandina para Candida resistente.', 'Hepatotoxicidade', 'controlado');

-- Adicionar mais alternativas para medicamentos existentes
-- Alternativas adicionais para Amoxicilina
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Amoxicilina'), 'Ampicilina', 'Ampicilina', '500mg 6/6h', 'VO/IV', '500mg = 500mg amoxicilina', 'Penicilina de amplo espectro.', 'Alergia a penicilinas', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Amoxicilina'), 'Cefuroxima', 'Cefuroxima', '500mg 12/12h', 'VO', '500mg = 500mg amoxicilina', 'Cefalosporina de 2ª geração.', 'Alergia a cefalosporinas', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Amoxicilina'), 'Doxiciclina', 'Doxiciclina', '100mg 12/12h', 'VO', '100mg = 500mg amoxicilina', 'Tetraciclina para infecções atípicas.', 'Gravidez, lactação, < 8 anos', 'disponivel');

-- Adicionar medicamentos de referência para outros grupos existentes
INSERT INTO public.reference_medications (name, therapeutic_group_id, active_ingredient, therapeutic_class) VALUES
('Enalapril', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anti-hipertensivos IECA'), 'Enalapril', 'IECA'),
('Lisinopril', (SELECT id FROM public.therapeutic_groups WHERE name = 'Anti-hipertensivos IECA'), 'Lisinopril', 'IECA'),
('Glibenclamida', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antidiabéticos'), 'Glibenclamida', 'Sulfonilureia'),
('Insulina NPH', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antidiabéticos'), 'Insulina NPH', 'Insulina'),
('Lorazepam', (SELECT id FROM public.therapeutic_groups WHERE name = 'Ansiolíticos'), 'Lorazepam', 'Benzodiazepínico'),
('Sertralina', (SELECT id FROM public.therapeutic_groups WHERE name = 'Antidepressivos ISRS'), 'Sertralina', 'ISRS');

-- Alternativas para novos medicamentos adicionados
INSERT INTO public.therapeutic_alternatives (reference_medication_id, alternative_name, active_ingredient, dosage, administration_route, equivalent_dose, considerations, contraindications, availability) VALUES
((SELECT id FROM public.reference_medications WHERE name = 'Enalapril'), 'Captopril', 'Captopril', '25mg 8/8h', 'VO', '25mg = 10mg enalapril', 'IECA de ação mais curta.', 'Angioedema prévio', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Enalapril'), 'Losartana', 'Losartana', '50mg 12/12h', 'VO', '50mg = 10mg enalapril', 'BRA - alternativa em caso de tosse por IECA.', 'Angioedema prévio', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Glibenclamida'), 'Metformina', 'Metformina', '850mg 12/12h', 'VO', 'Mecanismo diferente', 'Biguanida - primeira linha em DM2.', 'Insuficiência renal', 'disponivel'),
((SELECT id FROM public.reference_medications WHERE name = 'Glibenclamida'), 'Gliclazida', 'Gliclazida', '30mg 12/12h', 'VO', '30mg = 5mg glibenclamida', 'Sulfonilureia de ação prolongada.', 'Insuficiência renal grave', 'disponivel');
