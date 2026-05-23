import React from 'react';

export function LandingPageRaw({
  onNavigate,
}: {
  session?: unknown;
  onNavigate: (route: string) => void;
}) {
  return (
    <div className="landing-body flex flex-col items-center justify-center min-h-screen bg-paper text-ink w-full">
      <div className="text-center p-8 max-w-lg">
        <h1 className="display text-4xl mb-4 text-ink">MarIA – Landing Page</h1>
        <p className="text-lg mb-6 text-ink/80">
          Sua história merece ser vista. Experimente a primeira pauta grátis.
        </p>
        <button
          className="btn-primary"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('chat');
          }}
        >
          Testar grátis →
        </button>
      </div>
    </div>
  );
}
