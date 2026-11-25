import React from 'react';
import {useCurrentFrame, interpolate, random, staticFile, Img, OffthreadVideo} from 'remotion';
import {C, ACC, ACCT, HEAVYFILL, FONT, cl, p, pop, eo, eio} from './theme';
import {cardStyle, pillStyle, btnStyle, Dot, Caret, typed, Badge} from './UI';

/** Black spotlight world (user's reference "B"): near-black base, soft neutral spotlight from the top centre,
 *  dark edges, an ultra-faint grain only to stop gradient banding. No grid, no particles, no colour. */
export const World: React.FC<{hue?: number}> = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 8;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#040404'}}>
      <div style={{position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 620px 760px at 50% 24%,rgba(255,255,255,.085) 0%,rgba(255,255,255,.05) 38%,rgba(255,255,255,.018) 70%,transparent 100%)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 35%,transparent 40%,rgba(0,0,0,.55) 100%)'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.035, mixBlendMode: 'screen'}}>
        <filter id={`grain${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed + 11} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
      </svg>
    </div>
  );
};

/** zoom-blur in/out envelope for a scene living between a and b */
export const sceneEnv = (f: number, a: number, b: number): React.CSSProperties => {
  const i = p(f, a, 6), o = p(f, b - 5, 5);
  return {opacity: i * (1 - o), transform: `scale(${1.12 - 0.12 * i - 0.06 * o})`, filter: (i < 1 || o > 0) ? `blur(${28 * (1 - i) + 20 * o}px)` : undefined};
};

/* ---------------- F2: Personal Brand Launch profile page ---------------- */
const fmt = (n: number) => n.toLocaleString('en-US');
export const PBLPage: React.FC = () => {
  const f = useCurrentFrame();
  const rise = p(f, 55, 14);
  const cnt = (target: number, a: number, b: number) => Math.round(interpolate(f, [a, b], [0, target], {...cl, easing: eo}));
  const fol = interpolate(f, [92, 132], [0, 1], {...cl, easing: eo});
  const folTxt = fol < 1 ? `${Math.round(fol * 1000)}K` : '1M';
  const tilt = Math.sin(f / 40) * 2;
  const bio = ['Ava | Content Marketing | Social Media Management', '▸ Helping Business Owners Grow & Sell on Social', '▸ Built million $ biz w/ social media'];
  const posts = [1, 2, 3];
  return (
    <>
      <div style={{position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center'}}>
        <span style={{...pillStyle, fontSize: 40, transform: `scale(${pop(f, 58, 7)})`, display: 'inline-flex'}}><Dot />
          {f < 73 ? 'PBL' : typed(f, 'Personal Brand Launch', 73, 96)}{f < 100 && <Caret dark />}</span></div>
      <div style={{...cardStyle, left: 70, top: 240, width: 940, padding: '40px 44px', borderTop: `3px solid ${C.lime}`,
        boxShadow: `0 -6px 40px rgba(132,229,114,.6),${cardStyle.boxShadow}`, opacity: rise,
        transform: `perspective(1600px) translateY(${500 * (1 - rise)}px) rotateX(${8 + 20 * (1 - rise)}deg) rotateY(${-6 + tilt}deg)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 46, fontWeight: 700, letterSpacing: -1}}>
          {typed(f, 'personalbrandlaunch', 60, 76)}<span style={{transform: `scale(${pop(f, 77, 7, 1.3)})`, display: 'inline-block'}}><Badge /></span></div>
        <div style={{display: 'flex', alignItems: 'center', gap: 40, marginTop: 30}}>
          <div style={{width: 200, height: 200, borderRadius: '50%', padding: 7, background: 'conic-gradient(#C2F433,#84E572,#4CDAB4,#C2F433)',
            transform: `rotate(${interpolate(p(f, 62, 18), [0, 1], [-180, 0])}deg) scale(${pop(f, 62, 10)})`, boxShadow: '0 0 30px rgba(132,229,114,.5)'}}>
            <Img src={staticFile('pbl/avatar.png')} style={{width: '100%', height: '100%', borderRadius: '50%', border: `6px solid ${C.ink}`,
              transform: `rotate(${-interpolate(p(f, 62, 18), [0, 1], [-180, 0])}deg)`}} /></div>
          <div style={{display: 'flex', gap: 44, textAlign: 'center'}}>
            <div><div style={{fontSize: 60, fontWeight: 700}}>{fmt(cnt(1467, 82, 118))}</div><div style={{fontSize: 30, opacity: 0.7}}>posts</div></div>
            <div><div style={{fontSize: 84, fontWeight: 800, lineHeight: 0.9, background: ACC, WebkitBackgroundClip: 'text', color: 'transparent',
              transform: `scale(${f >= 132 ? pop(f, 132, 8, 1.25) : 1})`}}>{folTxt}</div><div style={{fontSize: 30, color: C.pale}}>followers</div></div>
            <div><div style={{fontSize: 60, fontWeight: 700}}>{cnt(245, 86, 112)}</div><div style={{fontSize: 30, opacity: 0.7}}>following</div></div>
          </div>
        </div>
        <div style={{fontSize: 34, lineHeight: 1.45, marginTop: 26, minHeight: 200}}>
          {bio.map((l, i) => <div key={i}>{typed(f, l, 95 + i * 10, 105 + i * 10)}</div>)}
          <div style={{color: C.lime, opacity: p(f, 126, 6)}}>pblaunch.com</div></div>
        <div style={{display: 'flex', gap: 18, marginTop: 24}}>
          <div style={{...btnStyle, flex: 1, textAlign: 'center', padding: 18, fontSize: 34, transform: `scale(${pop(f, 118, 7)})`}}>Follow</div>
          <div style={{...btnStyle, flex: 1, textAlign: 'center', padding: 18, fontSize: 34, background: 'rgba(216,255,146,.12)', color: '#fff', boxShadow: 'none',
            border: '2px solid rgba(216,255,146,.4)', transform: `scale(${pop(f, 122, 7)})`}}>Message</div></div>
        <div style={{display: 'flex', gap: 16, marginTop: 30, justifyContent: 'space-between'}}>
          {posts.map((n, i) => {
            const d = p(f, 124 + i * 4, 9);
            const lift = i === 1 ? p(f, 136, 8) : 0;
            return <div key={n} style={{width: 236, height: 310, borderRadius: 18, overflow: 'hidden', opacity: d,
              boxShadow: lift ? `0 0 0 3px ${C.lime},0 0 30px rgba(132,229,114,.6)` : '0 0 0 2px rgba(216,255,146,.35)',
              transform: `translateY(${-120 * (1 - d) - 26 * lift}px) scale(${1 + 0.04 * lift}) rotate(${(1 - d) * (i - 1) * 10}deg)`}}>
              <Img src={staticFile(`pbl/post${n}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>;
          })}
        </div>
      </div>
    </>
  );
};

/* ---------------- F3: glow-ring trait cards ---------------- */
const TRAITS = [{t: 'Talented', s: 'skills that stop the scroll', ic: '✦', at: 188, ring: C.lime}, {t: 'Hardworking', s: 'shows up, every single day', ic: '⚡', at: 209, ring: C.mid},
  {t: 'Committed', s: 'every deadline, every client', ic: '◎', at: 236, ring: C.mint}];
export const GlowCards: React.FC = () => {
  const f = useCurrentFrame();
  const cur = TRAITS.filter((t) => f >= t.at).length - 1;
  const ringCol = cur >= 0 ? TRAITS[cur].ring : C.lime;
  const ringIn = p(f, 176, 12);
  const spin = 14 + Math.sin(f / 25) * 6;
  return (
    <>
      <div style={{position: 'absolute', left: 290, top: 600, width: 500, height: 500, borderRadius: 120, border: `16px solid ${ringCol}`, filter: 'blur(10px)',
        opacity: 0.85 * ringIn, transform: `rotate(${spin}deg) scale(${0.7 + 0.3 * ringIn})`}} />
      <div style={{position: 'absolute', left: 290, top: 600, width: 500, height: 500, borderRadius: 120, border: '4px solid #F4FFE0', filter: 'blur(1px)',
        opacity: 0.9 * ringIn, transform: `rotate(${spin}deg) scale(${0.7 + 0.3 * ringIn})`}} />
      {TRAITS.map((t, i) => {
        if (f < t.at) return null;
        const next = TRAITS[i + 1];
        const leave = next ? p(f, next.at, 8) : 0;
        const s = interpolate(f, [t.at, t.at + 5, t.at + 9], [0.6, 1.06, 1], cl);
        return <div key={i} style={{position: 'absolute', left: 340, top: 640, width: 400, height: 430, borderRadius: 56, overflow: 'hidden', fontFamily: FONT,
          boxShadow: '0 0 60px rgba(132,229,114,.45),0 30px 60px rgba(0,0,0,.5)', opacity: p(f, t.at, 4) * (1 - leave * 0.6),
          transform: `translate(${-260 * leave}px, ${60 * leave}px) rotate(${-10 * leave}deg) scale(${s * (1 - 0.18 * leave)})`, filter: `blur(${(1 - p(f, t.at, 5)) * 14 + leave * 6}px)`, zIndex: i}}>
          <div style={{height: 220, background: 'linear-gradient(160deg,#EFFFD2,#D8FF92)', display: 'grid', placeItems: 'center', fontSize: 120, color: C.ink}}>{t.ic}</div>
          <div style={{height: 210, background: `linear-gradient(180deg,#1E2B12,${C.ink})`, textAlign: 'center', paddingTop: 26, color: '#fff'}}>
            <div style={{fontSize: 54, fontWeight: 800, fontStyle: 'italic', letterSpacing: -1}}>{t.t}</div>
            <div style={{fontSize: 26, color: C.pale, opacity: 0.8, marginTop: 4}}>{t.s}</div>
            <div style={{fontSize: 34, letterSpacing: 6, marginTop: 10, color: C.sun}}>{'★★★★★'.slice(0, Math.round(interpolate(f, [t.at + 6, t.at + 16], [0, 5], cl)))}</div></div></div>;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1130, display: 'flex', justifyContent: 'center', gap: 16}}>
        {TRAITS.map((t, i) => <span key={i} style={{...pillStyle, fontSize: 28, opacity: f >= t.at ? (i === cur ? 1 : 0.55) : 0.18, transform: `scale(${f >= t.at ? pop(f, t.at, 7) : 1})`}}><Dot />{t.t}</span>)}
      </div>
    </>
  );
};

/* ---------------- F4: Content Flow line graph ---------------- */
const contour = (cx: number, cy: number, n: number, seed: number) => Array.from({length: n}).map((_, i) => {
  const r = 90 + i * 70; const p1 = random(`${seed}a${i}`) * 6.3, p2 = random(`${seed}b${i}`) * 6.3, p3 = random(`${seed}c${i}`) * 6.3;
  const pts: string[] = [];
  for (let a = 0; a <= 360; a += 4) { const ra = (a * Math.PI) / 180; const rr = r * (1 + 0.1 * Math.sin(3 * ra + p1) + 0.06 * Math.sin(5 * ra + p2) + 0.04 * Math.sin(8 * ra + p3));
    pts.push(`${(cx + rr * Math.cos(ra)).toFixed(0)},${(cy + rr * Math.sin(ra) * 0.8).toFixed(0)}`); }
  return 'M' + pts.join(' L') + 'Z';
});
const FLOW_D = 'M40,560 C160,540 200,470 240,430 S380,380 450,360 S600,300 650,250 S760,190 800,170';
export const ContentFlow: React.FC = () => {
  const f = useCurrentFrame();
  const rise = p(f, 260, 14);
  const draw = interpolate(f, [270, 316], [0, 1], {...cl, easing: eio});
  const cam = p(f, 258, 69, eio);
  const nodes = [{x: 160, y: 320, l: 'Raw clip', ic: '●', at: 277}, {x: 380, y: 250, l: 'Edit', ic: '▶', at: 304}, {x: 590, y: 150, l: 'Publish', ic: '➚', at: 313}];
  return (
    <>
      <div style={{position: 'absolute', left: 90, top: 380, width: 900, height: 640, borderRadius: 40, overflow: 'hidden', fontFamily: FONT, color: '#fff',
        background: 'linear-gradient(160deg,rgba(70,82,60,.85),rgba(30,38,24,.92))', border: '1.5px solid rgba(216,255,146,.25)',
        boxShadow: `0 -4px 0 ${C.lime},0 0 60px rgba(132,229,114,.35),0 40px 80px rgba(0,0,0,.5)`, opacity: rise,
        transform: `perspective(1400px) translateY(${400 * (1 - rise)}px) rotateX(${14 + 10 * (1 - cam)}deg) rotateY(${-26 + 12 * cam}deg) rotateZ(-3deg) scale(${0.92 + 0.08 * cam})`}}>
        <div style={{position: 'absolute', left: 50, top: 40, fontSize: 64, fontWeight: 700, letterSpacing: -2}}>Content <span style={{background: ACC, WebkitBackgroundClip: 'text', color: 'transparent'}}>Flow</span></div>
        <div style={{position: 'absolute', left: 52, top: 118, fontSize: 26, opacity: 0.6}}>From raw clip to impact</div>
        <svg width={900} height={640} style={{position: 'absolute', inset: 0}}>
          <line x1={40} y1={560} x2={40 + 820 * p(f, 262, 12)} y2={560} stroke="#fff" strokeWidth={2} strokeDasharray="10 10" opacity={0.6} />
          <line x1={40} y1={560} x2={40} y2={560 - 400 * p(f, 264, 12)} stroke="#fff" strokeWidth={2} strokeDasharray="10 10" opacity={0.4} />
          <text x={790} y={600} fill="#fff" opacity={0.7 * p(f, 270, 6)} fontSize={26} fontFamily="Inter Display">Time</text>
          <defs><linearGradient id="fg" x1="0" x2="1"><stop offset="0" stopColor="#4CDAB4" /><stop offset=".5" stopColor="#84E572" /><stop offset="1" stopColor="#C2F433" /></linearGradient></defs>
          <path d={FLOW_D} fill="none" stroke="url(#fg)" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 2`}
            style={{filter: 'drop-shadow(0 0 8px rgba(132,229,114,.9))'}} />
        </svg>
        {nodes.map((n, i) => {
          const s = pop(f, n.at, 8, 1.2); const on = f >= n.at;
          return <div key={i} style={{position: 'absolute', left: n.x, top: n.y, width: 150, textAlign: 'center', opacity: on ? 1 : 0}}>
            <div style={{fontSize: 28, marginBottom: 8, opacity: p(f, n.at + 3, 6)}}>{n.l}</div>
            <div style={{margin: '0 auto', width: 92, height: 92, borderRadius: 24, display: 'grid', placeItems: 'center', fontSize: 52, background: ACCT, color: C.dk,
              boxShadow: '0 0 24px rgba(132,229,114,.6)', transform: `scale(${s})`}}>{n.ic}</div></div>;
        })}
        {draw > 0 && draw < 1 && <div style={{position: 'absolute', left: 40 + 760 * draw - 11, top: 560 - 390 * Math.pow(draw, 0.9) - 11, width: 22, height: 22, borderRadius: '50%',
          background: '#fff', boxShadow: `0 0 20px #fff,0 0 40px ${C.mid}`}} />}
      </div>
    </>
  );
};

/* ---------------- F6: position info + remote pill ---------------- */
export const RemoteScene: React.FC<{src: string}> = () => {
  const f = useCurrentFrame();
  const bub = pop(f, 463, 9);
  return (
    <>
      <div style={{position: 'absolute', left: 410, top: 170, width: 260, height: 260, borderRadius: '50%', overflow: 'hidden', border: `4px solid ${C.mid}`,
        boxShadow: '0 0 40px rgba(132,229,114,.5)', transform: `scale(${bub})`}}>
        <OffthreadVideo src={staticFile('raw.mp4')} muted style={{position: "absolute", width: 378, left: -68, top: -112}} /></div>
      <div style={{position: 'absolute', top: 520, left: 0, right: 0, textAlign: 'center'}}>
        <span style={{...pillStyle, fontSize: 30, transform: `scale(${pop(f, 469, 7)})`}}><Dot />POSITION INFO</span></div>
      <div style={{position: 'absolute', top: 760, left: 0, right: 0, textAlign: 'center'}}>
        <span style={{...pillStyle, padding: '30px 54px', fontSize: 60, letterSpacing: -1, gap: 24, transform: `scale(${pop(f, 500, 8)})`,
          boxShadow: 'inset 0 3px 0 rgba(255,255,255,.45),0 16px 44px rgba(76,218,180,.45)'}}>
          ⌂ {f < 508 ? 'Remote' : typed(f, 'Remote job · work from anywhere', 508, 528)}<Caret dark /></span></div>
    </>
  );
};

/** light-beam wipe: a bright wedge swings from a ringed pivot */
export const BeamWipe: React.FC<{at: number; dur?: number}> = ({at, dur = 16}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur + 4) return null;
  const t = p(f, at, dur, eio);
  const ang = interpolate(t, [0, 1], [-70, 110]);
  const fade = 1 - p(f, at + dur - 2, 6);
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity: fade, zIndex: 80}}>
      <div style={{position: 'absolute', left: 760, top: 520, width: 0, height: 0, transform: `rotate(${ang}deg)`}}>
        <div style={{position: 'absolute', left: 0, top: -1400, width: 2600, height: 2800,
          background: 'linear-gradient(90deg,rgba(242,255,220,.95),rgba(216,255,146,.55) 50%,transparent)', clipPath: 'polygon(0 50%,100% 20%,100% 80%)', filter: 'blur(3px)'}} /></div>
      <div style={{position: 'absolute', left: 736, top: 496, width: 48, height: 48, borderRadius: '50%', border: '4px solid #fff', boxShadow: `0 0 20px #fff,0 0 40px ${C.mid}`}} />
    </div>
  );
};

