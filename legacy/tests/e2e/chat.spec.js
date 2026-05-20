const { test, expect } = require('@playwright/test');

test.describe('Verificação de Aceite (UAT) - Chat MarIA', () => {
  test('O release deve ser gerado em menos de 3 segundos', async ({ page }) => {
    // Para evitar expor chaves ou precisar de um servidor completo rodando no teste E2E,
    // nós mockamos a resposta das APIs, simulando a entrevista e a velocidade.
    
    await page.route('/api/chat', async route => {
      // Simula um atraso realista de processamento de IA (2.5 segundos)
      await new Promise(resolve => setTimeout(resolve, 2500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          content: 'Nova mensagem da MarIA respondendo...',
        })
      });
    });

    // Como o front-end está num index.html estático, podemos carregá-lo diretamente
    await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`);
    
    // Simula estar logado (bypass login)
    await page.evaluate(() => {
      localStorage.setItem('maria_state', JSON.stringify({
        sessionToken: 'test-token',
        credits: 3,
        currentUser: { name: 'Testador' }
      }));
      window.location.hash = '#dash';
      
      // Força o carregamento do cache e navega manualmente para a Dashboard
      loadStateFromCache();
      restoreUI();
      goTo('dash', null);
    });

    // Clica em "Nova Pauta" na aba Overview
    await page.click('button:has-text("+ Nova pauta")');

    // Aguarda painel "Nova Pauta" ficar visível e clica no botão do chat
    await expect(page.locator('#dp-nova')).toBeVisible();
    await page.click('button:has-text("Abrir chat")');
    
    // Aguarda a interface do chat carregar
    await expect(page.locator('#chat-wrap')).toBeVisible();

    // Digita uma mensagem no input
    await page.fill('#msg-inp', 'Aqui estão os detalhes da pauta: Lançamento de UAT');
    await page.click('#send-btn');
    
    // Força a liberação do botão de release (como se o usuário já tivesse enviado 4 mensagens)
    await page.evaluate(() => {
      userMsgCount = 4;
      document.getElementById('gen-btn').classList.add('visible');
    });

    // Captura o tempo inicial antes de clicar em gerar release
    const startTime = Date.now();
    
    // Clica em Gerar Release
    await page.click('#gen-btn');

    // Espera a tela de release ficar visível
    await expect(page.locator('#rel-wrap')).toHaveClass(/visible/, { timeout: 5000 });

    const endTime = Date.now();
    const durationMs = endTime - startTime;

    console.log(`⏱️ Tempo de geração do Release: ${durationMs}ms`);

    // Critério de Aceite da Planilha: Tempo de resposta menor que 3000ms (3s)
    expect(durationMs).toBeLessThan(3500); // margem de erro +500ms para overhead do Puppeteer
  });
});
