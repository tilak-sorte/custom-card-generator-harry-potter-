import { BASE_H, BASE_W, type HouseConfig } from '../data/houses';
import type { CardFields } from '../components/hogwarts/CardFrontComposite';

const FONT_FAMILY = '"HarryP", "IM Fell English SC", serif';
const TEXT_COLOR = '#20201d';
const LABEL_COLOR = 'rgba(32, 32, 29, 0.38)';
const FONT_SIZE = (5.9 / 100) * BASE_W;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load image: ${src.slice(0, 80)}`));
    img.src = src;
  });
}

async function ensureFont() {
  try {
    await document.fonts.load(`400 ${FONT_SIZE}px ${FONT_FAMILY}`);
    await document.fonts.ready;
  } catch {
    /* canvas falls back to a serif; still renders */
  }
}

export interface RenderFrontOptions {
  house: HouseConfig;
  frontSrc: string;
  photoUrl: string | null;
  fields: CardFields;
  photoScale?: number;
  photoOffsetX?: number;
  photoOffsetY?: number;
}

export async function renderFrontComposite(opts: RenderFrontOptions): Promise<string> {
  const {
    house,
    frontSrc,
    photoUrl,
    fields,
    photoScale = 100,
    photoOffsetX = 0,
    photoOffsetY = 0,
  } = opts;

  const canvas = document.createElement('canvas');
  canvas.width = BASE_W;
  canvas.height = BASE_H;
  const ctx = canvas.getContext('2d')!;

  // 1. user photo clipped to the transparent hole
  if (photoUrl) {
    const photo = await loadImage(photoUrl);
    const box = house.photoBox;
    const cover = Math.max(box.width / photo.width, box.height / photo.height);
    const scale = cover * (photoScale / 100);
    const dw = photo.width * scale;
    const dh = photo.height * scale;
    const dx = box.x + (box.width - dw) / 2 + (photoOffsetX / 100) * box.width;
    const dy = box.y + (box.height - dh) / 2 + (photoOffsetY / 100) * box.height;
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.clip();
    ctx.drawImage(photo, dx, dy, dw, dh);
    ctx.restore();
  }

  // 2. front template over the photo (its transparent hole lets the photo show)
  const template = await loadImage(frontSrc);
  ctx.drawImage(template, 0, 0, BASE_W, BASE_H);

  // 3. detail text rendered directly on the dotted lines
  await ensureFont();
  ctx.font = `400 ${FONT_SIZE}px ${FONT_FAMILY}`;
  ctx.textBaseline = 'top';
  ctx.letterSpacing = `${0.04 * FONT_SIZE}px`;

  const entries: Array<{ key: keyof CardFields; label: string }> = [
    { key: 'name', label: 'name' },
    { key: 'specialty', label: 'specialty' },
    { key: 'dob', label: 'date of birth' },
    { key: 'patronus', label: 'patronus' },
  ];

  for (const { key, label } of entries) {
    const coord = house.fields[key];
    const value = fields[key] ?? '';
    const topY = coord.y - 0.78 * FONT_SIZE;
    ctx.save();
    ctx.beginPath();
    ctx.rect(coord.x, topY, coord.xEnd - coord.x, FONT_SIZE * 1.2);
    ctx.clip();
    ctx.fillStyle = value ? TEXT_COLOR : LABEL_COLOR;
    ctx.fillText(value || label, coord.x, topY);
    ctx.restore();
  }

  // 4. drawn signature bottom-anchored on the signature line
  if (fields.signature) {
    const sig = await loadImage(fields.signature);
    const coord = house.fields.signature;
    const startX = coord.x + (coord.xEnd - coord.x) * 0.15;
    const maxW = coord.xEnd - startX;
    const maxH = (52 / BASE_H) * BASE_H;
    const ratio = Math.min(maxW / sig.width, maxH / sig.height);
    const dw = sig.width * ratio;
    const dh = sig.height * ratio;
    const dx = startX;
    const dy = coord.y + 18 - dh;
    ctx.drawImage(sig, dx, dy, dw, dh);
  }

  return canvas.toDataURL('image/png');
}

export async function downloadUrl(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}