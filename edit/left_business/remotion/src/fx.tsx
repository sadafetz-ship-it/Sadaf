// Animation helpers (house recipes, slower house pace) recoloured to the blue → violet → magenta accent,
// plus the widget kit from the user's references (rim light, bottom light pool, grid, soft cursor).
import React from 'react';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {C, WIDGET} from './theme';

export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const back = Easing.out(Easing.back(1.6));
export const prog = (f: number, a: number, b: number, ease: (t: number) => number = easeOut) => ease(interpolate(f, [a, b], [0, 1], cl));

/** Blur-out exit (10 f). */
export const exitStyle = (f: number, at: number, dur = 10): React.CSSProperties => {
  if (f < at) return {};
  const p = prog(f, at, at + dur, (t) => t * t);
  return {opacity: 1 - p, filter: `blur(${14 * p}px)`, transform: `scale(${1 + 0.04 * p})`};
};

/** Zoom drop-in: oversized + blurred → settle with tilt (16 f), then 4 px bob. */
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

/** Whip-in from the side with skew + motion blur, overshoot settle (15 f + 11 f). */
export const whipIn = (f: number, at: number, o: {from?: 1 | -1; dist?: number; rot?: number; dur?: number} = {}): React.CSSProperties => {
  const {from = 1, dist = 700, rot = 0, dur = 15} = o;
  const p = prog(f, at, at + dur);
  const over = interpolate(f, [at + dur - 4, at + dur + 4, at + dur + 11], [0, 1, 0], cl);
  return {
    opacity: interpolate(f, [at, at + 4], [0, 1], cl),
    transform: `translateX(${from * dist * (1 - p) - from * 18 * over}px) skewX(${-from * 14 * (1 - p)}deg) rotate(${rot * p + rot * 0.6 * over}deg) scale(${1 + 0.08 * (1 - p)})`,
    filter: `blur(${24 * (1 - p)}px)`,
  };
};

/** Scripts bloom: blurry + bright → sharp (16 f). */
export const bloomIn = (f: number, at: number, dur = 16): React.CSSProperties => {
  const p = interpolate(f, [at, at + dur], [0, 1], cl);
  return {
    opacity: interpolate(f, [at, at + 2], [0, 1], cl),
    filter: `blur(${16 * (1 - easeOut(p))}px) brightness(${1 + 0.6 * (1 - p)})`,
    transform: `scale(${1.08 - 0.08 * easeOut(p)})`,
  };
};

/** Glass pop 0.86 → 1.03 → 1 with blur (13 f). */
export const glassPop = (f: number, at: number, dur = 13): React.CSSProperties => ({
  opacity: interpolate(f, [at, at + 5], [0, 1], cl),
  transform: `scale(${interpolate(f, [at, at + dur * 0.6, at + dur], [0.86, 1.03, 1], cl)})`,
  filter: `blur(${interpolate(f, [at, at + dur], [18, 0], cl)}px)`,
});

/** Word blur-in (9 f). */
export const wordIn = (f: number, at: number, dur = 9): React.CSSProperties => {
  const p = prog(f, at, at + dur);
  return {opacity: interpolate(f, [at, at + 4], [0, 1], cl), filter: `blur(${10 * (1 - p)}px)`, transform: `translateY(${12 * (1 - p)}px)`, display: 'inline-block'};
};

/** Pop 0 → 1.15 → 1 (12 f). */
export const pop = (f: number, at: number, dur = 12): React.CSSProperties => ({
  opacity: interpolate(f, [at, at + 2], [0, 1], cl),
  transform: `scale(${interpolate(f, [at, at + dur * 0.6, at + dur], [0, 1.15, 1], cl)})`,
});

/** Stamp slam: big + blurred → overshoot → settle (10 f). */
export const stamp = (f: number, at: number, rot = -10): React.CSSProperties => ({
  opacity: interpolate(f, [at, at + 2], [0, 1], cl),
  transform: `rotate(${rot}deg) scale(${interpolate(f, [at, at + 5, at + 10], [2.4, 0.92, 1], cl)})`,
  filter: `blur(${interpolate(f, [at, at + 5], [10, 0], cl)}px)`,
});

export const InkLine: React.FC<{x: number; y: number; at: number; h?: number; color?: string}> = ({x, y, at, h = 150, color = C.violet}) => {
  const f = useCurrentFrame();
  if (f < at - 6 || f > at + 4) return null;
  const p = interpolate(f, [at - 6, at], [0, 1], cl);
  return (
    <div style={{position: 'absolute', left: x - 2, top: y - h * (1 - p) - 40, width: 4, height: h * p, background: color, borderRadius: 2,
      boxShadow: `0 0 12px ${color}`, opacity: 1 - interpolate(f, [at, at + 4], [0, 1], cl)}} />
  );
};

const SHAPES = [[[0, 0], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [1, 0], [2, 0], [2, 1]], [[0, 0], [1, 1]], [[0, 0], [0, 1], [1, 0]], [[0, 0], [1, 0], [1, -1], [2, -1]]];
export const PIX_COLS = [C.blue, C.peri, C.violet, C.orchid, C.magenta, '#D8C4FF'];

