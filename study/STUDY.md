# Motion & Design Study: 16 reference videos (28 separate clips)

Four of the uploads are **2×2 grids** (V01, V02, V13, V15). As requested, each quadrant is treated as its own video, which gives **28 clips**:
12 single videos + 4 grids × 4 quadrants. The Instagram logos, account names, timers and buttons are ignored.

| What | Where |
|---|---|
| Every clip cut out (grid quadrants cropped to separate 540×960 files) | `clips/` |
| **Every frame** of every clip on contact sheets (frame no. + timestamp on each thumbnail, 50 frames per sheet) | `frame_by_frame/<clip>/sheet_NNN.jpg` |
| Overview sheets at 6 fps (bigger thumbnails, easier to read) | `review_sheets_6fps/` |
| Timestamped beat-by-beat notes for each clip | `per_clip_breakdown.md` |
| This synthesis | `STUDY.md` |

### Clip index

| Clip | Source file | Content | Style family |
|---|---|---|---|
| V01a | VID_20261121_020154 (TL) | Bodybuilding talent cards, lightning, FIFA card | Neon cinematic |
| V01b | ″ (TR) | Supplement talking head "What is Yohimbine" / "3 ways to lose fat" | Neon cinematic, pixel blocks |
| V01c | ″ (BL) | Energy drink "BOMB" / "LEG Day" / "Golden Hour" | Neon cinematic, pixel blocks |
| V01d | ″ (BR) | "Gyms in California" stickers / glass quest card | Neon + glassmorphism |
| V02a | VID_20261121_020012 (TL) | Realtor walking: "USA, Buying or Selling, 2027" | Kinetic type over footage |
| V02b | ″ (TR) | "Nobody cares what you sell" (white studio, red) | Swiss/editorial, red accent |
| V02c | ″ (BL) | "This one tip will change your life" (white studio, sky blue) | Swiss/editorial, blue accent |
| V02d | ″ (BR) | "If you're creating content with your phone…" (sage green) | Minimal studio, white type |
| V03 | VID_20261120_221702 | Fintech "Send money" UI loop | Product UI motion |
| V04 | VID_20261120_221626 | 3 stacked dark SaaS cards, ember orange | Product UI motion, triptych |
| V05 | VID_20261120_221547 | 3 stacked cards, violet/orange/blue "Creative UI animation" | Product UI motion, triptych |
| V06 | VID_20261120_215244 | Behind the scenes: same piece + After Effects timeline | BTS: shows the stagger logic |
| V07 | VID_20261120_215043 | AI task-assistant micro-interaction | Product UI motion |
| V08 | VID_20261116_125631 | Glowing AI prompt bar on laptop (50 fps) | Product UI motion / BTS |
| V09 | VID_20261113_044546 | "Competing on value, not price" spotlight studio | Dark premium, acid yellow |
| V10 | VID_20261113_032454 | Realtor talking head, Raw vs Edit | Warm premium, orange-gold |
| V11 | VID_20261113_032158 | "Your content needs more heat" widget promo | Hue-shifting glass widget |
| V12 | 1000205451 | Uzbek interview captions, lime | Caption-driven, lime chips |
| V13a | VID_20261112_064339 (TL) | "Congrats, you built a product" | White studio, pixel font, lime |
| V13b | ″ (TR) | "You are growing / profits aren't" CRM | Navy + 3D sphere + glass |
| V13c | ″ (BL) | "Why waste time… Let Claude handle the rest" | Crimson, one word at a time |
| V13d | ″ (BR) | "$1,000,000 business with Grok bot" | White studio, red, mascot |
| V14 | 1000201892 | $50 vs $150 edit, "Social media / Eyeballs" | Comparison + CTA, neon lime |
| V15a | VID_20261107_045005 (TL) | Poster edits: astronaut, Consistency key, Air Jordan | Graphic poster |
| V15b | ″ (TR) | Music producer UI, "HIT RECORD", geometric wipes | Poster + colour wipes |
| V15c | ″ (BL) | PC-hardware widget, creator-matching avatar ring | Hue-shifting widget (as V11) |
| V15d | ″ (BR) | "NOT BMW" yellow poster / samurai "Cut" poster | Graphic poster |
| V16 | 1000203885 | $150 edit, sales coach, gold | Comparison + CTA, gold |

