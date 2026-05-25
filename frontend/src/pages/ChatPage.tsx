import React, { useState, useRef, useEffect } from 'react';

import { trpc } from '@/utils/trpc';
import { ReleaseMarkdown } from '@/components/ReleaseMarkdown';
import styles from './ChatPage.module.css';

type Message = { role: 'user' | 'assistant'; content: string };

export function ChatPage({
  session,
  onNavigate,
}: {
  session: unknown;
  onNavigate: (r: string) => void;
}) {
  const userQuery = trpc.user.me.useQuery(undefined, { enabled: !!session });
  const userName = userQuery.data?.name?.split(' ')[0] || 'Visitante';
  const credits = userQuery.data?.credits || 0;

  const isCongressMode =
    new URLSearchParams(window.location.search).get('congresso') === 'true';

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('maria_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
    }
    return [
      {
        role: 'assistant',
        content:
          'Olá! 👋 Sou a **MarIA**, sua assessora de imprensa virtual. Vou te ajudar a transformar sua história em uma pauta profissional que vai chegar nos jornalistas certos.\n\nSobre o que vamos falar hoje?',
      },
    ];
  });

  const [input, setInput] = useState('');
  const [release, setRelease] = useState('');
  const [generatedReleaseText, setGeneratedReleaseText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chat.sendMessage.useMutation();

  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const canGenerateRelease =
    userMessageCount >= 7 ||
    messages.some((m) => m.content.includes('Gerar release'));

  useEffect(() => {
    localStorage.setItem('maria_chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (
      session &&
      userQuery.data?.name &&
      messages.length === 1 &&
      messages[0].role === 'assistant' &&
      !messages[0].content.includes(userName)
    ) {
      // Wrap state update in a timeout to avoid synchronous setState in effect
      setTimeout(() => {
        setMessages([
          {
            role: 'assistant',
            content: `Olá, **${userName}**! 👋 Sou a **MarIA**, sua assessora de imprensa virtual. Que história incrível você quer contar hoje?`,
          },
        ]);
      }, 0);
    }
  }, [userName, session, messages, userQuery.data?.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkGuestLimit = () => {
    if (isCongressMode) return false;
    if (!session && localStorage.getItem('maria_guest_release') === 'true') {
      alert(
        'Você já gerou sua pauta gratuita! Cadastre-se na plataforma para criar novas pautas.'
      );
      onNavigate('dash');
      return true;
    }
    return false;
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    if (checkGuestLimit()) return;

    const userMsg = input.trim();
    setInput('');
    setGeneratedReleaseText(''); // clear popup if they type again

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMsg },
    ];
    setMessages(newMessages);

    try {
      const res = await chatMutation.mutateAsync({ messages: newMessages });
      setMessages([...newMessages, { role: 'assistant', content: res.text }]);
    } catch (err: unknown) {
      let errorMsg = 'Erro de conexão. Tente novamente.';
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (
        err &&
        typeof err === 'object' &&
        'data' in err &&
        typeof (err as { data?: { message?: string } }).data?.message ===
          'string'
      ) {
        errorMsg = (err as { data: { message: string } }).data.message;
      }
      console.error('[ChatPage] Erro:', errorMsg, err);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: `⚠️ ${errorMsg}` },
      ]);
    }
  };

  const handleChipClick = (text: string) => {
    setInput(text);
  };

  const generateReleaseMutation = trpc.chat.generateRelease.useMutation();

  const handleGenerateRelease = async () => {
    if (checkGuestLimit()) return;
    setIsProcessing(true);
    try {
      // Chama o backend para gerar o release, consumir créditos e salvar no DB
      const res = await generateReleaseMutation.mutateAsync({ messages });

      if (session) {
        userQuery.refetch(); // Atualiza os créditos
      } else if (!isCongressMode) {
        localStorage.setItem('maria_guest_release', 'true');
      }

      setRelease(res.text);
    } catch (err: unknown) {
      let errorMsg = 'Erro de conexão. Tente novamente.';
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (
        err &&
        typeof err === 'object' &&
        'data' in err &&
        typeof (err as { data?: { message?: string } }).data?.message ===
          'string'
      ) {
        errorMsg = (err as { data: { message: string } }).data.message;
      }
      console.error('[ChatPage] Erro:', errorMsg, err);
      alert(errorMsg ?? 'Erro ao gerar release.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewStory = () => {
    if (checkGuestLimit()) return;
    setRelease('');
    setGeneratedReleaseText('');
    setMessages([
      { role: 'assistant', content: `Olá! 👋 Sobre o que vamos falar hoje?` },
    ]);
  };

  if (release) {
    return (
      <div className={styles.pageFull} style={{ paddingTop: '0px' }}>
        <div
          className={styles.chatOuter}
          style={{ maxWidth: '800px', margin: '20px auto' }}
        >
          <div className={styles.releaseContainer}>
            <div className={styles.releaseHeader}>
              <button aria-label="Voltar" onClick={() => setRelease('')}>
                &larr;
              </button>
              <span>Release Profissional {!session && '(Grátis)'}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
              <button
                className="act-btn"
                onClick={() => navigator.clipboard.writeText(release)}
              >
                📋 Copiar Texto
              </button>
              <button className="act-btn p" onClick={handleNewStory}>
                🚀 Nova Pauta
              </button>
            </div>
            <div className={styles.releaseContent}>
              <ReleaseMarkdown content={release} variant="release" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageFull} style={{ paddingTop: '0px' }}>
      <div className={styles.chatOuter}>
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #E91E8C, #9D4EDD)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 700,
              border: '2px solid rgba(255,255,255,0.35)',
              flexShrink: 0,
            }}
          >
            M
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontSize: '15px', fontWeight: 700 }}>
              MarIA {isCongressMode && '(Apresentação)'}
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <div
                onClick={handleGenerateRelease}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#4ADE80',
                  display: 'inline-block',
                  cursor: 'pointer',
                }}
                title="Forçar Geração de Release (Debug)"
              ></div>
              Assessora Virtual • Online
            </div>
          </div>

          <button
            onClick={handleNewStory}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginRight: isCongressMode ? '0' : '12px',
            }}
            title="Reiniciar conversa do zero"
          >
            🔄 Reiniciar
          </button>

          {!isCongressMode && session && (
            <div
              style={{ marginLeft: 'auto', textAlign: 'right', color: 'white' }}
            >
              <div style={{ fontSize: '10px', opacity: 0.7 }}>Créditos</div>
              <div style={{ fontSize: '20px', fontWeight: 900 }}>{credits}</div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className={styles.msgsContainer}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`${styles.messageBubble} ${m.role === 'user' ? styles.user : styles.assistant}`}
            >
              <ReleaseMarkdown
                content={m.content}
                variant="chat"
                role={m.role}
              />
            </div>
          ))}
          {chatMutation.isPending && (
            <div className={`${styles.messageBubble} ${styles.assistant}`}>
              <div
                className="typing-ind"
                style={{ display: 'flex', gap: '4px', alignItems: 'center' }}
              >
                <div className="td"></div>
                <div className="td"></div>
                <div className="td"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chips / Generate Button */}
        {canGenerateRelease ? (
          <button
            onClick={handleGenerateRelease}
            disabled={isProcessing || chatMutation.isPending}
            className={styles.generateBtn}
          >
            {isProcessing
              ? '⏳ Escrevendo Release...'
              : `✨ Gerar release profissional ${session ? '(1 crédito)' : '(Grátis)'}`}
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              padding: '10px 20px 24px',
              width: '100%',
              maxWidth: '840px',
              margin: '0 auto',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {[
              'Lançamento de produto',
              'Nova parceria',
              'Prêmio conquistado',
              'Evento corporativo',
            ].map((text) => (
              <div
                key={text}
                onClick={() => handleChipClick(text)}
                style={{
                  whiteSpace: 'nowrap',
                  background: 'rgba(157,78,221,0.10)',
                  color: '#9D4EDD',
                  border: '1px solid rgba(157,78,221,0.2)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {text}
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSend} className={styles.inputForm}>
          <input
            type="text"
            placeholder="Responda à MarIA..."
            aria-label="Mensagem para a MarIA"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={chatMutation.isPending || isProcessing}
            className={styles.inputField}
          />
          <button
            type="submit"
            aria-label="Enviar mensagem"
            disabled={!input.trim() || chatMutation.isPending || isProcessing}
            className={styles.sendButton}
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>

      {generatedReleaseText && !release && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '20px',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border)',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 800,
              color: 'var(--dark)',
              marginBottom: '8px',
            }}
          >
            História Gerada com Sucesso! 🎉
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--gray)',
              marginBottom: '16px',
            }}
          >
            O release da sua pauta está pronto para visualização.
          </p>
          <button
            onClick={() => {
              setRelease(generatedReleaseText);
            }}
            style={{
              background: 'var(--grad)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '100px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(233,30,140,0.3)',
            }}
          >
            Visualizar História Completa ✨
          </button>
        </div>
      )}
    </div>
  );
}
