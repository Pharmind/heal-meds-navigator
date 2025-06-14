
-- Limpar dados existentes para evitar duplicatas
TRUNCATE TABLE public.sequential_therapy_medications;

-- Inserir todos os medicamentos de terapia sequencial organizados por categoria
INSERT INTO public.sequential_therapy_medications (medication_name, iv_dosage, iv_posology, oral_dosage, oral_posology) VALUES

-- Antimicrobianos
('Aciclovir', '250mg', 'Conforme prescrição', '200mg', 'Aciclovir 200mg Cp ou 500mg Cp'),
('Amoxicilina + Clavulanato', '1g + 200mg', 'Conforme prescrição', '875mg + 125mg', 'Amoxicilina 875mg + Clavulanato 125mg Cp ou Susp oral'),
('Ampicilina', '1g', 'Conforme prescrição', '500mg', 'Ampicilina 500mg Cp ou Amoxicilina 500mg Cap'),
('Azitromicina', '500mg', 'Conforme prescrição', '500mg', 'Azitromicina 500mg Cp rev'),
('Cefazolina', '1g', 'Conforme prescrição', '500mg', 'Cefalexina 500mg Drg ou 250mg/5mL Susp oral'),
('Cefotaxima', '1g', 'Conforme prescrição', '500mg', 'Ciprofloxacino 500mg Cp'),
('Ceftazidima', '1g', 'Conforme prescrição', '500mg', 'Levofloxacino 500mg Cp ou Ciprofloxacino 500mg Cp'),
('Ceftriaxona', '1g', 'Conforme prescrição', 'Múltiplas opções', 'Cefuroxima, Clindamicina, Cefalexina ou Amoxicilina + Clavulanato'),
('Cefuroxima', '750mg', 'Conforme prescrição', '250mg', 'Cefuroxima 250mg Cp ver ou 250mg/5mL Susp oral'),
('Ciprofloxacino', '200mg/100mL', 'Conforme prescrição', '500mg', 'Ciprofloxacino 500mg Cp'),
('Claritromicina', '500mg', 'Conforme prescrição', '500mg', 'Claritromicina 500mg Cp ou 250mg/5mL Susp oral'),
('Clindamicina', '600mg/4mL', 'Conforme prescrição', '300mg', 'Clindamicina 300mg Cap'),
('Ganciclovir', '500mg', 'Conforme prescrição', '450mg', 'Valganciclovir 450mg Cp'),
('Fluconazol', '200mg/100mL', 'Conforme prescrição', '100mg', 'Fluconazol 100mg Cap ou 150mg Cap'),
('Levofloxacino', '500mg/100mL', 'Conforme prescrição', '500mg', 'Levofloxacino 500mg Cp'),
('Linezolida', '600mg/300mL', 'Conforme prescrição', '600mg', 'Linezolida 600mg Cp'),
('Metronidazol', '500mg/100mL', 'Conforme prescrição', '250mg', 'Metronidazol 250mg Cp'),
('Moxifloxacino', '400mg/250mL', 'Conforme prescrição', '400mg', 'Moxifloxacino 400mg Cp'),
('Piperacilina + Tazobactam', '2g + 250mg ou 4g + 500mg', 'Conforme prescrição', 'Múltiplas opções', 'Cefuroxima, Amoxicilina + Clavulanato ou Quinolonas'),
('Sulfametoxazol + Trimetoprima', '400mg/5mL + 80mg/5mL', 'Conforme prescrição', '400mg + 80mg', 'Sulfametoxazol 400mg + Trimetoprima 80mg Cp ou 800mg + 160mg Cp'),
('Voriconazol', '200mg', 'Conforme prescrição', '200mg', 'Voriconazol 200mg Cp'),

-- Inibidores de Bomba de Próton
('Esomeprazol', '40mg', 'Conforme prescrição', '20mg', 'Esomeprazol Magnésio 20mg Cp'),
('Omeprazol', '40mg', 'Conforme prescrição', '20mg', 'Omeprazol 20mg Cap ou 8mg/mL Susp oral'),
('Pantoprazol', '40mg', 'Conforme prescrição', '20mg', 'Pantoprazol 20mg Cp ou 40mg Cp'),

