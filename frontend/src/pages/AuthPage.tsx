import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AuthPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      alert('Link mágico enviado! Verifique seu e-mail.');
    } catch (err: any) {
      alert(`Erro no login: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Acesso</CardTitle>
          <CardDescription>Insira seu e-mail para receber um link mágico e entrar na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Receber Magic Link'}
            </Button>
            <div className="text-center text-xs text-muted-foreground mt-4">
              <p>Ambiente de Desenvolvimento: Use qualquer e-mail para testar, e confira o console do Supabase (Inbucket) para pegar o link.</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
