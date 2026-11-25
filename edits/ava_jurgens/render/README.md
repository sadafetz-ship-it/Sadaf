# Ava Jurgens: render v1

`ava_jurgens_v1.mp4` is 1080×1920 at 30 fps, 41.0 s, H.264 CRF 18, with the original voice audio. It was built from `../remotion`
(`npx remotion render Main`, about 4.5 min on 4 CPUs).

## Audit (6 fps contact sheets plus spot checks)
- **Fixed:** list-card points showed their first letter before they were spoken. Now each point is hidden until its star pops, then wipes in.
- **Fixed:** a light-beam wipe before the CTA crossed the face. It was removed, and the CTA now opens straight on the top word.
- **Face no-go zone** (x 360–760, y 330–1010): no overlay enters it in any sheet. Punch-ins (+5 %) are centred on the face, so cards stay below the chin.
- **Captions:** hidden in F8, F9, F10, F11b and F12. Each word lands on its spoken frame.
- **Audio:** identical to the source (mean −28.9 dB, peak −6.2 dB, no clipping). No SFX or music yet, because none were supplied for this project.

## Re-render
```
cd ../remotion && npm i && cp <raw video> public/raw.mp4
npx remotion render Main out/ava_jurgens_v1.mp4 --concurrency=4 --crf=18
```

## v2: F6 circle reframed
- `ava_jurgens_v2.mp4` is the current render. v1 is still in git history.
- **Fix:** the speaker circle in F6 (POSITION INFO, 15.3–17.7 s) showed only part of her face (forehead and eyes, off-centre).
  The live video inside the circle is now scaled to 35 % and centred on her face. The whole face, with a little hair and
  shoulder, sits in the middle of the ring for the whole scene. `f6_bubble_check.jpg` shows two frames.
- Nothing else changed.

## v3: sound design
`ava_jurgens_v3_sfx.mp4` is the current render: the v2 picture plus a full SFX mix. v2 is still in git history.
The cue sheet is `remotion/src/Sfx.tsx`. Every cue starts at `frame − peak offset` (measured with `sfx_tools.py analyse`),
so each file's hit lands on its animation frame. The sounds come from the user's bundled library (`remotion/public/sfx`).

| Moment | Sounds |
|---|---|
| **Name hits / big screen changes**: "Ava" (0.8 s), into hiring (5.4 s), beam wipe (15.3 s), "THIS JOB" (22.2 s), "YOU" (38.7 s) | **Riser → whoosh → impact.** The riser ends on the landing frame, the whoosh peak crosses it and the impact attack hits it. "Ava" has no riser because it lands 0.8 s into the video. |
| Top-word pixel clusters | photostack (digital sparkle), quiet |
| Cuts back to the talking head | soft whoosh or paper slide |
| PBL page | paper slide (card rises), typing (handle, pill, bio), gears (counters), drop (posts), pop + **ding on "1M"** |
| Talented / Hardworking / Committed | comet reveal on each card, soft impact on EDITORS |
| Content Flow | dissolve (scene morph), gears (line draws), photostack on each node |
| Editing-test card | typing → dissolve (bar → card) → gears (progress) → pop (🍀) |
| Gauge | paper slide, pop on "5", **ding on "8"**, clicks on M · W · F |
| Content orbit | paper slide in, dissolve on collapse |
| Tiles 1/2/3 | drop |
| List-card points | soft pop (F10) / soft click (F11b, F12) |
| Consistency | whoosh + impact in, gears (arc), drop (tile 2), comet (key) |
| CTA | pop (avatar), typing, dissolve (pill → card), double-click + **ding** on the button |
| Every caption | the same soft click, very quiet (house rule) |

**Mix:**
- Effects master gain 0.3. The loudest hits sit about +3 dB above average speech, and the median effect sits −15 dB under it.
- Dings are used 3× in total.
- Rendered with `--codec=wav`, muxed onto the v2 picture with `alimiter=limit=0.85`.
- Final peak −6.2 dB, no clipped samples. The voice is unchanged.

## v4: riser → whoosh → impact on every screen change
`ava_jurgens_v4_sfx.mp4` is the current render. v3 is still in git history.
- The **full riser → whoosh → impact combo** now plays on all **15** moments.
  - **Name hits:** "Ava" 0.8 s, "EDITORS" 8.2 s, "THIS JOB" 22.2 s, "YOU" 38.7 s.
  - **Every screen change:** 1.6, 4.9, 5.4, 8.6, 10.9, 15.3, 17.7, 20.4, 21.6, 28.9 and 31.2 s.
