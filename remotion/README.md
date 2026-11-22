# Crypto websites — Remotion edit

A 1080×1920, 30 fps edit of `hb_1794061643210.mp4`, built from `edit/storyboard.md` (v4) and the
`video-motion-study` skill rules.

## Run

```bash
cd remotion
npm install
npm run studio     # live preview in the browser (copies the raw video into public/ first)
npm run render     # → out/crypto-websites.mp4
```

In the Claude cloud container, use the preinstalled browser:
`REMOTION_CHROME=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell npm run render`

## Files

| File | What |
|---|---|
| `src/timing.ts` | Every timing: the transcript (`words.json`), caption groups, scenes, behind-head names, camera push/punch-ins |
| `src/Captions.tsx` | Lower-third caption lockup: light (Inter Display Light) / script (Allura) / heavy (Inter Display SemiBold + rose dot). Each word lands on its spoken frame. |
| `src/Talk.tsx` | Talking-head layer: footage, grade, site name **behind the head** (`public/speaker_cutout.webm` sits on top), Classified card, 😤 sticker |
| `src/Explainers.tsx` | Full-background explainer scenes: DefiLlama dashboard, CoinGlass 3 cards, CryptoQuant flow diagram + entry/exit chart, CTA, Farside ETF flows, recap |
| `src/ui.tsx` | Shared pieces: glass card, bottom glow, `+` sparkles, explainer background, headers, path draw-on |
| `public/speaker_cutout.webm` | Speaker cut out of every frame (VP9 with alpha; U²-Net human segmentation, head + shoulders only) |

## Editing tips

- **Change a caption:** edit `GROUPS` in `src/timing.ts`. The words must match the transcript in order; timings are found automatically.
- **Move a scene:** edit `SCENES` in `src/timing.ts`. The explainer components use the same seconds.
- **Colours:** `src/theme.ts`.
