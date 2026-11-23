import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from './theme';
import {f, tw} from './timing';
import {BottomGlow, CardGrid, DrawPath, ExplainerBG} from './ui';
import {Comet, GLOW, GLOW_FILL, glowReveal, ScriptPixels, whipIn} from './CardFx';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const gold: React.CSSProperties = {background: GLOW_FILL, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'};
const node: React.CSSProperties = {
  position: 'absolute', borderRadius: 48, overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'linear-gradient(180deg,#16213F,#0B1226 55%,#080D1C)', border: '2px solid rgba(181,243,255,.55)', color: C.mist,
  boxShadow: '0 30px 60px -20px rgba(63,224,255,.45), inset 0 -3px 0 rgba(181,243,255,.8)',
};

/** Full-background scene for [start, end): entry scale 1.12 → 1, blur 28 → 0 (5 f). Room-matched purple world. */
const SceneWrap: React.FC<{start: number; end: number; seed: number; children: React.ReactNode}> = ({start, end, seed, children}) => {
  const frame = useCurrentFrame();
  const a = f(start);
  if (frame < a || frame >= f(end)) return null;
  return (
    <AbsoluteFill style={{transform: `scale(${tw(frame, a, 5, 1.12, 1)})`, filter: `blur(${tw(frame, a, 5, 28, 0)}px)`}}>
      <ExplainerBG seed={seed} />
      {children}
    </AbsoluteFill>
  );
};

// ───────── "Nexus is the link between online business and the creator economy." (3.5 – 6.9) ─────────
export const LinkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const L = 'M260 560 C 260 760, 540 700, 540 860', R = 'M820 560 C 820 760, 540 700, 540 860';
  // NEXUS node: ghost → sharp on "Nexus" (line-path recipe)
  const n = f(3.64);
  const sharp = tw(frame, n, 10, 0, 1);
  const pL = tw(frame, f(5.18), 16, 0, 1, Easing.inOut(Easing.cubic));
  const pR = tw(frame, f(6.0), 12, 0, 1, Easing.inOut(Easing.cubic));
  const nodeGlow = interpolate(frame, [f(6.12), f(6.12) + 3, f(6.12) + 14], [0, 1, 0.35], cl);
  return (
    <SceneWrap start={3.5} end={6.9} seed={11}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g style={{filter: `drop-shadow(0 0 10px ${C.violet})`}}>
          <DrawPath d={L} p={pL} stroke={C.lilac} width={5} />
          <DrawPath d={R} p={pR} stroke={C.lilac} width={5} />
        </g>
      </svg>
      <Comet d={L} at={f(5.18)} dur={16} />
      <Comet d={R} at={f(6.0)} dur={12} />
      {/* pills whip in on their words */}
      <div style={{...node, left: 60, top: 420, width: 400, height: 130, ...whipIn(frame, f(4.8) - 1, {from: -1, rot: 2})}}>
        <span style={{position: 'relative', font: `600 44px ${FONT.display}`, letterSpacing: -2}}>Online business</span>
      </div>
      <div style={{...node, left: 620, top: 420, width: 400, height: 130, ...whipIn(frame, f(5.94) - 1, {from: 1, rot: -2})}}>
        <span style={{position: 'relative', font: `600 44px ${FONT.display}`, letterSpacing: -2}}>Creator economy</span>
      </div>
      <div style={{...node, left: 340, top: 860, width: 400, height: 150, borderColor: C.violet,
        opacity: interpolate(frame, [n, n + 2], [0, 1], cl) * (0.4 + 0.6 * sharp), filter: `blur(${14 * (1 - sharp)}px)`,
        transform: `scale(${0.88 + 0.12 * sharp})`,
        boxShadow: `${node.boxShadow}, 0 0 ${50 + 60 * nodeGlow}px rgba(63,224,255,${0.6 + 0.4 * nodeGlow})`}}>
        <CardGrid /><BottomGlow c1={C.lilac} c2="rgba(63,224,255,.5)" strength={0.8} />
        <span style={{position: 'relative', font: `600 64px ${FONT.display}`, letterSpacing: -2, filter: GLOW, ...gold}}>NEXUS</span>
      </div>
    </SceneWrap>
  );
};

