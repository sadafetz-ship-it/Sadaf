import React from 'react';
import {AbsoluteFill, continueRender, delayRender, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './Captions';
import {BeamReveal, ExplainA, ExplainB, FlashCut} from './Explainers';
import {cl, prog} from './fx';
import {Sfx} from './Sfx';
import {EdgeFlash, TalkOverlays} from './Talk';
import {CUT, DURATION} from './theme';

// Fonts (Inter variable w/ opsz, Allura, Antonio) — wait for them before rendering frames.
const fontHandle = delayRender('fonts');
const faces = [
  new FontFace('Inter', `url(${staticFile('fonts/inter.woff2')})`, {weight: '100 900'}),
  new FontFace('Allura', `url(${staticFile('fonts/allura.woff2')})`),
  new FontFace('Antonio', `url(${staticFile('fonts/antonio.woff2')})`, {weight: '700'}),
];
Promise.all(faces.map((ff) => ff.load())).then((ls) => { ls.forEach((l) => document.fonts.add(l)); continueRender(fontHandle); });

/** Camera: slow push per talking stretch, 4 f punch-ins on key words, zoom-blur on cuts back to the speaker. */
const camera = (f: number) => {
  const segs: [number, number][] = [[0, CUT.explainA], [CUT.talkB, CUT.explainB], [CUT.talkC, DURATION]];
  let s = 1;
  for (const [a, b] of segs) if (f >= a && f < b) s = 1 + 0.035 * ((f - a) / (b - a));
  const punch = (at: number, until: number) => (f >= at && f < until ? 0.05 * prog(f, at, at + 4) : 0);
  s += punch(103, CUT.explainA) + punch(357, CUT.explainB) + punch(497, 516);
  let blur = 0;
  for (const c of [CUT.talkB, CUT.talkC]) if (f >= c && f < c + 5) { const p = prog(f, c, c + 5); s *= 1.12 - 0.12 * p; blur = 28 * (1 - p); }
  return {transform: `scale(${s})`, filter: blur ? `blur(${blur}px)` : undefined, transformOrigin: '960px 320px'};
};

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [CUT.fadeOut, DURATION - 1], [0, 1], cl);
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: 'Inter', fontVariationSettings: "'opsz' 32", overflow: 'hidden'}}>
      <AbsoluteFill style={camera(f)}>
        <OffthreadVideo src={staticFile('raw.mp4')} />
        {/* Golden Hour grade: warm soft-light + vignette */}
        <AbsoluteFill style={{background: '#ff9a3c', mixBlendMode: 'soft-light', opacity: 0.28}} />
        <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 35%,rgba(0,0,0,0) 50%,rgba(14,6,0,.6) 100%),linear-gradient(180deg,rgba(255,150,60,.08),rgba(40,12,0,.18) 70%,rgba(10,4,0,.45))'}} />
      </AbsoluteFill>
      <TalkOverlays />
      {/* explainers use absolute frames, so they are mounted by range (not <Sequence>, which re-bases useCurrentFrame) */}
      {f >= CUT.explainA && f < CUT.talkB ? <BeamReveal at={CUT.explainA}><ExplainA /></BeamReveal> : null}
      {f >= CUT.explainB && f < CUT.talkC ? <BeamReveal at={CUT.explainB}><ExplainB /></BeamReveal> : null}
      <FlashCut at={CUT.talkB} />
      <FlashCut at={CUT.talkC} />
      <EdgeFlash at={538} />
      <Captions />
      <AbsoluteFill style={{background: '#000', opacity: fade}} />
      <Sfx />
    </AbsoluteFill>
  );
};
