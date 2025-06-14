
-- Corrigir a função update_updated_at_column para ter search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Corrigir a função grant_all_permissions_to_farmaceutico para ter search_path seguro
CREATE OR REPLACE FUNCTION public.grant_all_permissions_to_farmaceutico()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    IF NEW.user_type = 'farmaceutico' THEN
        INSERT INTO public.user_module_permissions (user_id, module_name, has_access)
        SELECT NEW.id, unnest(enum_range(NULL::public.module_name)), true
        ON CONFLICT (user_id, module_name) 
        DO UPDATE SET has_access = true, updated_at = now();
    END IF;
    RETURN NEW;
END;
$$;

-- Corrigir a função is_farmaceutico para ter search_path seguro
CREATE OR REPLACE FUNCTION public.is_farmaceutico(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND user_type = 'farmaceutico' AND is_active = true
  );
$$;
