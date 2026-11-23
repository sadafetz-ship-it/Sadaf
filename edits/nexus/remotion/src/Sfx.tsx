import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {CAPTION_GROUPS, f, FPS, SWITCHES} from './timing';

/**
 * Nexus sound design v2 — "smooth and engaging".
 *
 * Layers (each hit lands on its animation frame: a cue starts at `at − peak/rate`):
 *  • BIG MOMENTS (4 program names, gauge, "$10 million"): riser + reverse-whoosh SWELL build INTO the frame,
 *    impact + SUB BOOM + light shimmer land ON it. Risers are trimmed to end exactly on the hit (no tail spill).
 *  • SCENE CHANGES (link scene, back to talk, jump cut, gauge scene): one whoosh across the cut (deep for in, soft for out)
 *    + a soft impact / sub for weight. No pops or clicks on cuts.
 *  • CARDS / UI: soft whoosh + light reveal on each glowing card; comets on tiles/bars with rising pitch (1.0 → 1.12 → 1.25)
 *    so the three reveals feel like a build; typing on the pill; gears under drawing lines.
 *  • CAPTIONS: one identical soft click per caption (house rule), ducked under big moments.
 *  • Every cue fades in over 1 f and out over its last 3 f (no clicks); pitch is varied ±10–20 % so repeats never sound copied.
 *  • Everything else is ducked to 35 % from 1 s before to 0.6 s after each big moment, so the hits read clearly.
 */
type Cue = {file: string; at: number; vol: number; peak?: number; len?: number; rate?: number; big?: boolean};
const SFX_GAIN = 0.6;

/** Where each file's own hit sits (seconds), measured from the waveform. */
const PEAK: Record<string, number> = {
  ref_riser: 1.055, swell: 1.748, impact: 0.04, impact_soft: 0.05, sub_boom: 0.005,
  whoosh_air: 0.715, whoosh_deep: 0.973, whoosh_soft: 0.678, ref_light_reveal: 0.02,
  ref2_g_comet: 0.262, ref2_g_drop: 0.16, ref2_g_photostack: 0.09, ref_ding: 0.213, ref_click: 0.08, ref_typing_b: 0.11, gears: 0.1,
};

/** Build-and-land combo for the biggest moments. `scale` lets the final ones hit a bit harder. */
const bigHit = (t: number, s0 = 1, rate = 1): Cue[] => {
  const scale = s0 * 0.7; // measured: hits sat 5–8 dB over the voice; −3 dB keeps the spoken word on top
  return [
  {file: 'ref_riser', at: t, vol: 0.42 * scale, len: 1.055 / rate, rate, big: true},          // builds and stops on the hit
  {file: 'swell', at: t, vol: 0.32 * scale, len: 1.748, big: true},                            // reverse whoosh sucking into the hit
  {file: 'impact', at: t, vol: 0.42 * scale, len: 0.7, big: true},
  {file: 'sub_boom', at: t, vol: 0.55 * scale, len: 1.0, big: true},
  {file: 'ref_light_reveal', at: t + 0.02, vol: 0.32 * scale, big: true},                      // shimmer on the bloom
  ];
};

/** Scene change: whoosh across the cut + a little weight. */
const cut = (t: number, kind: 'in' | 'out'): Cue[] => kind === 'in'
  ? [{file: 'whoosh_deep', at: t, vol: 0.38, len: 1.5}, {file: 'impact_soft', at: t + 0.02, vol: 0.3, len: 0.8}, {file: 'sub_boom', at: t + 0.02, vol: 0.28, len: 0.8}]
  : [{file: 'whoosh_soft', at: t, vol: 0.36, len: 1.1}, {file: 'impact_soft', at: t + 0.02, vol: 0.22, len: 0.7}];

/** Glowing card zoom-in + white flash. */
const cardIn = (t: number, rate = 1): Cue[] => [
  {file: 'whoosh_soft', at: t, vol: 0.28, len: 0.9, rate},
  {file: 'ref_light_reveal', at: t, vol: 0.4},
  {file: 'ref2_g_comet', at: t + 0.05, vol: 0.18, rate},
];

const captionStarts = CAPTION_GROUPS.map((g) => g.start + 2 / FPS);

