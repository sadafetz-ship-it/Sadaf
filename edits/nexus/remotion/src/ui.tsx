import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {C, FONT, metallic} from './theme';
import {pop, tw} from './timing';

/** Rounded "+" sparkle (the yellow + of the reference, recoloured). Pops in, then slowly rotates / twinkles. */
export const Plus: React.FC<{x: number; y: number; size: number; color?: string; at: number; rot?: number}> = ({
  x, y, size, color = C.rose, at, rot = 0,
}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 6);
  const tw_ = 0.75 + 0.25 * Math.sin((frame - at) / 9);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      style={{position: 'absolute', left: x, top: y, transform: `scale(${s}) rotate(${rot + (frame - at) * 0.6}deg)`,
        opacity: s > 0 ? tw_ : 0, filter: `drop-shadow(0 0 10px ${color})`, zIndex: 20}}>
      <path d="M12 3v18M3 12h18" stroke={color} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
};

export const Dot: React.FC<{at: number; size?: string}> = ({at, size = '0.16em'}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 6);
  return (
    <span style={{display: 'inline-block', width: size, height: size, borderRadius: '50%', background: C.rose,
      boxShadow: `0 0 18px ${C.rose}`, marginLeft: '0.04em', transform: `scale(${s})`, WebkitTextFillColor: 'initial'}} />
  );
};

export const glass = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: 'absolute', borderRadius: 48, overflow: 'hidden',
  background: 'linear-gradient(180deg,rgba(22,33,63,.55),rgba(11,18,38,.9))',
  border: '2px solid rgba(181,243,255,.28)', borderBottomColor: 'rgba(242,252,255,.8)',
  boxShadow: '0 50px 90px -45px rgba(181,243,255,.9),0 0 80px rgba(63,224,255,.25),inset 0 1px 0 rgba(242,252,255,.18)',
  backdropFilter: 'blur(28px) saturate(140%)',
  ...extra,
});

/** Pooled light at the bottom edge of a glass card. */
export const BottomGlow: React.FC<{c1?: string; c2?: string; strength?: number}> = ({c1 = C.lilac, c2 = 'rgba(63,224,255,.6)', strength = 1}) => (
  <div style={{position: 'absolute', left: '-10%', right: '-10%', bottom: 0, height: '60%', opacity: strength, pointerEvents: 'none',
    background: `radial-gradient(55% 60% at 50% 115%,#F2FCFF 0%,${c1} 20%,${c2} 45%,transparent 80%)`}} />
);

export const CardGrid: React.FC = () => (
  <div style={{position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(rgba(181,243,255,.07) 2px,transparent 2px),linear-gradient(90deg,rgba(181,243,255,.07) 2px,transparent 2px)',
    backgroundSize: '60px 60px', WebkitMaskImage: 'linear-gradient(180deg,transparent,#000 60%)'}} />
);

/** Card entrance: up 120 px, scale .94 → 1, blur 30 → 0 (10 f expo-out). */
export const cardIn = (frame: number, at: number, dur = 10): React.CSSProperties => ({
  opacity: tw(frame, at, dur * 0.6, 0, 1),
  transform: `translateY(${tw(frame, at, dur, 120, 0)}px) scale(${tw(frame, at, dur, 0.94, 1)})`,
  filter: `blur(${tw(frame, at, dur, 30, 0)}px)`,
});

export const Metallic: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <span style={{background: metallic, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', ...style}}>{children}</span>
);

/** Dark explainer world: ink gradient, coloured light pools, faint grid, drifting particles. */
export const ExplainerBG: React.FC<{seed: number}> = ({seed}) => {
  const frame = useCurrentFrame();
  const pts = new Array(30).fill(0).map((_, i) => {
    const x = random(`x${seed}${i}`) * 1080, y0 = 120 + random(`y${seed}${i}`) * 1250;
    const sz = [4, 5, 6, 8][Math.floor(random(`s${seed}${i}`) * 4)];
    const col = [C.mist, C.lilac, C.violet, C.blue][Math.floor(random(`c${seed}${i}`) * 4)];
    const y = y0 - frame * (0.4 + random(`v${seed}${i}`) * 0.8);
    const o = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(frame / 12 + i));
    return <div key={i} style={{position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: '50%', background: col, opacity: o, boxShadow: `0 0 ${sz * 3}px ${col}`}} />;
  });
  const drift = Math.sin(frame / 40) * 30;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(60% 34% at ${50 + drift / 20}% 34%,rgba(88,48,230,.55),rgba(60,30,170,.22) 55%,transparent 80%),
        radial-gradient(40% 25% at 85% ${78 - drift / 15}%,rgba(63,224,255,.10),transparent 70%),
        linear-gradient(180deg,#0d0b16,#07060b)`}} />
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(181,243,255,.06) 2px,transparent 2px),linear-gradient(90deg,rgba(181,243,255,.06) 2px,transparent 2px)',
        backgroundSize: '72px 72px', backgroundPosition: `0 ${-frame * 0.5}px`, WebkitMaskImage: 'radial-gradient(70% 55% at 50% 40%,#000,transparent)'}} />
      {pts}
      <AbsoluteFill style={{background: 'linear-gradient(180deg,transparent 60%,rgba(7,6,11,.85) 80%)'}} />
    </AbsoluteFill>
  );
};

/** Explainer header: mono kicker + metallic title with rose dot. Title lands with scale 1.2 → 1 + blur. */
export const XHead: React.FC<{k: string; title: string; at?: number}> = ({k, title, at = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', zIndex: 10}}>
      <div style={{font: `600 30px ${FONT.mono}`, letterSpacing: 3, color: C.lilac, opacity: tw(frame, at + 2, 8, 0, 1),
        transform: `translateY(${tw(frame, at + 2, 8, 12, 0)}px)`}}>{k}</div>
      <div style={{font: `700 112px ${FONT.display}`, letterSpacing: -5, lineHeight: 1, marginTop: 14,
        transform: `scale(${tw(frame, at, 6, 1.2, 1)})`, filter: `blur(${tw(frame, at, 6, 24, 0)}px) drop-shadow(0 0 26px rgba(63,224,255,.6))`,
        opacity: tw(frame, at, 4, 0, 1)}}>
        <Metallic>{title}</Metallic><Dot at={at + 5} />
      </div>
    </div>
  );
};

/** SVG path that draws on with progress p (0..1). */
export const DrawPath: React.FC<{d: string; p: number; stroke: string; width: number; glow?: string; marker?: string}> = ({d, p, stroke, width, glow, marker}) => (
  <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" pathLength={1}
    strokeDasharray={1} strokeDashoffset={1 - p} markerEnd={p > 0.97 ? marker : undefined}
    style={{filter: glow ? `drop-shadow(0 0 12px ${glow})` : undefined}} />
);

export const Chip: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <span style={{padding: '10px 24px', borderRadius: 999, background: 'rgba(181,243,255,.14)', border: '1.5px solid rgba(181,243,255,.3)',
    color: C.mist, font: `600 27px ${FONT.ui}`, display: 'inline-flex', alignItems: 'center', ...style}}>
    <span style={{width: 13, height: 13, borderRadius: '50%', background: C.rose, boxShadow: `0 0 12px ${C.rose}`, marginRight: 13}} />
    {children}
  </span>
);

export const flash = (frame: number, at: number) => interpolate(frame, [at - 1, at, at + 3], [0, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