/** "Scripts" pixel clusters around a box: pop with the reveal, jitter every 5 f, blink out one by one. */
export const ScriptPixels: React.FC<{at: number; x: number; y: number; w: number; h: number; seed: string; size?: number; life?: number;
  anchors?: [number, number][]; cols?: string[]}> = ({at, x, y, w, h, seed, size = 28, life = 32, anchors, cols}) => {
  const f = useCurrentFrame();
  if (f < at - 2 || f > at + life) return null;
  const COLS = cols ?? PIX_COLS;
  const A = anchors ?? [[-0.06, -0.18], [0.94, -0.3], [1.02, 0.78], [-0.04, 0.98], [0.62, 1.08], [0.34, -0.36]];
  const cells: React.ReactNode[] = [];
  A.forEach(([ax, ay], k) => {
    const shape = SHAPES[Math.floor(random(`${seed}s${k}`) * SHAPES.length)];
    const jitter = Math.floor((f - at) / 5);
    shape.forEach(([gx, gy], j) => {
      const id = `${seed}${k}-${j}`;
      const born = at - 1 + Math.floor(random(`${id}b`) * 7);
      const dies = at + 14 + Math.floor(random(`${id}d`) * (life - 14));
      if (f < born || f > dies) return;
      const jx = (random(`${id}x${jitter}`) > 0.72 ? (random(`${id}dir`) > 0.5 ? 1 : -1) : 0) * size;
      const col = COLS[Math.floor(random(`${id}c`) * COLS.length)];
      const o = (0.65 + 0.35 * random(`${id}o${Math.floor(f / 4)}`)) * interpolate(f, [dies - 4, dies], [1, 0], cl);
      cells.push(<div key={id} style={{position: 'absolute', left: x + ax * w + gx * size + jx, top: y + ay * h + gy * size, width: size - 2, height: size - 2,
        background: col, opacity: o, boxShadow: `0 0 12px ${col}`}} />);
    });
  });
  return <>{cells}</>;
};

/** Draw-on SVG path inside a local box; optional flowing highlight after it completes. */
export const DrawPath: React.FC<{d: string; a: number; b: number; w?: number; color?: string; glow?: string; box: [number, number]; style?: React.CSSProperties;
  flow?: boolean; dash?: string}> = ({d, a, b, w = 6, color = C.mist, glow, box, style, flow = false, dash}) => {
  const f = useCurrentFrame();
  const p = prog(f, a, b, easeInOut);
  if (p <= 0) return null;
  const flowing = flow && p >= 1;
  return (
    <svg width={box[0]} height={box[1]} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}}>
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round"
        strokeDasharray={flowing && dash ? dash : `${p} 2`} strokeDashoffset={flowing && dash ? -((f - b) / 60) : 0}
        style={{filter: glow ?? `drop-shadow(0 0 8px ${C.blue}) drop-shadow(0 0 22px ${C.violet})`}} />
      {flowing ? <path d={d} pathLength={1} fill="none" stroke="#FFFFFF" strokeWidth={w * 1.3} strokeLinecap="round" strokeDasharray="0.12 0.88"
        strokeDashoffset={-(((f - b) / 45) % 1)} style={{filter: `blur(2px) drop-shadow(0 0 16px ${C.sky})`}} /> : null}
    </svg>
  );
};

