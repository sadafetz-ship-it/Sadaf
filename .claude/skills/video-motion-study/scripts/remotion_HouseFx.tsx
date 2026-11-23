// From the user's house edit (16:9, Golden Hour accent, Nov 2026). Drop into a Remotion src/ with theme.ts (C, GLASS, HEAVY_FILL, HEAVY_FILTER).
// Helpers: easing, exits, zoomDropIn, whipIn, bloomIn, glassPop, wordIn, pop, InkLine, ScriptPixels, DrawPath (draw-on + flowing highlight), Cursor, Ripple, HouseIcon, GoldKey. Durations = slower house pace.
// Animation recipes (house CardFx, recoloured Golden Hour) + new ones from the reference grid.
import React from 'react';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {C} from './theme';

export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const back = Easing.out(Easing.back(1.6));

/** 0→1 progress between two frames with easing. */
export const prog = (f: number, a: number, b: number, ease: (t: number) => number = easeOut) => ease(interpolate(f, [a, b], [0, 1], cl));

/** Blur-out exit (6 f): scale up slightly, blur, fade. */
export const exitStyle = (f: number, at: number, dur = 10): React.CSSProperties => {
  if (f < at) return {};
  const p = prog(f, at, at + dur, (t) => t * t);
  return {opacity: 1 - p, filter: `blur(${14 * p}px)`, transform: `scale(${1 + 0.04 * p})`};
};

