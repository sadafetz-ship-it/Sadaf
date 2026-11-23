/**
 * Animation recipes measured from the user's reference grids (refs R5: "red Scripts", "fixes." cards, "mistake/Life",
 * green photo arc, "Trial edit" quest card, "Golden Hour"). They change MOTION only — each card keeps its own look.
 * All colours are the purple palette.
 */
import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {C} from './theme';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** "fixes." cards: fly in oversized + heavily blurred, settle with a tilt (≈10 f). */
export const zoomDropIn = (frame: number, at: number, o: {rot?: number; dx?: number; dy?: number; from?: number; dur?: number} = {}): React.CSSProperties => {
  const {rot = 0, dx = -120, dy = -160, from = 1.6, dur = 10} = o;
  const p = easeOut(interpolate(frame, [at, at + dur], [0, 1], cl));
  const bob = frame > at + dur ? Math.sin((frame - at - dur) / 14) * 4 : 0;
  return {
    opacity: interpolate(frame, [at, at + 3], [0, 1], cl),
    transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p) + bob}px) scale(${from + (1 - from) * p}) rotate(${rot * p + (rot - 14) * (1 - p)}deg)`,
    filter: `blur(${30 * (1 - p)}px)`,
  };
};

/** "mistake / Life": whip in from the side with motion blur + overshooting tilt (≈9 f). */
export const whipIn = (frame: number, at: number, o: {from?: 1 | -1; dist?: number; rot?: number; dur?: number} = {}): React.CSSProperties => {
  const {from = 1, dist = 700, rot = -4, dur = 9} = o;
  const t = interpolate(frame, [at, at + dur], [0, 1], cl);
  const p = easeOut(t);
  const over = interpolate(frame, [at + dur - 3, at + dur + 2, at + dur + 6], [0, 1, 0], cl);
  return {
    opacity: interpolate(frame, [at, at + 2], [0, 1], cl),
    transform: `translateX(${from * dist * (1 - p) - from * 18 * over}px) skewX(${-from * 14 * (1 - p)}deg) rotate(${rot * p + rot * 0.6 * over}deg) scale(${1 + 0.08 * (1 - p)})`,
    filter: `blur(${24 * (1 - p)}px)`,
  };
};

/** Green photo arc: a tile starts as a white glowing placeholder and "develops" into its content (≈8 f). */
export const glowReveal = (frame: number, at: number, dur = 8) => {
  const p = interpolate(frame, [at, at + dur], [0, 1], cl);
  return {
    style: {
      opacity: interpolate(frame, [at - 1, at + 1], [0, 1], cl),
      transform: `scale(${interpolate(frame, [at, at + 4, at + dur], [0.6, 1.06, 1], cl)})`,
      boxShadow: `0 0 ${40 * (1 - p) + 10}px rgba(242,252,255,${0.9 * (1 - p) + 0.1})`,
    } as React.CSSProperties,
    whiteness: 1 - p, // overlay a white layer with this opacity
  };
};

/** Glowing comet that travels a path and leaves a fading trail (green photo arc). */
export const Comet: React.FC<{d: string; at: number; dur: number; w?: number; color?: string; vb?: [number, number, number, number]; style?: React.CSSProperties}> = ({
  d, at, dur, w = 6, color = C.mist, vb = [0, 0, 1080, 1920], style,
}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + dur + 10) return null;
  const head = interpolate(frame, [at, at + dur], [0, 1], {...cl, easing: easeOut});
  const tail = interpolate(frame, [at + 3, at + dur + 8], [0, 1], cl);
  return (
    <svg viewBox={vb.join(' ')} style={{position: 'absolute', left: vb[0], top: vb[1], width: vb[2], height: vb[3], overflow: 'visible', pointerEvents: 'none', zIndex: 40, ...style}}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" pathLength={1}
        strokeDasharray={`${Math.max(0.001, head - tail)} 2`} strokeDashoffset={-tail}
        style={{filter: `drop-shadow(0 0 8px ${C.mist}) drop-shadow(0 0 22px ${C.lilac})`}} />
    </svg>
  );
};

/** Thin accent line that drops onto a spot just before a reveal (red line in "Scripts" / "fixes."). */
export const InkLine: React.FC<{x: number; y: number; at: number; h?: number; color?: string}> = ({x, y, at, h = 150, color = C.violet}) => {
  const frame = useCurrentFrame();
  if (frame < at - 4 || frame > at + 2) return null;
  const p = interpolate(frame, [at - 4, at], [0, 1], cl);
  return <div style={{position: 'absolute', left: x - 2, top: y - h * (1 - p) - 40, width: 4, height: h * p, background: color, borderRadius: 2,
    boxShadow: `0 0 12px ${color}`, zIndex: 60, opacity: 1 - interpolate(frame, [at, at + 2], [0, 1], cl)}} />;
};

/** "Scripts" / "Golden Hour" word reveal: blurry bloom → sharp (≈10 f). */
export const bloomIn = (frame: number, at: number, dur = 10): React.CSSProperties => {
  const p = interpolate(frame, [at, at + dur], [0, 1], cl);
  return {
    opacity: interpolate(frame, [at, at + 2], [0, 1], cl),
    filter: `blur(${16 * (1 - easeOut(p))}px) brightness(${1 + 0.6 * (1 - p)})`,
    transform: `scale(${1.08 - 0.08 * easeOut(p)})`,
  };
};

/** Purple "Golden Hour" glow for script + bold words. */
export const GLOW = `drop-shadow(0 0 6px rgba(242,252,255,.55)) drop-shadow(0 0 18px ${C.lilac}) drop-shadow(0 0 42px rgba(63,224,255,.85)) drop-shadow(0 0 80px rgba(91,108,255,.45))`;
/** Softer glow for bold caption words only (user: glow on bold words only, reduced). */
export const GLOW_CAPTION = `drop-shadow(0 0 3px rgba(242,252,255,.35)) drop-shadow(0 0 12px rgba(63,224,255,.4))`;
export const GLOW_FILL = 'linear-gradient(180deg,#FFFFFF 10%,#F0FDFF 45%,#B5F3FF 75%,#B5F3FF 100%)';

/**
 * "Red Scripts" pixels: chunky square pixels in stair-step clusters around a word. They pop in with the bloom,
 * jitter between positions every 2–3 f, then blink out one by one (≈16 f). Purple tints.
 */
export const ScriptPixels: React.FC<{at: number; w: number; h: number; seed: string; size?: number; cols?: string[]}> = ({at, w, h, seed, size = 26, cols}) => {
  const frame = useCurrentFrame();
  const life = 18;
  if (frame < at - 2 || frame > at + life) return null;
  const COLS = cols ?? [C.violet, C.lilac, C.magenta, '#D6F8FF', C.deep];
  // cluster anchors around the word box (corners + edges), each a small tetromino
  const anchors: [number, number][] = [[-0.08, -0.25], [0.92, -0.35], [1.02, 0.85], [-0.05, 1.05], [0.55, 1.15], [0.35, -0.4]];
  const shapes = [[[0, 0], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [1, 0], [2, 0], [2, 1]], [[0, 0], [1, 1]], [[0, 0], [0, 1], [1, 0]]];
  const cells: React.ReactNode[] = [];
  anchors.forEach(([ax, ay], k) => {
    const shape = shapes[Math.floor(random(`${seed}s${k}`) * shapes.length)];
    const jitter = Math.floor((frame - at) / 3);
    shape.forEach(([cx, cy], j) => {
      const id = `${seed}${k}-${j}`;
      const born = at - 1 + Math.floor(random(`${id}b`) * 4);
      const dies = at + 8 + Math.floor(random(`${id}d`) * (life - 8));
      if (frame < born || frame > dies) return;
      const jx = (random(`${id}x${jitter}`) > 0.75 ? 1 : 0) * size;
      const x = ax * w + cx * size + jx - w / 2, y = ay * h + cy * size - h / 2;
      const col = COLS[Math.floor(random(`${id}c`) * COLS.length)];
      const o = (0.55 + 0.45 * random(`${id}o${Math.floor(frame / 2)}`)) * interpolate(frame, [dies - 2, dies], [1, 0], cl);
      cells.push(<div key={id} style={{position: 'absolute', left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, width: size - 2, height: size - 2,
        background: col, opacity: o, boxShadow: `0 0 14px ${col}`}} />);
    });
  });
  return <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4}}>{cells}</div>;
};
