# Storyboard — "Crypto websites I shouldn't be sharing"

**Source:** `hb_1794061643210.mp4` · 45.4 s · 1080×1920 · 30 fps · one locked-off talking-head shot (purple-lit room, face in the top third, desk across the lower half).
**Status:** PREVIEW ONLY — awaiting approval. Nothing is built yet.
**Preview frames:** `edit/preview/F1…F7.png` (stills from your footage with the planned overlays), `edit/preview/board.jpg` (all 7 side by side).

---

## 1. Look

| Token | Hex | Used for |
|---|---|---|
| Ink | `#190D32` | Card body, bottom grade (darkens the desk so cards read), text on white pills |
| Deep | `#5426A8` | Start of gradients, ENTRY tag, inactive bar track |
| Violet | `#8050E8` | Main accent: line graphs, progress fills, outer glow, FREE pill |
| Lilac | `#B99AF5` | Highlight word in every headline (Defi**Llama**, Coin**Glass**…), card bottom glow, card numbers |
| Mist | `#EEE7FF` | All main text, glowing data dots, white CTA pill |

**Detail colours.** These are your additions, in the same purple family and used only for small accents, never for large areas:

| Token | Hex | Used for |
|---|---|---|
| Electric blue | `#5B6CFF` | Start of graph lines, card numbers (`01 / 04`, lilac→blue), "inflows" bars, ENTRY tag, Ethereum ETF bar, second checklist star |
| Magenta | `#C65BF2` | End of default progress fills, FREE pill gradient, divider line, CTA button outer glow |
| Rose | `#FF7EC8` | Sparkle next to every headline, chip status dots, lock icons, a halo ring around each graph dot, EXIT tag, "outflows" and Bitcoin ETF bars, the fade at the end of each hero word |

**Reference style taken from your images:**
- Dark glass cards: 56 px corners, blurred background, thin lilac border.
- A glow pooled at the bottom edge of each card.
- A faint grid inside each card.
- Glowing line graphs ending in a bright dot.
- Progress bars, star-bullet checklists and a white pill button.

**Type:**
- Inter Display ExtraBold for headlines (92 px hero, tracking −3).
- Inter Medium for setup lines (36 px).
- JetBrains Mono for small data labels (`01 / 04`).

**Screen layout:**

| Zone | Height | What goes there |
|---|---|---|
| Top | 7–15 % | Headline: a small setup line, then the hero word with a rose sparkle |
| Middle | 20–52 % | The speaker's face. Always left clear. |
| Bottom | 52–81 % | One glass card, 720 px wide (about 67 % of frame width), over the chest and desk. Below 81 % is kept clear for the Instagram/TikTok interface. |

**Grade:** a subtle Ink gradient over the bottom 30 % of the frame, plus a light top fade so the headline reads.

---

## 2. Motion rules (from `study/STUDY.md` spec)

| Element | In | Out |
|---|---|---|
| Setup line | Words appear one at a time as they're spoken: blur 12→0, y +16→0, opacity 0→1, 6 f each, expo-out | Blur 0→20 + fade, 5 f |
| Hero word | Lands on the first frame of the spoken word: scale 0.85→1.04→1, blur 20→0, 8 f, back-out. A lilac glow swells, then settles. | Blur + fade, 5 f |
| Glass card | Slides up 120 px, scale 0.94→1, blur 30→0, 10 f, expo-out. The bottom glow turns on 4 f later. | Drops 60 px + blur, 6 f |
| Card → card | The old card exits while the new one enters 2 f behind it. The number counter rolls `01→02`. | — |
| Line graph | Draws left to right (stroke-dashoffset) over 18 f, then the dot pops in (scale 0→1.2→1, 6 f) | — |
| Checklist rows | Each star + row pops in on its spoken word (4 f), and the star twinkles once | — |
| Progress bars | Fill 0→value over 14 f, expo-out | — |
| Camera | Slow push-in on the whole shot, 100→106 % per section. A 4 f punch-in (+4 %) on each new site name. | — |

**Sync rule:** every hero word and list row lands on the first frame of its spoken word (timings below come from `edit/transcript.md`). Something changes on screen every 0.5–1 s.

---

## 3. Beats

