import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Captions} from './Captions';
import {LadderScene, LinkScene} from './Explainers';
import {Sfx} from './Sfx';
import {Talk} from './Talk';
import {C} from './theme';
import {f, SPEECH_END, SWITCHES, TOTAL_FRAMES} from './timing';
import {flash} from './ui';

loadFont({family: 'Allura', url: staticFile('fonts/allura-latin-400-normal.woff2')});
for (const w of ['300', '400', '500', '600', '700', '800']) loadFont({family: 'Inter', url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w});

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const flashO = Math.max(...SWITCHES.map((t) => flash(frame, f(t))));
  return (
    <AbsoluteFill style={{background: '#07060b', fontFamily: 'Inter, sans-serif', color: C.mist}}>
      <Talk />
      <LinkScene />
      <LadderScene />
      <Captions />
      {/* soft 2 f flash on every cut */}
      <AbsoluteFill style={{background: C.lilac, opacity: flashO * 0.4, mixBlendMode: 'screen', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: '#07060b', opacity: interpolate(frame, [TOTAL_FRAMES - 12, TOTAL_FRAMES - 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Sfx />
      <Audio src={staticFile('raw.mp4')} endAt={f(SPEECH_END) + 2} />
    </AbsoluteFill>
  );
};
