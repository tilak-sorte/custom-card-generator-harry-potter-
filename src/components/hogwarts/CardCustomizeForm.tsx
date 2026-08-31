import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { type HouseConfig } from '../../data/houses';
import CardFrontComposite, { type CardFields } from './CardFrontComposite';
import SignaturePad from './SignaturePad';
import PillButton from '../ui/PillButton';
import { downloadUrl, renderFrontComposite } from '../../utils/renderFrontCard';

interface Props {
  house: HouseConfig;
  frontSrc: string;
  backSrc: string;
  withCape: boolean;
  onToggleCape: () => void;
  initialPhoto?: string | null;
  initialFields?: CardFields;
  onBack: () => void;
  initialPhotoScale?: number;
  initialPhotoOffsetX?: number;
  initialPhotoOffsetY?: number;
  onDownloaded: () => void;
}

const emptyFields: CardFields = {
  name: '',
  specialty: '',
  dob: '',
  patronus: '',
  signature: '',
};

/** pick readable text color (ink or cream) for a given bg hex */
function readableOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#1b1a17' : '#f6f1e9';
}

const PAPER_COLORS = ['#f6f1e9', '#fbf6ea', '#e9ecf5', '#23272f', '#17151f'] as const;

export default function CardCustomizeForm({
  house,
  frontSrc,
  backSrc,
  withCape,
  onToggleCape,
  initialPhoto,
  initialFields,
  onBack,
  initialPhotoScale,
  initialPhotoOffsetX,
  initialPhotoOffsetY,
  onDownloaded,
}: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhoto ?? null);
  const [fields, setFields] = useState<CardFields>(initialFields ?? emptyFields);
  const [flipped, setFlipped] = useState(false);
  const [paperColor, setPaperColor] = useState<string>(PAPER_COLORS[0]);
  const [photoScale, setPhotoScale] = useState<number>(initialPhotoScale ?? 100);
  const [photoOffsetX, setPhotoOffsetX] = useState<number>(initialPhotoOffsetX ?? 0);
  const [photoOffsetY, setPhotoOffsetY] = useState<number>(initialPhotoOffsetY ?? 0);
  const [busy, setBusy] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accent = house.accent;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const updateField = (key: keyof CardFields) => (value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  const handleEnchant = async () => {
    if (!photoUrl || busy) return;
    setBusy(true);
    try {
      const frontPng = await renderFrontComposite({
        house,
        frontSrc,
        photoUrl,
        fields,
        photoScale,
        photoOffsetX,
        photoOffsetY,
      });
      await downloadUrl(frontPng, `${house.id}-id-front.png`);
      await downloadUrl(backSrc, `${house.id}-id-back.jpg`);
      onDownloaded();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full text-ink"
      style={{
        backgroundColor: paperColor,
        backgroundImage: `linear-gradient(rgba(27,26,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(27,26,23,0.05) 1px, transparent 1px), linear-gradient(180deg, ${accent}14 0%, ${accent}00 28%)`,
        backgroundSize: '48px 48px, 48px 48px, auto',
        color: readableOn(paperColor),
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col px-4 py-6 sm:px-8">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 font-mono text-sm hover:underline sm:text-lg"
          >
            ← <span className="hidden sm:inline">choose a different house</span>
            <span className="sm:hidden">back</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="font-display text-xl italic sm:text-2xl">
              {house.crestEmoji} {house.displayName}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* the card itself is the editor */}
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: 'preserve-3d', position: 'relative' }}
            >
              <div style={{ backfaceVisibility: 'hidden' }}>
                <CardFrontComposite
                  house={house}
                  frontSrc={frontSrc}
                  photoUrl={photoUrl}
                  fields={fields}
                  photoScale={photoScale}
                  photoOffsetX={photoOffsetX}
                  photoOffsetY={photoOffsetY}
                  editable
                  onFieldChange={updateField}
                  onPhotoClick={() => fileInputRef.current?.click()}
                  onPhotoDrag={(dx, dy) => {
                    setPhotoOffsetX((v) => v + dx);
                    setPhotoOffsetY((v) => v + dy);
                  }}
                />
              </div>
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  position: 'absolute',
                  inset: 0,
                  transform: 'rotateY(180deg)',
                }}
              >
                <img
                  src={backSrc}
                  alt={`${house.displayName} back`}
                  style={{ width: '100%', height: '100%', borderRadius: '4%' }}
                />
              </div>
            </motion.div>
          </div>

          {/* side panel */}
          <div
            className="flex flex-col gap-6 self-start p-6 shadow-2xl"
            style={{
              backgroundColor: 'transparent',
              color: readableOn(paperColor),
              border: `2px solid ${accent}`,
              borderRadius: '0px',
              outline: `1px solid ${accent}55`,
              outlineOffset: '4px',
            }}
          >
            <div className="text-center font-display text-xl italic tracking-widest" style={{ color: accent }}>
              Customization
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* 01 — Card Style */}
              <div className="flex flex-col gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">
                  01 — Card Style
                </p>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">Side</span>
                  <button
                    onClick={() => setFlipped((f) => !f)}
                    className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-black/5"
                    style={{ border: `1px solid ${accent}88`, borderRadius: '0px' }}
                  >
                    {flipped ? 'Front 🔄' : 'Back 🔄'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">Cape</span>
                  <div className="flex items-center gap-1">
                    <span className={`font-mono text-[9px] uppercase tracking-wider ${!withCape ? 'opacity-100 font-bold' : 'opacity-40'}`}>Off</span>
                    <button
                      onClick={onToggleCape}
                      aria-pressed={withCape}
                      role="switch"
                      aria-label="toggle cape"
                      className="flex h-5 w-9 items-center rounded-none p-0.5 transition-colors"
                      style={{ background: withCape ? accent : '#aaa' }}
                    >
                      <span
                        className="h-4 w-4 bg-white shadow transition-transform"
                        style={{ transform: withCape ? 'translateX(16px)' : 'translateX(0)' }}
                      />
                    </button>
                    <span className={`font-mono text-[9px] uppercase tracking-wider ${withCape ? 'opacity-100 font-bold' : 'opacity-40'}`}>On</span>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-2 block">Background</span>
                  <div className="flex flex-wrap gap-2">
                    {PAPER_COLORS.map((c) => (
                      <button
                        key={c}
                        aria-label={`backdrop ${c}`}
                        onClick={() => setPaperColor(c)}
                        className="h-8 w-8 border-2 transition-transform hover:scale-110"
                        style={{
                          background: c,
                          borderColor: paperColor === c ? accent : '#333',
                          borderRadius: '0px',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 02 — Portrait */}
              <div className="flex flex-col gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">
                  02 — Portrait
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-1 items-center justify-center rounded-none border-2 border-dashed py-6 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-black/5"
                  style={{ borderColor: `${accent}88` }}
                >
                  {photoUrl ? '📷 Change Portrait' : '📷 Upload Portrait'}
                </button>

                {photoUrl && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest opacity-60">
                      <span>Zoom</span>
                      <span>{photoScale}%</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={300}
                      step={1}
                      value={photoScale}
                      onChange={(e) => setPhotoScale(Number(e.target.value))}
                      aria-label="photo zoom"
                      className="mt-1"
                      style={{ width: '100%', accentColor: accent }}
                    />
                    <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-widest opacity-50">
                      Drag photo on card to align face
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="my-1 border-t border-black/10" />

            {/* 03 — Details */}
            <div className="flex flex-col gap-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">
                03 — Details
              </p>
              <p className="text-center font-mono text-[9px] uppercase tracking-widest opacity-50 mb-1">
                Click directly on the card text to edit your details
              </p>
              <div className="border border-black/10 bg-black/5 p-1" style={{ borderRadius: '0px' }}>
                <SignaturePad
                  value={fields.signature}
                  accent={accent}
                  onChange={(url) => updateField('signature')(url)}
                />
              </div>
            </div>

            <div className="my-2 border-t border-black/10" />

            <PillButton
              onClick={handleEnchant}
              disabled={!photoUrl || busy}
              variant="accent"
              showArrow={!!photoUrl}
              className="w-full py-3.5 text-sm font-bold tracking-widest"
              style={{ background: accent, borderColor: accent, color: readableOn(accent) }}
            >
              {busy ? 'Preparing…' : photoUrl ? 'Enchant ID →' : 'Upload Portrait First'}
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}
