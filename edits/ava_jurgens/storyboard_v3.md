# Ava Jurgens: storyboard v3 changes (on top of storyboard_v2.md)

Previews: `board_v3.jpg`, `preview_v3/` (generator `make_preview_v3.py`). Not built yet.

## 1. Detail colours added (small accents only)
| Token | Hex | Where |
|---|---|---|
| Mint | `#6CF0C2` | sparkle-bullet glow, underline gradient on list cards, one pixel tone in top words |
| Sky | `#63D3FF` | dots inside pills |
| Sun | `#FFD166` | ★ rating stars |

The main five colours stay as they were (lime, pale green, white, deep green, olive).

## 2. Less glow on text
- **Captions:** the heavy word has a soft shadow plus a 5 px pale halo (was 10 px + 30 px), and the script line has a 3 px halo.
- **Lime dot and highlight bar:** glow cut by about half.
- **Top words:** small bloom only (4 px + 18 px, 0.6 px blur), ghost layer faded down, pixel glow halved.
- **Big numerals and headings** (tiles, 1M, 5–8 h, "Consistency", "Flow"): halo cut to 5–6 px.
- **Cards and objects:** glow is unchanged, because only text glow was asked for.

## 3. List cards now copy the "Fundamentals of Design" card
This replaces the old checklist card (icon boxes and ✓ marks) in **F10, F11b (new) and F12**.

**Look**
- **Card:** a portrait card centred on the chest, 480 px wide, 26 px radius, with a diagonal deep-green gradient (lighter olive top-left → deep green bottom-right) and a thin, faint border.
- **Title:** centred, two lines, Inter Display Medium 40 px, white.
- **Underline:** a glowing line under the title that fades out at both ends, mint → lime.
- **List:** white 4-point **sparkle-star bullets** with a small mint glow, and items in Inter Display Regular 36 px. There are no checkmarks and no icon boxes.

**Motion (from the reference)**
1. The card fades and rises in (opacity 0→1, y +40→0, scale 0.96→1, 10 f, ease-out).
2. The title fades in.
3. The underline draws out from the centre (8 f).
4. Each item lands on its spoken word: the star pops (scale 0→1.2→1, rotate 45°→0, 6 f), then the text wipes in left→right with a soft mask edge (8 f). The preview shows the last item mid-wipe.

**Cards**
| Frame | Title | Items (spoken time) |
|---|---|---|
| F10 (23.2–28.9 s) | Edit in the style of | Hormozi 25.22 · Ali Abdaal 26.46 · Codie Sanchez 27.42 · + way more 28.28 |
| F11b (31.2–33.2 s) | What you get here | Consistency 30.40 · Security 31.26 · Long-term job 32.42 |
| F12 (33.3–38.2 s) | Someone who is | On time, always 35.50 · Dependable 36.30 · Very organized 37.56 |

The number tiles stay as they were.

## v4 change: no captions on the list-card scenes
- **No caption** is shown while a list card is on screen: F10 (23.2–28.9 s), F11b (31.2–33.2 s) and F12 (33.3–38.2 s). The card's points carry
  the script, as in the reference. Captions come back for the next scene.
- With the caption area free, the card is a little larger: 520 px wide, 44 px title, 40 px items, top at 900 px. This is closer to
  the reference card's size.
- The highlight bar under "organized." is dropped, because it belonged to that caption.
- The number tiles are unchanged. Previews: `board_v4.jpg`, `preview_v4/`.

## v5 change: circled accent = mint → lime gradient
Sampled from the circled "3 big mistakes" pill, the 1/2/3 tiles and the toggle pill:

| Stop | Hex |
|---|---|
| Mint | `#4CDAB4` |
| Mid green | `#84E572` |
| Lime | `#C2F433` |

Text on the gradient is dark green `#0B2A17`. Sparkles are lime `#C2F433` and mint `#4CDAB4`.

Where the gradient is applied:
- **Number tiles:** gradient fill (lime top-left → mint bottom-right), a glossy top edge, a dark-green numeral and two small 4-point
  sparkles (lime and mint). This replaces the dark glass tile with a glowing border.
- **Pills:** gradient fill with dark text and a glossy top edge. This covers the PBL typing pill, POSITION INFO, the remote-job pill
  and the F3 trait chips.
- **Buttons:** gradient fill (Follow, Submit edit).
- **Progress bar and highlight bar:** gradient fill.
- **Top words:** the "Scripts" word gets a gradient fill with a small bloom.
- **Pixel clusters:** gradient tones.
- **Small accents:** "1M", the avatar ring, the verified badge, the week chips, the Content Flow nodes and the list-card underline.
- **Caption dot and card edges:** lime `#C2F433`, plus a mint/green bottom edge and shadow on cards.

The white, deep green and olive background roles are unchanged. Previews: `board_v5.jpg`, `preview_v5/`.

## v6 change: darker top words
- The top-word gradient ("Ava", "EDITORS", "THIS JOB", "YOU") is now a slightly darker version of the accent:
  `#34B994 → #69C657 → #A2CF22` (was `#4CDAB4 → #84E572 → #C2F433`). Its bloom is a touch softer to match.
- Everything else keeps the brighter accent gradient: pills, tiles, buttons, bars and pixel clusters.
- Previews: `board_v6.jpg`, `preview_v6/`.

## v7 change: nothing over the speaker's face
Face measured on the stills at about x 420–715, y 370–950 (1080×1920). The **face no-go zone** is **x 360–760, y 330–1010**,
which includes a margin for head movement. No element may enter it. `preview_v7/facecheck.jpg` shows the zone in red on every
talking-head frame.

| Element | Before (top y) | Now (top y) |
|---|---|---|
| Editing-test card + 🍀 (F5) | 860 / 810 | 1030 / 985 |
| List cards (F10, F11b, F12) | 900 | 1035 (bottom about 1500; no caption in these scenes) |
| CTA card (F13) | 860 | 1030. Made more compact: the title and button sit side by side so it clears the captions |
| Top words (F1, F13) | 120 | 75 (size 250 → 230) |
| Top words (F9) | 150 | 110 |
| Pixel clusters on top words | two clusters under the word | moved to the sides and above the word, so none drop toward the head |

Unchanged and already clear: the number tiles (left of the face, x ≤ 320) and the explainer scenes (full background, no face).

**Build rule:** the speaker moves. During the Remotion build the audit checks every 6 fps sheet against the face zone. Punch-ins
scale the face up, so during a punch-in the cards slide down by the same amount.
