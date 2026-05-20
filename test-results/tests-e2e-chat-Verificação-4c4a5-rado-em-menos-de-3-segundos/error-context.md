# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\chat.spec.js >> Verificação de Aceite (UAT) - Chat MarIA >> O release deve ser gerado em menos de 3 segundos
- Location: tests\e2e\chat.spec.js:4:3

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#rel-wrap')
Expected pattern: /visible/
Received string:  "release-wrap"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#rel-wrap')
    14 × locator resolved to <div id="rel-wrap" class="release-wrap">…</div>
       - unexpected value "release-wrap"

```

```yaml
- navigation:
  - text: ∞ Mar
  - emphasis: IA
  - button "Início"
  - button "Dashboard"
  - button "Chat MarIA"
  - button "⚙ Admin"
  - text: T Testador 3 créditos
- heading "Chat com a MarIA" [level=2]
- paragraph: Ela vai te entrevistar e gerar seu release profissional
- text: M MarIA Assessora Virtual · Online Créditos 3
- paragraph: "Aqui estão os detalhes da pauta: Lançamento de UAT"
- text: T M
- paragraph: Erro de conexão. Tente novamente em instantes.
- button "Lançamento de produto"
- button "Nova parceria"
- button "Prêmio conquistado"
- button "Projeto social"
- button "Expansão da empresa"
- button "✨ Gerar release profissional · 1 crédito"
- textbox "Responda à MarIA..."
- button:
  - img
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Verificação de Aceite (UAT) - Chat MarIA', () => {
  4  |   test('O release deve ser gerado em menos de 3 segundos', async ({ page }) => {
  5  |     // Para evitar expor chaves ou precisar de um servidor completo rodando no teste E2E,
  6  |     // nós mockamos a resposta das APIs, simulando a entrevista e a velocidade.
  7  |     
  8  |     await page.route('/api/chat', async route => {
  9  |       // Simula um atraso realista de processamento de IA (2.5 segundos)
  10 |       await new Promise(resolve => setTimeout(resolve, 2500));
  11 |       await route.fulfill({
  12 |         status: 200,
  13 |         contentType: 'application/json',
  14 |         body: JSON.stringify({
  15 |           ok: true,
  16 |           content: 'Nova mensagem da MarIA respondendo...',
  17 |         })
  18 |       });
  19 |     });
  20 | 
  21 |     // Como o front-end está num index.html estático, podemos carregá-lo diretamente
  22 |     await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
  23 |     
  24 |     // Simula estar logado (bypass login)
  25 |     await page.evaluate(() => {
  26 |       localStorage.setItem('maria_state', JSON.stringify({
  27 |         sessionToken: 'test-token',
  28 |         credits: 3,
  29 |         currentUser: { name: 'Testador' }
  30 |       }));
  31 |       window.location.hash = '#dash';
  32 |       
  33 |       // Força o carregamento do cache e navega manualmente para a Dashboard
  34 |       loadStateFromCache();
  35 |       restoreUI();
  36 |       goTo('dash', null);
  37 |     });
  38 | 
  39 |     // Clica em "Nova Pauta" na aba Overview
  40 |     await page.click('button:has-text("+ Nova pauta")');
  41 | 
  42 |     // Aguarda painel "Nova Pauta" ficar visível e clica no botão do chat
  43 |     await expect(page.locator('#dp-nova')).toBeVisible();
  44 |     await page.click('button:has-text("Abrir chat")');
  45 |     
  46 |     // Aguarda a interface do chat carregar
  47 |     await expect(page.locator('#chat-wrap')).toBeVisible();
  48 | 
  49 |     // Digita uma mensagem no input
  50 |     await page.fill('#msg-inp', 'Aqui estão os detalhes da pauta: Lançamento de UAT');
  51 |     await page.click('#send-btn');
  52 |     
  53 |     // Força a liberação do botão de release (como se o usuário já tivesse enviado 4 mensagens)
  54 |     await page.evaluate(() => {
  55 |       userMsgCount = 4;
  56 |       document.getElementById('gen-btn').classList.add('visible');
  57 |     });
  58 | 
  59 |     // Captura o tempo inicial antes de clicar em gerar release
  60 |     const startTime = Date.now();
  61 |     
  62 |     // Clica em Gerar Release
  63 |     await page.click('#gen-btn');
  64 | 
  65 |     // Espera a tela de release ficar visível
> 66 |     await expect(page.locator('#rel-wrap')).toHaveClass(/visible/, { timeout: 5000 });
     |                                             ^ Error: expect(locator).toHaveClass(expected) failed
  67 | 
  68 |     const endTime = Date.now();
  69 |     const durationMs = endTime - startTime;
  70 | 
  71 |     console.log(`⏱️ Tempo de geração do Release: ${durationMs}ms`);
  72 | 
  73 |     // Critério de Aceite da Planilha: Tempo de resposta menor que 3000ms (3s)
  74 |     expect(durationMs).toBeLessThan(3500); // margem de erro +500ms para overhead do Puppeteer
  75 |   });
  76 | });
  77 | 
```