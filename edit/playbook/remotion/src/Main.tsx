// Main composition: camera (slow push, punch-ins around the face, zoom-blur on cuts), light grade B, layering, fonts, voice at 0.88.
import React from 'react';
import {AbsoluteFill, continueRender, delayRender, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './Captions';
import {BeamReveal, FlashCut, Gatekeepers, Growth, Panel} from './Explainers';
import {cl, prog} from './fx';
import {Sfx} from './Sfx';
import {TalkOverlays} from './Talk';
import {DURATION, EX} from './theme';

const fontHandle = delayRender('fonts');
const faces = [
  new FontFace('Inter', `url(${staticFile('fonts/inter.woff2')})`, {weight: '100 900'}),
  new FontFace('Allura', `url(${staticFile('fonts/allura.woff2')})`),
  new FontFace('Antonio', `url(${staticFile('fonts/antonio.woff2')})`, {weight: '700'}),
  new FontFace('Playfair', `url(${staticFile('fonts/playfair700.woff2')})`, {weight: '700'}),
  new FontFace('Playfair', `url(${staticFile('fonts/playfairItalic.woff2')})`, {style: 'italic'}),
];
Promise.all(faces.map((ff) => ff.load())).then((ls) => {
  ls.forEach((l) => document.fonts.add(l));
  continueRender(fontHandle);
});

const TALK: [number, number][] = [[0, EX.gate[0]], [EX.gate[1], EX.growth[0]]];
const PUNCH: [number, number][] = [[49, 64], [262, 285], [635, 668], [999, 1016]];
const camera = (f: number) => {
  let s = 1;
  for (const [a, b] of TALK) if (f >= a && f < b) s = 1 + 0.035 * ((f - a) / (b - a));
  for (const [a, b] of PUNCH) if (f >= a && f < b) s += 0.05 * prog(f, a, a + 8);
  let blur = 0;
  for (const c of [0, EX.gate[1]]) if (f >= c && f < c + 9) { const p = prog(f, c, c + 9); s *= 1.12 - 0.12 * p; blur = 28 * (1 - p); }
  return {transform: `scale(${s})`, filter: blur ? `blur(${blur}px)` : undefined, transformOrigin: '1000px 300px'};
};

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [EX.fadeOut, DURATION - 1], [0, 1], cl);
  const growthOut = prog(f, EX.panel[0] - 6, EX.panel[0] + 2, (t) => t * t);
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: 'Inter', fontVariationSettings: "'opsz' 32", color: '#F3F7FF', overflow: 'hidden'}}>
      <AbsoluteFill style={camera(f)}>
        <OffthreadVideo src={staticFile('raw.mp4')} volume={0.88} style={{filter: 'brightness(.86) contrast(1.06) saturate(.95)'}} />
        {/* light grade B: faint ink wash, soft navy fade behind captions, light edge vignette */}
        <AbsoluteFill style={{background: '#173D70', mixBlendMode: 'color', opacity: 0.14}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg,transparent 55%,rgba(8,24,58,.75) 100%),radial-gradient(ellipse at 50% 40%,transparent 60%,rgba(8,24,58,.35) 100%)'}} />
      </AbsoluteFill>
      <TalkOverlays />
      {f >= EX.gate[0] && f < EX.gate[1] ? <BeamReveal at={EX.gate[0]}><Gatekeepers /></BeamReveal> : null}
      {f >= EX.growth[0] + 22 ? <AbsoluteFill style={{background: '#040A1C'}} /> : null}
      {f >= EX.growth[0] && f < EX.panel[0] + 3 ? (
        <AbsoluteFill style={{transform: `scale(${1 + 0.35 * growthOut})`, filter: `blur(${24 * growthOut}px)`, opacity: 1 - growthOut}}>
          <BeamReveal at={EX.growth[0]}><Growth /></BeamReveal>
        </AbsoluteFill>
      ) : null}
      {f >= EX.panel[0] - 2 ? <AbsoluteFill style={{opacity: interpolate(f, [EX.panel[0] - 2, EX.panel[0] + 3], [0, 1], cl)}}><Panel /></AbsoluteFill> : null}
      <FlashCut at={0} />
      <FlashCut at={EX.gate[1]} />
      <FlashCut at={EX.panel[0]} />
      <Captions />
      <AbsoluteFill style={{background: '#000', opacity: fade, zIndex: 70}} />
      <Sfx />
    </AbsoluteFill>
  );
};
