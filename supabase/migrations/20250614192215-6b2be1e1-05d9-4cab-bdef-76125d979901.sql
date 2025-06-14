
-- Criar enum para tipos de usuário
CREATE TYPE public.user_type AS ENUM ('farmaceutico', 'usuario');

-- Criar enum para módulos do sistema
CREATE TYPE public.module_name AS ENUM (
  'search',
  'medications', 
  'materials',
  'diets',
  'intoxication',
  'high-alert',
  'elderly',
  'sequential-therapy',
  'pharmacovigilance',
  'cft',
  'protocols',
  'pictogram',
  'discharge-guidelines',
  'drug-interactions',
  'treatment-estimation'
);

-- Atualizar tabela profiles para incluir tipo de usuário
ALTER TABLE public.profiles ADD COLUMN user_type public.user_type NOT NULL DEFAULT 'usuario';
ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Criar tabela de permissões de módulos por usuário
CREATE TABLE public.user_module_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  module_name public.module_name NOT NULL,
  has_access BOOLEAN NOT NULL DEFAULT false,
  granted_by UUID REFERENCES public.profiles(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_name)
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Farmaceuticos can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.user_type = 'farmaceutico'
    )
  );

CREATE POLICY "Farmaceuticos can update profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.user_type = 'farmaceutico'
    )
  );

-- Políticas RLS para user_module_permissions
CREATE POLICY "Users can view their own permissions" 
  ON public.user_module_permissions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Farmaceuticos can view all permissions" 
  ON public.user_module_permissions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.user_type = 'farmaceutico'
    )
  );

CREATE POLICY "Farmaceuticos can manage permissions" 
  ON public.user_module_permissions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.user_type = 'farmaceutico'
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_module_permissions_updated_at 
  BEFORE UPDATE ON public.user_module_permissions 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Função para dar todas as permissões aos farmacêuticos automaticamente
CREATE OR REPLACE FUNCTION grant_all_permissions_to_farmaceutico()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_type = 'farmaceutico' THEN
        INSERT INTO public.user_module_permissions (user_id, module_name, has_access)
        SELECT NEW.id, unnest(enum_range(NULL::public.module_name)), true
        ON CONFLICT (user_id, module_name) 
        DO UPDATE SET has_access = true, updated_at = now();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER auto_grant_farmaceutico_permissions
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW 
  WHEN (NEW.user_type = 'farmaceutico')
  EXECUTE PROCEDURE grant_all_permissions_to_farmaceutico();

-- Atualizar função handle_new_user para criar profile automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    'usuario'::public.user_type
  );
  RETURN NEW;
END;
$$;
