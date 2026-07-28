# MarIA — Verificação da Auditoria Técnica v1.0

**Documento de conferência.** Cada afirmação do relatório _"MarIA — Auditoria Técnica
Completa (v1.0)"_ foi testada contra o código real do repositório e contra o CSS
efetivamente compilado pelo Vite.

|                        |                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| **Conferido em**       | 28/07/2026                                                                                  |
| **Commit base**        | `971c21a` (`main`)                                                                          |
| **Branch de trabalho** | `claude/blissful-shannon-l85Sw`                                                             |
| **Método**             | leitura do código + inspeção do bundle `dist/assets/main-*.css` gerado por `npx vite build` |

---

## 1. Sumário executivo

A auditoria acertou o diagnóstico de **UX, acessibilidade e consistência de design**,
mas **errou a premissa central**.

> A auditoria afirma: _"A raiz de ≈80% dos problemas visuais é uma única causa: a
> diferença de paradigma entre Tailwind v3 e Tailwind v4"_, com **"impacto visual
> estimado: 60-70% do design desaparece"**.

**Isso não procede.** A migração para Tailwind v4 **já estava feita** antes da
auditoria. O bloco `@theme` existe, os tokens são emitidos, as utilities são
geradas com os valores corretos e as fontes carregam. Verificado no CSS compilado —
não por inspeção do fonte, mas do artefato de build (evidências na §3.1).

Consequência prática: **a seção 4 do relatório — apontada como bloqueante de todo o
resto — não exigia nenhuma ação.** Os itens marcados como "CRÍTICO" no checklist da
auditoria que dependiam dela já estavam satisfeitos.

### Placar da conferência

| Veredicto               | Itens | O que significa                                               |
| ----------------------- | ----: | ------------------------------------------------------------- |
| ✅ **Procede**          |    14 | Problema real, confirmado no código. Corrigido ou no backlog. |
| ⚠️ **Procede em parte** |     6 | A premissa é imprecisa, mas há um problema adjacente real.    |
| ❌ **Não procede**      |     9 | Afirmação falsa — o código já estava correto.                 |
| 🔎 **Não previsto**     |     5 | Bugs reais que a auditoria **não** identificou.               |

O achado mais grave do conjunto **não está na auditoria**: os dois CTAs finais da
landing page eram links mortos (§4.1).

---

## 2. Como ler os veredictos

Cada item cita a evidência. Onde há comando, ele é reproduzível a partir de
`frontend/` após `npm install && npx vite build`.

---

## 3. Veredicto item a item

### 3.1 Seção 4 — "Tailwind v4 vs HTML de referência (v3)"

#### ❌ 4.1/4.2 — "`@theme` ausente; `bg-ink`, `text-paper`, `text-rose`… não são geradas"

**Não procede.** O bloco existe em `frontend/src/index.css:16-71` e as utilities
saem no bundle com os valores corretos da paleta:

```
.bg-ink{background-color:#0f0a1a}
.text-paper{color:#faf6f0}
.text-rose{color:#e91e8c}
.bg-mustard{background-color:#f5b700}
.text-coral{color:#ff6b35}
.border-ink{border-color:#0f0a1a}
```

A tabela da auditoria previa "fundo transparente / classe não gerada" para cada
uma delas. Todas existem.

#### ❌ "`bg-ink/60` — transparência não funciona sem token"

**Não procede.** O modificador de opacidade funciona:

```
.text-ink\/60{color:#0f0a1a99}
.text-ink\/75{color:#0f0a1abf}
.bg-rose\/5{background-color:#e91e8c0d}
```

#### ❌ "`font-display` cai para fonte do sistema; JetBrains Mono não carregada"

**Não procede.** As famílias resolvem corretamente:

```
.font-display{font-family:Fraunces,serif}
.font-mono{font-family:JetBrains Mono,Roboto Mono,monospace}
```

#### ❌ 4.4 — "O `index.html` DEVE conter preconnect + Google Fonts. Sem isso todo o design colapsa"

**Não procede.** Já estava em `frontend/index.html:9-11` (e em `chat.html:9-11`).
Há inclusive **redundância**: as mesmas fontes são carregadas uma segunda vez via
`@import url(...)` em `index.css:1`. Não quebra nada, mas é uma requisição
desnecessária — ver backlog B-07.

