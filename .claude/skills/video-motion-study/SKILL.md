---
name: video-motion-study
description: "Study reference videos frame by frame (colours, fonts, layout, effects, animation logic, frame counts, easing, timing against the script) AND edit the user's own raw talking-head videos in their house style: word-by-word transcript, storyboard, still previews for approval, then a Remotion build with captions, pixel reveals, card animations, speaker cut-out and sound design. Use whenever the user shares reels, ads, TikToks, UI animations or \"videos I like\" to analyse, copy or cut up; shares a raw video to edit; asks for a transcript, storyboard or preview; asks to animate cards or captions like references; or sends sound effects to place. Also handles grid videos with several clips in one frame."
---

# Video motion study

Turn a batch of reference videos into a reusable motion-design study: clips cut out, every frame on numbered contact sheets, timestamped beat-by-beat notes per clip, and a synthesis of **(1) design principles, (2) animation logic and (3) placement and timing relative to the script**.

The value is in *precise, named observations* ("per-letter blur reveal, 3 f stagger, word behind the head, lands on the spoken word") rather than vague taste words. Every claim should be traceable to a timestamp on a sheet.

## Two modes
- **Study mode** (reference videos → breakdown): the workflow below.
- **Edit mode** (the user's raw video → finished edit): read **`references/house_style.md` first** (the user's standing preferences, rejected ideas, animation recipes, sound design), then follow **`references/edit_pipeline.md`**. Use study mode on any new references they send, then map each circled or named element onto the edit. Change only what they asked: "animation" means motion only.

When the user gives a new standing preference, or rejects something, add it to `house_style.md` in the same session so they never have to repeat it.

## Tools
- `scripts/vstudy.py` wraps ffmpeg: `probe`, `split`, `sheets`, `frames`, `zoom`, `web`. Run it with `python3 -I <skill>/scripts/vstudy.py <cmd> ...` (`-I` keeps untrusted upload folders off the import path). Only ffmpeg/ffprobe are required.
- `references/vocabulary.md` is the naming checklist for techniques, transitions and timing patterns. Read it before you start watching, so your notes use consistent names.
- `references/example_study.md` is a finished synthesis from a real run. Skim it to calibrate depth and structure.
- `references/reference_library.md`: what each circled reference is, what was measured, and which recipe it became.
- `references/house_style.md`: the user's house style and rules for edits (palette, caption lockup, the only pixel style they want, card animation recipes with measured frames, SFX roles and combos, things they rejected).
- `references/edit_pipeline.md`: the transcript → storyboard → preview → Remotion pipeline, speaker cut-out, render and audit steps, environment workarounds.
- `scripts/remotion_CardFx.tsx`: drop-in Remotion code for every animation recipe (Scripts pixels, glow, drop-in, whip, comet reveal, ink line, bloom).
- `scripts/remotion_House*.tsx` + `remotion_house_theme.ts`: the full 16:9 house edit. This is the **current caption lockup** and the **motion-graphics library**: gauge, product card with light ribbon, calendar→card morph, gold key, $$$, beam sweep, Scripts-style titles, camera and grade. Start new edits from these files, recoloured to the new accent.
- `assets/sfx/` holds **the user's SFX library**. `assets/sfx/INDEX.md` lists each file's role and peak offset. Always use it for sound design.
- `assets/references/` holds the user's references: the **circled stills** (Golden Hour accent, Scripts title, Nexus / $10,000 heavy words), the **motion-graphics reference video** (full grid plus 4 split clips), and every-frame / 6 fps sheets. `assets/examples/` holds the finished 16:9 house edit and its preview board. Catalogue: `references/reference_library.md`.
- `scripts/make_sfx.py`: emergency stand-in SFX only. Use it when `assets/sfx/` is somehow missing, and tell the user.
- `scripts/cutout_speaker.py`: speaker cut-out → alpha WebM, for text behind the head. `scripts/sfx_tools.py`: analyse SFX files (peak offsets, duplicates) and split SFX out of a reference video.

## Defaults to confirm only if unclear
These came from the user who commissioned this skill. Apply them silently unless the user says otherwise.
- **Grids count as separate videos.** If a frame holds 2×2 (or other) panels, split them and analyse each panel as its own clip.
- **Ignore platform chrome**: Instagram/TikTok logos, usernames, timers, like/share buttons and watermarks. Keep account names out of the deliverables.
- **Do not transcribe reference audio unless asked.** The on-screen text is the script in these edits; derive script timing from captions. For the user's own raw video, a word-by-word transcript is always wanted. Use `openai-whisper` (`pip install openai-whisper`, models from openaipublic.azureedge.net), because faster-whisper's Hugging Face downloads are often blocked. The offline pocketsphinx recogniser is too inaccurate to be worth using.
- Faces pixelated in the source are part of the source; just note it.

## Workflow

Work in a scratch directory (`$W`) and copy deliverables into the project at the end. Give the user a one-line progress update every few clips, because this job takes a while.

