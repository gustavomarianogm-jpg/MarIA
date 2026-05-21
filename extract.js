const fs = require('fs'); 
const html = fs.readFileSync('legacy/index_apresentacao.html', 'utf8'); 
const match = html.match(/<div[^>]*class="[^"]*chat-outer[^"]*"[^>]*>.*?<\/div>\s*<\/div>\s*<\/div>/is); 
if(match) { 
  fs.writeFileSync('chat-extract.html', match[0]); 
  console.log('Extracted to chat-extract.html'); 
} else { 
  console.log('Not found'); 
}
