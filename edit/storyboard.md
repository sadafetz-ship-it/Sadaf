# Storyboard v3 — "Crypto websites I shouldn't be sharing"

**Source:** `hb_1794061643210.mp4` · 45.4 s · 1080×1920 · 30 fps · one locked-off talking-head shot (purple-lit room).
**Status:** PREVIEW ONLY — awaiting approval. Nothing is built yet.
**Preview frames:** `edit/preview/P1…P8.png` (real stills from your footage with the planned overlays) and `edit/preview/board.jpg` (all 8 side by side).
**Style source:** your `video-motion-study` skill (the rules in `study/STUDY.md` §3–4), your 8 reference images (glass cards, glow) and your caption reference ("You're not / *competing* on / **price.**").

---

## 1. Look

### Palette
| Token | Hex | Used for |
|---|---|---|
| Ink | `#190D32` | Card body, bottom grade under the captions |
| Deep | `#5426A8` | Start of gradients, empty bar tracks |
| Violet | `#8050E8` | Main accent: line graphs, glows, edge flashes |
| Lilac | `#B99AF5` | Script caption word, card bottom glow, sparkles |
| Mist | `#EEE7FF` | Text; heavy words fade from white at the top to grey-lilac at the bottom, like your reference |

**Detail colours** (small accents only):

| Token | Hex | Used for |
|---|---|---|
| Electric blue | `#5B6CFF` | Card numbers, inflows / Ethereum bars, ENTRY tag, second checklist star |
| Magenta | `#C65BF2` | Progress fills, `mad` edge flash, CTA button glow |
| Rose | `#FF7EC8` | The **dot** after every heavy word, `+` sparkles, chip status dots, locks, EXIT tag, outflows / Bitcoin bars |

### Captions: lower third, in your reference's three-line style
Each caption block is centred, with its bottom edge 280 px above the bottom of the frame, so it stays clear of the Instagram/TikTok buttons.

| Line | Font | Size / tracking | Colour |
|---|---|---|---|
| 1. Setup line | **Inter Display Light** | 46 px, −1.6 | Mist, soft dark shadow |
| 2. Accent word | **Allura** (script, OFL font, saved in `edit/preview/fonts/`), optionally followed by more light words | 104 px | Lilac with a violet glow |
| 3. Hero word | **Inter Display SemiBold**, ending in a **rose dot** like "price." | 124 px, −6 | White fading to grey-lilac (metallic) |

**Font matching:**
- The light and heavy lines are the closest match to the Helvetica-style sans in your reference.
- I tested five script fonts; Allura is closest to your reference's thin, slanted script (`edit/preview/` has the comparison).

### Placement (from your skill's zone rules)
| Zone | What goes there |
|---|---|
| Top third, behind the head | Each **site name**, huge (168 px, metallic, rose dot), with the speaker cut out and layered in front so his head covers the bottom of the letters |
| Chest | Glass data cards, 720 px wide, over the torso and never over the face |
| Lower third | Captions, always on screen |
| Around the head / caption | Small `+` sparkles in rose, lilac and blue (the yellow `+` in your reference, recoloured), and sticker icons for concrete words |

---

## 2. Modes (your skill: switch mode every 1.3–2.5 s so the eye never settles)

| Mode | What it is | Preview |
|---|---|---|
| **A · Caption only** | Footage + lower-third caption + sparkles / stickers | P1, P2 |
| **B · Name behind head** | A site name goes up behind the head; the caption carries the setup ("Second, we have") | P3 |
| **C · Card** | A glass data card on the chest + caption | P4, P5, P6, P8 |
| **D · Full-frame insert** | Footage blurred and darkened, one big centred card + caption | P7 |

---

## 3. Motion (from your skill's spec sheet)

| Element | Animation |
|---|---|
| Caption light words | Appear **one at a time as they're spoken**: blur 20→0, y +10→0, opacity 0→1, 8 f, expo-out |
| Caption script word | The script draws on left to right (a mask wipe), 10 f, on the spoken word |
| Caption heavy word | Lands **on the frame the word starts**: scale 0→115→100 %, 7 f, back-out; the rose dot pops 3 f later |
| Caption change | The old caption blurs out in 5 f as the next sentence starts. Captions never stack. |
| Name behind head | Scale 120→100 % + blur 30→0, 4 f, timed to the spoken name; idles with a slow 2 % drift |
| Card in / out | In: up 120 px, scale 94→100 %, blur 30→0, 10 f, expo-out. Out: blur + down 60 px, 6 f |
| Graphs / bars / list rows | Graph line draws on over 18 f, then the dot pops. Bars fill over 14 f. Each list row pops in on its spoken item. |
| `+` sparkles | Pop in (0→120→100 %, 6 f), then rotate slowly and twinkle |
| Hard change every ~2.5 s | Alternates between a 4 f punch-in (+4–6 %), a 2 f lilac flash at mode switches, and a zoom-out reset at section ends |
| Shot entry (0.00 s) | Scale 120→100 % + blur 30→0, 4 f. The first word is already appearing, with no empty frames. |

