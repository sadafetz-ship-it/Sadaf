import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing,
} from 'remotion';

// ---------------------------------------------------------------------------
// First edited minute — "If I Started an AI Marketing Agency In 2026" (Clay Lawrence)
// All times are seconds on the edited timeline (word times from the transcript of the cut).
// Style: graphics hard-cut in, only text animates; words fade in on the spoken word.
// ---------------------------------------------------------------------------

export const DURATION = Math.round(65.14 * 30);
const FPS = 30;
const G = '#0F782B';         // Clay's brand green
const LG = '#7fe39b';        // lighter tint, readable over footage
const INK = '#141414';
const F = (s: number) => Math.round(s * FPS);

const fontCss = `
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-latin-400-normal.woff2')});font-weight:400}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-latin-500-normal.woff2')});font-weight:500}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-latin-600-normal.woff2')});font-weight:600}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-latin-700-normal.woff2')});font-weight:700}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-latin-500-italic.woff2')});font-weight:500;font-style:italic}
`;

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ---- word-by-word reveal ---------------------------------------------------
type W = {t: string; at: number; c?: string};
const Word: React.FC<{w: W; base: number}> = ({w, base}) => {
  const f = useCurrentFrame() + base;
  const p = interpolate(f, [F(w.at), F(w.at) + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return (
    <span style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 10}px)`, filter: `blur(${(1 - p) * 6}px)`, color: w.c, whiteSpace: 'pre'}}>
      {w.t}
    </span>
  );
};
// Words render relative to the absolute timeline: pass the Sequence start as `base`.
const Words: React.FC<{ws: W[]; base: number}> = ({ws, base}) => (
  <>{ws.map((w, i) => <React.Fragment key={i}><Word w={w} base={base} />{i < ws.length - 1 ? ' ' : ''}</React.Fragment>)}</>
);
const fadeIn = (frame: number, start: number, len = 6) =>
  interpolate(frame, [start, start + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

// ---- footage ---------------------------------------------------------------
// base.mp4 is the cut + graded talking head, aligned 1:1 with this timeline.
// Crop-in = 112% scale anchored near the top of the head so the head is never cut off.
const Footage: React.FC<{base: number; scale?: number}> = ({base, scale = 1}) => (
  <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '950px 120px'}}>
    <OffthreadVideo src={staticFile('base.mp4')} startFrom={base} muted style={{width: 1920, height: 1080}} />
  </AbsoluteFill>
);

// Face-cam inset: same footage, framed on the face, rounded square with even white border.
const FaceCam: React.FC<{base: number; x: number; y: number; w: number; h: number}> = ({base, x, y, w, h}) => {
  const s = w / 560;              // ~560 source px of width: head + shoulders
  const fx = 950, fy = 470;       // face centre in the source frame
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 36, border: '8px solid #fff', overflow: 'hidden', boxShadow: '0 18px 50px rgba(0,0,0,.45)', background: '#222'}}>
      <div style={{position: 'absolute', left: w / 2 - 8 - fx * s, top: h / 2 - 8 - fy * s, width: 1920 * s, height: 1080 * s}}>
        <OffthreadVideo src={staticFile('base.mp4')} startFrom={base} muted style={{width: '100%', height: '100%'}} />
      </div>
    </div>
  );
};

const shadow = '0 4px 18px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.5)';
const Caption: React.FC<{ws: W[]; base: number}> = ({ws, base}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 95, textAlign: 'center', color: '#fff', fontSize: 62, fontWeight: 700, textShadow: shadow}}>
    <Words ws={ws} base={base} />
  </div>
);

const DarkBg: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 75% at 50% 50%, #040504 55%, #0b3a18 85%, #11592a 100%)'}} />
);
const LightBg: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 70% at 50% 50%,#ffffff 60%,#dcefe1 100%)'}} />;
const CardBg: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%,#2a2a2a,#050505 75%)'}} />;

// ---- beats -----------------------------------------------------------------

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

const Window: React.FC<{x: number; title: string; children: React.ReactNode; appear: number; dimAt: number; base: number}> = ({x, title, children, appear, dimAt, base}) => {
  const f = useCurrentFrame() + base;
  const o = fadeIn(f, F(appear), 5);
  const dim = interpolate(f, [F(dimAt), F(dimAt) + 6], [1, 0.55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: x, top: 270, width: 640, height: 450, opacity: o * dim, transform: `translateY(${(1 - o) * 24}px)`, background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,.6)'}}>
      <div style={{height: 54, background: '#f1f1f1', display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px'}}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => <i key={c} style={{width: 14, height: 14, borderRadius: 7, background: c, display: 'inline-block'}} />)}
        <span style={{marginLeft: 14, fontSize: 24, fontWeight: 600, color: '#444'}}>{title}</span>
      </div>
      <div style={{padding: '26px 30px'}}>{children}</div>
    </div>
  );
};
const B02: React.FC<{base: number}> = ({base}) => {
  const f = useCurrentFrame() + base;
  const strike = interpolate(f, [F(7.28), F(7.28) + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return (
    <AbsoluteFill>
      <DarkBg />
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', color: '#fff', fontSize: 66, fontWeight: 700}}>
        <Words base={base} ws={[{t: 'What', at: 4.40}, {t: 'I', at: 4.48}, {t: "wouldn't", at: 4.56}, {t: 'start', at: 4.76, c: LG}, {t: 'with', at: 5.08, c: LG}]} />
      </div>
      <Window x={250} title="AI Tool" appear={5.72} dimAt={7.28} base={base}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, fontSize: 26}}>
          <div style={{alignSelf: 'flex-end', background: G, color: '#fff', borderRadius: 18, padding: '14px 20px'}}>Write 5 review replies for my client</div>
          <div style={{background: '#eef0f2', borderRadius: 18, padding: '14px 20px', width: '80%'}}>Sure! Here are five replies…</div>
          <div style={{background: '#eef0f2', borderRadius: 18, height: 52, width: '60%'}} />
        </div>
      </Window>
      <Window x={1030} title="custom-software.js" appear={6.86} dimAt={7.28} base={base}>
        <pre style={{fontFamily: 'monospace', fontSize: 26, lineHeight: 1.6, color: '#333', margin: 0}}>
{`const app = createApp({
  reviews: true,
  crm: true,
  billing: 'stripe',
});
// 6 months of building…`}
        </pre>
      </Window>
      <div style={{position: 'absolute', left: 200, top: 490, width: 1520 * strike, height: 10, background: '#ff4d4d', borderRadius: 6, transform: 'rotate(-6deg)', transformOrigin: 'left center', boxShadow: '0 0 30px rgba(255,77,77,.6)'}} />
    </AbsoluteFill>
  );
};