### 1. Inventory
```
python3 -I vstudy.py probe $W /path/to/*.mp4
```
This writes `index.tsv` (duration, size, fps, audio) and `overview.jpg` (one labelled mid-frame per video, IDs V01, V02, ...). **Look at the overview** to spot grid videos, stacked-card layouts and screen recordings. In a grid, a centre logo or watermark often hides the seams. Panels usually split exactly at width/2 and height/2; zoom a centre crop to confirm. Tell the user the real clip count, e.g. "16 files → 28 clips", especially if it differs from what they said.

### 2. Cut the clips
```
python3 -I vstudy.py split $W V01=/path/a.mp4@2x2 V02=/path/b.mp4 ...
```
`@CxR` = columns × rows. Cells are named a, b, c, d... left-to-right, top-to-bottom (2×2: a=TL, b=TR, c=BL, d=BR).

### 3. Make sheets
```
python3 -I vstudy.py sheets $W      # 6 fps overview sheets, 8×4 tiles, timestamped (~5 s per sheet)
python3 -I vstudy.py frames $W      # EVERY frame, 10×5 tiles labelled f<n> + time (the frame-by-frame record)
```
Read the 6 fps sheets for understanding. Open the every-frame sheets when you need exact frame counts (entrance lengths, staggers, flash frames). Measured counts are what make the study useful for rebuilding the animation.

When something is small or dense, crop it over time:
```
python3 -I vstudy.py zoom $W V10 --crop 480:820:480:340 --fps 2 --cols 12
```
Use it for long videos (scan at 1.5–2 fps), comparison layouts (crop just the "Edit" panel), UI text you can't read, or stacked triptych cards (crop one card). `--start/--end` limit the range; labels show absolute time.

### 4. Watch and take notes, one clip at a time
For each clip, view its sheets and **append** notes to `$W/notes.md` straight away. Writing as you go keeps the work safe if the context gets compacted, and it keeps one clip's details from blurring into the next. Use this shape:

```
## V09 "<script/hook in quotes>" — <base world, subject>, accent <colour #hex>; type <look-alikes>
0.00 <entry transition, frames>
0.17-0.50 <element>: <animation technique>, <properties/frames>, <placement>, <colour>
2.50 <transition> → <next shot>
...
```
Capture for every beat: **time → element → technique (from vocabulary.md) → frames/easing → placement → colour/type**. Also note the spoken words shown on screen, since that is your script. Record surprises that break the pattern, and behind-the-scenes views (an After Effects timeline staircase shows the stagger logic directly).

Efficiency tips that matter on big batches:
- Skip tail sheets that only show a static hold. Size `zoom` grids to the duration so you don't view empty black tiles.
- UI loops repeat. Confirm the loop point once, then skim.
- Similar templates recur across clips (same creator). Name the template once and describe only the differences afterwards.

### 5. Synthesise
Write `STUDY.md` with these sections, in this order:
1. **Header + deliverables table + clip index** (ID, source file, content, style family).
2. **Design principles**: the core recipe shared across clips; palette table (base / accent / where); colour rules (e.g. accent marks new words; colour = emotion; flash as transition); typography roles table; layout and placement zones; recurring objects.
3. **Animation logic library**: tables of text entrances, object/UI entrances, idle motion, exits and transitions, each with a *recipe* (properties, frames, easing) and *where seen*; then easing/speed rules.
4. **Placement and timing relative to the script**: how sentences are split (setup → hero → tag), with a table of real lines from the clips; sync rules; beat structure over time (e.g. 0–0.15 s entry, ~2.5 s hard switch); mode alternation in long videos; zone summary.
5. **Quick spec sheet** to reproduce the style: canvas, safe zones, type sizes, default entrance/exit/transition values, sync rule.

Ground every generalisation in at least two clips, and name them. Mark inferences as inferences, e.g. "likely Druk-like", "hex approximate".

Then turn the notes into `per_clip_breakdown.md`: add a short legend at the top and strip any account names.

### 6. Deliver
Put these in the project, by default under `study/`:
```
study/STUDY.md
study/per_clip_breakdown.md
study/clips/              <- vstudy.py web   (540p, small, for committing)
study/frame_by_frame/     <- every-frame sheets
study/review_sheets_6fps/
```
Keep individual frame images out of git: contact sheets carry every frame at a fraction of the size. Offer per-frame PNG export for specific clips if the user wants it. Commit and push if the project is a repo and the session's rules allow it. Finish with a short summary: the clip count, where things are, and 3–5 headline findings per section.

## Pitfalls seen before
- The `0:05` style counters and handles in the frame are platform UI, not design.
- Raw-vs-Edit or $50-vs-$150 layouts: study the *Edit* panel, and note the comparison/CTA layout once.
- Stacked-card triptychs: each card cycles its own scenes out of phase, so describe the scenes once and the phase offset.
- Phone-filmed monitors (moiré, tilt) are BTS footage. Describe the piece shown, plus the fact that it is BTS.
- The fps can differ per file (some are 50 fps). Frame counts in notes should state the fps when it isn't 30.
