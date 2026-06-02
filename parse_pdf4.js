import fs from 'fs';
import pdf_parse from 'pdf-parse';

let dataBuffer = fs.readFileSync('335-cp.signed.pdf');

pdf_parse.default(dataBuffer).then(function(data) {
  fs.writeFileSync('335-text.txt', data.text);
}).catch(console.error);
