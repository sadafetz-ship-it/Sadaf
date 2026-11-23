# Storyboard: "I left my $30K business" (9:16, 30.2 s)

**Status: v2 waiting for approval. Nothing gets built until the preview frames are approved.**

## v2: "more engaging" (preview_v2/board_v2.jpg)
v1 was overlays on a flat edit. v2 gives the edit a **visual story arc** and adds a surprise to every beat.

| Change | Where | Why it hooks |
|---|---|---|
| **Colour arc.** The burnout stretch (B3–B7) plays **desaturated and cold**. On "switch" (22.08) a glowing gradient light-wipe sweeps across, and the footage snaps back to **vivid colour**. The real light tube behind you turns **blue → magenta** and a gradient rim light comes in, so everything after the switch looks like a new life. | B3–B11 | The viewer *feels* the before/after instead of just hearing it. It pays off the story at the exact word. |
| **Story progress bar.** A thin gradient bar with a glowing head runs along the top edge. | all | A retention cue: people stay to see it finish. |
| **Hook slash.** A magenta light-strike slashes through **$30K** on "business" (1.36), with "gone." in script and a **TRUE STORY** tag (from your reference). | B1 | The first second now shows a loss, which makes people curious. |
| **ALL IN** stamp | B2, "all in" (2.14) | Turns a throwaway phrase into a beat. |
| A **PiP of you** (desaturated circle) plus a **"Battery critically low"** alert | B3 | Keeps your face in the explainer. The alert feels like a real phone moment. |
| **12-hour clock**, a full ring "9 AM → 9 PM · every day", replacing the gauge | B4 | Easier to read at a glance: the whole day is gone. |
| **7/7** stamp on the calendar | B5 | |
| **47** unread badge plus phone-buzz lines | B6 | Relatable guilt. |
| **"Today" to-do list**: Hit the gym / Eat out with friends / Lunch, each crossed out on its word, then a **SKIPPED** stamp | B7 | A concrete, relatable list instead of icons. |
| **The switch** is the centre-piece. A big glass toggle on the chest (Clients → Digital products) flips on "switch". BEFORE / AFTER labels sit at the top, and the wipe line stays left of the face. | B8 | The peak moment of the video. |
| Neutral **"New order · +$27"** chips (no fake names or totals) | B10 | |
| **Tap ripple**, sparks and a handwritten "tap here ↓" | B11 | A clearer call to action. |

Sound changes for v2 (still within your rules): a `whoosh_air` pass on the colour wipe at 22.08, `paper_slide` on the ALL IN stamp, `ref_click` on the toggle and a `ref_ding` on ASAP. Strike-throughs on the to-do list use `pop_ui` at 0.4.

## Accent (from the circled reference: "$30K" and "DIGITAL PRODUCTS")
The circled words use one gradient: blue → violet → magenta. I sampled it from the image and it replaces the default accent everywhere: pixels, glows, cards, the pill and the hero words.

| Token | Hex | Use |
|---|---|---|
| Blue | `#657EFC` | gradient start, left pixel clusters |
| Periwinkle | `#7773FB` | gradient |
| Violet | `#935DF9` | main glow, highlight bar middle |
| Purple | `#AB55F4` | gradient |
| Orchid | `#C052E9` | gradient, right pixel clusters |
| Magenta | `#D35BC5` | gradient end, heavy-word dot, strike lines, edge flash |
| Ink | `#0D0920` | explainer background, card bodies, script text in the pill |
| Lilac / Mist | `#C9B8FF` / `#F2EEFF` | labels / all main text |

**Hero gradient:** `linear-gradient(90deg,#657EFC,#7773FB 22%,#935DF9 45%,#AB55F4 65%,#C052E9 82%,#D35BC5)`. It goes on the circled-style words only: $30K, DIGITAL PRODUCTS (×2), AUDIENCE and LINK IN BIO. Every other heavy word uses the house low-glow white → lilac fill.

## Format
- 1080×1920. The source is vertical, so there is no crop.
- The face box comes from the U²-Net mask on every still. The face spans about x 210–750 and y 320–870.
- Zones: titles above the cap (y < 330, behind the head). Cards sit in the right chest zone (x ≥ 740, y 560–1030), beside the face. Captions sit in the lower third, with the bottom edge 270 px above the frame bottom.
- Mode rhythm: hook title → caption + card → **explainer** → card → card → **explainer** → card → card → title → **explainer** → CTA.

