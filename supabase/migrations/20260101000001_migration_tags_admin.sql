-- ========================================================
-- MarIA Press - Migration: Tags para Matchmaking + Seed Admin
-- Rodar no SQL Editor do Supabase APÓS o schema.sql principal
-- ========================================================

-- Adiciona coluna 'tags' na tabela stories (para matchmaking)
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Adiciona coluna 'tags' na tabela users (editorias dos jornalistas)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- ========================================================
-- Seed: Marca o e-mail da fundadora como Admin
-- ========================================================
-- Se o usuário ainda não existe, cria. Se já existe, atualiza a role.
INSERT INTO public.users (email, name, role)
VALUES ('mariapress.comunica@gmail.com', 'Maria (Admin)', 'admin')
ON CONFLICT (email)
DO UPDATE SET role = 'admin';