| # | Time (s) | Frames | Spoken (key words in **bold** = on-screen trigger) | Top headline | Bottom card | Preview |
|---|---|---|---|---|---|---|
| 1 | 0.00–2.94 | 0–88 | "I should **not** be giving these **crypto websites** away." | Setup "I should NOT be giving these" (NOT in Lilac at 0.42) → hero **crypto websites** at 1.50 → "away." at 2.24 | **Classified card:** "Classified · do not share", chip "4 sites", 4 rows `01–04`, each with a lock and a blurred redaction bar. Rows stagger in 3 f apart from 1.50. | F1 |
| 2 | 2.94–6.34 | 88–190 | "Other crypto investors are going to be **mad** I shared this for **free**." | Setup word by word, "mad" in Lilac at 4.46 → **FREE** Violet pill pops at 5.70 | Same card, header changes to "Unlocking the list…" with chip `0 / 4`. Row 01 brightens. | F2 |
| 3 | 6.34–11.96 | 190–359 | "First, we have **DefiLlama**, the best website to get **all the data** you need in the **DeFi** ecosystem." | "First, we have" → hero **Defi*Llama*** at 6.74 (punch-in) | **Card 01/04**, chip "DeFi data ▾". The line graph draws in from 8.84 ("all the data") and the dot pops at 9.34 ("data"). "All the data you need in **DeFi**" lands at 10.58. | F3 |
| 4 | 11.96–20.56 | 359–617 | "Second, we have **CoinGlass**. This website gives **clear and detailed** information about **open interest**, **liquidation** and other **super important data**." | "Second, we have" → hero **Coin*Glass*** at 12.98 | **Card 02/04**, chip "Derivatives". Title "Clear, detailed data" at 14.88, glowing divider sweeps in. Checklist: ✦ Open interest (16.70) · ✦ Liquidations (17.84) · ✦ Super important data (19.04). | F4 |
| 5 | 20.56–31.82 | 617–955 | "Third, we have **CryptoQuant**.com. This website offers **on-chain** analytics like **inflows** and **outflows** on the exchange. It helps investors identify potential **entry** and **exit** points." | "Third, we have" → hero **Crypto*Quant*** at 21.12 | **Card 03/04**, chip "On-chain" (pops at 23.62). Bars "↘ Exchange inflows" fill at 25.32 and "↗ Exchange outflows" at 26.16. The wave graph draws in at 28.00, then the **ENTRY** tag pops at 29.84 and **EXIT** at 30.66. | F5 |
| 6 | 31.82–37.42 | 955–1123 | "Before we get into the last one, if you want the **full website list**, just **comment Bitcoin** and I'll send it over to you." | Hero **full *list?*** at 33.54 | **CTA card:** "Unlock every website", "Comment below", a progress bar filling to 3/4 ("Sites revealed"), then a white pill **Comment "BITCOIN"** pops at 35.12 with a glow pulse at 35.40. | F6 |
| 7 | 37.42–44.52 | 1123–1336 | "And lastly, we have **Farside**. On this website, you can track the **inflows and outflows** into the **Ethereum** and **Bitcoin ETFs**." | "And lastly," → hero **Far*side*** at 38.34 | **Card 04/04**, chip "ETF flows ▾". A rising line draws in at 40.44 and its dot hits the top. Bars: Ξ Ethereum ETFs fill at 42.34, ₿ Bitcoin ETFs at 43.24. | F7 |
| 8 | 44.52–45.42 | 1336–1362 | "But before you leave," *(audio cuts off)* | Setup "But before you leave…" | Card 04 exits. **Recap**: 4 mini tiles (DefiLlama · CoinGlass · CryptoQuant · Farside) pop in a 2×2 grid, 2 f stagger, in the style of your app-tile reference. Hold, then end. | — |

---

## 4. Notes / decisions for you

1. **The raw clip ends mid-sentence** ("But before you leave," at 45.2 s). Choose one:
   - **(a)** Cut at 44.5 s after "ETFs" and end on the recap grid. This is my recommendation.
   - **(b)** Keep the cut-off line under the recap.
   - **(c)** Send me the rest of the take.
2. **Name spellings.** The audio says "DeFi Llama", "liquidation" and "Farside". Whisper heard "LAMA", "incudation" and "Farsight". I've used the real site names; tell me if any is different.
3. **Numbers on the cards** (bar lengths, graph shapes) are illustrative, not live data. No made-up figures appear as facts.
4. **Optional extras, not shown in the preview:**
   - Subtle whoosh/pop sound effects on card entrances.
   - Small site logos next to each hero word, if you can send the logo files.
