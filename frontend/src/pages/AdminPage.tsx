import React, { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReleaseMarkdown } from '@/components/ReleaseMarkdown';

type Tab = 'curadoria' | 'jornalistas';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('curadoria');
  const [statusFilter, setStatusFilter] = useState<string>('review');
  const [selectedStory, setSelectedStory] = useState<unknown>(null);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // ═══ Jornalistas State ═══
  const [showAddJournalist, setShowAddJournalist] = useState(false);
  const [jName, setJName] = useState('');
  const [jEmail, setJEmail] = useState('');
  const [jOutlet, setJOutlet] = useState('');
  const [jBeat, setJBeat] = useState('');
  const [jCity, setJCity] = useState('');
  const [jState, setJState] = useState('');
  const [jTags, setJTags] = useState('');

  // ═══ Queries ═══
  const storiesQuery = trpc.admin.listStories.useQuery({ status: statusFilter });
  const journalistsQuery = trpc.admin.listJournalists.useQuery(undefined, { enabled: activeTab === 'jornalistas' });

  const approveMutation = trpc.admin.approveStory.useMutation({
    onSuccess: () => { storiesQuery.refetch(); setSelectedStory(null); }
  });
  const rejectMutation = trpc.admin.rejectStory.useMutation({
    onSuccess: () => { storiesQuery.refetch(); setSelectedStory(null); setShowRejectModal(false); setRejectFeedback(''); }
  });
  const editMutation = trpc.admin.editStory.useMutation({
    onSuccess: () => { storiesQuery.refetch(); setEditMode(false); }
  });
  const createJournalistMutation = trpc.admin.createJournalist.useMutation({
    onSuccess: () => { journalistsQuery.refetch(); setShowAddJournalist(false); resetJForm(); }
  });
  const deleteJournalistMutation = trpc.admin.deleteJournalist.useMutation({
    onSuccess: () => journalistsQuery.refetch()
  });
  const matchmakingRunMutation = trpc.matchmaking.run.useMutation();

  const resetJForm = () => { setJName(''); setJEmail(''); setJOutlet(''); setJBeat(''); setJCity(''); setJState(''); setJTags(''); };

  const handleApprove = async (storyId: string) => {
    await approveMutation.mutateAsync({ storyId });
    // Dispara matchmaking após aprovar
    try {
      const result = await matchmakingRunMutation.mutateAsync({ storyId });
      alert(`Pauta aprovada! ✅ ${result.matches} match(es) gerado(s).${result.top3 ? '\nTop 3: ' + result.top3.join(', ') : ''}`);
    } catch {
      alert('Pauta aprovada! (Matchmaking falhou — sem jornalistas compatíveis)');
    }
  };

  // ═══════════════════════════════════════════
  // RENDER: Modal de Release Detalhado
  // ═══════════════════════════════════════════
  if (selectedStory) {
    return (
      <div className="flex-1 w-full max-w-5xl mx-auto p-6">
        <Button variant="ghost" onClick={() => { setSelectedStory(null); setEditMode(false); }} className="mb-4">
          ← Voltar ao Painel
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{selectedStory.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Cliente: {(selectedStory as unknown as { users?: { name?: string } }).users?.name || 'Desconhecido'} • {new Date(selectedStory.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <Badge variant={selectedStory.status === 'review' ? 'secondary' : 'default'}>
              {selectedStory.status}
            </Badge>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {editMode ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Conteúdo do Release</Label>
                  <textarea
                    className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => editMutation.mutate({ storyId: selectedStory.id, title: editTitle, content: editContent })}>
                    Salvar Edição
                  </Button>
                  <Button variant="outline" onClick={() => setEditMode(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <ReleaseMarkdown content={selectedStory.content} variant="release" />
            )}
          </CardContent>

          {selectedStory.status === 'review' && !editMode && (
            <>
              <Separator />
              <div className="p-6 flex gap-3 flex-wrap">
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(selectedStory.id)}
                  disabled={approveMutation.isPending || matchmakingRunMutation.isPending}>
                  {approveMutation.isPending ? 'Aprovando...' : '✅ Aprovar e Fazer Matching'}
                </Button>
                <Button variant="destructive" onClick={() => setShowRejectModal(true)}>
                  ❌ Rejeitar
                </Button>
                <Button variant="outline" onClick={() => { setEditMode(true); setEditTitle(selectedStory.title); setEditContent(selectedStory.content); }}>
                  ✏️ Editar
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Modal Rejeição */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Rejeitar Pauta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Feedback para o cliente:</Label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Explique o motivo da rejeição..."
                  value={rejectFeedback}
                  onChange={e => setRejectFeedback(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button variant="destructive" disabled={rejectFeedback.length < 5 || rejectMutation.isPending}
                    onClick={() => rejectMutation.mutate({ storyId: selectedStory.id, feedback: rejectFeedback })}>
                    Confirmar Rejeição
                  </Button>
                  <Button variant="outline" onClick={() => setShowRejectModal(false)}>Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // RENDER: Painel Principal
  // ═══════════════════════════════════════════
  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-black text-slate-900 mb-6">Painel de Administração</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        <button onClick={() => setActiveTab('curadoria')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${activeTab === 'curadoria' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
          📋 Curadoria
        </button>
        <button onClick={() => setActiveTab('jornalistas')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${activeTab === 'jornalistas' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
          📰 Jornalistas
        </button>
      </div>

      {/* ═══ TAB: CURADORIA ═══ */}
      {activeTab === 'curadoria' && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pautas em Revisão</CardTitle>
            <div className="flex gap-2">
              {['review', 'approved', 'rejected', 'sent'].map(s => (
                <Button key={s} variant={statusFilter === s ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter(s)}>
                  {s === 'review' ? '🟡 Review' : s === 'approved' ? '🟢 Aprovadas' : s === 'rejected' ? '🔴 Rejeitadas' : '📤 Enviadas'}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {storiesQuery.isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Carregando...</p>
            ) : storiesQuery.data && storiesQuery.data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storiesQuery.data.map((story: unknown) => (
                    <TableRow key={story.id}>
                      <TableCell className="font-medium max-w-xs truncate">{story.title}</TableCell>
                      <TableCell>{story.users?.name || '-'}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(story.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {(story.tags || []).map((tag: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => setSelectedStory(story)}>
                          Ver detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-lg">
                <p className="text-muted-foreground">Nenhuma pauta com status "{statusFilter}".</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ═══ TAB: JORNALISTAS ═══ */}
      {activeTab === 'jornalistas' && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Base de Jornalistas</CardTitle>
            <Button onClick={() => setShowAddJournalist(!showAddJournalist)}>
              {showAddJournalist ? 'Cancelar' : '+ Novo Jornalista'}
            </Button>
          </CardHeader>
          <CardContent>
            {/* Formulário de Adição */}
            {showAddJournalist && (
              <div className="mb-6 p-4 border rounded-lg bg-slate-50 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Nome</Label>
                    <Input placeholder="Ex: João Silva" value={jName} onChange={e => setJName(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>E-mail</Label>
                    <Input type="email" placeholder="joao@g1.com.br" value={jEmail} onChange={e => setJEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Veículo</Label>
                    <Input placeholder="G1, Folha, O Popular..." value={jOutlet} onChange={e => setJOutlet(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Editoria (beat)</Label>
                    <Input placeholder="Tecnologia, Economia..." value={jBeat} onChange={e => setJBeat(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Cidade</Label>
                    <Input placeholder="São Paulo" value={jCity} onChange={e => setJCity(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Estado</Label>
                    <Input placeholder="SP" value={jState} onChange={e => setJState(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Tags (separadas por vírgula)</Label>
                  <Input placeholder="tecnologia, startup, inovação, negócios" value={jTags} onChange={e => setJTags(e.target.value)} />
                </div>
                <Button onClick={() => createJournalistMutation.mutate({
                  name: jName, email: jEmail, outlet: jOutlet, beat: jBeat || undefined,
                  city: jCity || undefined, state: jState || undefined,
                  tags: jTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
                })} disabled={!jName || !jEmail || !jOutlet || createJournalistMutation.isPending}>
                  {createJournalistMutation.isPending ? 'Salvando...' : 'Cadastrar Jornalista'}
                </Button>
              </div>
            )}

            {/* Tabela de Jornalistas */}
            {journalistsQuery.isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Carregando...</p>
            ) : journalistsQuery.data && journalistsQuery.data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Tags/Editorias</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journalistsQuery.data.map((j: unknown) => (
                    <TableRow key={j.id}>
                      <TableCell className="font-medium">{j.name}</TableCell>
                      <TableCell className="text-muted-foreground">{j.email}</TableCell>
                      <TableCell>{j.outlet || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {(j.tags || []).map((tag: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="destructive"
                          onClick={() => { if (confirm(`Remover ${j.name}?`)) deleteJournalistMutation.mutate({ journalistId: j.id }); }}>
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-lg">
                <p className="text-muted-foreground">Nenhum jornalista cadastrado.</p>
                <Button variant="link" onClick={() => setShowAddJournalist(true)}>Cadastrar o primeiro</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
