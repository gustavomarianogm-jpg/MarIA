const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/ChatPage.tsx', 'utf8');

if (!code.includes("import './ChatPage.css';")) {
  code = code.replace(
    /import \{ ReleaseMarkdown \} from '@\/components\/ReleaseMarkdown';/g, 
    `import { ReleaseMarkdown } from '@/components/ReleaseMarkdown';\nimport './ChatPage.css';`
  );
}

const match = code.match(/  return \([\r\n\s]+<div id="pg-chat"[^>]*style={{ display: 'flex', flexDirection: 'column'/);

if (!match) {
    console.error("Could not find return statement");
    process.exit(1);
}

const returnStart = match.index;

const jsx = `  return (
    <div id="pg-chat" className="page on" style={{ display: 'block', paddingTop: isCongressMode ? '20px' : '60px' }}>
      <div className="chat-outer">
        <div className="chat-wrap">
          <div className="chat-hdr">
            <div className="avatar-maria">M</div>
            <div className="info" style={{ flex: 1 }}>
              <div className="name">MarIA {isCongressMode && "(Apresentação)"}</div>
              <div className="status"><div className="status-dot"></div> Assessora Virtual • Online</div>
            </div>
            {!isCongressMode && (
              session ? (
                <div className="chat-cred">
                  <div className="credit-label">Créditos</div>
                  <div className="credit-value">{credits}</div>
                </div>
              ) : (
                <div className="chat-cred" style={{ cursor: 'pointer' }} onClick={() => onNavigate('dash')}>
                  <div className="credit-value" style={{ fontSize: '12px' }}>Entrar / Cadastrar</div>
                </div>
              )
            )}
          </div>

          <div id="msgs">
            {messages.map((m, i) => (
              <div key={i} className={\`msg \${m.role}\`}>
                {m.role === 'assistant' && <div className="msg-avatar">M</div>}
                {m.role === 'user' && <div className="msg-avatar user">{session ? (userName?.[0] || 'U') : 'V'}</div>}
                <div className="msg-body">
                  <ReleaseMarkdown content={m.content} variant="chat" role={m.role} />
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="msg assistant">
                <div className="msg-avatar">M</div>
                <div className="msg-body">
                  <div className="typing-ind">
                    <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {canGenerateRelease ? (
            <button 
              id="gen-btn" 
              className="visible"
              onClick={handleGenerateRelease}
              disabled={generateReleaseMutation.isPending}
              style={{ opacity: generateReleaseMutation.isPending ? 0.5 : 1, display: 'block' }}
            >
              {generateReleaseMutation.isPending ? '⏳ Escrevendo Release...' : \`✨ Gerar release profissional \${session ? '(1 crédito)' : '(Grátis)'}\`}
            </button>
          ) : (
            <div id="chips">
              {['Lançamento de produto', 'Nova parceria', 'Prêmio conquistado', 'Evento corporativo'].map(text => (
                <div key={text} className="chip" onClick={() => handleChipClick(text)}>{text}</div>
              ))}
            </div>
          )}

          <form id="inp-area" onSubmit={handleSend}>
            <input 
              type="text" 
              id="msg-inp"
              placeholder="Responda à MarIA..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={chatMutation.isPending || generateReleaseMutation.isPending}
            />
            <button type="submit" id="send-btn" disabled={!input.trim() || chatMutation.isPending || generateReleaseMutation.isPending}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>

        </div>
      </div>

      {generatedReleaseText && !release && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          background: 'rgba(255, 255, 255, 0.95)', padding: '20px', borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center', backdropFilter: 'blur(10px)',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--dark)', marginBottom: '8px' }}>História Gerada com Sucesso! 🎉</h3>
          <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '16px' }}>O release da sua pauta está pronto para visualização.</p>
          <button 
            onClick={() => {
              setRelease(generatedReleaseText);
            }}
            style={{
              background: 'var(--grad)', color: 'white', border: 'none', padding: '12px 24px',
              borderRadius: '100px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(233,30,140,0.3)'
            }}
          >
            Visualizar História Completa ✨
          </button>
        </div>
      )}

    </div>
  );
}
`;

code = code.substring(0, returnStart) + jsx;
fs.writeFileSync('frontend/src/pages/ChatPage.tsx', code);
console.log("Updated ChatPage.tsx successfully.");
