const fs = require('fs');

let html = fs.readFileSync('maria-landing-perfeita.html', 'utf8');
let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let body = bodyMatch ? bodyMatch[1] : html;

body = body
  .replace(/class=/g, 'className=')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<img([^>]*)>/g, '<img$1 />')
  .replace(/<input([^>]*)>/g, '<input$1 />')
  .replace(/<br([^>]*)>/g, '<br$1 />')
  .replace(/<hr([^>]*)>/g, '<hr$1 />')
  .replace(/stroke-width=/g, 'strokeWidth=')
  .replace(/fill-rule=/g, 'fillRule=')
  .replace(/clip-rule=/g, 'clipRule=')
  .replace(/stroke-linecap=/g, 'strokeLinecap=')
  .replace(/stroke-linejoin=/g, 'strokeLinejoin=');

body = body.replace(/<a([^>]*)>([\s\S]*?)<\/a>/g, (m, attrs, text) => {
  if (text.toLowerCase().includes('grátis') || text.toLowerCase().includes('testar') || text.toLowerCase().includes('começar')) {
    return `<a onClick={(e) => { e.preventDefault(); onNavigate('chat'); }} href="#" ${attrs}>${text}</a>`;
  }
  return m;
});

// Fix some specific style tags from the raw HTML to be React objects
body = body.replace(/style="([^"]*)"/g, (m, styleStr) => {
  let styleObj = {};
  styleStr.split(';').forEach(rule => {
    let parts = rule.split(':');
    if (parts.length === 2) {
      let key = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      let val = parts[1].trim();
      styleObj[key] = val;
    }
  });
  return `style={${JSON.stringify(styleObj)}}`;
});

let component = `import React from 'react';

export function LandingPage({ onNavigate }: { session?: unknown, onNavigate: (r: string) => void }) {
  return (
    <div className="landing-body">
      ${body}
    </div>
  );
}
`;

fs.writeFileSync('frontend/src/pages/LandingPage.tsx', component);
console.log("Converted!");
