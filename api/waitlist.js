// /api/waitlist.js — Vercel Serverless Function
// Persiste e-mails da waitlist no Vercel KV (Redis gratuito)
// Fallback: retorna lista vazia se KV não configurado

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  const hasKV = KV_URL && KV_TOKEN;

  // Helper para chamar Vercel KV via REST API
  async function kvGet(key) {
    if (!hasKV) return null;
    const r = await fetch(`${KV_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    const d = await r.json();
    return d.result ? JSON.parse(d.result) : null;
  }

  async function kvSet(key, value) {
    if (!hasKV) return;
    await fetch(`${KV_URL}/set/${key}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: JSON.stringify(value) })
    });
  }

  const KEY = 'maria_waitlist';

  try {
    // GET — listar todos
    if (req.method === 'GET') {
      const lista = await kvGet(KEY) || [];
      return res.status(200).json({ ok: true, data: lista, total: lista.length });
    }

    // POST — adicionar novo inscrito
    if (req.method === 'POST') {
      const { name, email, segment } = req.body || {};
      if (!email) return res.status(400).json({ ok: false, error: 'E-mail obrigatório.' });

      const lista = await kvGet(KEY) || [];

      // Verificar duplicata
      if (lista.find(r => r.email === email)) {
        return res.status(200).json({ ok: true, duplicate: true, message: 'E-mail já cadastrado.' });
      }

      const novo = {
        id: 's' + Date.now(),
        name: name || '',
        email,
        segment: segment || 'Não informado',
        status: 'pending',
        date: new Date().toISOString(),
      };

      lista.push(novo);
      await kvSet(KEY, lista);

      return res.status(200).json({ ok: true, data: novo, total: lista.length });
    }

    // DELETE — remover por id
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ ok: false, error: 'ID obrigatório.' });

      let lista = await kvGet(KEY) || [];
      lista = lista.filter(r => r.id !== id);
      await kvSet(KEY, lista);

      return res.status(200).json({ ok: true, total: lista.length });
    }

    return res.status(405).json({ ok: false, error: 'Método não permitido.' });

  } catch (err) {
    console.error('Erro /api/waitlist:', err);
    return res.status(500).json({ ok: false, error: 'Erro interno do servidor.' });
  }
}
