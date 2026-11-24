// Music bed under the whole edit, ducked word by word (transcript-driven), faded with the picture at the end.
// Track: "Happiness" by BlackBadBlood (CC BY 3.0) https://www.jamendo.com/track/1235794 — credit required in the caption.
// The excerpt in public/music is loudness-normalised to −16 LUFS; SYNC is the point in it that lines up with video t=0
// (puts the HOME hit on a downbeat).
import React, {useMemo} from 'react';
import {Audio, staticFile} from 'remotion';
import {WORDS} from './words';
import {CUT, DURATION, FPS} from './theme';

export const MUSIC = {file: 'music/happiness.mp3', sync: 10.0};
const SPEECH = 0.15; // gain while you talk (≈ −16 dB → about 11 dB under the voice)
const GAP = 0.3; // gain in breaths / pauses (lifts ≈ +6 dB)
const IN = 8; // fade-in frames

export const Music: React.FC = () => {
  const curve = useMemo(() => {
    const talk = new Array(DURATION).fill(false);
    WORDS.forEach(([, s, e]) => { for (let f = Math.max(0, s - 2); f <= Math.min(DURATION - 1, e + 2); f++) talk[f] = true; });
    const out: number[] = []; let g = SPEECH;
    for (let f = 0; f < DURATION; f++) {
      const tgt = talk[f] ? SPEECH : GAP;
      g += (tgt - g) * (tgt < g ? 0.45 : 0.18); // fast duck, slower lift
      const fadeIn = Math.min(1, f / IN);
      const fadeOut = f < CUT.fadeOut ? 1 : Math.max(0, 1 - (f - CUT.fadeOut) / (DURATION - CUT.fadeOut));
      out.push(g * fadeIn * fadeOut);
    }
    return out;
  }, []);
  return <Audio src={staticFile(MUSIC.file)} startFrom={Math.round(MUSIC.sync * FPS)} volume={(f) => curve[Math.min(curve.length - 1, f)]} />;
};