---

## 4. Beats

Timings come from `edit/transcript.md`. **Bold** words are the trigger frames.

| # | Time (s) | Mode | Spoken | Caption: light / *script* / **heavy.** | Other on screen |
|---|---|---|---|---|---|
| 1 | 0.00–1.50 | A | "I should not be giving these" | I should not be giving these | Shot entry; push-in 100→106 % starts |
| 2 | 1.50–2.94 | A + mini card | "**crypto websites** away." | *crypto* (1.50) / **websites.** (1.82) | Small "Classified" card pops at 1.82 with 4 locked, blurred rows (P1) |
| 3 | 2.94–4.46 | A | "Other crypto investors are going to be" | Other crypto investors are going to be | Card exits |
| 4 | 4.46–5.70 | A + sticker | "**mad** I shared this for" | *mad* (4.46) I shared this for | 😤 sticker pops beside the head; magenta edge flash, 3 f (P2) |
| 5 | 5.70–6.34 | A | "**free**." | **free.** (5.70) | 4 f punch-in |
| 6 | 6.34–8.70 | B | "First, we have **DefiLlama**," | First, / *we have* | **DefiLlama.** behind the head at 6.74 (P3); lilac flash at 6.34 |
| 7 | 8.70–11.96 | C | "the best website to get **all the data** you need in the DeFi **ecosystem**." | the best website to get / *all* the / **data.** (9.34) → you need in the / *DeFi* / **ecosystem.** (11.06) | Card 01: graph draws at 8.84, dot at 9.34 (P4) |
| 8 | 11.96–14.00 | B | "Second, we have **CoinGlass**." | Second, / *we have* | **CoinGlass.** behind the head at 12.98 |
| 9 | 14.00–20.56 | C | "This website gives clear and detailed information about **open interest**, **liquidation** and other **super important data**." | gives clear and / *detailed* / **information.** → about / *open interest,* / **liquidation.** → and other super / *important* / **data.** | Card 02 checklist: rows at 16.70, 17.84, 19.04 (P5); punch-in at 17.84 |
| 10 | 20.56–22.68 | B | "Third, we have **CryptoQuant**.com." | Third, / *we have* | **CryptoQuant.** behind the head at 21.12 |
| 11 | 22.68–27.72 | C | "This website offers **on-chain** analytics like **inflows** and **outflows** on the exchange." | offers / *on-chain* / **analytics.** → like / *inflows* and / **outflows.** | Card 03: chip at 23.62, blue inflow bar at 25.32, rose outflow bar at 26.16 |
| 12 | 27.72–31.82 | C | "It helps investors identify potential **entry** and **exit** points." | helps investors identify potential / *entry* and / **exit points.** (30.66) | Graph draws at 28.0, ENTRY tag at 29.84, EXIT at 30.66 (P6); punch-in at 27.72 |
| 13 | 31.82–33.50 | A | "Before we get into the **last** one," | Before we get into the / *last* / **one.** | Zoom-out reset to 100 % |
| 14 | 33.50–37.42 | D | "if you want the full website list, just **comment Bitcoin** and I'll send it over to you." | if you want the full list, just / *comment* / **Bitcoin.** (35.40) | Full-frame insert: ₿ coin pops, progress bar 3/4, white **Comment "BITCOIN"** button at 35.12 (P7) |
| 15 | 37.42–39.20 | B | "And lastly, we have **Farside**." | And lastly, / *we have* | **Farside.** behind the head at 38.34 |
| 16 | 39.20–44.52 | C | "On this website, you can track the inflows and outflows into the **Ethereum** and **Bitcoin ETFs**." | you can / *track* the / **inflows.** → into the / *Ethereum* and / **Bitcoin ETFs.** (43.24) | Card 04: graph draws at 40.44, blue Ethereum bar at 42.34, rose Bitcoin bar at 43.24 (P8) |
| 17 | 44.52–end | D | "But before you leave," *(cut off)* | — | Recap: 4 mini glass tiles (one per site) pop in a 2×2 grid, 2 f stagger, then end |

---

## 5. Still open
1. **Ending.** The raw clip stops mid-sentence ("But before you leave," at 45.2 s). I recommend cutting at 44.5 s and ending on the recap grid.
2. **Site names.** I've used DefiLlama, liquidation and Farside (Whisper heard LAMA / incudation / Farsight). Please confirm.
3. **Illustrative graphics.** Graph shapes and bar lengths are design only; no real numbers are shown.
4. **Optional:** sound effects (whoosh / pop / twinkle) and real site logos next to the behind-head names.
