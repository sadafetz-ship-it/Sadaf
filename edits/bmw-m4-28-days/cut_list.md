# Cut list (EDL)

Rule: keep only the speech. Each cut leaves at most 8 ms of room tone on each side of the speech edge, so every join has under 20 ms of silence. The speech edges were measured on 5 ms RMS windows against the −52 dB noise floor. Each audio segment has a 4 ms fade in and out, inside the padding, so the joins don't click.

| Seg | Raw in | Raw out | Length | In cut | Words | Video frames (raw) |
|---|---|---|---|---|---|---|
| 1 | 0.492 | 4.423 | 3.931 | 0.000 | Don't … instead. | 15–132 |
| 2 | 5.202 | 8.998 | 3.796 | 3.931 | If I had … 28 days, | 156–269 |
| 3 | 9.232 | 11.043 | 1.811 | 7.727 | this is exactly what I would do. | 277–330 |

| Removed | Raw range | Length |
|---|---|---|
| Lead-in silence | 0.000–0.492 | 0.492 s |
| Pause after "instead." | 4.423–5.202 | 0.779 s |
| Pause after "days," | 8.998–9.232 | 0.234 s |
| Tail silence | 11.043–11.294 | 0.251 s |

**Result:** 11.29 s → 9.53 s (1.76 s removed). `cut_tight.mp4` is H.264 CRF 16, 286 frames at 30 fps, AAC 256 kbps, BT.709.

Sync: the audio is cut to the exact sample. The video cuts on the frame nearest the running total, so lip sync stays within half a frame (≤ 17 ms) at every join.
