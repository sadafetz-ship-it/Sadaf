# House video: storyboard v1 (waiting for approval, not built)

**Output:** 1080×1920 vertical, 30 fps, 18.7 s (560 f). The source is 16:9, so each shot is a 608×1080 crop that follows the speaker's head (centre x ≈ 870–1090 px), scaled up 1.78×.
**Previews:** `preview_v1/frame_01–11.jpg`, plus everything on one sheet in `preview_v1/board_v1.jpg`.

## Accent: the circled "Golden Hour" (from reference V01c, 4.5–5.9 s)
Measured frame by frame (30 fps):

| f | What happens |
|---|---|
| 0 | 1-frame **white flash** cut. Frames 1–2 are overexposed, then fade to normal. |
| 1 | The **"Golden" script** sits in a glowing pill. The pill is an orange→yellow gradient and the script is dark ink. It appears at once. |
| 1–12 | **"Hour"** types on letter by letter, about 3–4 f per letter (H → Ho → Hou → Hour). Font is a heavy rounded sans. The fill is a gradient from white-yellow at the top to orange at the bottom, with a strong orange glow. |
| 1–17 | **Stair-step pixel clusters** around the word: orange (#EB8858) on the left, yellow (#FFC000) on the right, each with a glow. They jitter and blink out one by one by about f17. |
| 17+ | The lockup holds on the chest with a soft glow. |

The reference's swatch chips gave the palette directly: **#EB8858 · #EDBF1E · #FFC000**.

### How it maps onto this edit
This **Golden Hour palette replaces the default purple set** for this video:

| Token | Hex | Use |
|---|---|---|
| Ink | `#160C06` | Explainer worlds, card bodies, script text on pills |
| Umber | `#6B3410` | Gradient starts, empty tracks |
| Ember | `#EB8858` | Left pixel clusters, dot after heavy words, edge flash |
| Gold | `#EDBF1E` | Secondary glow, chips |
| Amber | `#FFC000` | Main accent: glows, lines, nodes, right pixel clusters |
| Cream | `#FFF4DE` | All main text |

How each element uses it:
- **Caption line 2 (script):** the reference pill exactly. Allura in ink on a glowing amber→orange pill.
- **Caption line 3 (heavy) and behind-head names:** Golden Hour fill + glow.
  - Fill: `#FFFBE6 → #FFE27A → #FFC000 → #EB8858`, top to bottom.
  - Glow: cream, amber, ember and orange drop-shadows.
- **Scripts pixel reveal on heavy words:** recoloured to ember on the left and amber/gold on the right, as in the reference.
- **Grade:** a light warm soft-light pass plus a vignette, so the cool room picks up some golden hour light. The blue hoodie works as the complementary colour.

## Beat table
The caption lockup is: L1 = Inter Display Light 58 px (the current word types on in amber), L2 = script pill, L3 = heavy word with Golden Hour glow and an ember dot.

| # | Time (s) | Spoken words | Mode | Caption (L1 / pill / heavy) | On screen | Triggers (frame @30) | Preview |
|---|---|---|---|---|---|---|---|
| 1 | 0.00–1.62 | Are you thinking about buying a new home | **Name behind head** | Are you thinking about / *buying a new* / — | **HOME** behind the head (Golden Hour, line drop → bloom → pixels). Pill tag "THE GOAL" with a cursor. Zoom-blur entry. | HOME lands on "home" f41 · pill f24 | F1 |
| 2 | 1.62–2.60 | in the next 10 years? | **Card on chest** | in the next 10 years? | **"10 YEARS" number-tile deck** (3 stacked tiles with crack lines, newest in front). Comet + glow reveal. | tile on "10" f62 | F2 |
| 3 | 2.68–4.30 | If you're in your late twenties right now, | **Caption only** | If you're in your / *late* / **twenties** (+ "right now," types under) | 4 f punch-in on "twenties". Pixel reveal. | late f97 · twenties f103 · right now f111 | F3 |
| 4 | 4.50–5.90 | I'll show you how to plan your finances | **Full-background explainer** | I'll show you how to / *plan your* / **finances** | Warm ink world with amber light pools, faint grid and particles. **Input bar types "Plan your finances"** behind a spark caret. A "10-YEAR PLAN" card with an Age 28→38 progress bar unfolds below it. | cut f135 (riser→whoosh→impact) · finances f164 | F4 |
| 5 | 5.90–7.12 | over the next 10 years. | Explainer (continues) | over the next / **10 years** | **10-year timeline**: an amber ink line draws through nodes YR 1 → 3 → 5 → 7 → 10. Each node goes from ghost to sharp. The YR 10 node is a house icon. | line starts f177 · YR10 on "years" f206 | F5 |
| 6 | 7.18–9.44 | So you can buy a home before you're out of your thirties. | **Card on chest** | So you can buy a home before you're out of your / **thirties** | **Whip-in milestone card**: house icon, "Homeowner", chips "Before 40" and "Keys ready". Zoom-blur cut back to the speaker. | cut f215 · card on "home" f242 · thirties f274 | F6 |
| 7 | 9.70–10.94 | Let's break it down step by step | **Name behind head** | Let's break it down / *step by step* | **PLAN** behind the head. Pill tag "STEP BY STEP" with a cursor. | PLAN on "break" f295 | F7 |
| 8 | 10.94–12.20 | so you can get started today. | **Caption only** | so you can get / *started* / **today** | Swoosh streak above the caption. 4 f punch-in. | started f349 · today f357 | F8 |
| 9 | 12.44–15.32 | Buying a home is one of the biggest financial goals for a lot of people, | **Full-background explainer** | Buying a home is one of the biggest / *financial* / **goals** → then "for a lot of people," | **Goals board** (input bar → card): Emergency fund · Retirement · Pay off debt · **Buy a home** (highlighted, cursor click) | cut f373 · highlight on "home" f383 · goals f422 | F9 |
| 10 | 15.66–16.98 | but as you're likely aware, | **Caption only** | but as you're likely / *aware,* | Cut back to the speaker. Slow push. | aware f497 | F10 |
| 11 | 17.20–18.67 | it's gotten pretty pricey. | **Card on chest** | it's gotten pretty / **pricey** | **"Home prices" card**: the amber line chart draws upward and a $ tile drops in. Ember edge flash on "pricey". Then a short fade to end. | chart f516 · pricey + flash f538 · fade f548–560 | F11 |

The mode changes every **1.0–2.8 s**: behind head → card → caption → explainer ×2 → card → behind head → caption → explainer → caption → card.

## Motion (house recipes, recoloured gold)
- **Heavy words and behind-head names:** Scripts pixel reveal, run as one sequence:
  1. A 4 px amber line drops onto the word (4 f).
  2. The word blooms in: blur 16→0, brightness 1.6→1, scale 1.08→1 over 10 f.
  3. Pixel clusters at 6 anchors (orange left, yellow right) jitter every 3 f and blink out by about 18 f.
- **Golden Hour type-on:** for **behind-head names**, the reference letter-by-letter type-on (about 3 f per letter) plays together with the bloom.
- **Script pill:** pops in (scale 0.6→1.06→1, 7 f) and the script writes on left to right under a mask.
- **Cards:**

  | Card | Recipe |
  |---|---|
  | Tile deck (#2) | Comet + glow reveal |
  | Milestone card (#6) | Whip-in |
  | Price card (#11) | Zoom drop-in |
  | Explainer boards (#4, #9) | Input bar → orb → card |
  | Timeline (#5) | Line path + ghost-to-sharp |

- **Camera:**
  - Slow push on every talking stretch.
  - 4 f punch-ins on "twenties", "today" and "aware".
  - Zoom-blur on cuts: scale 1.12→1, blur 28→0, 5 f.
  - The cut into each explainer gets the reference's **1-frame white flash + overexposed fade**.

## Sound (house rules)
- **Captions:** one soft click on every caption.
- **Heavy words:** every heavy word gets the same Scripts hit (`ref2_g_scripts`), and the Golden Hour reveals use `ref2_g_golden`.
- **Screen changes:** each cut into or out of an explainer gets riser → whoosh → impact.
- **Card sounds:** comet for the tile, typing for the input bars, a click on the "Buy a home" cursor.
- **Ending:** no recap board. The video ends on "pricey" with a short fade.

## Open questions
- The "GALICI FINANCIAL" hoodie logo sits right behind the lower-third captions. Options: keep it as is, or put a soft dark gradient under the captions.
- "Before 40" on the milestone card is my reading of "before you're out of your thirties". Should it say something else?
