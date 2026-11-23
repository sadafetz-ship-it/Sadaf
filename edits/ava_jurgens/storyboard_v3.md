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
