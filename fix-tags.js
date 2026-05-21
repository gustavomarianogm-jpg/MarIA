const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/LandingPage.tsx', 'utf8');

code = code.replace(/<img(.*?)>/g, (match, inner) => {
    if (inner.trim().endsWith('/')) return match;
    return `<img${inner} />`;
});

// Also fix inputs if they didn't get caught
code = code.replace(/<input(.*?)>/g, (match, inner) => {
    if (inner.trim().endsWith('/')) return match;
    return `<input${inner} />`;
});

fs.writeFileSync('frontend/src/pages/LandingPage.tsx', code);
console.log("Fixed self closing tags.");