#### ⚠️ Nota técnica que a auditoria não levantou: `@theme inline`

O projeto usa `@theme inline`, não `@theme`. Isso importava verificar, porque
`Global.css` consome as variáveis diretamente:

```css
body {
  background: var(--color-paper);
  color: var(--color-ink);
}
```

Se `inline` suprimisse a emissão das custom properties, o `body` ficaria sem
fundo. **Verificado: as variáveis são emitidas normalmente no `:root`.**

```
--color-ink:#0f0a1a;--color-paper:#faf6f0;--color-rose:#e91e8c;…
```

Sem ação necessária.

---

### 3.2 Seção 5 — Landing page

#### ⚠️ 5.1 — "Sombras hard precisam de `shadow-[6px_6px_0_theme(colors.ink)]`"

**Procede em parte, e a correção sugerida está errada.** A sintaxe
`theme(colors.ink)` é de Tailwind v3; em v4 o equivalente seria
`shadow-[6px_6px_0_var(--color-ink)]`.

Mas o ponto é discutível: hoje as sombras vêm de classes CSS (`.card-news`,
`.btn-primary`) e de `style` inline — **e funcionam**. Não havia bug.

**Aplicado mesmo assim** o utilitário sugerido, por higiene (`index.css`):
`.shadow-hard`, `.shadow-hard-lg`, `.shadow-hard-rose`, `.shadow-hard-rose-lg`.

#### ⚠️ 5.1 — "`.marker` colide com o variant nativo do Tailwind"

**Procede em parte.** A colisão de nome é real e vale renomear por higiene, mas
ela **não causa comportamento imprevisível**: `marker` como variant gera o seletor
`.marker\:*::marker`, que não conflita com a classe `.marker`.

**Aplicado:** `.text-highlight` como nome canônico, `.marker` mantido como alias
para não quebrar os dois usos existentes (`LandingPage.tsx:147` e `:629`).

#### ✅ 5.1 — "`.grain::before` exige `position: relative` no pai"

**Procede.** A classe `.grain` não declarava `position: relative` — dependia de
cada consumidor lembrar de aplicá-la. Em `ChatPage.tsx` o `.grain` estava sem
`relative`.

**Corrigido:** `.grain { position: relative }` + `z-index: 0` no pseudo-elemento.

#### ✅ 5.1 — "Animações `.rise` precisam de `prefers-reduced-motion`"

**Procede, e é mais sério do que a auditoria descreve.** `.rise` parte de
`opacity: 0`. Para quem tem _reduce motion_ ativado no sistema, se a animação for
suprimida sem restaurar a opacidade, **a seção fica permanentemente invisível**.

**Corrigido** exatamente como a auditoria propõe: bloco `@media (prefers-reduced-motion: no-preference)`.

#### ❌ 5.3 — "A landing mostra dois planos; o paywall mostra um. Inconsistência crítica"

**Não procede.** A landing tem **um** plano ("Plano Beta MarIA",
`LandingPage.tsx:1096-1232`), sem preço exposto, com CTA "Testar a MarIA →".
O paywall tem **um** plano ("Plano MarIA · R$ 297/mês").

A auditoria descreve o HTML de referência, não o código. Há uma diferença de
_posicionamento_ (beta sem preço vs. R$ 297/mês), mas não a contradição de
dois-planos-vs-um que o relatório aponta. **Decisão de produto, registrada em B-05.**

#### ❌ 5.3 — "O stamp 'MAIS ESCOLHIDO'…"

**Não procede.** O stamp no código diz **"VERSÃO BETA"** (`LandingPage.tsx:1105-1114`).

#### ❌ 5.4 — "Verificar se `group-open:rotate-45` funciona em v4"

**Não procede — funciona.** No bundle:

```
group-open\:rotate-45:is(:where(.group):is([open],:popover-open,:open) *){rotate:45deg}
```

#### 🔎 5.5 — Marquee: a auditoria previu a classe do bug, mas não o encontrou

A auditoria alerta genericamente: _"se o componente React for renderizado sem o
conteúdo duplicado, o marquee vai pular"_. **O bug existia** — e passou
despercebido porque a duplicação estava lá, só que **incompleta**.

Ver §4.2. **Corrigido.**

#### ✅ 5.6 — "Data da top bar está hardcoded"

