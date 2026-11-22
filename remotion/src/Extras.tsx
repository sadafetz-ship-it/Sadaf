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

/** Stacked glossy 3D tiles counting the sites (ref R1 "1 / 2 / ? Holat"). */
export const StackTiles: React.FC<{times: number[]; show: [number, number][]}> = ({times, show}) => {
  const frame = useCurrentFrame();
  const visible = show.some(([a, b]) => frame >= a && frame < b);
  if (!visible) return null;
  const win = show.find(([a, b]) => frame >= a && frame < b)!;
  const fadeIn = interpolate(frame, [win[0], win[0] + 6], [0, 1], clamp);
  const count = times.filter((t) => frame >= t).length;
  const tiles = times.map((_, i) => String(i + 1));
  return (
    <div style={{position: 'absolute', left: 70, top: 600, width: 260, height: 360, zIndex: 6, opacity: fadeIn}}>
      {tiles.map((label, i) => {
        const isQ = label === '?';
        const idx = isQ ? count : i;
        if (!isQ && i >= count) return null;
        if (isQ && count >= times.length) return null;
        const at = isQ ? win[0] : times[i];
        const s = isQ ? 0.75 : pop(frame, at, 8);
        const depth = count - idx; // newest in front
        return (
          <div key={label} style={{position: 'absolute', left: 20 + depth * 46, top: 170 - depth * 70, width: 170, height: 170, borderRadius: 38,
            transform: `scale(${s * (1 - depth * 0.12)}) rotate(${-8 + depth * 7}deg)`, zIndex: 10 - depth, opacity: depth === 0 ? 1 : 0.75 - depth * 0.12,
            background: isQ ? 'rgba(185,154,245,.25)' : `linear-gradient(160deg,#D9C8FF 0%,${C.lilac} 35%,${C.violet} 100%)`,
            border: '2px solid rgba(238,231,255,.6)',
            boxShadow: `0 18px 40px rgba(25,13,50,.6), inset 0 3px 0 rgba(255,255,255,.6), inset 0 -10px 20px rgba(84,38,168,.5), 0 0 40px rgba(128,80,232,.5)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.mist}}>
            <div style={{font: `800 84px ${FONT.display}`, lineHeight: 0.9, textShadow: '0 3px 10px rgba(25,13,50,.4)'}}>{label}</div>
            <div style={{font: `600 22px ${FONT.ui}`, opacity: 0.9}}>{isQ ? 'next' : 'site'}</div>
          </div>
        );
      })}
    </div>
  );
};
