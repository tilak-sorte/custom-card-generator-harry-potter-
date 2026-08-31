import { motion } from 'framer-motion';
import PillButton from '../ui/PillButton';
import DraggableImage from '../ui/DraggableImage';
import hatImg from '../../assets/hero/hat.png';
import harryImg from '../../assets/hero/harry.png';
import object1Img from '../../assets/hero/object1.png';
import object2Img from '../../assets/hero/object2.png';
import object3Img from '../../assets/hero/object3.png';
import wandImg from '../../assets/hero/wand-logo.png';

interface Props {
  onBrowse: () => void;
}

export default function LandingPage({ onBrowse }: Props) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const w = Math.min(140, vw * 0.3);

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
        src={object1Img}
        alt="magical object 1"
        initialX={vw * 0.02}
        initialY={vh * 0.52}
        width={w * 0.35}
        zIndex={32}
        aspectRatio={210 / 170}
      />
      <DraggableImage
        src={object2Img}
        alt="magical object 2"
        initialX={vw * 0.72}
        initialY={vh * 0.5}
        width={w * 0.4}
        zIndex={31}
        aspectRatio={370 / 270}
      />
      <DraggableImage
        src={object3Img}
        alt="magical object 3"
        initialX={vw * 0.02}
        initialY={vh * 0.84}
        width={w * 0.45}
        zIndex={33}
        aspectRatio={370 / 340}
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
          <span className="relative inline-flex items-center">
            <a
              href="https://buymeachai.in/tilakdoesstuff"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-accent bg-[#FFDD00] px-7 py-3 text-lg font-sans font-semibold text-ink transition hover:-translate-y-0.5 active:translate-y-0"
            >
              ☕ Buy me a chai
              <span aria-hidden>↗</span>
            </a>

            {/* handwritten curve pointing into the buy-me-a-chai button */}
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewBox="0 0 150 44"
              aria-hidden
              style={{ fontFamily: 'Caveat, cursive' }}
              className="pointer-events-none absolute -left-[118px] top-1/2 hidden w-[110px] -translate-y-1/2 text-ink/70 sm:block"
            >
              <defs>
                <marker id="donateArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
                </marker>
              </defs>
              <path
                id="donateCurve"
                d="M6 36 C 34 32, 50 16, 144 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 3"
                strokeLinecap="round"
                markerEnd="url(#donateArrow)"
              />
              <text className="fill-current text-[15px] font-bold tracking-wide">
                <textPath href="#donateCurve" startOffset="8%">
                  consider donating
                </textPath>
              </text>
            </motion.svg>

            {/* mobile variant: curve above the button pointing down into it */}
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewBox="0 0 150 60"
              aria-hidden
              style={{ fontFamily: 'Caveat, cursive' }}
              className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 w-[140px] -translate-x-1/2 text-ink sm:hidden"
            >
              <defs>
                <marker id="donateArrowM" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
                </marker>
              </defs>
              <path
                id="donateCurveM"
                d="M8 12 C 40 6, 60 20, 72 46"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 3"
                strokeLinecap="round"
                markerEnd="url(#donateArrowM)"
              />
              <text className="fill-current text-[17px] font-bold tracking-wide">
                <textPath href="#donateCurveM" startOffset="6%">
                  consider donating
                </textPath>
              </text>
            </motion.svg>
          </span>
        </motion.div>

        <p className="mt-6 font-mono text-xs tracking-wide text-ink/50">
          drag the props around · they don't do anything, they're just fun
        </p>
      </div>
    </div>
  );
}