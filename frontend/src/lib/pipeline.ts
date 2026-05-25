import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage } from '../types/chatMessage';

// Import prompts (each file exports a constant string named PROMPT_*)
import { PROMPT_ENTREVISTADORA } from '../prompts/PROMPT_ENTREVISTADORA';
import { PROMPT_EXTRATORA } from '../prompts/PROMPT_EXTRATORA';
import { PROMPT_REDATORA } from '../prompts/PROMPT_REDATORA';

// Initialise Anthropic client – expects VITE_ANTHROPIC_API_KEY in env vars
const anthropic = new Anthropic({
  apiKey:
    import.meta.env.VITE_ANTHROPIC_API_KEY || 'missing_key_para_nao_crashar',
  dangerouslyAllowBrowser: true,
});

/**
 * Helper to format the chat history for the model.
 * The model expects an array of messages with `role` and `content`.
 */
function formatHistory(history: ChatMessage[]) {
  return history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

/**
 * Entrevistadora – coleta informações do usuário.
 * Returns `{ resposta: string, prontoParaRelease: boolean }`.
 */
export async function chamarEntrevistadora(historico: ChatMessage[]) {
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022', // modelo de conversa (pode ser ajustado)
    max_tokens: 1500,
    temperature: 0.7,
    system: PROMPT_ENTREVISTADORA,
    messages: formatHistory(historico),
  });

  const texto =
    response.content[0].type === 'text' ? response.content[0].text : '';
  const prontoParaRelease = texto.includes(
    '[SINAL_INTERNO: PRONTO_PARA_RELEASE]'
  );
  const respostaLimpa = texto
    .replace('[SINAL_INTERNO: PRONTO_PARA_RELEASE]', '')
    .trim();
  return { resposta: respostaLimpa, prontoParaRelease };
}

/**
 * Extratora – transforma a conversa em JSON estruturado.
 */
export async function chamarExtratora(historico: ChatMessage[]) {
  const historicoFormatado = historico
    .map((m) => `${m.role === 'user' ? 'User' : 'MarIA'}: ${m.content}`)
    .join('\n');

  const response = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 1500,
    temperature: 0,
    system: PROMPT_EXTRATORA,
    messages: [
      {
        role: 'user',
        content: `<conversation_history>\n${historicoFormatado}\n</conversation_history>`,
      },
      // Prefill to force JSON output starting with '{'
      { role: 'assistant', content: '{' },
    ],
  });

  const jsonText =
    response.content[0].type === 'text' ? '{' + response.content[0].text : '{}';
  return JSON.parse(jsonText);
}

/**
 * Redatora – gera o release a partir do JSON estruturado.
 */
export async function chamarRedatora(pauta: unknown) {
  if (
    (pauta as { campos_faltantes?: string[] }).campos_faltantes?.length &&
    (pauta as { campos_faltantes?: string[] }).campos_faltantes!.length > 0
  ) {
    return {
      release: null,
      erro: `Campos faltantes: ${(pauta as { campos_faltantes?: string[] }).campos_faltantes!.join(', ')}`,
    };
  }

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2500,
    temperature: 0.4,
    system: PROMPT_REDATORA,
    messages: [
      {
        role: 'user',
        content: `<pauta_data>\n${JSON.stringify(pauta, null, 2)}\n</pauta_data>`,
      },
    ],
  });

  const texto =
    response.content[0].type === 'text' ? response.content[0].text : '';
  const matchRelease = texto.match(/<release>([\s\S]*?)<\/release>/);
  const matchErro = texto.match(/<error>([\s\S]*?)<\/error>/);
  if (matchErro) return { release: null, erro: matchErro[1].trim() };
  if (matchRelease) return { release: matchRelease[1].trim(), erro: null };
  return { release: null, erro: 'Formato inesperado' };
}

/**
 * Orquestra todo o fluxo de um turno de chat.
 */
export async function processarTurnoChat(historico: ChatMessage[]) {
  const { resposta, prontoParaRelease } = await chamarEntrevistadora(historico);
  if (!prontoParaRelease) {
    return { resposta, releaseGerado: null };
  }
  const pauta = await chamarExtratora([
    ...historico,
    { role: 'assistant', content: resposta },
  ]);
  const { release, erro } = await chamarRedatora(pauta);
  return {
    resposta,
    releaseGerado: release,
    pautaEstruturada: pauta,
    erro,
  };
}
