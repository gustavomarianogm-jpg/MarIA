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

```
MarIA/
├── index.html              # Frontend SPA (HTML + CSS + JS)
├── public/
│   └── assets/             # Imagens e assets estáticos
│       └── maria-photo.jpg
├── api/                    # Vercel Serverless Functions
│   ├── auth.js             # Autenticação server-side (cria sessão)
│   ├── chat.js             # Proxy para Anthropic Claude API
│   ├── state.js            # Persistência de estado em nuvem
│   └── waitlist.js         # CRUD da waitlist via Supabase
├── supabase/
│   └── schema.sql          # Schema do banco de dados (3 tabelas)
└── vercel.json             # Configuração de deploy
```

**Stack:**
- **Frontend:** HTML, CSS e JavaScript vanilla (sem framework)
- **Backend:** Vercel Serverless Functions (Node.js)
- **IA:** Anthropic Claude (claude-sonnet-4-6)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Deploy:** Vercel

## 🚀 Setup Local

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Vercel CLI](https://vercel.com/cli)
- Conta no [Supabase](https://supabase.com/)
- API Key da [Anthropic](https://console.anthropic.com/)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/MarIA.git
   cd MarIA
   ```

2. Crie o arquivo `.env` com as variáveis necessárias:
   ```env
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_KEY=sua-service-role-key
   ANTHROPIC_API_KEY=sua-api-key
   ADMIN_EMAIL=admin@maria.com.br
   ADMIN_PASSWORD=uma-senha-segura
   ALLOWED_ORIGIN=http://localhost:3000
   ```

3. Execute o schema no Supabase:
   - Acesse o [SQL Editor](https://supabase.com/dashboard/project/_/sql) do seu projeto
   - Cole e execute o conteúdo de `supabase/schema.sql`

4. Inicie o servidor de desenvolvimento:
   ```bash
   vercel dev
   ```

5. Acesse [http://localhost:3000](http://localhost:3000)

## 📦 Deploy

O projeto está configurado para deploy automático na Vercel:

```bash
vercel --prod
```

Certifique-se de configurar as variáveis de ambiente no painel da Vercel:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `ANTHROPIC_API_KEY`
- `ADMIN_EMAIL` (ex: `admin@maria.com.br`)
- `ADMIN_PASSWORD` (senha segura para o admin)
- `ALLOWED_ORIGIN` (ex: `https://mariapress.com.br`)

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|---|---|---|
| `SUPABASE_URL` | URL do projeto Supabase | ✅ |
| `SUPABASE_SERVICE_KEY` | Chave service_role do Supabase (secreta) | ✅ |
| `ANTHROPIC_API_KEY` | API key da Anthropic para o Claude | ✅ |
| `ADMIN_EMAIL` | E-mail do administrador (default: `admin@maria.com.br`) | ✅ |
| `ADMIN_PASSWORD` | Senha do administrador (autenticação server-side) | ✅ |
| `ALLOWED_ORIGIN` | Domínio permitido para CORS (default: `https://mariapress.com.br`) | ❌ |

> ⚠️ **Nunca commite o arquivo `.env`** — ele contém chaves secretas.

## 🗃️ Banco de Dados

O schema está em `supabase/schema.sql` e contém 3 tabelas:

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
- Sincronização automática via `/api/state`

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Feito com ❤️ em Goiás 🇧🇷
