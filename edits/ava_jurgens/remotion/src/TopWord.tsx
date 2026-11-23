import React from 'react';
import {useCurrentFrame, interpolate, random} from 'remotion';
import {C, ACC, ACC_DEEP, FONT, cl, p} from './theme';

const SHAPES = [[[0,0],[1,0],[1,1]], [[0,0],[1,0],[2,0],[2,1]], [[0,1],[1,1],[1,0]], [[0,0],[1,0]], [[0,0]], [[0,0],[0,1]]];
const ANCH = [[-0.10,0.40],[-0.06,0.05],[1.02,0.05],[1.0,0.45],[0.47,-0.20],[0.30,0.93]];
const COLS = ['#C2F433','#84E572','#4CDAB4','#C2F433','#4CDAB4'];

/** "Make better Scripts" top word: small words L/R above, big word blooms in with pixel clusters + handles. */
export const TopWord: React.FC<{left: string; leftAt: number; right: string; rightAt: number; big: string; at: number; out: number;
  top: number; size: number; seed: number; on?: 'light' | 'dark'}> = ({left, leftAt, right, rightAt, big, at, out, top, size, seed, on = 'light'}) => {
  const f = useCurrentFrame();
  if (f < Math.min(leftAt, at) - 6 || f > out + 8) return null;
  const ex = p(f, out, 7);
  const b = p(f, at, 10);
  const cell = Math.round(size * 0.13);
  const sm = (a: number) => ({opacity: p(f, a, 6) * (1 - ex), transform: `translateY(${12 * (1 - p(f, a, 6))}px)`, filter: `blur(${4 * (1 - p(f, a, 6))}px)`});
  const line = interpolate(f, [at - 5, at - 1], [0, 1], cl);
  const fill = on === 'light' ? ACC_DEEP : ACC;
  const bigFilter = on === 'light' ? 'drop-shadow(0 3px 10px rgba(11,42,23,.28)) drop-shadow(0 0 1px rgba(11,42,23,.6))' : 'blur(.5px) drop-shadow(0 0 10px rgba(132,229,114,.35))';
  const tsm: React.CSSProperties = {position: 'absolute', top: -Math.round(size * 0.06) - 30, fontWeight: 400, fontSize: 56, letterSpacing: -1.5, color: '#fff',
    textShadow: '0 2px 14px rgba(0,0,0,.35)', whiteSpace: 'nowrap'};
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', fontFamily: FONT}}>
      <div style={{display: 'inline-block', position: 'relative', padding: '0 10px'}}>
        <span style={{...tsm, left: 30, ...sm(leftAt)}}>{left}</span>
        <span style={{...tsm, right: 30, ...sm(rightAt)}}>{right}</span>
        {/* accent line drops onto the word (4 f) */}
        {f >= at - 5 && f < at + 2 && <div style={{position: 'absolute', left: '50%', top: -160 + 150 * line, width: 4, height: 150 * line, marginLeft: -2,
          background: C.mid, borderRadius: 2, boxShadow: `0 0 10px ${C.mint}`, opacity: 1 - p(f, at, 2)}} />}
        <span style={{fontWeight: 800, fontSize: size, letterSpacing: -9, lineHeight: 1, display: 'inline-block', background: fill,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', opacity: b * (1 - ex),
          transform: `scale(${1.08 - 0.08 * b + 0.04 * ex})`, filter: `${bigFilter} blur(${16 * (1 - b) + 10 * ex}px) brightness(${1.6 - 0.6 * b})`}}>{big}</span>
        {[-40, null].map((x, i) => <span key={i} style={{position: 'absolute', width: 26, height: 26, borderRadius: 7, border: '3px solid rgba(255,255,255,.85)',
          top: '50%', marginTop: -6, ...(x === null ? {right: -40} : {left: -40}), opacity: p(f, at + 2, 5) * (1 - ex), boxShadow: '0 0 10px rgba(255,255,255,.4)'}} />)}
        {ANCH.map(([ax, ay], ci) => {
          const sh = SHAPES[Math.floor(random(`${seed}s${ci}`) * SHAPES.length)];
          const appear = at + Math.floor(random(`${seed}a${ci}`) * 3);
          // blink out one by one by ~18 f, half of the clusters stay and flicker softly during the hold
          const keep = ci % 2 === 0;
          const gone = at + 8 + ci * 2;
          if (f < appear) return null;
          if (!keep && f > gone) return null;
          const jit = Math.floor((f - appear) / 3) % 2 === 0 ? 0 : (random(`${seed}j${ci}`) > 0.5 ? cell : -cell);
          const settle = f > at + 18 ? 0 : jit;
          return sh.map(([dx, dy], k) => {
            const flick = 0.55 + 0.45 * random(`${seed}${ci}${k}${Math.floor(f / 2)}`);
            const c = COLS[Math.floor(random(`${seed}c${ci}${k}`) * COLS.length)];
            return <div key={`${ci}${k}`} style={{position: 'absolute', left: `calc(${ax * 100}% + ${dx * cell + settle}px)`, top: `calc(${ay * 100}% + ${dy * cell}px)`,
              width: cell, height: cell, background: c, boxShadow: `0 0 8px ${c}`, opacity: flick * (f > at + 18 ? 0.8 : 1) * (1 - ex)}} />;
          });
        })}
      </div>
    </div>
  );
};
