// Shared motion + documentary helpers. All timings are in seconds at 30 fps and were
// measured frame by frame from the reference reels (see storyboard/einstein/ANIMATION_SPEC.md).
import React from 'react';
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from 'remotion';

export const FPS = 30;
export const F = 1 / FPS;
export const RED = '#b3122a', YEL = '#e9c93b', LIME = '#c8e63c';

export const E = {
  x: (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)), // expo-out: snappy entrances
  o3: (t: number) => 1 - Math.pow(1 - t, 3),
  io: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  i3: (t: number) => t * t * t,
  back: (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};
export const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const P = (t: number, a: number, b: number) => cl((t - a) / (b - a));
export const img = (f: string) => staticFile(`img/${f}`);

/** Scene-local time in seconds (inside a <Sequence>). */
export const useT = () => useCurrentFrame() / FPS;

/** Handheld drift: smooth multi-sine noise, measured at ±5 px / ±0.22° in the references. */
export const handheld = (gt: number) => {
  const n = (a: number, b: number, c: number) => Math.sin(gt * a) + 0.6 * Math.sin(gt * b + 1.3) + 0.3 * Math.sin(gt * c + 2.1);
  return { x: n(0.9, 2.3, 5.1) * 5, y: n(1.1, 2.9, 4.3) * 4, r: n(0.7, 1.9, 3.7) * 0.22 };
};

/** Camera wrapper: push/dolly/whip + handheld drift + optional blur (rack focus). */
export const Cam: React.FC<{ gt: number; s?: number; x?: number; y?: number; r?: number; blur?: number; origin?: string; children: React.ReactNode }> =
  ({ gt, s = 1, x = 0, y = 0, r = 0, blur = 0, origin = '50% 50%', children }) => {
    const h = handheld(gt);
    return (
      <AbsoluteFill style={{ transformOrigin: origin, transform: `translate(${x + h.x}px,${y + h.y}px) scale(${s * 1.015}) rotate(${r + h.r}deg)`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
        {children}
      </AbsoluteFill>
    );
  };

/** Letter typing: 1 letter every `fpc` frames (2 f in the references). */
export const typed = (s: string, t: number, t0: number, fpc = 2) => (t < t0 ? '' : s.slice(0, Math.floor((t - t0) / (fpc * F)) + 1));

/** Word-by-word reveal: each word blur-ins (expo) and rises 28 px. Use '\n' for line breaks. */
export const Words: React.FC<{ items: [number, string][]; t: number; blurF?: number; style?: React.CSSProperties }> = ({ items, t, blurF = 4, style }) => (
  <div style={style}>
    {items.filter(([tm]) => t >= tm).map(([tm, w], i) => {
      if (w === '\n') return <br key={i} />;
      const q = E.x(P(t, tm, tm + (blurF + 3) * F));
      return (
        <span key={i} style={{ display: 'inline-block', marginRight: '0.25em', transform: `translateY(${(1 - q) * 28}px)`, filter: `blur(${(1 - q) * 14}px)`, opacity: Math.min(1, q * 2.5) }}>{w}</span>
      );
    })}
  </div>
);

/** Blur-in + rise for a whole element. */
export const Reveal: React.FC<{ t: number; t0: number; f?: number; max?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ t, t0, f = 6, max = 14, style, children }) => {
  const p = E.x(P(t, t0, t0 + (f + 3) * F));
  return <div style={{ ...style, filter: `blur(${(1 - p) * max}px)`, opacity: t < t0 ? 0 : Math.min(1, p * 2.5), translate: `0 ${(1 - p) * 24}px` }}>{children}</div>;
};

/** Hand-drawn path that draws on over `f` frames. */
export const Draw: React.FC<{ d: string; vb: string; t: number; t0: number; f: number; color: string; width: number; style: React.CSSProperties }> = ({ d, vb, t, t0, f, color, width, style }) => {
  const p = E.o3(P(t, t0, t0 + f * F));
  if (p <= 0.001) return null;
  return (
    <svg viewBox={vb} preserveAspectRatio="none" style={{ position: 'absolute', overflow: 'visible', ...style }}>
      <path d={d} fill="none" stroke={color} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} vectorEffect="non-scaling-stroke" style={{ strokeWidth: width }} />
    </svg>
  );
};
export const SCRIBBLE = 'M60 6 C20 2,2 30,8 58 C14 88,60 98,84 78 C100 62,96 20,62 10 C40 4,14 20,12 44';
export const ELLIPSE = 'M8 30 C4 10,60 2,90 12 C102 18,96 40,60 45 C30 49,6 40,10 26 C14 16,40 9,70 9';
export const ARC = 'M95 8 C40 -4,0 20,8 40 C14 54,60 58,96 48';