---

## 1. Design principles (colour, type, layout, effects)

### 1.1 The core recipe that runs through almost every clip
1. **One neutral base and one loud accent.** Each video picks one base world (black, white seamless, a single studio colour, or a warm room) and **one** saturated accent. The accent is used only on the keyword, small particles and UI chips. Secondary text is always white, black or grey.
2. **A two-tier type system.** A *small, light, neutral* setup line ("You're not", "If you are creating", "Does your content") sits on top of a *huge, heavy* keyword ("price.", "content", "show"). The size ratio is roughly **1 : 4 to 1 : 6**.
3. **A third voice for emotion.** A script or handwritten face ("competing", "California", "Don't", "Day", "Cut", "In") is set between the two tiers or tucked against the big word, usually in the accent colour.
4. **Depth layering.** The big keyword sits **behind the speaker's head** (rotoscoped matte), and the small captions sit in front. Examples: "Usa", "2027", "sell", "Life", "LEG", "GYMS", "Grok", "HIRE", "HOUSE", "HIT RECORD", "Aslani". This single trick makes flat talking heads feel 3D.
5. **Glass UI as a graphic language.** Rounded "squircle" app tiles, frosted cards with a 1 px light border and inner glow, pills, toggles, notification cards, profile cards and lanyard badges. Product language is borrowed to illustrate abstract words.
6. **Glow is the finish.** The accent always carries an outer glow or bloom (neon). Light streaks, light leaks and rim lights add energy on dark grounds.

### 1.2 Colour palettes observed

| Family | Base | Accent | Used in |
|---|---|---|---|
| Neon lime on dark | near-black / dark gym / dark room | lime **#C6FF3A → #B5E61D**, glow | V01a, V01b, V01d, V12, V14 |
| Amber / gold on warm dark | dark warm interior | amber **#FFB300**, gold gradient **#F7D774 → #C89B2C** | V01c, V10, V16 |
| Acid yellow on black spotlight | pure black + top spotlight | **#E6F21E** | V09 |
| Editorial red on white | light-grey seamless **#ECECEE** | red **#D71920**, dark-red gradient | V02b, V13d (hot red-pink **#F0234A**) |
| Sky blue on white | white seamless | cyan **#6FD3F5**, teal two-tone | V02c |
| Sage studio | sage **#6E8F6A** | white only | V02d |
| Fintech lime on light grey | **#ECECEE**, black cards **#1E1E1E** | **#9BE15D** | V03 |
| Ember UI | black **#050505** cards on white | orange **#FF5A1F → #FF8A3D** glow | V04 |
| Violet/blue UI | black cards on cream **#FBF8F3** | violet **#6B4BFF**, blue **#3D3BFF**, orange smoke | V05, V06, V08 |
| Electric blue gradient | navy **#0E0E14** → electric blue **#2B2BD9** | cyan button **#19E0D0**, purple 3D | V07 |
| Hue-shift per beat | full-bleed gradient | lime → yellow → orange → red → teal → blue → purple | V11, V15c |
| Navy + moss | navy **#0A2A66** / olive-lime **#C9D97A** | red for a "drop" beat | V13b |
| Crimson | burgundy **#5A0F1A → #2A0508** | white + coral **#D97757** | V13c |
| Poster yellow / red sun | **#FFB000** / white + red circle | black ultra-condensed type | V15d |

