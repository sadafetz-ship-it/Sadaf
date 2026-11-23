/**
 * Motion graphics from the user's 2×2 reference grid (Nov 2026), recoloured to the Nexus cyan/blue palette.
 *  - GlowCard   : "advantage / Faster / Stronger / Unstoppable" product card — zoom-in from 1.3 + blur + white flash (8 f),
 *                 light panel on top (product/icon), dark lower half with bold italic title + subtitle, stars pop 1 per 2 f,
 *                 glowing rounded-square light ring rotating behind.
 *  - Gauge      : "Performance 48°" — pixel blocks burst out of a blurred card (≈12 f), label types on, number counts,
 *                 needle sweeps, subtitle types with the last word highlighted, glowing wave rises at the bottom.
 *  - TypingPill : "Bayerische Motoren Werke" — dark pill that grows as its text types on (≈1 char / frame).
 */
import React from 'react';
import {Easing, interpolate, interpolateColors, random, useCurrentFrame} from 'remotion';
import {C, FONT} from './theme';
import {f, tw} from './timing';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// ───────────────────────── glowing card ─────────────────────────
export const ICONS: Record<string, React.ReactNode> = {
  rocket: (
    <svg viewBox="0 0 64 64" width={150} height={150} fill="none" stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round">
      <path d="M32 6c9 6 14 16 14 28l-6 8H24l-6-8C18 22 23 12 32 6z" fill="#fff" />
      <circle cx="32" cy="26" r="5" fill={C.violet} />
      <path d="M18 34l-8 8 10 2M46 34l8 8-10 2" />
      <path d="M27 46c0 6 2 10 5 12 3-2 5-6 5-12" fill={C.blue} stroke={C.blue} />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 64 64" width={150} height={150} fill="none" stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round">
      <rect x="10" y="38" width="9" height="16" rx="2" fill="#fff" />
      <rect x="27" y="28" width="9" height="26" rx="2" fill="#fff" />
      <rect x="44" y="16" width="9" height="38" rx="2" fill={C.violet} />
      <path d="M10 28l16-12 10 6 18-14" stroke={C.blue} strokeWidth={4} />
      <path d="M46 8h8v8" stroke={C.blue} strokeWidth={4} />
    </svg>
  ),
  crown: (
    <svg viewBox="0 0 64 64" width={150} height={150} fill="none" stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round">
      <path d="M8 22l12 12 12-20 12 20 12-12-5 28H13z" fill="#fff" />
      <path d="M13 50h38" stroke={C.blue} strokeWidth={5} />
      <circle cx="32" cy="14" r="4" fill={C.violet} /><circle cx="8" cy="22" r="3.5" fill={C.violet} /><circle cx="56" cy="22" r="3.5" fill={C.violet} />
    </svg>
  ),
};

/** Rounded-square light ring: white-hot core + coloured glow, slowly rotating and breathing. */
const LightRing: React.FC<{w: number; h: number; color: string; at: number; seed: number}> = ({w, h, color, at, seed}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const rot = -18 + seed * 25 + t * 0.9;
  const breathe = 1 + 0.04 * Math.sin(t / 9);
  const o = interpolate(t, [0, 6], [0, 1], cl);
  const ring = (blur: number, width: number, col: string, op: number) => (
    <div style={{position: 'absolute', left: '50%', top: '50%', width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, borderRadius: '34%',
      border: `${width}px solid ${col}`, filter: `blur(${blur}px)`, opacity: op * o}} />
  );
  return (
    <div style={{position: 'absolute', inset: 0, transform: `rotate(${rot}deg) scale(${breathe}) skewX(${6 * Math.sin(t / 23)}deg)`, pointerEvents: 'none'}}>
      {ring(26, 30, color, 0.55)}
      {ring(8, 12, color, 0.9)}
      {ring(1.5, 5, '#FFFFFF', 0.95)}
    </div>
  );
};

