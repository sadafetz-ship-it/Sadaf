# Edit pipeline: raw talking-head → finished Remotion edit

Proven on the crypto-websites reel. The house style is in `house_style.md`; this file is the *how*.

## 1. Get the footage
- Google Drive links often fail: the connector can't see other accounts' files, and `drive.usercontent.google.com` may be blocked.
  The reliable route: the user uploads to the repo branch via
  `https://github.com/<owner>/<repo>/upload/<branch>` (≤25 MB on web). Then `git fetch` + merge.
- Probe with `vstudy.py probe`.

## 2. Word-by-word transcript
- `faster-whisper` needs Hugging Face file hosts (often blocked: xet/CAS). Use **`pip install openai-whisper`** instead. Its models
  come from `openaipublic.azureedge.net`.
- `whisper.load_model("small.en")`, `transcribe(..., word_timestamps=True)` → `words.json`.
- **Fix brand names by ear** (Whisper heard "DeFi LAMA" → DefiLlama, "incudation" → liquidation, "Farsight" → Farside). Mark the
  fixes ✎ in `transcript.md`.

## 3. Storyboard + still previews (approval gate)
- **Storyboard:** a beat table with time, mode, spoken words, caption lines and on-screen elements, plus trigger frames from the
  transcript.
- **Previews:** HTML per frame over real stills (`ffmpeg -ss t -frames:v 1`), rendered with Playwright at 1080×1920, plus a
  side-by-side board.
- Version them (v1…v4) and send each board to the user. **Stop until approved.**

## 4. Speaker cut-out (names behind the head)
- **Model:** U²-Net human segmentation ONNX from GitHub (`danielgatis/rembg` release `u2net_human_seg.onnx`) + `onnxruntime`.
- **Script:** `scripts/cutout_speaker.py` streams every frame → RGBA → **VP9 WebM with alpha** (`-pix_fmt yuva420p`). Keep only the
  head and shoulders: zero the alpha below ~56 % of the height.
- **In Remotion:** `<OffthreadVideo transparent>` above the name and **under the colour grade** (otherwise a brightness seam appears).
- Takes about 10 min for 45 s at 1080×1920 on 4 CPUs. Run it in the background while you write code.

## 5. Remotion project layout
```
remotion/
  src/timing.ts      transcript, caption GROUPS (matched to words), SCENES, camera, behind-head names
  src/Captions.tsx   three-line lockup, Scripts pixels, glow
  src/Talk.tsx       footage + names + cut-out + grade + chest cards/boards + stickers
  src/Explainers.tsx full-background scenes
  src/CardFx.tsx     animation recipes (zoomDropIn, whipIn, glowReveal + Comet, InkLine, bloomIn, ScriptPixels, GLOW)
  src/Pixel.tsx      PillTag, Swoosh
  src/Extras.tsx     number tiles, ring, highlight bar, box flash, arc text
  src/Sfx.tsx        cue sheet with PEAK offsets, combos, SFX_GAIN
  public/            raw.mp4 (copied, git-ignored), speaker_cutout.webm, sfx/*.wav, fonts
```
- Symlinks in `public/` break when Remotion bundles them. **Copy** the raw video (`npm run assets`).
- In the cloud container, render with
  `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`.
- **Stills for checks:** `npx remotion still Main out.png --frame=N`. Check every new element at full size before a full render.
- **Full render:** ~8–12 min for 45 s. A sound-only change → `--codec=wav` audio render (seconds), then mux onto the last video.
- **Final audio:** `ffmpeg ... -af alimiter=limit=0.85:attack=2:release=40:level=false`.

## 6. Audit before sending (the user asks to "fix all the errors")
- Make 6 fps contact sheets of the render with `vstudy.py sheets` and read every sheet. Look for:
  - clipped script glyphs;
  - glow boxes;
  - stray pixels in empty space;
  - effects over the face;
  - streaks crossing text;
  - captions overlapping cards;
  - heavy words replaced in <0.5 s.
- **Audio:**
  - count samples ≥0.99 (must be 0);
  - per-moment RMS of mix vs voice-only;
  - fix stacked-SFX clipping with the master gain (a limiter can't undo clipping that happened at render).

## 7. SFX extraction from a reference video
- Mono 16 kHz envelope → silence gaps → cut each event with 5 ms / 40 ms fades.
- Find each file's **peak offset** so cues land on frames.
- If the video labels its SFX on screen (highlighted words), read the 6 fps sheet to name each cut.
- Run Whisper first: if it finds speech, the file is a voiceover, not SFX.
- **Music under the SFX?** Demucs models (`dl.fbaipublicfiles.com`) may be blocked. Use REPET-SIM instead: STFT →
  `nn_filter` (median, cosine, width 0.5 s) → soft masks → the non-repeating **foreground** holds the one-off SFX.
  Cut events from the foreground at the times the circled animations happen, then run Whisper on each cut to catch vocal bleed
  (Whisper's "Thank you." with no_speech ≥0.75 on non-speech is a hallucination, not speech).

## 8. Lessons from the 16:9 house edit (Nov 2026)
- **Keep the source aspect.** A 16:9 talking head stays 1920×1080. Cropping it to 9:16 leaves no room for graphics beside the face.
- **Face box first.** Run U²-Net on every preview still and take the head's x range from the mask band 80–320 px below its
  top. Every card and title goes in the side zones. Check every still against the box before you send it.
- **Previews:** the HTML preview generators (`gen3.py` style) reuse the CSS and helpers between versions. Keep v1/v2/v3
  boards so the user can compare. When the user says "change F8" without details, render 2–3 alternatives on one sheet
  and let them pick. They may combine options, e.g. "both B and C" became calendar → click → card.
- **Remotion `<Sequence>` re-bases `useCurrentFrame()`.** Components written with absolute frame numbers must be mounted
  by frame range (`f >= a && f < b ? <X/> : null`), not inside a Sequence. Otherwise they render empty.
- **Explainer transitions:**
  - Into an explainer: light-beam sweep, a clip-path cone from a ring pivot.
  - Back to the speaker: zoom-blur (5 f) plus a white flash.
- **No SFX library in the container?** Run `scripts/make_sfx.py` for stand-ins (peak offsets are written to JSON), place
  cues by peak, and tell the user the files can be swapped for theirs without changing timing.
- **Render:** 560 frames at 1920×1080 with `--concurrency=4` on 4 CPUs.
