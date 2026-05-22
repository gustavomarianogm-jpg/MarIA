-- ================================================================
-- MarIA — Schema Completo
-- Execute este script no SQL Editor do Supabase
-- ================================================================

-- ═══════════════════════════════════════
-- 1. WAITLIST
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS waitlist (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  segment     TEXT        NOT NULL DEFAULT 'Não informado',
  status      TEXT        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'confirmed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);
CREATE INDEX IF NOT EXISTS waitlist_created_idx ON waitlist (created_at DESC);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "service_role_full_access"
  ON waitlist
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════
-- 2. SESSIONS (autenticação)
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS sessions (
  token       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email  TEXT        NOT NULL,
  user_data   JSONB       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_token_idx ON sessions (token);
CREATE INDEX IF NOT EXISTS sessions_email_idx ON sessions (user_email);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "service_role_sessions"
  ON sessions
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════
-- 3. APP_STATE (persistência em nuvem)
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS app_state (
  user_email  TEXT        PRIMARY KEY,
  state       JSONB       NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "service_role_app_state"
  ON app_state
  USING (true)
  WITH CHECK (true);
