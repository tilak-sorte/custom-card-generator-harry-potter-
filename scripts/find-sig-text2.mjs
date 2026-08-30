import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const newCardsDir = path.resolve(__dirname, '../../house(final)');

const png = PNG.sync.read(fs.readFileSync(path.join(newCardsDir, 'gryffindor.png')));
const { width, height, data } = png;

function isDark(x, y) {
  const i = (y * width + x) * 4;
  return data[i] < 80 && data[i+1] < 80 && data[i+2] < 80 && data[i+3] > 150;
}

// Find the text "HOLDER'S SIGNATURE:". 
// It is around y=2650..2690
let textEnd = 150;
let gapCounter = 0;

for (let x = 150; x < width; x++) {
  let foundDark = false;
  for (let y = 2640; y < 2700; y++) {
    if (isDark(x, y)) {
      foundDark = true;
      break;
    }
  }
  
  if (foundDark) {
    textEnd = x;
    gapCounter = 0;
  } else {
    gapCounter++;
    if (gapCounter > 40) {
      // 40 pixels gap means we left the text
      break;
    }
  }
}

console.log("Text ends at raw X:", textEnd);
console.log("Scaled X:", textEnd / 2);
