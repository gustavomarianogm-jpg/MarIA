// /api/notify.js — Vercel Serverless Function
// Função para enviar notificação por e-mail para a equipe de Curadoria.
// Requer autenticação via token de sessão.
// Requer env vars: RESEND_API_KEY, MARIA_PRESS_EMAIL

export default async function handler(req, res) {
  // CORS
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://mariapress.com.br';
  const origin = req.headers.origin || '';
  const isAllowed = origin === allowedOrigin
    || origin.startsWith('http://localhost')
    || origin.startsWith('http://127.0.0.1');
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método não permitido' });
  }

  // ══ Autenticação obrigatória ══
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    return res.status(401).json({ ok: false, error: 'Token de sessão obrigatório.' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ ok: false, error: 'Banco de dados não configurado.' });
  }

  const sbHeaders = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
  };

  // Valida token contra a tabela sessions
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
    if (Date.now() - createdAt > 24 * 60 * 60 * 1000) {
      await fetch(`${SUPABASE_URL}/rest/v1/sessions?token=eq.${encodeURIComponent(token)}`, { method: 'DELETE', headers: sbHeaders });
      return res.status(401).json({ ok: false, error: 'Sessão expirada. Faça login novamente.' });
    }

    // ══ Payload e Disparo de E-mail ══
    const { clientName, title, content } = req.body || {};
    
    if (!clientName || !title || !content) {
      return res.status(400).json({ ok: false, error: 'Parâmetros clientName, title e content são obrigatórios.' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const MARIA_PRESS_EMAIL = process.env.MARIA_PRESS_EMAIL || 'mariapress.comunica@gmail.com';

    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY não configurada. Simulando disparo de sucesso.');
      // Em ambiente de dev sem API Key, retornamos sucesso mockado.
      return res.status(200).json({ ok: true, mocked: true });
    }

    // Construir corpo do e-mail HTML
    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #E91E8C;">Nova Pauta para Curadoria! 🚀</h2>
        <p><strong>Cliente:</strong> ${clientName}</p>
        <p><strong>Título:</strong> ${title}</p>
        <hr style="border: none; border-top: 1px solid #EEE; margin: 20px 0;" />
        <h3 style="color: #9D4EDD;">Conteúdo do Release:</h3>
        <div style="background: #FAFAF9; padding: 16px; border-radius: 8px; border: 1px solid #EEE; white-space: pre-wrap;">
          ${content}
        </div>
        <hr style="border: none; border-top: 1px solid #EEE; margin: 20px 0;" />
        <p>Para revisar e aprovar, acesse o painel de curadoria:</p>
        <a href="https://mariapress.com.br/#dp-admin" style="display: inline-block; background: #9D4EDD; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Abrir Painel MarIA</a>
      </div>
    `;

    const resendR = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'MarIA Curadoria <onboarding@resend.dev>', // Usando e-mail default de onboarding do Resend (pode alterar se tiver domínio validado)
        to: MARIA_PRESS_EMAIL,
        subject: `[Curadoria] Nova Pauta de ${clientName}`,
        html: htmlEmail
      })
    });

    const resendData = await resendR.json();

    if (!resendR.ok) {
      console.error('Erro no Resend:', resendData);
      return res.status(500).json({ ok: false, error: 'Falha ao despachar e-mail via Resend.' });
    }

    return res.status(200).json({ ok: true, id: resendData.id });
    
  } catch (err) {
    console.error('Erro /api/notify:', err);
    return res.status(500).json({ ok: false, error: 'Erro interno no servidor.' });
  }
}
