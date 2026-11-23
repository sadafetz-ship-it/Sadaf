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
  // separated from the user's 2 reference grid videos (music removed by REPET-SIM foreground separation)
  ref2_g_drop: 0.22, ref2_g_whip: 0.13, ref2_g_scripts: 0.12, ref2_g_comet: 0.27, ref2_g_photostack: 0.09, ref2_q_pill: 0.2, ref2_q_morph: 0.21, ref2_g_golden: 0.18,
  ref_typing_a: 0.11, ref_typing_b: 0.11, ref_riser: 1.06, ref_light_reveal: 0.02, ref_ding: 0.13, ref_click: 0.08, ref_wheel: 0.05,
  // library
  whoosh_a: 0.51, whoosh_b: 0.4, whoosh_deep: 0.3, whoosh_air: 0.72, whoosh_arrow: 0.29, impact: 0.28, data_load: 0.62,
  soft_ui: 0.21, dissolve: 0.11, digital_burst: 0.23, paper_slide: 0.35, pop_ui: 0.28, pop_media: 0.12,
  pop_double: 0.14, click_digital: 0.07, stretch: 0.32, menu: 0.11, game_over: 0.11,
  gears: 0.1, sparkle: 0.55, double_click: 0.12, riser: 2.71, button_1: 0.15, button_3: 0.04, envoye: 0.21, interface: 0.21, scifi_ui: 0.26,
};

// ── combos ────────────────────────────────────────────────────────────────
/** Site name lands behind the head: Scripts pixel reveal + Golden Hour glow + light reveal + tile comet (no riser/whoosh/impact: those are reserved for screen changes). */
const nameReveal = (t: number): Cue[] => [
  {file: 'ref2_g_scripts', at: t, vol: 0.4},                     // Scripts-style pixel reveal
  {file: 'ref2_g_golden', at: t + 0.05, vol: 0.3},               // Golden Hour glow blooms
  {file: 'ref_light_reveal', at: t, vol: 0.4},
  {file: 'ref2_g_comet', at: t, vol: 0.22},                      // number tile develops
];
/**
 * Screen change (user rule) — used ONLY on cuts:
 *  riser  : builds ~0.85 s and ENDS on the cut (trimmed so no tail spills past it)
 *  whoosh : one smooth pass, its peak crossing the cut
 *  impact : its ATTACK (not its peak) lands on the first frame of the new screen; trimmed to 0.6 s
 */
const sceneCut = (t: number, w = 'whoosh_air'): Cue[] => [
  {file: 'ref_riser', at: t, peak: 1.06, len: 1.06, vol: 0.45},
  {file: w, at: t - 0.02, vol: 0.5},
  {file: 'impact', at: t, peak: 0.04, len: 0.6, vol: 0.42},
];

const heavyLands = CAPTION_GROUPS.filter((g) => g.h.length).map((g) => g.h[0].t);
const captionStarts = CAPTION_GROUPS.map((g) => g.start + 2 / FPS);

const CUES: Cue[] = [
  // ── hook
  {file: 'ref_typing_b', at: 1.22, vol: 0.35, len: 0.7},           // text arcing over the head
  {file: 'ref2_g_drop', at: 1.85, vol: 0.5},                       // "Classified" card zoom drop-in
  {file: 'game_over', at: 4.46, vol: 0.4},                         // "mad" 😤

  // ── site names (combo)
  ...nameReveal(6.74),
  ...nameReveal(12.98),
  ...nameReveal(21.12),
  ...nameReveal(38.34),

  // ── scene cuts (combo)
  ...sceneCut(8.7), ...sceneCut(11.96), ...sceneCut(14.0), ...sceneCut(20.56),
  ...sceneCut(22.68), ...sceneCut(27.72), ...sceneCut(31.82), ...sceneCut(37.42),
  ...sceneCut(33.5, 'whoosh_deep'),                                // into the CTA insert

  // ── DefiLlama dashboard
  {file: 'gears', at: 8.84, vol: 0.3},                             // curve draws on

  // ── CoinGlass three cards
  ...[16.7, 17.84, 19.04].map((t) => ({file: 'ref2_g_comet', at: t - 0.03, vol: 0.45})),     // comet arcs onto each card

  // ── CryptoQuant
  {file: 'ref2_g_photostack', at: 22.9, vol: 0.45},              // nodes appear along the line (ghost → sharp)
  {file: 'ref2_g_photostack', at: 23.04, vol: 0.35},
  {file: 'ref2_g_comet', at: 25.5, vol: 0.3},                      // INFLOWS arrow
  {file: 'ref2_g_comet', at: 26.34, vol: 0.3},                     // OUTFLOWS arrow
  {file: 'gears', at: 28.0, vol: 0.28},                            // chart draws on

  // ── CTA ("Trial edit" quest-card motion): icon pops → pill stretches + label types → morphs into the full card
  {file: 'ref2_q_pill', at: 33.88, vol: 0.5},                      // stretches into a pill
  {file: 'ref_typing_b', at: 33.93, vol: 0.4, len: 0.4},           // "Comment “BITCOIN”" types
  {file: 'ref2_q_morph', at: 34.42, vol: 0.5},                     // pill morphs into the card
  {file: 'ref_light_reveal', at: 34.45, vol: 0.3},                 // glow bloom
  {file: 'double_click', at: 35.12, vol: 0.5},                     // button pressed
  {file: 'ref_ding', at: 35.4, vol: 0.5},                          // "Bitcoin" lands

  // ── Farside: typing bar → "+" → orb lifts → drops (reveal) → buttons → cube → collapse
  {file: 'paper_slide', at: 39.25, vol: 0.35},                     // board slides up as a bar
  {file: 'ref_typing_b', at: 39.33, vol: 0.45, len: 0.6},         // bar types (same sound as the reference's typing bar)
  {file: 'ref_light_reveal', at: 40.4, vol: 0.6},                  // orb drops → white flash → card opens
  {file: 'dissolve', at: 44.6, vol: 0.28},                         // card collapses

  // ── captions: ONE sound for every caption, a DIFFERENT one only for bold words (user rule)
  ...captionStarts.map((t) => ({file: 'ref_click', at: t, vol: 0.28})),     // every caption appears: same soft click
  ...heavyLands.map((t) => ({file: 'ref2_g_scripts', at: t, vol: 0.4})),    // every bold word: Scripts reveal hit
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