/** "fixes." zoom drop-in: fly in oversized + blurred, settle with tilt (10 f), then gentle bob. */
export const zoomDropIn = (f: number, at: number, o: {rot?: number; dx?: number; dy?: number; from?: number; dur?: number} = {}): React.CSSProperties => {
  const {rot = 0, dx = -120, dy = -160, from = 1.6, dur = 16} = o;
  const p = prog(f, at, at + dur);
  const bob = f > at + dur ? Math.sin((f - at - dur) / 20) * 4 : 0;
  return {
    opacity: interpolate(f, [at, at + 3], [0, 1], cl),
    transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p) + bob}px) scale(${from + (1 - from) * p}) rotate(${rot * p + (rot - 14) * (1 - p)}deg)`,
    filter: `blur(${30 * (1 - p)}px)`,
  };
};

/** "mistake / Life" whip-in: slide from the side with skew + motion blur, overshoot tilt (9 f). */
export const whipIn = (f: number, at: number, o: {from?: 1 | -1; dist?: number; rot?: number; dur?: number} = {}): React.CSSProperties => {
  const {from = -1, dist = 700, rot = -3, dur = 15} = o;
  const p = prog(f, at, at + dur);
  const over = interpolate(f, [at + dur - 4, at + dur + 4, at + dur + 11], [0, 1, 0], cl);
  return {
    opacity: interpolate(f, [at, at + 4], [0, 1], cl),
    transform: `translateX(${from * dist * (1 - p) - from * 18 * over}px) skewX(${-from * 14 * (1 - p)}deg) rotate(${rot * p + rot * 0.6 * over}deg) scale(${1 + 0.08 * (1 - p)})`,
    filter: `blur(${24 * (1 - p)}px)`,
  };
};

/** "Scripts" bloom: blurry bright → sharp (10 f). */
export const bloomIn = (f: number, at: number, dur = 16): React.CSSProperties => {
  const p = interpolate(f, [at, at + dur], [0, 1], cl);
  return {
    opacity: interpolate(f, [at, at + 2], [0, 1], cl),
    filter: `blur(${16 * (1 - easeOut(p))}px) brightness(${1 + 0.6 * (1 - p)})`,
    transform: `scale(${1.08 - 0.08 * easeOut(p)})`,
  };
};

/** Glass pop: scale 0.86 → 1.03 → 1 with blur (8 f). */
export const glassPop = (f: number, at: number, dur = 13): React.CSSProperties => ({
  opacity: interpolate(f, [at, at + 5], [0, 1], cl),
  transform: `scale(${interpolate(f, [at, at + dur * 0.6, at + dur], [0.86, 1.03, 1], cl)})`,
  filter: `blur(${interpolate(f, [at, at + dur], [18, 0], cl)}px)`,
});

/** Word blur-in (5 f): used for small setup words and caption L1 words. */
export const wordIn = (f: number, at: number, dur = 9): React.CSSProperties => {
  const p = prog(f, at, at + dur);
  return {opacity: interpolate(f, [at, at + 4], [0, 1], cl), filter: `blur(${10 * (1 - p)}px)`, transform: `translateY(${12 * (1 - p)}px)`, display: 'inline-block'};
};

/** Pop (scale 0 → 1.15 → 1, 7 f). */
export const pop = (f: number, at: number, dur = 12): React.CSSProperties => ({
  opacity: interpolate(f, [at, at + 2], [0, 1], cl),
  transform: `scale(${interpolate(f, [at, at + dur * 0.6, at + dur], [0, 1.15, 1], cl)})`,
});

/** Thin accent line that drops onto a spot just before a reveal (4 f). */
export const InkLine: React.FC<{x: number; y: number; at: number; h?: number; color?: string}> = ({x, y, at, h = 150, color = C.amber}) => {
  const f = useCurrentFrame();
  if (f < at - 6 || f > at + 4) return null;
  const p = interpolate(f, [at - 6, at], [0, 1], cl);
  return (
    <div style={{position: 'absolute', left: x - 2, top: y - h * (1 - p) - 40, width: 4, height: h * p, background: color, borderRadius: 2,
      boxShadow: `0 0 12px ${color}`, opacity: 1 - interpolate(f, [at, at + 4], [0, 1], cl)}} />
  );
};

const SHAPES = [[[0, 0], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [1, 0], [2, 0], [2, 1]], [[0, 0], [1, 1]], [[0, 0], [0, 1], [1, 0]], [[0, 0], [1, 0], [1, -1], [2, -1]]];

/**
 * "Scripts" pixel clusters: chunky stair-step squares around a box (x, y = top-left; w, h = box size).
 * They pop in with the reveal, jitter one cell every 3 f, flicker, and blink out one by one (life ≈ 18 f).
 */
export const ScriptPixels: React.FC<{at: number; x: number; y: number; w: number; h: number; seed: string; size?: number; life?: number;
  anchors?: [number, number][]; cols?: string[]; glow?: boolean}> = ({at, x, y, w, h, seed, size = 28, life = 28, anchors, cols, glow = false}) => {
  const f = useCurrentFrame();
  if (f < at - 2 || f > at + life) return null;
  const COLS = cols ?? ['#FFB21A', '#F0913A', C.ember, '#FFD36B', '#FFE9B8'];
  const A = anchors ?? [[-0.06, -0.18], [0.94, -0.3], [1.02, 0.78], [-0.04, 0.98], [0.62, 1.08], [0.34, -0.36]];
  const cells: React.ReactNode[] = [];
  A.forEach(([ax, ay], k) => {
    const shape = SHAPES[Math.floor(random(`${seed}s${k}`) * SHAPES.length)];
    const jitter = Math.floor((f - at) / 5);
    shape.forEach(([gx, gy], j) => {
      const id = `${seed}${k}-${j}`;
      const born = at - 1 + Math.floor(random(`${id}b`) * 7);
      const dies = at + 12 + Math.floor(random(`${id}d`) * (life - 12));
      if (f < born || f > dies) return;
      const jx = (random(`${id}x${jitter}`) > 0.72 ? (random(`${id}dir`) > 0.5 ? 1 : -1) : 0) * size;
      const col = COLS[Math.floor(random(`${id}c`) * COLS.length)];
      const o = (0.6 + 0.4 * random(`${id}o${Math.floor(f / 4)}`)) * interpolate(f, [dies - 4, dies], [1, 0], cl);
      cells.push(
        <div key={id} style={{position: 'absolute', left: x + ax * w + gx * size + jx, top: y + ay * h + gy * size, width: size - 2, height: size - 2,
          background: col, opacity: o, boxShadow: glow ? `0 0 12px ${col}` : undefined}} />,
      );
    });
  });
  return <>{cells}</>;
};

/** Draw-on SVG path (0→1 over [a,b]); optional continuous flowing dash after. */
export const DrawPath: React.FC<{d: string; a: number; b: number; w?: number; color?: string; glow?: string; style?: React.CSSProperties; flow?: boolean; blur?: number; opacity?: number}> = ({
  d, a, b, w = 6, color = C.amber, glow, style, flow = false, blur = 0, opacity = 1,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, a, b, easeInOut);
  if (p <= 0) return null;
  const flowing = flow && p >= 1;
  const fl = `${blur ? `blur(${blur}px) ` : ''}${glow ?? `drop-shadow(0 0 8px ${C.amber})`}`;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}>
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={flowing ? undefined : `${p} 2`}
        opacity={opacity * (flowing ? 0.75 : 1)} style={{filter: fl}} />
      {flowing ? (
        // bright highlight travelling along the ribbon
        <path d={d} pathLength={1} fill="none" stroke="#FFFFFF" strokeWidth={w * 1.2} strokeLinecap="round" strokeDasharray="0.14 0.86"
          strokeDashoffset={-(((f - b) / 45) % 1)} opacity={opacity} style={{filter: `blur(${blur + 2}px) drop-shadow(0 0 16px ${C.amber})`}} />
      ) : null}
    </svg>
  );
};

/** Cursor arrow. */
export const Cursor: React.FC<{x: number; y: number; press?: number; size?: number; opacity?: number}> = ({x, y, press = 0, size = 54, opacity = 1}) => (
  <svg viewBox="0 0 24 24" width={size} height={size}
    style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - 0.18 * press})`, transformOrigin: '15% 10%', opacity,
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.5))'}}>
    <path d="M3 2l17 8-7 2-3 7z" fill={C.cream} stroke={C.ink} strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

