import { motion } from 'framer-motion';

interface Props {
  houseName: string;
  houseEmoji: string;
  accent: string;
  onMakeAnother: () => void;
}

export default function EnjoyPage({ houseName, houseEmoji, accent, onMakeAnother }: Props) {
  return (
    <div className="min-h-screen w-full bg-paper bg-grid px-6 py-10 text-ink">
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-3 font-mono text-lg text-ink/60"
        >
          🎉 download complete
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-pixel text-[clamp(1.5rem,4.8vw,3.2rem)] leading-[1.35] tracking-[0.02em] text-ink"
        >
          enjoy your {houseEmoji} {houseName} ID
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-4 max-w-lg font-sans text-sm font-medium text-ink/70"
        >
          hang it on a lanyard, throw it around, show it off. if it made you smile, share
          some love ⚡
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="https://www.instagram.com/tilakdoesstuff/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 px-7 py-3 text-lg font-sans font-semibold transition hover:-translate-y-0.5 active:translate-y-0"
            style={{ borderColor: accent, color: accent }}
          >
            📸 Follow me
            <span aria-hidden>↗</span>
          </a>
          <a
            href="https://buymeacoffee.com/teeluck27"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 bg-[#FFDD00] px-7 py-3 text-lg font-sans font-semibold text-ink transition hover:-translate-y-0.5 active:translate-y-0"
            style={{ borderColor: accent }}
          >
            ☕ Buy me a coffee
            <span aria-hidden>↗</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <button
            onClick={onMakeAnother}
            className="font-mono text-sm text-ink/60 underline-offset-4 hover:underline"
          >
            ← make another one
          </button>
        </motion.div>
      </div>
    </div>
  );
}