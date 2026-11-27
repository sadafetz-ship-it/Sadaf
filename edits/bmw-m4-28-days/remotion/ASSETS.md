# Assets for the build

| File | What | Source / licence |
|---|---|---|
| `public/raw.mp4` | the tight cut (`../cut_tight.mp4`), copied for Remotion | git-ignored (already committed as `cut_tight.mp4`) |
| `public/speaker_cutout.webm` | speaker head and shoulders, VP9 with alpha, 286 f, for text behind the head | U²-Net human segmentation (`u2net_human_seg.onnx`, rembg release) |
| `public/bmw_m4_cutout.png` | white BMW M4 (G82) cut out on transparent, **number plate blurred** | Photo: Alexander Migl, "BMW M4 (G82) 1X7A0155.jpg", Wikimedia Commons, **CC BY-SA 4.0** (https://commons.wikimedia.org/wiki/File:BMW_M4_(G82)_1X7A0155.jpg). Background removed and plate blurred. Credit the photographer in the post caption if this is used. |
| `public/sfx/*.wav` + `INDEX.md` | the house SFX library | the skill's `assets/sfx` |
| `public/fonts/` | Inter (variable), Allura, Antonio 700 | SIL OFL (via @fontsource) |

Tools: Remotion 4.0.547, React 19, GSAP (from `/opt/anim-tools`, symlinked as `node_modules`), ffmpeg, onnxruntime, Playwright Chromium.
Render with `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.
