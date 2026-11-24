/**
 * Motion graphics from the user's grid reference (WA0007), rebuilt in the purple palette:
 *  1. GlowProductCard — glass card, glowing icon tile, title / subtitle / stars, an orbiting light ring sweeping around it.
 *  2. AvatarOrbit     — ring of profile avatars orbiting the speaker, collapsing to the centre on a cue word.
 *  3. GaugeCounter    — circular gauge that counts up to a number, label + glowing wave underneath.
 */
import React from 'react';
import {interpolate, random, Easing} from 'remotion';
import {useCurrentFrame} from './frame';
import {C, FONT} from './theme';
import {pop} from './timing';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.out(Easing.cubic);

// ───────────────────────── 1. Glow product card ─────────────────────────
export const SiteGlyph: React.FC<{kind: string}> = ({kind}) => {
  const s = {fill: 'none', stroke: C.ink, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  if (kind === 'DefiLlama') return <svg viewBox="0 0 100 100" width="62%" height="62%"><path d="M12 76 C30 70 38 58 50 56 S68 36 88 22" {...s} /><circle cx={88} cy={22} r={7} fill={C.ink} /></svg>;
  if (kind === 'CoinGlass') return <svg viewBox="0 0 100 100" width="62%" height="62%"><rect x={14} y={52} width={16} height={32} rx={4} fill={C.ink} /><rect x={42} y={34} width={16} height={50} rx={4} fill={C.ink} /><rect x={70} y={16} width={16} height={68} rx={4} fill={C.ink} /></svg>;
  if (kind === 'CryptoQuant') return <svg viewBox="0 0 100 100" width="62%" height="62%"><circle cx={24} cy={50} r={11} {...s} /><circle cx={76} cy={26} r={11} {...s} /><circle cx={76} cy={74} r={11} {...s} /><path d="M34 45 L66 30 M34 55 L66 70" {...s} /></svg>;
  return <svg viewBox="0 0 100 100" width="62%" height="62%"><circle cx={50} cy={50} r={34} {...s} /><text x={50} y={64} textAnchor="middle" fontSize={40} fontWeight={800} fontFamily="DejaVu Sans" fill={C.ink}>₿</text></svg>;
};

export const GlowProductCard: React.FC<{at: number; out: number; name: string; title: string; sub: string; x: number; y: number; scale?: number; hue?: [string, string]}> = ({
  at, out, name, title, sub, x, y, scale = 1, hue = ['#D9C9FF', '#8B5CFF'],
}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > out + 8) return null;
  const p = interpolate(frame, [at, at + 12], [0, 1], {...cl, easing: ease});
  const o = interpolate(frame, [out, out + 8], [1, 0], cl);
  const W = 380, H = 450;
  const ringP = interpolate(frame, [at + 4, at + 22], [0, 1], cl);       // ring draws in
  const spin = (frame - at) * 4.2;                                          // then keeps orbiting
  return (
    <div style={{position: 'absolute', left: x - W / 2, top: y - H / 2, width: W, height: H, zIndex: 32, opacity: o,
      transform: `scale(${(0.7 + 0.3 * p) * scale}) translateY(${(1 - p) * 60}px)`, filter: `blur(${(1 - p) * 18 + (1 - o) * 14}px)`}}>
      {/* glow pool behind */}
      <div style={{position: 'absolute', inset: -140, borderRadius: '50%', background: `radial-gradient(50% 45% at 50% 50%,rgba(139,92,255,${0.55 * p}),transparent 70%)`}} />
      {/* orbiting light ring (ellipse around the card) */}
      <svg viewBox="-260 -300 520 600" style={{position: 'absolute', left: -70, top: -75, width: W + 140, height: H + 150, overflow: 'visible', zIndex: 3}}>
        <g transform={`rotate(${-18})`}>
          <ellipse cx={0} cy={0} rx={235} ry={270} fill="none" stroke="rgba(185,154,245,.18)" strokeWidth={3} />
          <ellipse cx={0} cy={0} rx={235} ry={270} fill="none" stroke="#F3EDFF" strokeWidth={7} strokeLinecap="round" pathLength={1}
            strokeDasharray={`${0.32 * ringP} 1`} strokeDashoffset={-spin / 360}
            style={{filter: `drop-shadow(0 0 10px ${C.lilac}) drop-shadow(0 0 26px ${C.violet})`}} />
        </g>
      </svg>
      {/* glass card */}
      <div style={{position: 'absolute', inset: 0, borderRadius: 54, overflow: 'hidden', zIndex: 2,
        background: 'linear-gradient(170deg,rgba(60,36,120,.85),rgba(25,13,50,.92))', border: '2px solid rgba(185,154,245,.45)',
        boxShadow: '0 30px 80px rgba(13,6,32,.7), inset 0 2px 0 rgba(238,231,255,.25)'}}>
        <div style={{position: 'absolute', left: '-10%', right: '-10%', bottom: 0, height: '45%', background: `radial-gradient(55% 60% at 50% 115%,#EEE7FF 0%,${C.lilac} 22%,rgba(128,80,232,.6) 45%,transparent 80%)`, opacity: 0.8}} />
        {/* icon tile */}
        <div style={{position: 'absolute', left: (W - 200) / 2, top: 44, width: 200, height: 200, borderRadius: 48,
          background: `linear-gradient(150deg,${hue[0]},${hue[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 50px rgba(139,92,255,.7), inset 0 4px 0 rgba(255,255,255,.6), inset 0 -12px 24px rgba(84,38,168,.5)`,
          transform: `scale(${pop(frame, at + 5, 9)})`}}>
          <SiteGlyph kind={name} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 272, textAlign: 'center', color: C.mist}}>
          <div style={{font: `700 46px ${FONT.display}`, letterSpacing: -1.2, opacity: interpolate(frame, [at + 9, at + 15], [0, 1], cl)}}>{title}</div>
          <div style={{font: `500 26px ${FONT.ui}`, color: 'rgba(238,231,255,.7)', marginTop: 4, opacity: interpolate(frame, [at + 12, at + 18], [0, 1], cl)}}>{sub}</div>
          <div style={{marginTop: 10, font: `700 30px ${FONT.ui}`, letterSpacing: 6, color: C.mist}}>
            {[0, 1, 2, 3, 4].map((i) => <span key={i} style={{display: 'inline-block', transform: `scale(${pop(frame, at + 16 + i * 2, 6)})`}}>★</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────── 2. Avatar orbit ring ─────────────────────────
const Avatar: React.FC<{seed: number; size: number}> = ({seed, size}) => {
  const skins = ['#F2C7A5', '#D9A27C', '#B97A56', '#8D5A3B', '#F5D3B8', '#C98E66'];
  const bgs = [['#B99AF5', '#5426A8'], ['#C65BF2', '#5426A8'], ['#8E9BFF', '#5426A8'], ['#FF7EC8', '#8050E8']];
  const hair = ['#1E1428', '#3A2618', '#6B4423', '#1A1A1A'];
  const r = (k: string) => random(`av${seed}${k}`);
  const bg = bgs[Math.floor(r('b') * bgs.length)], sk = skins[Math.floor(r('s') * skins.length)], hr = hair[Math.floor(r('h') * hair.length)];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{display: 'block', borderRadius: 22, boxShadow: `0 0 18px rgba(185,154,245,.6)`}}>
      <defs><linearGradient id={`avg${seed}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={bg[0]} /><stop offset="1" stopColor={bg[1]} /></linearGradient></defs>
      <rect width={100} height={100} rx={22} fill={`url(#avg${seed})`} />
      <ellipse cx={50} cy={100} rx={34} ry={26} fill={r('c') > 0.5 ? '#190D32' : '#EEE7FF'} />
      <circle cx={50} cy={46} r={20} fill={sk} />
      <path d={`M30 44 Q32 ${22 + r('t') * 6} 50 24 Q68 ${22 + r('u') * 6} 70 44 Q64 34 50 33 Q36 34 30 44Z`} fill={hr} />
    </svg>
  );
};

export const AvatarOrbit: React.FC<{at: number; collapse: number; out: number; cx: number; cy: number; r?: number; n?: number}> = ({at, collapse, out, cx, cy, r = 360, n = 9}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > out + 6) return null;
  const spin = (frame - at) * 0.9;
  const shrink = interpolate(frame, [collapse, collapse + 8], [1, 0], {...cl, easing: Easing.in(Easing.cubic)});
  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 31, pointerEvents: 'none'}}>
      {new Array(n).fill(0).map((_, i) => {
        const a = ((i / n) * 360 + spin) * Math.PI / 180;
        const born = at + i * 2;
        const s = pop(frame, born, 8) * (0.55 + 0.45 * shrink);
        const rr = r * shrink * (0.86 + 0.14 * Math.sin(i * 1.7));
        let x = cx + Math.cos(a) * rr * 1.12, y = cy + Math.sin(a) * rr * 0.78;
        // keep the face clear: face ellipse centred (540, 560), rx 230, ry 270 (+ avatar half-size margin)
        const fx = (x - 540) / (230 + 70), fy = (y - 560) / (270 + 70), dd = Math.hypot(fx, fy);
        if (dd < 1 && shrink > 0.5) { x = 540 + (x - 540) / Math.max(dd, 0.05); y = 560 + (y - 560) / Math.max(dd, 0.05); }
        const size = 104 + (i % 3) * 14;
        return (
          <div key={i} style={{position: 'absolute', left: x - size / 2, top: y - size / 2, transform: `scale(${s}) rotate(${Math.sin(a) * 8}deg)`,
            opacity: frame > collapse + 6 ? 0 : 1}}>
            <Avatar seed={i + 3} size={size} />
          </div>
        );
      })}
    </div>
  );
};

