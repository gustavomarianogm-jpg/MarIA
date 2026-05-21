const fs = require('fs');
const html = fs.readFileSync('legacy/index.html', 'utf8');
const start = html.indexOf('<div id="pg-home"');
const end = html.indexOf('<div id="pg-chat"', start);
if(start !== -1 && end !== -1) {
  fs.writeFileSync('home-extract.html', html.substring(start, end));
  console.log("Extracted home HTML");
} else {
  console.error("Could not find boundaries");
}
