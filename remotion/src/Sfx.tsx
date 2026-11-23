import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {CAPTION_GROUPS, f, FPS} from './timing';

/**
 * Sound design. Files live in public/sfx/ (peak-normalised to −3 dBFS).
 *  ref_*  = separated from the user's SFX reference video (typing, riser, light reveal, ding, click, wheel)
 *  others = user's SFX library.
 * Each cue's `at` is the animation moment; `peak` is where the sound's own hit sits inside the file,
 * so the sound starts at `at − peak` and the hit lands exactly on the frame.
 * Sounds are layered into COMBOS (e.g. riser → light reveal + impact → ding) so key moments feel bigger.
 */
type Cue = {file: string; at: number; peak?: number; vol: number; len?: number; from?: number};

/** Master level for all effects: keeps them under the voice and stops stacked combos from clipping. */
const SFX_GAIN = 0.62;

const PEAK: Record<string, number> = {
  // separated from the reference video
  ref_typing_a: 0.11, ref_typing_b: 0.11, ref_riser: 1.06, ref_light_reveal: 0.02, ref_ding: 0.13, ref_click: 0.08, ref_wheel: 0.05,
  // library
  whoosh_a: 0.51, whoosh_b: 0.4, whoosh_deep: 0.3, whoosh_air: 0.72, whoosh_arrow: 0.29, impact: 0.28, data_load: 0.62,
  soft_ui: 0.21, dissolve: 0.11, digital_burst: 0.23, paper_slide: 0.35, pop_ui: 0.28, pop_media: 0.12,
  pop_double: 0.14, click_digital: 0.07, stretch: 0.32, menu: 0.11, game_over: 0.11,
  gears: 0.1, sparkle: 0.55, double_click: 0.12, riser: 2.71, button_1: 0.15, button_3: 0.04, envoye: 0.21, interface: 0.21, scifi_ui: 0.26,
};

// ── combos ────────────────────────────────────────────────────────────────
/** Site name lands behind the head: riser → light reveal + soft impact + pixel data-load → ding on the pill tag. */
const nameReveal = (t: number, bigRiser = false): Cue[] => [
  bigRiser ? {file: 'riser', at: t, vol: 0.4} : {file: 'ref_riser', at: t, vol: 0.45},
  {file: 'data_load', at: t, vol: 0.22},
  {file: 'ref_light_reveal', at: t, vol: 0.55},
  {file: 'impact', at: t, vol: 0.4},
  {file: 'ref_ding', at: t + 0.2, vol: 0.35},
];
/** Cut between talking head and an explainer: whoosh + digital burst (pixel grid) + light reveal shimmer. */
const sceneCut = (t: number, w: string): Cue[] => [
  {file: w, at: t, vol: 0.5},
  {file: 'digital_burst', at: t, vol: 0.18},
  {file: 'ref_light_reveal', at: t + 0.02, vol: 0.25},
];
/** UI element pops in: pop body + crisp click on top. */
const uiPop = (t: number, pop = 'pop_ui', vol = 0.45): Cue[] => [
  {file: pop, at: t, vol},
  {file: 'ref_click', at: t, vol: vol * 0.6},
];

const heavyLands = CAPTION_GROUPS.filter((g) => g.h.length).map((g) => g.h[0].t);
const captionChanges = CAPTION_GROUPS.slice(1).map((g) => g.start);

