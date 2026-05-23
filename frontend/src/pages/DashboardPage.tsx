import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { trpc } from '@/utils/trpc';

export function DashboardPage() {
  const [session, setSession] = useState<unknown>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  // Busca perfil do usuário
  const { data: userProfile } = trpc.user.me.useQuery(undefined, {
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
    return <div className="p-8 text-center text-ink">Requer Autenticação</div>;
  }

  const reviewCount = stories?.filter(s => s.status === 'review').length || 0;
  const approvedCount = stories?.filter(s => s.status === 'approved').length || 0;

  return (
    <div className="min-h-screen bg-paper w-full flex text-ink font-sans">
      <div className="flex w-full max-w-7xl mx-auto p-4 md:p-6 gap-6 flex-col md:flex-row">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex flex-col shrink-0 gap-2">
          <button className="flex items-center gap-3 w-full p-3 rounded-xl font-semibold bg-white border border-rose text-rose shadow-sm transition-all text-sm text-left">
            <div className="w-8 h-8 rounded-lg bg-rose/10 flex items-center justify-center text-base" aria-hidden="true">📊</div>
            Visão Geral
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-xl font-medium text-slate-500 hover:bg-white hover:shadow-sm transition-all text-sm text-left" onClick={() => alert('Em breve')}>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-base" aria-hidden="true">📋</div>
            Minhas Pautas
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-xl font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all text-sm text-left" onClick={handleLogout}>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-base" aria-hidden="true">🚪</div>
            Sair
          </button>

          <div className="mt-auto pt-6 px-3">
            <div className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider">CRÉDITOS</div>
            <div className="text-2xl font-black text-ink mb-2">{userProfile?.credits ?? '-'}</div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden mb-1">
              <div className="h-full bg-gradient-to-r from-rose to-plum w-full"></div>
            </div>
            <div className="text-[11px] text-slate-500">Plano Gratuito</div>
          </div>
          
          <div className="mt-6 flex items-center gap-3 p-3 bg-white rounded-xl border border-border/40 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-rose/10 text-rose font-bold flex items-center justify-center shrink-0">
              {userProfile?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate text-ink">{userProfile?.name || 'Empreendedor'}</div>
              <div className="text-xs text-slate-500 truncate">{session.user.email}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-border/40 flex-1">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold tracking-tight">
                Olá, <span className="text-rose">{userProfile?.name?.split(' ')[0] || 'Empreendedor'}</span>! 👋
              </h2>
              <button 
                className="bg-gradient-to-r from-rose to-plum text-white font-bold py-2.5 px-6 rounded-xl text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                onClick={() => window.location.search = '?route=chat'}
              >
                + Nova pauta
              </button>
            </div>
            
            {/* Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-plum/20 bg-plum/5 cursor-pointer hover:bg-plum/10 transition-colors mb-8" onClick={() => alert('Feature de recompensa em breve!')}>
              <div className="text-2xl" aria-hidden="true">🏆</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-ink mb-1">Sua pauta saiu na mídia?</div>
                <div className="text-xs text-slate-600">Cole o link e ganhe 1 crédito grátis!</div>
              </div>
              <div className="text-xs font-semibold text-plum whitespace-nowrap">Reivindicar &rarr;</div>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="p-5 rounded-2xl bg-white border border-border/40 shadow-sm">
                <div className="text-3xl font-black text-ink mb-1">{stories?.length || 0}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pautas criadas</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-border/40 shadow-sm">
                <div className="text-3xl font-black text-amber-500 mb-1">{reviewCount}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Em análise</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-border/40 shadow-sm">
                <div className="text-3xl font-black text-emerald-500 mb-1">{approvedCount}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Matches</div>
              </div>
            </div>
            
            {/* Stories */}
            <div>
              <h3 className="text-lg font-bold mb-4">Minhas pautas</h3>
              <div className="flex flex-col gap-3">
                {isStoriesLoading ? (
                  <div className="text-center p-8 text-slate-500 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">Carregando pautas...</div>
                ) : stories && stories.length > 0 ? (
                  stories.map(story => (
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border/40 shadow-sm hover:border-plum/30 transition-colors" key={story.id}>
                      <div className="w-10 h-10 rounded-xl bg-rose/10 text-rose flex items-center justify-center shrink-0">📄</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate text-ink mb-1">{story.title}</div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-500">{new Date(story.created_at).toLocaleDateString('pt-BR')}</span>
                          {story.status === 'review' && <span className="px-2 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-700">Em curadoria</span>}
                          {story.status === 'approved' && <span className="px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-700">Aprovado</span>}
                          {story.status === 'draft' && <span className="px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600">Rascunho</span>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-3">
                    <div className="text-slate-500 text-sm">Nenhuma pauta gerada ainda.</div>
                    <a href="#" className="text-rose font-bold text-sm hover:underline" onClick={(e) => { e.preventDefault(); window.location.search = '?route=chat'; }}>Criar minha primeira pauta</a>
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

