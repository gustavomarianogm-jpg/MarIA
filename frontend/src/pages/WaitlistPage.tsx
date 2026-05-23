import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/utils/trpc';

export function WaitlistPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [segment, setSegment] = useState('');

  const addWaitlistMutation = trpc.waitlist.add.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addWaitlistMutation.mutateAsync({ name, email, segment });
      if (res.duplicate) {
        alert('E-mail já cadastrado na Waitlist!');
      } else {
        alert('Parabéns! Você entrou para a Waitlist!');
        setName('');
        setEmail('');
        setSegment('');
      }
} catch (err: unknown) {
  if (err instanceof Error) {
    alert(`Erro: ${err.message}`);
  } else {
    console.error(err);
  }
}
}

  return (
    <div className="flex-1 w-full flex flex-col items-center p-4 pt-12 md:pt-24 bg-background">
      <div className="max-w-md w-full mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          MarIA <span className="text-primary">2.0</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Sua Assessoria de Imprensa baseada em Inteligência Artificial.
        </p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-border/40">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Entre na Waitlist</CardTitle>
          <CardDescription>
            Inscreva-se hoje para receber acesso antecipado à plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="name">Nome completo</Label>
              <Input 
                id="name" 
                placeholder="Ex: Maria Silva" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="email">E-mail corporativo</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="maria@empresa.com.br" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="segment">Segmento de Mercado</Label>
              <select 
                id="segment"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={segment}
                onChange={e => setSegment(e.target.value)}
                required
              >
                <option value="" disabled>Selecione um segmento</option>
                <option value="Startup / Tech">Startup / Tech</option>
                <option value="PME / Empreendedor">PME / Empreendedor</option>
                <option value="Jornalista">Jornalista / Veículo</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            
            <Button 
              type="submit" 
              className="w-full font-semibold"
              disabled={addWaitlistMutation.isPending}
            >
              {addWaitlistMutation.isPending ? 'Enviando...' : 'Garantir meu lugar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col text-sm text-center text-muted-foreground">
          Vagas limitadas para o lote beta.
        </CardFooter>
      </Card>
    </div>
  );
}
