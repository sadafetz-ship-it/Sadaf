import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {C, FONT} from './theme';
import {pop} from './timing';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Ring drawn around a hero word (ref R2 octagon round "value."): draws on 10 f, slow spin, wobbly hand-drawn edge. */
export const RingAround: React.FC<{at: number; w: number; h: number}> = ({at, w, h}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = interpolate(frame, [at, at + 10], [0, 1], clamp);
  const n = 8, rx = w / 2 + 50, ry = h / 2 + 40;
  const pts = new Array(n + 1).fill(0).map((_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2 + 0.2;
    const j = 1 + (random(`ring${i % n}`) - 0.5) * 0.08;
    return `${rx + Math.cos(a) * rx * j},${ry + Math.sin(a) * ry * j}`;
  });
  return (
    <svg width={rx * 2} height={ry * 2} style={{position: 'absolute', left: '50%', top: '50%', marginLeft: -rx, marginTop: -ry, overflow: 'visible', pointerEvents: 'none',
      transform: `rotate(${(frame - at) * 0.25}deg)`, zIndex: -1}}>
      <polyline points={pts.join(' ')} fill="none" stroke={C.lilac} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" pathLength={1}
        strokeDasharray={1} strokeDashoffset={1 - p} style={{filter: `drop-shadow(0 0 12px ${C.violet})`}} opacity={0.9} />
    </svg>
  );
};

/** Accent bar growing under a heavy word (ref R1 17.27 s). */
export const HighlightBar: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const w = interpolate(frame, [at, at + 5], [0, 100], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const o = interpolate(frame, [at, at + 6, at + 14], [1, 1, 0.55], clamp);
  return (
    <div style={{position: 'absolute', left: '50%', bottom: '4%', height: '22%', width: `${w}%`, transform: 'translateX(-50%)', zIndex: -1, borderRadius: 10,
      background: `linear-gradient(90deg,${C.deep},${C.violet},${C.magenta})`, boxShadow: `0 0 30px ${C.violet}`, opacity: o}} />
  );
};

/** Outline box flash around a word (ref R1 "vaqtingizda"): grows, flickers, settles faint. */
export const BoxFlash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const sx = interpolate(frame, [at, at + 4], [0, 1], clamp);
  const fl = frame < at + 10 ? 0.5 + 0.5 * random(`bf${at}-${Math.floor(frame / 2)}`) : 0.6;
  return (
    <span style={{position: 'absolute', inset: '-4px -12px -2px -10px', border: `3px solid ${C.lilac}`, borderRadius: 10, transform: `scaleX(${sx})`,
      transformOrigin: '0 50%', opacity: fl, boxShadow: `0 0 16px ${C.violet}, inset 0 0 12px rgba(185,154,245,.35)`, pointerEvents: 'none'}} />
  );
};

/** Arrow that draws in before a word (ref R1 "→ chiqib"). */
export const Arrow: React.FC<{at: number; size: number; color?: string}> = ({at, size, color = C.lilac}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at - 6, at + 2], [0, 1], clamp);
  return (
    <svg width={size * 1.3} height={size} viewBox="0 0 52 40" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: size * 0.2, overflow: 'visible',
      filter: `drop-shadow(0 0 8px ${color})`}}>
      <path d="M2 20 H46 M32 6 L48 20 L32 34" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** Text curving over the head (ref R1 "do'stim"): letters type on along an arc. */
export const ArcText: React.FC<{text: string; at: number; end: number; cx: number; cy: number; r: number}> = ({text, at, end, cx, cy, r}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > end + 6) return null;
  const shown = Math.floor(interpolate(frame, [at, at + text.length * 1.2], [0, text.length], clamp));
  const o = interpolate(frame, [end, end + 6], [1, 0], clamp);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: o, zIndex: 2, pointerEvents: 'none'}}>
      <defs><path id="arc" d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} /></defs>
      <text fontFamily={FONT.display} fontWeight={600} fontSize={56} letterSpacing={1} fill={C.mist} textAnchor="middle"
        style={{filter: `drop-shadow(0 0 16px ${C.violet})`}}>
        <textPath href="#arc" startOffset="50%">
          {text.split('').map((ch, i) => (
            <tspan key={i} fill={i === shown - 1 ? C.lilac : C.mist} opacity={i < shown ? 1 : 0}>{ch}</tspan>
          ))}
        </textPath>
      </text>
    </svg>
  );
};

/** Site tiles (ref: numbered scene-thumbnail board): rounded icon tiles with a glowing border, number top-left,
 *  a mini preview of that site's scene, fine "crack" lines, label underneath. Zigzag column; newest pops + glows. */
