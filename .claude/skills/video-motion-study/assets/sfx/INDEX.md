# The user's SFX library (bundled with the skill)

All files are 48 kHz stereo WAV, peak-normalised. **Peak** is where the file's own hit sits, in seconds. Start the sound
at `cue − peak` so the hit lands on the animation frame.

Copy the files to `remotion/public/sfx/` and use `scripts/remotion_HouseSfx.tsx` (rules are in house_style §8).

| File | Peak (s) | Role / when to use |
|---|---|---|
| `ref_riser.wav` | 1.06 | Big-moment hit (names and screen changes). The riser ends on the moment. Full hit: from 0.06 s, length 1.0 s; light hit: from 0.5 s, length 0.56 s. |
| `whoosh_air.wav` | 0.72 | Big-moment hit, plus small lifts and whips (rate 1.25–1.35). Vary the pitch per hit; at most 8 plays. |
| `impact.wav` | 0.28 (attack 0.04) | Big-moment hit: attack (0.04) on the moment, 0.7 s full or 0.45 s light. Also a smaller echo on the last word of a title and on the punchline. |
| `pop_media.wav` | 0.12 | Visual element appears: cards, widgets, number tiles, `$` glyphs. |
| `pop_ui.wav` | 0.28 | Smaller UI element appears: calendar, nodes, list bullets, people row. |
| `ref2_g_drop.wav` | 0.22 | Zoom drop-in (cards and objects dropping in, e.g. the gold key or the plan card). |
| `ref2_g_comet.wav` | 0.27 | Comet + glow reveal (a card "develops" from white). |
| `ref2_g_photostack.wav` | 0.09 | Line path: nodes go ghost → sharp along a line. |
| `ref_typing_b.wav` | 0.11 | Typing bars and pills. Keep it **low (vol ~0.18)** and trim to the typing length. |
| `ref_click.wav` | 0.08 | A real click (cursor clicks a date or cell). |
| `double_click.wav` | 0.12 | A button press ("Get started", "Comment …"). |
| `dissolve.wav` | 0.11 | Morph / fold (pill → card, cell → card, board collapses). Clean digital, no tonal swell. |
| `paper_slide.wav` | 0.35 | A board or card slides or whips in; a pill stretches. |
| `gears.wav` | 0.10 | A graph or timeline line draws on. |
| `ref_ding.wav` | 0.13 | A key landing (final number or word, YR 10, "pricey"). Use at most 2–3 per video. |
| `ref_light_reveal.wav` | 0.02 | Name reveal / card opens. **Avoid on UI boards**: its tonal swell reads as a sung "aah". |
| `game_over.wav` | 0.11 | Retro fail sting ("mad", a fail moment). |

**Rejected or unavailable:**
- `ref2_q_pill`, `ref2_q_morph` and `ref2_g_golden` had vocal bleed, so they are not bundled. Never use them.
- The original library files (`09_Whoosh_2`, `Suspense_Riser`, `05_Sparkle` …) live with the user. Ask for them if a role here is missing.

**Before sending:**
- Count plays per file. Any sound repeating ~10+ times reads as unnecessary.
- Check the mix: no clipped samples, effects within about ±5 dB of the voice. The raw voice may peak above 0 dBFS, so drop it to about 0.88.
