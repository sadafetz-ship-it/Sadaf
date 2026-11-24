# Music for the Ava Jurgens edit

The beds come from the crypto-websites chat (branch `ccr-1e8e1fc6-lpmvi2`, `edit/music`). They are original instrumentals
composed in code (`compose.py`), so they are royalty-free. Each is 45.1 s, with tension in the intro and the drums dropping at 6.74 s.

| Track | Feel | Verdict for this video |
|---|---|---|
| **B Neon Glide**: 100 BPM, swung half-time, Am–F–Dm–E | smooth, modern, confident | **Recommended** |
| **D Insider Drive**: 120 BPM, four-on-the-floor | energetic, driving | Alternative, more hype |
| A Dark Pulse: 110 BPM, minor | dark, serious | Too moody for a welcoming job ad |
| C Lofi Ledger: 86 BPM, lofi | chill, slow | Too slow for this pitch |

## How it's mixed (`duck_mix.py`)
- **Alignment:** the track starts 1.34 s in, so its drum drop lands on the 5.4 s "we're hiring" cut (the first big riser → whoosh → impact).
- **Ducking from the transcript:** about −35 dBFS under words (about 10 dB under Ava's speech at −24.5 dBFS) and about −31 dBFS in pauses. Down in 50 ms, back up in 150 ms.
- **Fades:** 0.6 s in, 1.4 s out.
- **Output:** layered over the v5 SFX mix with `alimiter=limit=0.85`. Peak −5 dB, no clipping.

Previews: `../render/ava_v5_music_B_neon_glide.mp4`, `../render/ava_v5_music_D_insider_drive.mp4`.

**Commercial / trending songs:** never baked into the export (copyright). Add them in the Instagram or TikTok app at 5–10 %.
