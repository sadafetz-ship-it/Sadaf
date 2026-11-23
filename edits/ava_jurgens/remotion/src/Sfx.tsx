import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import groups from './captions.json';

/** peak offsets (s) measured with sfx_tools.py analyse — start = cue − peak so the hit lands on the animation frame */
const PEAK: Record<string, number> = {
  ref_riser: 1.06, whoosh_air: 0.72, impact: 0.04, pop_media: 0.12, pop_ui: 0.28, ref2_g_drop: 0.22, ref2_g_comet: 0.27,
  ref2_g_photostack: 0.09, ref_typing_b: 0.11, ref_click: 0.28, double_click: 0.12, dissolve: 0.11, paper_slide: 0.35,
  gears: 0.45, ref_ding: 0.22, ref_light_reveal: 0.07,
};
const FPS = 30;
export const SFX_GAIN = 0.3;
type Cue = {s: string; at: number; v: number; len?: number; trimFront?: number};

/** riser ends on the landing, whoosh peak crosses it, impact attack hits it (+1 f).
 *  riserLen trims the riser from the FRONT (its swell sits in the last ~0.2 s) so close cuts don't overlap. */
const hit = (at: number, v = 1, riser = true, riserLen = 1.06): Cue[] => [
  ...(riser ? [{s: 'ref_riser', at, v: 1.0 * v, len: 1.06, trimFront: Math.max(0, 1.06 - riserLen)}] : []),
  {s: 'whoosh_air', at, v: 0.85 * v, len: 1.3},
  {s: 'impact', at: at + 1, v: 1.0 * v, len: 0.6},
];
const typing = (a: number, b: number, v = 0.18): Cue[] => {
  const out: Cue[] = []; for (let f = a; f < b; f += 12) out.push({s: 'ref_typing_b', at: f, v, len: Math.min(0.4, (b - f) / FPS)}); return out;
};