// ───────── Tier chart: Launchpad / Pro / Mastery, Mastery shoots up to $10M (23.1 – end) ─────────
const fmt = (v: number) => (v >= 1e6 ? `$${(v / 1e6).toFixed(v >= 9.95e6 ? 0 : 1)}M` : `$${Math.round(v / 1e3)}K`);

export const LadderScene: React.FC = () => {
  const frame = useCurrentFrame();
  const BASE = 1180;
  const bars: {lab: string; rng: string; h: number; at: number}[] = [
    {lab: 'LAUNCHPAD', rng: '$0–10K', h: 170, at: f(23.36)},
    {lab: 'PRO', rng: '$10K–50K', h: 340, at: f(23.84)},
    {lab: 'MASTERY', rng: '$50K–$10M', h: 620, at: f(25.06)},
  ];
  const climb = f(26.14), land = f(27.32);
  const climbP = interpolate(frame, [climb, land], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  // counter: $50K on "$50,000", then log-scale climb to $10M, landing on "million"
  const val = frame < climb ? 5e4 : Math.exp(Math.log(5e4) + (Math.log(1e7) - Math.log(5e4)) * climbP);
  const cAt = f(25.06);
  const landed = frame >= land;
  return (
    <SceneWrap start={23.1} end={28.8} seed={23}>
      {bars.map((b, i) => {
        const x = 110 + i * 300;
        const hero = i === 2;
        const grow = tw(frame, b.at, 12, 0, 1, Easing.out(Easing.cubic));
        const h = hero ? b.h * (0.55 * grow + 0.45 * climbP) : b.h * grow;
        const gr = glowReveal(frame, b.at);
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: x, top: BASE - h, width: 240, height: h, borderRadius: '30px 30px 8px 8px',
              border: '2px solid rgba(181,243,255,.5)', opacity: gr.style.opacity,
              background: hero ? `linear-gradient(180deg,${C.violet},${C.blue} 65%,#16213F)` : 'linear-gradient(180deg,#2A3A70,#16213F)',
              boxShadow: hero ? `0 0 ${60 + 40 * climbP}px rgba(63,224,255,.6)` : 'none'}} />
            <div style={{position: 'absolute', left: x, top: BASE + 20, width: 240, textAlign: 'center', font: `500 26px ${FONT.ui}`,
              letterSpacing: '.1em', color: C.lilac, opacity: gr.style.opacity}}>{b.lab}</div>
            <div style={{position: 'absolute', left: x - 30, top: BASE - h - 66, width: 300, textAlign: 'center',
              font: `600 ${hero ? 44 : 36}px ${FONT.display}`, letterSpacing: -1, color: '#fff', opacity: tw(frame, b.at + 6, 6, 0, 1)}}>{b.rng}</div>
          </React.Fragment>
        );
      })}
      {/* big counter, top left */}
      {frame >= cAt && (
        <div style={{position: 'absolute', left: 90, top: 200, whiteSpace: 'nowrap', opacity: tw(frame, cAt, 6, 0, 1),
          transform: `scale(${landed ? interpolate(frame, [land, land + 4, land + 9], [1, 1.12, 1], cl) : 1})`, transformOrigin: '0 70%'}}>
          <div style={{position: 'relative', display: 'inline-block', font: `600 150px ${FONT.display}`, letterSpacing: -6, filter: GLOW}}>
            {landed && <ScriptPixels at={land} w={480} h={150} seed="ten-m" size={30} />}
            <span style={gold}>{fmt(val)}</span>
          </div>
          <span style={{font: `300 54px ${FONT.ui}`, color: C.mist}}> /month</span>
        </div>
      )}
    </SceneWrap>
  );
};
