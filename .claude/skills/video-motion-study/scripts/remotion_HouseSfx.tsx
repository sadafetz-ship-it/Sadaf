// From the user's house edit (16:9, Golden Hour accent, Nov 2026). Drop into a Remotion src/ with theme.ts (C, GLASS, HEAVY_FILL, HEAVY_FILTER).
// SFX cue sheet with the user's library (assets/sfx): name hits, visual pops, ducking, screen-change filter.
// Sound design with the user's SFX library (public/sfx, peak-normalised). Rules (house_style §8, final):
//  - captions: NO sound (no click per caption, no hit on bold words)
//  - riser → whoosh → impact ONLY when a name lands (HOME, PLAN): riser ends on the landing, whoosh peak crosses it,
//    impact ATTACK on the landing frame (trimmed 0.6 s)
//  - screen changes stay clean: drop non-keep cues from 0.5 s before to 0.3 s after each cut
//  - visual-element pops are wanted (keep): cards, widgets, nodes, the $ glyphs
//  - everything else within 1 s before / 0.6 s after a name hit is ducked to 30 %
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {CUT, FPS} from './theme';

const SFX_GAIN = 0.62;
// peak offsets (s) measured on the user's files
const PEAK: Record<string, number> = {
  ref2_g_drop: 0.22, ref2_g_comet: 0.27, ref2_g_photostack: 0.09, ref_typing_b: 0.11, ref_riser: 1.06, ref_light_reveal: 0.02,
  ref_ding: 0.13, ref_click: 0.08, whoosh_air: 0.72, impact: 0.28, dissolve: 0.11, paper_slide: 0.35, pop_ui: 0.28,
  pop_media: 0.12, gears: 0.1, double_click: 0.12, game_over: 0.11,
};
type Cue = {file: string; at: number; vol: number; peak?: number; len?: number; cut?: boolean; keep?: boolean};
const s = (frame: number) => frame / FPS;

/** Name lands (Scripts-style title): riser → whoosh → impact. */
const nameHit = (t: number): Cue[] => [
  {file: 'ref_riser', at: t, peak: 1.06, len: 1.06, vol: 0.5, cut: true},
  {file: 'whoosh_air', at: t - 0.02, vol: 0.55, cut: true},
  {file: 'impact', at: t, peak: 0.04, len: 0.6, vol: 0.55, cut: true},
];

const CUES: Cue[] = [
  // names
  ...nameHit(s(41)), // HOME
  ...nameHit(s(297)), // PLAN
  // glass gauge widget appears (pixel mosaic → glass)
  {file: 'pop_media', at: s(61), vol: 0.5, keep: true},
  // Explainer A: input bar types, plan card drops, timeline draws, nodes sharpen, YR 10 lands
  {file: 'ref_typing_b', at: s(147), vol: 0.18, len: 0.8},
  {file: 'ref2_g_drop', at: s(168), vol: 0.45, keep: true},
  {file: 'gears', at: s(181), vol: 0.28},
  ...[186, 193, 199].map((f) => ({file: 'ref2_g_photostack', at: s(f), vol: 0.38, keep: true})),
  {file: 'ref_ding', at: s(206), vol: 0.45, keep: true},
  // Homeowner card whips in; gold key drops onto its orbit
  {file: 'paper_slide', at: s(244), vol: 0.32, keep: true},
  {file: 'ref2_g_drop', at: s(258), vol: 0.5, keep: true},
  // Calendar → click 23 → card morphs out of the cell → "Get started" pressed
  {file: 'pop_ui', at: s(327), vol: 0.45, keep: true},
  {file: 'ref_click', at: s(336), vol: 0.55, keep: true},
  {file: 'dissolve', at: s(339), vol: 0.35, keep: true},
  {file: 'double_click', at: s(356), vol: 0.5, keep: true},
  // Explainer B: goal card develops (glow reveal), people row
  {file: 'ref2_g_comet', at: s(383), vol: 0.45, keep: true},
  {file: 'pop_ui', at: s(442), vol: 0.35, keep: true},
  // $$$ glyphs drop in, "pricey" lands
  ...[522, 525, 528].map((f) => ({file: 'pop_media', at: s(f), vol: 0.42, keep: true})),
  {file: 'ref_ding', at: s(538), vol: 0.4, keep: true},
];

const NAME_TIMES = CUES.filter((c) => c.cut && c.file === 'impact').map((c) => c.at);
const duck = (c: Cue) => (c.cut || c.keep ? 1 : NAME_TIMES.some((t) => c.at >= t - 1.0 && c.at <= t + 0.6) ? 0.3 : 1);
const SWITCHES = [CUT.explainA, CUT.talkB, CUT.explainB, CUT.talkC].map(s);
const onScreenChange = (c: Cue) => !c.cut && !c.keep && SWITCHES.some((t) => c.at > t - 0.5 && c.at < t + 0.3);
export const PLAYED = CUES.filter((c) => !onScreenChange(c));

export const Sfx: React.FC = () => (
  <>
    {PLAYED.map((c, i) => {
      const start = c.at - (c.peak ?? PEAK[c.file] ?? 0);
      const from = Math.max(0, Math.round(start * FPS));
      const trim = start < 0 ? Math.round(-start * FPS) : 0;
      return (
        <Sequence key={i} from={from} durationInFrames={c.len ? Math.round(c.len * FPS) : undefined} layout="none">
          <Audio src={staticFile(`sfx/${c.file}.wav`)} volume={c.vol * SFX_GAIN * duck(c)} startFrom={trim} />
        </Sequence>
      );
    })}
  </>
);
