import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {CAPTION_GROUPS, f, FPS, SWITCHES} from './timing';

/**
 * Sound design (house rules):
 *  - riser → whoosh → impact ONLY when a program name lands behind the head (+ light reveal, tile comet);
 *  - every caption: the same soft click; no per-caption variety;
 *  - no pop/click sounds on screen changes; meaningful sounds only (comet, reveals, drops).
 * `peak` = where the file's own hit sits, so the hit lands on the animation frame.
 */
type Cue = {file: string; at: number; peak?: number; vol: number; len?: number; cut?: boolean};
const SFX_GAIN = 0.62;
const PEAK: Record<string, number> = {
  ref2_g_drop: 0.22, ref2_g_comet: 0.27, ref2_g_photostack: 0.09, ref_typing_b: 0.11, ref_riser: 1.06, ref_light_reveal: 0.02,
  ref_ding: 0.13, ref_click: 0.08, whoosh_air: 0.72, impact: 0.28, dissolve: 0.11, paper_slide: 0.35, gears: 0.1, double_click: 0.12,
};
const nameHit = (t: number): Cue[] => [
  {file: 'ref_riser', at: t, peak: 1.06, len: 1.06, vol: 0.45, cut: true},
  {file: 'whoosh_air', at: t - 0.02, vol: 0.5, cut: true},
  {file: 'impact', at: t, peak: 0.04, len: 0.6, vol: 0.42, cut: true},
  {file: 'ref_light_reveal', at: t, vol: 0.4},
];
const captionStarts = CAPTION_GROUPS.map((g) => g.start + 2 / FPS);

const CUES: Cue[] = [
  ...nameHit(2.7), ...nameHit(11.04), ...nameHit(16.0), ...nameHit(21.48),
  {file: 'ref2_g_comet', at: 11.04, vol: 0.22}, {file: 'ref2_g_comet', at: 16.0, vol: 0.22}, {file: 'ref2_g_comet', at: 21.48, vol: 0.22}, // number tiles develop
  // link explainer
  {file: 'ref2_g_photostack', at: 3.64, vol: 0.45},          // NEXUS node ghost → sharp
  {file: 'whoosh_air', at: 4.8, vol: 0.22},                  // "Online business" whips in
  {file: 'gears', at: 5.18, vol: 0.22},                      // line draws
  {file: 'whoosh_air', at: 5.94, vol: 0.22},                 // "Creator economy" whips in
  {file: 'ref_ding', at: 6.12, vol: 0.4},                    // lines meet at NEXUS
  // three program tiles: comet + glow reveal
  ...[7.34, 7.5, 7.74].map((t) => ({file: 'ref2_g_comet', at: t - 0.03, vol: 0.38})),
  // range cards
  // glowing program cards: zoom-in + white flash
  ...[12.6, 16.6, 22.6].flatMap((t) => [{file: 'ref_light_reveal', at: t, vol: 0.45}, {file: 'ref2_g_comet', at: t, vol: 0.25}]),
  // typing pill
  {file: 'ref_typing_b', at: 4.42, vol: 0.35, len: 0.8},
  // tier chart
  {file: 'ref2_g_photostack', at: 24.15, vol: 0.45},         // gauge pixel burst
  {file: 'ref2_g_photostack', at: 24.3, vol: 0.3},
  {file: 'ref2_g_photostack', at: 24.6, vol: 0.3},
  {file: 'ref2_g_comet', at: 25.06, vol: 0.35},              // Mastery bar + $50K counter
  {file: 'ref_riser', at: 27.32, peak: 1.06, len: 1.06, vol: 0.4}, // climb to $10M
  {file: 'ref_ding', at: 27.32, vol: 0.55},                  // "$10 million" lands
  // captions: one soft click each
  ...captionStarts.map((t) => ({file: 'ref_click', at: t, vol: 0.28})),
];

const CUT_TIMES = CUES.filter((c) => c.cut && c.file === 'impact').map((c) => c.at);
const duck = (c: Cue) => (c.cut ? 1 : CUT_TIMES.some((t) => c.at >= t - 1.0 && c.at <= t + 0.6) ? 0.3 : 1);
const onScreenChange = (c: Cue) => !c.cut && c.file === 'ref_click' && SWITCHES.some((t) => c.at > t - 0.5 && c.at < t + 0.3);
const PLAYED = CUES.filter((c) => !onScreenChange(c));

export const Sfx: React.FC = () => (
  <>
    {PLAYED.map((c, i) => {
      const start = c.at - (c.peak ?? PEAK[c.file] ?? 0);
      const from = Math.max(0, f(start));
      const trim = start < 0 ? f(-start) : 0;
      return (
        <Sequence key={i} from={from} durationInFrames={c.len ? Math.round(c.len * FPS) : undefined} layout="none">
          <Audio src={staticFile(`sfx/${c.file}.wav`)} volume={c.vol * SFX_GAIN * duck(c)} startFrom={trim} />
        </Sequence>
      );
    })}
  </>
);
