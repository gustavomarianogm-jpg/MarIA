import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './utils/trpc';
import { supabase } from './utils/supabase';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { AdminPage } from './pages/AdminPage';
import { LandingPage } from './pages/LandingPage';
import { JournalistSignupPage } from './pages/JournalistSignupPage';
import { StoryPublicPage } from './pages/StoryPublicPage';
import {
  TermsPage,
  PrivacyPage,
  HelpPage,
  ContactPage,
} from './pages/StaticPages';

function AppContent() {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [queryClient] = useState(() => new QueryClient());
  
  const trpcClient = useMemo(() => {
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
  }, [session]);

  const publicStoryId = new URLSearchParams(location.search).get('storyId');
  const isCongressMode = new URLSearchParams(location.search).get('congresso') === 'true';

  const hideNavRoutes = ['/', '/chat', '/story', '/journalist-signup', '/terms', '/privacy', '/help', '/contact'];
  const showNav = !hideNavRoutes.includes(location.pathname) && !isCongressMode;

  const navigateTo = (route: string) => {
    navigate(route === 'landing' ? '/' : `/${route}`);
  };

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className={`min-h-screen flex flex-col font-sans ${['/', '/chat'].includes(location.pathname) ? 'bg-paper' : 'bg-slate-50'}`}>
          
          {showNav && (
            <nav
              id="nav"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: 'white',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                height: '64px',
              }}
            >
              <div
                className="nav-logo"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="nav-icon"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9px',
                    background: 'var(--grad)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '17px',
                    fontWeight: 700,
                  }}
                >
                  &#8734;
                </div>
                <div
                  className="nav-brand"
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: 'var(--dark)',
                  }}
                >
                  Mar
                  <em
                    style={{
                      fontStyle: 'normal',
                      background: 'var(--grad)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    IA
                  </em>
                </div>
              </div>
              <div
                className="nav-links"
                style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}
              >
                <button
                  className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
                  onClick={() => navigate('/')}
                >
                  Início
                </button>
                {session ? (
                  <>
                    <button
                      className={`nav-btn ${location.pathname === '/dash' ? 'active' : ''}`}
                      onClick={() => navigate('/dash')}
                    >
                      Dashboard
                    </button>
                    <button
                      className={`nav-btn ${location.pathname === '/chat' ? 'active' : ''}`}
                      onClick={() => navigate('/chat')}
                    >
                      Chat MarIA
                    </button>
                    <button
                      className={`nav-btn ${location.pathname === '/admin' ? 'active' : ''}`}
                      onClick={() => navigate('/admin')}
                      style={{
                        color: '#854F0B',
                        background: 'rgba(239,159,39,0.08)',
                      }}
                    >
                      ⚙ Admin
                    </button>
                  </>
                ) : (
                  <button
                    className={`nav-btn ${['/dash', '/chat'].includes(location.pathname) ? 'active' : ''}`}
                    onClick={() => navigate('/dash')}
                  >
                    Testar grátis
                  </button>
                )}
              </div>
              {session && (
                <div
                  id="nav-user"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: 'var(--gray)',
                    marginLeft: '8px',
                  }}
                >
                  <div
                    className="nav-av"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#eee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {session.user.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <div
                    id="nav-cred"
                    onClick={() => navigate('/dash')}
                    style={{ cursor: 'pointer' }}
                  >
                    Conta
                  </div>
                </div>
              )}
            </nav>
          )}

          <Routes>
            <Route path="/" element={<LandingPage onJoinWaitlist={(s) => navigate(s === 'Jornalista' ? '/journalist-signup' : '/dash')} onNavigate={navigateTo} />} />
            <Route path="/dash" element={session ? <DashboardPage /> : <AuthPage onLogin={() => {}} />} />
            <Route path="/chat" element={<ChatPage session={session} onNavigate={navigateTo} />} />
            <Route path="/admin" element={session ? <AdminPage /> : <AuthPage onLogin={() => {}} />} />
            <Route path="/journalist-signup" element={<JournalistSignupPage onBack={() => navigate('/')} />} />
            <Route path="/story" element={<StoryPublicPage storyId={publicStoryId || ''} />} />
            <Route path="/terms" element={<TermsPage onNavigate={navigateTo} />} />
            <Route path="/privacy" element={<PrivacyPage onNavigate={navigateTo} />} />
            <Route path="/help" element={<HelpPage onNavigate={navigateTo} />} />
            <Route path="/contact" element={<ContactPage onNavigate={navigateTo} />} />
          </Routes>
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