/** Cut-out photo: B&W, slight red/cyan fringing (all references), soft bottom fade. */
export const Cut: React.FC<{ src: string; style: React.CSSProperties }> = ({ src, style }) => (
  <Img src={img(src)} style={{ position: 'absolute', WebkitMaskImage: 'linear-gradient(#000 82%,transparent 99%)',
    filter: 'grayscale(1) contrast(1.1) drop-shadow(2px 0 0 rgba(255,40,40,.28)) drop-shadow(-2px 0 0 rgba(40,220,255,.28)) drop-shadow(0 20px 40px rgba(0,0,0,.6))', ...style }} />
);

/** Parallax dolly: subject moves toward camera faster than background (+fs vs +bs). */
export const dolly = (t: number, d: number, fs = 0.22) => ({
  transformOrigin: '50% 100%',
  transform: `translateY(${-20 * t / d}px) scale(${1 + fs * E.io(cl(t / d))}) rotate(${Math.sin(t * 1.7) * 0.6}deg)`,
});

/** Archival gate weave + exposure flicker for old photos. */
export const useWeave = () => {
  const f = useCurrentFrame();
  return { transform: `translate(${(random(`wx${f}`) - 0.5) * 2.4}px,${(random(`wy${f}`) - 0.5) * 2.4}px)`, filter: `brightness(${1 + (random(`fl${f}`) - 0.5) * 0.06})` };
};

/** Taped print with white border (Ref 2 top-down desk). */
export const Card: React.FC<{ src: string; x: number; y: number; w: number; h: number; r: number; pos?: string; style?: React.CSSProperties }> = ({ src, x, y, w, h, r, pos = 'center', style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, padding: 14, background: '#f4f2ec', transform: `rotate(${r}deg)`, boxShadow: '0 14px 30px rgba(0,0,0,.4)', ...style }}>
    <div style={{ width: '100%', height: '100%', backgroundImage: `url(${img(src)})`, backgroundSize: 'cover', backgroundPosition: pos, filter: 'grayscale(1) contrast(1.1)' }} />
  </div>
);
export const Tape: React.FC<{ x: number; y: number; r: number; w?: number; show?: boolean }> = ({ x, y, r, w = 150, show = true }) =>
  show ? <div style={{ position: 'absolute', left: x, top: y, width: w, height: 44, background: 'rgba(236,226,196,.85)', transform: `rotate(${r}deg)`, boxShadow: '0 2px 4px rgba(0,0,0,.15)' }} /> : null;
export const Pin: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: 'absolute', left: x - 14, top: y - 14, width: 28, height: 28, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%,#ff8a8a,#c3121f 55%,#6d0a10)', boxShadow: '3px 5px 6px rgba(0,0,0,.45)' }} />
);

/** Diagonal window-light shadow bars that drift (Ref 2, Ref 1 opening). */
export const WindowShadow: React.FC<{ t: number; o?: number }> = ({ t, o = 0.35 }) => (
  <div style={{ position: 'absolute', left: -400, top: -200, width: 2720, height: 1480, transform: `translate(${t * 40}px,${t * 12}px)`, mixBlendMode: 'multiply', filter: 'blur(22px)',
    background: `repeating-linear-gradient(125deg,rgba(0,0,0,0) 0 220px,rgba(0,0,0,${o}) 220px 330px,rgba(0,0,0,0) 330px 520px)` }} />
);

// ---------------- Documentary touches ----------------

