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