const CUES: Cue[] = [
  // ── hook
  {file: 'scifi_ui', at: 0.1, vol: 0.3},
  {file: 'ref_typing_a', at: 0.12, vol: 0.28, len: 1.05},          // caption words type on
  {file: 'ref_typing_b', at: 1.22, vol: 0.35, len: 0.7},           // text arcing over the head
  {file: 'paper_slide', at: 1.82, vol: 0.4},                       // "Classified" card
  {file: 'ref_click', at: 1.9, vol: 0.3},
  {file: 'game_over', at: 4.46, vol: 0.4},                         // "mad" 😤
  ...uiPop(5.7, 'pop_double', 0.5),                                // tilted "free."
  {file: 'stretch', at: 5.8, vol: 0.28},                           // ring draws round "free."
  {file: 'whoosh_air', at: 6.2, vol: 0.28},                        // swoosh on "First,"

  // ── site names (combo)
  ...nameReveal(6.74, true),
  ...nameReveal(12.98),
  ...nameReveal(21.12),
  ...nameReveal(38.34),

  // ── scene cuts (combo)
  ...sceneCut(8.7, 'whoosh_a'), ...sceneCut(11.96, 'whoosh_b'), ...sceneCut(14.0, 'whoosh_a'), ...sceneCut(20.56, 'whoosh_b'),
  ...sceneCut(22.68, 'whoosh_a'), ...sceneCut(27.72, 'whoosh_b'), ...sceneCut(31.82, 'whoosh_a'), ...sceneCut(37.42, 'whoosh_b'),
  {file: 'whoosh_deep', at: 33.5, vol: 0.45},                      // into the CTA insert

  // ── DefiLlama dashboard
  {file: 'whoosh_b', at: 8.75, vol: 0.3},                          // dashboard card whips in
  {file: 'gears', at: 8.84, vol: 0.3},                             // curve draws on
  ...uiPop(9.34),                                                  // glowing dot
  {file: 'ref_wheel', at: 10.58, vol: 0.35, len: 0.45},            // 4 chips tick in

  // ── CoinGlass three cards
  ...uiPop(16.7, 'pop_media', 0.5), ...uiPop(17.84, 'pop_media', 0.5), ...uiPop(19.04, 'pop_media', 0.5),
  ...[16.7, 17.84, 19.04].map((t) => ({file: 'whoosh_arrow', at: t - 0.05, vol: 0.25})),     // comet arcs onto each card

  // ── CryptoQuant
  {file: 'button_3', at: 23.62, vol: 0.35},                        // "On-chain" chip
  {file: 'whoosh_arrow', at: 25.5, vol: 0.4},                      // INFLOWS arrow
  {file: 'whoosh_arrow', at: 26.34, vol: 0.4},                     // OUTFLOWS arrow
  {file: 'gears', at: 28.0, vol: 0.28},                            // chart draws on
  ...uiPop(29.84),                                                 // ENTRY
  ...uiPop(30.66), {file: 'ref_ding', at: 30.7, vol: 0.3},         // EXIT
  ...uiPop(32.6, 'pop_double', 0.4),                               // tilted "one."

  // ── CTA ("Trial edit" quest-card motion): icon pops → pill stretches + label types → morphs into the full card
  ...uiPop(33.6, 'pop_ui', 0.45),                                  // ₿ icon pops
  {file: 'stretch', at: 33.85, vol: 0.3},                          // stretches into a pill
  {file: 'ref_typing_b', at: 33.93, vol: 0.4, len: 0.4},           // "Comment “BITCOIN”" types
  {file: 'ref_light_reveal', at: 34.42, vol: 0.5},                 // pill morphs into the card (glow bloom)
  {file: 'sparkle', at: 34.45, vol: 0.25},
  {file: 'ref_wheel', at: 34.77, vol: 0.35, len: 0.5},             // progress bar ratchets up
  {file: 'double_click', at: 35.12, vol: 0.5},                     // button pressed
  {file: 'ref_click', at: 35.12, vol: 0.35},
  {file: 'ref_ding', at: 35.4, vol: 0.5},                          // "Bitcoin" lands
  {file: 'stretch', at: 35.47, vol: 0.22},                         // ring round "Bitcoin."

  // ── Farside: typing bar → "+" → orb lifts → drops (reveal) → buttons → cube → collapse
  {file: 'paper_slide', at: 39.25, vol: 0.35},                     // board slides up as a bar
  {file: 'ref_typing_b', at: 39.33, vol: 0.45, len: 0.6},         // bar types (same sound as the reference's typing bar)
  ...uiPop(39.87, 'pop_ui', 0.35),                                 // "+" appears
  {file: 'ref_riser', at: 40.34, vol: 0.4},                        // orb rises and hovers, builds into the drop
  {file: 'ref_light_reveal', at: 40.4, vol: 0.6},                  // orb drops → white flash → card opens
  {file: 'impact', at: 40.4, vol: 0.3},
  {file: 'ref_click', at: 40.44, vol: 0.45}, {file: 'button_1', at: 40.44, vol: 0.3},
  {file: 'ref_click', at: 41.16, vol: 0.45}, {file: 'button_3', at: 41.16, vol: 0.3},
  {file: 'ref_click', at: 42.34, vol: 0.45}, {file: 'envoye', at: 42.34, vol: 0.3},
  {file: 'ref_click', at: 43.24, vol: 0.45}, {file: 'interface', at: 43.24, vol: 0.3},
  ...uiPop(43.4, 'pop_double', 0.45), {file: 'ref_ding', at: 43.42, vol: 0.4}, // 3D cube bounces in
  {file: 'dissolve', at: 44.6, vol: 0.28},                         // card collapses

  // ── small caption details (kept quiet so they never compete with the voice)
  ...heavyLands.map((t) => ({file: 'soft_ui', at: t, vol: 0.2})),          // heavy word smears in
  ...captionChanges.map((t) => ({file: 'dissolve', at: t, vol: 0.13})),    // pixel dissolve
  ...[7.82, 14.88, 23.16, 34.2, 40.06].map((t) => ({file: 'ref_click', at: t + 0.1, vol: 0.25})), // box flashes
  ...[20.03, 31.01].map((t) => ({file: 'menu', at: t, vol: 0.3})),         // highlight bars
];

export const Sfx: React.FC = () => (
  <>
    {CUES.map((c, i) => {
      const start = c.at - (c.peak ?? PEAK[c.file] ?? 0);
      const from = Math.max(0, f(start));
      const trim = start < 0 ? f(-start) : 0;
      return (
        <Sequence key={i} from={from} durationInFrames={c.len ? Math.round(c.len * FPS) : undefined} layout="none">
          <Audio src={staticFile(`sfx/${c.file}.wav`)} volume={c.vol * SFX_GAIN} startFrom={trim + (c.from ? f(c.from) : 0)} />
        </Sequence>
      );
    })}
  </>
);
