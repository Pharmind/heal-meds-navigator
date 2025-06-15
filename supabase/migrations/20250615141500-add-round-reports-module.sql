
-- Adicionar novo módulo de relatórios de round ao enum
ALTER TYPE public.module_name ADD VALUE 'round-reports';

-- Dar permissões automaticamente para farmacêuticos existentes
INSERT INTO public.user_module_permissions (user_id, module_name, has_access, granted_by, granted_at)
SELECT 
  p.id,
  'round-reports'::public.module_name,
  true,
  p.id, -- farmacêutico concede para si mesmo
  now()
FROM public.profiles p
WHERE p.user_type = 'farmaceutico'
ON CONFLICT (user_id, module_name) 
DO UPDATE SET 
  has_access = true,
  updated_at = now();
