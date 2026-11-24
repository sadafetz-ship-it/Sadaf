import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {C, cl, p, eio, fontFace} from './theme';
import {Captions} from './Captions';
import {TopWord} from './TopWord';
import {Tile, FundCard, TestCard, CtaCard} from './UI';
import {Sfx} from './Sfx';
import {World, sceneEnv, PBLPage, GlowCards, ContentFlow, RemoteScene, BeamWipe, GaugeScene, Orbit, KeyScene} from './Explainers';

const BLOCKS: [number, number][] = [[48, 147], [162, 327], [459, 648], [867, 936]];
const TALK: [number, number][] = [[0, 48], [147, 162], [327, 459], [648, 867], [936, 1230]];
const PUNCH = [24, 377, 659, 1161];
const FACE = {x: 540, y: 660};

const camera = (f: number) => {
  const seg = TALK.find(([a, b]) => f >= a && f < b) || [0, 1230];
  const push = 0.035 * p(f, seg[0], seg[1] - seg[0], eio);
  let punch = 0;
  for (const k of PUNCH) punch = Math.max(punch, interpolate(f, [k, k + 4, k + 16, k + 26], [0, 0.05, 0.05, 0], cl));
  // zoom-blur when cutting back from an explainer
  let zb = 0;
  for (const [, b] of BLOCKS) zb = Math.max(zb, interpolate(f, [b - 1, b + 5], [1, 0], cl) * (f >= b - 1 ? 1 : 0));
  return {scale: 1 + push + punch + 0.12 * zb, blur: 28 * zb};
};

const inBlock = (f: number) => BLOCKS.some(([a, b]) => f >= a && f < b);

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camera(f);
  const fadeEnd = interpolate(f, [1218, 1229], [0, 1], cl);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <style>{fontFace}</style>
      {/* talking head (audio always on) */}
      <AbsoluteFill style={{transform: `scale(${cam.scale})`, transformOrigin: `${FACE.x}px ${FACE.y}px`, filter: cam.blur > 0.3 ? `blur(${cam.blur}px)` : undefined}}>
        <OffthreadVideo src={staticFile('raw.mp4')} style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
      {!inBlock(f) && <>
        <AbsoluteFill style={{background: C.olive, mixBlendMode: 'soft-light', opacity: 0.35}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(23,32,13,.35) 0%,rgba(23,32,13,0) 24%,rgba(23,32,13,0) 48%,rgba(10,14,6,.82) 78%,rgba(10,14,6,.94) 100%)'}} />
        {/* talk overlays (all outside the face zone x360–760 / y330–1010) */}
        <TopWord left="Meet" leftAt={4} right="CEO" rightAt={16} big="Ava" at={24} out={42} top={75} size={230} seed={3} />
        <TestCard />
        <TopWord left="Who is" leftAt={659} right="for?" rightAt={667} big="THIS JOB" at={665} out={692} top={110} size={170} seed={13} />
        <Tile n={1} at={698} x={60} y={560} rot={-8} out={860} />
        <FundCard title={['Edit in the', 'style of']} at={704} out={860}
          items={[{t: 'Hormozi', f: 757}, {t: 'Ali Abdaal', f: 794}, {t: 'Codie Sanchez', f: 823}, {t: '+ way more', f: 848}]} />
        <Tile n={1} at={938} x={50} y={540} rot={-12} dim={f >= 1001 ? 0.4 : 0.55} out={1146} />
        <Tile n={2} at={940} x={f >= 1001 ? 65 : 80} y={f >= 1001 ? 560 : 575} rot={f >= 1001 ? -7 : -4} dim={f >= 1001 ? 0.6 : 1} out={1146} />
        <Tile n={3} at={1003} x={90} y={595} rot={2} out={1146} />
        <FundCard title={['What you', 'get here']} at={938} out={994}
          items={[{t: 'Consistency', f: 944}, {t: 'Security', f: 950}, {t: 'Long-term job', f: 973}]} />
        <FundCard title={['Someone', 'who is']} at={1005} out={1146}
          items={[{t: 'On time, always', f: 1065}, {t: 'Dependable', f: 1089}, {t: 'Very organized', f: 1127}]} />
        <TopWord left="Is this" leftAt={1154} right="?" rightAt={1161} big="YOU" at={1161} out={1240} top={75} size={230} seed={21} />
        <CtaCard />
      </>}
      {/* explainer blocks */}
      {f >= 48 && f < 147 && <AbsoluteFill style={sceneEnv(f, 48, 147)}><World /><PBLPage /></AbsoluteFill>}
      {f >= 162 && f < 327 && <AbsoluteFill style={sceneEnv(f, 162, 327)}><World />
        {f < 264 && <AbsoluteFill style={{opacity: 1 - p(f, 256, 6), filter: f > 256 ? `blur(${20 * p(f, 256, 6)}px)` : undefined}}>
          <GlowCards /><TopWord left="we're" leftAt={169} right="hiring" rightAt={240} big="EDITORS" at={246} out={300} top={210} size={200} seed={8} on="dark" /></AbsoluteFill>}
        {f >= 258 && <AbsoluteFill style={{opacity: p(f, 258, 6), background: '#000'}}><ContentFlow /></AbsoluteFill>}
      </AbsoluteFill>}
      {f >= 459 && f < 648 && <AbsoluteFill style={sceneEnv(f, 459, 648)}><World />
        {f < 537 && <AbsoluteFill style={{opacity: 1 - p(f, 531, 6), transform: `scale(${1 + 0.08 * p(f, 531, 6)})`}}><RemoteScene src="" /></AbsoluteFill>}
        {f >= 531 && f < 618 && <AbsoluteFill style={{opacity: p(f, 531, 6) * (1 - p(f, 612, 6))}}><GaugeScene /></AbsoluteFill>}
        {f >= 612 && <AbsoluteFill style={{opacity: p(f, 612, 6)}}><Orbit /></AbsoluteFill>}
      </AbsoluteFill>}
      {f >= 867 && f < 936 && <AbsoluteFill style={sceneEnv(f, 867, 936)}><World /><KeyScene />
        <Tile n={2} at={883} x={110} y={900} rot={-6} size={150} /></AbsoluteFill>}
      <BeamWipe at={453} />
      <Sfx />
      <Captions hide={[[612, 867], [936, 1150]]} />
      <AbsoluteFill style={{background: '#000', opacity: fadeEnd}} />
    </AbsoluteFill>
  );
};
