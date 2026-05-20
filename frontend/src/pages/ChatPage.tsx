import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { ReleaseMarkdown } from '@/components/ReleaseMarkdown';

type Message = { role: 'user' | 'assistant'; content: string };

export function ChatPage({ session, onNavigate }: { session: any, onNavigate: (r: string) => void }) {
  const userQuery = trpc.user.me.useQuery(undefined, { enabled: !!session });
  const userName = userQuery.data?.name?.split(' ')[0] || 'Visitante';
  const credits = userQuery.data?.credits || 0;

  const isCongressMode = new URLSearchParams(window.location.search).get('congresso') === 'true';

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('maria_chat_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { role: 'assistant', content: 'Olá! 👋 Sou a **MarIA**, sua assessora de imprensa virtual. Vou te ajudar a transformar sua história em uma pauta profissional que vai chegar nos jornalistas certos.\n\nSobre o que vamos falar hoje?' }
    ];
  });
  
  const [input, setInput] = useState('');
  const [release, setRelease] = useState('');
  const [generatedReleaseText, setGeneratedReleaseText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chat.sendMessage.useMutation();
  const generateReleaseMutation = trpc.chat.generateRelease.useMutation();

  const userMessageCount = messages.filter(m => m.role === 'user').length;
  const canGenerateRelease = userMessageCount >= 7 || messages.some(m => m.content.includes('Gerar release'));

  useEffect(() => {
    localStorage.setItem('maria_chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (session && userQuery.data?.name && messages.length === 1 && messages[0].role === 'assistant' && !messages[0].content.includes(userName)) {
      setMessages([{
        role: 'assistant',
        content: `Olá, **${userName}**! 👋 Sou a **MarIA**, sua assessora de imprensa virtual. Que história incrível você quer contar hoje?`
      }]);
    }
  }, [userName, session, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const checkGuestLimit = () => {
    if (isCongressMode) return false;
    if (!session && localStorage.getItem('maria_guest_release') === 'true') {
      alert("Você já gerou sua pauta gratuita! Cadastre-se na plataforma para criar novas pautas.");
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
    
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);

    try {
      const res = await chatMutation.mutateAsync({ messages: newMessages });
      setMessages([...newMessages, { role: 'assistant', content: res.text }]);
    } catch (err: any) {
      setMessages([...newMessages, { role: 'assistant', content: 'Erro de conexão. Tente novamente.' }]);
    }
  };

  const handleChipClick = (text: string) => {
    setInput(text);
  };

  const handleGenerateRelease = async () => {
    if (checkGuestLimit()) return;
    try {
      const res = await generateReleaseMutation.mutateAsync({ messages });
      
      if (session) {
        userQuery.refetch(); // Refetch credits after generating release
      } else if (!isCongressMode) {
        localStorage.setItem('maria_guest_release', 'true');
      }

      if (isCongressMode) {
        setGeneratedReleaseText(res.text);
      } else {
        setRelease(res.text);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleNewStory = () => {
    if (checkGuestLimit()) return;
    setRelease('');
    setGeneratedReleaseText('');
    setMessages([
      { role: 'assistant', content: `Olá! 👋 Sobre o que vamos falar hoje?` }
    ]);
  };

  if (release) {
    return (
      <div id="pg-chat" className="page on" style={{ display: 'block', paddingTop: isCongressMode ? '20px' : '60px' }}>
        <div className="chat-outer" style={{ maxWidth: '800px' }}>
          <div className="rel-wrap vis">
            <div className="rel-hdr">
              <button onClick={() => setRelease('')}>&larr;</button>
              <span>Release Profissional {(!session) && "(Grátis)"}</span>
            </div>
            <div className="rel-acts">
              <button className="act-btn" onClick={() => navigator.clipboard.writeText(release)}>📋 Copiar Texto</button>
              <button className="act-btn p" onClick={handleNewStory}>🚀 Nova Pauta</button>
            </div>
            <div id="rel-content">
              <ReleaseMarkdown content={release} variant="release" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="pg-chat" className="page on" style={{ display: 'block', paddingTop: isCongressMode ? '20px' : '60px' }}>
      <div className="chat-outer">
        <div className="chat-wrap" style={{ height: isCongressMode ? 'calc(100vh - 60px)' : 'auto' }}>
          <div className="chat-hdr">
            <div className="av-m">M</div>
            <div className="info" style={{ flex: 1 }}>
              <div className="name">MarIA {isCongressMode && "(Apresentação)"}</div>
              <div className="status"><div className="dot-on"></div> Assessora Virtual • Online</div>
            </div>
            
            <button 
              onClick={handleNewStory} 
              style={{ 
                background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', 
                padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                marginRight: isCongressMode ? '0' : '12px'
              }}
              title="Reiniciar conversa do zero"
            >
              🔄 Reiniciar
            </button>

            {!isCongressMode && (
              session ? (
                <div className="chat-cred">
                  <div className="cl">Créditos</div>
                  <div className="cv">{credits}</div>
                </div>
              ) : (
                <div className="chat-cred" style={{ cursor: 'pointer' }} onClick={() => onNavigate('dash')}>
                  <div className="cv" style={{ fontSize: '12px' }}>Entrar / Cadastrar</div>
                </div>
              )
            )}
          </div>

          <div id="msgs" style={{ flex: isCongressMode ? '1' : 'none' }}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.role === 'assistant' && <div className="msg-av">M</div>}
                {m.role === 'user' && <div className="msg-av u">{session ? (userName?.[0] || 'U') : 'V'}</div>}
                <div className="msg-b">
                  <ReleaseMarkdown content={m.content} variant="chat" role={m.role} />
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="msg assistant">
                <div className="msg-av">M</div>
                <div className="msg-b">
                  <div className="typing-ind">
                    <div className="td"></div><div className="td"></div><div className="td"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {canGenerateRelease ? (
            <button 
              id="gen-btn" 
              className="vis" 
              onClick={handleGenerateRelease}
              disabled={generateReleaseMutation.isPending}
              style={{ opacity: generateReleaseMutation.isPending ? 0.5 : 1 }}
            >
              {generateReleaseMutation.isPending ? '⏳ Escrevendo Release...' : `✨ Gerar release profissional ${session ? '(1 crédito)' : '(Grátis)'}`}
            </button>
          ) : (
            <div id="chips">
              <div className="chip" onClick={() => handleChipClick('Lançamento de produto')}>Lançamento de produto</div>
              <div className="chip" onClick={() => handleChipClick('Nova parceria')}>Nova parceria</div>
              <div className="chip" onClick={() => handleChipClick('Prêmio conquistado')}>Prêmio conquistado</div>
              <div className="chip" onClick={() => handleChipClick('Evento corporativo')}>Evento corporativo</div>
            </div>
          )}

          <form id="inp-area" onSubmit={handleSend}>
            <input 
              type="text" 
              id="msg-inp" 
              placeholder="Responda à MarIA..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={chatMutation.isPending || generateReleaseMutation.isPending}
            />
            <button type="submit" id="send-btn" disabled={!input.trim() || chatMutation.isPending || generateReleaseMutation.isPending}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>

        </div>
      </div>

      {generatedReleaseText && !release && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          background: 'rgba(255, 255, 255, 0.95)', padding: '20px', borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center', backdropFilter: 'blur(10px)',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--dark)', marginBottom: '8px' }}>História Gerada com Sucesso! 🎉</h3>
          <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '16px' }}>O release da sua pauta está pronto para visualização.</p>
          <button 
            onClick={() => {
              setRelease(generatedReleaseText);
            }}
            style={{
              background: 'var(--grad)', color: 'white', border: 'none', padding: '12px 24px',
              borderRadius: '100px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(233,30,140,0.3)'
            }}
          >
            Visualizar História Completa ✨
          </button>
        </div>
      )}

    </div>
  );
}
