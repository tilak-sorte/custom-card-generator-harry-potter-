import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cardsDir = path.resolve(__dirname, '../src/assets/cards');

const PAD = 6;
const FIELDS = ['name', 'specialty', 'dob', 'patronus', 'signature'];

// Coordinates below are in NATIVE 2048×3070 pixel space (= logical 1024×1536 values × 2).
// The patchColor matches the warm parchment background of the new card artwork.
const seeds = {
  gryffindor: {
    patchColor: 'rgb(234,222,193)',
    fields: {
      name:      { x: 456, xEnd: 1924, patchTop: 1888, patchBottom: 1958 },
      specialty: { x: 638, xEnd: 1914, patchTop: 2018, patchBottom: 2088 },
      dob:       { x: 426, xEnd: 1910, patchTop: 2146, patchBottom: 2216 },
      patronus:  { x: 690, xEnd: 1910, patchTop: 2270, patchBottom: 2340 },
      signature: { x: 188, xEnd: 1968, patchTop: 2648, patchBottom: 2718 },
    },
  },
  slytherin: {
    patchColor: 'rgb(232,220,191)',
    fields: {
      name:      { x: 486, xEnd: 1906, patchTop: 1856, patchBottom: 1926 },
      specialty: { x: 644, xEnd: 1900, patchTop: 1982, patchBottom: 2052 },
      dob:       { x: 436, xEnd: 1896, patchTop: 2110, patchBottom: 2180 },
      patronus:  { x: 716, xEnd: 1896, patchTop: 2236, patchBottom: 2306 },
      signature: { x: 184, xEnd: 1940, patchTop: 2662, patchBottom: 2732 },
    },
  },
  hufflepuff: {
    patchColor: 'rgb(234,220,190)',
    fields: {
      name:      { x: 514, xEnd: 1840, patchTop: 1872, patchBottom: 1942 },
      specialty: { x: 662, xEnd: 1846, patchTop: 2020, patchBottom: 2090 },
      dob:       { x: 470, xEnd: 1844, patchTop: 2170, patchBottom: 2240 },
      patronus:  { x: 736, xEnd: 1844, patchTop: 2314, patchBottom: 2384 },
      signature: { x: 208, xEnd: 1918, patchTop: 2652, patchBottom: 2722 },
    },
  },
  ravenclaw: {
    patchColor: 'rgb(232,220,190)',
    fields: {
      name:      { x: 512, xEnd: 1838, patchTop: 1872, patchBottom: 1942 },
      specialty: { x: 660, xEnd: 1846, patchTop: 2020, patchBottom: 2090 },
      dob:       { x: 450, xEnd: 1842, patchTop: 2142, patchBottom: 2212 },
      patronus:  { x: 734, xEnd: 1844, patchTop: 2314, patchBottom: 2384 },
      signature: { x: 206, xEnd: 1896, patchTop: 2740, patchBottom: 2810 },
    },
  },
};

function parseRgb(str) {
  const m = str.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
}

function blank() {
  for (const [id, cfg] of Object.entries(seeds)) {
    const src = path.join(cardsDir, `${id}_front.png`);
    const png = PNG.sync.read(fs.readFileSync(src));
    const { width, height, data } = png;
    const [r, g, b] = parseRgb(cfg.patchColor);
    for (const f of FIELDS) {
      const c = cfg.fields[f];
      const x0 = Math.max(0, c.x - PAD);
      const x1 = Math.min(width, c.xEnd + PAD);
      const y0 = Math.max(0, c.patchTop - PAD);
      const y1 = Math.min(height, c.patchBottom + PAD);
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * width + x) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
      }
    }
    const out = PNG.sync.write(png);
    fs.writeFileSync(src, out);
    console.log(`blanked ${id}`);
  }
}

blank();
