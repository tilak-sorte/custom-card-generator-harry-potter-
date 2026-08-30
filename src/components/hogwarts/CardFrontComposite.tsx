import { forwardRef, useRef } from 'react';
import { BASE_W, BASE_H, type HouseConfig, type FieldCoord } from '../../data/houses';

export interface CardFields {
  name: string;
  specialty: string;
  dob: string;
  patronus: string;
  /** data URL of the drawn signature ('' = none) */
  signature: string;
}

interface Props {
  house: HouseConfig;
  frontSrc: string;
  photoUrl: string | null;
  fields: CardFields;
  /** photo zoom in %: 100 = original size (fills the frame), >100 zooms in, <100 zooms out */
  photoScale?: number;
  /** horizontal photo offset in % of the photo-box width (negative = left). 0 = horizontally centered. */
  photoOffsetX?: number;
  /** vertical photo offset in % of the photo-box height (negative = up). 0 = vertically centered. */
  photoOffsetY?: number;
  /** whether photo drag / zoom is enabled during editing */
  editable?: boolean;
  onFieldChange?: (field: keyof CardFields) => (value: string) => void;
  onPhotoClick?: () => void;
  /** called with the horizontal and vertical drag delta in photo-box-% while the user drags the photo */
  onPhotoDrag?: (dxPercent: number, dyPercent: number) => void;
}

const pct = (v: number, base: number) => `${(v / base) * 100}%`;

const TEXT_STYLE = {
  position: 'absolute',
  fontSize: 'min(5.9cqw, 999px)',
  lineHeight: 1,
  letterSpacing: '0.04em',
  color: '#20201d',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
} as const;

function TextField({
  field,
  coord,
  value,
  placeholder,
  editable,
  onFieldChange,
}: {
  field: keyof CardFields;
  coord: FieldCoord;
  value: string;
  placeholder: string;
  editable: boolean;
  onFieldChange?: Props['onFieldChange'];
}) {
  const common = {
    left: pct(coord.x + 16, BASE_W),
    top: pct(coord.y, BASE_H),
    width: pct(coord.xEnd - coord.x - 16, BASE_W),
    transform: 'translateY(-78%)',
  };
  return (
    <>
      {editable ? (
        <input
          type="text"
          className="handwriting card-field"
          value={value}
          placeholder={placeholder}
          maxLength={30}
          spellCheck={false}
          autoCapitalize="words"
          onChange={(e) => onFieldChange?.(field)(e.target.value)}
          style={
            {
              ...TEXT_STYLE,
              ...common,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              margin: 0,
              padding: 0,
            } as React.CSSProperties
          }
        />
      ) : (
        <div className="handwriting" style={{ ...TEXT_STYLE, ...common } as React.CSSProperties}>
          {value}
        </div>
      )}
    </>
  );
}

/** rendered signature (drawn data URL) placed on the signature line */
function SignatureImage({ coord, src }: { coord: FieldCoord; src: string }) {
  const startX = coord.x + (coord.xEnd - coord.x) * 0.15;
  return (
    <img
      src={src}
      alt="Your signature"
      style={{
        position: 'absolute',
        left: pct(startX, BASE_W),
        top: pct(coord.y + 18, BASE_H),
        width: pct(coord.xEnd - startX, BASE_W),
        maxHeight: pct(52, BASE_H),
        objectFit: 'contain',
        objectPosition: 'left bottom',
        transform: 'translateY(-100%)',
        opacity: src ? 1 : 0,
        pointerEvents: 'none',
      }}
    />
  );
}

