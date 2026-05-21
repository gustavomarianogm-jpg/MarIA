const fs = require('fs');

let html = fs.readFileSync('maria-landing-perfeita.html', 'utf8');

// 1. Extract style block
const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>', styleStart);
if (styleStart !== -1 && styleEnd !== -1) {
    let styleStr = html.substring(styleStart + 7, styleEnd);
    // remove body { ... } because it conflicts with index.css
    styleStr = styleStr.replace(/body\s*\{[^}]+\}/g, '');
    let indexCss = fs.readFileSync('frontend/src/index.css', 'utf8');
    if (!indexCss.includes('.grain::before')) {
        indexCss += '\n\n/* From maria-landing-perfeita.html */\n' + styleStr;
        fs.writeFileSync('frontend/src/index.css', indexCss);
    }
}

// 2. Extract body
let bodyStart = html.indexOf('<body');
bodyStart = html.indexOf('>', bodyStart) + 1;
const bodyEnd = html.indexOf('</body>', bodyStart);
let bodyContent = html.substring(bodyStart, bodyEnd).trim();

// 3. Convert to JSX
let jsx = bodyContent;

// Convert class= to className=
jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/for=/g, 'htmlFor=');

// SVG specifics
jsx = jsx.replace(/fill-rule=/g, 'fillRule=');
jsx = jsx.replace(/clip-rule=/g, 'clipRule=');
jsx = jsx.replace(/stroke-width=/g, 'strokeWidth=');
jsx = jsx.replace(/stroke-linecap=/g, 'strokeLinecap=');
jsx = jsx.replace(/stroke-linejoin=/g, 'strokeLinejoin=');

// Fix self closing tags
jsx = jsx.replace(/<br>/g, '<br />');
jsx = jsx.replace(/<hr(.*?)>/g, '<hr$1 />');

// Handle images
jsx = jsx.replace(/<img([^>]*?)>/g, (match, inner) => {
    if (inner.trim().endsWith('/')) return match;
    return `<img${inner} />`;
});

// Handle inputs
jsx = jsx.replace(/<input([^>]*?)>/g, (match, inner) => {
    if (inner.trim().endsWith('/')) return match;
    return `<input${inner} />`;
});

// Remove generic onclick strings and convert specific ones
jsx = jsx.replace(/onclick="goTo\('chat',null\)"/g, `onClick={(e) => { e.preventDefault(); onNavigate('chat'); }}`);
jsx = jsx.replace(/onclick="goTo\('auth',null\)"/g, `onClick={(e) => { e.preventDefault(); onNavigate('dash'); }}`);
jsx = jsx.replace(/onclick="goTo\('jornalista',null\)"/g, `onClick={(e) => { e.preventDefault(); onNavigate('dash'); }}`);
jsx = jsx.replace(/onclick="[^"]*"/g, `onClick={(e) => e.preventDefault()}`);

// Convert inline styles to objects
jsx = jsx.replace(/style="([^"]+)"/g, (match, styleString) => {
    const rules = styleString.split(';').filter(s => s.trim().length > 0);
    const objStr = rules.map(rule => {
        let [key, val] = rule.split(':');
        if(!key || val === undefined) return '';
        key = key.trim();
        val = val.trim();
        // kebab to camel
        key = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        return `${key}: '${val.replace(/'/g, "\\'")}'`;
    }).filter(Boolean).join(', ');
    return `style={{ ${objStr} }}`;
});

// Replace HTML comments
jsx = jsx.replace(/<!--(.*?)-->/gs, '{/*$1*/}');

const componentCode = `import React from 'react';

export function LandingPage({ onNavigate }: { session?: unknown, onNavigate: (r: string) => void }) {
  return (
    <div className="landing-body relative overflow-x-hidden">
      ${jsx}
    </div>
  );
}
`;

fs.writeFileSync('frontend/src/pages/LandingPage.tsx', componentCode);
console.log("Converted and generated LandingPage.tsx");
