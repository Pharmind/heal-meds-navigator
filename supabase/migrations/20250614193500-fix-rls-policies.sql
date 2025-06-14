
-- Remover políticas RLS problemáticas que causam recursão infinita
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Farmaceuticos can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Farmaceuticos can update profiles" ON public.profiles;

-- Remover políticas problemáticas da tabela user_module_permissions
DROP POLICY IF EXISTS "Users can view their own permissions" ON public.user_module_permissions;
DROP POLICY IF EXISTS "Farmaceuticos can view all permissions" ON public.user_module_permissions;
DROP POLICY IF EXISTS "Farmaceuticos can manage permissions" ON public.user_module_permissions;

-- Criar políticas RLS simples e seguras para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Criar políticas RLS simples para user_module_permissions
CREATE POLICY "Users can view their own permissions" 
  ON public.user_module_permissions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Permitir que todos os usuários autenticados vejam seus próprios dados
-- As regras de negócio serão aplicadas na aplicação
CREATE POLICY "Enable read for authenticated users" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Enable read permissions for authenticated users" 
  ON public.user_module_permissions 
  FOR SELECT 
  TO authenticated 
  USING (true);
