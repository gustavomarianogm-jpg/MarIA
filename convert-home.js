const fs = require('fs');
let html = fs.readFileSync('home-extract-clean.html', 'utf8');

// Convert class= to className=
html = html.replace(/class=/g, 'className=');

// Fix self closing tags
html = html.replace(/<br>/g, '<br />');
html = html.replace(/<img([^>]*?[^\/])>/g, '<img$1 />');
html = html.replace(/<input([^>]*?[^\/])>/g, '<input$1 />');

// Remove onclick strings that use goTo/swDash etc
html = html.replace(/onclick="goTo\('chat',null\)"/g, `onClick={() => onNavigate('chat')}`);
html = html.replace(/onclick="goTo\('auth',null\)"/g, `onClick={() => onNavigate('dash')}`);
html = html.replace(/onclick="goTo\('jornalista',null\)"/g, `onClick={() => onNavigate('dash')}`);
html = html.replace(/onclick="[^"]*"/g, `onClick={() => {}}`); // clear other onclicks for now

// Convert inline styles to objects
html = html.replace(/style="([^"]+)"/g, (match, styleString) => {
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

const componentCode = `import React from 'react';
import './LandingPage.css';

export function LandingPage({ session, onNavigate }: { session: any, onNavigate: (r: string) => void }) {
  return (
    ${html}
  );
}
`;

fs.writeFileSync('frontend/src/pages/LandingPage.tsx', componentCode);
console.log("Converted to JSX successfully.");
