import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { CameraMotionBlur } from '@remotion/motion-blur';
import '@fontsource/bodoni-moda/400.css';
import '@fontsource/bodoni-moda/400-italic.css';
import '@fontsource/playfair-display/900.css';
import '@fontsource/playfair-display/900-italic.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/special-elite/400.css';
import '@fontsource/caveat/700.css';
import { FilmTexture, FPS } from './lib';
import * as Sc from './scenes';

// Scene cut times (s), cut to the voiceover (see audio/voiceover_lines.tsv).
export const SCENES: [keyof typeof Sc, number, number][] = [
  ['S1', 0, 1.3], ['S2', 1.3, 3.3], ['S3', 3.3, 6.1], ['S4', 6.1, 8.4], ['S5', 8.4, 10.5], ['S6', 10.5, 11.8], ['S7', 11.8, 14.5],
  ['S8', 14.5, 15.3], ['S9', 15.3, 18.2], ['S10', 18.2, 19.95], ['S11', 19.95, 21.6], ['S12', 21.6, 23.6], ['S13', 23.6, 26.6],
  ['S14', 26.6, 30.2], ['S15', 30.2, 32.8], ['S16', 32.8, 35.2], ['S17', 35.2, 38.2], ['S18', 38.2, 44.2], ['S19', 44.2, 45],
];

export const Main: React.FC<{ motionBlur?: boolean; audio?: boolean }> = ({ motionBlur = true, audio = true }) => {
  const body = (
    <AbsoluteFill style={{ background: '#000' }}>
      {SCENES.map(([id, a, b]) => {
        const C = Sc[id] as React.FC<{ g: number }>;
        return (
          <Sequence key={id} from={Math.round(a * FPS)} durationInFrames={Math.round((b - a) * FPS)} name={id}>
            <C g={a} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {motionBlur ? <CameraMotionBlur shutterAngle={180} samples={4}>{body}</CameraMotionBlur> : body}
      <Sequence durationInFrames={Math.round(44.2 * FPS)}><FilmTexture /></Sequence>
      {audio && <Audio src={staticFile('audio/mix.wav')} />}
    </AbsoluteFill>
  );
};