/** Expanding click ripple. */
export const Ripple: React.FC<{x: number; y: number; at: number; r?: number}> = ({x, y, at, r = 70}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 20) return null;
  const p = prog(f, at, at + 20);
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%',
    border: `${4 * (1 - p) + 1}px solid ${C.cream}`, boxShadow: `0 0 18px ${C.amber}`, transform: `scale(${0.3 + 0.9 * p})`, opacity: 1 - p}} />;
};

export const HouseIcon: React.FC<{s: number; color?: string}> = ({s, color = C.ink}) => (
  <svg viewBox="0 0 24 24" width={s} height={s}><path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z" fill={color} /></svg>
);

/** 3D-looking gold key (from "Consistency is the Key"). */
export const GoldKey: React.FC<{w: number; style?: React.CSSProperties}> = ({w, style}) => (
  <svg viewBox="0 0 200 420" width={w} style={style}>
    <defs>
      <linearGradient id="kg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#FFF1B8" /><stop offset=".35" stopColor="#FFC000" /><stop offset=".7" stopColor="#C8741E" /><stop offset="1" stopColor="#6B3410" />
      </linearGradient>
      <linearGradient id="kh" x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,0)" /><stop offset=".5" stopColor="rgba(255,255,255,.75)" /><stop offset="1" stopColor="rgba(255,255,255,0)" /></linearGradient>
    </defs>
    <g style={{filter: 'drop-shadow(0 0 18px rgba(255,170,40,.75)) drop-shadow(0 18px 22px rgba(0,0,0,.5))'}}>
      <circle cx="100" cy="80" r="66" fill="url(#kg)" /><circle cx="100" cy="80" r="30" fill="#2A1508" />
      <circle cx="56" cy="40" r="22" fill="url(#kg)" /><circle cx="144" cy="40" r="22" fill="url(#kg)" /><circle cx="100" cy="18" r="20" fill="url(#kg)" />
      <rect x="86" y="140" width="28" height="220" rx="10" fill="url(#kg)" /><rect x="70" y="150" width="60" height="16" rx="6" fill="url(#kg)" />
      <rect x="114" y="300" width="46" height="22" rx="5" fill="url(#kg)" /><rect x="114" y="336" width="34" height="22" rx="5" fill="url(#kg)" />
    </g>
  </svg>
);