**Procede.** `QUARTA · 20 · MAI · 2026`, fixo.

**Corrigido:** função `formatTopBarDate()`.

#### ❌ 5.1 — "`lg:grid-cols-[1.15fr_1fr]` — verificar parsing de valores arbitrários"

**Não procede** como descrito. O código usa `xl:`, não `lg:`. E os valores
arbitrários são gerados nativamente pelo Tailwind v4 — os "fallbacks manuais" em
`index.css:376-404` são **redundantes** (ver B-06).

---

### 3.3 Seção 6 — Chat

#### ✅ 6.1 — "`bubble-user` coral na landing vs. branca no chat"

**Procede — e o código estava do lado errado.** `ChatStyles.css` tinha a bolha do
usuário em `#FF6B35` (coral), divergindo do HTML de referência do chat.

**Corrigido** para o padrão do chat: branco, borda `ink`, `box-shadow: 3px 3px 0 #E91E8C`.

#### ✅ 6.1 — "`bubble-maria` border-radius com lógica invertida"

**Procede.** Estava `18px 18px 18px 4px` (cauda embaixo-esquerda); o correto para
a bolha da MarIA é `4px 18px 18px 18px` (cauda em cima-esquerda).

**Corrigido** — inclusive no `.chat-typing`, que tinha o mesmo desalinhamento e a
auditoria não mencionou.

#### ✅ 6.6 — "Modal `position: fixed` dentro de ancestral com `transform` perde o viewport"

**Procede como risco.** Hoje **não** se manifesta: nenhum ancestral do modal cria
containing block. Mas a fragilidade é real — qualquer `transform` adicionado a um
wrapper quebraria o modal silenciosamente.

**Não aplicado.** O Portal é a correção certa, mas mexe na estrutura do
componente; agendado em B-01 para ser feito junto com o focus trap.

#### ❌ 6.7 — "Substituir `h-screen` por `h-[100dvh]`"

**Não procede.** `ChatPage.tsx:239` já usava `height: '100dvh'`.

#### ✅ 6.7 — "Scrollbar sem suporte Firefox"

**Procede.** Não havia `scrollbar-width`/`scrollbar-color`.

**Corrigido.**

#### ⚠️ 6.2 — "Auto-scroll: `useEffect` precisa de `messages` na dependência"

**Procede em parte.** O `useEffect` (`ChatPage.tsx:60-63`) já tinha `[messages]`.
O que falta é o scroll **não** acompanhar o indicador de digitação
(`chatMutation.isPending` não está nas dependências) — a bolha de "digitando"
pode nascer fora da área visível.

**Não aplicado** — B-04.

#### ⚠️ 6.2 — "MediaRecorder precisa de cleanup no unmount"

**Procede.** Não há `useEffect` de limpeza: se o componente desmontar durante a
gravação, o stream do microfone continua ativo (indicador de gravação permanece
aceso no navegador).

**Não aplicado** — B-02. É uma correção de privacidade, prioridade alta.

#### ⚠️ 6.3 — "Input não fica `disabled` durante a resposta"

**Não procede.** `ChatPage.tsx:418` já tem
`disabled={chatMutation.isPending || generateReleaseMutation.isPending}`.

---

### 3.4 Seção 8 — Acessibilidade

#### ✅ Todas as lacunas de ARIA apontadas procedem

Confirmado: as bolhas não tinham `role`, o typing indicator não tinha `aria-live`,
o botão de microfone não tinha estado, o modal não tinha `role="dialog"`.

**Corrigido:** `role="log"` + `aria-live="polite"` na área de mensagens;
`role="status"` no typing; `aria-pressed` no microfone; `role="dialog"` +
`aria-modal` + `aria-labelledby` + `aria-hidden` no paywall.

**Não corrigido:** focus trap e devolução de foco ao fechar o modal — B-01.

#### ✅ 8.3 — "Paywall abre 2,6s após o release. Muito agressivo"

**Procede.** **Corrigido para 5s**, conforme recomendado.

#### ⚠️ 8.2 — "Verificar contraste de `text-ink/60` sobre `bg-paper`"

`#0F0A1A` a 60% sobre `#FAF6F0` ≈ **4,9:1** — passa em WCAG AA para texto normal
(≥4,5:1), reprova em AAA (≥7:1). Aceitável. **Sem ação.**

