import React from 'react';

export function LandingPage({ onNavigate }: { session?: unknown, onNavigate: (r: string) => void }) {
  return (
    <div className="landing-body relative overflow-clip">
      

{/* =================== TOP BAR (estilo cabeçalho de jornal) =================== */}
<div className="bg-ink text-paper text-xs font-mono tracking-widest border-b border-paper/20" style={{ padding: '0.625rem 0' }}>
  <div className="container-seguro flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="pulse-dot"></span>
      <span className="opacity-80">EDIÇÃO Nº 001 · GOIÂNIA-GO · A 1ª ASSESSORIA QUE COBRA POR RESULTADO</span>
    </div>
    <div className="hidden md:block opacity-60">QUARTA · 20 · MAI · 2026</div>
  </div>
</div>

{/* =================== HEADER (MENU) =================== */}
<nav className="bg-paper/95 backdrop-blur-md border-b border-ink/10 sticky top-0 z-50 transition-all">
  <div className="container-seguro h-20 flex items-center justify-between">
    <a onClick={(e) => { e.preventDefault(); onNavigate('landing'); }} href="#" className="flex items-center gap-2 group">
      <div className="w-10 h-10 bg-ink text-paper flex items-center justify-center font-display font-bold text-xl rounded-full group-hover:bg-rose transition-colors">M</div>
      <span className="display text-2xl">MarIA<span className="text-rose">.</span></span>
    </a>

    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
      <a href="#como-funciona" className="hover:text-rose transition-colors">Como funciona</a>
      <a href="#prova" className="hover:text-rose transition-colors">Quem já saiu</a>
      <a href="#preco" className="hover:text-rose transition-colors">Preço</a>
      <button type="button" onClick={() => onNavigate('journalist-signup')} className="hover:text-rose transition-colors bg-transparent border-0 p-0 cursor-pointer font-inherit text-inherit">Sou jornalista</button>
    </div>

    <div className="flex items-center gap-3">
      <span className="hidden md:inline-flex text-sm font-medium opacity-50 cursor-not-allowed select-none" title="Em breve">Login em breve</span>
      <a href="#cta-hero" onClick={(e) => { e.preventDefault(); onNavigate('chat'); }} className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', boxShadow: '3px 3px 0 #E91E8C' }}>
        Testar Grátis →
      </a>
    </div>
  </div>
</nav>

{/* =================== HERO =================== */}
<section className="relative sec-hero grain pt-8 pb-12 lg:pt-12 lg:pb-20 overflow-hidden">
  <div className="container-seguro grid xl:grid-cols-[1.15fr_1fr] gap-16 items-center relative">

    {/* Coluna esquerda: manchete */}
    <div className="space-y-8">
      <div className="flex items-center gap-3 rise rise-1">
        <span className="tabloid">Exclusiva</span>
        <span className="font-mono text-xs text-ink/60">Caderno · NEGÓCIOS</span>
      </div>

      <h1 className="display text-[clamp(2.8rem,7vw,5.5rem)] rise rise-2">
        Sua história <br />
        <span className="display-italic text-rose">merece virar notícia</span> <br />
        — não mais um <br />
        <span className="marker">release esquecido</span> <br />
        na caixa de e-mail.
      </h1>

      <p className="text-xl md:text-2xl text-ink/80 leading-relaxed rise rise-2" style={{ marginTop: '3.5rem' }}>
        A MarIA é a primeira assessora de imprensa virtual do Brasil criada para transformar<br className="hidden md:block" />
        boas histórias em pautas jornalísticas, combinando inteligência artificial,<br className="hidden md:block" />
        curadoria humana e conexão com jornalistas reais. Sem burocracia.<br className="hidden md:block" />
        Sem disparo genérico. Com estratégia, curadoria e conexão real.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 rise rise-4" id="cta-hero" style={{ marginTop: '3.5rem' }}>
        <a onClick={(e) => { e.preventDefault(); onNavigate('chat'); }} href="#" className="btn-primary" style={{ padding: '1rem 1.75rem', fontSize: '1.05rem', boxShadow: '6px 6px 0 #E91E8C' }}>
          Criar minha 1ª pauta grátis
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
        <a href="#como-funciona" className="btn-ghost" style={{ padding: '1rem 1.75rem', fontSize: '1.05rem', backgroundColor: '#FAF6F0' }}>
          Como funciona
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm font-medium text-ink/70 rise rise-5" style={{ marginTop: '2.5rem' }}>
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-5 h-5 text-rose" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          <span className="font-medium">Sem cartão de crédito</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-5 h-5 text-rose" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          <span className="font-medium">Conexões qualificadas</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-5 h-5 text-rose" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          <span className="font-medium">Feito em Goiás 🇧🇷</span>
        </div>
      </div>
    </div>

    {/* Coluna direita: chat MarIA + selo recorte */}
    <div className="relative chat-overflow-fix">

      {/* Selo retrô */}
      <div className="absolute -top-6 -right-2 z-20 stamp">
        Como uma manchete · de verdade
      </div>

      {/* Card editorial */}
      <div className="card-news rounded-3xl raw-chat-box relative z-10 rise rise-3 flex flex-col justify-between">
        <div className="raw-chat-header-pad pt-2">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-ink text-paper flex items-center justify-center font-display font-bold raw-chat-icon">M</div>
              <div>
                <div className="font-semibold raw-chat-name">MarIA · online agora</div>
                <div className="text-ink/60 font-mono mt-1 uppercase raw-chat-role">Jornalista · 15+ anos de redação</div>
              </div>
            </div>
            <span className="pulse-dot raw-pulse-fix"></span>
          </div>
        </div>

        <div className="raw-space-y flex-1 flex flex-col justify-center px-2">
          <div className="bubble-maria" style={{ fontSize: '1rem', padding: '1rem 1.25rem', maxWidth: '100%' }}>
            Oi, Marcos! 👋 Vi que sua padaria<br/>
            completou 50 anos. Isso é OURO pra<br/>
            uma pauta. Vamos contar essa<br/>
            história?
          </div>
          <div className="bubble-user" style={{ fontSize: '1rem', padding: '1rem 1.25rem', maxWidth: '100%' }}>
            Sério? Achei que ninguém ia se<br/>
            importar com isso.
          </div>
          <div className="bubble-maria" style={{ fontSize: '1rem', padding: '1rem 1.25rem', maxWidth: '100%', lineHeight: '1.45' }}>
            Marcos, jornalista de pequeno negócio<br/>
            acorda procurando história assim.<br/>
            Tradição que sobreviveu pandemia +<br/>
            fermentação natural = manchete. Me<br/>
            conta: qual foi o momento mais difícil<br/>
            que vocês passaram?
          </div>
        </div>

        <div className="px-2 mt-8">
          <div className="raw-dashed-line"></div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-ink/60 raw-chat-footer-text">↓ release pronto em ~7 min</span>
            <span className="tabloid raw-chat-footer-btn">3.281 JÁ PUBLICARAM</span>
          </div>
        </div>
      </div>

      {/* Card de matéria publicada (atrás) */}
      <div className="card-news rounded-xl absolute -left-4 xl:-left-12 rise rise-4" style={{ transform: 'rotate(-4deg)', background: '#F5B700', zIndex: 30, width: '320px', padding: '1.75rem', bottom: '-5.5rem' }}>
        <div className="flex items-center gap-2 mb-3 text-xs font-mono">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/></svg>
          <span className="font-semibold text-[12px]">FOLHA · PEQUENOS NEGÓCIOS</span>
        </div>
        <p className="font-display text-lg font-semibold leading-tight">"Padaria de Goiânia preserva fermentação de 50 anos e dobra faturamento"</p>
        <div className="mt-4 text-xs font-mono text-ink/60">PUBLICADO HÁ 2 DIAS</div>
      </div>
    </div>
  </div>
</section>

{/* =================== FAIXA DE LOGOS / "JÁ SAÍRAM EM" =================== */}
<section className="bg-ink text-paper border-y-2 border-ink overflow-hidden" style={{ padding: '2.5rem 0' }}>
  <div className="container-seguro flex items-center justify-between" style={{ marginTop: '-1rem', marginBottom: '2.5rem' }}>
    <span className="font-mono text-xs tracking-widest opacity-70">MILHARES DE POSSÍVEIS</span>
    <span className="font-mono text-xs tracking-widest opacity-70">CONEXÕES JORNALÍSTICAS EM POTENCIAL</span>
  </div>
  <div className="marquee-track gap-16 items-center text-paper/85">
    <span className="display text-3xl opacity-80 whitespace-nowrap">Jornais Locais</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Podcasts ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Revistas de Nicho</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Emissoras de TV ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Portais de Notícias</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Blogs Especializados ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Rádios Locais</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Agências de Notícia ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Valor Econômico</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Tribuna do Planalto ·</span>
    {/* duplicado pra loop infinito */}
    <span className="display text-3xl opacity-80 whitespace-nowrap">Jornais Locais</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Podcasts ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Revistas de Nicho</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Emissoras de TV ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Portais de Notícias</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Blogs Especializados ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Rádios Locais</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Agências de Notícia ·</span>
  </div>
</section>

{/* =================== A DOR (problema/agitação) =================== */}
<section className="sec-dura grain relative">
  <div className="container-seguro-estreito">
    <div className="text-center mb-16">
      <span className="tabloid mb-5 inline-block">A real dura</span>
      <h2 className="masthead text-[clamp(2.2rem,5vw,4rem)] mt-4">
        Nem toda boa história chega até os <span className="display-italic text-coral">jornalistas certos</span>.
      </h2>
      <p className="text-lg text-ink/80 mt-4 max-w-2xl mx-auto">
        A MarIA nasceu para reduzir essa distância: organiza a informação, fortalece o gancho jornalístico e conecta histórias relevantes com profissionais que cobrem o tema.
      </p>
    </div>

    <div className="flex flex-col md:flex-row gap-8 justify-center">
      <div className="card-news rounded-xl p-6 flex-1 min-w-0">
        <div className="masthead text-5xl text-rose mb-3">300</div>
        <p className="font-semibold mb-2">e-mails por dia</p>
        <p className="text-sm text-ink/70">recebe um jornalista. 95% vão direto pra lixeira sem nem ser abertos.</p>
      </div>
      <div className="card-news rounded-xl p-6 flex-1 min-w-0">
        <div className="masthead text-5xl text-rose mb-3">R$ 3k</div>
        <p className="font-semibold mb-2">é o piso mensal</p>
        <p className="text-sm text-ink/70">de uma assessoria tradicional. Inacessível pra PME, MEI ou ONG.</p>
      </div>
      <div className="card-news rounded-xl p-6 flex-1 min-w-0">
        <div className="masthead text-5xl text-rose mb-3">IA</div>
        <p className="font-semibold mb-2">sozinha gera texto.</p>
        <p className="text-sm text-ink/70">A MarIA cria contexto, estratégia e conexão. A diferença está na curadoria jornalística e no direcionamento da pauta para quem realmente pode se interessar por ela.</p>
      </div>
    </div>

    <div className="mt-16 text-center">
      <p className="display text-2xl md:text-3xl max-w-3xl mx-auto leading-snug">
        A MarIA não vende release. Vende <span className="marker">a chance real da sua história sair</span> num veículo de credibilidade.
      </p>
    </div>
  </div>
</section>

{/* =================== COMO FUNCIONA =================== */}
<section id="como-funciona" className="sec-passos bg-ink text-paper relative overflow-hidden">

  {/* Decoração */}
  <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
    <svg width="200" height="200" viewBox="0 0 100 100" fill="none" stroke="#FAF6F0" strokeWidth="0.5">
      <circle cx="50" cy="50" r="45"/>
      <circle cx="50" cy="50" r="35"/>
      <circle cx="50" cy="50" r="25"/>
      <text x="50" y="52" textAnchor="middle" fill="#FAF6F0" fontFamily="JetBrains Mono" fontSize="3">SUA HISTÓRIA · MERECE SER OUVIDA · </text>
    </svg>
  </div>

  <div className="container-seguro">

    <div className="mb-20 max-w-3xl">
      <span className="tabloid mb-5 inline-block">O método</span>
      <h2 className="masthead text-[clamp(2.4rem,5.5vw,4.5rem)] mt-4">
        3 passos. <span className="display-italic text-mustard">7 minutos.</span> Uma chance real de sair na imprensa.
      </h2>
    </div>

    <div className="grid lg:grid-cols-3 gap-8">

      {/* Passo 1 */}
      <div className="relative">
        <div className="masthead text-9xl text-rose/40 leading-none">01</div>
        <div className="-mt-12 md:-mt-16 relative z-10 space-y-4 pl-2">
          <h3 className="display text-3xl">Conversa com a MarIA</h3>
          <p className="text-paper/75 leading-relaxed">
            Sem formulário chato. A MarIA te entrevista por chat, igual uma jornalista de verdade: <em>"por que agora?", "quem fala?", "tem número?"</em>. Em 7 minutos, ela monta um release que pauteiro lê até o fim.
          </p>
          <div className="news-rule" style={{ backgroundImage: 'linear-gradient(to right, #FAF6F0 50%, transparent 50%)' }}></div>
          <div className="font-mono text-xs opacity-60">⏱ 7 MIN · VIA WHATSAPP OU WEB</div>
        </div>
      </div>

      {/* Passo 2 */}
      <div className="relative">
        <div className="masthead text-9xl text-mustard/50 leading-none">02</div>
        <div className="-mt-12 md:-mt-16 relative z-10 space-y-4 pl-2">
          <h3 className="display text-3xl">Curadoria de jornalista real</h3>
          <p className="text-paper/75 leading-relaxed">
            Nenhuma pauta sai sem passar por um jornalista de redação humano. Ele afia o gancho, valida o que faz sentido, corta o que não. É o <strong>firewall de qualidade</strong> que IA pura nunca tem.
          </p>
          <div className="news-rule" style={{ backgroundImage: 'linear-gradient(to right, #FAF6F0 50%, transparent 50%)' }}></div>
          <div className="font-mono text-xs opacity-60">👁 REVISADO EM ATÉ 24H</div>
        </div>
      </div>

      {/* Passo 3 */}
      <div className="relative">
        <div className="masthead text-9xl text-coral/60 leading-none">03</div>
        <div className="-mt-12 md:-mt-16 relative z-10 space-y-4 pl-2">
          <h3 className="display text-3xl">Conexão com quem cobre o tema</h3>
          <p className="text-paper/75 leading-relaxed">
            Sua pauta vai pra <strong>20 jornalistas brasileiros</strong> que cobrem exatamente o seu setor. Não é spam pra 5.000 e-mails — é o jornalista certo, no momento certo, com o gancho certo.
          </p>
          <div className="news-rule" style={{ backgroundImage: 'linear-gradient(to right, #FAF6F0 50%, transparent 50%)' }}></div>
          <div className="font-mono text-xs opacity-60">📩 ENTREGA EM 48H ÚTEIS</div>
        </div>
      </div>

    </div>
  </div>
</section>

{/* =================== PROVA / CASES =================== */}
<section id="prova" className="sec-prova relative grain">
  <div className="container-seguro">

    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="max-w-2xl">
        <span className="tabloid mb-5 inline-block">Potencial Real</span>
        <h2 className="masthead text-[clamp(2.2rem,5vw,4rem)] mt-4">
          Uma rede <span className="display-italic text-rose">em construção</span> para aproximar fontes e jornalistas.
        </h2>
      </div>
      <div className="text-right">
        <div className="masthead text-5xl text-rose">Milhares</div>
        <p className="font-mono text-xs opacity-70">DE POSSÍVEIS CONEXÕES JORNALÍSTICAS</p>
      </div>
    </div>

    <div className="grid lg:grid-cols-3 gap-8">

      <article className="card-news rounded-2xl p-8 lg:p-10 flex flex-col min-h-[420px]">
        <div className="flex items-center gap-2 mb-6">
          <span className="tabloid text-sm px-3 py-1.5">Pequenos Negócios</span>
        </div>
        <h3 className="display text-3xl lg:text-4xl mb-4 leading-tight">Sua história local nos veículos certos.</h3>
        <p className="text-base lg:text-lg text-ink/75 flex-1 mb-8 leading-relaxed">
          Uma padaria tradicional completa 50 anos. A MarIA organiza a pauta e conecta com jornais do bairro e cadernos de gastronomia local.
        </p>
        <div className="news-rule mb-6"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-base">Exemplo Prático</div>
          </div>
          <div className="text-4xl">🥖</div>
        </div>
      </article>

      <article className="card-news rounded-2xl p-8 lg:p-10 flex flex-col min-h-[420px]" style={{ background: '#F5B700' }}>
        <div className="flex items-center gap-2 mb-6">
          <span className="tabloid text-sm px-3 py-1.5" style={{ background: '#0F0A1A', color: '#F5B700' }}>ONGs e Causas</span>
        </div>
        <h3 className="display text-3xl lg:text-4xl mb-4 leading-tight">Mais visibilidade para o seu projeto social.</h3>
        <p className="text-base lg:text-lg text-ink/85 flex-1 mb-8 leading-relaxed">
          Um projeto precisa de visibilidade. A MarIA encontra o gancho certo e direciona a pauta para repórteres que cobrem impacto social e cidadania.
        </p>
        <div className="news-rule mb-6"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-base">Exemplo Prático</div>
          </div>
          <div className="text-4xl">🧵</div>
        </div>
      </article>

      <article className="card-news rounded-2xl p-8 lg:p-10 flex flex-col min-h-[420px]">
        <div className="flex items-center gap-2 mb-6">
          <span className="tabloid text-sm px-3 py-1.5">Startups e Tecnologia</span>
        </div>
        <h3 className="display text-3xl lg:text-4xl mb-4 leading-tight">Do disparo genérico para o nicho correto.</h3>
        <p className="text-base lg:text-lg text-ink/75 flex-1 mb-8 leading-relaxed">
          Uma agtech quer lançar seu produto. Em vez de spam, a MarIA faz o matchmaking com jornalistas focados em agronegócio e inovação.
        </p>
        <div className="news-rule mb-6"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-base">Exemplo Prático</div>
          </div>
          <div className="text-4xl">🚀</div>
        </div>
      </article>

    </div>
  </div>
</section>

{/* =================== COMPARATIVO =================== */}
<section className="sec-comparativo bg-paper relative">
  <div className="container-seguro">
    <div className="text-center mb-16">
      <span className="tabloid mb-5 inline-block">Comparativo honesto</span>
      <h2 className="masthead text-[clamp(2.2rem,5vw,4rem)] mt-4">
        MarIA <span className="display-italic">vs.</span> o resto do mercado.
      </h2>
    </div>

    <div className="card-news rounded-3xl overflow-hidden shadow-xl mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-base md:text-lg">
          <thead className="bg-ink text-paper">
            <tr>
              <th className="p-6 md:p-8 font-mono text-sm tracking-widest font-medium border-b-2 border-rose">CRITÉRIO</th>
              <th className="p-6 md:p-8 font-display text-2xl md:text-3xl bg-rose text-paper border-b-2 border-rose">MarIA</th>
              <th className="p-6 md:p-8 font-display text-xl md:text-2xl border-b-2 border-ink/20">Assessoria tradicional</th>
              <th className="p-6 md:p-8 font-display text-xl md:text-2xl border-b-2 border-ink/20">Chat genérico</th>
              <th className="p-6 md:p-8 font-display text-xl md:text-2xl border-b-2 border-ink/20">DINO / Newswire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/15">
            <tr>
              <td className="p-6 md:p-8 font-semibold text-ink">Custo mensal</td>
              <td className="p-6 md:p-8 bg-rose/5 font-bold text-rose text-xl">R$ 297 + sucesso</td>
              <td className="p-6 md:p-8 text-ink/70">R$ 3.000 a R$ 15.000</td>
              <td className="p-6 md:p-8 text-ink/70">R$ 100 (sem entrega)</td>
              <td className="p-6 md:p-8 text-ink/70">R$ 700 por release</td>
            </tr>
            <tr>
              <td className="p-6 md:p-8 font-semibold text-ink">Foco em conexões reais?</td>
              <td className="p-6 md:p-8 bg-rose/5 font-bold text-rose text-xl">✓ SIM</td>
              <td className="p-6 md:p-8 text-ink/70">✗ Não</td>
              <td className="p-6 md:p-8 text-ink/70">N/A</td>
              <td className="p-6 md:p-8 text-ink/70">✗ Não</td>
            </tr>
            <tr>
              <td className="p-6 md:p-8 font-semibold text-ink">Curadoria humana</td>
              <td className="p-6 md:p-8 bg-rose/5 font-bold text-rose text-xl">✓ Jornalista real</td>
              <td className="p-6 md:p-8 text-ink/70">✓ Sim</td>
              <td className="p-6 md:p-8 text-ink/70">✗ Zero</td>
              <td className="p-6 md:p-8 text-ink/70">✗ Distribuição automática</td>
            </tr>
            <tr>
              <td className="p-6 md:p-8 font-semibold text-ink">Matchmaking com jornalista certo</td>
              <td className="p-6 md:p-8 bg-rose/5 font-bold text-rose text-xl">✓ IA + rede própria</td>
              <td className="p-6 md:p-8 text-ink/70">~ Depende do contato</td>
              <td className="p-6 md:p-8 text-ink/70">✗ Você se vira</td>
              <td className="p-6 md:p-8 text-ink/70">✗ Manda pra todo mundo</td>
            </tr>
            <tr>
              <td className="p-6 md:p-8 font-semibold text-ink">Pensado pra PME / MEI / ONG</td>
              <td className="p-6 md:p-8 bg-rose/5 font-bold text-rose text-xl">✓ Foco total</td>
              <td className="p-6 md:p-8 text-ink/70">✗ Foco em grande empresa</td>
              <td className="p-6 md:p-8 text-ink/70">~ Genérico</td>
              <td className="p-6 md:p-8 text-ink/70">✗ Foco corporativo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

{/* =================== PREÇO =================== */}
<section id="preco" className="sec-preco bg-ink text-paper relative grain">
  <div className="container-seguro-estreito">

    <div className="text-center mb-16">
      <span className="tabloid mb-5 inline-block" style={{ background: '#F5B700' }}>Preço justo</span>
      <h2 className="masthead text-[clamp(2.2rem,5.5vw,4.5rem)] mt-4">
        Um plano. <span className="display-italic text-mustard">Zero confusão.</span>
      </h2>
      
    </div>

    <div className="max-w-lg mx-auto">
      <div className="card-news rounded-2xl p-8 text-ink relative" style={{ background: '#F5B700', boxShadow: '8px 8px 0 #E91E8C' }}>
        <div className="absolute -top-4 left-8 stamp" style={{ background: '#E91E8C', color: '#FAF6F0', borderColor: '#FAF6F0' }}>
          VERSÃO BETA
        </div>

        <div className="flex items-center justify-between mb-2 mt-2">
          <h3 className="display text-3xl">Plano Beta MarIA</h3>
        </div>
        <p className="text-ink/80 text-sm mb-6">Acesso inicial à plataforma para criação de pauta, curadoria e conexão jornalística.</p>

        <ul className="space-y-3 mb-8">
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span><strong>1 pauta</strong> com apoio da MarIA</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span><strong>Curadoria humana</strong></span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span><strong>Sugestão</strong> de gancho jornalístico</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span><strong>Direcionamento</strong> estratégico</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span>Possibilidade de <strong>conexão com jornalistas</strong> por tema</span>
          </li>
        </ul>

        {/* Preço — estética jornal preservada */}
        <div className="border-t border-b border-ink/30 border-dashed py-5 my-6 text-center">
          <p className="display text-5xl md:text-6xl font-bold leading-none">Grátis no Beta</p>
          <p className="font-mono text-xs tracking-widest mt-3 opacity-75">DEPOIS: R$ 297 + SUCESSO</p>
        </div>

        <a onClick={(e) => { e.preventDefault(); onNavigate('chat'); }} href="#" onClick={(e) => { e.preventDefault(); onNavigate('chat'); }} className="btn-primary w-full justify-center">Testar a MarIA →</a>
      </div>
    </div>

        <p className="text-center text-xs font-mono opacity-60 mt-10">
      ONG VERIFICADA · 50% DE DESCONTO · FALE COM A GENTE
    </p>
  </div>
</section>

{/* =================== OBJEÇÕES (FAQ) =================== */}
<section className="sec-faq bg-paper">
  <div className="container-seguro-estreito">

    <div className="mb-16">
      <span className="tabloid mb-5 inline-block">Perguntas honestas</span>
      <h2 className="masthead text-[clamp(2.2rem,5vw,4rem)] mt-4">
        Tudo que você quer perguntar <span className="display-italic text-rose">antes de testar</span>.
      </h2>
    </div>

    <div className="space-y-4">

      <details className="card-news rounded-xl p-6 group" open>
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>Por que não usar só o Chat genérico pra escrever meu release?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          Porque o Chat genérico te entrega o texto. E aí? Você fica com um release na mão sem saber pra quem mandar. A MarIA não é só a IA — é a <strong>rede curada de jornalistas brasileiros</strong> que recebem sua pauta de verdade. Texto sem distribuição é monólogo.
        </p>
      </details>

      <details className="card-news rounded-xl p-6 group">
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>E se ninguém publicar minha matéria?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          A gente é honesto: não oferecemos garantias absolutas, pois a decisão final é sempre do editor. O que a MarIA proporciona é a <strong>chance real de visibilidade jornalística</strong>. Nós organizamos a sua informação, fortalecemos o gancho e conectamos sua história com os jornalistas corretos, maximizando suas chances de sucesso.
        </p>
      </details>

      <details className="card-news rounded-xl p-6 group">
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>Vocês mandam pra TODOS os jornalistas? Vai virar spam?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          O oposto. A MarIA seleciona <strong>até 20 jornalistas</strong> que cobrem exatamente seu tema. Pauta de inovação em padaria vai pra colunista de pequenos negócios, não pra editor de política. É o anti-spam por design.
        </p>
      </details>

      <details className="card-news rounded-xl p-6 group">
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>Minha empresa é muito pequena pra isso. Faz sentido?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          Faz <em>todo</em> o sentido. A MarIA foi feita exatamente pra MEI, PME, autônomo e ONG — gente que sempre foi invisível porque assessoria tradicional cobra R$ 3.000+/mês. Pequenez não é problema; <strong>história não contada é</strong>.
        </p>
      </details>

      <details className="card-news rounded-xl p-6 group">
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>Quanto tempo até sair uma matéria?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          Honestamente? Varia muito por gancho. Pautas com timing forte (data comemorativa, lançamento, número novo) saem em 1-3 semanas. Pautas frias podem levar 2 meses. Média histórica: <strong>21 dias</strong> entre envio e primeira publicação.
        </p>
      </details>

      <details className="card-news rounded-xl p-6 group">
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>Posso cancelar quando quiser?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          Sempre. Sem fidelidade, sem taxa de cancelamento, sem letrinha miúda. 2 cliques no painel. Acreditamos que o produto bom prende sozinho.
        </p>
      </details>

    </div>
  </div>
</section>

{/* =================== CTA FINAL =================== */}
<section className="sec-cta bg-rose text-paper relative overflow-hidden grain">

  {/* Estrelas decorativas */}
  <div className="absolute top-10 left-10 opacity-30">
    <span className="display text-4xl">✦</span>
  </div>
  <div className="absolute bottom-10 right-16 opacity-30">
    <span className="display text-6xl">✦</span>
  </div>
  <div className="absolute top-1/2 right-10 opacity-20">
    <span className="display text-8xl">∞</span>
  </div>

  <div className="container-seguro-estreito text-center relative z-10">
    <h2 className="masthead text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9]">
      Sua história <span className="display-italic">não merece</span> morrer numa caixa de e-mail.
    </h2>
    <p className="text-xl md:text-2xl mt-8 max-w-2xl mx-auto opacity-90">
      Teste grátis a MarIA. Faça sua primeira pauta. Se gostar, vira cliente. Se não gostar, fica sem nada perdido.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
      <a href="#" className="btn-primary" style={{ background: '#FAF6F0', color: '#0F0A1A', boxShadow: '5px 5px 0 #0F0A1A' }}>
        Criar minha pauta grátis
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </a>
      <a href="#" className="btn-ghost" style={{ borderColor: '#FAF6F0', color: '#FAF6F0' }}>
        Falar com a MarIA no WhatsApp
      </a>
    </div>

    <p className="font-mono text-xs opacity-70 mt-8 tracking-wider">
      🇧🇷 FEITO EM GOIÂNIA · APOIADO PELO PROGRAMA CENTELHA-GO · LGPD-COMPLIANT
    </p>
  </div>
</section>

{/* =================== FOOTER =================== */}
<footer className="bg-ink text-paper py-16 border-t-2 border-paper/20">
  <div className="container-seguro">

    <div className="grid md:grid-cols-4 gap-12 mb-12">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-paper text-ink flex items-center justify-center font-display font-bold text-xl rounded-full">M</div>
          <span className="display text-2xl">MarIA<span className="text-rose">.</span></span>
        </div>
        <p className="text-paper/70 text-sm leading-relaxed">A 1ª assessora de imprensa virtual do Brasil. Conectando histórias reais com jornalistas reais.</p>
      </div>

      <div>
        <h4 className="font-mono text-xs tracking-widest mb-4 opacity-60">PRODUTO</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-rose">Como funciona</a></li>
          <li><a href="#preco" className="hover:text-rose">Preço</a></li>
          <li><a href="#" className="hover:text-rose">Cases</a></li>
          <li><a href="#" className="hover:text-rose">Para ONGs</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs tracking-widest mb-4 opacity-60">JORNALISTAS</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-rose">Cadastrar-se grátis</a></li>
          <li><a href="#" className="hover:text-rose">Banco de fontes</a></li>
          <li><a href="#" className="hover:text-rose">Selo MarIA Verified</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs tracking-widest mb-4 opacity-60">EMPRESA</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-rose">Sobre nós</a></li>
          <li><a href="#" className="hover:text-rose">Blog (A Boa Notícia)</a></li>
          <li><a href="#" className="hover:text-rose">Contato</a></li>
          <li><a href="#" className="hover:text-rose">Trabalhe conosco</a></li>
        </ul>
      </div>
    </div>

    <div className="news-rule mb-6" style={{ backgroundImage: 'linear-gradient(to right, #FAF6F0 50%, transparent 50%)' }}></div>

    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono opacity-60">
      <p>© 2026 MarIA · Plataforma de Inteligência de Conexão Jornalística · CNPJ XX.XXX.XXX/0001-XX</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-rose">Termos</a>
        <a href="#" className="hover:text-rose">Privacidade</a>
        <a href="#" className="hover:text-rose">LGPD</a>
      </div>
    </div>
  </div>
</footer>


    </div>
  );
}
