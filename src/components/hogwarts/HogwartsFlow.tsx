import { useState } from 'react';
import { HOUSES, type HouseId } from '../../data/houses';
import { CARD_ASSETS } from '../../assets/cardAssets';
import HouseSelector from './HouseSelector';
import CardCustomizeForm from './CardCustomizeForm';
import EnjoyPage from './EnjoyPage';

type Step = 'select' | 'customize' | 'enjoy';

interface Props {
  onExitToGallery: () => void;
}

export default function HogwartsFlow({ onExitToGallery }: Props) {
  const [step, setStep] = useState<Step>('select');
  const [houseId, setHouseId] = useState<HouseId | null>(null);
  const [withCape, setWithCape] = useState<boolean>(true);

  if (step === 'select' || !houseId) {
    return (
      <HouseSelector
        onBack={onExitToGallery}
        onSelect={(id) => {
          setHouseId(id);
          setStep('customize');
        }}
      />
    );
  }

  const house = HOUSES[houseId];

  if (step === 'enjoy') {
    return (
      <EnjoyPage
        houseName={house.displayName}
        houseEmoji={house.crestEmoji}
        accent={house.accent}
        onMakeAnother={() => setStep('select')}
      />
    );
  }

  const frontSrc = CARD_ASSETS[withCape ? house.front : house.frontNoCape];
  const backSrc = CARD_ASSETS[house.back];

  return (
    <CardCustomizeForm
      house={house}
      frontSrc={frontSrc}
      backSrc={backSrc}
      withCape={withCape}
      onToggleCape={() => setWithCape((v) => !v)}
      onBack={() => setStep('select')}
      onDownloaded={() => setStep('enjoy')}
    />
  );
}
