# Storyboard v2.1: "BMW M4 in 28 days" (awaiting approval)

**Canvas:** 1080×1920 (9:16, source aspect), 30 fps, 9.53 s (286 frames), from `cut_tight.mp4`.
**Board:** `preview_v2/board_v2.jpg` (v2.1: no ring around the slime) (13 moments, P01–P13). v1 is kept in `preview_v1/` for comparison.
**Script:** "Don't even think about getting that part-time job when you can just do this instead. If I had to buy a BMW M4 in the next 28 days, this is exactly what I would do."

## The story in one line
**Problem → alternative → goal → deadline → promise.** Each act gets its own visual idea, and every graphic lands on the frame its word is spoken.

| Act | Time | Story job | Visual idea | Mode |
|---|---|---|---|---|
| 1. The problem | 0.00–2.25 | Kill the obvious option | A thought bubble ("think"), then PART-TIME JOB behind the head, then an amber slash through it with a retro fail sting | caption → name behind the head |
| 2. The alternative | 2.25–3.93 | Point at the slime | The camera drifts toward the slime (focus pull), sparkles twinkle on it, "instead." with a highlight bar | caption + concrete visual |
| 3. The goal | 3.93–6.23 | Make the dream tangible | A light-beam sweep into a lavender world; a comet lands, the card develops into the real white M4 and its headlights glint | full-background explainer |
| 4. The deadline + promise | 6.23–9.53 | Urgency, then the hook | Flash back to you; a 28-cell calendar fills to Day 28 with a tiny M4 parked on it; punch-in on "exactly"; 3D close; "STEP 1" teases part 2 | chest card → caption close |

Mode rhythm: 1.4 s · 0.8 s (held 1.2 s) · 1.7 s · 2.3 s · 1.5 s · 1.8 s. Every switch is 1.3–2.5 s apart, as the house style asks.

## Palette (the colours you circled) and what each one does
| Colour | Hex | Job in this edit |
|---|---|---|
| Warm ivory | `#F3E8B8` | Main caption text, card light tops, ribbon core, calendar circle |
| Pale butter | `#E8D98B` | Fill end of the heavy words, card gradient |
| Soft lilac | `#B99ACB` | Script pill, glass borders, thought bubble, calendar cells, light pools |
| Muted lavender | `#8E78B5` | Pill shading, explainer world, start of the highlight bar |
| Lantern amber | `#F4A64A` | **The "no" colour:** the slash, edge flash, accent dots, stars, Day 28 cell |
| Cyan blue | `#159CC2` | **The "yes" colour:** title, karaoke word, glows, ribbon, sparkles, headlight glint (it matches the slime) |
| Ink | `#1A1428` | Derived (a near-black lavender): card bodies, script text, STEP 1 pill |

## Safe zones (measured with U²-Net on every still)
| Zone | Pixels | Use |
|---|---|---|
| Face box | x 50–760, y 270–1000 | Nothing on it |
| Window band | y 0–290 | Thought bubble, title (behind the head), STEP 1 pill |
| Slime | x 680–1050 | Only the sparkles go here (no ring: removed at your request) |
| Chest, left | x 40–440, y 1100–1430 | Calendar |
| Captions | Bottom edge 270 px above the frame bottom; block shifted 100 px left of centre to clear the slime | 2–3 line lockup |

## Caption groups (each word lands on its spoken frame)
| Group | Frames | Setup line (Inter Light 58) | Pill (Allura 104, lilac) | Heavy line (Inter SemiBold) | Extras |
|---|---|---|---|---|---|
| G1 | f0–66 | Don't even | think about | none | "getting that" moves to the title's small setup words |
| (title) | f43–90 | none | none | none | PART-TIME JOB is the behind-the-head title, so it isn't repeated in the caption |
| G2 | f67–117 | when you can just | do this | instead. (156 px) | Amber dot +10 f; highlight bar wipes +6–20 f |
| G3 | f118–186 | If I had to | buy a | none | "BMW M4" is the card, so it isn't repeated in the caption |
| G4 | f187–232 | in the next | none | 28 days, (156 px) | No dot (it ends on a comma) |
| G5 | f233–286 | this is | exactly | what I would do. (116 px) | 3D swing; bar under "do."; dot |

Group exit: blur 0→10 and fade over the last 7 f before the next group.

## Shot-by-shot (frame-level)

