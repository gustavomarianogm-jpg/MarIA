import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import { ReleaseMarkdown } from '@/components/ReleaseMarkdown';
import './ChatStyles.css';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isAudio?: boolean;
  audioUrl?: string;
  duration?: string;
  files?: { name: string; type: string; url: string }[];
  isFinalRelease?: boolean;
};

export function ChatPage({
  session,
  onNavigate,
}: {
  session: unknown;
  onNavigate: (r: string) => void;
}) {
  const userQuery = trpc.user.me.useQuery(undefined, { enabled: !!session });
  const credits = userQuery.data?.credits || 0;
  
  const isCongressMode = new URLSearchParams(window.location.search).get('congresso') === 'true';

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('maria_chat_messages_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [{
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Oi! 👋 Sou a MarIA, jornalista. Tô aqui pra transformar a sua história em uma matéria que jornalista quer publicar. Antes de a gente começar: me conta seu nome e o que você faz?'
    }];
  });

  const [input, setInput] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [releaseReady, setReleaseReady] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recIntervalRef = useRef<number | null>(null);

  const chatMutation = trpc.chat.sendMessage.useMutation();
  const generateReleaseMutation = trpc.chat.generateRelease.useMutation();

  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const currentStep = Math.min(userMessageCount, 7);

  useEffect(() => {
    localStorage.setItem('maria_chat_messages_v2', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkGuestLimit = () => {
    if (isCongressMode) return false;
    if (!session && localStorage.getItem('maria_guest_release') === 'true') {
      alert('Você já gerou sua pauta gratuita! Cadastre-se na plataforma para criar novas pautas.');
      onNavigate('dash');
      return true;
    }
    return false;
  };

  const handleSend = async (text: string = input.trim(), files: File[] = pendingFiles, audioData?: { url: string, duration: string }) => {
    if (!text && files.length === 0 && !audioData) return;
    if (checkGuestLimit()) return;

    setInput('');
    setPendingFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    let contentToSend = text;
    let mappedFiles = undefined;

    if (files.length > 0) {
      mappedFiles = files.map(f => ({ name: f.name, type: f.type, url: URL.createObjectURL(f) }));
      contentToSend = `[Arquivos anexados: ${files.map(f => f.name).join(', ')}]\n${contentToSend}`;
    }
    if (audioData) {
      contentToSend = `[Áudio gravado: ${audioData.duration}]\n${contentToSend}`;
    }

    const newUserMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: contentToSend,
      files: mappedFiles,
      isAudio: !!audioData,
      audioUrl: audioData?.url,
      duration: audioData?.duration
    };

    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);

    // Prepare API format
    const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await chatMutation.mutateAsync({ messages: apiMessages });
      const newAssistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: res.text };
      setMessages([...newMessages, newAssistantMsg]);
      
      // If we hit step 7, prompt release generation
      if (currentStep + 1 >= 7) {
        handleGenerateRelease([...newMessages, newAssistantMsg]);
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }, message?: string };
      const errorMsg = e.data?.message || e.message || 'Erro de conexão.';
      setMessages([...newMessages, { id: crypto.randomUUID(), role: 'assistant', content: `⚠️ ${errorMsg}` }]);
    }
  };

  const handleGenerateRelease = async (currentMsgs = messages) => {
    if (checkGuestLimit()) return;
    try {
      const apiMessages = currentMsgs.map(m => ({ role: m.role, content: m.content }));
      const res = await generateReleaseMutation.mutateAsync({ messages: apiMessages });
      
      if (session) userQuery.refetch();
      else if (!isCongressMode) localStorage.setItem('maria_guest_release', 'true');

      setMessages(prev => [...prev, { 
        id: crypto.randomUUID(), 
        role: 'assistant', 
        content: res.text,
        isFinalRelease: true 
      }]);
      setReleaseReady(true);
      setTimeout(() => setIsPaywallOpen(true), 2600); // Auto-open paywall
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }, message?: string };
      alert(e.data?.message || e.message || 'Erro ao gerar release.');
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPendingFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Audio Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = e => audioChunksRef.current.push(e.data);
      recorder.start();

      setIsRecording(true);
      setRecSeconds(0);
      recIntervalRef.current = window.setInterval(() => setRecSeconds(s => s + 1), 1000);
    } catch {
      alert('Não consegui acessar o microfone. Verifique a permissão do navegador.');
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    window.clearInterval(recIntervalRef.current!);
    
    mediaRecorderRef.current.onstop = () => {
      mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const m = Math.floor(recSeconds / 60);
      const s = (recSeconds % 60).toString().padStart(2, '0');
      
      handleSend('', [], { url, duration: `${m}:${s}` });
      setIsRecording(false);
    };
    mediaRecorderRef.current.stop();
  };

  const cancelRecording = () => {
    if (!mediaRecorderRef.current) return;
    window.clearInterval(recIntervalRef.current!);
    mediaRecorderRef.current.onstop = () => {
      mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    };
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const steps = [
    { label: 'QUEM É VOCÊ' },
    { label: 'O QUE ACONTECEU' },
    { label: 'QUANDO' },
    { label: 'POR QUE AGORA' },
    { label: 'SUA FRASE' },
    { label: 'UM NÚMERO' },
    { label: 'CONTATO' },
  ];

  const quickRepliesByStep: Record<number, string[]> = {
    0: ["Sou dono de padaria", "Tenho uma startup", "Sou MEI"],
    1: ["Lancei um produto", "Bati um recorde", "Fiz aniversário de empresa"],
    2: ["Essa semana", "Mês passado", "Vai acontecer em breve"],
    3: ["Sobrevivi a uma crise", "Sou pioneiro no setor", "Resolvo uma dor real"],
    5: ["Cresci 200%", "Atendo 500 clientes", "10 anos de mercado"]
  };

  return (
    <div className="grain w-full overflow-hidden" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100dvh', background: '#FAF6F0', color: '#0F0A1A', fontFamily: "'Inter Tight', sans-serif", WebkitFontSmoothing: 'antialiased' }}>
      
      {/* CONTEÚDO PRINCIPAL */}
      <div className="relative z-10 bg-paper" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', width: '100%', margin: '0 auto', boxShadow: '0 0 60px rgba(15,10,26,0.08)' }}>
        
        {/* HEADER */}
        <header className="border-b-2 border-ink bg-paper px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '2px solid #0F0A1A', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => onNavigate('dash')} className="chat-input-btn" style={{width:'38px', height:'38px'}} aria-label="Voltar">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <div className="w-11 h-11 rounded-full bg-ink text-paper flex items-center justify-center font-display font-bold text-lg" style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', backgroundColor: '#0F0A1A', color: '#FAF6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.125rem' }}>M</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="font-semibold text-sm flex items-center gap-2" style={{ fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              MarIA <span className="chat-pulse-dot"></span>
            </div>
            <div className="text-xs text-ink/60 font-mono" style={{ fontSize: '0.75rem', color: 'rgba(15,10,26,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>
              Jornalista · online agora
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isCongressMode && <span className="chat-stamp hidden sm:inline-block">Demo</span>}
          {session && <span className="chat-stamp hidden sm:inline-block">{credits} créditos</span>}
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="px-4 py-2.5 bg-white flex-shrink-0" style={{ borderBottom: '2px solid #0F0A1A', padding: '0.625rem 1rem', backgroundColor: '#fff', flexShrink: 0 }}>
        <div className="flex items-center justify-between mb-1.5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <span className="uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.05em', color: 'rgba(15,10,26,0.6)' }}>SUA PAUTA EM CONSTRUÇÃO</span>
          <span className="uppercase font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.05em', color: '#E91E8C' }}>
            {releaseReady ? '✓ RELEASE GERADO' : `${Math.min(currentStep + 1, 7)} / 7 · ${steps[Math.min(currentStep, 6)]?.label}`}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1.5" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '0.375rem' }}>
          {Array.from({length: 7}).map((_, i) => (
            <div key={i} className={`chat-step-dot ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`}></div>
          ))}
        </div>
      </div>

      {/* MESSAGES AREA */}
      <main className="chat-scroll bg-paper relative" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-maria'} style={m.isFinalRelease ? { maxWidth: '92%' } : {}}>
            {m.isFinalRelease ? (
              <>
                <div className="font-mono text-[10px] tracking-wider mb-2" style={{color:'#F5B700'}}>✓ RELEASE PRONTO</div>
                <div className="bg-paper text-ink rounded-lg p-3 mt-1" style={{border:'1.5px solid #F5B700'}}>
                  <div className="font-display text-base mb-1 font-semibold">Sua história está pronta para a imprensa</div>
                  <div className="border-b border-ink border-dashed my-2"></div>
                  <div className="text-xs leading-relaxed text-ink/80 prose prose-sm max-w-none">
                    <ReleaseMarkdown content={m.content} variant="release" />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setIsPaywallOpen(true)} className="chat-quick-chip" style={{background:'#F5B700'}}>Enviar para imprensa →</button>
                </div>
              </>
            ) : m.isAudio ? (
              <div className="chat-audio-msg">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m7 7v4m0-4a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                <audio controls src={m.audioUrl}></audio>
                <span className="font-mono text-xs">{m.duration}</span>
              </div>
            ) : (
              <div>
                {m.files && m.files.length > 0 && (
                  <div className="flex flex-col gap-2 mb-2">
                    {m.files.map((f, i) => f.type.startsWith('image/') ? 
                      <img key={i} src={f.url} className="rounded-lg" style={{ maxWidth: '200px', border: '1.5px solid #0F0A1A' }} alt={f.name} /> : 
                      <div key={i} className="flex items-center gap-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' }}><span className="text-xl">📄</span> {f.name}</div>
                    )}
                  </div>
                )}
                <ReleaseMarkdown content={m.content.replace(/\[(Arquivos anexados|Áudio gravado).*?\]\n/, '')} variant="chat" role={m.role} />
              </div>
            )}
          </div>
        ))}

        {(chatMutation.isPending || generateReleaseMutation.isPending) && (
          <div className="chat-bubble-maria chat-typing">
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* QUICK REPLIES */}
      {!isRecording && pendingFiles.length === 0 && !input && quickRepliesByStep[currentStep] && quickRepliesByStep[currentStep].length > 0 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0" style={{ padding: '0 1rem 0.5rem 1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none' }}>
          {quickRepliesByStep[currentStep].map((qr, idx) => (
            <button key={idx} className="chat-quick-chip" onClick={() => handleSend(qr)} style={{ border: '1.5px solid #0F0A1A', backgroundColor: 'white', borderRadius: '20px', padding: '0.4rem 0.9rem', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s ease' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F5B700'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}>{qr}</button>
          ))}
        </div>
      )}

      {/* ATTACH PREVIEW */}
      {pendingFiles.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 flex-shrink-0" style={{ padding: '0 1rem 0.5rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flexShrink: 0 }}>
          {pendingFiles.map((f, i) => (
            <div key={i} className="chat-file-chip" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: '#e2e8f0', borderRadius: '0.5rem', fontSize: '0.75rem' }}>
              <span>{f.type.startsWith('image/') ? '🖼️' : '📄'}</span>
              <span className="truncate max-w-[140px]" style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              <button onClick={() => removeFile(i)} className="font-bold cursor-pointer ml-1" style={{ marginLeft: '0.25rem', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* INPUT BAR */}
      <footer className="border-t-2 border-ink bg-paper px-3 py-3 flex-shrink-0" style={{ borderTop: '2px solid #0F0A1A', padding: '0.75rem', flexShrink: 0 }}>
          {!isRecording ? (
            <div className="flex items-end gap-2" style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <button className="chat-input-btn" onClick={() => document.getElementById('fileInput')?.click()} aria-label="Anexar arquivo" title="Anexar foto, vídeo ou documento" style={{ flexShrink: 0, width: '42px', height: '42px' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
              </button>
              <input type="file" id="fileInput" className="hidden" multiple accept="image/*,video/*,.pdf,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />

              <div className="bg-white flex items-end" style={{ flex: 1, border: '1.5px solid #0F0A1A', borderRadius: '1rem', boxShadow: '3px 3px 0 rgba(15,10,26,0.12)', display: 'flex', alignItems: 'flex-end' }}>
                <textarea 
                  ref={textareaRef}
                  rows={1} 
                  className="w-full bg-transparent border-none outline-none resize-none py-3 px-4 leading-relaxed"
                  style={{ width: '100%', backgroundColor: 'transparent', border: 'none', outline: 'none', resize: 'none', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#0F0A1A', maxHeight: '8rem', lineHeight: 1.5 }}
                  placeholder="Conte sua história para a MarIA..."
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (textareaRef.current) {
                      textareaRef.current.style.height = 'auto';
                      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
                    }
                  }}
                  onKeyDown={handleKey}
                  disabled={chatMutation.isPending || generateReleaseMutation.isPending}
                ></textarea>
              </div>

              {input.trim() || pendingFiles.length > 0 ? (
                <button className="chat-input-btn chat-send-btn" onClick={() => handleSend()} aria-label="Enviar" disabled={chatMutation.isPending} style={{ flexShrink: 0, width: '42px', height: '42px' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7"/></svg>
                </button>
              ) : (
                <button className="chat-input-btn" onClick={startRecording} aria-label="Gravar áudio" title="Gravar áudio" disabled={chatMutation.isPending} style={{ flexShrink: 0, width: '42px', height: '42px' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m7 7v4m0-4a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 px-2 py-1" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0.5rem' }}>
              <button className="chat-input-btn" style={{ borderColor:'#E91E8C', color:'#E91E8C', flexShrink: 0, width: '42px', height: '42px' }} onClick={cancelRecording} aria-label="Cancelar">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <div className="flex-1 flex items-center gap-2" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="chat-recording chat-input-btn" style={{ width:'14px', height:'14px', border:'none', padding: 0 }}></span>
                <span className="font-mono text-sm font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', fontWeight: 600 }}>{formatTimer(recSeconds)}</span>
                <span className="text-xs text-ink/50 font-mono" style={{ fontSize: '0.75rem', color: 'rgba(15,10,26,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>gravando áudio...</span>
              </div>
              <button className="chat-input-btn chat-send-btn" onClick={stopRecording} aria-label="Enviar áudio" style={{ flexShrink: 0, width: '42px', height: '42px' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7"/></svg>
              </button>
            </div>
          )}
          <div className="mt-2 text-center text-[10px] font-mono text-ink/40 tracking-wider" style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(15,10,26,0.5)', letterSpacing: '0.05em' }}>
            MarIA é uma assessora virtual · Suas respostas geram um release profissional
          </div>
        </footer>
      </div>

      {/* PAYWALL MODAL */}
      <div className={`modal-overlay ${isPaywallOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setIsPaywallOpen(false); }}>
        <div className="modal-card grain">
          
          <div className="flex items-start justify-between mb-3 relative z-10" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span className="chat-stamp">1ª pauta concluída</span>
            <button onClick={() => setIsPaywallOpen(false)} className="chat-input-btn" style={{width:'34px', height:'34px'}} aria-label="Fechar">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <h2 className="display text-3xl mb-2 relative z-10" style={{ fontWeight: 600, fontSize: '1.875rem', lineHeight: '2.25rem', marginBottom: '0.5rem' }}>
            Seu release está pronto. <span style={{color:'#E91E8C'}}>Falta o último passo.</span>
          </h2>
          <p className="text-sm text-ink/70 leading-relaxed mb-5 relative z-10" style={{ fontSize: '0.875rem', color: 'rgba(15,10,26,0.7)', lineHeight: 1.625, marginBottom: '1.25rem' }}>
            Sua história já está no formato que jornalista lê. Para a nossa curadoria revisar e <strong>enviar para os jornalistas certos</strong>, escolha como você quer seguir.
          </p>

          <div className="flex flex-col gap-3 mb-5 relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="plan-card selected" style={{cursor:'default'}}>
              <div className="flex items-center justify-between mb-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span className="font-semibold text-sm" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Plano MarIA</span>
                <span className="font-mono text-xs bg-ink text-paper px-2 py-0.5 rounded-md" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', backgroundColor: '#0F0A1A', color: '#FAF6F0', padding: '2px 7px', borderRadius: '6px' }}>ACESSO COMPLETO</span>
              </div>
              <div className="display text-4xl my-1" style={{ fontWeight: 600, fontSize: '2.25rem', lineHeight: '2.5rem', marginTop: '0.25rem', marginBottom: '0.25rem' }}>
                R$ 297<span className="text-base font-sans text-ink/60" style={{ fontSize: '1rem', fontFamily: "'Inter Tight', sans-serif", color: 'rgba(15,10,26,0.6)' }}>/mês</span>
              </div>
              <div className="flex items-center gap-2 mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="font-mono text-xs bg-rose text-paper px-2 py-0.5 rounded-md font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', backgroundColor: '#E91E8C', color: '#FAF6F0', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>+ BÔNUS POR PUBLICAÇÃO</span>
              </div>
              <div className="news-rule my-3 relative z-10" style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}></div>
              <ul className="flex flex-col gap-2 text-xs text-ink/80" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(15,10,26,0.8)' }}>
                <li className="flex items-start gap-2" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.125rem', color: '#E91E8C' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Entrevista com a MarIA e release profissional pronto
                </li>
                <li className="flex items-start gap-2" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.125rem', color: '#E91E8C' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Curadoria humana revisando cada pauta
                </li>
                <li className="flex items-start gap-2" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.125rem', color: '#E91E8C' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Envio para os jornalistas certos do seu setor
                </li>
                <li className="flex items-start gap-2" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.125rem', color: '#E91E8C' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Bônus cobrado apenas quando a matéria sai publicada
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 text-xs text-ink/70 font-mono relative z-10" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.75rem', color: 'rgba(15,10,26,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>
            <svg className="w-4 h-4 flex-shrink-0 text-rose" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', flexShrink: 0, color: '#E91E8C' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Garantia de 30 dias · Cancele quando quiser
          </div>

          <button className="modal-cta relative z-10" onClick={() => { alert('Redirecionando para o Stripe/Asaas: Plano Mensal'); setIsPaywallOpen(false); }}>
            <span>Assinar agora · R$ 297/mês</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>

          <button onClick={() => setIsPaywallOpen(false)} className="w-full text-center text-xs text-ink/50 font-mono mt-3 hover:text-ink transition-colors relative z-10 bg-transparent border-none cursor-pointer" style={{ width: '100%', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(15,10,26,0.5)', fontFamily: "'JetBrains Mono', monospace", marginTop: '0.75rem' }}>
            Ver meu release antes de decidir
          </button>
        </div>
      </div>
    </div>
  );
}
