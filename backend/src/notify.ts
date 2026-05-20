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
