// Animation helpers: house recipes (recoloured Navy + Lime) + advanced layer (springs, 3D cards, sheen, motion blur, counters, comets, bursts).
import React from 'react';
import {Easing, interpolate, random, spring, useCurrentFrame} from 'remotion';
import {C, FPS} from './theme';

export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const back = Easing.out(Easing.back(1.6));
export const prog = (f: number, a: number, b: number, ease: (t: number) => number = easeOut) => ease(interpolate(f, [a, b], [0, 1], cl));

/** Spring 0→1 starting at frame `at` (overshoots slightly with low damping). */
export const spr = (f: number, at: number, o: {damping?: number; stiffness?: number; mass?: number} = {}) =>
  f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping: o.damping ?? 14, stiffness: o.stiffness ?? 120, mass: o.mass ?? 0.9}});

/** Exit: blur + slight scale + fade. */
export const exitStyle = (f: number, at: number | undefined, dur = 10): React.CSSProperties => {
  if (at === undefined || f < at) return {};
  const p = prog(f, at, at + dur, (t) => t * t);
  return {opacity: 1 - p, filter: `blur(${14 * p}px)`, transform: `scale(${1 + 0.05 * p})`};
};

export const wordIn = (f: number, at: number, dur = 9): React.CSSProperties => {
  const p = prog(f, at, at + dur);
  return {opacity: interpolate(f, [at, at + 4], [0, 1], cl), filter: `blur(${10 * (1 - p)}px)`, transform: `translateY(${12 * (1 - p)}px)`, display: 'inline-block'};
};

export const pop = (f: number, at: number, dur = 12): React.CSSProperties => ({
  opacity: interpolate(f, [at, at + 2], [0, 1], cl),
  transform: `scale(${interpolate(f, [at, at + dur * 0.6, at + dur], [0, 1.15, 1], cl)})`,
});

export const bloomIn = (f: number, at: number, dur = 16): React.CSSProperties => {
  const p = interpolate(f, [at, at + dur], [0, 1], cl);
  return {
    opacity: interpolate(f, [at, at + 2], [0, 1], cl),
    filter: `blur(${16 * (1 - easeOut(p))}px) brightness(${1 + 0.6 * (1 - p)})`,
    transform: `scale(${1.08 - 0.08 * easeOut(p)})`,
  };
};

type Entry = 'left' | 'right' | 'up' | 'drop' | 'pop';
/**
 * Premium 3D card wrapper. Spring entrance with direction, perspective tilt that settles, velocity-based motion blur,
 * idle float + slow 3D sway, a light sheen that sweeps once across after landing, blur exit.
 */
