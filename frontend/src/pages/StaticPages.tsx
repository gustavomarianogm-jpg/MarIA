import React from 'react';

export function StaticLayout({ title, children, onNavigate }: { title: string, children: React.ReactNode, onNavigate: (r: string) => void }) {
  return (
    <div id="pg-home" className="page on" style={{ display: 'block', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="section" style={{ flex: 1, padding: '120px 24px 56px', maxWidth: '800px', margin: '0 auto', width: '100%', textAlign: 'left' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '32px', color: 'var(--dark)' }}>{title}</h1>
        <div style={{ lineHeight: '1.8', color: 'var(--gray)', fontSize: '16px' }}>
          {children}
        </div>
      </div>
      
      <footer style={{ marginTop: 'auto' }}>
        <div className="footer-inner">
          <div className="footer-logo" style={{ cursor: 'pointer' }} onClick={() => onNavigate('landing')}>
            <div className="nav-icon">&#8734;</div>
            <span style={{ color: 'white', fontSize: '18px', fontWeight: '800', marginLeft: '8px' }}>MarIA</span>
          </div>
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}>Termos de Uso</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }}>Privacidade</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('help'); }}>Ajuda</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}>Contato</a>
          </div>
        </div>
        <div className="footer-copy">© 2025 MarIA — A 1ª Assessora de Imprensa Virtual do Brasil · Feita com ❤️ em Goiás</div>
      </footer>
    </div>
  );
}

export function TermsPage({ onNavigate }: { onNavigate: (r: string) => void }) {
  return (
    <StaticLayout title="Termos de Uso" onNavigate={onNavigate}>
      <h2>1. Aceitação dos Termos</h2>
      <p>Ao acessar e usar a MarIA, você concorda em cumprir estes termos de uso.</p>
      <br/>
      <h2>2. Uso da Plataforma</h2>
      <p>A MarIA é uma assessora de imprensa virtual. O conteúdo gerado é baseado nas suas respostas e deve ser revisado por você.</p>
      <br/>
      <h2>3. Créditos e Pagamentos</h2>
      <p>A plataforma utiliza um sistema de créditos. Cada release gerado consome 1 crédito. Não há reembolso para créditos já utilizados.</p>
    </StaticLayout>
  );
}

export function PrivacyPage({ onNavigate }: { onNavigate: (r: string) => void }) {
  return (
    <StaticLayout title="Política de Privacidade" onNavigate={onNavigate}>
      <h2>1. Coleta de Dados</h2>
      <p>Coletamos seu nome, e-mail e as informações que você fornece durante as entrevistas com a IA para gerar as pautas.</p>
      <br/>
      <h2>2. Uso dos Dados</h2>
      <p>Seus dados são usados exclusivamente para gerar os releases e conectar sua história com jornalistas. Não vendemos seus dados para terceiros.</p>
      <br/>
      <h2>3. Segurança</h2>
      <p>Seus dados ficam armazenados de forma segura e protegida em nossos servidores, seguindo as diretrizes da LGPD (Lei Geral de Proteção de Dados).</p>
    </StaticLayout>
  );
}

export function HelpPage({ onNavigate }: { onNavigate: (r: string) => void }) {
  return (
    <StaticLayout title="Central de Ajuda" onNavigate={onNavigate}>
      <h2>Como gerar minha primeira pauta?</h2>
      <p>Basta acessar o seu Dashboard e clicar em "Nova pauta". A MarIA fará algumas perguntas no chat e gerará o seu release.</p>
      <br/>
      <h2>Como funcionam os créditos?</h2>
      <p>Você ganha 3 créditos ao se cadastrar. Você pode usá-los para gerar novos releases. Se precisar de mais, poderá comprar novos pacotes no Dashboard.</p>
      <br/>
      <h2>Como a MarIA envia para os jornalistas?</h2>
      <p>Nossa IA faz o cruzamento da sua pauta (Matchmaking) com a nossa base de dados e envia o release diretamente para os jornalistas interessados no seu segmento.</p>
    </StaticLayout>
  );
}

export function ContactPage({ onNavigate }: { onNavigate: (r: string) => void }) {
  return (
    <StaticLayout title="Entre em Contato" onNavigate={onNavigate}>
      <p>Tem alguma dúvida, sugestão ou encontrou algum problema?</p>
      <p>Envie um e-mail para a nossa equipe de suporte:</p>
      <div style={{ padding: '20px', background: 'rgba(233, 30, 140, 0.05)', borderRadius: '12px', marginTop: '16px', border: '1px solid rgba(233, 30, 140, 0.2)' }}>
        <strong style={{ color: 'var(--rosa)', fontSize: '18px' }}>suporte@maria-ai.com.br</strong>
      </div>
      <p style={{ marginTop: '24px' }}>Responderemos o mais rápido possível!</p>
    </StaticLayout>
  );
}
