# Ava Jurgens: reel thumbnail
`ava_thumbnail_room_1080x1920.jpg` / `.png` is the cover image for the reel.

- **Frame:** 12.6 s of the raw video. Ava is smiling and **pointing at the viewer**, in her real room (the user asked for the room, not a black background).
- **Grade:** the same as the video (olive soft-light tint, darker bottom for the text).
- **Title:** "We're · hiring" in white and **EDITORS** in the deep-green gradient used on light footage (`#0B6B4F → #1F8436 → #4E8A0B`),
  with pixel clusters and handles. It sits just **behind the top of her hair**: a head cut-out (`ava_cutout_head_12.6s.png`) is layered over it.
- **Bottom:** *can you pass the test?* (Allura, pale green), the **"Take the editing test →"** gradient pill, and the personalbrandlaunch ✓ badge.
- **Source:** `thumbnail_room.html`, rendered with Playwright at 1080×1920.

## Thumbnail 2: "Is this YOU?"
`ava_thumbnail2_is_this_you_1080x1920.jpg` / `.png`, with source `thumbnail2_is_this_you.html`.
- It uses the same pointing frame and room, plus the video's closing line as the hook.
- **Top:** "Is this · ?" in white and a 300 px deep-green **YOU** behind the top of her hair, with pixel clusters and handles.
- **Bottom** (below her hands, so the pointing gesture stays clear): *we're hiring* (Allura, pale green) over **editors.** (white→pale
  gradient, lime dot, mint→lime highlight bar). This is the video's caption style.
- **Update:** the caption has moved to the **lower third**, at the video's caption position (block bottom 250 px from the frame bottom). It is
  shown at the video's caption size (Allura 118 px / heavy 150 px), over the video's lower-third grade.

## Thumbnail 2 with elements
`ava_thumbnail2_elements_1080x1920.jpg` / `.png`, with source `thumbnail2_elements.html`. It is thumbnail 2 plus on-screen elements from the video,
all **outside the face zone** (x 360–760, y 330–1010) and tilted slightly for energy:

| Element | Where |
|---|---|
| **"Editing test" application card**: "In progress", 64 % gradient progress bar | left, beside her cheek |
| **Personal Brand Launch chip**: avatar ring, **1M followers**, ✓ handle | right, beside her cheek |
| **"⌂ Remote · 5–8 h"** gradient pill | left, below the card |
| **"Mon → Fri"** gradient pill | right, below the chip |
| 4-point sparkle stars (lime, mint, white) | scattered around |