export const Card3D: React.FC<{at: number; out?: number; from?: Entry; x: number; y: number; w: number; h: number; tilt?: number; float?: number;
  sheen?: boolean; radius?: number; children: React.ReactNode; style?: React.CSSProperties; z?: number}> = ({
  at, out, from = 'pop', x, y, w, h, tilt = 1, float = 1, sheen = true, radius = 56, children, style, z,
}) => {
  const f = useCurrentFrame();
  if (f < at - 1 || (out !== undefined && f > out + 12)) return null;
  const s = spr(f, at);
  const sPrev = spr(f - 1, at);
  const vel = Math.abs(s - sPrev);
  const dir = {left: [-1, 0], right: [1, 0], up: [0, 1], drop: [0, -1], pop: [0, 0]}[from];
  const dist = from === 'pop' ? 0 : 420;
  const tx = dir[0] * dist * (1 - s);
  const ty = dir[1] * dist * 0.7 * (1 - s);
  const sc = from === 'pop' ? 0.72 + 0.28 * s : 0.9 + 0.1 * s;
  const ry = (dir[0] * -38 + (from === 'pop' ? 18 : 0)) * (1 - s) * tilt;
  const rx = (dir[1] * 30 + (from === 'pop' ? -14 : 0)) * (1 - s) * tilt;
  const t = Math.max(0, f - at);
  const idleY = Math.sin(t / 22) * 5 * float;
  const swayY = Math.sin(t / 37) * 3.5 * float * tilt;
  const swayX = Math.cos(t / 43) * 2.5 * float * tilt;
  const mb = Math.min(22, vel * 260);
  const ex = exitStyle(f, out);
  const exP = out !== undefined && f >= out ? prog(f, out, out + 10, (q) => q * q) : 0;
  const sheenX = interpolate(f, [at + 12, at + 30], [-60, 160], cl);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, perspective: 1400, zIndex: z,
      opacity: interpolate(f, [at, at + 4], [0, 1], cl) * (1 - exP)}}>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d',
        transform: `translate3d(${tx}px, ${ty + idleY}px, 0) scale(${sc * (1 + 0.05 * exP)}) rotateY(${ry + swayY}deg) rotateX(${rx + swayX}deg)`,
        filter: `blur(${mb + (ex.filter ? 14 * exP : 0)}px)`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', ...style}}>
          {children}
          {sheen && f > at + 10 && f < at + 32 ? (
            <div style={{position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `linear-gradient(105deg, transparent ${sheenX - 18}%, rgba(255,255,255,.22) ${sheenX - 4}%, rgba(255,255,255,.45) ${sheenX}%, rgba(230,255,79,.18) ${sheenX + 4}%, transparent ${sheenX + 18}%)`,
              mixBlendMode: 'screen'}} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

/** Number roll (eased) with formatter. */
export const rollNum = (f: number, a: number, b: number, from: number, to: number) => from + (to - from) * prog(f, a, b, easeInOut);

/** Typewriter: characters shown by frame. */
export const typed = (f: number, text: string, a: number, b: number) => text.slice(0, Math.floor(interpolate(f, [a, b], [0, text.length], cl)));

export const Caret: React.FC<{h?: number; f: number; solid?: boolean}> = ({h = 34, f, solid}) => (
  <span style={{display: 'inline-block', width: 3, height: h, marginLeft: 6, verticalAlign: -h * 0.18, background: C.lime,
    boxShadow: `0 0 10px ${C.lime}`, opacity: solid || Math.floor(f / 8) % 2 === 0 ? 1 : 0}} />
);

/** Thin lime line that drops onto a spot just before a reveal. */
export const InkLine: React.FC<{x: number; y: number; at: number; h?: number; color?: string}> = ({x, y, at, h = 150, color = C.lime}) => {
  const f = useCurrentFrame();
  if (f < at - 6 || f > at + 4) return null;
  const p = interpolate(f, [at - 6, at], [0, 1], cl);
  return <div style={{position: 'absolute', left: x - 2, top: y - h * (1 - p) - 40, width: 4, height: h * p, background: color, borderRadius: 2,
    boxShadow: `0 0 12px ${color}`, opacity: 1 - interpolate(f, [at, at + 4], [0, 1], cl)}} />;
};

const SHAPES = [[[0, 0], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [1, 0], [2, 0], [2, 1]], [[0, 0], [1, 1]], [[0, 0], [0, 1], [1, 0]], [[0, 0], [1, 0], [1, -1], [2, -1]]];
export const PIX_COLS = [C.lime, '#F4FFB0', C.limeDk, C.mist, '#5E8FD6'];
/** "Scripts" pixel clusters around a box: pop with the reveal, jitter, flicker, blink out one by one. */
export const ScriptPixels: React.FC<{at: number; x: number; y: number; w: number; h: number; seed: string; size?: number; life?: number;
  anchors?: [number, number][]; cols?: string[]}> = ({at, x, y, w, h, seed, size = 28, life = 30, anchors, cols}) => {
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
      const dies = at + 12 + Math.floor(random(`${id}d`) * (life - 12));
      if (f < born || f > dies) return;
      const jx = (random(`${id}x${jitter}`) > 0.72 ? (random(`${id}dir`) > 0.5 ? 1 : -1) : 0) * size;
      const col = COLS[Math.floor(random(`${id}c`) * COLS.length)];
      const o = (0.6 + 0.4 * random(`${id}o${Math.floor(f / 4)}`)) * interpolate(f, [dies - 4, dies], [1, 0], cl);
      cells.push(<div key={id} style={{position: 'absolute', left: x + ax * w + gx * size + jx, top: y + ay * h + gy * size, width: size - 2, height: size - 2,
        background: col, opacity: o, boxShadow: `0 0 10px ${col}`}} />);
    });
  });
  return <>{cells}</>;
};

