import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {C} from './theme';

const PIX = [C.lilac, C.violet, C.rose, C.mist, C.blueLight];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Deterministic flicker 0.35..1 for a pixel. */
const flick = (seed: string, frame: number) => 0.35 + 0.65 * random(`${seed}-${Math.floor(frame / 2)}`);

/**
 * PIXEL LOADER (ref R2 0.23–0.97 s): rounded pixels appear left → right, one every 2 f, flickering;
 * they hold, then blink out as the word wipes in at `land`. Ends `land + 4`.
 */
export const PixelLoader: React.FC<{land: number; n?: number; size: number; gap?: number; color?: string; seed: string}> = ({
  land, n = 5, size, gap = 10, color = C.lilac, seed,
}) => {
  const frame = useCurrentFrame();
  const start = land - (n * 2 + 8);
  if (frame < start || frame > land + 5) return null;
  return (
    <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', display: 'flex', gap, zIndex: 3, pointerEvents: 'none'}}>
      {new Array(n).fill(0).map((_, i) => {
        const on = start + i * 2;
        if (frame < on) return <div key={i} style={{width: size, height: size}} />;
        const out = interpolate(frame, [land + (n - 1 - i) * 0.8, land + 2 + (n - 1 - i) * 0.8], [1, 0], clamp);
        const o = (frame < land - 2 ? flick(`${seed}${i}`, frame) : 1) * out;
        return (
          <div key={i} style={{width: size, height: size, borderRadius: size * 0.22, background: color, opacity: o,
            boxShadow: `0 0 ${size * 0.5}px ${color}`, transform: `scale(${interpolate(frame, [on, on + 2], [0.4, 1], clamp)})`}} />
        );
      })}
    </div>
  );
};

/** Word wipe with horizontal smear (pairs with PixelLoader). */
export const smearIn = (frame: number, land: number, dur = 6): React.CSSProperties => {
  const p = interpolate(frame, [land, land + dur], [-15, 115], clamp);
  return {
    WebkitMaskImage: `linear-gradient(90deg,#000 ${p - 15}%,transparent ${p}%)`,
    transform: `scaleX(${interpolate(frame, [land, land + dur], [1.18, 1], clamp)}) translateX(${interpolate(frame, [land, land + dur], [-24, 0], clamp)}px)`,
    filter: `blur(${interpolate(frame, [land, land + dur], [10, 0], clamp)}px)`,
    opacity: frame < land ? 0 : 1,
  };
};

/**
 * PIXEL DISSOLVE (ref R1 16.83–17.10 s): scattered accent squares flicker over the caption area,
 * 1–2 cells flare into glowing bars, a few leftovers linger under the new words.
 */
export const PixelDissolve: React.FC<{at: number; seed: string; top?: number; height?: number}> = ({at, seed, top = 1340, height = 320}) => {
  const frame = useCurrentFrame();
  if (frame < at - 4 || frame > at + 16) return null;
  const cell = 46;
  const cols = Math.floor(840 / cell), rows = Math.floor(height / cell);
  const cells = new Array(30).fill(0).map((_, i) => {
    const cx = Math.floor(random(`${seed}x${i}`) * cols), cy = Math.floor(random(`${seed}y${i}`) * rows);
    const on = at - 3 + Math.floor(random(`${seed}o${i}`) * 7), life = 2 + Math.floor(random(`${seed}l${i}`) * 4);
    if (frame < on || frame > on + life) return null;
    const col = PIX[Math.floor(random(`${seed}c${i}`) * PIX.length)];
    return <div key={i} style={{position: 'absolute', left: 120 + cx * cell, top: top + cy * cell, width: cell - 6, height: cell - 6, borderRadius: 8,
      background: col, opacity: 0.25 + 0.6 * flick(`${seed}${i}`, frame), boxShadow: `0 0 18px ${col}`}} />;
  });
  // flare bars
  const bars = [0, 1].map((i) => {
    const on = at + i * 2, w = (3 + Math.floor(random(`${seed}bw${i}`) * 4)) * cell;
    if (frame < on || frame > on + 2) return null;
    const x = 120 + Math.floor(random(`${seed}bx${i}`) * (cols - 6)) * cell, y = top + Math.floor(random(`${seed}by${i}`) * rows) * cell;
    return <div key={`b${i}`} style={{position: 'absolute', left: x, top: y + 10, width: w, height: 22, borderRadius: 6, background: C.mist,
      boxShadow: `0 0 24px ${C.lilac},0 0 60px ${C.violet}`}} />;
  });
  return <AbsoluteFill style={{zIndex: 49, pointerEvents: 'none'}}>{cells}{bars}</AbsoluteFill>;
};

