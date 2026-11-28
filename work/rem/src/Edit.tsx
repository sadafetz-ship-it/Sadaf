import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing,
} from 'remotion';

// ---------------------------------------------------------------------------
// First edited minute — "If I Started an AI Marketing Agency In 2026" (Clay Lawrence)
// Style follows the two "Overall style for layouts and edit" references in the editing notes:
//  - light graphics on a soft gradient with blurred brand-colour glows (ref 1)
//  - dark graphics with brand-colour sweeping curves, diagrams with dashed connectors (ref 2)
//  - cards fade in empty, then words pop in one by one; proof numbers count up in place
//  - "LATER IN THIS VIDEO" over a blurred montage of real screen footage, face-cam bottom right
//  - talking-head shots stay clean (no captions); cuts hidden by crop-ins at sentence breaks
// Times are seconds on the edited timeline (from the transcript of the cut).
// ---------------------------------------------------------------------------

export const DURATION = Math.round(64.43 * 30);
const FPS = 30;
const G = '#0F782B';        // Clay's brand green (only hex supplied)
const G2 = '#22b357';       // brighter tint of the brand green for dark backgrounds
const INK = '#141414';
const F = (s: number) => Math.round(s * FPS);
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const fontCss = `
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-latin-400-normal.woff2')});font-weight:400}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-latin-500-normal.woff2')});font-weight:500}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-latin-600-normal.woff2')});font-weight:600}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-latin-700-normal.woff2')});font-weight:700}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-latin-500-italic.woff2')});font-weight:500;font-style:italic}
`;

// Absolute-timeline frame inside a Sequence
const useT = (base: number) => useCurrentFrame() + base;
const fade = (f: number, at: number, len = 6) => interpolate(f, [F(at), F(at) + len], [0, 1], {...clamp, easing: ease});

