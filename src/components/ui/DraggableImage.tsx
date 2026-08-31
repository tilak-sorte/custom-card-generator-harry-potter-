import { useEffect, useRef, useState } from 'react';

interface DraggableImageProps {
  src: string;
  alt?: string;
  initialX: number;
  initialY: number;
  width: number;
  zIndex?: number;
  /** height/width ratio, used to keep the image inside the viewport while dragging */
  aspectRatio?: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

let topZ = 100;

export default function DraggableImage({
  src,
  alt = '',
  initialX,
  initialY,
  width,
  zIndex = 1,
  aspectRatio = 1,
}: DraggableImageProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: initialX, y: initialY });
  const target = useRef({ x: initialX, y: initialY });
  const grabbed = useRef({ on: false, offsetX: 0, offsetY: 0 });
  const scale = useRef(1);
  const rot = useRef(0);
  const rafRef = useRef<number | null>(null);
  const drift = useRef({
    t: Math.random() * 100,
    baseX: initialX,
    baseY: initialY,
    ampX: width * 0.3,
    ampY: width * 0.16,
    speed: 1.2 + Math.random() * 0.8,
    rotAmp: 2 + Math.random() * 2,
  });
  const height = width * aspectRatio;
  const [z, setZ] = useState(zIndex);

  const tickRef = useRef<() => void>(() => {});

  useEffect(() => {
    const tick = () => {
      const p = pos.current;
      const t = target.current;
      const dragging = grabbed.current.on;

      if (!dragging) {
        const d = drift.current;
        d.t += 0.01 * d.speed;
        t.x = d.baseX + Math.sin(d.t) * d.ampX;
        t.y = d.baseY + Math.cos(d.t * 0.72) * d.ampY;
        rot.current = Math.sin(d.t * 0.6) * d.rotAmp;
      }

      const damping = dragging ? 0.55 : 0.1;
      p.x += (t.x - p.x) * damping;
      p.y += (t.y - p.y) * damping;

      const targetScale = dragging ? 1.06 : 1;
      scale.current += (targetScale - scale.current) * (dragging ? 0.3 : 0.08);
      if (dragging) rot.current = 0;
      const rotate = dragging ? 0 : rot.current;

      const el = elRef.current;
      if (el) {
        el.style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0) scale(${scale.current.toFixed(3)}) rotate(${rotate.toFixed(2)}deg)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    tickRef.current = tick;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  const ensureLoop = () => {
    if (rafRef.current == null) tickRef.current();
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const el = elRef.current;
    if (!el) return;
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    grabbed.current = { on: true, offsetX: e.clientX - pos.current.x, offsetY: e.clientY - pos.current.y };
    setZ(++topZ);
    el.style.cursor = 'grabbing';
    ensureLoop();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!grabbed.current.on) return;
    const g = grabbed.current;
    target.current.x = clamp(e.clientX - g.offsetX, 0, window.innerWidth - width);
    target.current.y = clamp(e.clientY - g.offsetY, 0, window.innerHeight - height);
    ensureLoop();
  };

  const endDrag = () => {
    grabbed.current.on = false;
    const d = drift.current;
    d.baseX = clamp(target.current.x, 0, window.innerWidth - width);
    d.baseY = clamp(target.current.y, 0, window.innerHeight - height);
    const el = elRef.current;
    if (el) el.style.cursor = 'grab';
  };

  const stopDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!grabbed.current.on) return;
    endDrag();
    elRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const onLostPointerCapture = () => {
    endDrag();
  };

  return (
    <div
      ref={elRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onLostPointerCapture={onLostPointerCapture}
      className="fixed left-0 top-0 select-none"
      style={
        {
          width,
          height,
          zIndex: z,
          cursor: 'grab',
          touchAction: 'none',
          willChange: 'transform',
          userSelect: 'none',
          WebkitUserDrag: 'none',
          WebkitTapHighlightColor: 'transparent',
          filter: 'drop-shadow(0 12px 16px rgba(210,10,46,0.2))',
        } as React.CSSProperties
      }
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={
          {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserDrag: 'none',
          } as React.CSSProperties
        }
      />
    </div>
  );
}