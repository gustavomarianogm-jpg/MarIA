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
      const errorMsg = err?.message || err?.data?.message || 'Erro de conexão. Tente novamente.';
      console.error('[ChatPage] Erro:', errorMsg, err);
      setMessages([...newMessages, { role: 'assistant', content: `⚠️ ${errorMsg}` }]);
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
    <div id="pg-chat" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingTop: isCongressMode ? '0px' : '60px', background: 'white', fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: 'white' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #E91E8C, #9D4EDD)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 700, border: '2px solid rgba(255,255,255,0.35)', flexShrink: 0 }}>M</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontSize: '15px', fontWeight: 700 }}>MarIA {isCongressMode && "(Apresentação)"}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }}></div>
                Assessora Virtual • Online
              </div>
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
                <div style={{ marginLeft: 'auto', textAlign: 'right', color: 'white' }}>
                  <div style={{ fontSize: '10px', opacity: 0.7 }}>Créditos</div>
                  <div style={{ fontSize: '20px', fontWeight: 900 }}>{credits}</div>
                </div>
              ) : (
                <div style={{ marginLeft: 'auto', textAlign: 'right', color: 'white', cursor: 'pointer' }} onClick={() => onNavigate('dash')}>
                  <div style={{ fontSize: '12px', fontWeight: 900 }}>Entrar / Cadastrar</div>
                </div>
              )
            )}
          </div>

          {/* Messages Area */}
          <div id="msgs" style={{ flex: 1, overflowY: 'auto', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'white', alignItems: 'center' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '840px', ...(m.role === 'user' ? { flexDirection: 'row-reverse' } : {}) }}>
                {m.role === 'assistant' && <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #E91E8C, #9D4EDD)', color: 'white', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>M</div>}
                {m.role === 'user' && <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#F0E8FF', color: '#9D4EDD', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>{session ? (userName?.[0] || 'U') : 'V'}</div>}
                <div style={{ padding: '12px 18px', fontSize: '14px', lineHeight: 1.65, borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', maxWidth: '85%', ...(m.role === 'user' ? { background: 'linear-gradient(135deg, #E91E8C, #9D4EDD)', color: 'white' } : { background: 'white', color: '#333', border: '1px solid #EEE' }) }}>
                  <ReleaseMarkdown content={m.content} variant="chat" role={m.role} />
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '840px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #E91E8C, #9D4EDD)', color: 'white', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>M</div>
                <div style={{ padding: '12px 18px', borderRadius: '18px 18px 18px 4px', background: 'white', border: '1px solid #EEE' }}>
                  <div className="typing-ind" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div className="td"></div><div className="td"></div><div className="td"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chips / Generate Button */}
          {canGenerateRelease ? (
            <button 
              onClick={handleGenerateRelease}
              disabled={generateReleaseMutation.isPending}
              style={{ margin: '0 auto 20px', padding: '14px 24px', borderRadius: '24px', background: 'linear-gradient(135deg, #E91E8C, #9D4EDD)', color: 'white', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', width: '100%', maxWidth: '840px', boxShadow: '0 6px 20px rgba(233,30,140,0.25)', opacity: generateReleaseMutation.isPending ? 0.5 : 1 }}
            >
              {generateReleaseMutation.isPending ? '⏳ Escrevendo Release...' : `✨ Gerar release profissional ${session ? '(1 crédito)' : '(Grátis)'}`}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '10px 20px 24px', background: 'white', width: '100%', maxWidth: '840px', margin: '0 auto', justifyContent: 'center', flexShrink: 0 }}>
              {['Lançamento de produto', 'Nova parceria', 'Prêmio conquistado', 'Evento corporativo'].map(text => (
                <div key={text} onClick={() => handleChipClick(text)} style={{ whiteSpace: 'nowrap', background: 'rgba(157,78,221,0.10)', color: '#9D4EDD', border: '1px solid rgba(157,78,221,0.2)', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>{text}</div>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ background: 'white', padding: '10px 20px 30px', display: 'flex', gap: '12px', alignItems: 'center', width: '100%', maxWidth: '840px', margin: '0 auto', flexShrink: 0 }}>
            <input 
              type="text" 
              placeholder="Responda à MarIA..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={chatMutation.isPending || generateReleaseMutation.isPending}
              style={{ flex: 1, border: '1px solid #EEE', borderRadius: '24px', padding: '14px 20px', fontSize: '14px', fontFamily: "'Poppins', 'Segoe UI', sans-serif", background: '#FAFAFA', color: '#1A1028', outline: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            />
            <button type="submit" disabled={!input.trim() || chatMutation.isPending || generateReleaseMutation.isPending} style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #E91E8C, #9D4EDD)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: (!input.trim() || chatMutation.isPending) ? 0.35 : 1 }}>
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
