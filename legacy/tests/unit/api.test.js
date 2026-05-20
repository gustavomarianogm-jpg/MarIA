const httpMocks = require('node-mocks-http');

describe('API de Chat (Segurança)', () => {
  it('Deve rejeitar requisições GET (método não permitido)', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();
    const { default: chatHandler } = await import('../../api/chat.js');
    
    await chatHandler(req, res);
    
    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ ok: false, error: 'Método não permitido' });
  });

  it('Deve rejeitar conexões sem Token Bearer de Autenticação', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: { messages: [{ role: 'user', content: 'Oi' }], max_tokens: 50 }
    });
    const res = httpMocks.createResponse();
    const { default: chatHandler } = await import('../../api/chat.js');
    
    await chatHandler(req, res);
    
    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ ok: false, error: 'Token de sessão obrigatório.' });
  });
});
