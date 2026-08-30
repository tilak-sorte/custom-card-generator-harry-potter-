// Per-house calibration data, derived by pixel-analysing the final 2048×3070 card PNGs.
// Coordinates are expressed in the 1024×1536 logical space (= native card size ÷ 2)
// and get scaled responsively by the components that use them.

export type HouseId = 'gryffindor' | 'slytherin' | 'hufflepuff' | 'ravenclaw';

export type FieldKey = 'name' | 'specialty' | 'dob' | 'patronus' | 'signature';

export interface FieldCoord {
  /** left x where the answer text should start */
  x: number;
  /** right x boundary the answer text should not exceed */
  xEnd: number;
  /** baseline y for the answer text (sits just above the dotted rule) */
  y: number;
  /** patch used to cover the baked sample text before drawing the new answer */
  patchTop: number;
  patchBottom: number;
}

export interface HouseConfig {
  id: HouseId;
  displayName: string;
  tagline: string;
  accent: string;
  accentSoft: string;
  crestEmoji: string;
  front: string; // template with transparent photo box + baked labels/dotted lines (with cape)
  frontNoCape: string; // same front template, character without cape
  back: string; // finished static back art
  width: number;
  height: number;
  photoBox: { x: number; y: number; width: number; height: number };
  patchColor: string;
  fields: Record<FieldKey, FieldCoord>;
}

export const BASE_W = 1024;
export const BASE_H = 1536;

// Calibrated from the new 2048×3070 artwork, scaled to 1024×1536 logical space.
const seed = {
  gryffindor: {
    photoBox: { x: 232, y: 316, width: 529, height: 685 },
    fields: {
      name:      { x: 228, xEnd: 962, y: 969,  patchTop: 944,  patchBottom: 979  },
      specialty: { x: 319, xEnd: 957, y: 1034, patchTop: 1009, patchBottom: 1044 },
      dob:       { x: 213, xEnd: 955, y: 1098, patchTop: 1073, patchBottom: 1108 },
      patronus:  { x: 345, xEnd: 955, y: 1160, patchTop: 1135, patchBottom: 1170 },
      signature: { x: 94,  xEnd: 984, y: 1349, patchTop: 1324, patchBottom: 1359 },
    },
  },
  slytherin: {
    photoBox: { x: 234, y: 322, width: 512, height: 663 },
    fields: {
      name:      { x: 243, xEnd: 953, y: 953,  patchTop: 928,  patchBottom: 963  },
      specialty: { x: 322, xEnd: 950, y: 1016, patchTop: 991,  patchBottom: 1026 },
      dob:       { x: 218, xEnd: 948, y: 1080, patchTop: 1055, patchBottom: 1090 },
      patronus:  { x: 358, xEnd: 948, y: 1143, patchTop: 1118, patchBottom: 1153 },
      signature: { x: 92,  xEnd: 970, y: 1356, patchTop: 1331, patchBottom: 1366 },
    },
  },
  hufflepuff: {
    photoBox: { x: 241, y: 321, width: 498, height: 644 },
    fields: {
      name:      { x: 257, xEnd: 920, y: 961,  patchTop: 936,  patchBottom: 971  },
      specialty: { x: 331, xEnd: 923, y: 1035, patchTop: 1010, patchBottom: 1045 },
      dob:       { x: 235, xEnd: 922, y: 1110, patchTop: 1085, patchBottom: 1120 },
      patronus:  { x: 368, xEnd: 922, y: 1182, patchTop: 1157, patchBottom: 1192 },
      signature: { x: 104, xEnd: 959, y: 1351, patchTop: 1326, patchBottom: 1361 },
    },
  },
  ravenclaw: {
    photoBox: { x: 252, y: 326, width: 490, height: 633 },
    fields: {
      name:      { x: 256, xEnd: 919, y: 961,  patchTop: 936,  patchBottom: 971  },
      specialty: { x: 330, xEnd: 923, y: 1035, patchTop: 1010, patchBottom: 1045 },
      dob:       { x: 225, xEnd: 921, y: 1096, patchTop: 1071, patchBottom: 1106 },
      patronus:  { x: 367, xEnd: 922, y: 1182, patchTop: 1157, patchBottom: 1192 },
      signature: { x: 103, xEnd: 948, y: 1395, patchTop: 1370, patchBottom: 1405 },
    },
  },
};

// The new art is not uniformly mapped across houses, so each house carries its
// own calibration (see `seed` above).
export const HOUSES: Record<HouseId, HouseConfig> = {
  gryffindor: {
    id: 'gryffindor',
    displayName: 'Gryffindor',
    tagline: 'Where dwell the brave at heart',
    accent: '#740001',
    accentSoft: '#ae0001',
    crestEmoji: '🦁',
    front: 'gryffindor_front.png',
    frontNoCape: 'gryffindor_front_nocape.png',
    back: 'gryffindor_back.png',
    width: BASE_W,
    height: BASE_H,
    photoBox: seed.gryffindor.photoBox,
    patchColor: 'rgb(214,210,201)',
    fields: seed.gryffindor.fields,
  },
  slytherin: {
    id: 'slytherin',
    displayName: 'Slytherin',
    tagline: 'Those cunning folk use any means',
    accent: '#1a472a',
    accentSoft: '#2a623d',
    crestEmoji: '🐍',
    front: 'slytherin_front.png',
    frontNoCape: 'slytherin_front_nocape.png',
    back: 'slytherin_back.png',
    width: BASE_W,
    height: BASE_H,
    photoBox: seed.slytherin.photoBox,
    patchColor: 'rgb(215,214,205)',
    fields: seed.slytherin.fields,
  },
  hufflepuff: {
    id: 'hufflepuff',
    displayName: 'Hufflepuff',
    tagline: 'Just and loyal, patient and true',
    accent: '#ecb939',
    accentSoft: '#f0c75e',
    crestEmoji: '🦡',
    front: 'hufflepuff_front.png',
    frontNoCape: 'hufflepuff_front_nocape.png',
    back: 'hufflepuff_back.png',
    width: BASE_W,
    height: BASE_H,
    photoBox: seed.hufflepuff.photoBox,
    patchColor: 'rgb(213,210,202)',
    fields: seed.hufflepuff.fields,
  },
  ravenclaw: {
    id: 'ravenclaw',
    displayName: 'Ravenclaw',
    tagline: 'Wit beyond measure',
    accent: '#0e1a40',
    accentSoft: '#222f5b',
    crestEmoji: '🦅',
    front: 'ravenclaw_front.png',
    frontNoCape: 'ravenclaw_front_nocape.png',
    back: 'ravenclaw_back.png',
    width: BASE_W,
    height: BASE_H,
    photoBox: seed.ravenclaw.photoBox,
    patchColor: 'rgb(213,210,201)',
    fields: seed.ravenclaw.fields,
  },
};

export const HOUSE_LIST = Object.values(HOUSES);