// Sound design with the user's SFX library (public/sfx). House rules §8: captions silent; riser→whoosh→impact only when a title/name lands;
// visual-element pops kept (vol ~0.5); screen changes clean; cues near a name hit ducked to 30 %; no file repeats ~10+ times.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {EX, FPS} from './theme';

const SFX_GAIN = 0.62;
const PEAK: Record<string, number> = {
  ref2_g_drop: 0.22, ref2_g_comet: 0.27, ref2_g_photostack: 0.09, ref_typing_b: 0.11, ref_riser: 1.06, ref_light_reveal: 0.02,
  ref_ding: 0.13, ref_click: 0.08, whoosh_air: 0.72, impact: 0.28, dissolve: 0.11, paper_slide: 0.35, pop_ui: 0.28,
  pop_media: 0.12, gears: 0.1, double_click: 0.12, game_over: 0.11,
};
type Cue = {file: string; at: number; vol: number; peak?: number; len?: number; cut?: boolean; keep?: boolean};
const s = (frame: number) => frame / FPS;
const nameHit = (t: number): Cue[] => [
  {file: 'ref_riser', at: t, peak: 1.06, len: 1.06, vol: 0.5, cut: true},
  {file: 'whoosh_air', at: t - 0.02, vol: 0.55, cut: true},
  {file: 'impact', at: t, peak: 0.04, len: 0.6, vol: 0.55, cut: true},
];
const k = (file: string, frame: number, vol = 0.5, extra: Partial<Cue> = {}): Cue => ({file, at: s(frame), vol, keep: true, ...extra});

export const CUES: Cue[] = [
  // titles / name
  ...nameHit(s(118)), // PLAYBOOK
  ...nameHit(s(635)), // SCHWARZMAN
  // F1 player
  k('pop_media', 8), k('double_click', 49, 0.45),
  // F2 prompt typing
  {file: 'ref_typing_b', at: s(76), vol: 0.18, len: 1.2},
  // F3 AUM card + $$$
  k('pop_media', 152), {file: 'gears', at: s(162), vol: 0.25}, k('pop_ui', 168, 0.42), k('pop_ui', 176, 0.42), k('pop_ui', 184, 0.42),
  // F4 people + eye
  k('pop_ui', 238, 0.4), k('pop_media', 254),
  // Gatekeepers explainer
  {file: 'gears', at: s(298), vol: 0.25}, k('paper_slide', 304, 0.35), k('ref2_g_drop', 314, 0.4), k('ref_click', 327, 0.5),
  k('paper_slide', 339, 0.35), k('ref2_g_drop', 349, 0.4), k('paper_slide', 362, 0.35), k('ref2_g_drop', 372, 0.4),
  // F5b corner frame + typing
  {file: 'gears', at: s(397), vol: 0.25}, {file: 'ref_typing_b', at: s(412), vol: 0.16, len: 1.1},
  // F6 notes window
  k('paper_slide', 450, 0.32), {file: 'ref_typing_b', at: s(466), vol: 0.16, len: 0.85},
  // F7 search
  {file: 'ref_typing_b', at: s(508), vol: 0.16, len: 0.6}, k('pop_media', 528), k('ref_ding', 543, 0.42),
  // F9 line + gauge
  k('pop_media', 676), {file: 'gears', at: s(678), vol: 0.25}, k('ref_ding', 716, 0.4),
  // F9b balance + tile deck
  k('pop_media', 757), k('ref2_g_drop', 770, 0.42), k('ref2_g_drop', 823, 0.42), k('ref2_g_drop', 887, 0.42),
  // F10 list card
  k('paper_slide', 800, 0.32), k('pop_ui', 897, 0.35), k('dissolve', 925, 0.4), k('pop_ui', 938, 0.42),
  // F11 key + curve
  k('ref2_g_drop', 957, 0.45), k('pop_media', 960), k('ref2_g_comet', 999, 0.42),
  // Growth explainer
  ...[1024, 1031, 1038, 1045].map((fr) => k('ref2_g_photostack', fr, 0.4)), k('ref2_g_comet', 1050, 0.35), k('ref_ding', 1055, 0.45),
  // Panel
  k('paper_slide', 1086, 0.35), {file: 'ref_typing_b', at: s(1094), vol: 0.16, len: 0.75}, k('ref_click', 1132, 0.55), k('pop_media', 1124), k('pop_media', 1128, 0.4),
];

const NAME_TIMES = CUES.filter((c) => c.cut && c.file === 'impact').map((c) => c.at);
const duck = (c: Cue) => (c.cut ? 1 : NAME_TIMES.some((t) => c.at >= t - 1.0 && c.at <= t + 0.6) ? 0.3 : 1);
const SWITCHES = [EX.gate[0], EX.gate[1], EX.growth[0], EX.panel[0]].map(s);
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
