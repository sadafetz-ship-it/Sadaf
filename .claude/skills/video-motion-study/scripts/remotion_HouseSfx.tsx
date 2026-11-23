// From the user's house edit (16:9, Golden Hour accent, Nov 2026).
// SFX cue sheet with the user's library (assets/sfx): graded riser/whoosh/impact on names + screen changes, per-element sounds, fades, ducking, pitch variation.
// Sound design with the user's SFX library (public/sfx, peak-normalised).
// Rules (house_style §8, updated Nov 2026 — user: "use riser, whoosh, impact and other SFX smoothly to make it more engaging"):
//  - captions: NO sound (user rejected caption clicks / bold-word hits)
//  - riser → whoosh → impact on every BIG moment: name titles (HOME, STEP BY STEP) AND the 4 screen changes
//    (into / out of the explainers). Riser ENDS on the moment, whoosh PEAK crosses it, impact ATTACK on it.
//    Graded: "full" for names + cuts into explainers, "light" (short riser tail, softer impact) for cuts back to the speaker.
//  - every visual element has its own sound (drop, pop, ticks, nodes, morph, click, press, $ drops in rising pitch)
//  - smooth: every trimmed sound fades in/out (no clicks), whooshes vary in pitch (playbackRate), no file > 8 plays,
//    non-hero sounds within 0.8 s before / 0.5 s after a hero hit are ducked to 45 % so the hit leads
import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {CUT, FPS} from './theme';

const SFX_GAIN = 0.62;
// peak offsets (s) measured on the user's files
const PEAK: Record<string, number> = {
  ref2_g_drop: 0.22, ref2_g_comet: 0.27, ref2_g_photostack: 0.09, ref_typing_b: 0.11, ref_riser: 1.06, ref_light_reveal: 0.02,
  ref_ding: 0.13, ref_click: 0.08, whoosh_air: 0.72, impact: 0.28, dissolve: 0.11, paper_slide: 0.35, pop_ui: 0.28,
  pop_media: 0.12, gears: 0.1, double_click: 0.12, game_over: 0.11,
};
type Cue = {
  file: string; at: number; vol: number;
  peak?: number; // override peak offset (s, in file time)
  from?: number; // start this far into the file (s) — used to shorten risers
  len?: number; // play length (s, real time)
  rate?: number; // playbackRate (pitch/speed variation)
  hero?: boolean; // part of a riser/whoosh/impact hit (never ducked)
};
const s = (frame: number) => frame / FPS;

/** Big moment: riser → whoosh → impact. `weight` 1 = full, ~0.6 = light. */
const hit = (t: number, weight = 1, whooshRate = 1): Cue[] => [
  // full: ~1.0 s build; light: last ~0.55 s of the riser only
  {file: 'ref_riser', at: t, peak: 1.06, from: weight >= 1 ? 0.06 : 0.5, len: weight >= 1 ? 1.0 : 0.56, vol: 0.5 * weight, hero: true},
  {file: 'whoosh_air', at: t - 0.02, rate: whooshRate, vol: 0.55 * (0.6 + 0.4 * weight), hero: true},
  {file: 'impact', at: t, peak: 0.04, len: weight >= 1 ? 0.7 : 0.45, vol: 0.55 * weight, hero: true},
];

