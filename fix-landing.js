const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/LandingPage.tsx', 'utf8');

// Find a good place to add onNavigate
code = code.replace(/<a href="#" className="btn-primary">/g, '<a onClick={(e) => { e.preventDefault(); onNavigate(\'chat\'); }} href="#" className="btn-primary">');
code = code.replace(/<a href="#" className="hidden md:inline-flex text-sm font-medium hover:text-rose">Entrar<\/a>/g, '<a onClick={(e) => { e.preventDefault(); onNavigate(\'\'); }} href="#" className="hidden md:inline-flex text-sm font-medium hover:text-rose">Entrar</a>');
code = code.replace(/<a href="#" className="flex items-center gap-2 group">/g, '<a onClick={(e) => e.preventDefault()} href="#" className="flex items-center gap-2 group">');

fs.writeFileSync('frontend/src/pages/LandingPage.tsx', code);
console.log("Fixed unused var");
