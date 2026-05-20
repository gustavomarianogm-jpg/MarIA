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
          {currentRoute !== 'landing' && (
            <nav className="w-full bg-white border-b border-slate-200 p-4 flex gap-4 justify-center shadow-sm">
              <button onClick={() => setCurrentRoute('home')} className={`font-semibold ${currentRoute === 'home' ? 'text-primary' : 'text-muted-foreground'}`}>Inicial / Waitlist</button>
              <button onClick={() => setCurrentRoute('dash')} className={`font-semibold ${currentRoute === 'dash' ? 'text-primary' : 'text-muted-foreground'}`}>Dashboard</button>
              <button onClick={() => setCurrentRoute('chat')} className={`font-semibold ${currentRoute === 'chat' ? 'text-primary' : 'text-muted-foreground'}`}>Chat MarIA</button>
              {session && <button onClick={() => setCurrentRoute('admin')} className={`font-semibold ${currentRoute === 'admin' ? 'text-primary' : 'text-muted-foreground'}`}>⚙️ Admin</button>}
            </nav>
          )}

          {currentRoute === 'landing' && <LandingPage onJoinWaitlist={(segment) => {
            if (segment === 'Jornalista') {
              setCurrentRoute('journalist-signup');
            } else {
              setCurrentRoute('home');
            }
          }} />}

          {currentRoute === 'home' && <WaitlistPage />}
          
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