/* ---------------- F7: gauge + wave + week ---------------- */
export const GaugeScene: React.FC = () => {
  const f = useCurrentFrame();
  const rise = p(f, 533, 12);
  const lo = f >= 554 ? 5 : 0, hasHi = f >= 566;
  const tickFill = interpolate(f, [554, 572], [0, 1], {...cl, easing: eo});
  const wave = (ph: number) => { const pts: string[] = []; for (let x = -40; x <= 1120; x += 20) { const y = 1060 + 110 * Math.sin(x / 170 + ph) * Math.sin(x / 400 + ph * 0.5); pts.push(`${x},${y.toFixed(0)}`); } return 'M' + pts.join(' L'); };
  const d = wave(f / 14);
  const waveIn = p(f, 536, 14);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: waveIn}}>
        <path d={d} fill="none" stroke={C.mid} strokeWidth={70} opacity={0.5} style={{filter: 'blur(28px)'}} />
        <path d={d} fill="none" stroke="#F4FFE0" strokeWidth={10} style={{filter: `blur(3px) drop-shadow(0 0 20px ${C.mid})`}} /></svg>
      <div style={{position: 'absolute', left: 260, top: 300, width: 560, height: 520, borderRadius: 110, textAlign: 'center', fontFamily: FONT, color: '#fff',
        background: 'linear-gradient(180deg,rgba(40,56,24,.75),rgba(23,32,13,.85))', border: '2px solid rgba(132,229,114,.45)',
        boxShadow: 'inset 0 -40px 60px -20px rgba(132,229,114,.5),0 0 60px rgba(76,218,180,.3)', opacity: rise, transform: `translateY(${200 * (1 - rise)}px) scale(${0.9 + 0.1 * rise})`}}>
        <div style={{fontSize: 34, marginTop: 46, opacity: 0.85}}>Hours / day</div>
        <svg width={560} height={300} style={{position: 'absolute', left: 0, top: 90}}>
          {Array.from({length: 21}).map((_, i) => { const a = ((200 + i * 7) * Math.PI) / 180; const on = i >= 5 && i <= 13 && i <= 5 + 8 * tickFill;
            return <line key={i} x1={280 + 205 * Math.cos(a)} y1={290 + 205 * Math.sin(a)} x2={280 + 230 * Math.cos(a)} y2={290 + 230 * Math.sin(a)}
              stroke={on ? C.lime : 'rgba(216,255,146,.25)'} strokeWidth={4} />; })}</svg>
        <div style={{fontSize: 200, fontWeight: 700, letterSpacing: -8, marginTop: 40, lineHeight: 1, height: 200}}>
          {(() => { const g: React.CSSProperties = {display: 'inline-block', background: HEAVYFILL, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            filter: 'drop-shadow(0 0 6px rgba(184,255,55,.3))'};
            return <>{lo ? <span style={{...g, transform: `scale(${pop(f, 554, 7)})`}}>{lo}</span> : null}
              {hasHi && <span style={{...g, transform: `scale(${pop(f, 566, 7)})`}}>–8</span>}
              <span style={{...g, fontSize: 70, letterSpacing: 0, opacity: p(f, 571, 6)}}>h</span></>; })()}
        </div>
      </div>
      <div style={{position: 'absolute', top: 880, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14, fontFamily: FONT}}>
        {'MTWTFSS'.split('').map((d0, i) => { const at = 589 + i * 3; const on = i < 5 && f >= at;
          return <div key={i} style={{width: 96, height: 96, borderRadius: 26, display: 'grid', placeItems: 'center', fontSize: 40, fontWeight: 700,
            opacity: p(f, 540 + i * 2, 6), ...(on ? {background: ACCT, color: C.dk, transform: `scale(${pop(f, at, 6, 1.2)})`} : {border: '2px solid rgba(216,255,146,.25)', color: 'rgba(255,255,255,.3)'})}}>{d0}</div>; })}
      </div>
    </>
  );
};

