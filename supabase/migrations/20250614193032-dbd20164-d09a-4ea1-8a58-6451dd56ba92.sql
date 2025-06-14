
-- Inserir usuário padrão (heal123)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'heal123@heal.com',
  crypt('heal123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Usuário HEAL"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT DO NOTHING;

-- Inserir usuário farmacêutico (fa123)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'fa123@heal.com',
  crypt('farma123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Farmacêutico HEAL"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT DO NOTHING;

-- Criar profile para o usuário padrão
INSERT INTO public.profiles (id, email, full_name, user_type, is_active)
SELECT 
  u.id,
  u.email,
  'Usuário HEAL',
  'usuario'::public.user_type,
  true
FROM auth.users u 
WHERE u.email = 'heal123@heal.com'
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  user_type = EXCLUDED.user_type,
  is_active = EXCLUDED.is_active;

-- Criar profile para o farmacêutico
INSERT INTO public.profiles (id, email, full_name, user_type, is_active)
SELECT 
  u.id,
  u.email,
  'Farmacêutico HEAL',
  'farmaceutico'::public.user_type,
  true
FROM auth.users u 
WHERE u.email = 'fa123@heal.com'
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  user_type = EXCLUDED.user_type,
  is_active = EXCLUDED.is_active;
