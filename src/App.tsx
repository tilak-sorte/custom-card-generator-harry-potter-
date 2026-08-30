import { useState } from 'react';
import LandingPage from './components/landing/LandingPage';
import TemplateGallery from './components/landing/TemplateGallery';
import HogwartsFlow from './components/hogwarts/HogwartsFlow';
import VinylPlayer from './components/ui/VinylPlayer';

type Screen = 'landing' | 'gallery' | 'hogwarts';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');

  if (screen === 'landing') {
    return (
      <>
        <LandingPage onBrowse={() => setScreen('gallery')} />
        <VinylPlayer />
      </>
    );
  }

  if (screen === 'gallery') {
    return (
      <>
        <TemplateGallery
          onBack={() => setScreen('landing')}
          onSelectTheme={(id) => {
            if (id === 'hogwarts') setScreen('hogwarts');
          }}
        />
        <VinylPlayer />
      </>
    );
  }

  return (
    <>
      <HogwartsFlow onExitToGallery={() => setScreen('gallery')} />
      <VinylPlayer />
    </>
  );
}