Atenção: `text-ink/50`, usado no rodapé do chat, fica ≈**4,0:1** e **reprova em
AA**. A auditoria não apontou. Ver B-08.

---

### 3.5 Seção 9 — Performance e SEO

#### ✅ "OG tags ausentes — sem preview no WhatsApp/LinkedIn"

**Procede.** Nenhuma meta `og:` existia.

**Corrigido em `index.html` e `chat.html`** (a auditoria não notou que há **dois**
entry points — `vite.config.ts:16-19`; aplicar só no `index.html` deixaria o chat
sem preview). Inclui `og:type`, `og:site_name`, `og:locale`, `og:image:width/height`,
`twitter:card` e `canonical`.

> ⚠️ **A tag aponta para `/og-image.jpg`, que ainda não existe.** Sem esse
> arquivo o preview continua sem imagem. Ver §5 — Pendências.

#### ✅ "SPA sem SSG prejudica SEO"

**Procede.** `vercel.json` reescreve tudo para `/index.html`; o HTML servido tem
`<div id="root">` vazio. Título e description são estáticos e iguais para todas as
rotas.

**Não aplicado** — mudança de arquitetura, fora do escopo desta rodada. B-03.

#### ❌ "Adicionar favicon (atualmente ausente)"

**Não procede.** `frontend/public/favicon.svg` existe e está referenciado.

#### ✅ "Adicionar `robots.txt` e `sitemap.xml`"

**Procede** — ambos ausentes em `public/`. B-09.

---

### 3.6 Seção 15 — "O que deve ser removido"

| Item da auditoria                       | Verificação                                                                                                                                                                                  |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Remover `cdn.tailwindcss.com`"         | ❌ Não existe no projeto. Já usa `@tailwindcss/vite`.                                                                                                                                        |
| "Remover `console.log` de debug"        | ❌ Zero ocorrências em `frontend/src`.                                                                                                                                                       |
| "Avaliar `convert.js` / `postbuild.js`" | ✅ Ambos existem na raiz. `postbuild.js` **está em uso** (`package.json` → `vercel-build`) — **não remover**. `convert.js` não é referenciado por nenhum script: candidato a remoção (B-10). |
| "Pasta `legacy/` fora do bundle"        | ⚠️ Existe, mas contém só um `package-lock.json`. Não entra no bundle. Sem ação.                                                                                                              |
| "Substituir `alert()` por UI real"      | ✅ **19 ocorrências** em 8 páginas — bem mais que os 2 casos citados. B-11.                                                                                                                  |

---

## 4. Achados não previstos pela auditoria

### 4.1 🔴 Os dois CTAs finais da landing eram links mortos

`LandingPage.tsx`, seção "CTA FINAL":

```jsx
<a href="#" className="btn-primary">Criar minha pauta grátis</a>
<a href="#" className="btn-ghost">Falar com a MarIA no WhatsApp</a>
```

Sem `onClick`, sem destino. O usuário que rolava a página inteira e clicava no CTA
principal **não ia a lugar nenhum**. É o pior bug do conjunto: perda direta de
conversão, no ponto de maior intenção.

**Corrigido.** O primeiro chama `onNavigate('chat')`; o segundo aponta para o
WhatsApp.

> ⚠️ O número em `WHATSAPP_URL` (`LandingPage.tsx:3`) é um **placeholder** —
> precisa ser substituído pelo número real. Ver §5.

**Ao todo, 15 dos 19 `href="#"` da landing não tinham handler.** Foram conectados:
Termos, Privacidade, LGPD, Contato, Cadastrar-se grátis e "Sou jornalista".
Os demais (Cases, Para ONGs, Blog, Sobre nós, Trabalhe conosco, Banco de fontes,
Selo Verified) apontam para páginas que ainda não existem — B-12.

### 4.2 🟠 O marquee não fechava o loop

A animação usa `translateX(-50%)`, o que exige que a segunda metade do track seja
**idêntica** à primeira. O JSX tinha os itens duplicados à mão — **10 originais,
mas só 8 na cópia**. "Valor Econômico" e "· Tribuna do Planalto ·" ficaram de fora.

Resultado: a esteira **saltava visivelmente** a cada volta — exatamente o sintoma
que a auditoria descreve como "parece amador".

