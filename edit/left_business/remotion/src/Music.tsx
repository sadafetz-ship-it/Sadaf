// Music bed with word-following ducking. Set MUSIC.file (in public/music/) to enable; null = no music.
// The song section starts at `startSec`; `alignSec` (a moment in the song, e.g. the swell) is placed on `alignFrame`.
import React from 'react';
import {Audio, getInputProps, interpolate, staticFile} from 'remotion';
import {WORDS} from './words';
import {CUT, DURATION, FPS} from './theme';

export const MUSIC: {file: string | null; alignSec: number; alignFrame: number; gap: number; under: number} = {
  file: null, // e.g. 'music/cornfield_chase.mp3'
  alignSec: 0, // second in the song where its swell / hook lands
  alignFrame: CUT.switchAt, // lands on "switch" (0:22.07), when the colour comes back
  gap: 0.34, // level between phrases
  under: 0.12, // level under the voice
};

// voice activity per frame from the word timings (4 f attack, 10 f release)
const ACTIVE = new Float32Array(DURATION);
for (const [, s, e] of WORDS) for (let f = Math.max(0, s - 4); f < Math.min(DURATION, e + 10); f++) ACTIVE[f] = 1;
const SMOOTH = new Float32Array(DURATION);
let v = 0;
for (let f = 0; f < DURATION; f++) { v += (ACTIVE[f] - v) * (ACTIVE[f] > v ? 0.35 : 0.12); SMOOTH[f] = v; }

// Render-time override: --props='{"music":"music/x.mp3","alignSec":81.2,"gap":0.34,"under":0.12}'
const P = getInputProps() as {music?: string; alignSec?: number; gap?: number; under?: number};
if (P.music) { MUSIC.file = P.music; MUSIC.alignSec = P.alignSec ?? 0; if (P.gap) MUSIC.gap = P.gap; if (P.under) MUSIC.under = P.under; }

export const Music: React.FC = () => {
  if (!MUSIC.file) return null;
  const startSec = MUSIC.alignSec - MUSIC.alignFrame / FPS;
  const trim = Math.max(0, Math.round(startSec * FPS));
  return (
    <Audio src={staticFile(MUSIC.file)} startFrom={trim}
      volume={(f) => {
        const duck = MUSIC.gap + (MUSIC.under - MUSIC.gap) * SMOOTH[Math.min(DURATION - 1, f)];
        const fadeIn = interpolate(f, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
        const fadeOut = interpolate(f, [CUT.fadeOut - 20, DURATION - 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return duck * fadeIn * fadeOut;
      }} />
  );
};