### Act 1 · The problem
**P01 · f0–29 · "Don't even"** (board: f8)
- f0: "Don't" blurs in (blur 10→0, y 12→0, 9 f) in **cyan** and settles to ivory over 18 f. "even" does the same at f7.
- f0–8: **punch-in** 1.00→1.08, origin at the face centre (420, 640), ease-out. It eases back to 1.03 by f30.
- f0–14: **amber edge flash**: inset glow, 2 f up and 12 f down. It sets the "warning" tone.

**P02 · f12–43 · "think about"** (board: f30)
- f12 "think": a **lilac glass thought bubble** pops at the top left (scale 0→1.06→1, 12 f), and two small trailing bubbles pop at +3 f and +6 f.
- Its three dots pulse in sequence (ivory, ivory, cyan; 8 f each, looping).
- f12: the pill "*think about*" pops (13 f), and the script writes on left→right under a mask.
- f40–43: the bubble **pops out** (scale 1→1.15→0, 6 f) just before the title lands.

**P03 · f43–66 · "getting that part-time job"** (board: f63)
- f37 "that": the small setup words "getting" / "that" blur in at the title's ends (40 px, ivory).
- f43 **PART-TIME** lands:
  - an ink line drop (4 f), then a slide from −90 px with blur 16→0 over 15 f;
  - a ghost copy trails 60 px behind and collapses over 26 f;
  - the outline square pops +3 f;
  - cyan/lilac/amber pixel clusters jitter every 5 f and blink out by about +30 f.
- f57 **JOB** lands bigger (240 px), with the same recipe.
- Layer order: title → **speaker cut-out** → grade, so the hair overlaps the letters.
- **Name hit:** riser → air whoosh → impact on f43.

**P04 · f67–90 · "when …"** (board: f74)
- f67: an **amber ink slash** rips diagonally through both words (stroke 22 px, glow, drawn in 8 f, ease-in), with a **retro fail sting**.
- f67–75: the title drains to 30 % saturation.
- f78–90: it **drops away**: y +60 px, rotate 4°, blur 0→10, fade. Gravity ease-in, 12 f.
- The G2 caption starts with "when" in cyan.

### Act 2 · The alternative
**P05 · f84–108 · "just do this"** (board: f100)
- f84: the pill "*do this*" pops and writes on.
- f88–103: the **camera eases toward the slime**: scale 1.03→1.06 with the origin moved to the slime (850, 760), over 15 f, ease-in-out.
- f93 "this": the drift is the only move on "this". There's no ring around the slime; you asked for it to be removed in v2.

**P06 · f103–117 · "instead."** (board: f110)
- f103 "instead." does the **heavy bloom**: blur 16→0, brightness 1.6→1, scale 1.08→1 over 16 f.
- The amber dot pops at f113. The **highlight bar** (lavender → cyan → ivory) wipes under the word f109–123.
- f108–117: four **cyan-white sparkles** twinkle on the slime (scale 0→1→0.6, staggered 3 f, rotating 20°).

### Act 3 · The goal
**P07 · f118–137 · "If I had"** (board: f126)
- f118 **light-beam sweep**: a cone of light opens from a small ring pivot at the top left (90, 150), from 0° to about 230° over 20 f.
  - It has soft ivory edges and a cyan glow, plus a 1 f white flash at f118.
  - Inside the cone is the **lavender world**: ink-lavender radial background, lilac and cyan light pools drifting slowly, a faint 72 px grid masked to the centre, and particles rising.
- G3 starts on "If".

**P08 · f140–165 · "to buy a BMW"** (board: f160)
- f140: a **white placeholder card** pops in at the centre (0.86→1.03→1, blur 18→0, 12 f).
- f146–154: a **comet** (white head, lilac tail) arcs in from the bottom right over 8 f and lands on the card on **"BMW" f154**.
- f154–162: the card flashes white and **develops** into the photo card:
  - The real white M4 bursts out over the top edge.
  - The ink bottom has the bold italic "BMW M4" and "Goal car · 28-day plan".
- **Name hit** on f154.

**P09 · f166–186 · "M4"** (board: f180)
- f166 "M4": the **headlights glint**: two cyan-white star flares with horizontal streaks, 2 f up and 10 f down.
- f160–172: five amber **stars pop** with a 2 f stagger.
- f160–190: a cyan/ivory **light ribbon** loops the card (draws over 30 f), then flows (moving dashes).
- Blurred, tilted **ghost cards** drift at the sides (±8 px).
- The card bobs gently (4 px). The world camera pushes slowly, 1.00→1.04.

