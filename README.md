# Hogwarts Official Witchcraft ID — 3D Lanyard Badge Maker

A theme-picker landing page (draggable freeform stickers, à la the CMIYGL reference)
that opens into a template gallery. Hogwarts is the one live theme: pick a house,
upload a photo, fill in your details, and get a 3D, physics-driven ID badge on a
lanyard you can drag, throw, and flip — inspired by id.patilshubham.me / the Vercel
Ship conference badge.

## Running it locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Building for production / GitHub Pages

```bash
npm run build
```

This outputs a static site to `dist/`. `vite.config.ts` uses `base: './'` (relative
paths) so the build can be dropped directly into a GitHub Pages repo, a static
host, or opened via any local static file server (`npx serve dist`).

> Note: opening `dist/index.html` directly via `file://` will NOT work — ES
> modules and texture loading require a real HTTP server. Use `npx serve dist`,
> GitHub Pages, Netlify, Vercel, etc.

## Flow

1. **Landing (`LandingPage.tsx`)** — playful draggable emoji stickers (Framer
   Motion `drag`), "browse templates" button.
2. **Template gallery (`TemplateGallery.tsx`)** — reads `src/data/themes.ts`.
   Hogwarts is `ready: true` and clickable; the other three are placeholder
   "coming soon" cards — swap `ready: true` and give them their own flow (mirroring
   `HogwartsFlow.tsx`) when you're ready to build them out.
3. **Hogwarts flow (`HogwartsFlow.tsx`)**:
   - `HouseSelector.tsx` — pick a house.
   - `CardCustomizeForm.tsx` — upload + crop photo (`react-easy-crop`), type
     Name/Specialty/DOB/Patronus/Signature, live-updating preview
     (`CardFrontComposite.tsx`), CSS-flip to preview the back.
   - `Card3DScreen.tsx` — rasterizes the live preview to a PNG (`html-to-image`)
     and hands it to `Scene3D/LanyardScene.tsx`, a react-three-fiber + Rapier
     physics scene: a fixed anchor, two rope-jointed segments, and the card
     rigid body, connected visually by a `meshline` strap. Drag the card with
     your pointer/finger; release to throw it; double-click/tap to flip.

## Card asset pipeline (already done, but documented for future houses/themes)

Your 4 front templates had two quirks that needed handling before they could be
used as live fill-in forms:

1. **The "transparent" photo box wasn't real alpha transparency** — it was a
   baked checkerboard pattern (a common flattening artifact). Fixed by detecting
   low-saturation/high-value pixels (HSV) inside the box region and punching real
   alpha=0 holes there.
2. **The dotted-line fields had baked-in sample answers** ("Jackson Smith",
   "12 April 2005", etc.) rather than being blank. The answers are blanked
   **directly in the PNG art** by `scripts/blank-answers.mjs`, which fills each
   house's answer-zone rectangles with the matching parchment colour
   (`patchColor` in `houses.ts`). Run it again if you re-derive the art. The
   finished art carries no sample text, so the runtime renders the user's typed
   value straight onto the card with **no patch overlay** — the card preview is
   always clean and shows only the original artwork plus the live values.

Photo/fill-in behaviour (CMIYGL-style):
- Photo upload + crop (`react-easy-crop`) → the cropped photo is placed **under**
  the template's transparent hole (base layer), so foreground robes/badge stay
  on top. Drag the photo on the card up/down (`photoOffsetY`) and zoom
  (`photoScale`) to position the face; the photo always fills the frame.
- Name / Specialty / DOB / Patronus are typed inline on the card (no visible
  input background) and rendered directly over the blanked answer zones.
- Signature is **drawn** on a canvas pad (`SignaturePad.tsx`, mouse + touch) and
  composited as a transparent PNG onto the signature line.

All per-house pixel coordinates (photo box, each field's x/y and patch rect) live
in `src/data/houses.ts`. If you add a 5th theme, you'll calibrate the same way:
open the template at full size, note the photo-box rectangle and each field's
label-end-x / answer-baseline-y / patch rectangle, in the template's native pixel
space (currently 816×1296 for all 4 Hogwarts templates).

## Known limitations / good next steps

- **Font**: uses "Caveat" (Google Fonts) everywhere for entered text, per the
  brief (don't mix handwriting fonts across fields).
- **Background**: the 3D scene currently uses a plain dark navy background
  instead of a blurred Hogwarts-castle-silhouette image — drop an image into
  `src/assets/` and add it as a full-screen background behind the `<Canvas>`,
  or as a large plane behind the card in the scene.
- **Performance**: front templates are ~1.4–1.6MB PNGs (needed for the
  transparency + text detail); back art is compressed to JPEG. On low-end mobile
  you may want to downscale the front templates (e.g. to 600×950) since the
  card only needs to be a few hundred px on screen.
- **Other 3 themes**: `themes.ts` has Cyberpunk / Star Voyager / Retro Arcade as
  disabled placeholders. Building one out means: house-style art, a
  `houses.ts`-style config, and a flow component mirroring `HogwartsFlow.tsx`.
- **Physics tuning**: rope segment count/length and damping live at the top of
  `Card3D.tsx` (`SEGMENT_LEN`, `linearDamping`, `angularDamping`, `density`).
  Tune to taste — fewer/shorter segments = snappier & cheaper; more segments =
  more naturalistic droop.
- No automated/headless-browser test pass was possible in the sandbox this was
  built in (no network access to download a browser binary) — the project
  **type-checks and builds cleanly**, but give the drag/flip/physics
  interactions a manual pass once it's running for you.

## Stack

Vite + React + TypeScript, Tailwind CSS v4, `@react-three/fiber` +
`@react-three/drei` + `@react-three/rapier` (physics) + `meshline` (rope strap),
`framer-motion` (landing/UI motion + card CSS-flip), `react-easy-crop` (photo
crop), `html-to-image` (PNG export + 3D texture capture).
