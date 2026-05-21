import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './utils/trpc';
import { supabase } from './utils/supabase';
import { WaitlistPage } from './pages/WaitlistPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { AdminPage } from './pages/AdminPage';
import { LandingPage } from './pages/LandingPage';
import { JournalistSignupPage } from './pages/JournalistSignupPage';
import { StoryPublicPage } from './pages/StoryPublicPage';
import { TermsPage, PrivacyPage, HelpPage, ContactPage } from './pages/StaticPages';
import './index.css';

function App() {
  const [session, setSession] = useState<any>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    let trpcUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/trpc';
    if (trpcUrl && !trpcUrl.endsWith('/trpc')) {
      trpcUrl = trpcUrl.replace(/\/+$/, '') + '/trpc';
    }
    
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: trpcUrl,
          headers() {
            return session ? { Authorization: `Bearer ${session.access_token}` } : {};
          },
        }),
      ],
    });
  });

  const [currentRoute, setCurrentRoute] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('route') || 'landing';
  });

  const publicStoryId = new URLSearchParams(window.location.search).get('storyId');
  const isCongressMode = new URLSearchParams(window.location.search).get('congresso') === 'true';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('route') !== currentRoute) {
      params.set('route', currentRoute);
      if (isCongressMode) params.set('congresso', 'true');
      window.history.pushState(null, '', `?${params.toString()}`);
      window.scrollTo(0, 0);
    }
  }, [currentRoute, isCongressMode]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          
          {/* Global Navbar (Hidden on Landing, Story, Journalist Signup, Static Pages and Congress Mode) */}
          {!['landing', 'story', 'journalist-signup', 'terms', 'privacy', 'help', 'contact'].includes(currentRoute) && !isCongressMode && (
            <nav id="nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'white', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px', height: '64px' }}>
              <div className="nav-logo" onClick={() => setCurrentRoute('landing')} style={{ cursor: 'pointer', flexShrink: 0 }}>
                <div className="nav-icon" style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '17px', fontWeight: 700 }}>&#8734;</div>
                <div className="nav-brand" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)', whiteSpace: 'nowrap' }}>Mar<em style={{ fontStyle: 'normal', background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IA</em></div>
              </div>
              <div className="nav-links" style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                <button className={`nav-btn ${currentRoute === 'landing' ? 'active' : ''}`} onClick={() => setCurrentRoute('landing')}>Início</button>
                {session ? (
                  <>
                    <button className={`nav-btn ${currentRoute === 'dash' ? 'active' : ''}`} onClick={() => setCurrentRoute('dash')}>Dashboard</button>
                    <button className={`nav-btn ${currentRoute === 'chat' ? 'active' : ''}`} onClick={() => setCurrentRoute('chat')}>Chat MarIA</button>
                    <button className={`nav-btn ${currentRoute === 'admin' ? 'active' : ''}`} onClick={() => setCurrentRoute('admin')} style={{ color: '#854F0B', background: 'rgba(239,159,39,0.08)' }}>⚙ Admin</button>
                  </>
                ) : (
                  <button className={`nav-btn ${['dash', 'chat'].includes(currentRoute) ? 'active' : ''}`} onClick={() => setCurrentRoute('dash')}>Entrar</button>
                )}
              </div>
              <button className="ham" id="ham-btn" aria-label="Menu" style={{ display: 'none' }}>
                <span></span><span></span><span></span>
              </button>
              {session && (
                <div id="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--gray)', marginLeft: '8px' }}>
                  <div className="nav-av" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{session.user.email?.[0].toUpperCase() || 'U'}</div>
                  <div id="nav-cred" onClick={() => setCurrentRoute('dash')} style={{ cursor: 'pointer', flexShrink: 0 }}>Conta</div>
                </div>
              )}
            </nav>
          )}

          {currentRoute === 'landing' && <LandingPage 
            onJoinWaitlist={(segment) => {
              if (segment === 'Jornalista') {
                setCurrentRoute('journalist-signup');
              } else {
                setCurrentRoute('dash');
              }
            }}
            onNavigate={(route) => setCurrentRoute(route as any)}
          />}
          
          {currentRoute === 'dash' && (
            session ? <DashboardPage /> : <AuthPage onLogin={() => {}} />
          )}

          {currentRoute === 'chat' && (
            <ChatPage session={session} onNavigate={(route) => setCurrentRoute(route as any)} />
          )}

          {currentRoute === 'admin' && (
            session ? <AdminPage /> : <AuthPage onLogin={() => {}} />
          )}

          {currentRoute === 'journalist-signup' && <JournalistSignupPage onBack={() => setCurrentRoute('landing')} />}

          {currentRoute === 'story' && publicStoryId && <StoryPublicPage storyId={publicStoryId} />}

          {/* Static Pages */}
          {currentRoute === 'terms' && <TermsPage onNavigate={(route) => setCurrentRoute(route as any)} />}
          {currentRoute === 'privacy' && <PrivacyPage onNavigate={(route) => setCurrentRoute(route as any)} />}
          {currentRoute === 'help' && <HelpPage onNavigate={(route) => setCurrentRoute(route as any)} />}
          {currentRoute === 'contact' && <ContactPage onNavigate={(route) => setCurrentRoute(route as any)} />}

        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
