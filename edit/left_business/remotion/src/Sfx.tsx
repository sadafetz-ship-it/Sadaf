// Sound design with the user's SFX library (public/sfx, peak-normalised). House rules:
//  - captions: NO sound
//  - riser → whoosh → impact ONLY when a title lands ($30K, DIGITAL)
//  - screen changes stay clean: drop non-keep cues from 0.5 s before to 0.3 s after each cut
//  - visual-element pops are wanted (keep); everything else near a name hit is ducked to 30 %
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {CUT, FPS} from './theme';

const SFX_GAIN = 0.62;
const PEAK: Record<string, number> = {
  ref2_g_drop: 0.22, ref2_g_comet: 0.27, ref2_g_photostack: 0.09, ref_typing_b: 0.11, ref_riser: 1.06, ref_light_reveal: 0.02,
  ref_ding: 0.13, ref_click: 0.08, whoosh_air: 0.72, impact: 0.28, dissolve: 0.11, paper_slide: 0.35, pop_ui: 0.28,
  pop_media: 0.12, gears: 0.1, double_click: 0.12, game_over: 0.11,
};
type Cue = {file: string; at: number; vol: number; peak?: number; len?: number; cut?: boolean; keep?: boolean};
const s = (frame: number) => frame / FPS;

const nameHit = (t: number): Cue[] => [
  {file: 'ref_riser', at: t, peak: 1.06, len: 1.06, vol: 0.8, cut: true},
  {file: 'whoosh_air', at: t - 0.02, vol: 0.85, cut: true},
  {file: 'impact', at: t, peak: 0.04, len: 0.6, vol: 0.8, cut: true},
];

const CUES: Cue[] = [
  ...nameHit(s(19)), // $30K
  ...nameHit(s(781)), // DIGITAL
  // B2 product widget drops in, ALL IN stamp
  {file: 'ref2_g_drop', at: s(66), vol: 0.45, keep: true},
  {file: 'paper_slide', at: s(70), vol: 0.35, keep: true},
  // A: burnout — energy widget drops, level drains, lands on 4 %
  {file: 'pop_media', at: s(186), vol: 0.45, keep: true},
  {file: 'ref2_g_drop', at: s(190), vol: 0.4, keep: true},
  {file: 'gears', at: s(196), vol: 0.28},
  {file: 'ref_ding', at: s(224), vol: 0.45, keep: true},
  // B4 clock ring, B5 week bars + weekend flare
  {file: 'pop_media', at: s(268), vol: 0.5, keep: true},
  {file: 'gears', at: s(280), vol: 0.26},
  {file: 'pop_ui', at: s(352), vol: 0.45, keep: true},
  {file: 'ref_click', at: s(406), vol: 0.5, keep: true},
  // notifications
  ...[437, 451, 467].map((f) => ({file: 'pop_ui', at: s(f), vol: 0.45, keep: true})),
  {file: 'pop_media', at: s(471), vol: 0.4, keep: true},
  // to-do list whips in, items strike, SKIPPED stamp
  {file: 'paper_slide', at: s(492), vol: 0.32, keep: true},
  ...[528, 555, 609].map((f) => ({file: 'ref_click', at: s(f), vol: 0.34, keep: true})),
  {file: 'ref2_g_drop', at: s(615), vol: 0.45, keep: true},
  // the switch: card whips in, progress ticks, click, colour wipe, ASAP
  {file: 'paper_slide', at: s(632), vol: 0.24, keep: true},
  {file: 'gears', at: s(640), vol: 0.22},
  {file: 'ref_click', at: s(662), vol: 0.4, keep: true},
  {file: 'whoosh_air', at: s(668), vol: 0.26, keep: true},
  {file: 'ref_ding', at: s(673), vol: 0.45, keep: true},
  // C: audience chart card, order chips
  {file: 'ref2_g_comet', at: s(832), vol: 0.45, keep: true},
  ...[840, 846, 852].map((f) => ({file: 'pop_ui', at: s(f), vol: 0.38, keep: true})),
  // CTA: pill morphs to card, typing, press
  {file: 'dissolve', at: s(870), vol: 0.35, keep: true},
  {file: 'ref_typing_b', at: s(876), vol: 0.18, len: 0.45},
  {file: 'double_click', at: s(896), vol: 0.55, keep: true},
];

const NAME_TIMES = CUES.filter((c) => c.cut && c.file === 'impact').map((c) => c.at);
const duck = (c: Cue) => (c.cut ? 1 : NAME_TIMES.some((t) => c.at >= t - 1.0 && c.at <= t + 0.6) ? 0.3 : 1);
const SWITCHES = [CUT.explainA, CUT.talkB, CUT.explainB, CUT.talkC, CUT.explainC, CUT.talkD].map(s);
const onScreenChange = (c: Cue) => !c.cut && !c.keep && SWITCHES.some((t) => c.at > t - 0.5 && c.at < t + 0.3);
export const PLAYED = CUES.filter((c) => !onScreenChange(c));

export const Sfx: React.FC = () => (
  <>
    {PLAYED.map((c, i) => {
      const start = c.at - (c.peak ?? PEAK[c.file] ?? 0);
      const from = Math.max(0, Math.round(start * FPS));
      const trim = start < 0 ? Math.round(-start * FPS) : 0;
      return (
        <Sequence key={i} from={from} durationInFrames={c.len ? Math.max(1, Math.round(c.len * FPS) - trim) : undefined} layout="none">
          <Audio src={staticFile(`sfx/${c.file}.wav`)} volume={c.vol * SFX_GAIN * duck(c)} startFrom={trim} />
        </Sequence>
      );
    })}
  </>
);