const B03: React.FC<{base: number}> = ({base}) => (
  <AbsoluteFill>
    <Footage base={base} scale={1.12} />
    <Caption base={base} ws={[{t: 'something', at: 9.44}, {t: 'they', at: 9.70}, {t: 'already', at: 9.90, c: LG}, {t: 'pay', at: 10.24, c: LG}, {t: 'for', at: 10.54, c: LG}]} />
  </AbsoluteFill>
);

const Listing: React.FC<{name: string; rating: string; rev: string; hi?: number}> = ({name, rating, rev, hi = 0}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 26, padding: '24px 32px', borderRadius: 20, outline: `6px solid rgba(15,120,43,${hi})`, background: `rgba(242,250,244,${hi})`}}>
    <div style={{width: 96, height: 96, borderRadius: 16, background: 'linear-gradient(135deg,#d9e7dd,#b8cfbf)'}} />
    <div style={{flex: 1}}>
      <div style={{fontSize: 34, fontWeight: 600}}>{name}</div>
      <div style={{fontSize: 26, color: '#555'}}>{rating} <span style={{color: '#f5a623'}}>★★★★★</span> ({rev}) · House cleaning · Open now</div>
    </div>
    <div style={{border: `3px solid ${G}`, color: G, fontSize: 26, padding: '10px 30px', borderRadius: 999, fontWeight: 700}}>Call</div>
  </div>
);
const B04: React.FC<{base: number}> = ({base}) => {
  const f = useCurrentFrame() + base;
  const card = fadeIn(f, F(11.05), 6);
  const hi = fadeIn(f, F(12.56), 6);
  return (
    <AbsoluteFill>
      <LightBg />
      <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontSize: 76, fontWeight: 700, color: INK}}>
        <Words base={base} ws={[{t: 'More', at: 11.10}, {t: 'customers', at: 11.40}, {t: 'from', at: 12.16}, {t: 'Google', at: 12.50, c: G}]} />
      </div>
      <div style={{position: 'absolute', left: 330, top: 250, width: 1260, padding: '34px 40px', background: '#fff', borderRadius: 34, boxShadow: '0 30px 80px rgba(0,0,0,.18)', opacity: card, transform: `scale(${0.97 + 0.03 * card})`}}>
        <div style={{border: '2px solid #dfe1e5', borderRadius: 999, padding: '18px 34px', fontSize: 30, color: '#333', marginBottom: 24}}>🔍&nbsp; house cleaner near me</div>
        <Listing name="Sparkle Home Cleaning" rating="4.9" rev="212" hi={hi} />
        <Listing name="Bright Maids Co." rating="4.6" rev="87" />
        <Listing name="City Clean Pros" rating="4.3" rev="41" />
      </div>
      <div style={{position: 'absolute', right: 40, bottom: 24, fontSize: 22, color: '#7a7a7a', fontWeight: 500}}>Illustration</div>
    </AbsoluteFill>
  );
};