/** Big soft rounded cursor (laptop reference). */
export const SoftCursor: React.FC<{x: number; y: number; press?: number; size?: number; opacity?: number}> = ({x, y, press = 0, size = 120, opacity = 1}) => (
  <svg viewBox="0 0 100 100" width={size} height={size}
    style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - 0.14 * press}) rotate(-8deg)`, transformOrigin: '18% 12%', opacity,
      filter: 'drop-shadow(0 10px 16px rgba(0,0,0,.55)) drop-shadow(0 0 18px rgba(143,176,255,.35))'}}>
    <defs><linearGradient id="cur" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E4E2DA" /></linearGradient></defs>
    <path d="M14 10 C 12 6, 16 3, 20 5 L 88 44 C 93 47, 92 54, 86 55 L 56 60 C 53 61, 51 63, 50 66 L 38 92 C 36 97, 29 96, 28 91 Z" fill="url(#cur)" />
  </svg>
);

/** Expanding click ripple. */
export const Ripple: React.FC<{x: number; y: number; at: number; r?: number; color?: string}> = ({x, y, at, r = 80, color = C.sky}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 20) return null;
  const p = prog(f, at, at + 20);
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%',
    border: `${4 * (1 - p) + 1}px solid ${C.mist}`, boxShadow: `0 0 18px ${color}`, transform: `scale(${0.3 + 0.9 * p})`, opacity: 1 - p}} />;
};

/** Thin glowing rim light along the top edge; a bright spot travels across it. */
const RimLight: React.FC<{w: number; t: number}> = ({w, t}) => (
  <>
    <div style={{position: 'absolute', left: '8%', right: '8%', top: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(190,210,255,.9),transparent)',
      boxShadow: `0 0 12px ${C.sky},0 0 26px ${C.blue}`}} />
    <div style={{position: 'absolute', top: -14, left: -90 + ((t * 5) % (w + 180)), width: 180, height: 30, borderRadius: '50%',
      background: 'radial-gradient(closest-side,rgba(255,255,255,.75),rgba(143,176,255,.25),transparent)', filter: 'blur(4px)'}} />
  </>
);

/** Widget card in the user's reference look. `at` = entrance frame; `exit` = exit frame. */
export const Widget: React.FC<{x: number; y: number; w: number; h: number; at: number; exit?: number; enter?: 'pop' | 'drop' | 'whip';
  radius?: number; grid?: boolean; style?: React.CSSProperties; children?: React.ReactNode}> = ({x, y, w, h, at, exit, enter = 'pop', radius, grid = true, style, children}) => {
  const f = useCurrentFrame();
  if (f < at - 1 || (exit !== undefined && f > exit + 10)) return null;
  const e = enter === 'drop' ? zoomDropIn(f, at, {rot: 0, dx: 60, dy: -140}) : enter === 'whip' ? whipIn(f, at, {from: 1, dist: 520}) : glassPop(f, at);
  const ex = exit !== undefined ? exitStyle(f, exit) : {};
  const bob = Math.sin((f - at) / 26) * 3;
  return (
    <div style={{position: 'absolute', left: x, top: y + bob, width: w, height: h, ...e, ...ex,
      transform: `${(e.transform as string) ?? ''} ${(ex.transform as string) ?? ''}`, filter: `${(e.filter as string) ?? ''} ${(ex.filter as string) ?? ''}`.trim() || undefined,
      opacity: ((e.opacity as number) ?? 1) * ((ex.opacity as number) ?? 1)}}>
      <div style={{...WIDGET, inset: 0, borderRadius: radius ?? Math.round(Math.min(w, h) * 0.2), ...style}}>
        {grid ? <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(143,176,255,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(143,176,255,.09) 1px,transparent 1px)',
          backgroundSize: '34px 34px', WebkitMaskImage: 'linear-gradient(180deg,transparent 45%,#000 100%)'}} /> : null}
        <RimLight w={w} t={f - at} />
        {children}
      </div>
    </div>
  );
};

/** Small grey corner label row (refs: "10 dec … 4:21 AM"). */
export const Corner: React.FC<{l: string; r?: string; top?: number; pad?: number; size?: number}> = ({l, r, top = 26, pad = 28, size = 20}) => (
  <>
    <div style={{position: 'absolute', left: pad, top, fontSize: size, fontWeight: 500, color: C.grey}}>{l}</div>
    {r ? <div style={{position: 'absolute', right: pad, top, fontSize: size, fontWeight: 500, color: C.grey}}>{r}</div> : null}
  </>
);

/** Big number with the white → pale-blue fill. */
export const BigNum: React.FC<{children: React.ReactNode; size: number; style?: React.CSSProperties; weight?: number}> = ({children, size, style, weight = 500}) => (
  <div style={{fontSize: size, fontWeight: weight, letterSpacing: -size * 0.045, lineHeight: 1, background: 'linear-gradient(180deg,#FFFFFF 25%,#C7D3FF 75%,#9DB0FF 100%)',
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 18px rgba(101,126,252,.55))`, ...style}}>{children}</div>
);

/** Outline pill ("Monthly ⌄" style). */
export const OutlinePill: React.FC<{children: React.ReactNode; style?: React.CSSProperties; dot?: string}> = ({children, style, dot}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: 'rgba(143,176,255,.10)',
    border: '1.5px solid rgba(143,176,255,.35)', color: 'rgba(230,236,255,.9)', fontSize: 22, fontWeight: 500, whiteSpace: 'nowrap', ...style}}>
    {dot ? <span style={{width: 11, height: 11, borderRadius: '50%', background: dot, boxShadow: `0 0 10px ${dot}`}} /> : null}
    {children}
  </div>
);

/** Progress bar: dark outlined track + cyan → blue → violet fill with a glowing head. */
export const ProgressBar: React.FC<{p: number; w: number; h?: number}> = ({p, w, h = 30}) => (
  <div style={{position: 'relative', width: w, height: h, borderRadius: h, background: 'rgba(7,10,31,.8)', border: '1.5px solid rgba(143,176,255,.35)'}}>
    <div style={{position: 'absolute', left: 2, top: 2, bottom: 2, width: Math.max(h - 4, (w - 4) * p), borderRadius: h,
      background: 'linear-gradient(90deg,#7FD4FF 0%,#657EFC 50%,#935DF9 100%)', boxShadow: `0 0 18px rgba(101,126,252,.8)`}} />
  </div>
);

export const clampText = (s: string) => s.replace(/[.,?!]+$/, '');