- In each combo the riser ends on the landing frame, the whoosh peak crosses it and the impact attack hits it.
- When two cuts are close (4.9 → 5.4 s, 8.2 → 8.6 s, 21.6 → 22.2 s), the riser is trimmed **from the front**. Its swell, which
  sits in the last ~0.2 s, is kept, so the risers never pile up.
- **Combo level raised:** riser 1.0, whoosh 0.85, impact 1.0 (× master 0.3). The softer paper-slide, whoosh and dissolve
  substitutes on cuts were removed.
- **Measured:** each combo sits between **0 and +5 dB of average speech**, so it's clearly audible and the voice stays on top.
  Mix peak −6.2 dB after the limiter, no clipping.
- All other element sounds (typing, comet, drops, pops, dings, caption clicks) are unchanged.

## v5: riser → whoosh → impact only on some motion graphics
`ava_jurgens_v5_sfx.mp4` is the current render. v4 is still in git history.

**Full combo** (full-length riser → whoosh → impact), on four motion-graphics entrances only:

| Time | Motion graphic |
|---|---|
| 1.6 s | Personal Brand Launch profile page |
| 5.4 s | Talented / Hardworking / Committed glow-ring cards |
| 15.3 s | Light-beam wipe into POSITION INFO |
| 28.9 s | "Consistency is the key" |

Each sits about +1 to +2 dB over average speech, so they clearly stand out.

Everything else is lighter, about −8 dB under speech:
- **Top words** (Ava, EDITORS, THIS JOB, YOU): a soft pop plus the pixel sparkle.
- **Cuts back to the talking head:** a soft whoosh or paper slide.
- **Switches inside a scene** (→ Content Flow, → gauge, → orbit): dissolve or paper slide.

All other element sounds are unchanged. Peak −6.2 dB, no clipping.

## v6: Content Flow on black
`ava_jurgens_v6_sfx.mp4` is the current no-music master: picture, voice and SFX. v5 and the composed-music previews are still in git history.
- **Content Flow scene** (8.6–10.9 s): the background is **pure black**. The green world fades to black over 6 frames as the board
  enters. The curvy contour ("rose") lines behind the board are **removed**.
- The board, graph line, nodes and every other scene are unchanged. The other explainers keep the dark-green world.
- With music: `ava_v6_Timeless_hook.mp4`, the Timeless hook-intro mix on the v6 picture. It is git-ignored because the song is copyrighted.

## v7: textured black background on all graphic scenes
`ava_jurgens_v7_sfx.mp4` is the current no-music master. With music: `ava_v7_Timeless_hook.mp4`, which is git-ignored (copyrighted song).

All full-screen graphic scenes have the new background: PBL page, hiring cards, Content Flow, position info, gauge, photo circle and
Consistency. Ava's talking-head shots keep her real room, as the user chose.

The background (`World` in `remotion/src/Explainers.tsx`), from the bottom layer up:

| Layer | Spec |
|---|---|
| Base | near-black `#050505` |
| Concrete / paper surface | fractal noise, base frequency 0.012/0.018, 4 octaves, opacity 0.10 |
| Film grain | fine fractal noise at 0.85, desaturated, re-rolled every 2 frames, screen blend, opacity 0.09 |
| Grid | faint white 80 px grid at 3.5 % opacity, drifting up slowly, masked to the centre |
| Vignette | darkens the edges to 75 % |
| Particles | floating particles, as before, slightly dimmer |

- The green light pools are removed. The measured background brightness is about 14/255, so it reads as black with texture.
- The Content Flow scene's flat black from v6 now uses the same textured background.

## v8: "B" spotlight background
`ava_jurgens_v8_sfx.mp4` is the current no-music master. With music: `ava_v8_Timeless_hook.mp4`, which is git-ignored.

All graphic scenes now match the user's reference **B**: smooth near-black (`#040404`), lit by a **soft, colourless spotlight
from the top centre** and fading to black at the edges and bottom.

| | Our render | Reference B |
|---|---|---|
| Top centre | about 18–35 / 255 | about 25 |
| Edges | about 7–8 | 4–9 |
| Bottom | about 6–7 | 5–6 |

- **Removed:** the concrete texture, grid and particles. B has none.
- **Kept:** only an ultra-faint grain (3.5 %), so the gradient doesn't band.
- **Unchanged:** Ava's talking-head shots, and everything else.