const CUES: Cue[] = [
  // ── hook: HOME lands
  ...hit(s(41), 1, 1).map((c) => ({...c, vol: c.vol * 0.8})), // voice is quiet here
  {file: 'dissolve', at: s(44), vol: 0.22}, // pixel clusters crackle
  // ── "10 yrs" gauge: pixel mosaic → glass, dial ticks fill, number lands
  {file: 'pop_media', at: s(62), vol: 0.45},
  {file: 'gears', at: s(66), vol: 0.22, len: 0.8},

  // ── cut INTO explainer A (light-beam sweep)
  ...hit(s(CUT.explainA), 1, 0.92),
  {file: 'ref_light_reveal', at: s(CUT.explainA + 4), vol: 0.18, len: 0.6}, // beam shimmer
  {file: 'paper_slide', at: s(150), vol: 0.28}, // input bar stretches open
  {file: 'ref_typing_b', at: s(152), vol: 0.17, len: 0.8},
  {file: 'ref2_g_drop', at: s(174), vol: 0.45}, // plan card drops in
  {file: 'whoosh_air', at: s(182), rate: 1.35, vol: 0.2}, // bar + card lift away
  {file: 'gears', at: s(186), vol: 0.22, len: 0.7}, // timeline draws
  ...[185, 192, 199].map((f, i) => ({file: 'ref2_g_photostack', at: s(f), vol: 0.34, rate: 1 + i * 0.06})), // nodes sharpen, rising
  {file: 'ref_ding', at: s(208), vol: 0.42}, // YR 10 house lands

  // ── cut BACK to the speaker (zoom-blur + flash): light hit
  ...hit(s(CUT.talkB), 0.55, 1.12),
  // Homeowner card whips in, gold key drops onto its orbit, sparkles
  {file: 'whoosh_air', at: s(246), rate: 1.25, vol: 0.26},
  {file: 'pop_media', at: s(251), vol: 0.4},
  {file: 'ref2_g_drop', at: s(266), vol: 0.5},
  {file: 'ref_light_reveal', at: s(268), vol: 0.14, len: 0.5},
  {file: 'dissolve', at: s(283), vol: 0.2}, // card + key blur out

  // ── STEP · BY · STEP (word by word)
  ...hit(s(308), 1, 0.96),
  {file: 'pop_ui', at: s(315), vol: 0.4}, // BY
  {file: 'impact', at: s(320), peak: 0.04, len: 0.45, vol: 0.32, hero: true}, // second STEP: smaller echo hit
  // calendar → click 23 → card morphs out of the cell → "Get started" pressed
  {file: 'pop_ui', at: s(312), vol: 0.32, rate: 1.1},
  {file: 'ref_click', at: s(336), vol: 0.55},
  {file: 'dissolve', at: s(341), vol: 0.34},
  {file: 'pop_ui', at: s(352), vol: 0.26, rate: 1.2}, // card content in
  {file: 'double_click', at: s(362), vol: 0.5},

  // ── cut INTO explainer B
  ...hit(s(CUT.explainB), 1, 1.06),
  {file: 'ref_light_reveal', at: s(CUT.explainB + 4), vol: 0.18, len: 0.6},
  {file: 'ref2_g_comet', at: s(387), vol: 0.45}, // goal card develops
  {file: 'pop_ui', at: s(442), vol: 0.32}, // people row

  // ── cut BACK to the speaker: light hit
  ...hit(s(CUT.talkC), 0.65, 1.18),
  // $$$ drop in (rising pitch), "pricey" lands with impact + ding + edge flash
  ...[526, 530, 534].map((f, i) => ({file: 'pop_media', at: s(f), vol: 0.4, rate: 1 + i * 0.08})),
  {file: 'impact', at: s(538), peak: 0.04, len: 0.7, vol: 0.45, hero: true},
  {file: 'ref_ding', at: s(539), vol: 0.34},
];

const HERO_TIMES = CUES.filter((c) => c.hero && c.file === 'impact').map((c) => c.at);
const duck = (c: Cue) => (c.hero ? 1 : HERO_TIMES.some((t) => c.at >= t - 0.8 && c.at <= t + 0.5) ? 0.45 : 1);
export const PLAYED = CUES;

export const Sfx: React.FC = () => (
  <>
    {PLAYED.map((c, i) => {
      const rate = c.rate ?? 1;
      const peak = (c.peak ?? PEAK[c.file] ?? 0) - (c.from ?? 0); // peak position after the start offset, in file time
      const start = c.at - peak / rate;
      const from = Math.max(0, Math.round(start * FPS));
      const trim = (start < 0 ? -start * rate : 0) + (c.from ?? 0); // file-time offset
      const dur = c.len ? Math.round(c.len * FPS) : undefined;
      const v = c.vol * SFX_GAIN * duck(c);
      // smooth envelope: 2 f fade-in when starting mid-file, 4 f fade-out on trimmed sounds
      const vol = (fr: number) =>
        v * (c.from || start < 0 ? interpolate(fr, [0, 2], [0, 1], {extrapolateRight: 'clamp'}) : 1) *
        (dur ? interpolate(fr, [dur - 4, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1);
      return (
        <Sequence key={i} from={from} durationInFrames={dur} layout="none">
          <Audio src={staticFile(`sfx/${c.file}.wav`)} volume={vol} startFrom={Math.round(trim * FPS)} playbackRate={rate} />
        </Sequence>
      );
    })}
  </>
);
