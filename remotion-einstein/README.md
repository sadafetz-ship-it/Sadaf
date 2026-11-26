# Einstein: 45 s documentary short (Remotion)

A 16:9, 1920×1080, 30 fps short in the style of the reference reels (see `../storyboard/einstein/`).
Animation timings were measured frame by frame from the references. They're documented in `../storyboard/einstein/ANIMATION_SPEC.md`.

## Run it
```bash
npm install
npm run studio                       # live preview + timeline scrubbing in the browser
npx remotion render Einstein out/einstein_45s_16x9.mp4 --concurrency=4   # final (motion blur + audio)
npx remotion render EinsteinPreview out/preview.mp4 --muted               # fast check, no motion blur
npx remotion still EinsteinPreview out/frame.png --frame=520              # single frame
```
`remotion.config.ts` points Remotion at the Chromium already installed on this machine. Change or remove `setBrowserExecutable` on another computer.

## Where things are
| File | What it holds |
|---|---|
| `src/Main.tsx` | Scene list with cut times (`SCENES`), motion blur (`CameraMotionBlur`, 4 samples, 180° shutter), film texture, audio |
| `src/scenes.tsx` | The 19 scenes (S1–S19), one component each. In-scene times are in seconds from the scene start |
| `src/map.tsx` | Vintage parchment map with the route animation |
| `src/lib.tsx` | Motion helpers (`E` easings, `typed`, `Words`, `Reveal`, `Draw`, `Cam` with handheld drift, `dolly`) and documentary pieces (`LowerThird`, `Credit`, `Note`, `Concept`, `LightLeak`, `FilmTexture`, `useWeave`) |
| `public/img/` | Archival photos and cutouts (credits in `../storyboard/einstein/ASSETS.md`) |
| `public/audio/mix.wav` | Final mix: voiceover, sound effects and music, built by `../storyboard/einstein/renderer/mix.py` |

## Changing timing
- **Move a cut:** edit `SCENES` in `src/Main.tsx`, then the matching voice start in `../storyboard/einstein/audio/voiceover_lines.tsv`, then re-run the mixer.
- **Change when a word pops:** edit the number in that scene (for example `t < 1.35` for "time" in `S12`). Keep the matching sound-effect sync time in `mix.py` the same.

## Documentary touches
- **Animated vintage map (S1):** real Natural Earth borders (world-atlas + d3-geo). Einstein's route Ulm (born 1879) → Zürich (ETH, 1900) → Bern (1902) draws on with pins, Switzerland hatched, period names "Deutsches Reich" and "Schweiz", then a zoom into Bern.
- **Eclipse explainer diagram (S14):** Sun, Earth and a star. The real light path bends around the Sun, the dashed line shows where the star appears, and a label gives the 1.75″ shift Einstein predicted.
- **E = mc² annotated in pencil (S13):** energy, mass, speed of light squared.
- **Real newspaper mastheads (S15):** "New York, Monday, November 10, 1919 · Two Cents" and "London, Friday, November 7, 1919".
- **Paper physics:** every sheet (1905 papers, newspapers, eclipse print, diagram, museum card, magnifier page) drops in 3D. It starts lifted toward camera (tilted, larger, soft far shadow, motion blur), lands in 9–10 frames as its shadow tightens, and settles with a damped wobble. Sheets have curl shading and edge ageing; newspapers have a centre fold. Pinned board cards sway gently.
- **Torn-paper transition** into "Four papers": the frame rips along a jagged line and the halves pull apart (Ref 2).
- **Film texture:** animated grain, dust specks, the odd hair and scratch, exposure flicker, vignette. Gate weave on archival photos.
- **Light leaks:** on the frame push-through, "ever." and the Nobel push.
- **Lower-thirds:** Bern, Switzerland · 1902; Bern · Kramgasse 49; Sobral, Brazil · Príncipe; Nobel Prize in Physics · 1921 with the real citation.
- **Source credits** on every archival image, in typewriter type.
- **Museum caption card** beside the framed portrait.
- **Authentic text:** the German office name and his real job title "Technischer Experte III. Klasse — 23. Juni 1902".
- **Pencil date tags** on the four 1905 papers (Mar · light, May · atoms, Jun · relativity, Sep · E=mc²).
- **Concept labels:** The Photoelectric Effect, Brownian Motion, Special Relativity.
- **Highlighter sweep** over "Einstein Theory Triumphs", with a push-in to the headline.
- **Dust motes** floating in the lamp beam.
- **End card:** "Albert Einstein · 1879 – 1955".
