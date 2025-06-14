
-- Primeiro, vamos dropar a tabela existente e criar uma nova estrutura
DROP TABLE IF EXISTS public.multiprofessional_rounds CASCADE;
DROP TABLE IF EXISTS public.round_checklist_items CASCADE;

-- Criar nova tabela para rounds multiprofissionais focada em decisões clínicas
CREATE TABLE public.multiprofessional_rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  medical_record TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  participants TEXT NOT NULL,
  main_issues TEXT NOT NULL,
  clinical_evolution TEXT NOT NULL,
  medication_review TEXT NOT NULL,
  next_steps TEXT NOT NULL,
  observations TEXT,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.multiprofessional_rounds ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para que usuários só vejam seus próprios registros
CREATE POLICY "Users can view their own rounds" 
  ON public.multiprofessional_rounds 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rounds" 
  ON public.multiprofessional_rounds 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rounds" 
  ON public.multiprofessional_rounds 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rounds" 
  ON public.multiprofessional_rounds 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_multiprofessional_rounds_updated_at
  BEFORE UPDATE ON public.multiprofessional_rounds
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
