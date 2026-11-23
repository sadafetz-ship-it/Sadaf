// Main composition: camera, the cold → vivid colour arc (wipe on "switch"), cut-out layering, overlays, captions, progress bar, SFX.
import React from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './Captions';
import {BeamReveal, ExplainA, ExplainB, ExplainC, FlashCut} from './Explainers';
import {cl, easeInOut, prog} from './fx';
import {Sfx} from './Sfx';
import {CTA, EdgeFlash, TalkOverlays} from './Talk';
import {C, CUT, DURATION, FACE, GRAD} from './theme';
import {BehindHook, BehindReveal, FrontHook} from './Titles';

const fontHandle = delayRender('fonts', {timeoutInMilliseconds: 120000});
const F = (fam: string, file: string, weight = '400', style = 'normal') => new FontFace(fam, `url(${staticFile(file)})`, {weight, style});
const faces = [
  F('Inter', 'Inter-Regular.otf', '400'), F('Inter', 'Inter-Medium.otf', '500'), F('Inter', 'Inter-SemiBold.otf', '600'), F('Inter', 'Inter-Bold.otf', '700'),
  F('Inter', 'Inter-ExtraBold.otf', '800'), F('Inter', 'Inter-Black.otf', '900'),
  F('Inter Display', 'InterDisplay-Light.otf', '300'), F('Inter Display', 'InterDisplay-SemiBold.otf', '600'), F('Inter Display', 'InterDisplay-Bold.otf', '700'),
  F('Inter Display', 'InterDisplay-ExtraBold.otf', '800'), F('Allura', 'Allura-Regular.ttf'),
];
Promise.all(faces.map((ff) => ff.load().catch(() => null))).then((ls) => { ls.forEach((l) => l && (document.fonts as unknown as {add: (x: FontFace) => void}).add(l)); continueRender(fontHandle); });

const SW = CUT.switchAt;
const WIPE = 20; // frames for the colour wipe

/** Camera: slow push per talking stretch, punch-ins (scaled around the face) on key words, zoom-blur on cuts back. */
const camera = (f: number) => {
  const segs: [number, number][] = [[0, CUT.explainA], [CUT.talkB, CUT.explainB], [CUT.talkC, CUT.explainC], [CUT.talkD, DURATION]];
  let s = 1;
  for (const [a, b] of segs) if (f >= a && f < b) s = 1 + 0.04 * ((f - a) / (b - a));
  const punch = (at: number, until: number) => (f >= at && f < until ? 0.06 * prog(f, at, at + 8) : 0);
  s += punch(19, 60) + punch(406, CUT.explainB) + punch(609, 623) + punch(673, 703);
  let blur = 0;
  for (const c of [CUT.talkB, CUT.talkC, CUT.talkD]) if (f >= c && f < c + 9) { const p = prog(f, c, c + 9); s *= 1.12 - 0.12 * p; blur = 28 * (1 - p); }
  return {transform: `scale(${s})`, filter: blur ? `blur(${blur}px)` : undefined, transformOrigin: `${FACE.x}px ${FACE.y}px`};
};

/** Grade per era: neutral → cold/desaturated (burnout) → vivid with gradient tube + rim (after the switch). */
const COLD = 'saturate(.28) brightness(.84) contrast(1.12)';
const WARM = 'saturate(1.18) contrast(1.05) brightness(1.04)';
const NEUTRAL = 'saturate(1.02) contrast(1.03)';

const Footage: React.FC<{filter: string; clip?: string}> = ({filter, clip}) => (
  <AbsoluteFill style={{clipPath: clip}}>
    <OffthreadVideo src={staticFile('raw.mp4')} style={{filter}} muted />
  </AbsoluteFill>
);

