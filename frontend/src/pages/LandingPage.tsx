
import React from 'react';

export function LandingPage({ session, onNavigate }: { session: any, onNavigate: (r: string) => void }) {
  return (
    <div className="landing-body relative overflow-x-hidden">
      

{/*  =================== TOP BAR (estilo cabeÃ§alho de jornal) ===================  */}
<div className="bg-ink text-paper py-2 text-xs font-mono tracking-widest border-b border-paper/20">
  <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="pulse-dot"></span>
      <span className="opacity-80">EDIÃ‡ÃƒO NÂº 001 Â· GOIÃ‚NIA-GO Â· A 1Âª ASSESSORIA QUE COBRA POR RESULTADO</span>
    </div>
    <div className="hidden md:block opacity-60">QUARTA Â· 20 Â· MAI Â· 2026</div>
  </div>
</div>

{/*  =================== NAV ===================  */}
<nav className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-ink/15">
  <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
    <a onClick={(e) => e.preventDefault()} href="#" className="flex items-center gap-2 group">
      <div className="w-10 h-10 bg-ink text-paper flex items-center justify-center font-display font-bold text-xl rounded-full group-hover:bg-rose transition-colors">M</div>
      <span className="display text-2xl">MarIA<span className="text-rose">.</span></span>
    </a>

    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
      <a href="#como-funciona" className="hover:text-rose transition-colors">Como funciona</a>
      <a href="#prova" className="hover:text-rose transition-colors">Quem jÃ¡ saiu</a>
      <a href="#preco" className="hover:text-rose transition-colors">PreÃ§o</a>
      <a href="#jornalista" className="hover:text-rose transition-colors">Sou jornalista</a>
    </div>

    <div className="flex items-center gap-3">
      <a onClick={(e) => { e.preventDefault(); onNavigate(''); }} href="#" className="hidden md:inline-flex text-sm font-medium hover:text-rose">Entrar</a>
      <a onClick={(e) => { e.preventDefault(); onNavigate(''); }} href="#" className="btn-primary text-sm py-2.5 px-5" style={{"boxShadow":"3px 3px 0 #E91E8C"}} onClick={(e) => { e.preventDefault(); onNavigate('chat'); }}>Testar GrÃ¡tis â†’
      </a>
    </div>
  </div>
</nav>

{/*  =================== HERO ===================  */}
<section className="relative pt-16 pb-24 md:pt-24 md:pb-32 grain">
  <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center relative">

    {/*  Coluna esquerda: manchete  */}
    <div className="lg:col-span-7 space-y-8">
      <div className="flex items-center gap-3 rise rise-1">
        <span className="tabloid">Exclusiva</span>
        <span className="font-mono text-xs text-ink/60">Caderno Â· NEGÃ“CIOS</span>
      </div>

      <h1 className="display text-[clamp(2.8rem,7vw,5.5rem)] rise rise-2">
        Sua histÃ³ria merece <span className="display-italic text-rose">virar notÃ­cia</span> â€”
        <span className="marker">nÃ£o mais um release esquecido</span> na caixa de e-mail.
      </h1>

      <p className="text-lg md:text-xl text-ink/75 max-w-xl rise rise-3 leading-relaxed">
        A MarIA Ã© a primeira assessora de imprensa que combina <strong>IA + curadoria de jornalistas reais</strong> â€” e cobra sÃ³ quando sua matÃ©ria sai publicada de verdade. Sem mensalidade gorda. Sem release jogado fora.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 rise rise-4" id="cta-hero">
        <a href="#" className="btn-primary" onClick={(e) => { e.preventDefault(); onNavigate('chat'); }}>Criar minha 1Âª pauta grÃ¡tis
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
        <a href="#como-funciona" className="btn-ghost">
          Como funciona
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-4 rise rise-5">
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-5 h-5 text-rose" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          <span className="font-medium">Sem cartÃ£o de crÃ©dito</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-5 h-5 text-rose" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          <span className="font-medium">Garantia: sÃ³ paga se publicar</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-5 h-5 text-rose" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          <span className="font-medium">Feito em GoiÃ¡s ðŸ‡§ðŸ‡·</span>
        </div>
      </div>
    </div>

    {/*  Coluna direita: chat MarIA + selo recorte  */}
    <div className="lg:col-span-5 relative w-full max-w-[420px] mx-auto lg:mx-0 lg:ml-auto">

      {/*  Selo retrÃ´  */}
      <div className="absolute -top-6 -right-2 z-20 stamp">
        Como uma manchete Â· de verdade
      </div>

      {/*  Card editorial  */}
      <div className="card-news rounded-2xl p-7 relative z-10 rise rise-3">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-ink text-paper flex items-center justify-center font-display font-bold">M</div>
            <div>
              <div className="font-semibold text-sm">MarIA Â· online agora</div>
              <div className="text-xs text-ink/60 font-mono">Jornalista Â· 15+ anos de redaÃ§Ã£o</div>
            </div>
          </div>
          <span className="pulse-dot"></span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bubble-maria">
            Oi, Marcos! ðŸ‘‹ Vi que sua padaria completou 50 anos. Isso Ã© OURO pra uma pauta. Vamos contar essa histÃ³ria?
          </div>
          <div className="bubble-user">
            SÃ©rio? Achei que ninguÃ©m ia se importar com isso.
          </div>
          <div className="bubble-maria">
            Marcos, jornalista de pequeno negÃ³cio acorda procurando histÃ³ria assim. TradiÃ§Ã£o que sobreviveu pandemia + fermentaÃ§Ã£o natural = manchete. Me conta: qual foi o momento mais difÃ­cil que vocÃªs passaram?
          </div>
        </div>

        <div className="news-rule mt-6 mb-4"></div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-ink/60">â†“ release pronto em ~7 min</span>
          <span className="tabloid">3.281 jÃ¡ publicaram</span>
        </div>
      </div>

      {/*  Card de matÃ©ria publicada (atrÃ¡s)  */}
      <div className="card-news rounded-xl p-5 absolute -bottom-12 -left-2 md:-left-8 w-[85%] max-w-[280px] z-0 rise rise-4" style={{"transform":"rotate(-3deg)","background":"#F5B700"}}>
        <div className="flex items-center gap-2 mb-2 text-xs font-mono">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/></svg>
          <span className="font-semibold">FOLHA Â· PEQUENOS NEGÃ“CIOS</span>
        </div>
        <p className="font-display text-sm font-semibold leading-tight">"Padaria de GoiÃ¢nia preserva fermentaÃ§Ã£o de 50 anos e dobra faturamento"</p>
        <div className="mt-3 text-[10px] font-mono text-ink/60">PUBLICADO HÃ 2 DIAS</div>
      </div>
    </div>
  </div>
</section>

{/*  =================== FAIXA DE LOGOS / "JÃ SAÃRAM EM" ===================  */}
<section className="bg-ink text-paper py-8 border-y-2 border-ink overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 mb-5 flex items-center justify-between">
    <span className="font-mono text-xs tracking-widest opacity-70">CLIENTES MARIA QUE JÃ SAÃRAM EM</span>
    <span className="font-mono text-xs tracking-widest opacity-70">3.281 MATÃ‰RIAS Â· ATUALIZADO HOJE</span>
  </div>
  <div className="marquee-track gap-16 items-center text-paper/85">
    <span className="display text-3xl opacity-80 whitespace-nowrap">Folha de S.Paulo</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Â· O Popular Â·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">EstadÃ£o</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Â· Exame Â·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Pequenas Empresas Grandes NegÃ³cios</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Â· DiÃ¡rio da ManhÃ£ Â·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">G1</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Â· Startupi Â·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Valor EconÃ´mico</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Â· Tribuna do Planalto Â·</span>
    {/*  duplicado pra loop infinito  */}
    <span className="display text-3xl opacity-80 whitespace-nowrap">Folha de S.Paulo</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Â· O Popular Â·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">EstadÃ£o</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Â· Exame Â·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Pequenas Empresas Grandes NegÃ³cios</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Â· DiÃ¡rio da ManhÃ£ Â·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">G1</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Â· Startupi Â·</span>
  </div>
</section>

{/*  =================== A DOR (problema/agitaÃ§Ã£o) ===================  */}
<section className="py-24 md:py-32 grain relative">
  <div className="max-w-5xl mx-auto px-6">
    <div className="text-center mb-16">
      <span className="tabloid mb-5 inline-block">A real dura</span>
      <h2 className="masthead text-[clamp(2.2rem,5vw,4rem)] mt-4">
        VocÃª gasta R$ 3.000/mÃªs com assessoria e <span className="display-italic text-coral">nunca aparece</span>.
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="card-news rounded-xl p-6 flex flex-col justify-center">
        <div className="masthead text-7xl text-rose mb-4">300</div>
        <p className="font-semibold mb-2">e-mails por dia</p>
        <p className="text-sm text-ink/70">recebe um jornalista. 95% vÃ£o direto pra lixeira sem nem ser abertos.</p>
      </div>
      <div className="card-news rounded-xl p-6 flex flex-col justify-center">
        <div className="masthead text-7xl text-rose mb-4">R$ 3k</div>
        <p className="font-semibold mb-2">Ã© o piso mensal</p>
        <p className="text-sm text-ink/70">de uma assessoria tradicional. InacessÃ­vel pra PME, MEI ou ONG.</p>
      </div>
      <div className="card-news rounded-xl p-6 flex flex-col justify-center">
        <div className="masthead text-7xl text-rose mb-4">0</div>
        <p className="font-semibold mb-2">Ã© o que o ChatGPT</p>
        <p className="text-sm text-ink/70">entrega de publicaÃ§Ã£o. Ele te dÃ¡ o texto. NinguÃ©m pra mandar pra ninguÃ©m.</p>
      </div>
    </div>

    <div className="mt-20 text-center relative z-10">
      <p className="display text-2xl md:text-3xl max-w-3xl mx-auto leading-snug">
        A MarIA nÃ£o vende release. Vende <span className="marker">a chance real da sua histÃ³ria sair</span> num veÃ­culo de credibilidade.
      </p>
    </div>
  </div>
</section>

{/*  =================== COMO FUNCIONA ===================  */}
<section id="como-funciona" className="py-24 md:py-32 bg-ink text-paper relative overflow-hidden">

  {/*  DecoraÃ§Ã£o  */}
  <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
    <svg width="200" height="200" viewBox="0 0 100 100" fill="none" stroke="#FAF6F0" strokeWidth="0.5">
      <circle cx="50" cy="50" r="45"/>
      <circle cx="50" cy="50" r="35"/>
      <circle cx="50" cy="50" r="25"/>
      <text x="50" y="52" text-anchor="middle" fill="#FAF6F0" font-family="JetBrains Mono" font-size="3">SUA HISTÃ“RIA Â· MERECE SER OUVIDA Â· </text>
    </svg>
  </div>

  <div className="max-w-7xl mx-auto px-6">

    <div className="mb-20 max-w-3xl">
      <span className="tabloid mb-5 inline-block">O mÃ©todo</span>
      <h2 className="masthead text-[clamp(2.4rem,5.5vw,4.5rem)] mt-4">
        3 passos. <span className="display-italic text-mustard">7 minutos.</span> Uma chance real de sair na imprensa.
      </h2>
    </div>

    <div className="grid lg:grid-cols-3 gap-8">

      {/*  Passo 1  */}
      <div className="relative">
        <div className="masthead text-9xl text-rose/40 leading-none">01</div>
        <div className="-mt-12 md:-mt-16 relative z-10 space-y-4 pl-2">
          <h3 className="display text-3xl">Conversa com a MarIA</h3>
          <p className="text-paper/75 leading-relaxed">
            Sem formulÃ¡rio chato. A MarIA te entrevista por chat, igual uma jornalista de verdade: <em>"por que agora?", "quem fala?", "tem nÃºmero?"</em>. Em 7 minutos, ela monta um release que pauteiro lÃª atÃ© o fim.
          </p>
          <div className="news-rule" style={{"backgroundImage":"linear-gradient(to right, #FAF6F0 50%, transparent 50%)"}}></div>
          <div className="font-mono text-xs opacity-60">â± 7 MIN Â· VIA WHATSAPP OU WEB</div>
        </div>
      </div>

      {/*  Passo 2  */}
      <div className="relative">
        <div className="masthead text-9xl text-mustard/50 leading-none">02</div>
        <div className="-mt-12 md:-mt-16 relative z-10 space-y-4 pl-2">
          <h3 className="display text-3xl">Curadoria de jornalista real</h3>
          <p className="text-paper/75 leading-relaxed">
            Nenhuma pauta sai sem passar por um jornalista de redaÃ§Ã£o humano. Ele afia o gancho, valida o que faz sentido, corta o que nÃ£o. Ã‰ o <strong>firewall de qualidade</strong> que IA pura nunca tem.
          </p>
          <div className="news-rule" style={{"backgroundImage":"linear-gradient(to right, #FAF6F0 50%, transparent 50%)"}}></div>
          <div className="font-mono text-xs opacity-60">ðŸ‘ REVISADO EM ATÃ‰ 24H</div>
        </div>
      </div>

      {/*  Passo 3  */}
      <div className="relative">
        <div className="masthead text-9xl text-coral/60 leading-none">03</div>
        <div className="-mt-12 md:-mt-16 relative z-10 space-y-4 pl-2">
          <h3 className="display text-3xl">ConexÃ£o com quem cobre o tema</h3>
          <p className="text-paper/75 leading-relaxed">
            Sua pauta vai pra <strong>20 jornalistas brasileiros</strong> que cobrem exatamente o seu setor. NÃ£o Ã© spam pra 5.000 e-mails â€” Ã© o jornalista certo, no momento certo, com o gancho certo.
          </p>
          <div className="news-rule" style={{"backgroundImage":"linear-gradient(to right, #FAF6F0 50%, transparent 50%)"}}></div>
          <div className="font-mono text-xs opacity-60">ðŸ“© ENTREGA EM 48H ÃšTEIS</div>
        </div>
      </div>

    </div>
  </div>
</section>

{/*  =================== PROVA / CASES ===================  */}
<section id="prova" className="py-24 md:py-32 relative grain">
  <div className="max-w-7xl mx-auto px-6">

    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="max-w-2xl">
        <span className="tabloid mb-5 inline-block">Saiu na imprensa</span>
        <h2 className="masthead text-[clamp(2.2rem,5vw,4rem)] mt-4">
          HistÃ³rias <span className="display-italic text-rose">de verdade</span> que viraram manchete.
        </h2>
      </div>
      <div className="text-right">
        <div className="masthead text-6xl text-rose">3.281</div>
        <p className="font-mono text-xs opacity-70">MATÃ‰RIAS PUBLICADAS Â· ÃšLTIMOS 12 MESES</p>
      </div>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">

      {/*  Case 1  */}
      <article className="card-news rounded-xl p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className="tabloid">Padaria Â· GoiÃ¢nia</span>
        </div>
        <h3 className="display text-2xl mb-3 leading-tight">"SaÃ­mos no EstadÃ£o e no caderno PME da Folha em 2 semanas."</h3>
        <p className="text-sm text-ink/75 flex-1 mb-5">
          A Padaria do Seu Joaquim completou 50 anos. Com a MarIA, viraram pauta nacional em 14 dias. Faturamento dobrou no mÃªs seguinte.
        </p>
        <div className="news-rule mb-4"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">Marcos Joaquim</div>
            <div className="text-xs text-ink/60">Padaria do Seu Joaquim Â· 3Âª geraÃ§Ã£o</div>
          </div>
          <div className="text-2xl">ðŸ¥–</div>
        </div>
      </article>

      {/*  Case 2 (destaque)  */}
      <article className="card-news rounded-xl p-6 flex flex-col bg-mustard">
        <div className="flex items-center gap-2 mb-4">
          <span className="tabloid" style={{"background":"#0F0A1A","color":"#F5B700"}}>ONG Â· SÃ£o Paulo</span>
        </div>
        <h3 className="display text-2xl mb-3 leading-tight">"Conseguimos 3 reportagens de TV em 1 mÃªs. Triplicamos as doaÃ§Ãµes."</h3>
        <p className="text-sm text-ink/85 flex-1 mb-5">
          ONG de costura solidÃ¡ria que ninguÃ©m conhecia. A MarIA encontrou o gancho certo (Dia da Mulher + economia circular) e conectou com 4 redaÃ§Ãµes. Foi pro Bom Dia Brasil.
        </p>
        <div className="news-rule mb-4"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">PatrÃ­cia Lemos</div>
            <div className="text-xs text-ink/70">Instituto Linha Viva</div>
          </div>
          <div className="text-2xl">ðŸ§µ</div>
        </div>
      </article>

      {/*  Case 3  */}
      <article className="card-news rounded-xl p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className="tabloid">Startup Â· AnÃ¡polis</span>
        </div>
        <h3 className="display text-2xl mb-3 leading-tight">"Antes era spam pra 500 emails. Agora 1 release rende 3 matÃ©rias."</h3>
        <p className="text-sm text-ink/75 flex-1 mb-5">
          Startup de agtech que mandava release pra base genÃ©rica e ouvia silÃªncio. Com matchmaking da MarIA, taxa de resposta passou de 0,4% pra 18%.
        </p>
        <div className="news-rule mb-4"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">Bruno Tavares</div>
            <div className="text-xs text-ink/60">AgroPulse Â· CTO e cofundador</div>
          </div>
          <div className="text-2xl">ðŸŒ±</div>
        </div>
      </article>

    </div>
  </div>
</section>

{/*  =================== COMPARATIVO ===================  */}
<section className="py-24 md:py-32 bg-paper relative">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-16">
      <span className="tabloid mb-5 inline-block">Comparativo honesto</span>
      <h2 className="masthead text-[clamp(2.2rem,5vw,4rem)] mt-4">
        MarIA <span className="display-italic">vs.</span> o resto do mercado.
      </h2>
    </div>

    <div className="card-news rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm md:text-base">
          <thead className="bg-ink text-paper">
            <tr>
              <th className="p-5 font-mono text-xs tracking-widest font-medium">CRITÃ‰RIO</th>
              <th className="p-5 font-display text-lg bg-rose text-paper">MarIA</th>
              <th className="p-5 font-display text-lg">Assessoria tradicional</th>
              <th className="p-5 font-display text-lg">ChatGPT</th>
              <th className="p-5 font-display text-lg">DINO / Newswire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/15">
            <tr>
              <td className="p-5 font-semibold">Custo mensal</td>
              <td className="p-5 bg-rose/5 font-semibold text-rose">R$ 297 + sucesso</td>
              <td className="p-5 text-ink/70">R$ 3.000 a R$ 15.000</td>
              <td className="p-5 text-ink/70">R$ 100 (sem entrega)</td>
              <td className="p-5 text-ink/70">R$ 700 por release</td>
            </tr>
            <tr>
              <td className="p-5 font-semibold">VocÃª sÃ³ paga se publicar?</td>
              <td className="p-5 bg-rose/5 font-bold text-rose">âœ“ SIM</td>
              <td className="p-5 text-ink/70">âœ— NÃ£o</td>
              <td className="p-5 text-ink/70">N/A</td>
              <td className="p-5 text-ink/70">âœ— NÃ£o</td>
            </tr>
            <tr>
              <td className="p-5 font-semibold">Curadoria humana</td>
              <td className="p-5 bg-rose/5 font-bold text-rose">âœ“ Jornalista real</td>
              <td className="p-5 text-ink/70">âœ“ Sim</td>
              <td className="p-5 text-ink/70">âœ— Zero</td>
              <td className="p-5 text-ink/70">âœ— DistribuiÃ§Ã£o automÃ¡tica</td>
            </tr>
            <tr>
              <td className="p-5 font-semibold">Matchmaking com jornalista certo</td>
              <td className="p-5 bg-rose/5 font-bold text-rose">âœ“ IA + rede prÃ³pria</td>
              <td className="p-5 text-ink/70">~ Depende do contato</td>
              <td className="p-5 text-ink/70">âœ— VocÃª se vira</td>
              <td className="p-5 text-ink/70">âœ— Manda pra todo mundo</td>
            </tr>
            <tr>
              <td className="p-5 font-semibold">Pensado pra PME / MEI / ONG</td>
              <td className="p-5 bg-rose/5 font-bold text-rose">âœ“ Foco total</td>
              <td className="p-5 text-ink/70">âœ— Foco em grande empresa</td>
              <td className="p-5 text-ink/70">~ GenÃ©rico</td>
              <td className="p-5 text-ink/70">âœ— Foco corporativo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

{/*  =================== PREÃ‡O ===================  */}
<section id="preco" className="py-24 md:py-32 bg-ink text-paper relative grain">
  <div className="max-w-5xl mx-auto px-6">

    <div className="text-center mb-16">
      <span className="tabloid mb-5 inline-block" style={{"background":"#F5B700"}}>PreÃ§o justo</span>
      <h2 className="masthead text-[clamp(2.2rem,5.5vw,4.5rem)] mt-4">
        Um plano. <span className="display-italic text-mustard">Zero confusÃ£o.</span>
      </h2>
      <p className="text-paper/75 max-w-2xl mx-auto mt-6 text-lg">
        EsqueÃ§a pacotes Pro/Plus/Ultra. VocÃª paga uma mensalidade pequena pra ter acesso Ã  MarIA â€” e um bÃ´nus se sua matÃ©ria sair publicada em veÃ­culo de credibilidade.
      </p>
    </div>

    <div className="grid md:grid-cols-[1fr_1.15fr] gap-6">

      {/*  Plano Acesso  */}
      <div className="card-news rounded-2xl p-8 text-ink">
        <div className="flex items-center justify-between mb-2">
          <h3 className="display text-3xl">Acesso</h3>
          <span className="font-mono text-xs bg-ink text-paper px-2 py-1">START</span>
        </div>
        <p className="text-ink/70 text-sm mb-6">Pra quem quer experimentar antes de pagar mais.</p>

        <div className="mb-6">
          <div className="display text-6xl font-bold">R$ 297<span className="text-2xl text-ink/60">/mÃªs</span></div>
          <p className="text-xs font-mono text-ink/60 mt-2">CANCELA QUANDO QUISER Â· SEM FIDELIDADE</p>
        </div>

        <ul className="space-y-3 mb-8">
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-rose flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span><strong>1 pauta/mÃªs</strong> com MarIA + curadoria humana</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-rose flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span>Envio pra <strong>20 jornalistas</strong> selecionados pra seu setor</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-rose flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span>Dashboard com aberturas, respostas e interesses</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-rose flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span>Garantia de 30 dias: <strong>nÃ£o gostou, devolvemos</strong></span>
          </li>
        </ul>

        <a href="#" className="btn-ghost w-full justify-center" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>ComeÃ§ar com Acesso</a>
      </div>

      {/*  Plano Resultado (destaque)  */}
      <div className="card-news rounded-2xl p-8 text-ink relative" style={{"background":"#F5B700","boxShadow":"8px 8px 0 #E91E8C"}}>
        <div className="absolute -top-4 left-8 stamp" style={{"background":"#E91E8C","color":"#FAF6F0","borderColor":"#FAF6F0"}}>
          MAIS ESCOLHIDO
        </div>

        <div className="flex items-center justify-between mb-2 mt-2">
          <h3 className="display text-3xl">Resultado</h3>
          <span className="font-mono text-xs bg-ink text-paper px-2 py-1">PRO</span>
        </div>
        <p className="text-ink/80 text-sm mb-6">Pra quem quer transformar release em matÃ©ria publicada.</p>

        <div className="mb-6">
          <div className="display text-6xl font-bold">R$ 297<span className="text-2xl text-ink/70">/mÃªs</span></div>
          <div className="mt-3 px-3 py-2 bg-ink text-paper inline-block font-mono text-xs">
            + R$ 300 sÃ³ quando a matÃ©ria publicar
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span><strong>Tudo do Acesso</strong> +</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span><strong>Acompanhamento ativo</strong> atÃ© a publicaÃ§Ã£o</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span>Acesso Ã  <strong>Comunidade MarIA</strong> (workshops, jornalistas convidados)</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span><strong>BÃ´nus de R$ 300</strong> sÃ³ sai se sua matÃ©ria sair</span>
          </li>
        </ul>

        <a href="#" className="btn-primary w-full justify-center" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>Quero o Resultado â†’</a>
      </div>
    </div>

    <p className="text-center text-xs font-mono opacity-60 mt-10">
      ONG VERIFICADA Â· 50% DE DESCONTO Â· FALE COM A GENTE
    </p>
  </div>
</section>

{/*  =================== OBJEÃ‡Ã•ES (FAQ) ===================  */}
<section className="py-24 md:py-32 bg-paper">
  <div className="max-w-4xl mx-auto px-6">

    <div className="mb-16">
      <span className="tabloid mb-5 inline-block">Perguntas honestas</span>
      <h2 className="masthead text-[clamp(2.2rem,5vw,4rem)] mt-4">
        Tudo que vocÃª quer perguntar <span className="display-italic text-rose">antes de testar</span>.
      </h2>
    </div>

    <div className="space-y-4">

      <details className="card-news rounded-xl p-6 group" open>
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>Por que nÃ£o usar sÃ³ o ChatGPT pra escrever meu release?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          Porque o ChatGPT te entrega o texto. E aÃ­? VocÃª fica com um release na mÃ£o sem saber pra quem mandar. A MarIA nÃ£o Ã© sÃ³ a IA â€” Ã© a <strong>rede curada de jornalistas brasileiros</strong> que recebem sua pauta de verdade. Texto sem distribuiÃ§Ã£o Ã© monÃ³logo.
        </p>
      </details>

      <details className="card-news rounded-xl p-6 group">
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>E se ninguÃ©m publicar minha matÃ©ria?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          A gente Ã© honesto: PR nÃ£o Ã© garantia. Editor decide. Mas no plano Resultado, vocÃª <strong>sÃ³ paga o bÃ´nus de R$ 300 SE</strong> a matÃ©ria publicar. E nos primeiros 30 dias, se vocÃª nÃ£o gostar do produto, devolvemos a mensalidade. Risco Ã© nosso, nÃ£o seu.
        </p>
      </details>

      <details className="card-news rounded-xl p-6 group">
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>VocÃªs mandam pra TODOS os jornalistas? Vai virar spam?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          O oposto. A MarIA seleciona <strong>atÃ© 20 jornalistas</strong> que cobrem exatamente seu tema. Pauta de inovaÃ§Ã£o em padaria vai pra colunista de pequenos negÃ³cios, nÃ£o pra editor de polÃ­tica. Ã‰ o anti-spam por design.
        </p>
      </details>

      <details className="card-news rounded-xl p-6 group">
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>Minha empresa Ã© muito pequena pra isso. Faz sentido?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          Faz <em>todo</em> o sentido. A MarIA foi feita exatamente pra MEI, PME, autÃ´nomo e ONG â€” gente que sempre foi invisÃ­vel porque assessoria tradicional cobra R$ 3.000+/mÃªs. Pequenez nÃ£o Ã© problema; <strong>histÃ³ria nÃ£o contada Ã©</strong>.
        </p>
      </details>

      <details className="card-news rounded-xl p-6 group">
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>Quanto tempo atÃ© sair uma matÃ©ria?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          Honestamente? Varia muito por gancho. Pautas com timing forte (data comemorativa, lanÃ§amento, nÃºmero novo) saem em 1-3 semanas. Pautas frias podem levar 2 meses. MÃ©dia histÃ³rica: <strong>21 dias</strong> entre envio e primeira publicaÃ§Ã£o.
        </p>
      </details>

      <details className="card-news rounded-xl p-6 group">
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>Posso cancelar quando quiser?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          Sempre. Sem fidelidade, sem taxa de cancelamento, sem letrinha miÃºda. 2 cliques no painel. Acreditamos que o produto bom prende sozinho.
        </p>
      </details>

    </div>
  </div>
</section>

{/*  =================== CTA FINAL ===================  */}
<section className="py-24 md:py-32 bg-rose text-paper relative overflow-hidden grain">

  {/*  Estrelas decorativas  */}
  <div className="absolute top-10 left-10 opacity-30">
    <span className="display text-4xl">âœ¦</span>
  </div>
  <div className="absolute bottom-10 right-16 opacity-30">
    <span className="display text-6xl">âœ¦</span>
  </div>
  <div className="absolute top-1/2 right-10 opacity-20">
    <span className="display text-8xl">âˆž</span>
  </div>

  <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
    <h2 className="masthead text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9]">
      Sua histÃ³ria <span className="display-italic">nÃ£o merece</span> morrer numa caixa de e-mail.
    </h2>
    <p className="text-xl md:text-2xl mt-8 max-w-2xl mx-auto opacity-90">
      Teste grÃ¡tis a MarIA. FaÃ§a sua primeira pauta. Se gostar, vira cliente. Se nÃ£o gostar, fica sem nada perdido.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
      <a href="#" className="btn-primary" style={{"background":"#FAF6F0","color":"#0F0A1A","boxShadow":"5px 5px 0 #0F0A1A"}} onClick={(e) => { e.preventDefault(); onNavigate('chat'); }}>Criar minha pauta grÃ¡tis
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </a>
      <a onClick={(e) => e.preventDefault()} href="#" className="btn-ghost" style={{"borderColor":"#FAF6F0","color":"#FAF6F0"}}>
        Falar com a MarIA no WhatsApp
      </a>
    </div>

    <p className="font-mono text-xs opacity-70 mt-8 tracking-wider">
      ðŸ‡§ðŸ‡· FEITO EM GOIÃ‚NIA Â· APOIADO PELO PROGRAMA CENTELHA-GO Â· LGPD-COMPLIANT
    </p>
  </div>
</section>

{/*  =================== FOOTER ===================  */}
<footer className="bg-ink text-paper py-16 border-t-2 border-paper/20">
  <div className="max-w-7xl mx-auto px-6">

    <div className="grid md:grid-cols-4 gap-12 mb-12">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-paper text-ink flex items-center justify-center font-display font-bold text-xl rounded-full">M</div>
          <span className="display text-2xl">MarIA<span className="text-rose">.</span></span>
        </div>
        <p className="text-paper/70 text-sm leading-relaxed">A 1Âª assessora de imprensa virtual do Brasil. Conectando histÃ³rias reais com jornalistas reais.</p>
      </div>

      <div>
        <h4 className="font-mono text-xs tracking-widest mb-4 opacity-60">PRODUTO</h4>
        <ul className="space-y-2 text-sm">
          <li><a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">Como funciona</a></li>
          <li><a href="#preco" className="hover:text-rose">PreÃ§o</a></li>
          <li><a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">Cases</a></li>
          <li><a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">Para ONGs</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs tracking-widest mb-4 opacity-60">JORNALISTAS</h4>
        <ul className="space-y-2 text-sm">
          <li><a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">Cadastrar-se grÃ¡tis</a></li>
          <li><a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">Banco de fontes</a></li>
          <li><a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">Selo MarIA Verified</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs tracking-widest mb-4 opacity-60">EMPRESA</h4>
        <ul className="space-y-2 text-sm">
          <li><a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">Sobre nÃ³s</a></li>
          <li><a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">Blog (A Boa NotÃ­cia)</a></li>
          <li><a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">Contato</a></li>
          <li><a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">Trabalhe conosco</a></li>
        </ul>
      </div>
    </div>

    <div className="news-rule mb-6" style={{"backgroundImage":"linear-gradient(to right, #FAF6F0 50%, transparent 50%)"}}></div>

    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono opacity-60">
      <p>Â© 2026 MarIA Â· Plataforma de InteligÃªncia de ConexÃ£o JornalÃ­stica Â· CNPJ XX.XXX.XXX/0001-XX</p>
      <div className="flex gap-6">
        <a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">Termos</a>
        <a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">Privacidade</a>
        <a onClick={(e) => e.preventDefault()} href="#" className="hover:text-rose">LGPD</a>
      </div>
    </div>
  </div>
</footer>


    </div>
  );
}
