
-- Dar permissões para o usuário heal123@heal.com acessar todos os módulos da seção Padronizado
INSERT INTO public.user_module_permissions (user_id, module_name, has_access, granted_by, granted_at)
VALUES 
  ('776e3dd8-89c6-4397-b41f-25d6ad7d92ff', 'search', true, '3819b139-0e8f-4fd5-9571-a3588091336f', now()),
  ('776e3dd8-89c6-4397-b41f-25d6ad7d92ff', 'medications', true, '3819b139-0e8f-4fd5-9571-a3588091336f', now()),
  ('776e3dd8-89c6-4397-b41f-25d6ad7d92ff', 'materials', true, '3819b139-0e8f-4fd5-9571-a3588091336f', now()),
  ('776e3dd8-89c6-4397-b41f-25d6ad7d92ff', 'diets', true, '3819b139-0e8f-4fd5-9571-a3588091336f', now())
ON CONFLICT (user_id, module_name) 
DO UPDATE SET 
  has_access = true, 
  granted_by = '3819b139-0e8f-4fd5-9571-a3588091336f',
  granted_at = now(),
  updated_at = now();