**Colour rules seen:**
- New keywords often **enter in the accent with a glow, then cool to white** (V02a "Buying / Selling", V12, V16). Colour marks what is *new*.
- **Colour changes carry emotion:** a red wash for "panic" (V16); a red arrow for "profits aren't" (V13b); a desaturated frame for "more tasks / overwhelm" (V13b); a heat ramp lime → red for "more heat" (V11).
- **A flash or colour swap is itself a transition:** a 1–2-frame orange wash re-skins the same card template (V01a); a full-frame inverted/negative frame (V02b); a white silhouette matte flash (V02d).

### 1.3 Typography
| Role | Look | Examples |
|---|---|---|
| Hero keyword | Heavy grotesk, lowercase or title case, tight tracking, often a white→grey or white→accent **vertical gradient**, sometimes an accent-coloured period | "price.", "value.", "sell", "content", "phone", "show", "pay.", "Count." |
| Hero keyword (condensed) | Ultra-condensed tall display (Druk, Bebas, Anton feel), all caps | "LEG", "GYMS", "2027", "mistake", "HIRE", "HOUSE", "NOT BMW", "Aslani Edits", "SELL ANYTHING" |
| Setup / caption | Light or regular grotesk (Inter, SF, Satoshi feel), small, sometimes widely tracked | "You're not", "What's The Difference", "If you are creating" |
| Emotion accent | Brush script or italic serif in the accent colour | "competing", "California", "Day", "Don't", "In", "Cut", "Golden" |
| Tech / UI | Inter or SF semibold at UI sizes; pixel/bitmap fonts for tech-glitch scenes | V03–V08 UI; V13a "But", "?" pixel font |
| Labels | Tiny caps in pills or tags | "QUEST", "High / Low / Medium", "$150 Edit" |

The display face is **never used for more than 1–2 words** at a time.

### 1.4 Layout and placement
- **Talking head, seated, full body, lots of headroom.** The empty top third is the type stage. Text sits **above or behind the head**, with keyword tops at about 8–20 % of frame height.
- **The secondary text zone is chest or waist height** (lower-middle third): captions, pills and lists over the torso (V01b, V01c, V02d "result", V10 captions, V12, V16 rules card).
- Keep the face clear. The text overlaps the head only when the word is masked behind it.
- **Symmetry and centring.** Almost all lockups are centre-aligned. Asymmetry appears only when the subject is off-centre (V02c) or on stacked right-aligned words (V13c "Handle / the rest").
- **Device frames as containers.** A translucent phone shape behind the subject (V09, V13b), a phone-card with a neon border (V12), a "Raw" vs "Edit" phone pair (V10, V14, V16), a viewfinder with corner brackets (V13c, V16 B-roll).
- **Triptych layout** for product UI: three rounded 16:9 cards stacked in a 9:16 frame, each looping a different scene, out of phase (V04, V05).
- **Persistent conversion layout**: a comparison pair on top and a CTA "Comment "Raw" / And I'll send you the raw video" fixed below (V14, V16).

### 1.5 Recurring objects and graphic elements
- **Pixel blocks / tetris squares** in the accent colour, used as particles, brackets, loaders or to dissolve text in and out (V01b, V01c, V02a, V02b, V09, V11, V12, V13a, V13b).
- **Hand-drawn strokes:** scribble loops behind words, arrows, underlines, swooshes, × and + marks, thought-bubble circles (V01b, V01d, V02a, V02c, V09, V13d).
- **Corner brackets ⌐ ┘** framing a word or the frame (V01b, V13a, V13c, V16).
- **Glass UI components:** pills, toggles, quest/notification cards, profile cards, buttons with a cursor click (V01d, V03, V07, V10, V12, V14).
- **3D emoji and props:** brain, siren, football, money, eyeballs, key, lanyard badge, glossy cube, mascot blobs, moss planet (V07, V11, V13b, V13d, V14, V15a, V16).
- **Sticker photos and cards** with a white border, tilted ±10°, stacked (V01d, V02b, V02c, V02d).
- **Light:** neon ribbons and waves, comet trails, rotating light rings around cards (V01a, V02d, V11, V15c).

