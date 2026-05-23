const fs = require('fs');
const path = require('path');

const landingPath = path.resolve('c:/Users/guilh/Downloads/MarIA-main/frontend/src/pages/LandingPageRaw.tsx');
const outPath = path.resolve('c:/Users/guilh/Downloads/MarIA-main/frontend/landing.html');

const file = fs.readFileSync(landingPath, 'utf8');
// Extract the JSX inside return(
const match = file.match(/return \(([\s\S]*?)\);\s*}/);
if (!match) {
  console.error('Could not find return block');
  process.exit(1);
}
let jsx = match[1];
// Remove the outer wrapper div
jsx = jsx.replace(/^\s*<div className="relative overflow-x-hidden">/, '').replace(/<\/div>\s*$/,'');
// Replace className with class
jsx = jsx.replace(/className=/g, 'class=');
// Remove React fragments and expressions (e.g., {"..."}) - simple removal of curly braces content that is not HTML
jsx = jsx.replace(/\{[^}]*\}/g, '');
// Replace onClick handlers with simple href="#"
jsx = jsx.replace(/onClick=\{\([^}]*\) => \{[^}]*\}\}/g, 'href="#"');
// Remove style objects (style={...})
jsx = jsx.replace(/style=\{[^}]*\}/g, '');
// Convert self-closing tags that may be broken
jsx = jsx.replace(/<(img|br|hr|input)([^>]*?)\/?>/g, '<$1$2 />');
// Remove any leftover JSX specific syntax like <> </>
jsx = jsx.replace(/<>|<\/>/g, '');

// Build full HTML document using existing head from original index.html
const head = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MarIA — A assessora de imprensa que só cobra quando vira notícia</title>
  <meta name="description" content="A primeira assessora de imprensa virtual do Brasil. Você só paga quando sua história vira matéria. Sem mensalidade inflada, sem promessa vazia." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
</head>
<body class="bg-paper text-ink" style="font-family: 'Inter Tight', sans-serif;">
`;
const foot = '\n</body>\n</html>';

const fullHtml = head + '\n' + jsx + foot;
fs.writeFileSync(outPath, fullHtml);
console.log('Landing HTML generated at', outPath);
