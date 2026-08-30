import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const newCardsDir = path.resolve(__dirname, '../../house(final)');

// Look at Gryffindor signature area around y=2697 (raw)
const png = PNG.sync.read(fs.readFileSync(path.join(newCardsDir, 'gryffindor.png')));
const { width, height, data } = png;

function isDark(x, y) {
  const i = (y * width + x) * 4;
  return data[i] < 80 && data[i+1] < 80 && data[i+2] < 80 && data[i+3] > 150;
}

// Search for the end of the "HOLDER'S SIGNATURE:" text
// The text is likely between y=2600 and y=2690 (raw)
let maxTextX = 0;
for (let y = 2600; y < 2690; y++) {
  for (let x = 100; x < width * 0.6; x++) {
    if (isDark(x, y) && x > maxTextX) {
      maxTextX = x;
    }
  }
}

console.log("Max text X (raw):", maxTextX);
console.log("Scaled x (divide by 2):", maxTextX / 2);
