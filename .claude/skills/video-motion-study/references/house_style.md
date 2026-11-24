# House style: this user's standing preferences

These rules came from the user, across a full edit (crypto-websites reel, Nov 2026). Apply them by default on every new
project. Ask only when the user's new instructions conflict with them. When the user gives new preferences, append them here.

## Contents
1. Working rules (approval gates, what NOT to change)
2. Palette and colour rules
3. Captions: lower-third three-line lockup + "Golden Hour" glow
4. Layout and modes
5. Pixel effect ("red Scripts" style), the only pixel style the user wants
6. Card animation recipes (measured from the user's references)
7. Other recurring elements
8. Sound design: library roles, combos, mix rules
9. Things the user rejected (do not repeat)

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

## 2. Palette (default purple set; the user may supply another)
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

## 3. Captions (the transcript is always on screen)
- **Position:** lower third. Block bottom edge 270 px above the frame bottom, centred, line 1 max-width 900 px with
  `text-wrap: balance`.
- **Three-line lockup** (from the "You're not / *competing* on / **price.**" reference):

  | Line | Font | Size / tracking | Colour |
  |---|---|---|---|
  | 1. Setup | **Inter Display Light** | 58 px, −2 | Mist; each word types on in lilac and settles to mist over ~10 f (karaoke) |
  | 2. Accent | **Allura** script (OFL, `@fontsource/allura` from npm) | 132 px, lilac | Written on with a left→right mask |
  | 3. Heavy | **Inter Display SemiBold** + **rose dot** | 156 px, −7 | Auto-shrinks: `min(156, 1872 / chars)` |

  - **Script mask:** give the script span 100 px padding (with matching negative margins). Otherwise the mask clips the font's
    loops ("mad" → "maq", "detailed" → "detailea") and cuts off the glow as a visible box.
- **"Golden Hour" glow, in purple**, on script + heavy words + site names:
  - **Fill:** `linear-gradient(180deg,#FFF 10%,#F1E8FF 45%,#D2B8FF 75%,#B99AF5)`.
  - **Glow:** `drop-shadow(0 0 6px rgba(238,231,255,.55)) drop-shadow(0 0 18px #B99AF5) drop-shadow(0 0 42px rgba(128,80,232,.85)) drop-shadow(0 0 80px rgba(198,91,242,.45))`.
  - Put the glow filter on an **inner** span when the outer span has a mask.
- **Grouping:** one hero word per group. Put the heavy word **near the end** of the spoken phrase so it stays on screen ≥0.5 s.
  Groups are matched to transcript tokens in order, so every word lands on its spoken frame.
- **Swoosh streak** (white arc) brings in each "First / Second / Third / And lastly", **above** the caption, not through it.

## 4. Layout and modes
- **Never put an element over the speaker's face (user rule).** Cards, boards, rings, avatars, stickers and their glow or
  orbit rings must stay clear of the face ellipse (≈ centre (540, 560), rx 230, ry 270 on 1080×1920; check the real footage).
  Account for decorative overflow (orbit rings, glows) and camera punch-ins. Audit with a contact sheet of all talking-head
  frames before sending; text "behind the head" (under the cut-out) is fine.
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
