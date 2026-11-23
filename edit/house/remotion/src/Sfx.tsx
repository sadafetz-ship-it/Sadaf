// SFX cue sheet. Each cue = the frame where the sound's PEAK should land. Peak offsets come from sfx_peaks.json.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import peaks from './sfx_peaks.json';
import {GROUPS, HEAVY_FRAMES} from './Captions';
import {CUT, FPS} from './theme';

export const SFX_GAIN = 0.6; // master
type Name = keyof typeof peaks;
type Cue = [Name, number, number]; // name, peak frame, gain

const cues: Cue[] = [];
const add = (n: Name, at: number, g: number) => cues.push([n, at, g]);

// Captions: the same soft click on every caption; bold words: the same Scripts hit.
GROUPS.forEach((g) => add('click', g.start + (g.start === 0 ? 1 : 0), 0.2));
HEAVY_FRAMES.forEach((at) => add('scripts_hit', at, 0.45));
// Scripts-style names (HOME / PLAN)
add('scripts_hit', 41, 0.5); add('data', 42, 0.25);
add('scripts_hit', 297, 0.5); add('data', 298, 0.25);
// Gauge: pixel-mosaic + number lands
add('data', 58, 0.3); add('pop', 64, 0.3);
// Screen changes: riser → whoosh → impact
[CUT.explainA, CUT.talkB, CUT.explainB, CUT.talkC].forEach((c) => {
  add('riser', c, 0.35); add('whoosh', c + 1, 0.5); add('impact', c + 1, 0.45);
});
// Explainer A: typing, card drop, timeline, YR 10
for (let k = 0; k < 18; k++) add('key', Math.round(146 + (k * 26) / 18), 0.16);
add('whoosh', 162, 0.22); add('impact', 167, 0.2);
add('shimmer', 182, 0.18); add('ding', 206, 0.32);
// Homeowner card + key
add('whoosh', 243, 0.3); add('impact', 258, 0.3); add('shimmer', 256, 0.25);
// Calendar → click 23 → card → Get started
add('pop', 330, 0.28); add('click', 336, 0.55); add('swell', 344, 0.32); add('shimmer', 345, 0.2); add('click', 356, 0.55);
// Explainer B: card develops, ribbon
add('whoosh', 383, 0.22); add('shimmer', 384, 0.3); add('impact', 385, 0.18);
// $$$ drops + "pricey" hit
[516, 519, 522].forEach((t) => add('impact', t + 6, 0.22));
add('impact', 539, 0.38);

export const Sfx: React.FC = () => (
  <>
    {cues.map(([n, at, g], i) => {
      const from = Math.max(0, Math.round(at - peaks[n] * FPS));
      return (
        <Sequence key={i} from={from} layout="none">
          <Audio src={staticFile(`sfx/${n}.wav`)} volume={g * SFX_GAIN} />
        </Sequence>
      );
    })}
  </>
);
