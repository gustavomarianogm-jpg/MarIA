// /api/waitlist.js — Vercel Serverless Function
// Persiste e-mails da waitlist no Supabase (PostgreSQL)
// Requer variáveis de ambiente: SUPABASE_URL, SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  // ── CORS ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── Configuração Supabase ──
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_KEY.');
    return res.status(500).json({ ok: false, error: 'Banco de dados não configurado no servidor.' });
  }

  // ── Cabeçalhos padrão para chamadas ao Supabase ──
  const sbHeaders = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer': 'return=representation',
  };

  const TABLE_URL = `${SUPABASE_URL}/rest/v1/waitlist`;

  try {
    // ════════════════════════════════
    //  GET — Listar todos os inscritos
    // ════════════════════════════════
    if (req.method === 'GET') {
      const r = await fetch(`${TABLE_URL}?order=created_at.desc&select=*`, {
        headers: sbHeaders,
      });

      if (!r.ok) {
        const err = await r.json();
        console.error('Supabase GET error:', err);
        return res.status(r.status).json({ ok: false, error: err.message || 'Erro ao buscar dados.' });
      }

      const data = await r.json();
      return res.status(200).json({ ok: true, data, total: data.length });
    }

    // ════════════════════════════════
    //  POST — Adicionar novo inscrito
    // ════════════════════════════════
    if (req.method === 'POST') {
      const { name, email, segment } = req.body || {};

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ ok: false, error: 'E-mail obrigatório.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanName  = (name || '').trim();
      const cleanSeg   = (segment || 'Não informado').trim();

      // Verificar duplicata antes de inserir
      const checkR = await fetch(
        `${TABLE_URL}?email=eq.${encodeURIComponent(cleanEmail)}&select=id`,
        { headers: sbHeaders }
      );
      const existing = await checkR.json();
      if (Array.isArray(existing) && existing.length > 0) {
        return res.status(200).json({ ok: true, duplicate: true, message: 'E-mail já cadastrado.' });
      }

      // Inserir novo registro
      const insertR = await fetch(TABLE_URL, {
        method: 'POST',
        headers: { ...sbHeaders, 'Prefer': 'return=representation' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          segment: cleanSeg,
          status: 'confirmed',
        }),
      });

      if (!insertR.ok) {
        const err = await insertR.json();
        // Código 23505 = unique_violation (duplicata a nível de DB)
        if (err.code === '23505') {
          return res.status(200).json({ ok: true, duplicate: true, message: 'E-mail já cadastrado.' });
        }
        console.error('Supabase INSERT error:', err);
        return res.status(insertR.status).json({ ok: false, error: err.message || 'Erro ao cadastrar.' });
      }

      const [novo] = await insertR.json();

      // Buscar total atualizado
      const totalR = await fetch(`${TABLE_URL}?select=id`, { headers: { ...sbHeaders, 'Prefer': '' } });
      const todos  = await totalR.json();

      return res.status(200).json({ ok: true, data: novo, total: Array.isArray(todos) ? todos.length : 0 });
    }

    // ════════════════════════════════
    //  DELETE — Remover por id
    // ════════════════════════════════
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ ok: false, error: 'ID obrigatório.' });

      const r = await fetch(`${TABLE_URL}?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: sbHeaders,
      });

      if (!r.ok) {
        const err = await r.json();
        console.error('Supabase DELETE error:', err);
        return res.status(r.status).json({ ok: false, error: err.message || 'Erro ao remover.' });
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ ok: false, error: 'Método não permitido.' });

  } catch (err) {
    console.error('Erro /api/waitlist:', err);
    return res.status(500).json({ ok: false, error: 'Erro interno do servidor.' });
  }
}
