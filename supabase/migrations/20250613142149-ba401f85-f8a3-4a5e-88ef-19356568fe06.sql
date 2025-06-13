
-- Create table for custom pathologies
CREATE TABLE public.pathologies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  basic_info TEXT NOT NULL,
  curiosity TEXT NOT NULL,
  therapeutic TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Heart',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.pathologies ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view pathologies)
CREATE POLICY "Anyone can view pathologies" 
  ON public.pathologies 
  FOR SELECT 
  USING (true);

-- Create policy for admin users to insert/update/delete pathologies
CREATE POLICY "Admins can manage pathologies" 
  ON public.pathologies 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Insert default pathologies
INSERT INTO public.pathologies (name, description, basic_info, curiosity, therapeutic, icon_name) VALUES
('Hipertensão Arterial', 'Pressão arterial elevada de forma persistente', 'A hipertensão arterial é uma condição crônica caracterizada pela elevação persistente da pressão arterial acima de 140/90 mmHg. É conhecida como "assassina silenciosa" pois geralmente não apresenta sintomas nas fases iniciais.', '💡 Curiosidade: O coração de uma pessoa hipertensa trabalha até 2 vezes mais para bombear sangue, sendo equivalente a carregar uma mochila de 10kg durante todo o dia!', 'O controle adequado da pressão arterial através dos medicamentos prescritos reduz em até 40% o risco de AVC e 25% o risco de infarto. Nunca interrompa os medicamentos sem orientação médica, mesmo que se sinta bem.', 'Heart'),

('Diabetes Mellitus', 'Elevação dos níveis de glicose no sangue', 'O diabetes é uma doença crônica que afeta a forma como o corpo processa a glicose (açúcar) no sangue. Pode ser tipo 1 (falta de insulina) ou tipo 2 (resistência à insulina).', '💡 Curiosidade: Uma pessoa com diabetes pode ter uma vida completamente normal! Muitos atletas olímpicos são diabéticos e mantêm excelente controle da doença.', 'O uso correto dos medicamentos para diabetes previne complicações graves como cegueira, problemas renais e amputações. O controle rigoroso da glicemia pode adicionar anos de vida saudável.', 'Activity'),

('Problemas Cardíacos', 'Doenças que afetam o coração e circulação', 'As doenças cardíacas incluem condições como insuficiência cardíaca, arritmias e doença coronariana. Afetam a capacidade do coração de bombear sangue eficientemente.', '💡 Curiosidade: O coração bate aproximadamente 100.000 vezes por dia! Cuidar bem dele significa garantir que continue trabalhando perfeitamente por muitos anos.', 'Os medicamentos cardíacos ajudam o coração a trabalhar de forma mais eficiente e previnem eventos graves como infartos. A adesão ao tratamento pode melhorar significativamente a qualidade de vida.', 'Zap'),

('Problemas Respiratórios', 'Condições que afetam pulmões e vias respiratórias', 'Incluem asma, DPOC (doença pulmonar obstrutiva crônica) e outras condições que dificultam a respiração e reduzem a capacidade pulmonar.', '💡 Curiosidade: Em repouso, respiramos cerca de 20.000 vezes por dia! Cuidar dos pulmões garante que cada respiração seja eficiente.', 'Os medicamentos respiratórios ajudam a manter as vias aéreas abertas e reduzem a inflamação. O uso correto previne crises graves e hospitalizações.', 'Activity'),

('Problemas da Tireoide', 'Alterações no funcionamento da glândula tireoide', 'A tireoide regula o metabolismo do corpo. Pode funcionar demais (hipertireoidismo) ou de menos (hipotireoidismo), afetando energia, peso e humor.', '💡 Curiosidade: A tireoide, apesar de pequena, controla o metabolismo de todas as células do corpo! É como o "termostato" do organismo.', 'Os medicamentos para tireoide normalizam o metabolismo e previnem complicações cardíacas e ósseas. É importante tomar sempre no mesmo horário e em jejum.', 'Zap'),

('Saúde Mental', 'Condições que afetam humor, pensamento e comportamento', 'Incluem depressão, ansiedade e outras condições que afetam o bem-estar emocional e mental. São tão importantes quanto as doenças físicas.', '💡 Curiosidade: O cérebro consome 20% de toda a energia do corpo! Cuidar da saúde mental é cuidar do órgão mais importante do organismo.', 'Os medicamentos psiquiátricos ajudam a reequilibrar substâncias químicas do cérebro. A continuidade do tratamento é fundamental para manter a estabilidade emocional.', 'Heart');
