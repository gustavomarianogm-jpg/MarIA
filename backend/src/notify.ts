import { supabase } from '../supabase';

const MARIA_PRESS_EMAIL = process.env.MARIA_PRESS_EMAIL || 'mariapress.comunica@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

interface NotifyPayload {
  clientName: string;
  title: string;
  content: string;
  storyId?: string;
}

/**
 * Envia e-mail de notificação para a equipe de Curadoria via Resend.
 * Se a RESEND_API_KEY não estiver configurada, apenas loga no console (dev mode).
 */
export async function notifyCuradoria({ clientName, title, content, storyId }: NotifyPayload) {
  const panelLink = process.env.FRONTEND_URL
    ? `${process.env.FRONTEND_URL}?route=dash`
    : 'https://mariapress.com.br';

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
      <a href="${panelLink}" style="display: inline-block; background: #9D4EDD; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Abrir Painel MarIA</a>
    </div>
  `;

  if (!RESEND_API_KEY) {
    console.warn('[NOTIFY] RESEND_API_KEY não configurada. E-mail simulado:');
    console.warn(`  Para: ${MARIA_PRESS_EMAIL}`);
    console.warn(`  Assunto: [Curadoria] Nova Pauta de ${clientName}`);
    return { ok: true, mocked: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'MarIA Curadoria <onboarding@resend.dev>',
        to: MARIA_PRESS_EMAIL,
        subject: `[Curadoria] Nova Pauta de ${clientName}`,
        html: htmlEmail
      })
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[NOTIFY] Erro no Resend:', data);
      return { ok: false, error: 'Falha ao despachar e-mail.' };
    }

    return { ok: true, id: data.id };
  } catch (err) {
    console.error('[NOTIFY] Erro ao enviar notificação:', err);
    return { ok: false, error: 'Erro interno no envio.' };
  }
}

export async function notifyClientApproval(clientEmail: string, clientName: string, title: string) {
  const htmlEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #E91E8C;">Sua pauta foi aprovada! 🎉</h2>
      <p>Olá, <strong>${clientName}</strong>!</p>
      <p>Ótimas notícias! A sua pauta <strong>"${title}"</strong> foi revisada e aprovada pela nossa equipe de curadoria.</p>
      <p>Nossa Inteligência Artificial já está trabalhando para encontrar os melhores jornalistas compatíveis com a sua história.</p>
      <p>Assim que tivermos o "Match", você receberá outro e-mail com os dados de contato deles!</p>
      <br/>
      <p>Abraços,<br/>Equipe MarIA</p>
    </div>
  `;

  return sendResendEmail(clientEmail, `Boas notícias: Sua pauta "${title}" foi aprovada!`, htmlEmail);
}

export async function notifyClientRejection(clientEmail: string, clientName: string, title: string, feedback: string) {
  const htmlEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #FF6B35;">Sua pauta precisa de ajustes 📝</h2>
      <p>Olá, <strong>${clientName}</strong>.</p>
      <p>A sua pauta <strong>"${title}"</strong> foi analisada, mas no momento precisa de alguns ajustes antes de enviarmos aos jornalistas.</p>
      <h3 style="color: #9D4EDD;">Feedback da Curadoria:</h3>
      <div style="background: #FAFAF9; padding: 16px; border-radius: 8px; border: 1px solid #EEE; white-space: pre-wrap;">
        ${feedback}
      </div>
      <p>Você pode acessar o painel e criar uma nova pauta aplicando esses ajustes.</p>
      <br/>
      <p>Abraços,<br/>Equipe MarIA</p>
    </div>
  `;

  return sendResendEmail(clientEmail, `Sua pauta "${title}" precisa de ajustes`, htmlEmail);
}

export async function notifyClientMatch(clientEmail: string, clientName: string, title: string, topMatches: {name: string, score: number, outlet?: string}[]) {
  const matchesHtml = topMatches.map(m => 
    `<li style="margin-bottom: 10px;"><strong>${m.name}</strong> ${m.outlet ? `(${m.outlet})` : ''} - Compatibilidade: <span style="color: #E91E8C; font-weight: bold;">${m.score}%</span></li>`
  ).join('');

  const htmlEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #E91E8C;">Temos um Match! 🎯</h2>
      <p>Olá, <strong>${clientName}</strong>!</p>
      <p>Nossa IA encontrou jornalistas compatíveis para a sua pauta <strong>"${title}"</strong>.</p>
      <h3 style="color: #9D4EDD;">Top Jornalistas:</h3>
      <ul style="background: #FAFAF9; padding: 20px 40px; border-radius: 8px; border: 1px solid #EEE;">
        ${matchesHtml}
      </ul>
      <p>Lembre-se de personalizar sua abordagem ao entrar em contato com eles.</p>
      <br/>
      <p>Sucesso nas publicações!<br/>Equipe MarIA</p>
    </div>
  `;

  return sendResendEmail(clientEmail, `Match encontrado para "${title}"!`, htmlEmail);
}

async function sendResendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn('[NOTIFY] RESEND_API_KEY não configurada. Simulando envio de e-mail:');
    console.warn(`  Para: ${to}`);
    console.warn(`  Assunto: ${subject}`);
    return { ok: true, mocked: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'MarIA Avisos <onboarding@resend.dev>',
        to,
        subject,
        html
      })
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[NOTIFY] Erro no Resend:', data);
      return { ok: false, error: 'Falha ao despachar e-mail.' };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    console.error('[NOTIFY] Erro interno:', err);
    return { ok: false, error: 'Erro interno no envio.' };
  }
}