**Corrigido** na raiz: os veículos viraram a constante `VEICULOS` e o track
renderiza `[...VEICULOS, ...VEICULOS]`. A classe do bug deixa de existir.

### 4.3 🟠 A âncora "Sou jornalista" do menu não levava a lugar nenhum

`href="#jornalista"` — não existe nenhum `id="jornalista"` na página. Os únicos
âncoras válidos são `cta-hero`, `como-funciona`, `prova` e `preco`.

**Corrigido** para a rota real `/journalist-signup`, que já existia em `App.tsx:222`.

### 4.4 🟡 `chat.html` é um segundo entry point esquecido

`vite.config.ts` declara dois entry points. Toda melhoria feita só no `index.html`
(OG tags, meta tags, scripts de analytics) **não chega ao chat**.

**Mitigado** nesta rodada com paridade de meta tags. Vale considerar um único
entry point ou um passo de build que sincronize os dois — B-13.

### 4.5 🟡 Fallbacks manuais de Tailwind são código morto

`index.css:376-404` redefine à mão `.max-w-*` e `.text-[clamp(...)]` "que faltam no
Tailwind v4". Eles **não faltam**. O bundle emite as duas versões:

```
.max-w-7xl{max-width:var(--container-7xl)}   ← Tailwind
.max-w-7xl{max-width:80rem}                  ← fallback manual
```

E `--container-7xl` **é** `80rem` — idênticos. São ~30 linhas de CSS redundante que
mascaram a fonte da verdade. Remoção segura, mas fora do escopo desta rodada —
B-06.

---

## 5. Pendências que exigem decisão sua

Duas correções ficaram **incompletas por dependerem de informação ou de recurso que
eu não tenho**. Ambas estão sinalizadas por comentário no código.

### 🔴 P-1 — `og-image.jpg` não existe

Adicionei as meta tags de preview social, mas elas apontam para
`https://mar-ia-mhjz.vercel.app/og-image.jpg`, **que ainda não foi criado**.
O ambiente desta sessão não tem nenhuma ferramenta de imagem (sem ImageMagick,
Pillow ou sharp), então não consegui gerar o arquivo.

**Enquanto o arquivo não existir, o preview no WhatsApp/LinkedIn continua sem
imagem** — o mesmo comportamento de antes, sem regressão, mas também sem o ganho.

**Para resolver:** criar `frontend/public/og-image.jpg`, **1200 × 630 px**.
Sugestão de composição, na identidade do produto: fundo `#FAF6F0` com grain,
manchete em Fraunces ("Sua história merece virar notícia"), selo tabloid em
`#F5B700` e a assinatura `MarIA.` com o ponto em `#E91E8C`.

_(`public/assets/maria-photo.jpg` não serve: é 526 × 640, retrato.)_

### 🟠 P-2 — Número de WhatsApp é placeholder

`LandingPage.tsx:3` → `const WHATSAPP_URL = 'https://wa.me/5562993350000';`

Chutei um número com DDD de Goiânia para destravar o botão. **Substitua pelo
número real** antes de publicar.

---

## 6. Backlog priorizado

### Alta

| #        | Item                                                                         | Origem              |
| -------- | ---------------------------------------------------------------------------- | ------------------- |
| **B-01** | Paywall: React Portal + focus trap + devolução de foco ao fechar             | auditoria 6.6 / 8.2 |
| **B-02** | `useEffect` de cleanup do `MediaRecorder` (microfone fica ligado no unmount) | auditoria 6.2       |
| **B-03** | SSG para a landing (`vite-plugin-ssg`) ou meta tags por rota                 | auditoria 7.2 / 9.2 |

### Média

| #        | Item                                                                                   | Origem                                 |
| -------- | -------------------------------------------------------------------------------------- | -------------------------------------- |
| **B-04** | Incluir `isPending` nas dependências do auto-scroll                                    | conferência                            |
| **B-05** | Alinhar posicionamento de preço: "Beta sem preço" (landing) vs. "R$ 297/mês" (paywall) | auditoria 5.3 — **decisão de produto** |
| **B-06** | Remover fallbacks manuais redundantes de `index.css`                                   | conferência §4.5                       |
| **B-08** | `text-ink/50` no rodapé do chat reprova em WCAG AA (≈4,0:1)                            | conferência                            |
| **B-11** | Substituir os 19 `alert()` por UI real                                                 | auditoria 15                           |
| **B-12** | 13 links de rodapé sem página de destino                                               | conferência §4.1                       |

