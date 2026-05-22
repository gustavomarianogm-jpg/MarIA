import React from 'react';

export function LandingPageRaw({ onNavigate }: { session?: unknown, onNavigate: (r: string) => void }) {
  return (
    <div className="landing-body">
      


<div className="bg-ink text-paper py-2 text-xs font-mono tracking-widest border-b border-paper/20">
  <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="pulse-dot"></span>
      <span className="opacity-80">EDIÇÃO Nº 001 · GOIÂNIA-GO · A 1ª ASSESSORIA QUE COBRA POR RESULTADO</span>
    </div>
    <div className="hidden md:block opacity-60">QUARTA · 20 · MAI · 2026</div>
  </div>
</div>


<nav className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-ink/15">
  <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
    <a href="#" className="flex items-center gap-2 group">
      <div className="w-10 h-10 bg-ink text-paper flex items-center justify-center font-display font-bold text-xl rounded-full group-hover:bg-rose transition-colors">M</div>
      <span className="display text-2xl">MarIA<span className="text-rose">.</span></span>
    </a>

    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
      <a href="#como-funciona" className="hover:text-rose transition-colors">Como funciona</a>
      <a href="#prova" className="hover:text-rose transition-colors">Quem já saiu</a>
      <a href="#preco" className="hover:text-rose transition-colors">Preço</a>
      <a href="#jornalista" className="hover:text-rose transition-colors">Sou jornalista</a>
    </div>

    <div className="flex items-center gap-3">
      <a href="#login" className="hidden md:inline-flex text-sm font-medium hover:text-rose">Entrar</a>
      <a onClick={(e) => { e.preventDefault(); onNavigate('chat'); }} href="#"  href="#cta-hero" className="btn-primary text-sm py-2.5 px-5" style={{"boxShadow":"3px 3px 0 #E91E8C"}}>
        Testar Grátis →
      </a>
    </div>
  </div>
</nav>


<section className="relative pt-16 pb-24 md:pt-24 md:pb-32 grain">
  <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.15fr_1fr] gap-16 items-center relative">

    
    <div className="space-y-8">
      <div className="flex items-center gap-3 rise rise-1">
        <span className="tabloid">Exclusiva</span>
        <span className="font-mono text-xs text-ink/60">Caderno · NEGÓCIOS</span>
      </div>

      <h1 className="display text-[clamp(2.8rem,7vw,5.5rem)] rise rise-2">
        Sua história merece <span className="display-italic text-rose">virar notícia</span> —
        <span className="marker">não mais um release esquecido</span> na caixa de e-mail.
      </h1>

      <p className="text-lg md:text-xl text-ink/75 max-w-xl rise rise-3 leading-relaxed">
        A MarIA é a primeira assessora de imprensa virtual do Brasil criada para transformar boas histórias em pautas jornalísticas, combinando inteligência artificial, curadoria humana e conexão com jornalistas reais. Sem burocracia. Sem disparo genérico. Com estratégia, curadoria e conexão real.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 rise rise-4" id="cta-hero">
        <a onClick={(e) => { e.preventDefault(); onNavigate('chat'); }} href="#"  href="#" className="btn-primary">
          Criar minha 1ª pauta grátis
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
        <a href="#como-funciona" className="btn-ghost">
          Como funciona
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-4 rise rise-5">
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

    
    <div className="relative">

      
      <div className="absolute -top-6 -right-2 z-20 stamp">
        Como uma manchete · de verdade
      </div>

      
      <div className="card-news rounded-2xl p-7 relative z-10 rise rise-3">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-ink text-paper flex items-center justify-center font-display font-bold">M</div>
            <div>
              <div className="font-semibold text-sm">MarIA · online agora</div>
              <div className="text-xs text-ink/60 font-mono">Jornalista · 15+ anos de redação</div>
            </div>
          </div>
          <span className="pulse-dot"></span>
        </div>

        <div className="space-y-3">
          <div className="bubble-maria">
            Oi, Marcos! 👋 Vi que sua padaria completou 50 anos. Isso é OURO pra uma pauta. Vamos contar essa história?
          </div>
          <div className="bubble-user">
            Sério? Achei que ninguém ia se importar com isso.
          </div>
          <div className="bubble-maria">
            Marcos, jornalista de pequeno negócio acorda procurando história assim. Tradição que sobreviveu pandemia + fermentação natural = manchete. Me conta: qual foi o momento mais difícil que vocês passaram?
          </div>
        </div>

        <div className="news-rule mt-6 mb-4"></div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-ink/60">↓ release pronto em ~7 min</span>
          <span className="tabloid">3.281 já publicaram</span>
        </div>
      </div>

      
      <div className="card-news rounded-xl p-5 absolute -bottom-10 -left-4 md:-left-10 w-64 z-0 rise rise-4" style={{"transform":"rotate(-3deg)","background":"#F5B700"}}>
        <div className="flex items-center gap-2 mb-2 text-xs font-mono">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/></svg>
          <span className="font-semibold">FOLHA · PEQUENOS NEGÓCIOS</span>
        </div>
        <p className="font-display text-sm font-semibold leading-tight">"Padaria de Goiânia preserva fermentação de 50 anos e dobra faturamento"</p>
        <div className="mt-3 text-[10px] font-mono text-ink/60">PUBLICADO HÁ 2 DIAS</div>
      </div>
    </div>
  </div>
</section>


<section className="bg-ink text-paper py-8 border-y-2 border-ink overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 mb-5 flex items-center justify-between">
    <span className="font-mono text-xs tracking-widest opacity-70">CLIENTES MARIA QUE JÁ SAÍRAM EM</span>
    <span className="font-mono text-xs tracking-widest opacity-70">3.281 MATÉRIAS · ATUALIZADO HOJE</span>
  </div>
  <div className="marquee-track gap-16 items-center text-paper/85">
    <span className="display text-3xl opacity-80 whitespace-nowrap">Folha de S.Paulo</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· O Popular ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Estadão</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Exame ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Pequenas Empresas Grandes Negócios</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Diário da Manhã ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">G1</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Startupi ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Valor Econômico</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Tribuna do Planalto ·</span>
    
    <span className="display text-3xl opacity-80 whitespace-nowrap">Folha de S.Paulo</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· O Popular ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Estadão</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Exame ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">Pequenas Empresas Grandes Negócios</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Diário da Manhã ·</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">G1</span>
    <span className="display text-3xl opacity-80 whitespace-nowrap">· Startupi ·</span>
  </div>
</section>


<section className="py-24 md:py-32 grain relative">
  <div className="max-w-5xl mx-auto px-6">
    <div className="text-center mb-16">
      <span className="tabloid mb-5 inline-block">A real dura</span>
      <h2 className="masthead text-[clamp(2.2rem,5vw,4rem)] mt-4">
        Você gasta R$ 3.000/mês com assessoria e <span className="display-italic text-coral">nunca aparece</span>.
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <div className="card-news rounded-xl p-6">
        <div className="masthead text-5xl text-rose mb-3">300</div>
        <p className="font-semibold mb-2">e-mails por dia</p>
        <p className="text-sm text-ink/70">recebe um jornalista. 95% vão direto pra lixeira sem nem ser abertos.</p>
      </div>
      <div className="card-news rounded-xl p-6">
        <div className="masthead text-5xl text-rose mb-3">R$ 3k</div>
        <p className="font-semibold mb-2">é o piso mensal</p>
        <p className="text-sm text-ink/70">de uma assessoria tradicional. Inacessível pra PME, MEI ou ONG.</p>
      </div>
      <div className="card-news rounded-xl p-6">
        <div className="masthead text-5xl text-rose mb-3">0</div>
        <p className="font-semibold mb-2">é o que o ChatGPT</p>
        <p className="text-sm text-ink/70">entrega de publicação. Ele te dá o texto. Ninguém pra mandar pra ninguém.</p>
      </div>
    </div>

    <div className="mt-16 text-center">
      <p className="display text-2xl md:text-3xl max-w-3xl mx-auto leading-snug">
        A MarIA não vende release. Vende <span className="marker">a chance real da sua história sair</span> num veículo de credibilidade.
      </p>
    </div>
  </div>
</section>


<section id="como-funciona" className="py-24 md:py-32 bg-ink text-paper relative overflow-hidden">

  
  <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
    <svg width="200" height="200" viewBox="0 0 100 100" fill="none" stroke="#FAF6F0" strokeWidth="0.5">
      <circle cx="50" cy="50" r="45"/>
      <circle cx="50" cy="50" r="35"/>
      <circle cx="50" cy="50" r="25"/>
      <text x="50" y="52" text-anchor="middle" fill="#FAF6F0" font-family="JetBrains Mono" font-size="3">SUA HISTÓRIA · MERECE SER OUVIDA · </text>
    </svg>
  </div>

  <div className="max-w-7xl mx-auto px-6">

    <div className="mb-20 max-w-3xl">
      <span className="tabloid mb-5 inline-block">O método</span>
      <h2 className="masthead text-[clamp(2.4rem,5.5vw,4.5rem)] mt-4">
        3 passos. <span className="display-italic text-mustard">7 minutos.</span> Uma chance real de sair na imprensa.
      </h2>
    </div>

    <div className="grid lg:grid-cols-3 gap-8">

      
      <div className="relative">
        <div className="masthead text-9xl text-rose/40 leading-none">01</div>
        <div className="-mt-12 md:-mt-16 relative z-10 space-y-4 pl-2">
          <h3 className="display text-3xl">Conversa com a MarIA</h3>
          <p className="text-paper/75 leading-relaxed">
            Sem formulário chato. A MarIA te entrevista por chat, igual uma jornalista de verdade: <em>"por que agora?", "quem fala?", "tem número?"</em>. Em 7 minutos, ela monta um release que pauteiro lê até o fim.
          </p>
          <div className="news-rule" style={{"backgroundImage":"linear-gradient(to right, #FAF6F0 50%, transparent 50%)"}}></div>
          <div className="font-mono text-xs opacity-60">⏱ 7 MIN · VIA WHATSAPP OU WEB</div>
        </div>
      </div>

      
      <div className="relative">
        <div className="masthead text-9xl text-mustard/50 leading-none">02</div>
        <div className="-mt-12 md:-mt-16 relative z-10 space-y-4 pl-2">
          <h3 className="display text-3xl">Curadoria de jornalista real</h3>
          <p className="text-paper/75 leading-relaxed">
            Nenhuma pauta sai sem passar por um jornalista de redação humano. Ele afia o gancho, valida o que faz sentido, corta o que não. É o <strong>firewall de qualidade</strong> que IA pura nunca tem.
          </p>
          <div className="news-rule" style={{"backgroundImage":"linear-gradient(to right, #FAF6F0 50%, transparent 50%)"}}></div>
          <div className="font-mono text-xs opacity-60">👁 REVISADO EM ATÉ 24H</div>
        </div>
      </div>

      
      <div className="relative">
        <div className="masthead text-9xl text-coral/60 leading-none">03</div>
        <div className="-mt-12 md:-mt-16 relative z-10 space-y-4 pl-2">
          <h3 className="display text-3xl">Conexão com quem cobre o tema</h3>
          <p className="text-paper/75 leading-relaxed">
            Sua pauta vai pra <strong>20 jornalistas brasileiros</strong> que cobrem exatamente o seu setor. Não é spam pra 5.000 e-mails — é o jornalista certo, no momento certo, com o gancho certo.
          </p>
          <div className="news-rule" style={{"backgroundImage":"linear-gradient(to right, #FAF6F0 50%, transparent 50%)"}}></div>
          <div className="font-mono text-xs opacity-60">📩 ENTREGA EM 48H ÚTEIS</div>
        </div>
      </div>

    </div>
  </div>
</section>


<section id="prova" className="py-24 md:py-32 relative grain">
  <div className="max-w-7xl mx-auto px-6">

    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="max-w-2xl">
        <span className="tabloid mb-5 inline-block">Saiu na imprensa</span>
        <h2 className="masthead text-[clamp(2.2rem,5vw,4rem)] mt-4">
          Histórias <span className="display-italic text-rose">de verdade</span> que viraram manchete.
        </h2>
      </div>
      <div className="text-right">
        <div className="masthead text-6xl text-rose">3.281</div>
        <p className="font-mono text-xs opacity-70">MATÉRIAS PUBLICADAS · ÚLTIMOS 12 MESES</p>
      </div>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">

      
      <article className="card-news rounded-xl p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className="tabloid">Padaria · Goiânia</span>
        </div>
        <h3 className="display text-2xl mb-3 leading-tight">"Saímos no Estadão e no caderno PME da Folha em 2 semanas."</h3>
        <p className="text-sm text-ink/75 flex-1 mb-5">
          A Padaria do Seu Joaquim completou 50 anos. Com a MarIA, viraram pauta nacional em 14 dias. Faturamento dobrou no mês seguinte.
        </p>
        <div className="news-rule mb-4"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">Marcos Joaquim</div>
            <div className="text-xs text-ink/60">Padaria do Seu Joaquim · 3ª geração</div>
          </div>
          <div className="text-2xl">🥖</div>
        </div>
      </article>

      
      <article className="card-news rounded-xl p-6 flex flex-col bg-mustard">
        <div className="flex items-center gap-2 mb-4">
          <span className="tabloid" style={{"background":"#0F0A1A","color":"#F5B700"}}>ONG · São Paulo</span>
        </div>
        <h3 className="display text-2xl mb-3 leading-tight">"Conseguimos 3 reportagens de TV em 1 mês. Triplicamos as doações."</h3>
        <p className="text-sm text-ink/85 flex-1 mb-5">
          ONG de costura solidária que ninguém conhecia. A MarIA encontrou o gancho certo (Dia da Mulher + economia circular) e conectou com 4 redações. Foi pro Bom Dia Brasil.
        </p>
        <div className="news-rule mb-4"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">Patrícia Lemos</div>
            <div className="text-xs text-ink/70">Instituto Linha Viva</div>
          </div>
          <div className="text-2xl">🧵</div>
        </div>
      </article>

      
      <article className="card-news rounded-xl p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className="tabloid">Startup · Anápolis</span>
        </div>
        <h3 className="display text-2xl mb-3 leading-tight">"Antes era spam pra 500 emails. Agora 1 release rende 3 matérias."</h3>
        <p className="text-sm text-ink/75 flex-1 mb-5">
          Startup de agtech que mandava release pra base genérica e ouvia silêncio. Com matchmaking da MarIA, taxa de resposta passou de 0,4% pra 18%.
        </p>
        <div className="news-rule mb-4"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">Bruno Tavares</div>
            <div className="text-xs text-ink/60">AgroPulse · CTO e cofundador</div>
          </div>
          <div className="text-2xl">🌱</div>
        </div>
      </article>

    </div>
  </div>
</section>


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
              <th className="p-5 font-mono text-xs tracking-widest font-medium">CRITÉRIO</th>
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
              <td className="p-5 font-semibold">Foco em conexões reais?</td>
              <td className="p-5 bg-rose/5 font-bold text-rose">✓ SIM</td>
              <td className="p-5 text-ink/70">✗ Não</td>
              <td className="p-5 text-ink/70">N/A</td>
              <td className="p-5 text-ink/70">✗ Não</td>
            </tr>
            <tr>
              <td className="p-5 font-semibold">Curadoria humana</td>
              <td className="p-5 bg-rose/5 font-bold text-rose">✓ Jornalista real</td>
              <td className="p-5 text-ink/70">✓ Sim</td>
              <td className="p-5 text-ink/70">✗ Zero</td>
              <td className="p-5 text-ink/70">✗ Distribuição automática</td>
            </tr>
            <tr>
              <td className="p-5 font-semibold">Matchmaking com jornalista certo</td>
              <td className="p-5 bg-rose/5 font-bold text-rose">✓ IA + rede própria</td>
              <td className="p-5 text-ink/70">~ Depende do contato</td>
              <td className="p-5 text-ink/70">✗ Você se vira</td>
              <td className="p-5 text-ink/70">✗ Manda pra todo mundo</td>
            </tr>
            <tr>
              <td className="p-5 font-semibold">Pensado pra PME / MEI / ONG</td>
              <td className="p-5 bg-rose/5 font-bold text-rose">✓ Foco total</td>
              <td className="p-5 text-ink/70">✗ Foco em grande empresa</td>
              <td className="p-5 text-ink/70">~ Genérico</td>
              <td className="p-5 text-ink/70">✗ Foco corporativo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>


<section id="preco" className="py-24 md:py-32 bg-ink text-paper relative grain">
  <div className="max-w-5xl mx-auto px-6">

    <div className="text-center mb-16">
      <span className="tabloid mb-5 inline-block" style={{"background":"#F5B700"}}>Preço justo</span>
      <h2 className="masthead text-[clamp(2.2rem,5.5vw,4.5rem)] mt-4">
        Um plano. <span className="display-italic text-mustard">Zero confusão.</span>
      </h2>
      <p className="text-paper/75 max-w-2xl mx-auto mt-6 text-lg">
        Esqueça pacotes Pro/Plus/Ultra. Você paga uma mensalidade pequena pra ter acesso à MarIA — e um bônus se sua matéria sair publicada em veículo de credibilidade.
      </p>
    </div>

    <div className="grid md:grid-cols-[1fr_1.15fr] gap-6">

      
      <div className="card-news rounded-2xl p-8 text-ink">
        <div className="flex items-center justify-between mb-2">
          <h3 className="display text-3xl">Acesso</h3>
          <span className="font-mono text-xs bg-ink text-paper px-2 py-1">START</span>
        </div>
        <p className="text-ink/70 text-sm mb-6">Pra quem quer experimentar antes de pagar mais.</p>

        <div className="mb-6">
          <div className="display text-6xl font-bold">R$ 297<span className="text-2xl text-ink/60">/mês</span></div>
          <p className="text-xs font-mono text-ink/60 mt-2">CANCELA QUANDO QUISER · SEM FIDELIDADE</p>
        </div>

        <ul className="space-y-3 mb-8">
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-rose flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span><strong>1 pauta/mês</strong> com MarIA + curadoria humana</span>
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
            <span>Garantia de 30 dias: <strong>não gostou, devolvemos</strong></span>
          </li>
        </ul>

        <a href="#" className="btn-ghost w-full justify-center">Começar com Acesso</a>
      </div>

      
      <div className="card-news rounded-2xl p-8 text-ink relative" style={{"background":"#F5B700","boxShadow":"8px 8px 0 #E91E8C"}}>
        <div className="absolute -top-4 left-8 stamp" style={{"background":"#E91E8C","color":"#FAF6F0","borderColor":"#FAF6F0"}}>
          MAIS ESCOLHIDO
        </div>

        <div className="flex items-center justify-between mb-2 mt-2">
          <h3 className="display text-3xl">Resultado</h3>
          <span className="font-mono text-xs bg-ink text-paper px-2 py-1">PRO</span>
        </div>
        <p className="text-ink/80 text-sm mb-6">Pra quem quer transformar release em matéria publicada.</p>

        <div className="mb-6">
          <div className="display text-6xl font-bold">R$ 297<span className="text-2xl text-ink/70">/mês</span></div>
          <div className="mt-3 px-3 py-2 bg-ink text-paper inline-block font-mono text-xs">
            + Foco total em conexões qualificadas
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span><strong>Tudo do Acesso</strong> +</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span><strong>Acompanhamento ativo</strong> até a publicação</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span>Acesso à <strong>Comunidade MarIA</strong> (workshops, jornalistas convidados)</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span><strong>Bônus de R$ 300</strong> só sai se sua matéria sair</span>
          </li>
        </ul>

        <a href="#" className="btn-primary w-full justify-center">Quero o Resultado →</a>
      </div>
    </div>

    <p className="text-center text-xs font-mono opacity-60 mt-10">
      ONG VERIFICADA · 50% DE DESCONTO · FALE COM A GENTE
    </p>
  </div>
</section>


<section className="py-24 md:py-32 bg-paper">
  <div className="max-w-4xl mx-auto px-6">

    <div className="mb-16">
      <span className="tabloid mb-5 inline-block">Perguntas honestas</span>
      <h2 className="masthead text-[clamp(2.2rem,5vw,4rem)] mt-4">
        Tudo que você quer perguntar <span className="display-italic text-rose">antes de testar</span>.
      </h2>
    </div>

    <div className="space-y-4">

      <details className="card-news rounded-xl p-6 group" open>
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>Por que não usar só o ChatGPT pra escrever meu release?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          Porque o ChatGPT te entrega o texto. E aí? Você fica com um release na mão sem saber pra quem mandar. A MarIA não é só a IA — é a <strong>rede curada de jornalistas brasileiros</strong> que recebem sua pauta de verdade. Texto sem distribuição é monólogo.
        </p>
      </details>

      <details className="card-news rounded-xl p-6 group">
        <summary className="font-display text-xl font-semibold cursor-pointer flex items-center justify-between">
          <span>E se ninguém publicar minha matéria?</span>
          <span className="text-rose text-3xl group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-ink/75 mt-4 leading-relaxed">
          A gente é honesto: PR não é garantia. Editor decide. Mas no plano Resultado, você <strong>só paga o bônus de R$ 300 SE</strong> a matéria publicar. E nos primeiros 30 dias, se você não gostar do produto, devolvemos a mensalidade. Risco é nosso, não seu.
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


<section className="py-24 md:py-32 bg-rose text-paper relative overflow-hidden grain">

  
  <div className="absolute top-10 left-10 opacity-30">
    <span className="display text-4xl">✦</span>
  </div>
  <div className="absolute bottom-10 right-16 opacity-30">
    <span className="display text-6xl">✦</span>
  </div>
  <div className="absolute top-1/2 right-10 opacity-20">
    <span className="display text-8xl">∞</span>
  </div>

  <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
    <h2 className="masthead text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9]">
      Sua história <span className="display-italic">não merece</span> morrer numa caixa de e-mail.
    </h2>
    <p className="text-xl md:text-2xl mt-8 max-w-2xl mx-auto opacity-90">
      Teste grátis a MarIA. Faça sua primeira pauta. Se gostar, vira cliente. Se não gostar, fica sem nada perdido.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
      <a onClick={(e) => { e.preventDefault(); onNavigate('chat'); }} href="#"  href="#" className="btn-primary" style={{"background":"#FAF6F0","color":"#0F0A1A","boxShadow":"5px 5px 0 #0F0A1A"}}>
        Criar minha pauta grátis
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </a>
      <a href="#" className="btn-ghost" style={{"borderColor":"#FAF6F0","color":"#FAF6F0"}}>
        Falar com a MarIA no WhatsApp
      </a>
    </div>

    <p className="font-mono text-xs opacity-70 mt-8 tracking-wider">
      🇧🇷 FEITO EM GOIÂNIA · APOIADO PELO PROGRAMA CENTELHA-GO · LGPD-COMPLIANT
    </p>
  </div>
</section>


<footer className="bg-ink text-paper py-16 border-t-2 border-paper/20">
  <div className="max-w-7xl mx-auto px-6">

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
          <li><a onClick={(e) => { e.preventDefault(); onNavigate('chat'); }} href="#"  href="#" className="hover:text-rose">Cadastrar-se grátis</a></li>
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

    <div className="news-rule mb-6" style={{"backgroundImage":"linear-gradient(to right, #FAF6F0 50%, transparent 50%)"}}></div>

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