// ───────────────────────── 3. Gauge counter ─────────────────────────
export const GaugeCounter: React.FC<{at: number; out: number; value: number; kicker: string; label: string; x: number; y: number}> = ({at, out, value, kicker, label, x, y}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > out + 8) return null;
  const p = interpolate(frame, [at, at + 10], [0, 1], {...cl, easing: ease});
  const fill = interpolate(frame, [at + 4, at + 24], [0, 1], {...cl, easing: ease});
  const n = Math.round(fill * value);
  const o = interpolate(frame, [out, out + 8], [1, 0], cl);
  const R = 150, SW = 16, sweep = 270, a0 = 135;
  const arc = (from: number, to: number) => {
    const p0 = [Math.cos((from * Math.PI) / 180) * R, Math.sin((from * Math.PI) / 180) * R];
    const p1 = [Math.cos((to * Math.PI) / 180) * R, Math.sin((to * Math.PI) / 180) * R];
    return `M${p0[0]} ${p0[1]} A${R} ${R} 0 ${to - from > 180 ? 1 : 0} 1 ${p1[0]} ${p1[1]}`;
  };
  const wave = new Array(61).fill(0).map((_, i) => {
    const xx = -300 + i * 10, ph = (frame - at) / 6;
    return `${i ? 'L' : 'M'}${xx} ${Math.sin(i / 6 + ph) * 22 * Math.sin((i / 60) * Math.PI) + 0}`;
  }).join(' ');
  return (
    <div style={{position: 'absolute', left: x - 320, top: y - 260, width: 640, height: 560, zIndex: 32, opacity: o * p,
      transform: `scale(${0.8 + 0.2 * p})`, filter: `blur(${(1 - p) * 16}px)`}}>
      <div style={{position: 'absolute', inset: 40, borderRadius: '50%', background: 'radial-gradient(50% 50% at 50% 45%,rgba(25,13,50,.85),rgba(25,13,50,.4) 60%,transparent 75%)'}} />
      <svg viewBox="-320 -230 640 560" width={640} height={560} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stopColor={C.violet} /><stop offset="1" stopColor="#E3D6FF" /></linearGradient></defs>
        <path d={arc(a0, a0 + sweep)} fill="none" stroke="rgba(185,154,245,.18)" strokeWidth={SW} strokeLinecap="round" />
        {fill > 0.01 && <path d={arc(a0, a0 + sweep * fill)} fill="none" stroke="url(#gg)" strokeWidth={SW} strokeLinecap="round"
          style={{filter: `drop-shadow(0 0 12px ${C.lilac}) drop-shadow(0 0 30px ${C.violet})`}} />}
        <text x={0} y={-62} textAnchor="middle" fontFamily="Inter" fontWeight={600} fontSize={30} fill="rgba(238,231,255,.75)" letterSpacing={2}>{kicker}</text>
        <text x={0} y={62} textAnchor="middle" fontFamily="Inter Display" fontWeight={800} fontSize={170} fill={C.mist}
          style={{filter: `drop-shadow(0 0 18px ${C.lilac})`}}>{n}</text>
        <g transform="translate(0 235)">
          <path d={wave} fill="none" stroke={C.lilac} strokeWidth={6} strokeLinecap="round" opacity={0.9}
            style={{filter: `drop-shadow(0 0 10px ${C.lilac}) drop-shadow(0 0 26px ${C.violet})`}} />
        </g>
        <text x={0} y={190} textAnchor="middle" fontFamily="Inter" fontWeight={600} fontSize={40} fill={C.mist} opacity={interpolate(frame, [at + 18, at + 26], [0, 1], cl)}>{label}</text>
      </svg>
    </div>
  );
};
