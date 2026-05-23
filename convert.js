const fs = require('fs');

const htmlContent = fs.readFileSync('c:/Users/guilh/Downloads/MarIA-main/index.html', 'utf8');

const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/);
if (!bodyMatch) {
  console.error("No body found");
  process.exit(1);
}

let bodyHtml = bodyMatch[1];

let jsx = bodyHtml.replace(/class="/g, 'className="');
jsx = jsx.replace(/for="/g, 'htmlFor="');

jsx = jsx.replace(/style="([^"]+)"/g, (match, styleString) => {
  const styles = styleString.split(';').filter(s => s.trim().length > 0);
  const styleObj = {};
  styles.forEach(style => {
    const [key, value] = style.split(':').map(s => s.trim());
    if (key && value) {
      const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
      styleObj[camelKey] = value;
    }
  });
  return `style={${JSON.stringify(styleObj)}}`;
});

jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

jsx = jsx.replace(/<(img|br|hr|input)([^>]*[^\/])>/g, '<$1$2 />');
jsx = jsx.replace(/fill-rule/g, 'fillRule');
jsx = jsx.replace(/clip-rule/g, 'clipRule');
jsx = jsx.replace(/stroke-width/g, 'strokeWidth');
jsx = jsx.replace(/stroke-linecap/g, 'strokeLinecap');
jsx = jsx.replace(/stroke-linejoin/g, 'strokeLinejoin');

// Fix syntax error in original HTML
jsx = jsx.replace(/<\/h2>\s*<p className="text-lg text-ink\/80 mt-4 max-w-2xl mx-auto">\s*A MarIA nasceu[^<]+<\/p>\s*<\/h2>/, `</h2>\n      <p className="text-lg text-ink/80 mt-4 max-w-2xl mx-auto"> A MarIA nasceu para reduzir essa distância: organiza a informação, fortalece o gancho jornalístico e conecta histórias relevantes com profissionais que cobrem o tema. </p>`);

// Fix unclosed elements causing issues, wait, if any
jsx = jsx.replace(/<\/div>\s*<\/div>\s*<\/section>\s*{\/\* =================== COMO FUNCIONA =================== \*\//, `    </div>\n  </div>\n</section>\n\n{/* =================== COMO FUNCIONA =================== */`);


// Substituir os links específicos conforme o componente original
jsx = jsx.replace(/href="#chat"/g, 'onClick={(e) => { e.preventDefault(); onNavigate(\'chat\'); }} href="#"');
jsx = jsx.replace(/href="#login"/g, 'onClick={(e) => { e.preventDefault(); onNavigate(\'dash\'); }} href="#"');
jsx = jsx.replace(/href="#cta-hero"/g, 'onClick={(e) => { e.preventDefault(); onNavigate(\'chat\'); }} href="#"');
jsx = jsx.replace(/href="https:\/\/mar-ia-mhjz\.vercel\.app\?route=dash"/g, 'onClick={(e) => { e.preventDefault(); onNavigate(\'dash\'); }} href="#"');
jsx = jsx.replace(/href="https:\/\/mar-ia-mhjz\.vercel\.app\?route=chat"/g, 'onClick={(e) => { e.preventDefault(); onNavigate(\'chat\'); }} href="#"');

const finalComponent = `import React from 'react';

export function LandingPageRaw({ onNavigate, session }: { onNavigate: (route: string) => void, session?: any }) {
  return (
    <div className="relative overflow-x-hidden">
      ${jsx}
    </div>
  );
}
`;

fs.writeFileSync('c:/Users/guilh/Downloads/MarIA-main/frontend/src/pages/LandingPageRaw.tsx', finalComponent);
console.log("Converted successfully!");