export const GlowCard: React.FC<{
  title: string; sub: string; icon: keyof typeof ICONS; color: string; inAt: number; outAt: number; seed?: number;
  x?: number; y?: number; w?: number;
}> = ({title, sub, icon, color, inAt, outAt, seed = 0, x = 390, y = 925, w = 300}) => {
  const frame = useCurrentFrame();
  const S = f(inAt), E = f(outAt);
  if (frame < S - 1 || frame > E + 6) return null;
  const p = easeOut(interpolate(frame, [S, S + 8], [0, 1], cl));
  const out = interpolate(frame, [E - 1, E + 5], [1, 0], cl);
  const flash = interpolate(frame, [S, S + 2, S + 9], [0.9, 0.7, 0], cl);
  const H = w * 1.02, top = H * 0.52;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: H, zIndex: 8,
      opacity: interpolate(frame, [S - 1, S + 1], [0, 1], cl) * out,
      transformOrigin: '50% 0%', transform: `scale(${(1.15 - 0.15 * p) * (1 - 0.08 * (1 - out))})`, filter: `blur(${20 * (1 - p) + 14 * (1 - out)}px)`}}>
      <div style={{position: 'absolute', left: -w * 0.32, top: -H * 0.3, width: w * 1.64, height: H * 1.6}}>
        <LightRing w={w * 1.1} h={H * 0.94} color={color} at={S} seed={seed} />
      </div>
      <div style={{position: 'absolute', inset: 0, borderRadius: 64, overflow: 'hidden',
        boxShadow: `0 40px 80px -30px ${color}, 0 0 0 2px rgba(181,243,255,.35), 0 30px 60px rgba(0,0,0,.55)`}}>
        {/* light top panel with the icon */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: top, background: 'linear-gradient(180deg,#E9FCFF,#BDEFFF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{transform: `scale(${interpolate(frame, [S + 2, S + 10], [0.7, 1], {...cl, easing: Easing.out(Easing.back(2))})})`}}>{ICONS[icon]}</div>
        </div>
        {/* dark lower half */}
        <div style={{position: 'absolute', left: 0, right: 0, top, bottom: 0, background: `linear-gradient(180deg,#121B3A,#070C1A)`, textAlign: 'center', color: '#fff'}}>
          <div style={{marginTop: 26, font: `italic 800 ${Math.round(w * 0.135)}px ${FONT.display}`, letterSpacing: -1.5,
            opacity: tw(frame, S + 4, 6, 0, 1), transform: `translateY(${tw(frame, S + 4, 8, 14, 0)}px)`}}>{title}</div>
          <div style={{marginTop: 6, font: `500 ${Math.round(w * 0.062)}px ${FONT.ui}`, color: C.lilac,
            opacity: tw(frame, S + 6, 6, 0, 1)}}>{sub}</div>
          <div style={{marginTop: 10, display: 'flex', justifyContent: 'center', gap: 8}}>
            {[0, 1, 2, 3, 4].map((i) => {
              const a = S + 9 + i * 2;
              const s = interpolate(frame, [a, a + 3, a + 5], [0, 1.4, 1], cl);
              return <svg key={i} width={w * 0.07} height={w * 0.07} viewBox="0 0 24 24" style={{transform: `scale(${s})`, filter: `drop-shadow(0 0 6px ${color})`}}>
                <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" fill="#fff" />
              </svg>;
            })}
          </div>
        </div>
        {/* bright bottom edge */}
        <div style={{position: 'absolute', left: '8%', right: '8%', bottom: 0, height: 4, background: color, boxShadow: `0 0 18px ${color}`}} />
        <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} />
      </div>
    </div>
  );
};

// ───────────────────────── typing pill ─────────────────────────
export const TypingPill: React.FC<{text: string; at: number; end: number; y: number}> = ({text, at, end, y}) => {
  const frame = useCurrentFrame();
  const S = f(at), E = f(end);
  if (frame < S || frame > E + 5) return null;
  const n = Math.min(text.length, Math.max(0, Math.floor((frame - S - 4) * 1.2)));
  const pop = interpolate(frame, [S, S + 4, S + 6], [0.4, 1.08, 1], cl);
  const out = interpolate(frame, [E - 1, E + 4], [1, 0], cl);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', zIndex: 9, opacity: out}}>
      <span style={{display: 'inline-flex', alignItems: 'center', gap: 4, minWidth: 90, minHeight: 72, justifyContent: 'center', padding: '14px 36px',
        borderRadius: 18, background: 'rgba(7,12,26,.92)', border: '1.5px solid rgba(181,243,255,.35)', color: '#fff', font: `500 38px ${FONT.ui}`,
        boxShadow: '0 12px 30px rgba(0,0,0,.45)', transform: `scale(${pop})`, whiteSpace: 'nowrap'}}>
        {text.slice(0, n)}
        {n < text.length && <span style={{width: 3, height: 40, background: C.violet, boxShadow: `0 0 8px ${C.violet}`, opacity: frame % 8 < 5 ? 1 : 0}} />}
      </span>
    </div>
  );
};

// ───────────────────────── gauge ─────────────────────────
/** Pixel-block burst: squares fly out from the card edges and fade (≈12 f). */
const PixelBurst: React.FC<{at: number; w: number; h: number}> = ({at, w, h}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 16) return null;
  const cols = [C.violet, C.lilac, C.blue, '#D6F8FF', '#2F7BFF'];
  return (
    <>
      {new Array(46).fill(0).map((_, i) => {
        const ang = random(`pb${i}`) * Math.PI * 2;
        const r0 = 0.45 + random(`pr${i}`) * 0.2, sp = 18 + random(`ps${i}`) * 40;
        const sz = [28, 36, 48, 60][Math.floor(random(`pz${i}`) * 4)];
        const x = Math.cos(ang) * (w * r0 + sp * t), y = Math.sin(ang) * (h * r0 + sp * t * 0.8);
        const o = interpolate(t, [0, 2, 8 + random(`po${i}`) * 6], [0, 0.9, 0], cl);
        const col = cols[i % cols.length];
        return <div key={i} style={{position: 'absolute', left: '50%', top: '50%', width: sz, height: sz, marginLeft: x - sz / 2, marginTop: y - sz / 2,
          background: col, opacity: o * 0.8, boxShadow: `0 0 16px ${col}`, filter: `blur(${random(`pf${i}`) > 0.6 ? 3 : 0}px)`}} />;
      })}
    </>
  );
};

