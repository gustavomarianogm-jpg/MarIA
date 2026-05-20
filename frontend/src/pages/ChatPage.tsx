import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ReleaseMarkdown } from '@/components/ReleaseMarkdown';

type Message = { role: 'user' | 'assistant'; content: string };

export function ChatPage() {
  const userQuery = trpc.user.me.useQuery();
  const userName = userQuery.data?.name?.split(' ')[0] || '';

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleGenerateRelease = async () => {
    try {
      const res = await generateReleaseMutation.mutateAsync({ messages });
      setRelease(res.text);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (release) {
    return (
      <div className="flex-1 w-full flex flex-col items-center p-6 bg-slate-50">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <Button variant="ghost" className="text-white hover:text-white/80" onClick={() => setRelease('')}>
              &larr; Voltar ao Chat
            </Button>
            <h2 className="font-semibold flex items-center gap-2">✍️ Release Profissional</h2>
          </div>
          <div className="p-8 md:p-12">
            <ReleaseMarkdown content={release} variant="release" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-end p-4 bg-slate-50 max-h-screen">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-t-2xl flex flex-col h-[85vh] border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              M
            </div>
            <div>
              <h2 className="font-bold text-slate-800">MarIA</h2>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span> Online
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                m.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-br-none' 
                  : 'bg-slate-100 text-slate-800 rounded-bl-none'
              }`}>
                <ReleaseMarkdown content={m.content} variant="chat" />
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-500 rounded-2xl px-5 py-3 rounded-bl-none italic text-sm">
                MarIA está digitando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-slate-100 bg-white">
          {canGenerateRelease && (
            <div className="mb-4">
              <Button 
                onClick={handleGenerateRelease} 
                className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg rounded-xl shadow-lg shadow-primary/20"
                disabled={generateReleaseMutation.isPending}
              >
                {generateReleaseMutation.isPending ? '⏳ Escrevendo Release...' : '✨ Gerar release profissional (1 crédito)'}
              </Button>
            </div>
          )}
          
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Digite sua resposta..."
              className="flex-1 rounded-xl h-12"
              disabled={chatMutation.isPending || generateReleaseMutation.isPending}
            />
            <Button 
              type="submit" 
              className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800"
              disabled={!input.trim() || chatMutation.isPending || generateReleaseMutation.isPending}
            >
              Enviar
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