const THUMBS = [
  // 1 DefiLlama: rising chart + dot
  <svg key="t1" viewBox="0 0 100 100" width="100%" height="100%"><path d="M8 78 C25 74 32 66 44 64 S62 46 72 48 S86 30 94 24" fill="none" stroke="#B99AF5" strokeWidth={4} strokeLinecap="round" />
    <circle cx={72} cy={48} r={6} fill="#EEE7FF" /><circle cx={72} cy={48} r={11} fill="none" stroke="#FF7EC8" strokeWidth={1.5} opacity={0.7} /></svg>,
  // 2 CoinGlass: three bars + bolt
  <svg key="t2" viewBox="0 0 100 100" width="100%" height="100%"><rect x={14} y={56} width={12} height={28} rx={3} fill="#8E9BFF" /><rect x={32} y={42} width={12} height={42} rx={3} fill="#B99AF5" />
    <rect x={50} y={30} width={12} height={54} rx={3} fill="#C65BF2" /><path d="M80 18 66 46h10l-4 24 18-32H80z" fill="#FF7EC8" /></svg>,
  // 3 CryptoQuant: wallet ↔ exchange flows
  <svg key="t3" viewBox="0 0 100 100" width="100%" height="100%"><circle cx={20} cy={52} r={11} fill="none" stroke="#EEE7FF" strokeWidth={3} /><rect x={68} y={40} width={22} height={24} rx={5} fill="none" stroke="#EEE7FF" strokeWidth={3} />
    <path d="M30 42 C44 26 58 26 66 38" fill="none" stroke="#5B6CFF" strokeWidth={4} strokeLinecap="round" /><path d="M66 64 C56 78 44 78 30 62" fill="none" stroke="#FF7EC8" strokeWidth={4} strokeLinecap="round" /></svg>,
  // 4 Farside: ETF bars + coin
  <svg key="t4" viewBox="0 0 100 100" width="100%" height="100%"><line x1={8} x2={92} y1={60} y2={60} stroke="rgba(238,231,255,.45)" strokeDasharray="4 4" />
    {[14, 26, 38, 50, 62].map((x, i) => <rect key={x} x={x} y={i % 3 === 2 ? 60 : 60 - [26, 18, 0, 30, 12][i]} width={8} height={i % 3 === 2 ? 14 : [26, 18, 0, 30, 12][i]} rx={2} fill={i % 3 === 2 ? '#FF7EC8' : '#B99AF5'} />)}
    <circle cx={80} cy={30} r={13} fill="#8050E8" /><text x={80} y={36} fontSize={16} fontWeight={800} textAnchor="middle" fill="#EEE7FF" fontFamily="DejaVu Sans">₿</text></svg>,
];
const LABELS = ['DefiLlama', 'CoinGlass', 'CryptoQuant', 'Farside'];
const CRACKS = ['M0 30 L42 52 L100 18', 'M42 52 L30 100', 'M42 52 L100 70', 'M60 0 L48 40'];

export const StackTiles: React.FC<{times: number[]; show: [number, number][]}> = ({times, show}) => {
  const frame = useCurrentFrame();
  const win = show.find(([a, b]) => frame >= a && frame < b);
  if (!win) return null;
  const fadeIn = interpolate(frame, [win[0], win[0] + 6], [0, 1], clamp);
  const count = times.filter((t) => frame >= t).length;
  const SIZE = 132;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, zIndex: 6, opacity: fadeIn}}>
      {times.map((t, i) => {
        if (i >= count) return null;
        const newest = i === count - 1;
        const s = pop(frame, t, 8);
        const x = 46 + (i % 2) * 132, y = 470 + i * 150;
        const glow = newest ? 1 : 0.45;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: SIZE, transform: `scale(${s})`, textAlign: 'center'}}>
            <div style={{position: 'relative', width: SIZE, height: SIZE, borderRadius: 30, overflow: 'hidden',
              background: 'linear-gradient(160deg,#2A1A5E 0%,#190D32 60%,#0D0620 100%)',
              border: `2px solid rgba(185,154,245,${0.5 + 0.5 * glow})`,
              boxShadow: `0 0 ${18 + 22 * glow}px rgba(185,154,245,${0.35 + 0.45 * glow}), 0 0 ${50 * glow}px rgba(128,80,232,${0.5 * glow}), 0 14px 30px rgba(0,0,0,.45)`}}>
              <div style={{position: 'absolute', inset: 14}}>{THUMBS[i]}</div>
              <svg viewBox="0 0 100 100" width="100%" height="100%" style={{position: 'absolute', inset: 0}} preserveAspectRatio="none">
                {CRACKS.map((d, k) => <path key={k} d={d} fill="none" stroke="rgba(238,231,255,.35)" strokeWidth={0.8} />)}
              </svg>
              <div style={{position: 'absolute', left: 12, top: 8, font: `700 24px ${FONT.ui}`, color: C.mist, textShadow: '0 1px 6px rgba(0,0,0,.6)'}}>{i + 1}</div>
            </div>
            <div style={{marginTop: 8, font: `500 22px ${FONT.ui}`, color: 'rgba(238,231,255,.85)', textShadow: '0 2px 8px rgba(25,13,50,.9)'}}>{LABELS[i]}</div>
          </div>
        );
      })}
    </div>
  );
};
