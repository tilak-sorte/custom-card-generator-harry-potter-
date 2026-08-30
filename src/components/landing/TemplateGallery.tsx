import { motion } from 'framer-motion';
import { THEMES } from '../../data/themes';
import PillButton from '../ui/PillButton';
import hogwartsLogo from '../../assets/hogwarts-logo.png';

interface Props {
  onBack: () => void;
  onSelectTheme: (id: string) => void;
}

export default function TemplateGallery({ onBack, onSelectTheme }: Props) {
  return (
    <div className="min-h-screen w-full bg-paper bg-grid px-6 py-10">
      <PillButton variant="ghost" onClick={onBack} className="mb-8 px-5 py-2">
        ← back
      </PillButton>

      <div className="mx-auto mb-10 flex max-w-4xl items-center gap-3">
        <h1 className="font-hp text-5xl text-ink">templates</h1>
        <span className="text-4xl">🖍️</span>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        {THEMES.map((theme, i) => (
          <motion.button
            key={theme.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={theme.ready ? { y: -4 } : {}}
            disabled={!theme.ready}
            onClick={() => theme.ready && onSelectTheme(theme.id)}
            className={`group relative overflow-hidden rounded-2xl border-2 border-ink bg-paper p-6 text-left transition ${
              theme.ready ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
            }`}
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
              project 0{i + 1}
            </span>
            {theme.id === 'hogwarts' ? (
              <img
                src={hogwartsLogo}
                alt={theme.name}
                className="mx-auto my-4 h-24 w-full object-contain"
              />
            ) : (
              <>
                <div className="mt-4 mb-4 text-5xl">{theme.emoji}</div>
                <h2 className="font-display text-2xl italic font-medium text-ink">{theme.name}</h2>
              </>
            )}
            <p className="mt-1 font-sans text-sm text-ink/70">{theme.blurb}</p>
            {!theme.ready && (
              <span className="absolute right-4 top-4 font-mono text-xs text-ink/50">
                [ coming soon ]
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