// ---- word pop (fade + small rise), as in both references --------------------
type W = {t: string; at: number; c?: string};
const Word: React.FC<{w: W; base: number}> = ({w, base}) => {
  const p = fade(useT(base), w.at, 5);
  return <span style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 12}px)`, color: w.c, whiteSpace: 'pre'}}>{w.t}</span>;
};
const Words: React.FC<{ws: W[]; base: number}> = ({ws, base}) => (
  <>{ws.map((w, i) => <React.Fragment key={i}><Word w={w} base={base} />{i < ws.length - 1 ? ' ' : ''}</React.Fragment>)}</>
);
// quick stagger helper: words of a phrase popping 0.12 s apart from `at`
const pop = (text: string, at: number, c?: string, step = 0.12): W[] => text.split(' ').map((t, i) => ({t, at: at + i * step, c}));

// ---- backgrounds -------------------------------------------------------------
const LightBg: React.FC<{base: number}> = ({base}) => {
  const f = useT(base);
  const d = Math.sin(f / 90) * 40;            // very slow drift of the glows
  return (
    <AbsoluteFill style={{background: '#f4f6f4'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${12 + d / 20}% ${85 - d / 30}%, rgba(34,179,87,.45), transparent 38%)`, filter: 'blur(30px)'}} />
      <AbsoluteFill style={{background: `radial-gradient(circle at ${88 - d / 25}% ${14 + d / 30}%, rgba(15,120,43,.30), transparent 36%)`, filter: 'blur(30px)'}} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 92% 88%, rgba(180,235,200,.70), transparent 30%)`, filter: 'blur(30px)'}} />
    </AbsoluteFill>
  );
};

const DarkBg: React.FC<{base: number}> = ({base}) => {
  const f = useT(base);
  const s = interpolate(f - base, [0, 120], [1, 1.04], clamp);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1a1c1a, #070807 75%)'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', transform: `scale(${s})`, transformOrigin: '50% 50%'}}>
        <defs><filter id="glow"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        {[
          'M -80 330 C 260 300, 380 60, 640 -40',
          'M 1480 1140 C 1560 900, 1760 820, 2000 600',
          'M 1640 1140 C 1700 980, 1840 940, 2000 860',
        ].map((d, i) => <path key={i} d={d} stroke={G2} strokeWidth={i === 2 ? 6 : 10} fill="none" opacity={0.85} filter="url(#glow)" strokeLinecap="round" />)}
      </svg>
    </AbsoluteFill>
  );
};

// ---- footage -----------------------------------------------------------------
const Footage: React.FC<{base: number; scale?: number}> = ({base, scale = 1}) => (
  <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '950px 120px'}}>
    <OffthreadVideo src={staticFile('base.mp4')} startFrom={base} muted style={{width: 1920, height: 1080}} />
  </AbsoluteFill>
);
// Face-cam: rounded square, even white border, bottom-right like ref 2
const FaceCam: React.FC<{base: number; x?: number; y?: number; w?: number; h?: number}> = ({base, x = 1550, y = 680, w = 300, h = 330}) => {
  const s = w / 560, fx = 950, fy = 470;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 30, border: '6px solid #fff', overflow: 'hidden', boxShadow: '0 18px 50px rgba(0,0,0,.4)', background: '#222'}}>
      <div style={{position: 'absolute', left: w / 2 - 6 - fx * s, top: h / 2 - 6 - fy * s, width: 1920 * s, height: 1080 * s}}>
        <OffthreadVideo src={staticFile('base.mp4')} startFrom={base} muted style={{width: '100%', height: '100%'}} />
      </div>
    </div>
  );
};

// Card that fades in empty first, then its content pops (both references)
const Card: React.FC<{base: number; at: number; style: React.CSSProperties; dark?: boolean; children: React.ReactNode}> = ({base, at, style, dark, children}) => {
  const p = fade(useT(base), at, 6);
  return (
    <div style={{position: 'absolute', borderRadius: 30, background: dark ? 'rgba(38,40,38,.92)' : '#fff', boxShadow: dark ? '0 24px 70px rgba(0,0,0,.55)' : '0 24px 70px rgba(15,60,30,.16)', opacity: p, transform: `scale(${0.96 + 0.04 * p})`, ...style}}>
      {children}
    </div>
  );
};

// ---- beats -------------------------------------------------------------------

const TH: React.FC<{base: number}> = ({base}) => <Footage base={base} />;
const THCrop: React.FC<{base: number}> = ({base}) => <Footage base={base} scale={1.12} />;

// 02 · "I wouldn't start by building some AI tool or some custom software."
const Window: React.FC<{x: number; title: string; at: number; dimAt: number; base: number; children: React.ReactNode}> = ({x, title, at, dimAt, base, children}) => {
  const f = useT(base);
  const o = fade(f, at, 6);
  const dim = interpolate(f, [F(dimAt), F(dimAt) + 6], [1, 0.45], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: 330, width: 620, height: 420, opacity: o * dim, transform: `translateY(${(1 - o) * 20}px) scale(${0.96 + 0.04 * o})`, background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,.6)'}}>
      <div style={{height: 52, background: '#f1f1f1', display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px'}}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => <i key={c} style={{width: 14, height: 14, borderRadius: 7, background: c, display: 'inline-block'}} />)}
        <span style={{marginLeft: 14, fontSize: 24, fontWeight: 600, color: '#444'}}>{title}</span>
      </div>
      <div style={{padding: '26px 30px'}}>{children}</div>
    </div>
  );
};
const B02: React.FC<{base: number}> = ({base}) => {
  const f = useT(base);
  const strike = interpolate(f, [F(7.28), F(7.28) + 6], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <DarkBg base={base} />
      <Card base={base} at={4.36} dark style={{left: 560, top: 120, width: 800, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: 56, fontWeight: 600, color: '#fff'}}><Words base={base} ws={[...pop("What I wouldn't", 4.46), ...pop('start with', 4.76, G2)]} /></div>
      </Card>
      <Window x={290} title="AI Tool" at={5.72} dimAt={7.28} base={base}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, fontSize: 26}}>
          <div style={{alignSelf: 'flex-end', background: G, color: '#fff', borderRadius: 18, padding: '14px 20px'}}>Write 5 review replies for my client</div>
          <div style={{background: '#eef0f2', borderRadius: 18, padding: '14px 20px', width: '80%'}}>Sure! Here are five replies…</div>
          <div style={{background: '#eef0f2', borderRadius: 18, height: 52, width: '60%'}} />
        </div>
      </Window>
      <Window x={1010} title="custom-software.js" at={6.86} dimAt={7.28} base={base}>
        <pre style={{fontFamily: 'monospace', fontSize: 26, lineHeight: 1.6, color: '#333', margin: 0}}>{`const app = createApp({
  reviews: true,
  crm: true,
  billing: 'stripe',
});
// 6 months of building…`}</pre>
      </Window>
      <div style={{position: 'absolute', left: 240, top: 545, width: 1440 * strike, height: 10, background: '#ff4d4d', borderRadius: 6, transform: 'rotate(-5deg)', transformOrigin: 'left center', boxShadow: '0 0 30px rgba(255,77,77,.6)'}} />
    </AbsoluteFill>
  );
};