const CardFrontComposite = forwardRef<HTMLDivElement, Props>(
  (
    {
      house,
      frontSrc,
      photoUrl,
      fields,
      photoScale = 100,
      photoOffsetX = 0,
      photoOffsetY = 0,
      editable = false,
      onFieldChange,
      onPhotoClick,
      onPhotoDrag,
    },
    ref
  ) => {
    const { photoBox } = house;
    const boxRef = useRef<HTMLDivElement>(null);
    const drag = useRef<{ on: boolean; lastX: number; lastY: number }>({ on: false, lastX: 0, lastY: 0 });
    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${BASE_W} / ${BASE_H}`,
          containerType: 'inline-size',
          overflow: 'hidden',
          borderRadius: '4%',
          background: 'transparent',
        }}
      >
        {/* 1. user photo, sits behind the template's transparent hole */}
        {photoUrl && (
          <div
            ref={boxRef}
            style={{
              position: 'absolute',
              left: pct(photoBox.x, BASE_W),
              top: pct(photoBox.y, BASE_H),
              width: pct(photoBox.width, BASE_W),
              height: pct(photoBox.height, BASE_H),
              overflow: 'hidden',
              cursor: editable && onPhotoDrag ? 'move' : 'default',
              touchAction: 'none',
            }}
            onPointerDown={(e) => {
              if (!editable || !onPhotoDrag) return;
              drag.current = { on: true, lastX: e.clientX, lastY: e.clientY };
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current.on) return;
              // photo-box width and height in px
              const widthPx = boxRef.current?.clientWidth ?? 0;
              const boxHpx = widthPx * (photoBox.height / photoBox.width);
              
              const dx = e.clientX - drag.current.lastX;
              const dy = e.clientY - drag.current.lastY;
              
              drag.current.lastX = e.clientX;
              drag.current.lastY = e.clientY;
              
              onPhotoDrag?.(
                (dx / Math.max(widthPx, 1)) * 100,
                (dy / Math.max(boxHpx, 1)) * 100
              );
            }}
            onPointerUp={() => (drag.current.on = false)}
            onPointerCancel={() => (drag.current.on = false)}
          >
            <img
              src={photoUrl}
              alt="your photo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // zoom from center + pan so the face can be positioned
                transformOrigin: 'center',
                transform: `translateX(${photoOffsetX}%) translateY(${photoOffsetY}%) scale(${photoScale / 100})`,
              }}
            />
          </div>
        )}

        {/* click-to-upload affordance shown inside the photo hole while editing */}
        {editable && (
          <button
            type="button"
            aria-label={photoUrl ? 'change your photo' : 'add your photo'}
            onClick={onPhotoClick}
            style={
              {
                position: 'absolute',
                left: pct(photoBox.x, BASE_W),
                top: pct(photoBox.y, BASE_H),
                width: pct(photoBox.width, BASE_W),
                height: pct(photoBox.height, BASE_H),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontSize: 'min(3.4cqw, 999px)',
                lineHeight: 1.4,
                textAlign: 'center',
                padding: '0 4cqw',
                color: '#20201d',
                opacity: photoUrl ? 0 : 1,
                userSelect: 'none',
                transition: 'opacity 0.2s',
                // only intercept clicks when empty; let the photo receive drags
                pointerEvents: photoUrl ? 'none' : 'auto',
                border: photoUrl
                  ? 'none'
                  : '2px dashed rgba(32,32,29,0.5)',
                borderRadius: '1.2%',
                background: photoUrl
                  ? 'transparent'
                  : 'rgba(32,32,29,0.05)',
              } as React.CSSProperties
            }
          >
            {photoUrl ? 'change photo' : 'add your photo'}
          </button>
        )}

        {/* 2. front template on top -- its transparent hole lets the photo show through */}
        <img
          src={frontSrc}
          alt={`${house.displayName} front template`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        />

        {/* 3. text overlays on the dotted lines (rendered directly on the blanked art) */}
        {(
          [
            { key: 'name', label: 'name' },
            { key: 'specialty', label: 'specialty' },
            { key: 'dob', label: 'date of birth' },
            { key: 'patronus', label: 'patronus' },
          ] as const
        ).map(({ key, label }) => (
          <TextField
            key={key}
            field={key}
            coord={house.fields[key]}
            value={fields[key]}
            placeholder={label}
            editable={editable}
            onFieldChange={onFieldChange}
          />
        ))}

        {/* 4. drawn signature, rendered directly on the signature line */}
        {fields.signature && (
          <SignatureImage coord={house.fields.signature} src={fields.signature} />
        )}
      </div>
    );
  }
);

CardFrontComposite.displayName = 'CardFrontComposite';
export default CardFrontComposite;