import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile} from 'remotion';
import {SCALE, useCurrentFrame} from './frame';
import {loadFont} from '@remotion/fonts';
import {Captions} from './Captions';
import {CoinGlassScene, CtaScene, DefiLlamaScene, EntryExitScene, FlowsScene} from './Explainers';
import {Sfx} from './Sfx';
import {Talk} from './Talk';
import {C} from './theme';
import {f, SPEECH_END, SWITCHES, TOTAL_FRAMES} from './timing';
import {flash} from './ui';

loadFont({family: 'Allura', url: staticFile('allura-latin-400-normal.woff2')});

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const flashO = Math.max(...SWITCHES.map((t) => flash(frame, f(t))));
  return (
    <AbsoluteFill style={{background: C.ink, fontFamily: 'Inter, sans-serif', color: C.mist}}>
      <Talk />
      <DefiLlamaScene />
      <CoinGlassScene />
      <FlowsScene />
      <EntryExitScene />
      <CtaScene />
      <Captions />
      {/* soft 2 f flash on every cut */}
      <AbsoluteFill style={{background: C.lilac, opacity: flashO * 0.5, mixBlendMode: 'screen', pointerEvents: 'none'}} />
      {/* fade to ink at the very end */}
      <AbsoluteFill style={{background: C.ink, opacity: interpolate(frame, [TOTAL_FRAMES - 12, TOTAL_FRAMES - 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Sfx />
      <Audio src={staticFile('raw.mp4')} endAt={f(SPEECH_END) * SCALE}
        volume={(fr) => interpolate(fr / SCALE, [f(SPEECH_END) - 5, f(SPEECH_END)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
    </AbsoluteFill>
  );
};
