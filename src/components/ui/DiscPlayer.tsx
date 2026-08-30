import { useEffect, useRef, useState, startTransition, type CSSProperties } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface DiscPlayerProps {
  audioFile?: string;
  backgroundColor?: string;
  discColor?: string;
  discImage?: { src: string } | null;
  needleDotColor?: string;
  style?: CSSProperties;
}

export default function DiscPlayer({
  audioFile,
  backgroundColor = 'transparent',
  discColor = '#333333',
  discImage,
  needleDotColor = '#FF5588',
  style,
}: DiscPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const discControls = useAnimation();
  const needleControls = useAnimation();
  const discRotationRef = useRef(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioFile);
      audioRef.current.loop = false;
      audioRef.current.addEventListener('ended', () => {
        hasStartedRef.current = false;
        startTransition(() => {
          setIsPlaying(false);
        });
      });
    } else {
      audioRef.current.src = audioFile ?? '';
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [audioFile]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        audioRef.current.currentTime = 49;
      }
      audioRef.current.play();
      needleControls.start({
        rotate: 0,
        transition: { duration: 1.2, ease: [0.32, 0.72, 0, 1] },
      });
      discControls.start({
        rotate: [discRotationRef.current, discRotationRef.current + 360],
        transition: { duration: 3, ease: 'linear', repeat: Infinity, repeatType: 'loop' },
      });
    } else {
      audioRef.current.pause();
      discControls.stop();
      const currentTime = audioRef.current.currentTime || 0;
      const rotationsPerSecond = 1 / 3;
      const additionalRotation = (currentTime * rotationsPerSecond * 360) % 360;
      discRotationRef.current = (discRotationRef.current + additionalRotation) % 360;
      discControls.set({ rotate: discRotationRef.current });
      needleControls.start({
        rotate: 15,
        transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] },
      });
    }
  }, [isPlaying, discControls, needleControls]);

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '80%',
          aspectRatio: '1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <motion.div
          animate={discControls}
          initial={{ rotate: 0 }}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: discColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundImage: discImage ? `url(${discImage.src})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          onClick={togglePlayback}
        >
          <div
            style={{
              width: '30%',
              height: '30%',
              borderRadius: '50%',
              background: `radial-gradient(circle, #888888 0%, ${discColor} 70%)`,
              boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${85 - i * 10}%`,
                height: `${85 - i * 10}%`,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: '1px solid rgba(0, 0, 0, 0.2)',
              }}
            />
          ))}
        </motion.div>

        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '-5%',
            width: '35%',
            height: '10%',
            transformOrigin: 'right center',
            zIndex: 10,
          }}
        >
          <motion.div
            animate={needleControls}
            initial={{ rotate: 15 }}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformOrigin: 'right center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#888',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '90%',
                height: 4,
                backgroundColor: '#888',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -5,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: needleDotColor,
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}