---

## 2. Animation logic library
Durations are measured on the frame-by-frame sheets (30 fps). "f" = frames.

### 2.1 Entrances (text)
| Technique | Recipe | Seen in |
|---|---|---|
| **Per-letter blur reveal** | each glyph: opacity 0→100, Gaussian blur ~20→0, y +10→0 (or scale 110→100); 2–3 f stagger L→R; whole word ~8–12 f | EVOMAX, "Yohimbine", "BOMB", "content", "phone", "Motion", "Aslani Edits", "SELL ANYTHING" |
| **Word-by-word fade-up** | each word fades up with a slight blur, 3–5 f per word, the sentence builds in place | "You can't miss these insane", "Every great motion starts with", "Make Your Next Move" |
| **One word at a time (replace)** | a single word in a fixed spot swaps on every spoken word (~0.25–0.5 s each) | V13c "Why / waste / on / work", V10 "make / are / functioning / right" |
| **Typewriter with caret** | characters appear one by one with a blinking caret; caret is sometimes a glowing spark or a coloured highlighter block | V07 (spark), V08, V05 prompt bar, V11 "Every frame matters" (lime block) |
| **Scramble / decode** | random glyphs cycle every ~2 f until they resolve into the word (~0.5 s) | V13a "product" |
| **Pixel-block build** | accent squares appear like a loading bar, then dissolve into the word | V09 "price.", V02b "Scripts", V13b |
| **Slam / drop-in** | word drops from above with vertical motion blur, scale 120→100 with overshoot | V02a "Usa", V15a "Multibillion dollar" |
| **Ghost-to-solid** | outlined or blurred glowing ghost first, then solid fill | V01d "GYMS", V10 "AGREEMENT" |
| **Neon flicker** | 2–3 opacity flickers, then steady with glow | V14 "Social media" |
| **Glow-decay colour settle** | word enters in the accent with glow, then fades to white over ~10 f | V02a "Selling", V12 |
| **Odometer / count** | digits roll (slot-machine) or count up/down with motion blur | V03 balance, V04 balance, V11 "99°", V13d "$1,000,000", V14 view counts |
| **Highlighter-trail typing** | body copy appears line by line; the newest words sit on a red/lime highlight bar that fades off behind them | V05, V06, V16 rules card |

### 2.2 Entrances (objects and UI)
| Technique | Recipe | Seen in |
|---|---|---|
| **Pop with overshoot** | scale 0→115→100 % over ~6–8 f (back-out ease) | "?" marks, pills, avatar tiles, mascots, stars, × marks, priority chips |
| **Staggered cascade** | identical items pop 2–3 f apart in a line or arc | 3 × marks (V02c), mascot row (V13d), photo cards on a comet trail (V02d), task chips around the sphere (V13b) |
| **Fly-in with 3D tilt + motion blur** | from off-screen, rotationY/Z ±20°→±10°, then wobble-settle | V02b app cards, V01d stickers, V02c bubble card |
| **Shape morph (pill ↔ card)** | the container animates width, height and corner radius; content blurs in after the shape settles | V01d avatar → name pill → quest card, V07 input → card, V15d "Bayerische" pill grows |
| **Draw-on strokes** | Trim Paths 0→100 % in 6–10 f, sometimes followed by trim-off | scribbles, arrows, octagon ring, swooshes, polyline networks |
| **Physics props** | pendulum swing with overshoot (lanyard), bounce (football), orbit (avatar ring, gold key) | V16, V15a, V15c |
| **Tracked stickers** | 3D prop pinned to the hands or body | V16 football, V01a lightning on body |

