// /api/state.js — Vercel Serverless Function
// Persistência de estado da aplicação em nuvem (Supabase).
// GET: retorna estado salvo para o usuário da sessão.
// PUT: salva estado para o usuário da sessão.
// Requer token de sessão no header Authorization.

export default async function handler(req, res) {
  // CORS
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://mariapress.com.br';
  const origin = req.headers.origin || '';
  const isAllowed = origin === allowedOrigin
    || origin.startsWith('http://localhost')
    || origin.startsWith('http://127.0.0.1');
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ ok: false, error: 'Banco de dados não configurado.' });
  }

  const sbHeaders = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer': 'return=representation',
  };

  // Extrair e validar token de sessão
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ ok: false, error: 'Token de sessão obrigatório.' });
  }

  // Verificar sessão no Supabase
  try {
    const sessR = await fetch(
      `${SUPABASE_URL}/rest/v1/sessions?token=eq.${encodeURIComponent(token)}&select=user_email,created_at`,
      { headers: sbHeaders }
    );
    const sessions = await sessR.json();

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return res.status(401).json({ ok: false, error: 'Sessão inválida ou expirada.' });
    }

    // Validação de TTL de 24 horas
    const sessionData = sessions[0];
    const createdAt = new Date(sessionData.created_at).getTime();
    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    
    if (now - createdAt > ONE_DAY_MS) {
      // Deleta a sessão expirada do banco
      await fetch(`${SUPABASE_URL}/rest/v1/sessions?token=eq.${encodeURIComponent(token)}`, {
        method: 'DELETE',
        headers: sbHeaders
      });
      return res.status(401).json({ ok: false, error: 'Sessão expirada. Faça login novamente.' });
    }

    const userEmail = sessions[0].user_email;
    const STATE_URL = `${SUPABASE_URL}/rest/v1/app_state`;

    // ════════════════════════════════
    //  GET — Recuperar estado
    // ════════════════════════════════
    if (req.method === 'GET') {
      const r = await fetch(
        `${STATE_URL}?user_email=eq.${encodeURIComponent(userEmail)}&select=state,updated_at`,
        { headers: sbHeaders }
      );
      const rows = await r.json();

      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(200).json({ ok: true, state: null });
      }

      return res.status(200).json({ ok: true, state: rows[0].state, updated_at: rows[0].updated_at });
    }

    // ════════════════════════════════
    //  PUT — Salvar estado
    // ════════════════════════════════
    if (req.method === 'PUT') {
      const { state } = req.body || {};

      if (!state || typeof state !== 'object') {
        return res.status(400).json({ ok: false, error: 'Campo "state" obrigatório (objeto JSON).' });
      }

      // Upsert: insert or update
      const payload = {
        user_email: userEmail,
        state,
        updated_at: new Date().toISOString(),
      };

      // Tenta atualizar primeiro
      const updateR = await fetch(
        `${STATE_URL}?user_email=eq.${encodeURIComponent(userEmail)}`,
        {
          method: 'PATCH',
          headers: { ...sbHeaders, 'Prefer': 'return=representation' },
          body: JSON.stringify({ state, updated_at: payload.updated_at }),
        }
      );
      const updated = await updateR.json();

      if (Array.isArray(updated) && updated.length > 0) {
        return res.status(200).json({ ok: true });
      }

      // Não existia — inserir
      const insertR = await fetch(STATE_URL, {
        method: 'POST',
        headers: sbHeaders,
        body: JSON.stringify(payload),
      });

      if (!insertR.ok) {
        const err = await insertR.json();
        console.error('Erro ao salvar estado:', err);
        return res.status(500).json({ ok: false, error: 'Erro ao salvar estado.' });
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ ok: false, error: 'Método não permitido.' });
  } catch (err) {
    console.error('Erro /api/state:', err);
    return res.status(500).json({ ok: false, error: 'Erro interno.' });
  }
}