/** Draw-on SVG path; optional flowing highlight once drawn. */
export const DrawPath: React.FC<{d: string; a: number; b: number; w?: number; color?: string; glow?: string; flow?: boolean; blur?: number; opacity?: number; grad?: string}> = ({
  d, a, b, w = 6, color = C.lime, glow, flow = false, blur = 0, opacity = 1, grad,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, a, b, easeInOut);
  if (p <= 0) return null;
  const fl = `${blur ? `blur(${blur}px) ` : ''}${glow ?? `drop-shadow(0 0 8px ${C.lime}) drop-shadow(0 0 22px rgba(230,255,79,.45))`}`;
  const gid = `g${a}${b}`;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {grad ? <defs><linearGradient id={gid} x1="0" x2="1"><stop offset="0" stopColor={C.blue} stopOpacity={0.5} /><stop offset=".7" stopColor={C.lime} /><stop offset="1" stopColor="#fff" /></linearGradient></defs> : null}
      <path d={d} pathLength={1} fill="none" stroke={grad ? `url(#${gid})` : color} strokeWidth={w} strokeLinecap="round" strokeDasharray={`${p} 2`} opacity={opacity} style={{filter: fl}} />
      {flow && p >= 1 ? (
        <path d={d} pathLength={1} fill="none" stroke="#FFFFFF" strokeWidth={w * 1.3} strokeLinecap="round" strokeDasharray="0.12 0.88"
          strokeDashoffset={-(((f - b) / 50) % 1)} opacity={0.9} style={{filter: `blur(${blur + 2}px) drop-shadow(0 0 14px ${C.lime})`}} />
      ) : null}
    </svg>
  );
};

/** Cubic-bezier chain sampler: pts = [p0, c1, c2, p1, c1, c2, p2, ...]. */
export const bez = (pts: [number, number][], t: number): [number, number] => {
  const n = (pts.length - 1) / 3;
  const seg = Math.min(n - 1, Math.floor(t * n));
  const u = t * n - seg;
  const [p0, p1, p2, p3] = pts.slice(seg * 3, seg * 3 + 4);
  const m = 1 - u;
  return [m * m * m * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u * u * u * p3[0],
    m * m * m * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u * u * u * p3[1]];
};
export const bezD = (pts: [number, number][]) => `M${pts[0][0]} ${pts[0][1]} ` + Array.from({length: (pts.length - 1) / 3}, (_, i) =>
  `C ${pts[i * 3 + 1].join(' ')}, ${pts[i * 3 + 2].join(' ')}, ${pts[i * 3 + 3].join(' ')}`).join(' ');

/** Comet with a fading trail along a bezier chain between frames a→b. */
export const Comet: React.FC<{pts: [number, number][]; a: number; b: number; size?: number}> = ({pts, a, b, size = 14}) => {
  const f = useCurrentFrame();
  if (f < a || f > b + 6) return null;
  const t = prog(f, a, b, easeInOut);
  const dots = Array.from({length: 18}, (_, i) => {
    const tt = Math.max(0, t - i * 0.012);
    const [x, y] = bez(pts, tt);
    const k = 1 - i / 18;
    return <div key={i} style={{position: 'absolute', left: x - size * k, top: y - size * k, width: size * 2 * k, height: size * 2 * k, borderRadius: '50%',
      background: i === 0 ? '#fff' : C.lime, opacity: (i === 0 ? 1 : 0.5 * k) * interpolate(f, [b, b + 6], [1, 0], cl),
      boxShadow: i === 0 ? `0 0 20px ${C.lime}, 0 0 50px ${C.lime}` : undefined, filter: i ? `blur(${2 + i * 0.4}px)` : undefined}} />;
  });
  return <>{dots}</>;
};