// 04 · "which is more customers from Google." (illustrative local search)
const Listing: React.FC<{name: string; rating: string; rev: string; hi?: number}> = ({name, rating, rev, hi = 0}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 26, padding: '22px 30px', borderRadius: 20, outline: `6px solid rgba(15,120,43,${hi})`, background: `rgba(242,250,244,${hi})`}}>
    <div style={{width: 90, height: 90, borderRadius: 16, background: 'linear-gradient(135deg,#d9e7dd,#b8cfbf)'}} />
    <div style={{flex: 1}}>
      <div style={{fontSize: 32, fontWeight: 600}}>{name}</div>
      <div style={{fontSize: 25, color: '#555'}}>{rating} <span style={{color: '#f5a623'}}>★★★★★</span> ({rev}) · House cleaning · Open now</div>
    </div>
    <div style={{border: `3px solid ${G}`, color: G, fontSize: 25, padding: '9px 28px', borderRadius: 999, fontWeight: 700}}>Call</div>
  </div>
);
const B04: React.FC<{base: number}> = ({base}) => {
  const hi = fade(useT(base), 12.56, 6);
  return (
    <AbsoluteFill>
      <LightBg base={base} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 95, textAlign: 'center', fontSize: 74, fontWeight: 700, color: INK}}>
        <Words base={base} ws={[{t: 'More', at: 11.10}, {t: 'customers', at: 11.40}, {t: 'from', at: 12.16}, {t: 'Google', at: 12.50, c: G}]} />
      </div>
      <Card base={base} at={11.04} style={{left: 340, top: 250, width: 1240, padding: '32px 38px'}}>
        <div style={{border: '2px solid #dfe1e5', borderRadius: 999, padding: '16px 32px', fontSize: 29, color: '#333', marginBottom: 20}}>🔍&nbsp; house cleaner near me</div>
        <Listing name="Sparkle Home Cleaning" rating="4.9" rev="212" hi={hi} />
        <Listing name="Bright Maids Co." rating="4.6" rev="87" />
        <Listing name="City Clean Pros" rating="4.3" rev="41" />
      </Card>
      <div style={{position: 'absolute', right: 40, bottom: 24, fontSize: 22, color: '#7a7a7a', fontWeight: 500}}>Illustration</div>
    </AbsoluteFill>
  );
};

