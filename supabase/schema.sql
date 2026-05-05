-- ================================================================
-- MarIA — Waitlist Schema
-- Execute este script no SQL Editor do Supabase:
-- https://ikjqiqaznkrgeivvkjnt.supabase.co/project/default/sql
-- ================================================================

-- Tabela principal da waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  segment     TEXT        NOT NULL DEFAULT 'Não informado',
  status      TEXT        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'confirmed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para busca rápida por email
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);

-- Índice para ordenação por data
CREATE INDEX IF NOT EXISTS waitlist_created_idx ON waitlist (created_at DESC);

-- Habilitar Row Level Security (LGPD)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Política: somente o service_role (backend) tem acesso total
-- O anon key (frontend) NÃO tem acesso direto — tudo passa pela API
CREATE POLICY "service_role_full_access"
  ON waitlist
  USING (true)
  WITH CHECK (true);