export const Gauge: React.FC<{at: number; label: string; value: string; p: number; sub: string; subAccent: string; subAt: number; x: number; y: number; w: number}> = ({
  at, label, value, p, sub, subAccent, subAt, x, y, w,
}) => {
  const frame = useCurrentFrame();
  const S = f(at);
  if (frame < S) return null;
  const h = w * 0.86;
  const q = easeOut(interpolate(frame, [S, S + 10], [0, 1], cl));
  const lab = label.slice(0, Math.max(0, Math.floor((frame - S - 6) * 1.3)));
  const ang = -90 + 180 * p;
  const R = w * 0.36, cx = w / 2, cy = h * 0.72;
  const full = sub + subAccent;
  const ns = Math.max(0, Math.floor((frame - f(subAt)) * 1.2));
  const accentCol = interpolateColors(frame, [f(subAt) + sub.length, f(subAt) + sub.length + 14], [C.violet, '#FFFFFF']);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h + 90, zIndex: 8}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h}}><PixelBurst at={S} w={w} h={h} /></div>
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: 70, overflow: 'hidden',
        transform: `scale(${1.15 - 0.15 * q})`, filter: `blur(${18 * (1 - q)}px)`, opacity: interpolate(frame, [S, S + 3], [0, 1], cl),
        background: 'linear-gradient(180deg,#121B3A 0%,#0B1226 55%,#16305E 100%)', border: '2px solid rgba(181,243,255,.4)',
        boxShadow: `inset 0 -40px 60px -20px ${C.violet}, 0 0 50px rgba(63,224,255,.35)`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 34, textAlign: 'center', font: `500 ${Math.round(w * 0.07)}px ${FONT.ui}`, color: C.lilac}}>{lab}</div>
        <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
          <path d={`M${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} stroke="rgba(181,243,255,.25)" strokeWidth={4} fill="none" />
          <path d={`M${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} stroke={C.violet} strokeWidth={6} fill="none" pathLength={1}
            strokeDasharray={`${p} 1`} style={{filter: `drop-shadow(0 0 8px ${C.violet})`}} />
          <line x1={cx + Math.cos((ang - 90) * Math.PI / 180) * R * 0.78} y1={cy + Math.sin((ang - 90) * Math.PI / 180) * R * 0.78} x2={cx + Math.cos((ang - 90) * Math.PI / 180) * R * 0.92} y2={cy + Math.sin((ang - 90) * Math.PI / 180) * R * 0.92}
            stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.95} />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.33, textAlign: 'center', font: `600 ${Math.round(w * 0.24)}px ${FONT.display}`,
          letterSpacing: -6, color: '#fff', textShadow: `0 0 24px rgba(63,224,255,.6)`}}>{value}</div>
      </div>
      <div style={{position: 'absolute', left: -100, right: -100, top: h + 24, textAlign: 'center', font: `500 ${Math.round(w * 0.095)}px ${FONT.ui}`, color: '#fff', whiteSpace: 'nowrap'}}>
        {full.slice(0, Math.min(ns, sub.length))}
        <span style={{color: accentCol, textShadow: `0 0 14px ${C.violet}`}}>{ns > sub.length ? full.slice(sub.length, ns) : ''}</span>
      </div>
    </div>
  );
};

/** Glowing wave ribbon rising at the bottom (gauge scene). */
export const GlowWave: React.FC<{at: number; y: number}> = ({at, y}) => {
  const frame = useCurrentFrame();
  const t = frame - f(at);
  if (t < 0) return null;
  const amp = tw(frame, f(at), 20, 0, 1) * 150;
  const pts = new Array(41).fill(0).map((_, i) => {
    const x = -60 + i * 30;
    const yy = y - amp * Math.exp(-Math.pow((x - 540 - 60 * Math.sin(t / 30)) / 260, 2)) - 20 * Math.sin(i / 3 + t / 10);
    return `${i ? 'L' : 'M'}${x} ${yy.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <path d={pts} stroke={C.violet} strokeWidth={34} fill="none" opacity={0.35} style={{filter: 'blur(18px)'}} />
      <path d={pts} stroke={C.lilac} strokeWidth={10} fill="none" opacity={0.8} style={{filter: 'blur(4px)'}} />
      <path d={pts} stroke="#fff" strokeWidth={3} fill="none" />
    </svg>
  );
};