// 06 · flow diagram with dashed connectors (ref 2)
const Box: React.FC<{base: number; at: number; x: number; y: number; w: number; children: React.ReactNode; accent?: boolean}> = ({base, at, x, y, w, children, accent}) => {
  const p = fade(useT(base), at, 6);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: 150, borderRadius: 26, background: 'rgba(38,40,38,.95)', border: accent ? `3px solid ${G2}` : '2px solid rgba(255,255,255,.08)', boxShadow: accent ? `0 0 50px rgba(34,179,87,.35)` : '0 20px 60px rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#fff', fontSize: 44, fontWeight: 600, lineHeight: 1.15, opacity: p, transform: `scale(${0.94 + 0.06 * p})`}}>
      {children}
    </div>
  );
};
const Dash: React.FC<{base: number; at: number; x1: number; x2: number; y: number}> = ({base, at, x1, x2, y}) => {
  const p = interpolate(useT(base), [F(at), F(at) + 8], [0, 1], {...clamp, easing: ease});
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <line x1={x1} y1={y} x2={x1 + (x2 - x1) * p} y2={y} stroke="#fff" strokeOpacity={0.85} strokeWidth={6} strokeDasharray="18 16" strokeLinecap="round" />
      {p > 0.98 && <path d={`M ${x2 - 16} ${y - 14} L ${x2} ${y} L ${x2 - 16} ${y + 14}`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};
const B06: React.FC<{base: number}> = ({base}) => {
  const lab = fade(useT(base), 18.2, 6);
  return (
    <AbsoluteFill>
      <DarkBg base={base} />
      <Box base={base} at={15.10} x={160} y={420} w={360}>AI</Box>
      <Dash base={base} at={15.32} x1={545} x2={705} y={495} />
      <Box base={base} at={15.50} x={730} y={420} w={460}>Does the work<br />faster</Box>
      <Dash base={base} at={15.80} x1={1215} x2={1375} y={495} />
      <Box base={base} at={16.12} x={1400} y={420} w={360} accent>More<br />customers</Box>
      <div style={{position: 'absolute', left: 1400, width: 360, top: 600, textAlign: 'center', fontSize: 40, fontWeight: 700, color: G2, opacity: lab, transform: `translateY(${(1 - lab) * 12}px)`}}>= what you sell</div>
    </AbsoluteFill>
  );
};

const B07: React.FC<{base: number}> = ({base}) => {
  const o = fade(useT(base), 19.58, 6);
  return (
    <AbsoluteFill>
      <Footage base={base} scale={1.12} />
      <div style={{position: 'absolute', left: 90, bottom: 110, background: '#fff', borderRadius: 18, padding: '20px 34px', boxShadow: '0 14px 40px rgba(0,0,0,.35)', display: 'flex', gap: 18, alignItems: 'center', opacity: o, transform: `translateY(${(1 - o) * 14}px)`}}>
        <div style={{width: 10, height: 56, background: G, borderRadius: 6}} />
        <div><div style={{fontSize: 40, fontWeight: 700, color: INK}}>Review Harvest</div><div style={{fontSize: 26, color: '#666', fontStyle: 'italic'}}>my agency</div></div>
      </div>
    </AbsoluteFill>
  );
};

// 08 · MaidMe client result — tiles count up as each number is spoken
const Tile: React.FC<{value: number; prefix?: string; suffix?: string; label: string; at: number; base: number; green?: boolean}> = ({value, prefix = '', suffix = '', label, at, base, green}) => {
  const f = useT(base);
  const o = fade(f, at, 5);
  const n = Math.round(interpolate(f, [F(at), F(at) + 16], [0, value], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <div style={{flex: 1, background: '#f5f8f6', borderRadius: 24, padding: '34px 32px', borderBottom: `8px solid ${G}`, opacity: o, transform: `translateY(${(1 - o) * 16}px)`}}>
      <div style={{fontSize: 96, fontWeight: 700, lineHeight: 1, color: green ? G : INK}}>{prefix}{n}{suffix}</div>
      <div style={{fontSize: 29, color: '#555', marginTop: 14, fontWeight: 500}}>{label}</div>
    </div>
  );
};
const B08: React.FC<{base: number}> = ({base}) => (
  <AbsoluteFill>
    <LightBg base={base} />
    <Card base={base} at={21.36} style={{left: 150, top: 140, width: 1500, height: 720, padding: '58px 66px 0'}}>
      <div style={{fontSize: 28, fontWeight: 600, color: '#666', letterSpacing: 2}}><Words base={base} ws={pop('CLIENT RESULT', 21.42)} /></div>
      <div style={{fontSize: 72, fontWeight: 700, marginBottom: 44, color: INK}}>
        <Words base={base} ws={[{t: 'MaidMe', at: 22.50}]} /> <span style={{fontSize: 40, color: '#888', fontWeight: 500}}><Words base={base} ws={pop('· first 90 days', 22.66)} /></span>
      </div>
      <div style={{display: 'flex', gap: 28}}>
        <Tile base={base} value={50} suffix="+" label="organic calls" at={23.66} />
        <Tile base={base} value={74} label="high-intent form submissions" at={26.22} />
        <Tile base={base} value={90} label="days" at={30.12} />
        <Tile base={base} value={0} prefix="$" label="paid ads" at={31.26} green />
      </div>
      <div style={{fontSize: 24, color: '#777', marginTop: 42}}>One client's result. Results vary and are not guaranteed.</div>
    </Card>
    <FaceCam base={base} x={1560} y={700} w={290} h={320} />
  </AbsoluteFill>
);

// 09 / 11 · roadmap — white card on soft gradient (ref 1), items pop as spoken
const ROAD: W[][] = [
  [{t: '1', at: 34.00}, {t: 'The', at: 34.00}, {t: 'exact', at: 34.12}, {t: 'offer', at: 34.48, c: G}],
  [{t: '2', at: 35.78}, {t: 'What', at: 35.78}, {t: 'to', at: 36.00}, {t: 'charge', at: 36.32, c: G}],
  [{t: '3', at: 37.08}, {t: 'Finding', at: 37.38}, {t: 'your', at: 37.58}, {t: 'first', at: 37.92, c: G}, {t: 'clients', at: 38.14, c: G}],
  [{t: '4', at: 39.85}, {t: 'Doing', at: 39.89}, {t: 'the', at: 39.97}, {t: 'work', at: 40.05, c: G}],
  [{t: '5', at: 40.93}, {t: 'Turning', at: 40.93}, {t: 'results', at: 41.71}, {t: 'into', at: 42.17}, {t: 'a', at: 42.59}, {t: 'client', at: 42.81, c: G}, {t: 'system', at: 42.91, c: G}],
];
const Road: React.FC<{base: number; n: number; cardAt: number}> = ({base, n, cardAt}) => {
  const f = useT(base);
  return (
    <AbsoluteFill>
      <LightBg base={base} />
      <Card base={base} at={cardAt} style={{left: 330, top: 150, width: 1160, height: 780, padding: '64px 86px'}}>
        <div style={{fontSize: 52, fontStyle: 'italic', fontWeight: 500, color: INK, marginBottom: 18}}><Words base={base} ws={[{t: 'In', at: 32.92}, {t: 'this', at: 33.06}, {t: 'video', at: 33.22}]} /></div>
        {ROAD.slice(0, n).map((ws, i) => (
          <div key={i} style={{display: 'flex', gap: 24, alignItems: 'baseline', marginTop: 30, fontSize: 48, fontWeight: 700, color: INK}}>
            <span style={{fontSize: 30, color: G, opacity: fade(f, ws[0].at, 4)}}>●</span>
            <span><Words ws={ws.slice(1)} base={base} /></span>
          </div>
        ))}
      </Card>
      <FaceCam base={base} x={1560} y={700} w={290} h={320} />
    </AbsoluteFill>
  );
};
const B09: React.FC<{base: number}> = ({base}) => <Road base={base} n={3} cardAt={32.65} />;
const B11: React.FC<{base: number}> = ({base}) => <Road base={base} n={5} cardAt={-1} />;

// 10 · LATER IN THIS VIDEO — blurred montage of Clay's real Section 4 screen recording
const B10: React.FC<{base: number}> = ({base}) => {
  const f = useT(base);
  const pill = fade(f, 38.66, 6);
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <AbsoluteFill style={{filter: 'blur(7px)', transform: 'scale(1.05)'}}>
        <OffthreadVideo src={staticFile('teaser.mp4')} muted style={{width: 1920, height: 1080}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(255,255,255,.18)'}} />
      <div style={{position: 'absolute', left: '50%', bottom: 90, transform: `translateX(-50%) scale(${0.9 + 0.1 * pill})`, opacity: pill, background: G, color: '#fff', fontSize: 64, fontWeight: 700, padding: '16px 48px', borderRadius: 18, boxShadow: '0 16px 44px rgba(15,120,43,.45)', whiteSpace: 'nowrap'}}>LATER IN THIS VIDEO</div>
      <FaceCam base={base} x={1560} y={700} w={290} h={320} />
    </AbsoluteFill>
  );
};

// 13 · dark title card, words pop (ref 2)
const B13: React.FC<{base: number}> = ({base}) => (
  <AbsoluteFill>
    <DarkBg base={base} />
    <Card base={base} at={47.71} dark style={{left: 410, top: 330, width: 1100, height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontSize: 80, fontWeight: 600, color: '#fff', lineHeight: 1.3, textAlign: 'center'}}>
        <Words base={base} ws={[{t: 'You', at: 47.75}, {t: 'can', at: 47.91}, {t: 'build', at: 48.19}, {t: 'this.', at: 48.53}]} /><br />
        <Words base={base} ws={[{t: "It's", at: 48.83, c: G2}, {t: 'just', at: 49.09, c: G2}, {t: 'not', at: 49.21, c: G2}, {t: 'easy.', at: 49.73, c: G2}]} />
      </div>
    </Card>
  </AbsoluteFill>
);

const B14: React.FC<{base: number}> = ({base}) => {
  const f = useT(base);
  const o = fade(f, 51.49, 6) * interpolate(f, [F(53.29), F(53.59)], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <Footage base={base} />
      <div style={{position: 'absolute', left: 110, bottom: 120, background: '#fff', borderRadius: 20, padding: '24px 40px 24px 30px', boxShadow: '0 14px 40px rgba(0,0,0,.35)', display: 'flex', gap: 22, alignItems: 'center', opacity: o, transform: `translateY(${(1 - o) * 14}px)`}}>
        <div style={{width: 12, height: 84, background: G, borderRadius: 6}} />
        <div><div style={{fontSize: 52, fontWeight: 700, lineHeight: 1.1, color: INK}}>Clay Lawrence</div><div style={{fontSize: 30, color: '#555'}}>Founder, Review Harvest</div></div>
      </div>
    </AbsoluteFill>
  );
};

// 15 / 16 · Real Stripe dashboard (ref 1): slow push-in with depth of field; the real
// Gross volume figure counts up in place, then a green marker sweeps in behind it (ref 2).
const money = (v: number) => '$' + v.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
const Stripe: React.FC<{base: number; img: string; value: number; countAt: number; patch: [number, number, number, number]; chip: string; pill?: {t: string; at: number}; end: number}> = ({base, img, value, countAt, patch, chip, pill, end}) => {
  const f = useT(base);
  const [px, py, pw, ph] = patch;                     // number box in screenshot pixels
  const fx = px + 260, fy = py + 10;                  // focus point (a little right of the number)
  const S = interpolate(f, [base, F(end)], [1.28, 1.42], clamp);
  const sx = 760, sy = 640;                           // where the focus point sits on screen
  const n = interpolate(f, [F(countAt), F(countAt) + 30], [value * 0.82, value], {...clamp, easing: Easing.out(Easing.cubic)});
  const mark = interpolate(f, [F(countAt) + 32, F(countAt) + 40], [0, 1], {...clamp, easing: ease});
  const chipO = fade(f, base / FPS + 0.05, 6);
  const po = pill ? fade(f, pill.at, 6) : 0;
  const layer = (blur: boolean) => (
    <div style={{position: 'absolute', left: sx - fx * S, top: sy - fy * S, width: 2772 * S, height: 1150 * S, filter: blur ? 'blur(7px)' : undefined}}>
      <Img src={staticFile(img)} style={{width: '100%', height: '100%', display: 'block'}} />
      {/* live counter painted over the real figure; green marker sweeps in behind it */}
      <div style={{position: 'absolute', left: (px - 6) * S, top: (py - 6) * S, width: (pw + 10) * S, height: (ph + 12) * S, background: '#fff'}} />
      <div style={{position: 'absolute', left: (px - 6) * S, top: (py - 8) * S, display: 'inline-block', padding: `0 ${6 * S}px`, borderRadius: 8 * S, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 47 * S, lineHeight: `${(ph + 16) * S}px`, letterSpacing: -0.6 * S, whiteSpace: 'nowrap', color: mark >= 1 ? '#fff' : '#3c4150', background: `linear-gradient(90deg, ${G} ${mark * 100}%, transparent ${mark * 100}%)`}}>{money(n)}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
      {layer(true)}
      <AbsoluteFill style={{WebkitMaskImage: `radial-gradient(ellipse 52% 48% at ${sx}px ${sy}px, black 58%, transparent 100%)`, maskImage: `radial-gradient(ellipse 52% 48% at ${sx}px ${sy}px, black 58%, transparent 100%)`}}>
        {layer(false)}
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 70% at 45% 52%, transparent 60%, rgba(255,255,255,.85) 100%)'}} />
      <div style={{position: 'absolute', left: 70, top: 60, opacity: chipO, background: INK, color: '#fff', borderRadius: 14, padding: '12px 26px', fontSize: 34, fontWeight: 600}}>{chip}</div>
      {pill && <div style={{position: 'absolute', left: 560, top: 840, opacity: po, transform: `scale(${0.9 + 0.1 * po})`, background: '#fff', color: G, border: `4px solid ${G}`, fontSize: 50, fontWeight: 700, padding: '14px 38px', borderRadius: 999, boxShadow: '0 14px 40px rgba(15,120,43,.25)'}}>{pill.t}</div>}
      <div style={{position: 'absolute', left: 70, bottom: 36, fontSize: 22, color: '#6b6b6b', fontWeight: 500}}>Results not typical or guaranteed.</div>
    </AbsoluteFill>
  );
};
const B15: React.FC<{base: number}> = ({base}) => <Stripe base={base} img="stripe_aug.png" value={60498.87} countAt={54.65} patch={[66, 860, 250, 44]} chip="Last month · Stripe, August 2026" end={59.31} />;
const B16: React.FC<{base: number}> = ({base}) => <Stripe base={base} img="stripe_oct.png" value={40184.90} countAt={59.59} patch={[66, 870, 246, 44]} chip="This month · Oct 1 – 13" pill={{t: 'On pace for $75K+', at: 62.97}} end={64.43} />;


// ---- captions on talking-head shots (key phrases, green accent) ---------------
const LG = '#7fe39b';
const shadow = '0 4px 18px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.5)';
const Caption: React.FC<{ws: W[]; base: number}> = ({ws, base}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 95, textAlign: 'center', color: '#fff', fontSize: 62, fontWeight: 700, textShadow: shadow}}>
    <Words ws={ws} base={base} />
  </div>
);
const B01: React.FC<{base: number}> = ({base}) => (
  <AbsoluteFill>
    <Footage base={base} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center', color: '#fff', textShadow: shadow}}>
      <div style={{fontSize: 86, fontWeight: 700, letterSpacing: 1}}>
        <Words base={base} ws={[{t: 'AI', at: 0.92}, {t: 'MARKETING', at: 1.18}, {t: 'AGENCY', at: 1.46}]} />
      </div>
      <div style={{fontSize: 54, fontWeight: 600, marginTop: 6}}>
        <Words base={base} ws={[{t: 'FROM', at: 2.04, c: LG}, {t: 'ZERO', at: 2.42, c: LG}, {t: '· 2026', at: 3.14}]} />
      </div>
    </div>
  </AbsoluteFill>
);
const B03: React.FC<{base: number}> = ({base}) => (
  <AbsoluteFill>
    <Footage base={base} scale={1.12} />
    <Caption base={base} ws={[{t: 'something', at: 9.44}, {t: 'they', at: 9.70}, {t: 'already', at: 9.90, c: LG}, {t: 'pay', at: 10.24, c: LG}, {t: 'for', at: 10.54, c: LG}]} />
  </AbsoluteFill>
);
const B12: React.FC<{base: number}> = ({base}) => (
  <AbsoluteFill>
    <Footage base={base} scale={1.12} />
    <Caption base={base} ws={[{t: "I'll", at: 45.77}, {t: 'be', at: 46.07}, {t: 'honest', at: 46.17}, {t: 'about', at: 46.51}, {t: 'the', at: 46.77, c: LG}, {t: 'timeline', at: 46.93, c: LG}]} />
  </AbsoluteFill>
);

// [start, end, component] on the edited timeline
const BEATS: [number, number, React.FC<{base: number}>][] = [
  [0.00, 4.34, B01], [4.34, 7.92, B02], [7.92, 11.02, B03], [11.02, 13.00, B04],
  [13.00, 15.06, TH], [15.06, 18.90, B06], [18.90, 21.34, B07], [21.34, 32.63, B08],
  [32.63, 38.60, B09], [38.60, 39.83, B10], [39.83, 44.85, B11], [44.85, 47.69, B12],
  [47.69, 50.20, B13], [50.20, 53.61, B14], [53.61, 59.31, B15], [59.31, 64.43, B16],
];

export const Edit: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{fontFamily: 'P, sans-serif', background: '#000'}}>
      <style>{fontCss}</style>
      {BEATS.map(([s, e, C], i) => {
        const from = F(s);
        const to = i === BEATS.length - 1 ? durationInFrames : F(e);
        return <Sequence key={i} from={from} durationInFrames={to - from}><C base={from} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};