/**
 * PIXEL GRID (ref R1 7.27–8.60 s): on a cut, a faint grid covers the frame and some cells
 * fill with translucent accent / white, flickering, fading out over ~1.5 s.
 */
export const PixelGrid: React.FC<{at: number; seed: string}> = ({at, seed}) => {
  const frame = useCurrentFrame();
  const dur = 26;
  if (frame < at || frame > at + dur) return null;
  const fade = interpolate(frame, [at, at + 3, at + dur], [0, 1, 0], clamp);
  const cell = 90;
  const fills = new Array(16).fill(0).map((_, i) => {
    const cx = [0, 1, 2, 9, 10, 11][Math.floor(random(`${seed}gx${i}`) * 6)], cy = 2 + Math.floor(random(`${seed}gy${i}`) * 16);
    const on = at + Math.floor(random(`${seed}go${i}`) * 10), life = 4 + Math.floor(random(`${seed}gl${i}`) * 10);
    if (frame < on || frame > on + life) return null;
    const col = random(`${seed}gc${i}`) > 0.5 ? C.lilac : C.mist;
    return <div key={i} style={{position: 'absolute', left: cx * cell, top: cy * cell, width: cell, height: cell, background: col,
      opacity: (0.08 + 0.14 * flick(`${seed}g${i}`, frame)) * fade}} />;
  });
  return (
    <AbsoluteFill style={{zIndex: 40, pointerEvents: 'none'}}>
      <AbsoluteFill style={{opacity: 0.22 * fade,
        backgroundImage: `linear-gradient(rgba(238,231,255,.9) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(238,231,255,.9) 1.5px,transparent 1.5px)`,
        backgroundSize: `${cell}px ${cell}px`, WebkitMaskImage: 'radial-gradient(75% 60% at 50% 55%,#000,transparent)'}} />
      {fills}
    </AbsoluteFill>
  );
};

/** Pill tag with a cursor arrow (ref R1 "bor" / "Abdurahim"). */
export const PillTag: React.FC<{text: string; at: number; color?: string}> = ({text, at, color = C.lilac}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [at, at + 4, at + 7], [0, 1.15, 1], clamp);
  const ax = interpolate(frame, [at + 3, at + 10], [40, 0], clamp), ay = interpolate(frame, [at + 3, at + 10], [30, 0], clamp);
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', position: 'relative', transform: `scale(${s})`}}>
      <span style={{background: color, color: C.ink, font: "700 34px Inter, sans-serif", padding: '8px 24px 10px', borderRadius: 999,
        boxShadow: `0 0 24px ${color}`}}>{text}</span>
      <svg width={40} height={40} viewBox="0 0 24 24" style={{position: 'absolute', right: -30, bottom: -24, transform: `translate(${ax}px,${ay}px)`,
        opacity: interpolate(frame, [at + 3, at + 6], [0, 1], clamp), filter: `drop-shadow(0 0 8px ${color})`}}>
        <path d="M3 2l18 8-8 2.5L10 21z" fill={C.mist} stroke={C.ink} strokeWidth={1.2} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** White swoosh streak that arcs in and leaves the setup line behind (ref R2 0.17–0.50 s). */
export const Swoosh: React.FC<{at: number; y: number}> = ({at, y}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + 12) return null;
  const head = interpolate(frame, [at, at + 8], [0, 1], clamp), tail = interpolate(frame, [at + 3, at + 12], [0, 1], clamp);
  return (
    <svg width={1080} height={260} style={{position: 'absolute', left: 0, top: y - 130, zIndex: 51, overflow: 'visible', pointerEvents: 'none'}}>
      <path d="M1100 40 C820 10 560 150 260 160" fill="none" stroke={C.mist} strokeWidth={14} strokeLinecap="round" pathLength={1}
        strokeDasharray={`${Math.max(0.001, head - tail)} 2`} strokeDashoffset={-tail}
        style={{filter: `drop-shadow(0 0 12px ${C.lilac}) blur(1px)`}} />
    </svg>
  );
};
