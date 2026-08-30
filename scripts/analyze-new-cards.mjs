import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const newCardsDir = path.resolve(__dirname, '../../house(final)');
const TARGET_W = 1024;
const TARGET_H = 1536;

function getPixel(data, width, x, y) {
  const i = (y * width + x) * 4;
  return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
}
function isDark(px) { return px.r < 80 && px.g < 80 && px.b < 80 && px.a > 150; }

// Corrected field rows: skip the badge row (first one), map to actual NAME/SPECIALTY/DOB/PATRONOUS/SIGNATURE
// From prior analysis raw y-values (2048x3070 space):
const FIELDS = {
  gryffindor: {
    photoTop: 656, photoBottom: 1556, photoLeft: 487, photoRight: 1497,
    // rows: 1756(badge), 1937(NAME), 2067(SPECIALTY), 2194(DOB), 2319(PATRONOUS), 2449(???), 2697(SIGNATURE)
    rows: [1937, 2067, 2194, 2319, 2697]  // name, specialty, dob, patronus, signature
  },
  slytherin: {
    photoTop: 667, photoBottom: 1556, photoLeft: 492, photoRight: 1468,
    // rows: 1742(badge), 1905(NAME), 2030(SPECIALTY), 2158(DOB), 2284(PATRONOUS), 2410(???), 2494(???), 2710(SIGNATURE)
    rows: [1905, 2030, 2158, 2284, 2710]
  },
  hufflepuff: {
    photoTop: 666, photoBottom: 1547, photoLeft: 505, photoRight: 1453,
    // rows: 1714(badge), 1921(NAME), 2069(SPECIALTY), 2218(DOB), 2363(PATRONOUS), 2480(???), 2700(SIGNATURE)
    rows: [1921, 2069, 2218, 2363, 2700]
  },
  ravenclaw: {
    photoTop: 676, photoBottom: 1515, photoLeft: 528, photoRight: 1459,
    // rows: 1687(badge?), 1768(badge?), 1920(NAME), 2069(SPECIALTY), 2190(DOB), 2362(PATRONOUS), 2480(???), 2789(SIGNATURE)
    rows: [1920, 2069, 2190, 2362, 2789]
  }
};

function analyzeHouse(id) {
  const srcPath = path.join(newCardsDir, id + '.png');
  const png = PNG.sync.read(fs.readFileSync(srcPath));
  const { width, height, data } = png;
  const sx = TARGET_W / width;
  const sy = TARGET_H / height;
  
  const cfg = FIELDS[id];
  const fieldNames = ['name', 'specialty', 'dob', 'patronus', 'signature'];
  const results = {};
  
  for (let fi = 0; fi < cfg.rows.length; fi++) {
    const ry = cfg.rows[fi];
    const fname = fieldNames[fi];
    
    // Find label end: rightmost dark pixel in left ~45% of card width
    let labelEnd = 80;
    for (let x = 80; x < Math.floor(width * 0.45); x++) {
      for (let dy = -8; dy <= 8; dy++) {
        if (ry + dy > 0 && ry + dy < height && isDark(getPixel(data, width, x, ry + dy))) {
          if (x > labelEnd) labelEnd = x;
          break;
        }
      }
    }
    
    // Find field right boundary: rightmost dark pixel on right side (dots end here)
    let fieldRight = Math.floor(width * 0.4);
    for (let x = width - 80; x > Math.floor(width * 0.4); x--) {
      for (let dy = -8; dy <= 8; dy++) {
        if (ry + dy > 0 && ry + dy < height && isDark(getPixel(data, width, x, ry + dy))) {
          if (x > fieldRight) fieldRight = x;
          break;
        }
      }
    }
    
    // Text start = right after label + small gap
    const textStart = labelEnd + 20;
    
    results[fname] = {
      x: Math.round(textStart * sx),
      xEnd: Math.round(fieldRight * sx),
      y: Math.round(ry * sy),
      patchTop: Math.round((ry - 50) * sy),
      patchBottom: Math.round((ry + 20) * sy),
    };
  }
  
  const photoBox = {
    x: Math.round(cfg.photoLeft * sx),
    y: Math.round(cfg.photoTop * sy),
    width: Math.round((cfg.photoRight - cfg.photoLeft) * sx),
    height: Math.round((cfg.photoBottom - cfg.photoTop) * sy)
  };
  
  console.log('\n' + id + ':');
  console.log('  photoBox:', JSON.stringify(photoBox));
  console.log('  fields:');
  for (const [k, v] of Object.entries(results)) {
    console.log('    ' + k + ':', JSON.stringify(v));
  }
}

for (const h of ['gryffindor', 'slytherin', 'hufflepuff', 'ravenclaw']) analyzeHouse(h);
