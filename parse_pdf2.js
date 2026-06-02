import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

let dataBuffer = fs.readFileSync('335-cp.signed.pdf');

pdf(dataBuffer).then(function(data) {
  fs.writeFileSync('335-text.txt', data.text);
}).catch(console.error);