const CUES: Cue[] = [
  // F1 — "Ava" name hit + Scripts pixels
  ...hit(24, 1, true, 0.75), {s: 'ref2_g_photostack', at: 25, v: 0.35},
  // → F2 PBL page
  ...hit(48, 0.9), {s: 'paper_slide', at: 55, v: 0.4}, {s: 'pop_ui', at: 58, v: 0.35}, ...typing(60, 76), {s: 'pop_ui', at: 77, v: 0.3},
  ...typing(73, 96, 0.14), {s: 'gears', at: 90, v: 0.5, len: 0.9}, ...typing(95, 125, 0.12),
  {s: 'pop_ui', at: 118, v: 0.3}, {s: 'ref2_g_drop', at: 128, v: 0.5}, {s: 'pop_media', at: 132, v: 0.55}, {s: 'ref_ding', at: 132, v: 0.45},
  ...hit(147, 0.8, true, 0.45),
  // → F3 hiring: big screen change
  ...hit(162, 1, true, 0.45), {s: 'pop_media', at: 176, v: 0.35},
  {s: 'ref2_g_comet', at: 188, v: 0.6}, {s: 'ref2_g_comet', at: 209, v: 0.6}, {s: 'ref2_g_comet', at: 236, v: 0.65},
  ...hit(246, 0.9, true, 0.75), {s: 'ref2_g_photostack', at: 247, v: 0.4},
  // → F4 Content Flow
  ...hit(258, 0.75, true, 0.35), {s: 'gears', at: 272, v: 0.6, len: 1.4},
  {s: 'ref2_g_photostack', at: 277, v: 0.45}, {s: 'ref2_g_photostack', at: 304, v: 0.45}, {s: 'ref2_g_photostack', at: 313, v: 0.5},
  ...hit(327, 0.8),
  // F5 test card
  ...typing(355, 375), {s: 'dissolve', at: 377, v: 0.45}, {s: 'gears', at: 398, v: 0.4, len: 0.8}, {s: 'pop_media', at: 433, v: 0.5},
  // → F6 light-beam wipe
  ...hit(459, 1), {s: 'ref_light_reveal', at: 455, v: 0.25, len: 0.5}, {s: 'pop_ui', at: 463, v: 0.3}, {s: 'pop_ui', at: 469, v: 0.3},
  {s: 'pop_media', at: 500, v: 0.45}, ...typing(508, 528, 0.16),
  // F7 gauge
  ...hit(531, 0.8), {s: 'pop_media', at: 554, v: 0.55}, {s: 'ref_ding', at: 566, v: 0.4},
  {s: 'ref_click', at: 589, v: 0.3}, {s: 'ref_click', at: 595, v: 0.3}, {s: 'ref_click', at: 601, v: 0.35},
  // F8 orbit
  ...hit(612, 0.8), {s: 'dissolve', at: 640, v: 0.4},
  ...hit(648, 0.8, true, 0.8),
  // F9 "THIS JOB" name hit
  ...hit(665, 1, true, 0.5), {s: 'ref2_g_photostack', at: 666, v: 0.35},
  // F10 tile 1 + list card
  {s: 'ref2_g_drop', at: 704, v: 0.55}, {s: 'paper_slide', at: 706, v: 0.35},
  ...[757, 794, 823, 848].map((at) => ({s: 'pop_ui', at, v: 0.3})),
  // → F11 consistency
  ...hit(867, 1), {s: 'gears', at: 868, v: 0.35, len: 0.6},
  {s: 'ref2_g_drop', at: 889, v: 0.5}, {s: 'ref2_g_photostack', at: 909, v: 0.4}, {s: 'ref2_g_comet', at: 916, v: 0.6},
  ...hit(936, 0.8),
  // F11b / F12
  {s: 'ref2_g_drop', at: 946, v: 0.5}, ...[944, 950, 973].map((at) => ({s: 'ref_click', at: at + 2, v: 0.3})),
  {s: 'ref2_g_drop', at: 1009, v: 0.55}, {s: 'paper_slide', at: 1007, v: 0.3}, ...[1065, 1089, 1127].map((at) => ({s: 'ref_click', at: at + 2, v: 0.3})),
  // F13 "YOU" + CTA
  ...hit(1161, 1), {s: 'ref2_g_photostack', at: 1162, v: 0.35},
  {s: 'pop_media', at: 1170, v: 0.45}, ...typing(1178, 1196, 0.16), {s: 'dissolve', at: 1198, v: 0.45},
  {s: 'double_click', at: 1216, v: 0.55}, {s: 'ref_ding', at: 1218, v: 0.4},
];

// one soft click as each caption appears (house rule: same sound for every caption)
const CAPS: Cue[] = (groups as any[]).map((g) => ({s: 'pop_ui', at: [...g.l1, ...g.sc, ...g.hv][0].f, v: 0.12}))
  .filter((c) => !(c.at >= 612 && c.at < 867) && !(c.at >= 936 && c.at < 1150));

export const Sfx: React.FC = () => (
  <>
    {[...CUES, ...CAPS].map((c, i) => {
      const peak = PEAK[c.s] ?? 0;
      const start = c.at - Math.round(peak * FPS);
      const tf = Math.round((c.trimFront ?? 0) * FPS);
      const skip = Math.max(start < 0 ? -start : 0, tf);
      const dur = c.len ? Math.round(c.len * FPS) : undefined;
      return (
        <Sequence key={i} from={start + skip} durationInFrames={dur ? Math.max(1, dur - skip) : undefined} layout="none">
          <Audio src={staticFile(`sfx/${c.s}.wav`)} startFrom={skip} volume={(f) => {
            const v = c.v * SFX_GAIN;
            if (!dur) return v;
            const left = dur - skip - f; // 3-frame fade at trimmed tails
            return left < 3 ? v * Math.max(0, left / 3) : v;
          }} />
        </Sequence>
      );
    })}
  </>
);
