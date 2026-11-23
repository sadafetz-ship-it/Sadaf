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
