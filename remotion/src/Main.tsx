import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Captions} from './Captions';
import {CoinGlassScene, CtaScene, DefiLlamaScene, EntryExitScene, FarsideScene, FlowsScene, RecapScene} from './Explainers';
import {Talk} from './Talk';
import {C} from './theme';
import {f, RECAP_LEN, SPEECH_END, SWITCHES} from './timing';
import {flash} from './ui';

loadFont({family: 'Allura', url: staticFile('allura-latin-400-normal.woff2')});

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const flashO = Math.max(...SWITCHES.map((t) => flash(frame, f(t))));
  return (
    <AbsoluteFill style={{background: C.ink, fontFamily: 'Inter, sans-serif', color: C.mist}}>
      {frame < f(SPEECH_END) && <Talk />}
      <DefiLlamaScene />
      <CoinGlassScene />
      <FlowsScene />
      <EntryExitScene />
      <CtaScene />
      <FarsideScene />
      <RecapScene start={SPEECH_END} end={SPEECH_END + RECAP_LEN} />
      <Captions />
      {/* 2 f lilac flash on every mode switch */}
      <AbsoluteFill style={{background: C.lilac, opacity: flashO, mixBlendMode: 'screen', pointerEvents: 'none'}} />
      <Audio src={staticFile('raw.mp4')} endAt={f(SPEECH_END)}
        volume={(fr) => interpolate(fr, [f(SPEECH_END) - 5, f(SPEECH_END)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
    </AbsoluteFill>
  );
};