-- Sintomáticos
('Cetorolaco', '30mg/1mL', 'Conforme prescrição', '10mg', 'Cetorolaco 10mg SL'),
('Escopolamina + Dipirona', '20mg/mL + 2.500mg/5mL', 'Conforme prescrição', '10mg + 250mg', 'Escopolamina 10mg + Dipirona 250mg Cp'),
('Digesan', '10mg/2mL', 'Conforme prescrição', '10mg', 'Digesan 10mg Cap'),
('Dimenidrinato + Piridoxina', '3mg/mL + 5mg/mL', 'Conforme prescrição', '50mg + 10mg', 'Dimenidrinato 50mg + Vitamina B6 10mg Cp'),
('Dipirona', '1000mg/2mL', 'Conforme prescrição', '500mg', 'Dipirona 500mg Cp ou 50mg/mL Sol oral'),
('Ondansetrona', '4mg/2mL ou 8mg/4mL', 'Conforme prescrição', '4mg', 'Ondansetrona 4mg Cp'),
('Metoclopramida', '10mg/2mL', 'Conforme prescrição', '10mg', 'Metoclopramida 10mg Cp ou 4mg/mL Sol oral'),

-- Corticoesteroides
('Cetoprofeno', '100mg', 'Conforme prescrição', '50mg', 'Cetoprofeno 50mg Cap'),
('Dexametasona', '2mg/1mL ou 10mg/2,5mL', 'Conforme prescrição', '0,5mg - 4mg', 'Dexametasona 0,5mg, 0,75mg ou 4mg Cp'),
('Hidrocortisona', '100mg', 'Conforme prescrição', '5mg', 'Hidrocortisona Acetato 5mg Cap'),
('Metilprednisolona', '125mg', 'Conforme prescrição', '5mg - 20mg', 'Prednisolona 3mg/mL Sol oral ou Prednisona 5mg/20mg Cp'),

-- Opióides
('Dimorf (Morfina)', '1mg/mL', 'Conforme prescrição', '10mg', 'Morfina 10mg Cp'),
('Metadona', '10mg/mL', 'Conforme prescrição', '5mg - 10mg', 'Metadona 5mg Cp ou 10mg Cp'),
('Tramadol', '100mg/2mL', 'Conforme prescrição', '50mg', 'Tramadol 50mg Cap'),

-- Anticonvulsivantes
('Fenitoína', '250mg/5mL', 'Conforme prescrição', '100mg', 'Fenitoína 100mg Cp'),
('Fenobarbital', '200mg/2mL', 'Conforme prescrição', '50mg', 'Fenobarbital 50mg Cp ou 40mg/mL Sol oral'),
('Lacosamida', '10mg/mL', 'Conforme prescrição', '50mg', 'Lacosamida 50mg Cp'),

-- Outros
('Amiodarona', '150mg/3mL', 'Conforme prescrição', '200mg', 'Amiodarona 200mg Cp ou 200mg/mL Susp oral'),
('Ácido Tranexâmico', '250mg/5mL', 'Conforme prescrição', '250mg', 'Ácido Tranexâmico 250mg Cp'),
('Ciclosporina', '50mg/1mL', 'Conforme prescrição', '25mg - 100mg', 'Ciclosporina 25mg, 50mg ou 100mg Cap'),
('Furosemida', '20mg/2mL', 'Conforme prescrição', '40mg', 'Furosemida 40mg Cp'),

-- Reposição de Eletrólitos
('Cloreto de Sódio', 'IV conforme prescrição', 'Conforme prescrição', '20%', 'Cloreto de Sódio 20% Sol oral'),
('Cloreto de Potássio', 'IV conforme prescrição', 'Conforme prescrição', '600mg', 'Cloreto de Potássio 600mg Cap ou 6% Sol oral'),
('Fosfato', 'IV conforme prescrição', 'Conforme prescrição', '15mg/mL', 'Solução fosfatada 15mg/mL Sol oral'),
('Sulfato de Magnésio', 'IV conforme prescrição', 'Conforme prescrição', '722,2mg', 'Magnen B6 722,2mg Cp ou Sulfato de Magnésio 10% Sol oral'),
('Gluconato de Cálcio', 'IV conforme prescrição', 'Conforme prescrição', '500mg', 'Oscal 500mg Cp');
