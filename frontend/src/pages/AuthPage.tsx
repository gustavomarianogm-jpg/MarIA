import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function AuthPage({ onLogin, message }: { onLogin: () => void, message?: string }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      alert('Link mágico enviado! Verifique seu e-mail.');
    } catch (err: any) {
      alert(`Erro no login: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-paper text-ink p-4 justify-center">
      <div className="w-full max-w-[440px] pt-[8vh]">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-10 h-10 bg-ink text-paper rounded-full flex items-center justify-center font-bold text-xl">
            &#8734;
          </div>
          <div className="font-display font-bold text-2xl tracking-tight">
            Mar<em className="text-rose not-italic">IA</em>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-white/50 p-1 rounded-2xl border border-border/40 mb-6">
          <button className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white shadow-sm text-ink transition-all">
            Acesso
          </button>
          <button className="flex-1 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-ink transition-all" onClick={() => alert('Cadastro via Waitlist na Landing Page.')}>
            Cadastro PME
          </button>
        </div>
        
        {/* Card */}
        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-border/40">
          <h3 className="text-xl font-bold mb-2">Bem-vindo(a) de volta</h3>
          <div className="text-slate-500 text-sm mb-6">{message || 'Acesse sua conta para continuar'}</div>
          
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors mb-6" onClick={() => alert('Em breve!')}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" alt="Google" /> Continuar com Google
          </button>
          
          <div className="flex items-center gap-3 text-slate-400 text-xs mb-6">
            <hr className="flex-1 border-slate-200"/>
            <span>ou acesso por e-mail</span>
            <hr className="flex-1 border-slate-200"/>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium mb-2">E-mail corporativo</label>
              <input 
                id="email"
                type="email" 
                placeholder="seu@email.com.br" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all text-sm"
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-rose to-plum text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity text-sm" disabled={loading}>
              {loading ? 'Enviando...' : 'Acessar conta ↗'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 mt-6">
            <p>Ambiente de Dev: Use qualquer e-mail para testar, confira o Inbucket para pegar o link.</p>
          </div>
          
          <div className="text-center mt-6 text-sm text-slate-500">
            Jornalista? <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = '/?pauta='; }} className="text-rose font-medium hover:underline">Acesse pautas aprovadas</a>
          </div>
        </div>
      </div>
    </div>
  );
}
