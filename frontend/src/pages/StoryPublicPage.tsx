import React, { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';

interface StoryPublicPageProps {
  storyId: string;
}

export function StoryPublicPage({ storyId }: StoryPublicPageProps) {
  const storyQuery = trpc.stories.getPublic.useQuery({ storyId });
  const [journalistEmail, setJournalistEmail] = useState('');
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const acceptMutation = trpc.journalist.acceptMatch.useMutation();

  const handleAccept = async () => {
    if (!journalistEmail.trim()) {
      alert('Informe seu e-mail profissional.');
      return;
    }
    try {
      await acceptMutation.mutateAsync({ storyId, email: journalistEmail.trim().toLowerCase() });
      setSubmitted(true);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  if (storyQuery.isLoading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen"
        style={{ background: 'linear-gradient(160deg,#1A0A2E,#2D1B69)' }}>
        <div className="text-white text-lg font-semibold animate-pulse">Carregando pauta...</div>
      </div>
    );
  }

  if (storyQuery.isError || !storyQuery.data) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center min-h-screen gap-4"
        style={{ background: 'linear-gradient(160deg,#1A0A2E,#2D1B69)' }}>
        <div style={{ fontSize: '56px' }}>🔒</div>
        <h2 className="text-2xl font-bold text-white">Pauta não encontrada</h2>
        <p className="text-white/60 text-center max-w-md">
          Esta pauta pode não existir ou ainda está em processo de curadoria.
        </p>
      </div>
    );
  }

  const story = storyQuery.data;

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF9' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#1A0A2E,#2D1B69)',
        padding: '32px 24px 48px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(233,30,140,0.25)', color: '#F4C0D1', fontSize: '11px',
          fontWeight: '700', padding: '5px 14px', borderRadius: '20px',
          border: '1px solid rgba(233,30,140,0.4)', marginBottom: '16px'
        }}>
          📰 RELEASE VIA MARIA
        </div>
        <h1 style={{ color: 'white', fontSize: 'clamp(22px,4vw,36px)', fontWeight: '800', lineHeight: '1.3', maxWidth: '700px', margin: '0 auto' }}>
          {story.title}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '12px' }}>
          Publicado via MarIA — A 1ª Assessora de Imprensa Virtual do Brasil
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '720px', margin: '-24px auto 0', padding: '0 20px 60px', position: 'relative' }}>
        <div style={{
          background: 'white', borderRadius: '16px', padding: '40px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #EEE'
        }}>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '15px', color: '#333' }}>
            {story.content}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: '32px', background: 'white', borderRadius: '16px',
          padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid #EEE', textAlign: 'center'
        }}>
          {submitted ? (
            <>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1A0A2E', marginBottom: '8px' }}>
                Interesse registrado com sucesso!
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                O empreendedor será notificado do seu interesse. Obrigado!
              </p>
            </>
          ) : !showInterestForm ? (
            <>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1A0A2E', marginBottom: '8px' }}>
                Interessado nesta pauta?
              </h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Se quiser entrevistar a fonte ou cobrir esta história, clique abaixo.
              </p>
              <Button
                onClick={() => setShowInterestForm(true)}
                className="font-semibold text-white px-8 py-6 text-base"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '12px' }}
              >
                🎤 Quero entrevistar a fonte
              </Button>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A0A2E', marginBottom: '16px' }}>
                Confirme seu e-mail profissional
              </h3>
              <input
                type="email"
                value={journalistEmail}
                onChange={e => setJournalistEmail(e.target.value)}
                placeholder="seu@veiculo.com.br"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '10px',
                  border: '1px solid #DDD', fontSize: '15px', marginBottom: '16px',
                  outline: 'none'
                }}
              />
              <Button
                onClick={handleAccept}
                disabled={acceptMutation.isPending}
                className="w-full font-semibold text-white py-6 text-base"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '12px' }}
              >
                {acceptMutation.isPending ? 'Registrando...' : '✅ Confirmar interesse'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
