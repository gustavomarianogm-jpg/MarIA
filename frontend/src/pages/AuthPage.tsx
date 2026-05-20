import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function AuthPage({ onLogin }: { onLogin: () => void }) {
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
    <div id="pg-auth" className="page on" style={{ display: 'flex' }}>
      <div className="auth-wrap">
        <div className="auth-logo">
          <div className="nav-icon">&#8734;</div>
          <div className="nav-brand" style={{ fontSize: '24px' }}>Mar<em>IA</em></div>
        </div>
        
        <div className="auth-tabs">
          <button className="auth-tab on">Acesso</button>
          <button className="auth-tab" onClick={() => alert('Cadastro via Waitlist na Landing Page.')}>Cadastro PME</button>
        </div>
        
        <div className="auth-card" id="card-login">
          <h3>Bem-vindo(a) de volta</h3>
          <div className="sub">Acesse sua conta para continuar</div>
          
          <button className="oauth-btn" onClick={() => alert('Em breve!')}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" alt="Google" /> Continuar com Google
          </button>
          
          <div className="divider"><hr/><span>ou acesso por e-mail</span><hr/></div>
          
          <form onSubmit={handleLogin}>
            <div className="field">
              <label>E-mail corporativo</label>
              <input 
                type="email" 
                placeholder="seu@email.com.br" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px' }} disabled={loading}>
              {loading ? 'Enviando...' : 'Acessar conta ↗'}
            </button>
          </form>

          <div className="text-center text-xs mt-4" style={{ color: 'var(--muted)', marginTop: '16px', fontSize: '11px' }}>
            <p>Ambiente de Dev: Use qualquer e-mail para testar, confira o Inbucket para pegar o link.</p>
          </div>
          
          <div className="jrn-link">
            Jornalista? <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = '/?pauta='; }}>Acesse pautas aprovadas</a>
          </div>
        </div>
      </div>
    </div>
  );
}