const CUES: Cue[] = [
  // ── 0 – 3.5  hook + NEXUS
  {file: 'sub_boom', at: 0.03, vol: 0.32, len: 0.9},                                 // low thump under "Alright" to open
  {file: 'whoosh_soft', at: 2.02, vol: 0.18, len: 0.8},                              // script "welcome to" writes on
  ...bigHit(2.7),

  // ── 3.5 – 6.9  link explainer
  ...cut(3.5, 'in'),
  {file: 'ref2_g_photostack', at: 3.64, vol: 0.36},                                  // NEXUS node ghost → sharp
  {file: 'ref_typing_b', at: 4.42, vol: 0.32, len: 0.85},                            // typing pill
  {file: 'whoosh_soft', at: 4.8, vol: 0.22, len: 0.7, rate: 1.2},                    // "Online business" whips in
  {file: 'gears', at: 5.18, vol: 0.18, len: 0.9},                                    // line draws
  {file: 'whoosh_soft', at: 5.94, vol: 0.22, len: 0.7, rate: 1.1},                   // "Creator economy" whips in
  {file: 'ref_ding', at: 6.12, vol: 0.38},                                           // lines meet at NEXUS
  {file: 'impact_soft', at: 6.12, vol: 0.18, len: 0.6},

  // ── 6.9 – 9.95  three program tiles
  ...cut(6.9, 'out'),
  {file: 'ref2_g_comet', at: 7.31, vol: 0.36, rate: 1.0},                            // rising pitch: 01 → 02 → 03
  {file: 'ref2_g_comet', at: 7.47, vol: 0.36, rate: 1.12},
  {file: 'ref2_g_comet', at: 7.71, vol: 0.4, rate: 1.25},
  {file: 'impact_soft', at: 7.74, vol: 0.2, len: 0.6},                               // "programs" lands

  // ── 9.95 jump cut → LAUNCHPAD
  ...cut(9.95, 'out'),
  ...bigHit(11.04),
  ...cardIn(12.6),

  // ── MEDIA PRO
  ...bigHit(16.0, 1, 1.05),
  {file: 'ref2_g_drop', at: 16.6, vol: 0.3},                                         // card lands
  ...cardIn(16.6, 1.08),

  // ── "And last but for damn sure not least" → MASTERY (biggest name)
  {file: 'whoosh_soft', at: 19.42, vol: 0.2, len: 0.8, rate: 0.95},                  // swoosh streak
  {file: 'impact_soft', at: 20.22, vol: 0.22, len: 0.6},                             // punch-in on "damn"
  ...bigHit(21.48, 1.12, 0.95),
  ...cardIn(22.6, 0.94),

  // ── 24.1 gauge scene
  ...cut(24.1, 'in'),
  {file: 'ref2_g_photostack', at: 24.15, vol: 0.4},                                  // pixel burst
  {file: 'ref2_g_comet', at: 24.27, vol: 0.26, rate: 1.0},                           // bars rise, pitch climbing
  {file: 'ref2_g_comet', at: 24.57, vol: 0.26, rate: 1.12},
  {file: 'ref2_g_comet', at: 25.03, vol: 0.3, rate: 1.25},
  {file: 'ref_ding', at: 25.06, vol: 0.26, rate: 0.9},                               // $50K
  {file: 'whoosh_soft', at: 26.14, vol: 0.22, len: 0.9, rate: 0.9},                  // glow wave rises
  // climb to $10M: a longer, slower riser (rate 0.9 → ≈1.17 s) ending on "million"
  ...bigHit(27.32, 1.2, 0.9),
  {file: 'ref_ding', at: 27.34, vol: 0.4},

  // ── outro
  {file: 'whoosh_deep', at: 28.45, vol: 0.22, len: 1.0, rate: 1.1},                  // whoosh into the fade

  // ── captions: the same soft click on every caption
  ...captionStarts.map((t) => ({file: 'ref_click', at: t, vol: 0.24})),
];

const BIG_TIMES = [...new Set(CUES.filter((c) => c.big && c.file === 'impact').map((c) => c.at))];
const duck = (c: Cue) => (c.big ? 1 : BIG_TIMES.some((t) => c.at >= t - 1.0 && c.at <= t + 0.6) ? 0.35 : 1);
/** House rule: no click-type sounds on screen changes. */
const onScreenChange = (c: Cue) => c.file === 'ref_click' && SWITCHES.some((t) => c.at > t - 0.5 && c.at < t + 0.3);
const PLAYED = CUES.filter((c) => !onScreenChange(c));

export const Sfx: React.FC = () => (
  <>
    {PLAYED.map((c, i) => {
      const rate = c.rate ?? 1;
      const start = c.at - (c.peak ?? PEAK[c.file] ?? 0) / rate;
      const from = Math.max(0, f(start));
      const trim = start < 0 ? Math.round(f(-start) * rate) : 0;
      const dur = c.len ? Math.max(4, Math.round(c.len * FPS)) : undefined;
      const v = c.vol * SFX_GAIN * duck(c);
      return (
        <Sequence key={i} from={from} durationInFrames={dur} layout="none">
          <Audio src={staticFile(`sfx/${c.file}.wav`)} startFrom={trim} playbackRate={rate}
            volume={(fr) => v * interpolate(fr, [0, 1], [0, 1], {extrapolateRight: 'clamp'})
              * (dur ? interpolate(fr, [dur - 3, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1)} />
        </Sequence>
      );
    })}
  </>
);
