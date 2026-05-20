// /api/chat.js — Vercel Serverless Function
// Recebe mensagens do frontend e chama a API Anthropic server-side.
// A ANTHROPIC_API_KEY nunca fica exposta no browser.
// O system prompt e max_tokens são controlados APENAS pelo servidor.
// Requer autenticação via token de sessão.

// System prompt fixo — não pode ser alterado pelo frontend
const SYSTEM_PROMPT = `Você é a MarIA, assessora de imprensa virtual do Brasil. Jornalista experiente, empática e direta. Missão: entrevistar para criar release profissional. Regras: 1 pergunta por vez. Português BR. Emojis ocasionais. Colete: o quê, por que agora, quem fala, dados, contato E SEMPRE pergunte qual a data de lançamento ou embargo do release. Após 4+ respostas, diga: "Pronto! Tenho tudo para escrever um release incrível. ✍️ Clique em **Gerar release** para ver o resultado!"`;

// Limites de segurança — impede abuso de custo
const MAX_TOKENS_CAP = 2000;
const MAX_TOKENS_DEFAULT = 500;

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

  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // ══ Autenticação obrigatória ══
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    return res.status(401).json({ error: 'Token de sessão obrigatório.' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Banco de dados não configurado.' });
  }

  const sbHeaders = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
  };

  // Valida token contra a tabela sessions
  const sessR = await fetch(
    `${SUPABASE_URL}/rest/v1/sessions?token=eq.${encodeURIComponent(token)}&select=user_email,created_at`,
    { headers: sbHeaders }
  );
  const sessions = await sessR.json();
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }

  // Validação de TTL de 24 horas
  const sessionData = sessions[0];
  const createdAt = new Date(sessionData.created_at).getTime();
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  
  if (now - createdAt > ONE_DAY_MS) {
    // Delete the expired session
    await fetch(`${SUPABASE_URL}/rest/v1/sessions?token=eq.${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: sbHeaders
    });
    return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' });
  }

  // ══ Processar mensagem ══
  const { messages, max_tokens: clientMaxTokens } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Campo "messages" obrigatório.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key não configurada no servidor.' });
  }

  // Aplica cap server-side: o cliente pode pedir até MAX_TOKENS_CAP, nunca mais
  const safeMaxTokens = Math.min(
    Math.max(1, parseInt(clientMaxTokens, 10) || MAX_TOKENS_DEFAULT),
    MAX_TOKENS_CAP
  );

  try {
    const body = {
      model: 'claude-sonnet-4-6',
      max_tokens: safeMaxTokens,
      system: SYSTEM_PROMPT,
      messages,
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro Anthropic:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Erro na API' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
