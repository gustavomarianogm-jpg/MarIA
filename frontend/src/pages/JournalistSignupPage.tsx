import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/utils/trpc';

interface JournalistSignupPageProps {
  onBack: () => void;
}

const EDITORIAS = [
  'Tecnologia', 'Negócios', 'Startup', 'Saúde', 'Educação',
  'Agronegócio', 'Política', 'Cultura', 'Esporte', 'Sustentabilidade',
  'Economia', 'Entretenimento', 'Ciência', 'Imobiliário', 'Gastronomia'
];

export function JournalistSignupPage({ onBack }: JournalistSignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [outlet, setOutlet] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [success, setSuccess] = useState(false);

  const registerMutation = trpc.waitlist.registerJournalist.useMutation();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : prev.length < 5
          ? [...prev, tag]
          : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTags.length === 0) {
      alert('Selecione pelo menos uma editoria de interesse.');
      return;
    }
    try {
      await registerMutation.mutateAsync({
        name, email, outlet, tags: selectedTags, city, state
      });
      setSuccess(true);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  if (success) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center p-4 min-h-screen"
        style={{ background: 'linear-gradient(160deg,#1A0A2E,#2D1B69)' }}>
        <Card className="w-full max-w-md shadow-2xl border-none bg-white/95">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div style={{ fontSize: '56px' }}>🎉</div>
            <h2 className="text-2xl font-bold text-gray-900">Cadastro realizado!</h2>
            <p className="text-muted-foreground">
              Você entrará na nossa base de jornalistas e receberá pautas relevantes
              para as suas editorias diretamente no seu e-mail. Sem spam, apenas conexões reais.
            </p>
            <Button onClick={onBack} variant="outline" className="mt-4">
              ← Voltar para a página inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center p-4 pt-12 md:pt-20 min-h-screen"
      style={{ background: 'linear-gradient(160deg,#1A0A2E,#2D1B69)' }}>

      <button
        onClick={onBack}
        className="mb-6 text-sm font-semibold text-white/60 hover:text-white transition-colors"
      >
        ← Voltar para a landing page
      </button>

      <Card className="w-full max-w-lg shadow-2xl border-none bg-white/95">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="mx-auto mb-2 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg,#9D4EDD,#E91E8C)' }}>
            📰
          </div>
          <CardTitle className="text-2xl font-bold">Cadastro de Jornalista</CardTitle>
          <CardDescription>
            Receba pautas curadas e relevantes para suas editorias. Sem spam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="j-name">Nome completo *</Label>
                <Input id="j-name" placeholder="Ex: João Silva" required value={name}
                  onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="j-email">E-mail profissional *</Label>
                <Input id="j-email" type="email" placeholder="joao@veiculo.com.br" required value={email}
                  onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="j-outlet">Veículo de imprensa *</Label>
              <Input id="j-outlet" placeholder="Ex: Folha de Goiás, G1 Goiás..." required value={outlet}
                onChange={e => setOutlet(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="j-city">Cidade</Label>
                <Input id="j-city" placeholder="Ex: Goiânia" value={city}
                  onChange={e => setCity(e.target.value)} />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="j-state">Estado</Label>
                <Input id="j-state" placeholder="Ex: GO" value={state}
                  onChange={e => setState(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label>Editorias de interesse * <span className="text-xs text-muted-foreground">(máx. 5)</span></Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {EDITORIAS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
                    style={{
                      background: selectedTags.includes(tag)
                        ? 'linear-gradient(135deg,#E91E8C,#9D4EDD)'
                        : 'transparent',
                      color: selectedTags.includes(tag) ? 'white' : '#666',
                      borderColor: selectedTags.includes(tag) ? 'transparent' : '#ddd',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-semibold text-white py-6"
              style={{ background: 'linear-gradient(135deg,#9D4EDD,#E91E8C)' }}
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Cadastrando...' : '📰 Finalizar cadastro de jornalista'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Seus dados ficam seguros. Sem spam. LGPD compliant.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
