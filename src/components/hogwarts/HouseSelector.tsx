import { motion } from 'framer-motion';
import { HOUSE_LIST, type HouseId } from '../../data/houses';
import PillButton from '../ui/PillButton';
import hpBackground from '../../assets/background-harry-potter.png';
import gryffindorCrest from '../../assets/crests/gryffindor.png';
import slytherinCrest from '../../assets/crests/slytherin.png';
import hufflepuffCrest from '../../assets/crests/hufflepuff.png';
import ravenclawCrest from '../../assets/crests/ravenclaw.png';

const CRESTS: Record<HouseId, string> = {
  gryffindor: gryffindorCrest,
  slytherin: slytherinCrest,
  hufflepuff: hufflepuffCrest,
  ravenclaw: ravenclawCrest,
};

interface Props {
  onBack: () => void;
  onSelect: (id: HouseId) => void;
}

export default function HouseSelector({ onBack, onSelect }: Props) {
  return (
    <div className="min-h-screen w-full bg-paper bg-grid px-6 py-10 text-ink">
      <PillButton variant="ghost" onClick={onBack} className="mb-8 px-5 py-2">
        ← back to templates
      </PillButton>

      <div
        className="mx-auto mb-12 flex max-w-3xl flex-col items-center justify-center p-20 text-center"
        style={{
          backgroundImage: `url(${hpBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="font-hp text-5xl text-white drop-shadow-lg sm:text-6xl">
          Choose your house
        </h1>
        <p className="mt-3 font-hp text-xl text-white/90 drop-shadow">
          The Sorting Hat has retired for the evening — you'll have to pick for yourself.
        </p>
      </div>

        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 sm:gap-8">
          {HOUSE_LIST.map((h, i) => (
            <div
              key={h.id}
              className={`group ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'} transition-transform duration-300 group-hover:rotate-0`}
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={() => onSelect(h.id)}
                className="flex w-full flex-col items-center gap-3 rounded-2xl border bg-paper p-8 transition-colors group-hover:rotate-0"
                style={{
                  borderColor: h.accent,
                  boxShadow: `0 0 0 1px ${h.accent}22, 0 10px 28px -12px ${h.accent}66`,
                }}
              >
                <motion.img
                  src={CRESTS[h.id]}
                  alt={`${h.displayName} crest`}
                  className="h-24 w-auto object-contain sm:h-28"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' } }}
                />
                <span className="font-hp text-base text-ink/50">[[ {h.id} ]]</span>
                <span className="font-hp text-3xl" style={{ color: h.accentSoft }}>
                  {h.displayName}
                </span>
                <span className="text-center font-hp text-lg text-ink/60">{h.tagline}</span>
              </motion.button>
            </div>
          ))}
        </div>
    </div>
  );
}