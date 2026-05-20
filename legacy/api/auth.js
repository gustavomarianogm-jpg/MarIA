// /api/auth.js — Vercel Serverless Function
// Autenticação server-side — credenciais NUNCA ficam no frontend.
// Cria sessão no Supabase e retorna token UUID.
// Requer env vars: ADMIN_EMAIL, ADMIN_PASSWORD, SUPABASE_URL, SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  // CORS
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://mariapress.com.br';
  const origin = req.headers.origin || '';
  const isAllowed = origin === allowedOrigin
    || origin.startsWith('http://localhost')
    || origin.startsWith('http://127.0.0.1');
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método não permitido' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'E-mail e senha obrigatórios.' });
  }

  // Valida credenciais contra variáveis de ambiente (nunca hardcoded)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@maria.com.br';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD não configurada no servidor.');
    return res.status(500).json({ ok: false, error: 'Autenticação não configurada no servidor.' });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ ok: false, error: 'Credenciais inválidas.' });
  }

  // Credenciais válidas — criar sessão no Supabase
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

  const userData = {
    name: 'Administrador',
    email: adminEmail,
    company: 'MarIA Admin',
    sector: 'Tecnologia',
  };

  try {
    // Limpa sessões antigas do mesmo usuário (máximo 5 ativas)
    await fetch(
      `${SUPABASE_URL}/rest/v1/sessions?user_email=eq.${encodeURIComponent(adminEmail)}&order=created_at.asc&limit=100&offset=5`,
      { method: 'DELETE', headers: sbHeaders }
    );

    // Cria nova sessão
    const r = await fetch(`${SUPABASE_URL}/rest/v1/sessions`, {
      method: 'POST',
      headers: sbHeaders,
      body: JSON.stringify({
        user_email: adminEmail,
        user_data: userData,
      }),
    });

    if (!r.ok) {
      const err = await r.json();
      console.error('Erro ao criar sessão:', err);
      return res.status(500).json({ ok: false, error: 'Erro ao criar sessão.' });
    }

    const [session] = await r.json();

    return res.status(200).json({
      ok: true,
      token: session.token,
      user: userData,
    });
  } catch (err) {
    console.error('Erro /api/auth:', err);
    return res.status(500).json({ ok: false, error: 'Erro interno.' });
  }
}