/** Particle burst at (x,y) from frame `at`. */
export const Burst: React.FC<{x: number; y: number; at: number; n?: number; r?: number; seed?: string}> = ({x, y, at, n = 22, r = 220, seed = 'b'}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 26) return null;
  const p = prog(f, at, at + 26);
  return <>{Array.from({length: n}, (_, i) => {
    const ang = (i / n) * Math.PI * 2 + random(`${seed}${i}a`) * 0.4;
    const d = r * (0.5 + 0.5 * random(`${seed}${i}d`)) * p;
    const s = 3 + 5 * random(`${seed}${i}s`);
    return <div key={i} style={{position: 'absolute', left: x + Math.cos(ang) * d - s / 2, top: y + Math.sin(ang) * d - s / 2, width: s, height: s, borderRadius: '50%',
      background: i % 3 ? C.lime : '#fff', opacity: 1 - p, boxShadow: `0 0 10px ${C.lime}`}} />;
  })}</>;
};

/** Expanding ring pulse. */
export const Pulse: React.FC<{x: number; y: number; at: number; r?: number; dur?: number; color?: string}> = ({x, y, at, r = 120, dur = 24, color = C.lime}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur) return null;
  const p = prog(f, at, at + dur);
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `${3 * (1 - p) + 1}px solid ${color}`,
    boxShadow: `0 0 18px ${color}`, transform: `scale(${0.3 + 0.9 * p})`, opacity: 1 - p}} />;
};

export const Cursor: React.FC<{x: number; y: number; press?: number; size?: number; opacity?: number}> = ({x, y, press = 0, size = 64, opacity = 1}) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - 0.16 * press})`, transformOrigin: '15% 10%', opacity,
    filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.45))'}}>
    <path d="M10 6 L56 30 L34 36 L24 58Z" fill={C.mist} stroke="rgba(8,24,58,.35)" strokeWidth={1.5} strokeLinejoin="round" />
  </svg>
);

/** 4-point sparkle star. */
export const Star4: React.FC<{s?: number; color?: string; style?: React.CSSProperties}> = ({s = 34, color = C.mist, style}) => {
  const h = s / 2;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{flex: 'none', filter: `drop-shadow(0 0 6px ${C.lime}) drop-shadow(0 0 14px rgba(230,255,79,.55))`, ...style}}>
      <path d={`M${h} 0 Q${h * 1.08} ${h * 0.92} ${s} ${h} Q${h * 1.08} ${h * 1.08} ${h} ${s} Q${h * 0.92} ${h * 1.08} 0 ${h} Q${h * 0.92} ${h * 0.92} ${h} 0Z`} fill={color} />
    </svg>
  );
};

/** Twinkling sparkles. */
export const Sparkles: React.FC<{pts: [number, number, number][]; at: number; seed?: string}> = ({pts, at, seed = 'sp'}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return <>{pts.map(([x, y, s], i) => {
    const ph = (f - at) / 10 + random(`${seed}${i}`) * 6;
    const k = interpolate(f, [at + i * 3, at + i * 3 + 8], [0, 1], cl) * (0.55 + 0.45 * Math.sin(ph));
    return <Star4 key={i} s={s * 2} color={i % 2 ? C.mist : C.lime} style={{position: 'absolute', left: x - s, top: y - s, opacity: k, transform: `scale(${0.6 + 0.5 * k}) rotate(${(f - at) * 2}deg)`}} />;
  })}</>;
};
