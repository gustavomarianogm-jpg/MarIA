
import React, { useState } from 'react';
import '../Global.css';

interface LandingPageProps {
  onJoinWaitlist: (segment?: string) => void;
  onNavigate?: (route: string) => void;
}

const SEGMENTS = [
  { label: 'PME / Empreendedor', value: 'PME / Empreendedor' },
  { label: 'Startup', value: 'Startup' },
  { label: 'Jornalista', value: 'Jornalista' },
  { label: 'Investidor', value: 'Investidor' },
  { label: 'Agência de PR', value: 'Agência de PR' },
  { label: 'ONG / Social', value: 'ONG / Social' },
];

const FAQS = [
  { q: 'A MarIA garante que minha pauta será publicada?', a: 'Não garantimos publicação — isso depende da decisão editorial de cada veículo. O que garantimos é que sua história chegará aos jornalistas certos, formatada profissionalmente, aumentando em até 80% suas chances de virar notícia.' },
  { q: 'Como funcionam os créditos?', a: 'Cada crédito equivale a uma pauta completa (entrevista + release + curadoria + envio). Se a pauta for reprovada pela curadoria, o crédito é devolvido automaticamente.' },
  { q: 'Quanto tempo leva para minha pauta chegar nos jornalistas?', a: 'A entrevista leva 10 a 20 minutos. O release é gerado instantaneamente. A curadoria humana é concluída em até 48 horas úteis.' },
  { q: 'A MarIA funciona apenas para Goiás?', a: 'Nossa força atual é no Centro-Oeste, com conexões em Goiás. Mas nossa base cobre todo o Brasil. Histórias com relevância nacional chegam a veículos de todo o país.' },
  { q: 'Meus dados ficam seguros?', a: 'Sim. Todos os dados são criptografados e seguimos a LGPD. Suas informações nunca são compartilhadas sem autorização explícita.' },
];

