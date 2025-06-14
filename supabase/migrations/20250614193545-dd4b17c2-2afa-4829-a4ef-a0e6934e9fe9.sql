
-- Remover todas as políticas RLS problemáticas
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Farmaceuticos can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Farmaceuticos can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own permissions" ON public.user_module_permissions;
DROP POLICY IF EXISTS "Farmaceuticos can view all permissions" ON public.user_module_permissions;
DROP POLICY IF EXISTS "Farmaceuticos can manage permissions" ON public.user_module_permissions;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read permissions for authenticated users" ON public.user_module_permissions;

-- Criar função segura para verificar se o usuário é farmacêutico
CREATE OR REPLACE FUNCTION public.is_farmaceutico(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND user_type = 'farmaceutico' AND is_active = true
  );
$$;

-- Políticas RLS simples e seguras para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Farmaceuticos can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.is_farmaceutico(auth.uid()));

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Farmaceuticos can update any profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (public.is_farmaceutico(auth.uid()));

-- Políticas RLS para user_module_permissions
CREATE POLICY "Users can view their own permissions" 
  ON public.user_module_permissions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Farmaceuticos can view all permissions" 
  ON public.user_module_permissions 
  FOR SELECT 
  USING (public.is_farmaceutico(auth.uid()));

CREATE POLICY "Farmaceuticos can manage all permissions" 
  ON public.user_module_permissions 
  FOR ALL 
  USING (public.is_farmaceutico(auth.uid()));