### 2.3 Idle / sustain motion (so nothing is ever static)
- Plus ↔ cross toggle: rotate 45° every ~0.3 s (V09).
- Ambient pixel squares blink and drift (V01b, V02a).
- Slow push-in on footage, about 100→105 % per shot.
- Floating bob on chips and tiles, ±4 px sine.
- Rotating light ring around a card (V11, V15c); a light wave pulsing at the bottom (V11).
- A wandering cursor (V09), a twinkling spark (V07).

### 2.4 Exits
- Blur out plus scale up or down (most common), 4–6 f.
- Letters scatter or explode (V13d "Grok").
- A horizontal motion smear in the accent colour (V09 "value." exit).
- Lists scroll out vertically (V13a).
- Shape collapse (V07: card back to pill).

### 2.5 Transitions (between shots or beats)
| Transition | Frames | Seen in |
|---|---|---|
| **Zoom/defocus blur entry**: the shot starts 110–130 % scaled and blurred and snaps to 100 % sharp | 4–5 f | almost every clip start (V01b, V02a/c, V09, V13a–d) |
| **White overexposure flash** | 2–5 f | V01c, V01d, V01a (light burst) |
| **Inverted/negative frame or white silhouette matte flash** | 1–2 f | V02b, V02d |
| **Colour-wash swap** (same template, new colour) | 1–2 f | V01a |
| **Whip pan** (the whole comp slides with heavy motion blur) | 4–6 f | V02a, V13a, V13b |
| **Camera push into a UI element** (card becomes full frame) | 8–12 f | V05, V06 |
| **Liquid shape morph** (icon stretches into a capsule and becomes the next screen) | ~10 f | V03 |
| **Particle disintegrate → assemble** | ~10 f | V10 intro |
| **Pixel-mosaic dissolve** | ~10 f | V11, V15c |
| **Venetian-blind / scanline glitch** | ~4 f | V10 |
| **Ink splatter brush wipe** | ~8 f | V15a |
| **Geometric light-beam / polygon wipe** | ~20 f | V15b |
| **Katana slash light streak** | ~4 f | V15d |
| **Colour drain to monochrome** | ~6 f | V13b |
| **Hard cut to a minimal end card** (white or black, logo blur-in) | – | V03, V11 |

### 2.6 Easing and speed
- Almost everything uses **fast-out, slow-in (expo / back-out)**: the element covers ~80 % of its travel in the first 3–4 frames, then settles. Overshoot is used on pops and cards, never on large text.
- Entrances are short, **4–12 frames**. Holds are long: a keyword usually stays **1–2 s** while the speaker continues.
- Motion blur is on for every fast move, and blur is the default "softener" for in and out.
- UI loops (V03, V07) run **~4 s** and are seamless: the last state morphs back into the first.

---

## 3. Placement and timing relative to the script

Spoken audio was not transcribed (you asked me not to). The **on-screen words are the script** in these edits, and they are cut to the speaker's words. The timing rules below come from the frame-by-frame sheets.

### 3.1 How the words are split
Each spoken sentence is broken into **setup → keyword (→ tag)**:

| Spoken line | Setup (small) | Keyword (huge) | Tag / extra |
|---|---|---|---|
| "You're not competing on price" | You're not / *competing* on | **price.** | yellow ✕ and + |
| "…you're competing on value" | You're / *competing* on | **value.** | circle scribble → octagon ring |
| "Does your content show it?" | Does your content | **show** | it? + rotating arcs |
| "If you are creating content with your phone, don't expect the result" | If you are creating / With your | **content** / **phone** | *Don't* (script) + "expect the **result**" |
| "Nobody cares what you sell, they care what it fixes" | Nobody cares what you | **sell** | cards: ?, "they care what it **fixes.**" |
| "This one tip will change your life" | [This one tip] (pill) / Will change your | **Life** | ○ o bubbles |
| "Looking for an energy bomb?" | [Looking] pill / for an energy | **BOMB** | ? ? |
| "Congrats! You built a product. But…" | [Congrats!] tag / You built a | **product** (decoded) | **But** + Competitor's vs Yours |
| "Let's make it pay" | Let's make it | **pay.** | thought bubbles |