/** Location / date lower-third: red tick + line draws on, small-caps title and subtitle rise in, then fade. */
export const LowerThird: React.FC<{ t: number; t0: number; title: string; sub?: string; dur?: number; dark?: boolean }> = ({ t, t0, title, sub, dur = 2.2, dark = false }) => {
  if (t < t0 || t > t0 + dur + 0.4) return null;
  const line = E.o3(P(t, t0, t0 + 8 * F)), a = E.x(P(t, t0 + 4 * F, t0 + 14 * F)), b = E.x(P(t, t0 + 8 * F, t0 + 18 * F)), out = 1 - P(t, t0 + dur, t0 + dur + 0.35);
  const c = dark ? '#1c1c1c' : '#fff';
  return (
    <div style={{ position: 'absolute', left: 110, bottom: 120, opacity: out, color: c, textShadow: dark ? 'none' : '0 2px 10px rgba(0,0,0,.6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 14, height: 14, background: RED, transform: `scale(${line})` }} />
        <div style={{ height: 2, width: 420 * line, background: c, opacity: 0.8 }} />
      </div>
      <div style={{ font: '700 34px Poppins', letterSpacing: 7, marginTop: 14, opacity: a, transform: `translateY(${(1 - a) * 16}px)` }}>{title}</div>
      {sub && <div style={{ font: 'italic 400 30px "Bodoni Moda"', marginTop: 6, opacity: b, transform: `translateY(${(1 - b) * 14}px)` }}>{sub}</div>}
    </div>
  );
};

/** Small archival source credit, bottom-right (documentary convention). */
export const Credit: React.FC<{ text: string; dark?: boolean; top?: boolean }> = ({ text, dark = false, top = false }) => (
  <div style={{ position: 'absolute', right: 40, ...(top ? { top: 30 } : { bottom: 34 }), font: '400 17px "Special Elite"', letterSpacing: 1, color: dark ? 'rgba(20,20,20,.65)' : 'rgba(255,255,255,.7)', textShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,.8)' }}>{text}</div>
);

/** Handwritten tag (pencil note on archival material). */
export const Note: React.FC<{ t: number; t0: number; text: string; style: React.CSSProperties; color?: string }> = ({ t, t0, text, style, color = '#1d1d1d' }) => {
  const s = typed(text, t, t0, 1);
  return s ? <div style={{ position: 'absolute', font: '700 40px Caveat', color, whiteSpace: 'nowrap', ...style }}>{s}</div> : null;
};

/** Concept label: thin box with small caps, used to name the physics (Vox-style annotation). */
export const Concept: React.FC<{ t: number; t0: number; text: string; style: React.CSSProperties; dark?: boolean }> = ({ t, t0, text, style, dark }) => {
  const p = E.x(P(t, t0, t0 + 8 * F));
  if (t < t0) return null;
  const c = dark ? '#222' : '#f3ead2';
  return (
    <div style={{ position: 'absolute', font: '700 24px Poppins', letterSpacing: 5, color: c, border: `2px solid ${c}`, padding: '8px 18px', opacity: p, transform: `translateY(${(1 - p) * 14}px)`, ...style }}>{text}</div>
  );
};

/** Light leak sweep for transitions. */
export const LightLeak: React.FC<{ t: number; t0: number; dur?: number }> = ({ t, t0, dur = 0.6 }) => {
  const p = P(t, t0, t0 + dur);
  if (p <= 0 || p >= 1) return null;
  const a = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: a, pointerEvents: 'none',
      background: `radial-gradient(ellipse 60% 80% at ${-10 + p * 120}% 40%, rgba(255,150,60,.85), rgba(255,60,30,.35) 40%, transparent 70%), radial-gradient(ellipse 40% 60% at ${110 - p * 90}% 70%, rgba(255,220,150,.6), transparent 60%)` }} />
  );
};

/** Film texture over the whole piece: animated grain, dust specks, occasional hair/scratch, vignette, flicker. */
export const FilmTexture: React.FC = () => {
  const f = useCurrentFrame();
  const specks = Array.from({ length: 7 }, (_, i) => ({ x: random(`sx${f}-${i}`) * 1920, y: random(`sy${f}-${i}`) * 1080, r: 1 + random(`sr${f}-${i}`) * 3.5, o: random(`so${f}-${i}`) * 0.5, dark: random(`sd${f}-${i}`) > 0.4 }));
  const hair = random(`h${f}`) > 0.86, scratch = random(`s${Math.floor(f / 4)}`) > 0.7;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width="1920" height="1080" style={{ position: 'absolute', opacity: 0.22, mixBlendMode: 'overlay' }}>
        <filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} seed={f % 97} /></filter>
        <rect width="100%" height="100%" filter="url(#g)" />
      </svg>
      {specks.map((s, i) => <div key={i} style={{ position: 'absolute', left: s.x, top: s.y, width: s.r * 2, height: s.r * 2, borderRadius: '50%', background: s.dark ? '#000' : '#fff', opacity: s.o }} />)}
      {hair && <svg width="1920" height="1080" style={{ position: 'absolute', opacity: 0.35 }}><path d={`M${random(`hx${f}`) * 1900} ${random(`hy${f}`) * 1000} q 30 ${20 + random(`hq${f}`) * 40} ${60} ${-10} t 50 30`} stroke="#000" strokeWidth={1.4} fill="none" /></svg>}
      {scratch && <div style={{ position: 'absolute', left: random(`sxx${Math.floor(f / 4)}`) * 1920, top: 0, width: 1.5, height: 1080, background: 'rgba(255,255,255,.18)' }} />}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%,transparent 40%,rgba(0,0,0,.6) 100%)' }} />
      <AbsoluteFill style={{ background: '#000', opacity: (random(`fk${f}`) - 0.5) * 0.05 + 0.025 }} />
    </AbsoluteFill>
  );
};
