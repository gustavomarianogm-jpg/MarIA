import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { trpc } from '@/utils/trpc';

export function DashboardPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  // Busca perfil do usuário
  const { data: userProfile, isLoading: isProfileLoading } = trpc.user.me.useQuery(undefined, {
    enabled: !!session,
  });

  // Busca pautas do usuário
  const { data: stories, isLoading: isStoriesLoading } = trpc.stories.list.useQuery(undefined, {
    enabled: !!session,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (!session) {
    return <div className="p-8 text-center">Requer Autenticação</div>;
  }

  const reviewCount = stories?.filter(s => s.status === 'review').length || 0;
  const approvedCount = stories?.filter(s => s.status === 'approved').length || 0;

  return (
    <div id="pg-dash" className="page on" style={{ display: 'block', width: '100%' }}>
      <div className="dash-layout">
        
        <div className="sidebar">
          <button className="sb-item on">
            <div className="sb-icon" style={{ background: 'var(--rosa-l)', color: 'var(--rosa)' }}>📊</div>Visão Geral
          </button>
          <button className="sb-item" onClick={() => alert('Em breve')}>
            <div className="sb-icon" style={{ background: '#E6F1FB', color: '#0C447C' }}>📋</div>Minhas Pautas
          </button>
          <button className="sb-item" onClick={handleLogout}>
            <div className="sb-icon" style={{ background: '#FCEBEB', color: '#A32D2D' }}>🚪</div>Sair
          </button>

          <div className="sb-cred">
            <div className="lbl">CRÉDITOS</div>
            <div className="val">{userProfile?.credits ?? '-'}</div>
            <div className="cred-bar"><div className="cred-bar-f" style={{ width: '100%' }}></div></div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>Plano Gratuito</div>
          </div>
          
          <div className="sb-user">
            <div className="av">{userProfile?.name?.charAt(0) || 'U'}</div>
            <div className="info">
              <div className="name">{userProfile?.name || 'Empreendedor'}</div>
              <div className="email">{session.user.email}</div>
            </div>
          </div>
        </div>

        <div className="dash-main">
          <div className="dash-panel on" id="dp-overview">
            
            <div className="dash-hdr">
              <h2>Olá, <span>{userProfile?.name?.split(' ')[0] || 'Empreendedor'}</span>! 👋</h2>
              <button className="btn-primary" style={{ fontSize: '13px', padding: '10px 20px' }} onClick={() => window.location.search = '?route=chat'}>+ Nova pauta</button>
            </div>
            
            <div className="game-banner" onClick={() => alert('Feature de recompensa em breve!')}>
              <span style={{ fontSize: '20px' }}>🏆</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dark)' }}>Sua pauta saiu na mídia?</div>
                <div style={{ fontSize: '12px', color: 'var(--gray)' }}>Cole o link e ganhe 1 crédito grátis!</div>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--lilas)', fontWeight: 600 }}>Reivindicar &rarr;</span>
            </div>
            
            <div className="metrics">
              <div className="met"><div className="mv">{stories?.length || 0}</div><div className="ml">Pautas criadas</div></div>
              <div className="met"><div className="mv">{reviewCount}</div><div className="ml">Em análise</div></div>
              <div className="met"><div className="mv">{approvedCount}</div><div className="ml">Matches</div></div>
            </div>
            
            <div className="stories-sec">
              <h3>Minhas pautas</h3>
              <div id="stories-list">
                {isStoriesLoading ? (
                  <div className="empty-st">Carregando pautas...</div>
                ) : stories && stories.length > 0 ? (
                  stories.map(story => (
                    <div className="story-row" key={story.id}>
                      <div className="story-ic" style={{ background: 'var(--rosa-l)', color: 'var(--rosa)' }}>📄</div>
                      <div style={{ flex: 1 }}>
                        <div className="story-title">{story.title}</div>
                        <div className="story-meta">
                          <span>{new Date(story.created_at).toLocaleDateString('pt-BR')}</span>
                          {story.status === 'review' && <span className="badge b-s">Em curadoria</span>}
                          {story.status === 'approved' && <span className="badge b-a">Aprovado</span>}
                          {story.status === 'draft' && <span className="badge b-d">Rascunho</span>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-st">
                    Nenhuma pauta gerada ainda.<br/>
                    <a href="#" style={{ color: 'var(--rosa)', fontWeight: 600 }} onClick={(e) => { e.preventDefault(); window.location.search = '?route=chat'; }}>Criar minha primeira pauta</a>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
