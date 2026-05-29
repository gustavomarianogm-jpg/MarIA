const fs = require('fs');

let html = fs.readFileSync('c:/Users/guilh/Downloads/MarIA-main/index.html', 'utf8');

// Extract body
let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) {
  console.log("Body not found");
  process.exit(1);
}
let body = bodyMatch[1];

// Convert to JSX
let jsx = body;

// Remove scripts
jsx = jsx.replace(/<script[\s\S]*?<\/script>/gi, '');

// Convert class to className
jsx = jsx.replace(/class=/g, 'className=');

// Convert for to htmlFor
jsx = jsx.replace(/for=/g, 'htmlFor=');

// Self close void elements
jsx = jsx.replace(/<(img|br|hr|input|meta|link)([^>]*?)(?<!\/)>/g, '<$1$2 />');

// Convert HTML comments to JSX comments
jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

// Convert inline styles
jsx = jsx.replace(/style="([^"]*)"/g, (match, styleString) => {
  let rules = styleString.split(';').filter(r => r.trim().length > 0);
  let styleObj = {};
  for (let rule of rules) {
    let parts = rule.split(':');
    if (parts.length >= 2) {
      let key = parts[0].trim();
      let value = parts.slice(1).join(':').trim();
      // camelCase key
      key = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styleObj[key] = value;
    }
  }
  return `style={${JSON.stringify(styleObj)}}`;
});

// Convert SVG
jsx = jsx.replace(/stroke-width/g, 'strokeWidth');
jsx = jsx.replace(/stroke-linecap/g, 'strokeLinecap');
jsx = jsx.replace(/stroke-linejoin/g, 'strokeLinejoin');
jsx = jsx.replace(/fill-rule/g, 'fillRule');
jsx = jsx.replace(/clip-rule/g, 'clipRule');
jsx = jsx.replace(/text-anchor/g, 'textAnchor');
jsx = jsx.replace(/font-family/g, 'fontFamily');
jsx = jsx.replace(/font-size/g, 'fontSize');

// Fix Entrar button (remove it)
jsx = jsx.replace(/<a[^>]*href="[^"]*route=dash"[^>]*className="hidden md:inline-flex[^"]*"[^>]*>Entrar<\/a>/i, '');

// Convert other route=dash or route=chat links to buttons
jsx = jsx.replace(/<a\s+href="https:\/\/mar-ia-mhjz\.vercel\.app\?route=(dash|chat)"([^>]*?)>([\s\S]*?)<\/a>/gi, (match, route, attrs, content) => {
  return `<button type="button" onClick={() => onNavigate('chat')} ${attrs.trim()}>${content}</button>`;
});

// Convert logo link to navigate home
jsx = jsx.replace(
  /<a\s+href="#"\s+className="flex items-center gap-2 group">([\s\S]*?)<\/a>/i,
  `<button type="button" onClick={() => onNavigate('landing')} className="flex items-center gap-2 group text-left">$1</button>`
);

// Convert "Sou jornalista" nav link to button
jsx = jsx.replace(
  /<a\s+href="#jornalista"\s+className="hover:text-rose transition-colors">Sou jornalista<\/a>/i,
  `<button type="button" onClick={() => onJoinWaitlist?.('Jornalista')} className="hover:text-rose transition-colors cursor-pointer">Sou jornalista</button>`
);

// Convert JORNALISTAS footer link to button
jsx = jsx.replace(
  /<li><a\s+href="#"\s+className="hover:text-rose">Cadastrar-se grátis<\/a><\/li>/gi,
  `<li><button type="button" onClick={() => onJoinWaitlist?.('Jornalista')} className="hover:text-rose cursor-pointer">Cadastrar-se grátis</button></li>`
);

// Fix footer Como funciona link
jsx = jsx.replace(
  /<li><a\s+href="#"\s+className="hover:text-rose">Como funciona<\/a><\/li>/i,
  `<li><a href="#como-funciona" className="hover:text-rose">Como funciona</a></li>`
);

// Rename bubble classes to landing-specific classes to avoid collision
jsx = jsx.replace(/className="bubble-maria"/gi, 'className="landing-bubble-maria"');
jsx = jsx.replace(/className="bubble-user"/gi, 'className="landing-bubble-user"');

let template = `import React from 'react';

export function LandingPage({
  onNavigate,
  onJoinWaitlist,
}: {
  onJoinWaitlist?: (segment: string) => void;
  onNavigate: (r: string) => void;
}) {
  return (
    <div className="landing-body relative">
      ${jsx}
    </div>
  );
}
`;

fs.writeFileSync('c:/Users/guilh/Downloads/MarIA-main/frontend/src/pages/LandingPage.tsx', template);
console.log("Done");
