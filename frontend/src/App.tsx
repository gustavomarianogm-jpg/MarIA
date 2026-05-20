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
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API_URL || 'http://localhost:4000/trpc',
          headers() {
            if (session?.access_token) {
              return { Authorization: `Bearer ${session.access_token}` };
            }
            return {};
          },
        }),
      ],
    }),
  );

  const [currentRoute, setCurrentRoute] = useState<'landing' | 'home' | 'dash' | 'chat' | 'admin' | 'journalist-signup' | 'story'>('landing');
  const [publicStoryId, setPublicStoryId] = useState<string | null>(null);

  // Check URL for public story route on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const storyId = params.get('pauta');
    if (storyId) {
      setPublicStoryId(storyId);
      setCurrentRoute('story');
    }
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className={`min-h-screen ${currentRoute === 'landing' ? '' : 'bg-slate-50 flex flex-col items-center'}`}>
          
          {/* Navegação Rápida (Oculta na Landing Page) */}
          {currentRoute !== 'landing' && currentRoute !== 'story' && currentRoute !== 'journalist-signup' && (
            <nav id="nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px', height: '60px', gap: '8px' }}>
              <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="nav-icon" style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '17px', fontWeight: 700 }}>&#8734;</div>
                <div className="nav-brand" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)' }}>Mar<em style={{ fontStyle: 'normal', background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IA</em></div>
              </div>
              <div className="nav-links" style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                <button className={`nav-btn ${currentRoute === 'landing' ? 'active' : ''}`} onClick={() => setCurrentRoute('landing')}>Início</button>
                <button className={`nav-btn ${currentRoute === 'dash' ? 'active' : ''}`} onClick={() => setCurrentRoute('dash')}>Dashboard</button>
                <button className={`nav-btn ${currentRoute === 'chat' ? 'active' : ''}`} onClick={() => setCurrentRoute('chat')}>Chat MarIA</button>
                {session && <button className={`nav-btn ${currentRoute === 'admin' ? 'active' : ''}`} onClick={() => setCurrentRoute('admin')} style={{ color: '#854F0B', background: 'rgba(239,159,39,0.08)' }}>⚙ Admin</button>}
              </div>
              <button className="ham" id="ham-btn" aria-label="Menu" style={{ display: 'none' }}>
                <span></span><span></span><span></span>
              </button>
              {session && (
                <div id="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--gray)', marginLeft: '8px' }}>
                  <div className="nav-av">U</div>
                  <div id="nav-cred">Conta</div>
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
            session ? <ChatPage /> : <AuthPage onLogin={() => {}} />
          )}

          {currentRoute === 'admin' && (
            session ? <AdminPage /> : <AuthPage onLogin={() => {}} />
          )}

          {currentRoute === 'journalist-signup' && <JournalistSignupPage onBack={() => setCurrentRoute('landing')} />}

          {currentRoute === 'story' && publicStoryId && <StoryPublicPage storyId={publicStoryId} />}

        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
