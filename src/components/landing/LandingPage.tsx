import { motion } from 'framer-motion';
import PillButton from '../ui/PillButton';
import DraggableImage from '../ui/DraggableImage';
import hatImg from '../../assets/hero/wand-logo.png';
import harryImg from '../../assets/hero/wand-logo.png';
import objectsImg from '../../assets/hero/wand-logo.png';
import wandImg from '../../assets/hero/wand-logo.png';

interface Props {
  onBrowse: () => void;
}

export default function LandingPage({ onBrowse }: Props) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const w = Math.min(210, vw * 0.5);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-paper bg-grid">
      {/* floating draggable PNGs */}
      <DraggableImage
        src={hatImg}
        alt="wizard hat"
        initialX={vw * 0.08}
        initialY={vh * 0.12}
        width={w}
        zIndex={30}
        aspectRatio={643 / 1194}
      />
      <DraggableImage
        src={harryImg}
        alt="harry potter"
        initialX={vw * 0.62}
        initialY={vh * 0.14}
        width={w}
        zIndex={31}
        aspectRatio={677 / 1119}
      />
      <DraggableImage
        src={objectsImg}
        alt="magical objects"
        initialX={vw * 0.1}
        initialY={vh * 0.68}
        width={w}
        zIndex={32}
        aspectRatio={601 / 821}
      />
      <DraggableImage
        src={wandImg}
        alt="wand logo"
        initialX={vw * 0.84}
        initialY={vh * 0.1}
        width={w}
        zIndex={33}
        aspectRatio={10653 / 5311}
      />

      {/* center content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-3 font-mono text-lg text-ink/60"
        >
          ??????
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl font-pixel text-[clamp(1.5rem,4.8vw,4rem)] leading-[1.35] tracking-[0.02em] text-ink"
        >
          forge your own (official badge)
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-4 font-sans text-sm font-medium text-ink/70"
        >
          pick a theme, fill it in, hang it on a lanyard you can throw around
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <PillButton showArrow onClick={onBrowse} className="px-7 py-3 text-lg">
            📁 browse templates
          </PillButton>
          <a
            href="https://buymeacoffee.com/teeluck27"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-accent bg-[#FFDD00] px-7 py-3 text-lg font-sans font-semibold text-ink transition hover:-translate-y-0.5 active:translate-y-0"
          >
            ☕ Buy me a coffee
            <span aria-hidden>↗</span>
          </a>
        </motion.div>

        <p className="mt-6 font-mono text-xs tracking-wide text-ink/50">
          drag the props around · they don't do anything, they're just fun
        </p>
      </div>
    </div>
  );
}