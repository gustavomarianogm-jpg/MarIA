import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { trpc } from '@/utils/trpc';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DashboardPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  // Busca perfil do usuário
  const { data: userProfile, isLoading: isProfileLoading } = trpc.user.me.useQuery(undefined, {
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
    return <div className="p-8 text-center">Requer Autenticação</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col p-6 bg-slate-50 max-w-6xl mx-auto">
      
      {/* Header do Dashboard */}
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 bg-primary">
            <AvatarFallback className="text-primary-foreground font-bold text-lg">
              {userProfile?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Olá, {userProfile?.name || 'Jornalista'}</h2>
            <p className="text-sm text-slate-500">{session.user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-500">Saldo atual</p>
            <p className="text-2xl font-black text-primary">{userProfile?.credits ?? '-'} <span className="text-base font-medium">créditos</span></p>
          </div>
          <Separator orientation="vertical" className="h-10 mx-2" />
          <Button variant="outline" onClick={handleLogout}>Sair</Button>
        </div>
      </header>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Painel Esquerdo - Ações */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Nova Pauta</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Gere um release completo através de uma entrevista guiada por IA.</p>
              <Button className="w-full bg-primary hover:bg-primary/90">
                ✨ Abrir Chat com a MarIA
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Mais Créditos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Adquira novos pacotes para gerar mais pautas automáticas.</p>
              <Button variant="secondary" className="w-full">
                Ver Planos (Stripe)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Painel Direito - Minhas Pautas */}
        <div className="md:col-span-2">
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle>Minhas Pautas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isStoriesLoading ? (
                <div className="py-8 text-center text-muted-foreground">Carregando pautas...</div>
              ) : stories && stories.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título do Release</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stories.map((story) => (
                      <TableRow key={story.id}>
                        <TableCell className="font-medium max-w-xs truncate">{story.title}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(story.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={story.status === 'review' ? 'secondary' : 'default'} className={story.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}>
                            {story.status === 'review' ? 'Em curadoria' : story.status === 'approved' ? 'Aprovado' : 'Rascunho'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
                  <p className="text-slate-500 mb-2">Nenhuma pauta gerada ainda.</p>
                  <Button variant="link" className="text-primary">Criar minha primeira pauta</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
    </div>
  );
}