## Beats
| # | Time | Mode | Spoken | On screen | Trigger frames | SFX |
|---|---|---|---|---|---|---|
| B1 | 0.00–2.60 | Title behind head | "I left my $30,000 business" | "I left my" setup (cream; "my" accent). **$30K** in the hero gradient, 300 px, behind the head (cut-out on top). **BUSINESS** in white heavy over the cap brim, above the eyes (as in your reference). Outline square plus blue/magenta pixel clusters. **No caption** (the title carries it). | $30K lands on f19 (0.62 s). BUSINESS on f41 (1.36 s). | **Name hit** on $30K: short riser → whoosh → impact |
| B2 | 1.76–5.40 | Caption + chest card | "to go all in selling low ticket digital products." | Caption: "to go all in selling" / pill *low ticket* / **DIGITAL PRODUCTS.** (gradient + highlight bar). The product card ($27 "Starter Template", 5 stars) develops from white at 3.4 s (comet + glow reveal). A light ribbon loops it, with a ghost card behind. | Card at 3.40, bar at 4.62 | comet, pop_media |
| B3 | 5.46–8.20 | **Explainer** (light-beam sweep in) | "And to be honest, the decision came from pure burnout," | Ink world. Glass gauge "ENERGY LEVEL": the dial drains 100 → 4 %, then the battery empties to a magenta sliver. Caption: setup / pill *pure* / **BURNOUT.** in a 3D swing, with the bar. | Sweep 5.90. 4 % lands with "burnout" at 7.48 | gears (dial), ding on 4 % |
| B4 | 8.24–11.50 | Talk + gauge widget | "because I was tired of working 10 to 12 hours a day," | Zoom-blur cut back to the speaker. The glass gauge pops in on the right at 9.4 s; ticks light up and the number rolls 10 → **12** on "12" (10.78). "10–12 HRS / DAY" chip (from your reference). Caption **10–12 HOURS.** with the tail "a day,". | Gauge 9.40, 12 on f323 | pop_media, gears |
| B5 | 11.70–14.25 | Talk + calendar | "fulfilling for clients, no weekends," | The "This week" calendar pops in about 0.9 s early (11.0). Day cells cascade in, each holding client bars. On "no weekends" the **S S cells fill magenta**, scale 1.12 and get hand-circled. "NO WEEKENDS" chip (from your reference). Caption **NO WEEKENDS.** | S S fill on f406 (13.54 s) | pop_ui, ref_click |
| B6 | 14.30–16.05 | **Explainer** | "no time spent with my family or friends" | Ink world, "DO NOT DISTURB · CLIENT WORK" chip. Three glass notifications stack in (Family missed calls, The boys, Mom missed FaceTime), and the older ones dim and shrink. Caption: pill *family or* / **FRIENDS.** | Notifications at 14.92, 15.04 and 15.58 | pop_ui ×3 (vol 0.5) |
| B7 | 16.08–20.70 | Talk + stacked icon deck | "or do simple things like hitting the gym, going out to eat or sometimes even missing meals." | Zoom-blur cut back. A stacked deck of icon tiles on the right, with the newest in front: **Gym** (17.60) → **Eat out** (18.50) → **Meals** (20.30). A magenta ink strike draws through each one as it lands. Captions: **GYM,** → **TO EAT** → **MISSING MEALS.** (bar). | Tiles on f527, f554 and f608 | pop_media ×3 |
| B8 | 20.78–23.40 | Talk + toggle | "So I knew I had to make the switch ASAP." | The "Business model" toggle pops in at 20.9. On "switch" (22.08) the knob slides, the track fills with the gradient, "Client work" strikes out and "Digital products ● LIVE" appears. Punch-in. On **ASAP.** a 3D swing and a magenta edge flash. | Switch on f662. ASAP on f673 | ref_click on the switch, ding on ASAP |
| B9 | 23.42–26.90 | Caption, then title behind head | "And ultimately I decided on selling low ticket digital products" | Caption-only "And ultimately I decided on" first. Then the stacked title above the cap: "selling" / "low-ticket" setup words, **DIGITAL / PRODUCTS** in the hero gradient. Each word lands on its own frame with the Scripts reveal (slide + blur + ghost + pixels). No caption while the title shows. | DIGITAL on f781 (26.04 s). PRODUCTS on f793 | **Name hit** on DIGITAL: riser → whoosh → impact |
| B10 | 26.96–27.95 | **Explainer** (light-beam sweep) | "to my audience," | The big product card ($27, 124 sold) develops from white. A flowing light ribbon loops it, and four "+$27 bought" chips pop around it (the audience). Caption **AUDIENCE.** in the gradient. | Card at 26.80. Chips 27.4–27.9 | comet, pop_ui ×2 |
| B11 | 27.96–30.17 | Talk + CTA card | "which, by the way, if you're curious ✎, link in bio." | Zoom-blur cut back. Quest-card morph on the chest: an icon pops → a "LINK IN BIO" pill → it morphs into the "Low-ticket starter pack" card. The cursor presses **GET IT →** on "bio" (29.86). Caption **LINK IN BIO.** (gradient + bar). Ends on this scene with a short fade (no recap board). | Morph 28.6. Press on f895 | dissolve (morph), double_click |

## Rules applied (from your house style)
- Captions make **no** sound. The riser, whoosh and impact play **only** on the two title landings ($30K and DIGITAL). Screen changes are clean.
- Pace uses the slower defaults: caption blur-in 9 f, pop 12 f, heavy bloom 16 f, whip 15 f. Every graphic holds ≥1.2 s.
- Pixels use the "red Scripts" stair-step clusters only, recoloured blue → magenta.
- Music: an instrumental dark-tech bed is suggested, added in-app at 5–10 %.

## Open questions
1. ✎ Whisper heard **"if you're creative, link in bio"**. I've written **"curious"**. Which is right?
2. Hook: your reference also has a "TRUE STORY" pill and a "WATCH WHY →" button. They are not in v1 because only the colours were circled. Add them?
