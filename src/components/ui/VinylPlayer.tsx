import { motion } from 'framer-motion';
import DiscPlayer from './DiscPlayer';
import prologueAudio from '../../../01 - Prologue.mp3';
import backgroundImg from '../../assets/vinyl-bg.jpg';

export default function VinylPlayer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="fixed right-4 top-4 z-[60] h-24 w-24 sm:h-[125px] sm:w-[125px]"
    >
      <DiscPlayer audioFile={prologueAudio} discImage={{ src: backgroundImg }} />
    </motion.div>
  );
}