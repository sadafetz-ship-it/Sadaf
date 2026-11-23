# House style: this user's standing preferences

These rules came from the user, across full edits (crypto-websites reel and the 16:9 house-buying video, Nov 2026). Apply them by default on every new
project. Ask only when the user's new instructions conflict with them. When the user gives new preferences, append them here.

## Contents
1. Working rules (approval gates, what NOT to change)
2. Palette and colour rules
3. Captions: lower-third lockup, Golden Hour script pill, low-glow heavy words + highlight bar
4. Layout and modes
5. Pixel effect ("red Scripts" style), the only pixel style the user wants
6. Card animation recipes (measured from the user's references)
7. Other recurring elements
8. Sound design: library roles, combos, mix rules
9. Things the user rejected (do not repeat)
10. Frame (keep 16:9), face-free side zones, Scripts-style name lockup
11. Motion-graphics library (gauge, product card + ribbon, calendar→card morph, gold key, $$$, beam sweep...)

---

## 1. Working rules
- **Order of work:**
  1. Word-by-word transcript.
  2. Storyboard.
  3. **Still preview frames** (real stills from the footage with overlays).
  4. **Wait for approval**.
  5. Build in **Remotion**.

  Never build before the user approves the preview.
- **"Change the animation" means the motion only.** Keep the element's look exactly: shape, colours, text, layout. Change its look
  only when the user says "appearance / design / look". (Mistake made once: the Farside board got redesigned when only its motion
  was asked for. The user was unhappy.)
- When the user circles parts of reference frames, study **only the circled parts** and map each one to a named element in the edit.
  Confirm the mapping in a short table.
- Reference colours never carry over: **recolour every reference effect into the user's palette**.
- Send a progress line during long renders. Answer "what happened / how long" questions with real status (elapsed time, frame
  counts).
- Commit and push after every meaningful step (a stop hook enforces this). Never commit the raw upload twice. Never commit voice
  files that aren't SFX.

## 2. Palette (default purple set; replaced by the circled accent when the user gives one, see §3)
| Token | Hex | Use |
|---|---|---|
| Ink | `#190D32` | backgrounds, card bodies, text on light pills |
| Deep | `#5426A8` | gradient starts, empty tracks |
| Violet | `#8050E8` | main accent, glows, lines |
| Lilac | `#B99AF5` | script word, highlights, sparkles |
| Mist | `#EEE7FF` | all main text |

**Detail colours** (small accents only, never large areas):

| Token | Hex |
|---|---|
| blue | `#5B6CFF` |
| magenta | `#C65BF2` |
| rose | `#FF7EC8` (the dot after heavy words, `+` sparkles, chip dots) |

- **"The colour for picture effects and cards should be purple"**: pixels, glows, cards and comets all use violet / lilac / magenta
  tints.

## 3. Captions (current default, updated Nov 2026)
The transcript is always on screen in the **lower third**: block bottom edge 64 px above the frame bottom (16:9) or 270 px
(9:16), centred, never above the top of the lower third.

**Three-line lockup:**

| Line | Font | 16:9 size | 9:16 size | Look |
|---|---|---|---|---|
| 1. Setup | **Inter Display Light** (Inter variable, `opsz` 32) | 46 px, tracking −1.4 | 58 px, −2 | Cream. Each word blurs in on its spoken frame (blur 10→0, y 12→0, 5 f) in the accent colour and settles to cream over ~10 f (karaoke). Max-width 1200 px (16:9) / 900 px (9:16), `text-wrap: balance`. |
| 2. Script **pill** | **Allura** script in **ink** on a glowing gradient pill | 76 px | 104 px | Taken from the circled "Golden Hour" reference. Pill: `linear-gradient(180deg,#FFE58A,#FFC000 55%,#F0913A)`, inset cream hairline, glow `0 0 22px rgba(255,192,0,.6), 0 0 50px rgba(235,136,88,.45)`. Pops in (scale 0.6→1.06→1, 8 f), then the script writes on left→right with a mask over the spoken words. |
| 3. Heavy | **Inter Display SemiBold** (wght 620) + accent dot | ≤118 px, −5; `min(118, 1404/chars)` | ≤156 px, −7; `min(156, 1872/chars)` | **Low glow**, the "Nexus." / "$10,000 per month" look (details below). |

**Heavy word style:**
- **Fill:** `linear-gradient(180deg,#FFF 30%,<pale accent tint> 70%,<light accent> 100%)`. For Golden Hour that is `#FFF1CF` → `#FFE2A0`.
- **Glow:** one soft glow only: `drop-shadow(0 0 8px rgba(<accent>,.35)) drop-shadow(0 2px 14px rgba(0,0,0,.35))`. The old
  4-layer glow stack was too strong (the user's call).
- **Dot** in the accent colour after the word. It pops 6 f after the word lands.
- **Highlight bar** (from "$10,000 per month"), used on 2–3 key words per video:
  - Look: a 0.26 em gradient bar behind the lower half of the word (dark → accent → light), with a glow.
  - Motion: wipes in left→right over 8 f, starting 4 f after the word lands.

**Heavy reveal (Scripts recipe):**
1. An accent ink line drops onto the word (4 f).
2. The word blooms in: blur 16→0, brightness 1.6→1, scale 1.08→1 over 10 f.
3. Same-hue pixel clusters jitter and blink out by about 18 f.

**Variant: 3D swing** (from "Multibillion dollar"), for the last or punchline word:
- `perspective(900px) rotateY(75°→−18°→−10°)` and `rotateZ(−12°→−3°)` with back-ease over 14 f.

**Rules:**
- **Script mask:** pad the script span 60–100 px with matching negative margins. Otherwise the mask clips the loops
  ("mad" → "maq").
- **Grouping:** one hero word per group, placed near the end of the phrase, so it stays on screen ≥0.5 s. A leftover tail
  ("right now,") goes on a small 4th line under the heavy word instead of a new group.
  - Groups are matched to transcript tokens in order, so every word lands on its spoken frame.
- **Exit:** the group blurs out (blur 0→10, fade) over the last 4 f before the next group starts.
- **Swoosh streak** (white arc) brings in each "First / Second / Third", **above** the caption.

**Accent per video:** when the user circles a colour reference, recolour the whole edit into it (replace the purple set, don't mix).
- Golden Hour set: ink `#160C06`, umber `#6B3410`, ember `#EB8858`, gold `#EDBF1E`, amber `#FFC000`, cream `#FFF4DE`, title solid `#FFB21A`.
- The reference's swatch chips gave the hexes directly.

## 4. Layout and modes
- **Zones:**
  - Top third: site or topic name **behind the head**. Speaker cut-out layered on top; grade drawn over the cut-out too.
  - Chest: cards.
  - Lower third: captions.
- **Alternate every 1.3–2.5 s** between four modes:
  - caption-only;
  - name behind head;
  - card on chest;
  - **full-background explainer** (dark ink world, violet/blue light pools, faint grid, drifting particles).

  The user explicitly wants full explainer scenes, not only overlays.
- **Concrete words get a visual:** 😤 sticker + edge flash on "mad", ₿ coin on "Bitcoin", etc.
- **Camera:** slow push per talking-head stretch, 4 f punch-ins on key words, zoom-blur (scale 1.12→1, blur 28→0, 5 f) on cuts.

## 5. Pixel effect: "red Scripts" style ONLY
The only pixel effect the user wants. Measured from the reference, ~30 fps:
1. **Line drop.** A thin accent line (4 px, violet, glowing) drops onto the word: 4 f.
2. **Bloom.** The word blooms in: blur 16→0, brightness 1.6→1, scale 1.08→1 over 10 f.
3. **Pixel clusters.** At the same moment, **chunky square pixels in stair-step / tetromino clusters** appear at 5–6 anchor points
   around the word's box (corners and edges).
   - Cell size ≈ 0.2 × font size; 34 px for big names.
   - Colours: violet / lilac / magenta / `#D8C4FF` / deep, each with a glow.
   - They jitter one cell sideways every 3 f and flicker in opacity.
   - They **blink out one by one** by ~18 f.
4. Use on every heavy word and every behind-head name.

**Never use:** a row of 5 loader pixels, scattered dissolve pixels on caption change, or a full-frame pixel grid on cuts. The user
rejected all three.

## 6. Card animation recipes (motion only, applied to the user's cards)
| Recipe | Measured motion | Used for |
|---|---|---|
| **Zoom drop-in** ("fixes." cards) | Line drops, then the card flies in from top-left at scale 1.6 with blur 30 → settles to 1 with a tilt (rot −14°→target) in 10 f, ease-out cubic. Then a gentle 4 px bob. Back card first, front card 3 f later. | small chest cards |
| **Whip-in** ("mistake / Life") | Slides 700 px from the side with skewX 14→0, blur 24→0, scale 1.08→1 in 9 f. Overshoots 18 px with an extra tilt, settling by +6 f. | big dashboard cards |
| **Comet + glow reveal** (green photo arc) | A glowing white comet (6 px stroke, mist/lilac glow, head-tail trail) arcs in over 8 f and lands on the card. The card flashes **white** (placeholder) and "develops" into its content over 8 f, scale 0.6→1.06→1. | card rows, number tiles |
| **Line path + ghost-to-sharp** (photo stack on red line) | A thin violet line draws a curve; elements along it appear ghosted (opacity 0.4, blur 14, scale 0.88) and sharpen over 10 f. | node diagrams |
| **Quest-card morph** (green "Trial edit") | App-icon pops (0→1.15→1, 7 f) → stretches into a pill (6 f) whose label types on (~11 f) → holds ~10 f → pill **morphs into the full card** (clip-path inset + radius, 8 f) with a glow bloom → content fades in (9 f) → main button pops last. | CTA boards ("Comment …") |
| **Input bar → orb → card** (framekush task card) | A bar types its title behind a white spark caret → "+" spins in → an orb lifts off, hovers, then drops → white flash → the bar expands into the full card → rows/buttons pop on their words → a glossy cube bounces onto the corner → at the end it folds back into the bar. | list boards |

Code for all of these is in the crypto-websites project's `remotion/src/CardFx.tsx`. Reuse it.

## 7. Other recurring elements
- **Number tiles:**
  - Look: dark purple rounded square, glowing lilac border, faint white "crack" lines, big glowing numeral.
  - Arrangement: **stacked deck** beside the head, newest number in front.
  - The user rejected the thumbnail + label + zigzag version.
- **Pill tag + cursor arrow** above each site name (category label).
- **Highlight bar** under a heavy word, **outline box flash** around a light word, **ring** drawn around a heavy word, **tilted
  bouncy** heavy word, **text arcing over the head** (typing on along a `textPath`).
- **Glass cards:**
  - Look: 48–56 px radius, ink gradient body, lilac 2 px border, **bright bottom edge + pooled glow at the bottom**, faint grid.
  - Size: cards were made ~20 % smaller after the first preview.

## 8. Sound design
- **The library is bundled with the skill:** `assets/sfx/*.wav`, with roles and peak offsets in `assets/sfx/INDEX.md`. Copy
  the files to `public/sfx/`. Never synthesise stand-ins when these are available.
- **SFX library** (user's files, peak-normalised to −3 dBFS, cue placed so the file's *peak* lands on the animation frame):

  | Role | Files |
  |---|---|
  | Whoosh | `09_Whoosh_2`, `05_Whoosh`, `06_Deep_Whoosh`, air-woosh, arrow-whoosh |
  | Impact | `Impact` |
  | Pixel / data | `04_Data_Load` |
  | UI soft | `03_NI_Soft_UI` |
  | Dissolve | `03_UI_Dissolve` |
  | Digital burst | `05_Digital_Burst` |
  | Paper slide | paper-slide |
  | Pops | `07_Ui_Pop`, `Meadia_Pop`, `double_pop` |
  | Stretch | `Ui_stretch` |
  | Gears | `02_Gears_2` |
  | Sparkle | `05_Sparkle` |
  | Retro fail | arcade game-over (for "mad" or a fail moment) |
  | Riser | `Suspense_Riser` |

- **From the user's labelled SFX reference video** (separated by silence gaps): `ref_typing_a/b`, `ref_riser`,
  `ref_light_reveal`, `ref_ding`, `ref_click`, `ref_wheel`. When the user sends a video that labels its SFX on screen, cut them by
  those labels.
- **From the user's two reference grids** (music removed with REPET-SIM foreground separation, `librosa.decompose.nn_filter`, then
  cut per event and checked with Whisper for vocal bleed): `ref2_g_drop` (zoom drop-in), `ref2_g_whip` (whip-in),
  `ref2_g_scripts` (Scripts pixel reveal), `ref2_g_comet` (comet + glow reveal), `ref2_g_photostack` (line path),
  `ref2_q_pill` and `ref2_q_morph` (quest-card pill and morph), `ref2_g_golden` (Golden Hour glow). Use each with its
  animation recipe.
- **Combos (layer sounds for key moments):**
  - **Name reveal:** riser → light reveal + soft impact + data-load → ding on the pill tag (+0.2 s).
  - **Scene cut:** whoosh + digital burst + light-reveal shimmer.
  - **UI pop:** pop + crisp click.
  - **Typing UI** (bars, pills): `ref_typing`.
  - **Progress bars / chips ticking:** `ref_wheel`.
  - **Card opens:** light reveal (+ impact).
- **Riser → whoosh → impact rule (user, final):** use them **ONLY when a crypto/site name lands** (the behind-the-head name
  reveal), **not** on screen changes or anywhere else:
  - **riser** (`ref_riser`): ~0.85 s build that **ends on the name's landing frame**; trim it (`len` = peak offset) so no tail spills.
  - **whoosh**: one smooth pass (air-woosh), peak crossing the landing. Avoid choppy multi-burst whooshes.
  - **impact**: align its **attack/onset** (not its loudest point) to the landing frame; trim to ~0.6 s.
  - Check the effects-only envelope (mix minus voice): a steady climb into the landing, then a hold for ~0.6 s.
  - **Screen changes stay clean:** no pop/click-type sound on a screen change. Drop every non-name cue from 0.5 s before to
    0.3 s after each cut (captions often start exactly on a cut, so their click must be skipped there).
  - **Duck pops under the name hits:** any other sound (caption click, bold-word hit, reveal, comet) from 1 s before a name
    lands to 0.6 s after plays at **30 %**, so the riser, whoosh and impact lead.
  - **No unnecessary UI pops**: none on dots, chips, tags, ENTRY/EXIT, icons, "+" buttons, bullets, sparkles, progress bars or
    doubled clicks.
- **Visual-element pops are WANTED (user):** "no unnecessary UI pops" does NOT mean no pops. Keep a pop on each meaningful
  visual element appearing: cards in a row (`pop_media`), diagram nodes (Wallets / Exchange), chart tags (ENTRY / EXIT)
  (`pop_ui`), at vol ~0.5. Mark them `keep` so the screen-change filter doesn't drop them. Remove only filler pops (dots,
  chips, sparkles, progress ticks, doubled clicks).
- Also pop: each **number-icon tile** as it appears (`pop_media`, +0.12 s after the name), each **list-board bullet/point**
  (`pop_ui`). **Typing sounds stay low** (vol ~0.18).
- **Riser / whoosh / impact level:** loud and clear (vol riser 0.8, whoosh 0.85, impact 0.8, × master 0.62). Effects peak
  ≈ −5 dB around a name hit, under the limiter.
- **Caption sound rule (user, final):** captions get **NO sound at all**. No click per caption and no hit on bold words or names
  (the user rejected both). Before sending, **count plays per sound file** (bundle `Sfx.tsx` with esbuild and count the cue
  list). Any one sound repeating ~10+ times reads as unnecessary, so cut it or vary it. When the user can't name a sound, export
  every used SFX as numbered mp3s plus one catalog file with timestamps (`edit/sfx_used/`) and let them pick by number.
- **Mix rules:**
  - All SFX × master gain ~0.6.
  - Quiet caption details (0.13–0.25).
  - **Render the audio with Remotion** (`--codec=wav`, fast when only sound changed), mux onto the existing video, then apply
    `alimiter=limit=0.85`.
  - Target: no clipped samples, peak ≈ −2.5 dBFS, effects within about ±4 dB of the voice.
- **Never use sounds separated from a reference that has vocals/rap under it** (bleed sounds like a weird voice; user rejected
  `ref2_q_pill` / `ref2_q_morph` / `ref2_g_golden`). Avoid sustained tonal swells (e.g. `ref_light_reveal`) on UI boards: they
  read as a sung "aah". Check candidates with `librosa.pyin`; mostly-pitched files are suspect.
- Files that turn out to be **speech** (e.g. someone's voiceover) are not SFX. Tell the user and leave them out.
- **Music:**
  - Suggest instrumental, no-vocal beds (100–120 BPM, dark-tech / minimal synth), ducked under the voice.
  - Trending songs go in **in-app at 5–10 %**, never baked into the export (copyright).

## 9. Rejected: do not repeat
- Glass "phone" card behind the speaker.
- Whole edit inside a tilted glowing phone frame.
- Arrows before words ("→ inflows").
- "Save this / The list" recap board at the end. End on the last scene with a short fade.
- Loader-row / dissolve / grid pixels (see §5).
- Thumbnail tiles in a zigzag (see §7).
- Redesigning a card when only its animation was requested (see §1).

## 10. Frame, face and title rules (Nov 2026)
- **Frame:** a 16:9 source stays **16:9 (1920×1080)**, full frame with no crop, unless the user asks for vertical.
  Never crop to 9:16 without asking.
- **Nothing on the face.** Measure the face box from the U²-Net cut-out mask on every preview still:
  - Columns of the mask in a band 80–320 px below its top give the head's x range.
  - Keep a margin of 40 px or more.
  - Cards and titles live in **side zones**. In the house video (face x 690–1165, y 60–540) these were left x 60–640 and right
    x 1240–1860, from y 110 to 620.
  - Camera punch-ins scale around the face centre (`transform-origin` at the face), so the face grows in place and
    doesn't slide under overlays.
- **Names / topic words** ("HOME", "PLAN") use the **"Make better Scripts" lockup**:

  | Part | Spec |
  |---|---|
  | Word | Flat solid accent word (`#FFB21A` for Golden Hour), weight 780, tracking −14, line-height 0.86, no gradient, no glow |
  | Setup words | Two small cream words above the left and right ends ("buying a … new", "your … 10-year"), 40 px, each blurring in on its spoken word |
  | Square | Small outline square (26 px, 3 px cream border) to the left, popping in 3 f after the word |
  | Pixels | Chunky same-hue stair-step clusters at the lower-left and upper-right, cell size about 0.13 × font size, life about 22 f |
  | Entry | Ink line drop, then the word slides in from −90 px with blur 16→0 over 9 f. A **motion-blur ghost** copy trails 60 px to the right and collapses to 18 px over 16 f (opacity 0.55→0.25). |
  | Idle | Drifts ±3 px |
  | Exit | Blur out over 6 f |

  - In 16:9 the lockup sits in a side zone, fully readable. In 9:16 it can go behind the head.
  - No pill tags or cursor on names.

## 11. Motion-graphics library (from the user's reference grids, Nov 2026)
The reference clips, the circled stills and a finished example are in `assets/`. See `references/reference_library.md`.
All of these are recoloured into the video's accent. The working code is in `scripts/remotion_House*.tsx`:
- `Fx`: helpers.
- `Captions`: the lockup.
- `Overlays`: talk-shot graphics.
- `Explainers`: full-screen scenes and transitions.
- `Main`: camera, grade and layering.
- `Sfx`: the cue sheet.

Plus `remotion_house_theme.ts` and `make_sfx.py`.

| Graphic | Source | Recipe (30 fps) | Used for |
|---|---|---|---|
| **Glass gauge widget** | "Performance 48°" | A **pixel-mosaic dissolve** comes first: a 10×10 grid of 44 px squares in accent/umber flickers on over 5 f and dissolves over 10 f. The glass tile (radius 84, light-to-dark gradient ending in an accent glow at the bottom) pops in (0.86→1.03→1, blur 18→0, 9 f). Dial ticks light up one by one over 18 f, and the number rolls up to land on its spoken frame. | numbers and durations ("10 yrs") |
| **Product card + light-ribbon loop** | green / teal / purple product cards | The card is a light top (cream→accent gradient with an icon tile) over a dark bottom with a bold italic title, a subtitle and 5 stars that pop with a 2 f stagger. It develops from a white placeholder (glow reveal, 8 f). A thick glowing cream ribbon (blurred, with accent drop-shadows) draws a loop around the card over 30 f, then **flows** (moving dashes). Blurred, tilted ghost cards sit at the sides. | the key item / goal in an explainer |
| **Music-player card** | Spotify-style "If I hear something I like" | Album art is a crop of the speaker. Title, "Playlist · N steps", a round accent play/pause button, and the steps as tracks. The play button is pressed on the matching word. | a list of steps (offered; the user preferred the calendar for "get started") |
| **Calendar → click → card morph** | the user's own request | The glass "Day 1" calendar pops in; day cells cascade in (0.5 f stagger) and today's cell is accent-filled, scaled 1.12 and hand-circled. A cursor glides to today's cell and **clicks** it (cell flashes cream, ripple). The **cell grows into the next card**: position, size and radius morph from the cell to the card over 8 f, with an accent glow bloom. The calendar blurs to 6 px and dims to 55 % behind it. The card's content pops in order (icon → chip → title → buttons), then the cursor moves to and **presses** "Get started" (scale 0.93, glow flash, ripple). | "get started today" / any call to action |
| **3D gold key + orbit ring** | "Consistency is the Key" | A glossy key with a white-gold-to-umber gradient and glow zoom-drops in (from 1.5, −240 px, tilt). A thin cream arc draws over 14 f and a dot travels along it. The key floats ±6 px and sparkles twinkle around it. | ownership / "the key to" / milestones |
| **"$$$" + V lines + 3D swing word** | "Multibillion dollar / $$$" | Huge condensed `$` glyphs (Antonio 700, cream→accent fill) **drop in one by one** (3 f stagger, −140 px, blur, back-ease). Thin V lines draw behind them. On the punchline word the glyphs pulse (1.07) and the heavy caption **swings in in 3D**. Combine with the ember **edge flash** (inset glow, 2 f up, 12 f down). | money, cost, "pricey" |
| **Light-beam sweep transition** | red / blue spotlight cone with a ring pivot | The incoming scene is revealed through a **cone of light** from a small ring pivot near the top-left. The cone widens from 0° to about 230° over 12 f, with soft glowing cream edges and a small 1 f white flash. | cuts into full-screen explainers |
| **Zoom-blur + white-flash cut** | Golden Hour entry | A 1 f white flash at 70 %, then an overexposed fade (3 f). The footage goes scale 1.12→1 and blur 28→0 over 5 f. | cuts back to the speaker |
| **Ink pill label typing** | black "Bayerische Motoren Werke" pill | A dark rounded label with an accent border; text types on behind a glowing caret and can collapse to an acronym. | short labels / steps (offered) |
| **Neon light ribbon** | "isn't a Luxury" ribbon | A thick blurred cream stroke with accent glow drawn across an explainer background, then flowing. | explainer backgrounds |
| **Explainer world** | house | An ink radial background with two slowly moving accent light pools, a faint 72 px grid masked to the centre, and particles drifting upward. | all full-screen scenes |

**Golden Hour reveal** (the circled reference, measured frame by frame):
- f0: 1 f white flash cut.
- From f1: the script sits in the pill, and the heavy word types letter by letter, about 3–4 f per letter.
- The fill runs white-yellow → orange.
- Pixel clusters: orange on the left, yellow on the right, gone by about f17.
- The lockup sits on the chest. Its pill-plus-script part became caption line 2.

