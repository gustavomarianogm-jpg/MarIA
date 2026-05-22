# MarIA — Assessora de Imprensa Virtual

> A 1ª Assessora de Imprensa Virtual do Brasil 🇧🇷

A MarIA usa inteligência artificial para ajudar PMEs, startups e empreendedores a transformar suas histórias em pautas jornalísticas profissionais — sem precisar de uma assessoria tradicional.

## ✨ Funcionalidades

- **Chat com IA** — A MarIA entrevista o usuário como uma jornalista experiente
- **Geração de Release** — Release profissional gerado automaticamente via Claude (Anthropic)
- **Waitlist** — Sistema de inscrição com persistência no Supabase
- **Dashboard** — Painel de controle para gerenciar pautas e créditos
- **Curadoria Admin** — Painel interno para revisão humana de pautas
- **Feed de Jornalistas** — Matchmaking entre pautas e jornalistas

## 🏗️ Arquitetura

O projeto adota uma arquitetura de monorepo estruturada para rodar localmente com servidores Node dedicados e em produção via Vercel Serverless.

```text
MarIA/
├── api/                    # Ponto de entrada Serverless da Vercel (exporta o Express)
├── frontend/               # Aplicação Frontend em React + Vite + TypeScript
├── backend/                # API Backend em Node.js (Express + tRPC + TypeScript)
├── database/               # Scripts e configurações do Banco de Dados
├── supabase/               # Configuração e Schema do Supabase
└── vercel.json             # Regras de rewrites e functions para o deploy
```

**Stack:**
- **Frontend:** React 19, Vite, Tailwind CSS 4, TypeScript
- **Backend:** Node.js 20.x, Express, tRPC, TypeScript
- **IA:** Anthropic Claude (claude-sonnet-4-5)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Deploy:** Vercel

## 🚀 Setup Local

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20 LTS
- Conta no [Supabase](https://supabase.com/)
- API Key da [Anthropic](https://console.anthropic.com/)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/gustavomarianogm-jpg/MarIA.git
   cd MarIA
   ```

2. Crie o arquivo `.env` na raiz (ou nas subpastas, conforme configurado) com as variáveis necessárias:
   ```env
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_KEY=sua-service-role-key
   ANTHROPIC_API_KEY=sua-api-key
   ALLOWED_ORIGIN=http://localhost:3000
   ```

3. Instale todas as dependências do monorepo de uma só vez:
   ```bash
   npm run install:all
   ```

4. Execute o schema no Supabase:
   - Acesse o [SQL Editor](https://supabase.com/dashboard/project/_/sql) do seu projeto
   - Cole e execute o conteúdo de `supabase/schema.sql`

5. Inicie os servidores de desenvolvimento (Frontend + Backend simultaneamente):
   ```bash
   npm run dev
   ```

6. Acesse [http://localhost:5173](http://localhost:5173) (ou a porta padrão que o Vite subir). O backend estará escutando em [http://localhost:4000/trpc](http://localhost:4000/trpc).

## 📦 Deploy

O projeto está configurado para deploy automático na Vercel:

```bash
vercel --prod
```

Certifique-se de configurar as variáveis de ambiente no painel da Vercel:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `ANTHROPIC_API_KEY`
- `ALLOWED_ORIGIN` (ex: `https://mar-ia-mhjz.vercel.app`)

A Vercel construirá o `frontend` estático através do Vite e converterá automaticamente a API Express em Serverless Functions mapeadas pelo `/api/index.ts`.

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|---|---|---|
| `SUPABASE_URL` | URL do projeto Supabase | ✅ |
| `SUPABASE_SERVICE_KEY` | Chave service_role do Supabase (secreta) | ✅ |
| `ANTHROPIC_API_KEY` | API key da Anthropic para o Claude | ✅ |
| `ADMIN_EMAIL` | E-mail do administrador (default: `admin@maria.com.br`) | ✅ |
| `ADMIN_PASSWORD` | Senha do administrador (autenticação server-side) | ✅ |
| `ALLOWED_ORIGIN` | Domínio permitido para CORS (default: Vercel Preview URL) | ❌ |

> ⚠️ **Nunca faça commit do arquivo `.env`** — ele contém chaves secretas. O repositório já está configurado com `.gitignore` para protegê-lo.

## 🗃️ Banco de Dados

O schema está em `supabase/schema.sql` e contém 3 tabelas principais:

### `waitlist`
- Campos: id (UUID), name, email (unique), segment, status, created_at
- Índices otimizados para busca por email e ordenação por data
- Row Level Security habilitado

### `sessions`
- Campos: token (UUID, PK), user_email, user_data (JSONB), created_at
- Gerencia sessões de autenticação server-side
- Tokens são validados em endpoints protegidos (DELETE, state)

### `app_state`
- Campos: user_email (PK), state (JSONB), updated_at
- Persiste créditos, pautas, histórico de chat e curadoria em nuvem
- Sincronização automática via API tRPC

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Feito com ❤️ em Goiás 🇧🇷