const Bullet: React.FC<{ws: W[]; base: number; size: number; gap: number; dim?: boolean}> = ({ws, base, size, gap}) => {
  const f = useCurrentFrame() + base;
  const dot = fadeIn(f, F(ws[0].at), 5);
  return (
    <div style={{display: 'flex', gap: 22, alignItems: 'baseline', marginTop: gap, fontSize: size, fontWeight: 700, color: INK}}>
      <span style={{fontSize: 30, color: G, opacity: dot}}>●</span>
      <span><Words ws={ws} base={base} /></span>
    </div>
  );
};
const BulletCard: React.FC<{base: number; title: W[]; items: W[][]; size?: number; gap?: number; camFrom: number}> = ({base, title, items, size = 46, gap = 30, camFrom}) => (
  <AbsoluteFill>
    <CardBg />
    <div style={{position: 'absolute', left: 240, top: 250, width: 1440, padding: '64px 80px 70px 470px', background: '#fff', borderRadius: 34, boxShadow: '0 30px 80px rgba(0,0,0,.35)'}}>
      <div style={{fontSize: 50, fontStyle: 'italic', fontWeight: 500, color: INK}}><Words ws={title} base={base} /></div>
      {items.map((ws, i) => <Bullet key={i} ws={ws} base={base} size={size} gap={gap} />)}
    </div>
    <FaceCam base={camFrom} x={150} y={300} w={380} h={460} />
  </AbsoluteFill>
);

const B06: React.FC<{base: number}> = ({base}) => (
  <BulletCard base={base} camFrom={base}
    title={[{t: 'What', at: 15.06}, {t: "I'd", at: 15.06}, {t: 'actually', at: 15.06}, {t: 'sell', at: 15.06}]}
    items={[
      [{t: 'AI', at: 15.20}, {t: '→', at: 15.26}, {t: 'does', at: 15.32}, {t: 'the', at: 15.38}, {t: 'work', at: 15.44}, {t: 'faster', at: 15.50, c: G}],
      [{t: 'More', at: 15.74, c: G}, {t: 'customers', at: 16.12, c: G}, {t: '→', at: 17.82}, {t: 'what', at: 18.04}, {t: 'you', at: 18.22}, {t: 'sell', at: 18.46}],
    ]} />
);

