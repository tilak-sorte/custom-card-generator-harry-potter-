import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropImage';

interface Props {
  imageSrc: string;
  aspect: number;
  onCancel: () => void;
  onConfirm: (croppedDataUrl: string) => void;
}

export default function PhotoCropModal({ imageSrc, aspect, onCancel, onConfirm }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setBusy(true);
    try {
      const dataUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      onConfirm(dataUrl);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape="rect"
          showGrid={true}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="flex flex-col gap-3 bg-black/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <label className="flex items-center gap-3 text-sm text-white">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />
        </label>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-white/30 py-3 font-semibold text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={busy}
            className="flex-1 rounded-lg bg-amber-400 py-3 font-semibold text-black disabled:opacity-50"
          >
            {busy ? 'Cropping…' : 'Use this photo'}
          </button>
        </div>
      </div>
    </div>
  );
}