const WarmExtras: React.FC<{o: number}> = ({o}) => (
  <>
    {/* the real light tube turns blue → magenta */}
    <div style={{position: 'absolute', left: 818, top: 360, width: 118, height: 940, borderRadius: 60, background: 'linear-gradient(180deg,#657EFC,#935DF9 45%,#D35BC5)',
      mixBlendMode: 'color', filter: 'blur(18px)', opacity: 0.95 * o}} />
    <div style={{position: 'absolute', inset: 0, opacity: o, mixBlendMode: 'screen',
      background: 'radial-gradient(40% 55% at 100% 35%,rgba(192,82,233,.42),transparent 70%),radial-gradient(35% 45% at 0% 60%,rgba(101,126,252,.30),transparent 70%)'}} />
  </>
);

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [CUT.fadeOut, DURATION - 1], [0, 1], cl);
  const coldIn = prog(f, CUT.explainA, CUT.explainA + 10);
  const cold = f >= CUT.explainA && f < SW;
  const wiping = f >= SW && f < SW + WIPE;
  const warm = f >= SW;
  const wp = prog(f, SW, SW + WIPE, easeInOut);
  // wipe boundary sweeps right → left, tilted 7°
  const bx = 1180 - 1400 * wp;
  const warmClip = `polygon(${bx}px 0, 1080px 0, 1080px 1920px, ${bx - 236}px 1920px)`;
  const behindHook = f < 162;
  const behindReveal = f >= 744 && f < 830;
  const showCut = (behindHook || behindReveal);
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: 'Inter', overflow: 'hidden'}}>
      <AbsoluteFill style={camera(f)}>
        {!warm ? <Footage filter={cold ? COLD : f < CUT.explainA ? NEUTRAL : COLD} /> : null}
        {cold ? <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(40,60,110,.28),rgba(10,10,30,.35))', mixBlendMode: 'multiply', opacity: coldIn}} /> : null}
        {wiping ? <><Footage filter={COLD} /><Footage filter={WARM} clip={warmClip} /></> : null}
        {warm && !wiping ? <Footage filter={WARM} /> : null}
        {warm ? <WarmExtras o={wiping ? wp : 1} /> : null}
        {behindHook ? <BehindHook /> : null}
        {behindReveal ? <BehindReveal /> : null}
        {showCut ? <AbsoluteFill style={{WebkitMaskImage: 'linear-gradient(180deg,#000 0px,#000 640px,transparent 900px)', maskImage: 'linear-gradient(180deg,#000 0px,#000 640px,transparent 900px)'}}><OffthreadVideo src={staticFile('speaker_cutout.webm')} transparent muted style={{filter: warm ? WARM : NEUTRAL}} /></AbsoluteFill> : null}
        {/* vignette grade drawn over the cut-out too (no seam) */}
        <AbsoluteFill style={{background: 'radial-gradient(120% 70% at 50% 40%,transparent 45%,rgba(3,4,14,.55) 100%),linear-gradient(180deg,rgba(7,10,31,.35) 0%,transparent 18%,transparent 60%,rgba(7,10,31,.78) 100%)'}} />
      </AbsoluteFill>

      {/* the glowing wipe line */}
      {wiping ? <div style={{position: 'absolute', left: bx - 13, top: -40, width: 26, height: 2100, transform: 'rotate(7deg)', transformOrigin: 'top',
        background: 'linear-gradient(180deg,#7FD4FF,#F2EEFF 50%,#D35BC5)', boxShadow: '0 0 30px #fff,0 0 70px #C052E9,0 0 120px #657EFC', opacity: 1 - prog(f, SW + WIPE - 4, SW + WIPE)}} /> : null}

      <FrontHook />
      <TalkOverlays />
      <EdgeFlash at={673} />

      {/* explainers are mounted by frame range (not <Sequence>, which re-bases useCurrentFrame) */}
      {f >= CUT.explainA && f < CUT.talkB ? <BeamReveal at={CUT.explainA}><ExplainA /></BeamReveal> : null}
      {f >= CUT.explainB && f < CUT.talkC ? <BeamReveal at={CUT.explainB}><ExplainB /></BeamReveal> : null}
      {f >= CUT.explainC && f < CUT.talkD ? <BeamReveal at={CUT.explainC}><ExplainC /></BeamReveal> : null}
      <FlashCut at={CUT.talkB} />
      <FlashCut at={CUT.talkC} />
      <FlashCut at={CUT.talkD} />
      <CTA />

      <Captions />

      {/* story progress bar */}
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: `${(f / (DURATION - 1)) * 100}%`, background: GRAD, borderRadius: '0 6px 6px 0',
        boxShadow: `0 0 18px ${C.violet},0 0 30px ${C.orchid}`}}>
        <div style={{position: 'absolute', right: -8, top: -5, width: 20, height: 20, borderRadius: '50%', background: C.mist, boxShadow: '0 0 16px #fff'}} />
      </div>

      <AbsoluteFill style={{background: '#000', opacity: fade}} />
      <Audio src={staticFile('raw.mp4')} volume={0.88} />
      <Sfx />
    </AbsoluteFill>
  );
};