/* ---------------- F8: content orbit ---------------- */
export const Orbit: React.FC = () => {
  const f = useCurrentFrame();
  const items = ['post1.jpg', 'post2.jpg', 'post3.jpg', 'avatar.png', 'post2.jpg', 'post1.jpg', 'post3.jpg', 'post1.jpg'];
  const inn = p(f, 612, 14);
  const col = p(f, 638, 9, eio);
  const rot = (f - 612) * 1.2;
  return (
    <>
      <div style={{position: 'absolute', left: 340, top: 580, width: 400, height: 400, borderRadius: '50%', border: '2px dashed rgba(216,255,146,.35)', opacity: inn * (1 - col),
        transform: `rotate(${rot}deg)`}} />
      {items.map((src, i) => {
        const a = ((-90 + i * 45 + rot) * Math.PI) / 180;
        const r = 360 * inn * (1 - col) + 900 * (1 - inn);
        const x = 540 + r * Math.cos(a) - 75, y = 780 + r * Math.sin(a) - 95;
        const tilt = [-14, -8, 8, 14, 4, -6, 10, -12][i];
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 150, height: 190, borderRadius: 18, overflow: 'hidden', border: '5px solid #fff',
          boxShadow: '0 0 24px rgba(132,229,114,.45)', transform: `rotate(${tilt * (1 - col) + (1 - inn) * 90}deg) scale(${1 + 0.2 * col})`, zIndex: i}}>
          <Img src={staticFile(`pbl/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: FONT, fontSize: 46, fontWeight: 300, color: '#fff', opacity: 1 - col}}>
        <div style={{opacity: p(f, 617, 6)}}>We get</div>
        <div style={{fontWeight: 700, background: ACC, WebkitBackgroundClip: 'text', color: 'transparent'}}>{typed(f, 'a lot of content', 622, 634)}</div>
        <div style={{opacity: p(f, 637, 6)}}>for you</div></div>
    </>
  );
};

/* ---------------- F11: consistency is the key ---------------- */
export const KeyScene: React.FC = () => {
  const f = useCurrentFrame();
  const arcA = (deg: number) => ({cx: 980 + 560 * Math.cos((deg * Math.PI) / 180), cy: 1250 + 560 * Math.sin((deg * Math.PI) / 180)});
  const head = p(f, 908, 10);
  const key = p(f, 914, 12);
  const keyRot = -38 + Math.sin(f / 12) * 6 + (1 - key) * -60;
  const d1 = arcA(200 + (f - 867) * 0.5), d2 = arcA(240 + (f - 867) * 0.5);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <circle cx={980} cy={1250} r={560} fill="none" stroke={C.pale} strokeWidth={3} opacity={0.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p(f, 867, 18)} />
        <circle {...d1} r={14} fill={C.lime} opacity={p(f, 880, 6)} style={{filter: `drop-shadow(0 0 10px ${C.lime})`}} />
        <circle {...d2} r={14} fill={C.mint} opacity={p(f, 884, 6)} style={{filter: `drop-shadow(0 0 10px ${C.mint})`}} /></svg>
      <div style={{position: 'absolute', left: 780, top: 260, width: 110, height: 110, borderRadius: 30, border: '3px solid rgba(216,255,146,.5)',
        transform: `rotate(${20 + f * 0.6}deg) translateY(${Math.sin(f / 20) * 10}px)`, opacity: p(f, 872, 8)}} />
      <div style={{position: 'absolute', left: 140, top: 420, fontFamily: FONT, fontSize: 190, fontWeight: 800, letterSpacing: -6, lineHeight: 1, transformOrigin: 'left',
        transform: `scaleX(.78) translateY(${30 * (1 - head)}px)`, background: HEAVYFILL, WebkitBackgroundClip: 'text', color: 'transparent', opacity: head,
        filter: `drop-shadow(0 0 6px rgba(184,255,55,.25)) blur(${10 * (1 - head)}px)`, WebkitMaskImage: `linear-gradient(90deg,#000 ${head * 100}%,transparent ${head * 100 + 10}%)`}}>Consistency</div>
      <div style={{position: 'absolute', left: 150, top: 620, fontFamily: FONT, fontSize: 46, fontWeight: 300, color: '#fff', opacity: p(f, 916, 8)}}>is the <span style={{fontFamily: 'Allura', fontSize: 96, color: C.pale}}>key</span></div>
      <svg width={380} height={160} style={{position: 'absolute', left: 560, top: 560, opacity: key, transform: `rotate(${keyRot}deg) scale(${0.6 + 0.4 * key})`,
        filter: `drop-shadow(0 0 10px ${C.mid}) drop-shadow(0 0 26px ${C.mint})`}}>
        <defs><linearGradient id="kg" x1="0" x2="1"><stop offset="0" stopColor="#4CDAB4" /><stop offset="1" stopColor="#C2F433" /></linearGradient></defs>
        <circle cx={70} cy={80} r={56} fill="none" stroke="url(#kg)" strokeWidth={22} /><rect x={120} y={70} width={230} height={22} rx={8} fill="url(#kg)" />
        <rect x={290} y={88} width={20} height={44} rx={4} fill="#C2F433" /><rect x={326} y={88} width={20} height={34} rx={4} fill="#C2F433" /></svg>
    </>
  );
};