export function LandingPage({ onJoinWaitlist, onNavigate }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState(-1);
  const [selectedSegment, setSelectedSegment] = useState('PME / Empreendedor');

  const nav = (route: string) => onNavigate?.(route);

  return (
    <div className="landing-page-wrapper">
        <nav id="nav">
    <div className="nav-logo">
      <div className="nav-icon">&#8734;</div>
      <div className="nav-brand">Mar<em>IA</em></div>
    </div>
    <div className="nav-links">
      <button className="nav-btn active" >Início</button>
      <button className="nav-btn" id="nav-login-btn" onClick={() => nav('dash')}>Entrar</button>
      <button className="nav-btn" id="nav-dash-btn"  style={{ display: 'none',  }}>Dashboard</button>
      <button className="nav-btn" onClick={() => nav('chat')}>Chat MarIA</button>
      <button className="nav-btn" id="nav-admin-btn" 
        style={{ color: '#854F0B', background: 'rgba(239,159,39,0.08)', display: 'none',  }}>⚙ Admin</button>
    </div>
    <button className="hamburger" id="ham-btn"  aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <div id="nav-user">
      <div className="nav-av" id="nav-av">U</div>
      <span id="nav-name"></span>
      <div id="nav-cred">3 créditos</div>
    </div>
  </nav>

  {/*  MENU MOBILE  */}
  <div className="mobile-menu" id="mobile-menu">
    <button className="mobile-btn" >🏠 Início</button>
    <button className="mobile-btn" id="mob-login-btn" onClick={() => nav('dash')}>🚪 Entrar / Cadastrar</button>
    <button className="mobile-btn" id="mob-dash-btn" style={{ display: 'none',  }} >📊 Dashboard</button>
    <button className="mobile-btn" onClick={() => nav('chat')}>💬 Chat MarIA</button>
    <button className="mobile-btn" id="mob-admin-btn" style={{ display: 'none', color: '#854F0B',  }} >⚙️
      Admin</button>
  </div>

  {/*  ══════════════════ HOME ══════════════════  */}
  <div id="pg-home" className="page on">

    <div className="hero">
      <div className="hero-badge">✨ A 1ª Assessora de Imprensa Virtual do Brasil</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', marginBottom: '8px',  }}>
        <div style={{ flex: '1', minWidth: '260px', maxWidth: '520px', textAlign: 'left',  }}>
          <h1 style={{ textAlign: 'left',  }}>Coloque sua empresa na imprensa. Sem agência. <span>Sem pagar R$ 2.500/mês.</span>
          </h1>
          <p style={{ textAlign: 'left',  }}>A MarIA te entrevista, escreve um release profissional e envia para os jornalistas
            certos. Você só fala — ela faz o resto.</p>
          <div className="hero-btns" style={{ justifyContent: 'flex-start',  }}>
            <button className="btn-primary" onClick={onJoinWaitlist}>Criar pauta grátis ✨</button>
          </div>
        </div>
        <div style={{ flexShrink: '0', textAlign: 'center',  }}>
          <div style={{ position: 'relative', display: 'inline-block',  }}>
            <div
              style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'linear-gradient(135deg,#E91E8C,#9D4EDD)', padding: '4px', boxShadow: '0 8px 32px rgba(233,30,140,0.35)',  }}>
              <img src="/assets/maria-photo.jpg" alt="MarIA"
                
                style={{ width: '192px', height: '192px', borderRadius: '50%', objectFit: 'cover', display: 'block',  }} />
            </div>
            <div
              style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',  }}>
              🎙️</div>
            <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: '700', color: 'var(--dark)',  }}>MarIA</div>
            <div style={{ fontSize: '11px', color: 'var(--gray)',  }}>Sua assessora de imprensa virtual</div>
          </div>
        </div>
      </div>
    </div>

    <div className="stats-section">
      <div className="stat-card">
        <div className="stat-value">19M</div>
        <div className="stat-label">PMEs no Brasil sem assessoria</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">3x</div>
        <div className="stat-label">+ publicações com release profissional</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">48h</div>
        <div className="stat-label">Da pauta à imprensa</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">100%</div>
        <div className="stat-label">Curadoria humana em cada pauta</div>
      </div>
    </div>

    {/*  PROVA SOCIAL  */}
    <div className="section" style={{ paddingTop: '0', paddingBottom: '32px', textAlign: 'center',  }}>
      <p
        style={{ fontSize: '13px', color: 'var(--gray)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px',  }}>
        Já publicamos pautas em:</p>
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', opacity: '0.6',  }}>
        <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--dark)',  }}>Folha de Goiás</div>
        <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--dark)',  }}>G1 Goiás</div>
        <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--dark)',  }}>Diário da Manhã</div>
      </div>
    </div>

    {/*  COMO FUNCIONA — 3 PASSOS  */}
    <div className="section" style={{ background: 'white', maxWidth: '100%', padding: '56px 0',  }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px',  }}>
        <div className="section-badge">COMO FUNCIONA</div>
        <h2>3 passos para sua história<br />chegar à imprensa</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">PASSO 01</div>
            <h3>Conte sua história em 10 minutos</h3>
            <p>Sem formulários chatos. A MarIA te entrevista pelo chat, como uma jornalista experiente, e extrai o
              melhor da sua história.</p>
          </div>
          <div className="step-card">
            <div className="step-number">PASSO 02</div>
            <h3>Receba um release pronto para imprensa</h3>
            <p>Em minutos você recebe um release jornalístico completo — título, lead, citações e dados — pronto para a
              imprensa.</p>
          </div>
          <div className="step-card">
            <div className="step-number">PASSO 03</div>
            <h3>Os jornalistas certos recebem sua pauta</h3>
            <p>Nossa IA identifica os jornalistas certos para a sua pauta. Sem spam, apenas conexões reais e
              qualificadas.</p>
          </div>
        </div>
      </div>
    </div>

    {/*  OBJEÇÕES / SEGURANÇA  */}
    <div className="section"
      style={{ background: '#FDFBFE', maxWidth: '100%', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '56px 0',  }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px',  }}>
        <h2 style={{ fontSize: 'clamp(20px,3vw,28px)', marginBottom: '24px', textAlign: 'center',  }}>Mas a MarIA é IA, será que
          funciona?</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px',  }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start',  }}>
            <div
              style={{ background: 'var(--rosa-l)', color: 'var(--rosa)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', fontWeight: 'bold',  }}>
              ✓</div>
            <p style={{ fontSize: '14px', color: 'var(--dark)', lineHeight: '1.6',  }}><strong>Curadoria humana em 100% das
                pautas.</strong> Nenhum release sai sem ser revisado por jornalista experiente.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start',  }}>
            <div
              style={{ background: 'var(--rosa-l)', color: 'var(--rosa)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', fontWeight: 'bold',  }}>
              ✓</div>
            <p style={{ fontSize: '14px', color: 'var(--dark)', lineHeight: '1.6',  }}><strong>Não é spam.</strong> Só jornalistas
              que cobrem a sua área recebem sua pauta.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start',  }}>
            <div
              style={{ background: 'var(--rosa-l)', color: 'var(--rosa)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', fontWeight: 'bold',  }}>
              ✓</div>
            <p style={{ fontSize: '14px', color: 'var(--dark)', lineHeight: '1.6',  }}><strong>Se a imprensa não publicar, a culpa
                não é sua</strong> — e a gente te ajuda a melhorar.</p>
          </div>
        </div>
      </div>
    </div>

    {/*  WAITLIST DESTAQUE  */}
    <div style={{ background: 'linear-gradient(160deg,#1A0A2E,#2D1B69)', padding: '0',  }}>
      <div
        style={{ background: 'linear-gradient(135deg,rgba(233,30,140,0.15),rgba(157,78,221,0.1))', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)',  }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '56px 24px', textAlign: 'center',  }}>

          <div
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(233,30,140,0.25)', color: '#F4C0D1', fontSize: '12px', fontWeight: '700', padding: '6px 18px', borderRadius: '20px', border: '1px solid rgba(233,30,140,0.4)', marginBottom: '20px', letterSpacing: '0.5px',  }}>
            🚀 ACESSO ANTECIPADO — VAGAS LIMITADAS
          </div>

          <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: '900', color: 'white', lineHeight: '1.25', marginBottom: '12px',  }}>
            Garanta seu acesso<br />gratuito antecipado
          </h2>
          <p
            style={{ color: 'rgba(255,255,255,0.72)', fontSize: '16px', lineHeight: '1.7', marginBottom: '28px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto',  }}>
            Inscreva-se agora e seja um dos primeiros a usar a MarIA. Os primeiros inscritos ganham <strong
              style={{ color: 'white',  }}>5 créditos bônus</strong> no lançamento.
          </p>

          <div style={{ marginBottom: '24px',  }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '7px',  }}>
              <span>Vagas para o acesso antecipado</span>
              <span id="prog-lbl" style={{ color: '#E91E8C', fontWeight: '700',  }}>247 / 500</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden',  }}>
              <div id="prog-bar"
                style={{ height: '8px', background: 'linear-gradient(90deg,#E91E8C,#9D4EDD)', borderRadius: '4px', width: '49%', transition: 'width .6s',  }}>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px',  }}>253 vagas restantes</div>
          </div>

          <div
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '20px', padding: '28px',  }}
            id="wl-form-card">
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: '600', marginBottom: '10px', textAlign: 'left',  }}>
              Quem é você?</div>
            <div className="seg-row" id="seg-row" style={{ marginBottom: '18px' }}>
              {SEGMENTS.map(s => (
                <button
                  key={s.value}
                  type="button"
                  className={`seg-chip${selectedSegment === s.value ? ' selected' : ''}`}
                  onClick={() => setSelectedSegment(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="wl-fields">
              <input className="wl-input" type="text" id="wl-name" placeholder="Seu nome completo" />
              <input className="wl-input" type="email" id="wl-email" placeholder="seu@email.com.br" />
            </div>
            <div className="err-msg" id="err-name">Por favor, informe seu nome.</div>
            <div className="err-msg" id="err-email">Informe um e-mail válido.</div>
            <div className="err-msg" id="err-dup">Este e-mail já está na lista.</div>
            <button
              className="wl-btn"
              id="wl-btn"
              onClick={() => onJoinWaitlist(selectedSegment)}
              style={{ marginTop: '14px', fontSize: '15px', padding: '15px',
                background: selectedSegment === 'Jornalista' ? 'linear-gradient(135deg,#9D4EDD,#7B2FBE)' : undefined
              }}
            >
              {selectedSegment === 'Jornalista'
                ? '📰 Cadastrar como Jornalista →'
                : '✓ Quero meu acesso antecipado'}
            </button>
            <p className="wl-privacy">Seus dados ficam seguros. Sem spam. LGPD compliant.</p>
          </div>

          <div className="confirm-box" id="confirm-box">
            <div className="confirm-icon">🎉</div>
            <h3>Cadastro realizado com sucesso!</h3>
            <div className="confirm-pos" id="confirm-pos">Posição #248</div>
            <p id="confirm-msg" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: '1.6', marginBottom: '18px',  }}>
              Em breve você receberá novidades sobre o lançamento da MarIA. Fique de olho no seu e-mail! 👀</p>
            <div className="share-row">
              <button className="share-btn" >📱 Compartilhar no WhatsApp</button>
            </div>
            <button className="add-btn" >Cadastrar outro e-mail</button>
          </div>

          <div className="recent-box" id="recent-box" style={{ marginTop: '16px',  }}>
            <div className="recent-hdr">
              <span>Inscrições recentes</span>
              <div className="live-dot">ao vivo</div>
            </div>
            <div id="recent-list"></div>
          </div>

        </div>
      </div>
    </div>
    {/*  /WAITLIST DESTAQUE  */}



    {/*  FAQ  */}
    <div className="section">
      <div className="section-badge">DÚVIDAS FREQUENTES</div>
      <h2>Perguntas Frequentes</h2>
      
      <div className="faq-c" id="faq-c">
        {FAQS.map((f, i) => (
          <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
            <div className="faq-q">
              <span>{f.q}</span>
              <div className={`faq-toggle ${openFaq === i ? 'open' : ''}`} id={`ft-${i}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            <div className={`faq-a ${openFaq === i ? 'on' : ''}`} id={`fa-${i}`}>
              {f.a}
            </div>
          </div>
        ))}
      </div>

    </div>

    {/*  CTA FINAL  */}
    <div className="cta-final">
      <h2>Teste grátis.</h2>
      <p>Sua primeira pauta sai em 48h. Sem cartão de crédito.</p>
      <button className="btn-primary" onClick={onJoinWaitlist}>Criar minha primeira pauta ✨</button>
    </div>

    <footer>
      <div className="footer-inner">
        <div className="footer-logo">
          <div className="nav-icon">&#8734;</div>
          <span style={{ color: 'white', fontSize: '18px', fontWeight: '800', marginLeft: '8px',  }}>MarIA</span>
        </div>
        <div className="footer-links">
          <a href="#">Termos de Uso</a>
          <a href="#">Privacidade</a>
          <a href="#">Ajuda</a>
          <a href="#">Contato</a>
        </div>
      </div>
      <div className="footer-copy">© 2025 MarIA — A 1ª Assessora de Imprensa Virtual do Brasil · Feita com ❤️ em Goiás</div>
    </footer>
  </div>

  {/*  ══════════════════ AUTH ══════════════════  */}
    </div>
  );
}