**Rules:**
1. Only **one hero word per sentence**: the noun or verb carrying the meaning ("price", "value", "sell", "life", "result").
2. The hero word appears **on the exact frame it is spoken**, about 0–2 frames early. The setup words appear 1–3 f before each word or all at once at sentence start.
3. The previous hero word is **replaced, not stacked**: it blurs out as the next sentence starts, so there is one lockup on screen at a time.
4. **Contrast pairs reuse the same position** so the eye compares them: price → value, You're not → You're, Competitor's ↔ Yours, Inspection ↔ Appraisal, Raw ↔ Edit, $50 ↔ $150.
5. **Fast talkers get one word at a time** in a fixed spot (V13c, V10 "make / are / functioning / right"), and each word lasts as long as it is spoken (~0.25–0.5 s).
6. **Lists become UI.** Enumerations turn into cards or rows that build item by item on each spoken item: "3 ways to lose fat" → 3 numbered cards; "value / difference / advantage / uniqueness" → picker wheel; three rules → checklist card; task chips → orbit.
7. **Concrete nouns get a visual**, not just a word: "eyeballs" → 3D eyes, "panic" → siren + red wash, "money" → flying bills, "football" or "game" → football prop, "badge / role" → lanyard ID, "followers" → profile card, "views" → counting pill, "growing / profits" → arrow tile turning red.

### 3.2 Beat structure (typical 5–8 s ad hook, from the grids)
| Time | What happens |
|---|---|
| 0.00–0.15 s | Zoom/blur or flash entry; the first word is already appearing (no empty frames) |
| 0.15–0.6 s | Setup line + hero word build; accent particles burst |
| 0.6–2.5 s | Hold with idle motion; extra props or tags pop on secondary words |
| ~2.5 s | **Hard switch**: new shot, B-roll, whip or flash. The template keeps going in the next shot (colour swap, same placement) |
| 2.5–5 s | Second idea: contrast pair, list or UI build |
| 5–6 s | Payoff / CTA word ("pay.", "show", "Count.", "Handle the rest") on a cleaner frame |

In the longer pieces (V10 20 s, V12 21 s, V14 20 s, V16 36 s) the same unit repeats roughly **every 1.3–2 s**, alternating three modes so the eye never settles:
**caption-only** (small words at chest) → **hero word behind head** → **full-frame graphic insert** (B-roll card, UI screen, white chapter card), then back to the talking head.

### 3.3 Placement summary
- **Hero word:** top third, centred, behind the head.
- **Captions and running script:** lower-middle (chest/waist), centred, small.
- **Tags, ?, ✕, emoji, chips:** at head level left/right, or orbiting the subject, never covering the face.
- **UI cards and lists:** over the torso or full-frame, never over the face.
- **CTA / brand:** fixed bottom zone (comparison videos) or a dedicated end card.

---

## 4. Quick spec sheet to reproduce the style
- **Canvas** 1080×1920 at 30 fps. Safe text zone: top 8–35 % (hero) and 55–75 % (captions).
- **Type:** one heavy grotesk + one ultra-condensed display + one script + Inter for UI. Hero 180–320 px, setup 40–60 px, captions 34–44 px.
- **Accent:** one per video, with a glow (outer glow ~30–60 px at 40–60 % opacity).
- **Entrance defaults:** per-letter blur 20→0, opacity 0→100, y 10→0, 2 f stagger, 8–10 f total, expo-out. Pops: scale 0→115→100, 7 f, back-out.
- **Exit default:** blur 0→20 + opacity →0 in 5 f.
- **Shot entry default:** scale 120→100 + blur 30→0 in 4 f.
- **Sync rule:** the hero word lands on the spoken word's onset; change something visible every 0.5–1 s; switch the shot or mode every 1.5–2.5 s.