const B07: React.FC<{base: number}> = ({base}) => {
  const f = useCurrentFrame() + base;
  const o = fadeIn(f, F(19.58), 6);
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

const Tile: React.FC<{value: number; prefix?: string; suffix?: string; label: string; at: number; base: number; green?: boolean}> = ({value, prefix = '', suffix = '', label, at, base, green}) => {
  const f = useCurrentFrame() + base;
  const o = fadeIn(f, F(at), 5);
  const n = Math.round(interpolate(f, [F(at), F(at) + 14], [0, value], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  return (
    <div style={{flex: 1, background: '#f6f8f7', borderRadius: 26, padding: '36px 34px', borderBottom: `8px solid ${G}`, opacity: o, transform: `translateY(${(1 - o) * 16}px)`}}>
      <div style={{fontSize: 96, fontWeight: 700, lineHeight: 1, color: green ? G : INK}}>{prefix}{n}{suffix}</div>
      <div style={{fontSize: 30, color: '#555', marginTop: 14, fontWeight: 500}}>{label}</div>
    </div>
  );
};
const B08: React.FC<{base: number}> = ({base}) => (
  <AbsoluteFill>
    <LightBg />
    <div style={{position: 'absolute', left: 170, top: 130, width: 1580, height: 760, padding: '60px 70px 0 70px', background: '#fff', borderRadius: 34, boxShadow: '0 30px 80px rgba(0,0,0,.18)'}}>
      <div style={{fontSize: 28, fontWeight: 600, color: '#666', letterSpacing: 2}}>CLIENT RESULT</div>
      <div style={{fontSize: 72, fontWeight: 700, marginBottom: 46, color: INK}}>
        <Words base={base} ws={[{t: 'MaidMe', at: 21.40}]} /> <span style={{fontSize: 40, color: '#888', fontWeight: 500}}><Words base={base} ws={[{t: '· first 90 days', at: 21.60}]} /></span>
      </div>
      <div style={{display: 'flex', gap: 30}}>
        <Tile base={base} value={50} suffix="+" label="organic calls" at={23.66} />
        <Tile base={base} value={74} label="high-intent form submissions" at={26.22} />
        <Tile base={base} value={90} label="days" at={30.12} />
        <Tile base={base} value={0} prefix="$" label="paid ads" at={31.26} green />
      </div>
      <div style={{fontSize: 24, color: '#777', marginTop: 44}}>One client's result. Results vary and are not guaranteed.</div>
    </div>
    <FaceCam base={base} x={1460} y={700} w={300} h={360} />
  </AbsoluteFill>
);

const ROAD: W[][] = [
  [{t: '1', at: 34.00}, {t: 'The', at: 34.00}, {t: 'exact', at: 34.12}, {t: 'offer', at: 34.48, c: G}],
  [{t: '2', at: 35.78}, {t: 'What', at: 35.78}, {t: 'to', at: 36.00}, {t: 'charge', at: 36.32, c: G}],
  [{t: '3', at: 37.08}, {t: 'Finding', at: 37.38}, {t: 'your', at: 37.58}, {t: 'first', at: 37.92, c: G}, {t: 'clients', at: 38.14, c: G}],
  [{t: '4', at: 40.54}, {t: 'Doing', at: 40.54}, {t: 'the', at: 40.60}, {t: 'work', at: 40.66, c: G}],
  [{t: '5', at: 41.64}, {t: 'Turning', at: 41.64}, {t: 'results', at: 42.42}, {t: 'into', at: 42.88}, {t: 'a', at: 43.30}, {t: 'client', at: 43.52, c: G}, {t: 'system', at: 43.52, c: G}],
];
const roadTitle: W[] = [{t: 'In', at: 32.92}, {t: 'this', at: 33.06}, {t: 'video', at: 33.22}];
const B09: React.FC<{base: number}> = ({base}) => <BulletCard base={base} camFrom={base} title={roadTitle} items={ROAD.slice(0, 3)} size={42} gap={22} />;
const B11: React.FC<{base: number}> = ({base}) => <BulletCard base={base} camFrom={base} title={roadTitle} items={ROAD} size={42} gap={22} />;

const B10: React.FC<{base: number}> = ({base}) => {
  const f = useCurrentFrame() + base;
  const pill = fadeIn(f, F(38.72), 6);
  // gentle real-feeling scroll of the page (a screen recording would scroll)
  const y = interpolate(f, [F(38.6), F(40.54)], [0, -40], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%,#1d2a21,#030503 75%)'}} />
      <div style={{position: 'absolute', left: 150, top: 90, width: 1620, height: 870, borderRadius: 30, overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,.6)', background: '#fff'}}>
        <Img src={staticFile('hs_page.png')} style={{width: '100%', display: 'block', transform: `translateY(${y}px)`}} />
      </div>
      <div style={{position: 'absolute', left: '50%', bottom: 70, transform: `translateX(-50%) scale(${0.92 + 0.08 * pill})`, opacity: pill, background: '#fff', color: INK, fontSize: 58, fontWeight: 700, padding: '18px 46px', borderRadius: 999, boxShadow: '0 14px 40px rgba(0,0,0,.45)'}}>LATER IN THE VIDEO</div>
      <FaceCam base={base} x={80} y={640} w={270} h={320} />
    </AbsoluteFill>
  );
};

const B12: React.FC<{base: number}> = ({base}) => (
  <AbsoluteFill>
    <Footage base={base} scale={1.12} />
    <Caption base={base} ws={[{t: "I'll", at: 46.48}, {t: 'be', at: 46.78}, {t: 'honest', at: 46.88}, {t: 'about', at: 47.22}, {t: 'the', at: 47.48, c: LG}, {t: 'timeline', at: 47.64, c: LG}]} />
  </AbsoluteFill>
);

const B13: React.FC<{base: number}> = ({base}) => (
  <AbsoluteFill>
    <DarkBg />
    <div style={{position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', color: '#fff', fontSize: 80, fontWeight: 600, lineHeight: 1.35}}>
      <Words base={base} ws={[{t: 'You', at: 48.42}, {t: 'can', at: 48.62}, {t: 'build', at: 48.90}, {t: 'this.', at: 49.24}]} /><br />
      <Words base={base} ws={[{t: "It's", at: 49.54, c: '#5fd884'}, {t: 'just', at: 49.80, c: '#5fd884'}, {t: 'not', at: 49.92, c: '#5fd884'}, {t: 'easy.', at: 50.44, c: '#5fd884'}]} />
    </div>
  </AbsoluteFill>
);

const B14: React.FC<{base: number}> = ({base}) => {
  const f = useCurrentFrame() + base;
  const o = fadeIn(f, F(52.20), 6) * interpolate(f, [F(54.0), F(54.3)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Footage base={base} />
      <div style={{position: 'absolute', left: 110, bottom: 120, background: '#fff', borderRadius: 20, padding: '24px 40px 24px 30px', boxShadow: '0 14px 40px rgba(0,0,0,.35)', display: 'flex', gap: 22, alignItems: 'center', opacity: o, transform: `translateX(${(1 - Math.min(1, o * 1.2)) * -20}px)`}}>
        <div style={{width: 12, height: 84, background: G, borderRadius: 6}} />
        <div><div style={{fontSize: 52, fontWeight: 700, lineHeight: 1.1, color: INK}}>Clay Lawrence</div><div style={{fontSize: 30, color: '#555'}}>Founder, Review Harvest</div></div>
      </div>
    </AbsoluteFill>
  );
};

// Real Stripe screenshot; the key number types on inside a green highlight label placed over the real figure.
const Stripe: React.FC<{base: number; img: string; headline: W[]; number: string; typeAt: number; label: string; pill?: {t: string; at: number}}> = ({base, img, headline, number, typeAt, label, pill}) => {
  const f = useCurrentFrame() + base;
  const lab = fadeIn(f, F(typeAt), 4);
  const chars = Math.round(interpolate(f, [F(typeAt), F(typeAt) + 12], [0, number.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const po = pill ? fadeIn(f, F(pill.at), 6) : 0;
  const CT = 225;
  const top = CT + Math.round(838 * 1600 / 2772) - 46;
  return (
    <AbsoluteFill>
      <LightBg />
      <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontSize: 72, fontWeight: 700, color: INK}}><Words ws={headline} base={base} /></div>
      <div style={{position: 'absolute', left: 160, top: CT, width: 1600, height: 664, borderRadius: 26, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.25)', background: '#fff'}}>
        <Img src={staticFile(img)} style={{width: '100%', display: 'block'}} />
        <div style={{position: 'absolute', left: 24, top: 20, background: INK, color: '#fff', borderRadius: 12, padding: '8px 20px', fontSize: 28, fontWeight: 600}}>{label}</div>
      </div>
      <div style={{position: 'absolute', left: 150, top, opacity: lab, background: G, color: '#fff', fontSize: 92, fontWeight: 700, padding: '4px 30px', borderRadius: 12, boxShadow: '0 18px 40px rgba(15,120,43,.45)'}}>
        <span style={{visibility: 'hidden'}}>{number}</span>
        <span style={{position: 'absolute', left: 30, top: 4}}>{number.slice(0, chars)}</span>
      </div>
      {pill && <div style={{position: 'absolute', right: 200, top: 925, opacity: po, transform: `scale(${0.92 + 0.08 * po})`, background: '#fff', color: G, border: `4px solid ${G}`, fontSize: 44, fontWeight: 700, padding: '14px 34px', borderRadius: 999}}>{pill.t}</div>}
      <div style={{position: 'absolute', left: 160, bottom: 30, fontSize: 22, color: '#6b6b6b', fontWeight: 500}}>Results not typical or guaranteed.</div>
    </AbsoluteFill>
  );
};
const B15: React.FC<{base: number}> = ({base}) => (
  <Stripe base={base} img="stripe_aug.png" label="Stripe · Aug 1 – 31, 2026" number="$60,498.87" typeAt={55.36}
    headline={[{t: 'Last', at: 54.68}, {t: 'month', at: 54.90}]} />
);
const B16: React.FC<{base: number}> = ({base}) => (
  <Stripe base={base} img="stripe_oct.png" label="Stripe · Month to date (Oct 1 – 13)" number="$40,184.90" typeAt={60.40}
    headline={[{t: 'Not', at: 61.16}, {t: 'even', at: 61.30}, {t: '2', at: 61.50, c: G}, {t: 'weeks', at: 61.76, c: G}, {t: 'in', at: 61.96}]}
    pill={{t: 'On pace for $75K+', at: 63.68}} />
);

const B05: React.FC<{base: number}> = ({base}) => <Footage base={base} />;

// [start, end, component] on the edited timeline
const BEATS: [number, number, React.FC<{base: number}>][] = [
  [0.00, 4.34, B01], [4.34, 7.92, B02], [7.92, 11.02, B03], [11.02, 13.00, B04],
  [13.00, 15.06, B05], [15.06, 18.90, B06], [18.90, 21.34, B07], [21.34, 32.63, B08],
  [32.63, 38.60, B09], [38.60, 40.54, B10], [40.54, 45.56, B11], [45.56, 48.40, B12],
  [48.40, 50.91, B13], [50.91, 54.32, B14], [54.32, 60.02, B15], [60.02, 65.14, B16],
];

export const Edit: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{fontFamily: 'P, sans-serif', background: '#000'}}>
      <style>{fontCss}</style>
      {BEATS.map(([s, e, C], i) => {
        const from = F(s);
        const to = i === BEATS.length - 1 ? durationInFrames : F(e);
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <C base={from} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
