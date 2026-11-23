# Reference library: what the user circled and sent (bundled in `assets/`)

These are the user's own references. Each entry gives what was circled, what was measured, and where it lives in the house style
and code. Open the clip or sheet when you rebuild something, and recolour into the current accent.

## Circled stills (`assets/references/circled/`)
| File | Circled element | Became | Spec |
|---|---|---|---|
| `golden_hour__caption_accent.jpg` (grid BL = clip V01c) | "Golden Hour": dark script in a glowing orange→yellow pill above a heavy rounded word with a warm glow | **The video's accent colours** and **caption line 2, the script pill** | Swatch chips give the palette `#EB8858 · #EDBF1E · #FFC000`. See house_style §3. Every-frame sheet: `sheets/golden_hour_every_frame.jpg`. |
| `scripts__name_title.jpg` (grid TR = clip V02b) | "Make better **Scripts**": big flat red heavy word, two small grey words above its ends, red stair-step pixel squares, motion-blur ghost, small outline square at the left | **Name / topic titles** ("HOME", "PLAN") | Flat solid accent, small setup words at the L/R ends, same-hue pixel clusters, ghost collapsing over 16 f. See house_style §10. |
| `nexus_10000__heavy_words.jpg` | "welcome to / **Nexus.**" and "anywhere from / **$10,000 per month**" | **Heavy caption words: low glow**, plus the **highlight bar** | White → pale tint fill, one soft glow, accent dot; a glowing gradient bar behind the lower half of the word. See house_style §3. |

## Motion-graphics reference video (`assets/references/clips/`)
`motion_graphics_grid_full.mp4` is the user's 2×2 grid ("you can use these types of motion graphics"), split into:

| Clip | What's in it | Borrowed as (house_style §11) |
|---|---|---|
| `mg_Ra_title_behind_key_splatter_3dswing.mp4` | Huge condensed title behind a cut-out; "Consistency is the Key" with a glowing gold 3D key and an orbit circle with a dot; ink-splatter reveal; "Air Jordan" brand lockup; "is a **Multibillion dollar** Brand" swinging in 3D over a grey "$$$" with V lines | gold key + orbit; $$$ + V lines + 3D swing word |
| `mg_Rb_player_card_hitrecord_lightbeam.mp4` | Spotify-style player card with a person as album art; B&W cut-out with "HIT RECORD" condensed letters blurring in behind; **light-beam cone sweep** transitions (red → blue → white) with a ring pivot; small header words blurring in one by one | music-player card; light-beam sweep; L1 word blur-in |
| `mg_Rc_gauge_widget_product_cards_ribbon.mp4` | Glass "Performance 48°" gauge appearing out of a **pixel-mosaic dissolve**; "isn't a **Luxury**" accent word; neon light ribbon; product cards (light top, dark bottom, italic title, stars) circled by a **glowing ribbon loop**, swapping with colour-world changes | glass gauge widget; product card + ribbon loop; neon ribbon |
| `mg_Rd_poster_car_drift_ink_pill.mp4` | Poster layout (car cut-out, huge condensed letters, outline text); top-down car drifting with tyre arcs over "NOT BMW"; **black pill label typing** "Bayerische Motoren Werke" then collapsing to "BMW" | ink pill label typing (offered as F8 option A) |

Six-fps sheets for the first 5 s of each clip are in `sheets/mg_R*_6fps_0-5s.jpg`.

## Worked example (`assets/examples/`)
- `house_edit_16x9_golden_hour.mp4`: the finished 16:9 house-buying edit (Golden Hour accent, Scripts titles, low-glow
  captions, all §11 graphics, the user's SFX).
- `house_edit_preview_board_v3.jpg`: the approved still-preview board.
- The source code is `scripts/remotion_House*.tsx`.
