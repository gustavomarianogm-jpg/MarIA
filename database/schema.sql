-- ========================================================
-- MarIA Press - Schema Oficial Supabase (Atualizado)
-- Modelagem de Dados Oficial v2
-- ========================================================

-- Limpa tabelas antigas caso existam (CUIDADO: APAGA DADOS)
DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.curation CASCADE;
DROP TABLE IF EXISTS public.journalists CASCADE;
DROP TABLE IF EXISTS public.stories CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.credits CASCADE;
DROP TABLE IF EXISTS public.credits_log CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. Tabela de Usuários (Users & Journalists)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "openId" text UNIQUE, -- Relacionamento com auth.users do Supabase ou outro provedor
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'journalist')),
  outlet text, -- Usado quando role = journalist
  beat text,   -- Usado quando role = journalist
  city text,   -- Usado quando role = journalist
  state text,  -- Usado quando role = journalist
  created_at timestamptz DEFAULT now()
);

-- 2. Tabela de Créditos (Credits)
CREATE TABLE IF NOT EXISTS public.credits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  balance integer DEFAULT 3,
  "totalPurchased" integer DEFAULT 0,
  "totalUsed" integer DEFAULT 0,
  "createdAt" timestamptz DEFAULT now()
);

-- 2.1 Tabela Imutável de Histórico de Créditos (Credits Log - Rule 8.2)
CREATE TABLE IF NOT EXISTS public.credits_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid REFERENCES public.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  action text NOT NULL,
  "createdAt" timestamptz DEFAULT now()
);

-- 3. Tabela de Conversas (Conversations)
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid REFERENCES public.users(id) ON DELETE CASCADE,
  title text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

-- 4. Tabela de Mensagens do Chat (Messages)
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "conversationId" uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  role text CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  "createdAt" timestamptz DEFAULT now()
);

-- 5. Tabela de Stories (Releases Gerados)
CREATE TABLE IF NOT EXISTS public.stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid REFERENCES public.users(id) ON DELETE CASCADE,
  "conversationId" uuid REFERENCES public.conversations(id) ON DELETE SET NULL,
  title text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'sent', 'rejected')),
  category text,
  "targetCity" text,
  "targetState" text,
  "createdAt" timestamptz DEFAULT now(),
  "sentAt" timestamptz
);

-- 6. Tabela de Matches (Pauta vs Jornalista)
CREATE TABLE IF NOT EXISTS public.matches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "storyId" uuid REFERENCES public.stories(id) ON DELETE CASCADE,
  "journalistId" uuid REFERENCES public.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'interested', 'rejected')),
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now(),
  UNIQUE("storyId", "journalistId")
);

-- ========================================================
-- Índices de Performance (Regra 8.2)
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_stories_userid ON public.stories("userId");
CREATE INDEX IF NOT EXISTS idx_stories_status ON public.stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_createdat ON public.stories("createdAt");
CREATE INDEX IF NOT EXISTS idx_messages_convid ON public.messages("conversationId");
CREATE INDEX IF NOT EXISTS idx_matches_storyid ON public.matches("storyId");
CREATE INDEX IF NOT EXISTS idx_matches_journalistid ON public.matches("journalistId");
CREATE INDEX IF NOT EXISTS idx_credits_log_userid ON public.credits_log("userId");

-- ========================================================
-- Funções (RPC) para Transações Atômicas (Regra 8.2)
-- ========================================================
CREATE OR REPLACE FUNCTION public.create_story_with_credit(
  p_user_id uuid,
  p_conversation_id uuid,
  p_title text,
  p_content text
) RETURNS uuid AS $$
DECLARE
  v_story_id uuid;
  v_balance integer;
BEGIN
  -- 1. Verifica saldo e bloqueia a linha (Evita Race Conditions)
  SELECT balance INTO v_balance FROM public.credits WHERE "userId" = p_user_id FOR UPDATE;
  
  IF v_balance IS NULL OR v_balance <= 0 THEN
    RAISE EXCEPTION 'Saldo insuficiente';
  END IF;

  -- 2. Debita na tabela snapshot de créditos
  UPDATE public.credits
  SET balance = balance - 1, "totalUsed" = "totalUsed" + 1
  WHERE "userId" = p_user_id;

  -- 3. Registra no ledger imutável de histórico
  INSERT INTO public.credits_log ("userId", amount, action)
  VALUES (p_user_id, -1, 'generate_release');

  -- 4. Insere a pauta gerada
  INSERT INTO public.stories ("userId", "conversationId", title, content, status)
  VALUES (p_user_id, p_conversation_id, p_title, p_content, 'review')
  RETURNING id INTO v_story_id;

  RETURN v_story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ========================================================
-- Políticas de Segurança Padrão (Row Level Security - RLS)
-- ========================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público temporário (read/write)" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público temporário (read/write)" ON public.credits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público temporário (read/write)" ON public.credits_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público temporário (read/write)" ON public.conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público temporário (read/write)" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público temporário (read/write)" ON public.stories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público temporário (read/write)" ON public.matches FOR ALL USING (true) WITH CHECK (true);
