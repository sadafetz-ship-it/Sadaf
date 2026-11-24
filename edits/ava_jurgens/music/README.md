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

## Timeless (Instrumental, The Weeknd ft. Playboi Carti): user's upload, chosen fit
- **Song:** 117.5 BPM, 256 s. Structure: quiet intro 0–20 s, full beat 24–96 s, 16 s breakdown 96–112 s,
  **drop at 112.03 s** (kick and bass +18 dB), full beat to 196 s, short break, drop at 200 s, end at 248 s.
- **Section used:** **106.63–147.63 s**. Ava's intro ("My name is Ava… CEO of Personal Brand Launch") sits on the tail of the
  breakdown, and the **drop lands on 5.40 s (frame 162)**, the "we're hiring" riser → whoosh → impact. It was checked at
  5.38–5.41 s in the aligned audio.
- **Mix (`duck_mix.py`):**
  - Music about −34 dBFS under words (about 10 dB under Ava) and about −29 dBFS in pauses.
  - 0.6 s fade-in, 1.4 s fade-out.
  - Peak −5.4 dB, no clipping.
- **Output:** `../render/ava_v5_music_Timeless_instrumental.mp4`. It is **git-ignored** because the song is copyrighted.
  The safest way to post is the no-music `ava_jurgens_v5_sfx.mp4` with Timeless added in Instagram's music picker.
