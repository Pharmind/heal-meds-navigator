
-- Habilitar RLS na tabela treatment_estimations (se ainda não estiver)
ALTER TABLE public.treatment_estimations ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow all authenticated users to access treatment estimations" ON public.treatment_estimations;
DROP POLICY IF EXISTS "Anyone can view treatment estimations" ON public.treatment_estimations;
DROP POLICY IF EXISTS "Anyone can manage treatment estimations" ON public.treatment_estimations;

-- Criar política para permitir acesso público a estimativas de tratamento (dados institucionais)
CREATE POLICY "Anyone can view treatment estimations" 
  ON public.treatment_estimations 
  FOR SELECT 
  USING (true);

-- Criar política para permitir inserção pública
CREATE POLICY "Anyone can create treatment estimations" 
  ON public.treatment_estimations 
  FOR INSERT 
  WITH CHECK (true);

-- Criar política para permitir atualização pública
CREATE POLICY "Anyone can update treatment estimations" 
  ON public.treatment_estimations 
  FOR UPDATE 
  USING (true);

-- Criar política para permitir exclusão pública
CREATE POLICY "Anyone can delete treatment estimations" 
  ON public.treatment_estimations 
  FOR DELETE 
  USING (true);
