import { useEffect, useRef, useState } from 'react';

interface Props {
  /** current signature data URL ('' = empty) */
  value: string;
  onChange: (dataUrl: string) => void;
  accent?: string;
}

function setupCanvas(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#20201d';
  }
  return ctx;
}

export default function SignaturePad({ value, onChange, accent = '#740001' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [isEmpty, setIsEmpty] = useState(!value);

  // (re)render a previously drawn signature back onto the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;
    const ctx = setupCanvas(canvas);
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);
      const ratio = Math.min(w / img.width, h / img.height);
      const dw = img.width * ratio;
      const dh = img.height * ratio;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      setIsEmpty(false);
    };
    img.src = value;
  }, [value]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!canvas.width) setupCanvas(canvas);
    const ctx = canvas.getContext('2d')!;
    drawing.current = true;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    canvas.setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    commit();
  };

  const commit = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    // trim blank margins and return a transparent-background data URL
    const trimmed = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        if (trimmed.data[(y * canvas.width + x) * 4 + 3] > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < minX) {
      onChange('');
      setIsEmpty(true);
      return;
    }
    const pad = 8;
    const out = document.createElement('canvas');
    out.width = maxX - minX + pad * 2;
    out.height = maxY - minY + pad * 2;
    const octx = out.getContext('2d')!;
    octx.drawImage(
      canvas,
      minX - pad,
      minY - pad,
      maxX - minX + pad * 2,
      maxY - minY + pad * 2,
      0,
      0,
      out.width,
      out.height
    );
    const url = out.toDataURL('image/png');
    onChange(url);
    setIsEmpty(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
    onChange('');
    setIsEmpty(true);
  };

  return (
    <div>
      <div
        className="w-full overflow-hidden rounded-lg border"
        style={{ borderColor: `${accent}55`, background: 'transparent' }}
      >
        <canvas
          ref={canvasRef}
          className="block h-28 w-full touch-none"
          style={{ cursor: 'crosshair', touchAction: 'none' }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-60">
          {isEmpty ? 'sign with your mouse or finger' : 'signature ready'}
        </span>
        <button
          type="button"
          onClick={clear}
          className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-70 hover:opacity-100"
        >
          clear
        </button>
      </div>
    </div>
  );
}