### Baixa

| #        | Item                                                                             | Origem           |
| -------- | -------------------------------------------------------------------------------- | ---------------- |
| **B-07** | Fontes carregadas em duplicidade (`<link>` + `@import`)                          | conferência §3.1 |
| **B-09** | `robots.txt` + `sitemap.xml`                                                     | auditoria 10     |
| **B-10** | Avaliar remoção de `convert.js` (órfão) — **`postbuild.js` está em uso, manter** | auditoria 15     |
| **B-13** | Unificar ou sincronizar `index.html` e `chat.html`                               | conferência §4.4 |
| **B-14** | Banner LGPD/cookies                                                              | auditoria 10     |

---

## 7. O que foi alterado nesta rodada

6 arquivos. Build valida (`npx vite build` ✓). **Zero erros de TypeScript
introduzidos** — 62 antes, 62 depois, todos pré-existentes.

### `frontend/index.html` · `frontend/chat.html`

OG tags completas + Twitter Card + `canonical`, com paridade entre os dois entry points.

### `frontend/src/index.css`

- `.grain` recebe `position: relative`; pseudo-elemento com `z-index: 0`
- `.text-highlight` como nome canônico (`.marker` vira alias)
- `.news-rule-light` para réguas sobre fundo escuro
- `.stamp-sm` (variante compacta, −4°)
- `.masthead` — `line-height` `1.1` → `0.9`
- `.rise` sob `@media (prefers-reduced-motion: no-preference)`
- utilitários `.shadow-hard*`

### `frontend/src/pages/ChatStyles.css`

- **`.chat-bubble-user`**: coral → branco + borda `ink` + sombra rose
- **`.chat-bubble-maria`**: `border-radius` corrigido para `4px 18px 18px 18px`
- `.chat-typing` alinhado ao mesmo raio
- animação `bubbleIn` nas bolhas
- `.modal-overlay`: `display:none/flex` → `opacity` + `pointer-events` (permite transição)
- `.modal-card`: animação de entrada + `max-height: 92vh` com scroll
- `.chat-send-btn`: sombra hard rose
- scrollbar com suporte a Firefox
- `.chat-file-chip` na identidade mustard
- bloco `prefers-reduced-motion: reduce`

### `frontend/src/pages/ChatPage.tsx`

- paywall: 2600 ms → **5000 ms**
- `role="log"` + `aria-live="polite"` na área de mensagens
- `role="status"` + `aria-live` no typing indicator
- `role="dialog"` + `aria-modal` + `aria-labelledby` + `aria-hidden` no paywall
- `aria-pressed` no microfone; `aria-label` do cancelar mais descritivo
- chip de arquivo usa a classe CSS (elimina o inline cinza `#e2e8f0`)

### `frontend/src/pages/LandingPage.tsx`

- **CTAs finais conectados** (§4.1)
- **marquee seamless** via `[...VEICULOS, ...VEICULOS]` (§4.2)
- **âncora `#jornalista`** → rota real (§4.3)
- data da top bar dinâmica
- Termos / Privacidade / LGPD / Contato / Cadastrar-se grátis conectados

---

## 8. Conclusão

A auditoria é **útil como checklist de UX e acessibilidade** — essa parte dela se
sustenta quase inteira e gerou a maioria das correções aplicadas.

Mas o seu diagnóstico central está errado, e vale entender por quê: o relatório
declara na §2 que analisou _"estrutura, README, stack"_ do repositório e o deploy,
que retornou _"apenas metadados HTML shell"_. Ou seja — **inferiu o estado do CSS
sem ler o CSS**. Daí a conclusão de que "60-70% do design desaparece" num projeto
cujos tokens estavam configurados corretamente desde antes.

A lição prática: para o próximo ciclo, o critério de verdade é o **artefato de
build** (`dist/assets/main-*.css`), não o fonte nem a stack declarada.

Os bugs que de fato estavam derrubando a experiência — CTA final morto, marquee
saltando, menu com âncora quebrada — não aparecem em nenhuma seção do relatório.
Todos foram encontrados lendo o código.
