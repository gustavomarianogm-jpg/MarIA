import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { ReleaseMarkdown } from '@/components/ReleaseMarkdown';

type Message = { role: 'user' | 'assistant'; content: string };

export function ChatPage() {
  const userQuery = trpc.user.me.useQuery();
  const userName = userQuery.data?.name?.split(' ')[0] || '';
  const credits = userQuery.data?.credits || 0;

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! 👋 Sou a **MarIA**, sua assessora de imprensa virtual. Vou te ajudar a transformar sua história em uma pauta profissional que vai chegar nos jornalistas certos.\n\nSobre o que vamos falar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [release, setRelease] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chat.sendMessage.useMutation();
  const generateReleaseMutation = trpc.chat.generateRelease.useMutation();

  const userMessageCount = messages.filter(m => m.role === 'user').length;
  const canGenerateRelease = userMessageCount >= 7 || messages.some(m => m.content.includes('Gerar release'));

  // Update greeting when user name loads
  useEffect(() => {
    if (userName && messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{
        role: 'assistant',
        content: `Olá, **${userName}**! 👋 Sou a **MarIA**, sua assessora de imprensa virtual. Que história incrível você quer contar hoje?`
      }]);
    }
  }, [userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    
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
    try {
      const res = await generateReleaseMutation.mutateAsync({ messages });
      setRelease(res.text);
      userQuery.refetch(); // Refetch credits after generating release
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (release) {
    return (
      <div id="pg-chat" className="page on" style={{ display: 'block' }}>
        <div className="chat-outer" style={{ maxWidth: '800px' }}>
          <div className="rel-wrap vis">
            <div className="rel-hdr">
              <button onClick={() => setRelease('')}>&larr;</button>
              <span>Release Profissional</span>
            </div>
            <div className="rel-acts">
              <button className="act-btn" onClick={() => navigator.clipboard.writeText(release)}>📋 Copiar Texto</button>
              <button className="act-btn p" onClick={() => alert('Feature em breve!')}>🚀 Enviar para Curadoria (Match)</button>
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
    <div id="pg-chat" className="page on" style={{ display: 'block' }}>
      <div className="chat-outer">
        <div className="chat-wrap">
          <div className="chat-hdr">
            <div className="av-m">M</div>
            <div className="info">
              <div className="name">MarIA</div>
              <div className="status"><div className="dot-on"></div> Assessora Virtual • Online</div>
            </div>
            <div className="chat-cred">
              <div className="cl">Créditos</div>
              <div className="cv">{credits}</div>
            </div>
          </div>

          <div id="msgs">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.role === 'assistant' && <div className="msg-av">M</div>}
                {m.role === 'user' && <div className="msg-av u">{userName?.[0] || 'U'}</div>}
                <div className="msg-b">
                  <ReleaseMarkdown content={m.content} variant="chat" />
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
              {generateReleaseMutation.isPending ? '⏳ Escrevendo Release...' : '✨ Gerar release profissional (1 crédito)'}
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
    </div>
  );
}
