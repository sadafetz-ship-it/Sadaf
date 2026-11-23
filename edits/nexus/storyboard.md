# Nexus: storyboard v2

**v2 changes:** (1) the purple backlight is kept as filmed, with no green grade; (2) the circled "Golden Hour" colours are used as detail accents.

**Canvas:** 1080×1920, 30 fps. **Edited length:** ≈28.3 s (two retakes cut, see `transcript.md`).
Times below are **edited-timeline** seconds; raw time in brackets where it differs.

## Look
| Token | Hex | Use |
|---|---|---|
| Lime | `#A6F538` | main accent: glows, lines, pixel reveals, progress fills |
| Pale lime | `#D4F98E` | script words, karaoke highlight, card borders, small labels |
| White | `#FFFFFF` | all main caption text |
| Ink | `#212C1A` | card bodies, number tiles, explainer world |
| Moss | `#7E9A4E` | gradient starts, empty tracks, secondary bars |

**Detail accents (Golden Hour, small touches only, never large areas):**

| Token | Hex | Use |
|---|---|---|
| Amber | `#FFC000` | the dot after heavy words, progress-bar thumbs, `+` sparkles, one cell in each pixel cluster |
| Gold | `#EDBF1E` | pill-tag dots, cursor glow |
| Coral | `#EB8858` | small `+` sparkles, one cell in each pixel cluster |

- **Footage:** no colour change. The purple backlight stays exactly as filmed. Explainer scenes use the same dark room with a purple light pool, with the green UI on top.
- **Captions:** house three-line lockup in the lower third: Inter Light setup line → Allura script in pale lime → Inter SemiBold heavy word with a lime dot. Glow uses the "Golden Hour" recipe recoloured to white → pale lime → lime → moss.
- **Pixel reveal:** "Scripts" style only (tetromino clusters in lime / pale lime / moss, with single amber and coral cells), on every heavy word and every behind-head name.
- **Camera:** slow push in each talking stretch; 4-frame punch-ins on key words; zoom-blur (scale 1.12→1, blur 28→0, 5 f) on cuts.

## Beats
| # | Edit time (raw) | Mode | Spoken | Caption (setup / *script* / **heavy**) | On screen + animation | Sound |
|---|---|---|---|---|---|---|
| 1 | 0.00–2.94 | **Name behind head** | Alright ladies and gentlemen, welcome to Nexus. | Alright ladies and gentlemen, / *welcome to* / **Nexus** | "NEXUS" huge behind the head with pill tag "THE PROGRAM" and cursor. Line drop → bloom → Scripts pixels land on "Nexus" (2.70). | riser → light reveal + impact + data load; ding on the pill |
| 2 | 3.64–6.58 | **Full-background explainer** | Nexus is the link between online business and the creator economy. | Nexus is the link between / *online business & the* / **creator economy** | Ink world, faint grid, drifting particles. Glass pills "Online business" (4.80) and "Creator economy" (5.94) whip in. Two lime ink lines draw down and meet at a glowing NEXUS node (line path + ghost-to-sharp). | riser → whoosh → impact into the scene; soft click per caption |
| 3 | 6.98–9.74 | **Cards on chest** | And we have 3 different programs in Nexus that do just that. | And we have / *three different* / **programs** → then "in Nexus that do just that." | He holds up 3 fingers. Comet arcs in and three glass tiles reveal one after another: 01 LAUNCHPAD, 02 PRO, 03 MASTERY (comet + glow reveal: white flash develops into the tile, 0.6→1.06→1). | comet whoosh + light reveal per tile |
| — | 9.95 | **Cut A** (jump cut) | — | — | zoom-blur punch, 5 f | whoosh |
| 4 | 10.08–11.2 (13.98–15.1) | **Name behind head** | Starting off, we have Media Launchpad, | Starting off, we have / *Media* / **Launchpad** | Swoosh streak above the caption on "Starting off". "LAUNCHPAD" behind the head, pill "PROGRAM 01", number tile **01** drops in beside the head (zoom drop-in). | riser → whoosh → impact (name reveal) |
| 5 | 11.5–14.8 (15.4–18.7) | **Card on chest** | which is built for entrepreneurs making anywhere from $0 to $10,000 per month. | built for entrepreneurs making / **$10,000** | Range card "MEDIA LAUNCHPAD · $0 → $10K /mo" whips in from the side; lime progress bar fills to the $10K mark on "$10,000" (17.86 raw). | whip + wheel tick on the bar |
| 6 | 15.66–18.84 (19.56–22.74) | **Name behind head → card on chest** | We have Media Pro for entrepreneurs that are making $10 to $50,000 per month. | for entrepreneurs making / **$50,000** | "MEDIA PRO" behind the head, pill "PROGRAM 02". Tile deck: **02** slides in front of 01. Range card "$10K → $50K /mo" drops in (zoom drop-in); bar fills further. | name reveal combo; drop-in |
| 7 | 19.46–21.72 (23.36–25.62) | **Name behind head (biggest moment)** | And last but for damn sure not least, we have Media Mastery. | last but for damn sure not least, / *Media* / **Mastery** | Short hold on "damn sure" (4 f punch-in). "MASTERY" behind the head (largest name), pill "PROGRAM 03", tile **03** to the front of the deck. | riser → whoosh → impact + ding |
| 8 | 22.04–28.0 (25.94–31.92) | **Full-background explainer** | And Media Mastery is designed for entrepreneurs making anywhere from $50,000 per month all the way up to $10 million per month. | …from $50,000 per month / *$10 million* / **per month** | Tier chart: three bars Launchpad / Pro / Mastery. The Mastery bar shoots up on "all the way up to" and its counter runs $50K → **$10M /month** (Scripts pixels on "$10M"). | riser under the climb, impact on "$10 million" |
| end | 28.0–28.3 | — | — | — | Short fade on the final scene (no recap board). | — |

Mode rhythm: name → explainer → cards → name → card → name+card → name → explainer, switching every 1.3–3 s.

## Preview frames (v2)
`preview_v2/board_v2.jpg` (v1 with the green grade is kept in `preview_v1/` for comparison) plus full-size JPGs:
1. `01_nexus` — 0:02.8, NEXUS behind the head
2. `02_link` — 0:05.5, link explainer
3. `03_three` — 0:08.0, three program tiles (03 still developing from its white flash)
4. `04_launchpad` — 0:12.0, LAUNCHPAD behind the head + tile 01
5. `05_range1` — 0:14.3, $0 → $10K card
6. `06_pro` — 0:17.5, MEDIA PRO + tile deck + $10K → $50K card
7. `07_mastery` — 0:21.0, MASTERY behind the head + tile 03
8. `08_ladder` — 0:27.2, tier chart up to $10M

Previews are stills of the graded footage with the overlays laid on. The motion is described in the beat table. **Nothing will be built in Remotion until you approve.**