### Act 4 · The deadline + promise
**P10 · f187–195 · "in the next"** (board: f190)
- f187 **flash back**: a 1 f white flash at 70 %, then an overexposed fade (3 f).
- The footage goes scale 1.12→1 and blur 28→0 over 9 f. It's a hard return to you.

**P11 · f190–232 · "28 days,"** (board: f210)
- f190: the **28-day calendar** pops in at the chest left (glass, lilac border, cyan bottom glow; 12 f). Header "Day 1 → 28" with the chip "● 28-DAY PLAN".
- f192–214: 28 cells **cascade** in (0.8 f stagger, each pops 0→1.1→1). They light lilac in order, like days ticking past.
- **f202 "28":** cell 28 fills **amber** and scales 1.12, and an ivory hand-drawn circle loops it (10 f).
- A **tiny M4 drives in** from the right and parks beside Day 28 (12 f, ease-out, slight tilt settling). The goal and the deadline sit in one image.
- f217 "days,": the heavy blooms in.
- f223–233: the calendar folds away (scale 1→0.9, blur, fade, 10 f).

**P12 · f233–260 · "this is exactly"** (board: f250)
- f243 "exactly": **punch-in** 1.03→1.08 over 8 f at the face. The pill pops and writes "*exactly*".
- Clean frame: just your face and the line.

**P13 · f261–286 · "what I would do."** (board: f282)
- f261: the heavy line **swings in 3D**: rotateY 75°→−18°→−10° and rotateZ −12°→−3°, back-ease, 22 f.
- f280 "do.": the bar wipes under "do." and the amber dot pops.
- f268 *(optional)*: the **"STEP 1" ink pill** types on at the top left behind a glowing caret (about 11 f), as a hook into part 2.
- End: hold. If this is the whole video, fade to ink over the last 6 f instead of showing STEP 1.

## Camera track
| Frames | Move |
|---|---|
| f0–8 | Punch 1.00→1.08 (face) |
| f8–30 | Ease to 1.03 |
| f30–88 | Slow push 1.03→1.04 |
| f88–103 | Drift to the slime, 1.06 (origin 850, 760) |
| f118–186 | Explainer world push 1.00→1.04 |
| f187–196 | Zoom-blur 1.12→1 |
| f196–243 | Slow push 1.00→1.03 |
| f243–251 | Punch 1.03→1.08 |
| f251–286 | Hold with micro-drift |

## Sound cue sheet (from your library; start = cue − the file's peak)
| Cue frame | Event | File | Start (s) | Vol | Note |
|---|---|---|---|---|---|
| f43 | PART-TIME lands | `ref_riser` (trimmed to 1.06 s) | 0.37 | 0.8 | name hit |
| f43 | " | `whoosh_air` | 0.71 | 0.85 | name hit |
| f43 | " | `impact` (attack aligned) | 1.39 | 0.8 | name hit, trimmed to 0.6 s |
| f67 | Slash | `game_over` | 2.12 | 0.5 | retro fail sting |
| f118 | Beam cut | none | none | none | screen changes stay clean |
| f146 | Comet + develop | `ref2_g_comet` | 4.60 | 0.3 | ducked: within 1 s before the name hit |
| f154 | BMW lands | `ref_riser` / `whoosh_air` / `impact` | 4.07 / 4.41 / 5.09 | 0.8 / 0.85 / 0.8 | name hit |
| f187 | Flash back | none | none | none | clean cut |
| f196 | Calendar cells | `gears` | 6.43 | 0.25 | ticking cascade |
| f202 | Day 28 | `ref_ding` | 6.60 | 0.5 | first of at most 2 dings |
| f261 | 3D swing | `paper_slide` | 8.35 | 0.5 | whip / swing |
| f268 | STEP 1 typing | `ref_typing_b` (0.4 s) | 8.82 | 0.18 | only if STEP 1 is kept |

- No sound on captions, sparkles, stars or dots (house rule).
- Master gain about 0.6, then a limiter at 0.85.
- Music suggestion: an instrumental bed at 100–120 BPM (light synth / lo-fi, to match the pastel look), ducked under the voice. Add trending audio in-app at 5–10 %.

## Choices to confirm (defaults in bold)
1. **The title is cyan.** The alternative is lavender.
2. **The pill is lilac.** The alternative is ivory → amber.
3. **The card uses the real M4 photo** (option B), not the drawn icon (option A).
4. The card subtitle **"Goal car · 28-day plan"** can be changed or dropped.
5. **The name hit goes on both PART-TIME JOB and BMW M4.**
6. **STEP 1 pill at the end** (does part 2 follow?), or a fade out.
