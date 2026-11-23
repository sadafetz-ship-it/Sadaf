import React from 'react';
import {useCurrentFrame, interpolate, random, staticFile, Img} from 'remotion';
import {C, ACC, ACCT, HEAVYFILL, FONT, cl, p, pop, eo} from './theme';

export const cardStyle: React.CSSProperties = {position: 'absolute', borderRadius: 52, padding: '44px 48px', fontFamily: FONT, color: '#fff',
  background: 'linear-gradient(180deg,rgba(30,44,16,.95),rgba(14,21,8,.97)),repeating-linear-gradient(0deg,transparent 0 39px,rgba(216,255,146,.05) 39px 40px)',
  border: '2px solid rgba(132,229,114,.45)', boxShadow: 'inset 0 -3px 0 #84E572,0 40px 90px -30px rgba(76,218,180,.5)'};
export const pillStyle: React.CSSProperties = {display: 'inline-flex', alignItems: 'center', gap: 14, padding: '14px 32px', borderRadius: 999, background: ACC,
  fontSize: 34, fontWeight: 700, letterSpacing: -0.5, color: C.dk, fontFamily: FONT, boxShadow: 'inset 0 2px 0 rgba(255,255,255,.45),0 10px 30px rgba(76,218,180,.35)', whiteSpace: 'nowrap'};
export const btnStyle: React.CSSProperties = {display: 'inline-block', padding: '22px 44px', borderRadius: 999, background: ACC, color: C.dk, fontSize: 40, fontWeight: 700,
  fontFamily: FONT, boxShadow: 'inset 0 2px 0 rgba(255,255,255,.45),0 12px 34px rgba(76,218,180,.45)', whiteSpace: 'nowrap'};
export const Dot = () => <i style={{width: 14, height: 14, borderRadius: '50%', background: C.dk, opacity: 0.75, display: 'inline-block'}} />;
export const Caret: React.FC<{dark?: boolean}> = ({dark}) => {
  const f = useCurrentFrame();
  return <span style={{display: 'inline-block', width: 4, height: '1em', marginLeft: 4, verticalAlign: -4, background: dark ? C.dk : '#fff',
    opacity: Math.floor(f / 8) % 2 ? 0.2 : 1}} />;
};
/** typed substring of text between frames a..b */
export const typed = (f: number, text: string, a: number, b: number) => text.slice(0, Math.round(interpolate(f, [a, b], [0, text.length], cl)));

export const Star: React.FC<{size?: number; color?: string; style?: React.CSSProperties}> = ({size = 44, color = '#fff', style}) => (
  <svg width={size} height={size} viewBox="-22 -22 44 44" style={style}>
    <path d="M0,-20 C2,-4 4,-2 20,0 C4,2 2,4 0,20 C-2,4 -4,2 -20,0 C-4,-2 -2,-4 0,-20Z" fill={color} /></svg>);

/** Gradient number tile with sparkles: spring drop-in, gentle bob, twinkling sparkles. */
export const Tile: React.FC<{n: number; at: number; x: number; y: number; rot: number; dim?: number; out?: number; size?: number}> = ({n, at, x, y, rot, dim = 1, out = 99999, size = 190}) => {
  const f = useCurrentFrame();
  if (f < at || f > out + 8) return null;
  const s = pop(f, at, 9, 1.18);
  const ex = p(f, out, 7);
  const dropY = -220 * (1 - p(f, at, 9));
  const bob = Math.sin((f - at) / 16) * 4;
  const tw = (k: number) => 0.6 + 0.4 * Math.sin((f - at) / 5 + k);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size * 0.27, display: 'grid', placeItems: 'center', background: ACCT,
      boxShadow: 'inset 0 3px 0 rgba(255,255,255,.5),inset 0 -6px 0 rgba(11,42,23,.18),0 18px 40px rgba(0,0,0,.35),0 0 30px rgba(132,229,114,.35)',
      fontFamily: FONT, fontSize: size * 0.63, fontWeight: 800, color: C.dk, opacity: dim * (1 - ex),
      transform: `translateY(${dropY + bob}px) rotate(${rot + (1 - s) * 30}deg) scale(${s * (1 - 0.2 * ex)})`}}>
      <Star size={34} color={C.lime} style={{position: 'absolute', right: -30, top: -6, transform: `scale(${tw(0)}) rotate(${(f - at) * 2}deg)`}} />
      <Star size={22} color={C.mint} style={{position: 'absolute', left: -24, bottom: 4, transform: `scale(${tw(2)})`}} />
      {n}
    </div>
  );
};

/** "Fundamentals of Design" list card: rise, underline draws from centre, star pops + text wipes on spoken frames. */
export const FundCard: React.FC<{title: [string, string]; items: {t: string; f: number}[]; at: number; out: number; top?: number}> = ({title, items, at, out, top = 1035}) => {
  const f = useCurrentFrame();
  if (f < at || f > out + 10) return null;
  const r = p(f, at, 10);
  const ex = p(f, out, 8);
  const ln = p(f, at + 6, 8);
  return (
    <div style={{position: 'absolute', left: 280, top, width: 520, borderRadius: 26, padding: '40px 40px 24px', fontFamily: FONT,
      background: 'linear-gradient(165deg,rgba(78,108,44,.92) 0%,rgba(40,60,24,.94) 45%,rgba(20,30,12,.96) 100%)',
      border: '1px solid rgba(216,255,146,.22)', boxShadow: '0 30px 70px -20px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.12)',
      opacity: r * (1 - ex), transform: `translateY(${40 * (1 - r) + 30 * ex}px) scale(${0.96 + 0.04 * r})`, filter: `blur(${6 * ex}px)`}}>
      <div style={{textAlign: 'center', fontWeight: 500, fontSize: 44, lineHeight: 1.12, letterSpacing: -0.5, color: '#fff', opacity: p(f, at + 3, 8)}}>{title[0]}<br />{title[1]}</div>
      <div style={{height: 5, borderRadius: 3, margin: '20px 8px 24px', background: 'linear-gradient(90deg,transparent,#4CDAB4 18%,#84E572 50%,#C2F433 82%,transparent)',
        boxShadow: '0 0 10px rgba(108,240,194,.6)', transform: `scaleX(${ln})`}} />
      {items.map((it, i) => {
        const s = interpolate(f, [it.f, it.f + 4, it.f + 6], [0, 1.2, 1], cl);
        const w = p(f, it.f + 2, 8);
        return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, fontSize: 40, color: '#fff', margin: '0 0 26px 6px', whiteSpace: 'nowrap', minHeight: 48}}>
          <Star size={44} style={{flex: 'none', transform: `scale(${s}) rotate(${45 * (1 - Math.min(s, 1))}deg)`, filter: `drop-shadow(0 0 6px ${C.mintD}) drop-shadow(0 0 12px rgba(255,255,255,.6))`}} />
          <span style={{opacity: f < it.f + 2 ? 0 : 1, WebkitMaskImage: `linear-gradient(90deg,#000 ${w * 115 - 15}%,transparent ${w * 115}%)`, maskImage: `linear-gradient(90deg,#000 ${w * 115 - 15}%,transparent ${w * 115}%)`,
            transform: `translateX(${-14 * (1 - w)}px)`}}>{it.t}</span></div>;
      })}
    </div>
  );
};

/** F5: input bar types "Editing test" → expands into the application card; progress fills; clover pops. */
export const TestCard: React.FC = () => {
  const f = useCurrentFrame();
  const at = 352, morph = 377, out = 452;
  if (f < at || f > out + 8) return null;
  const ex = p(f, out, 7);
  const barIn = pop(f, at, 7, 1.06);
  const m = p(f, morph, 9);
  const h = interpolate(m, [0, 1], [110, 230]);
  const fill = interpolate(f, [396, 420], [0, 64], {...cl, easing: eo});
  const clover = pop(f, 433, 8, 1.3);
  return (
    <div style={{opacity: 1 - ex, transform: `translateY(${30 * ex}px)`, filter: `blur(${6 * ex}px)`}}>
      <div style={{...cardStyle, left: 150, top: 1030, width: 780, height: h, padding: '30px 44px', overflow: 'hidden', transform: `scale(${barIn})`, borderRadius: interpolate(m, [0, 1], [55, 44])}}>
        <div style={{fontSize: 26, fontWeight: 600, color: C.olive, letterSpacing: 3, textTransform: 'uppercase', height: 30 * m, opacity: m, overflow: 'hidden'}}>Application · Step 2 of 3</div>
        <div style={{fontSize: 52, fontWeight: 700, letterSpacing: -2, marginTop: 4}}>{typed(f, 'Editing test', at + 3, morph - 2)}{f < morph + 4 && <Caret />}</div>
        <div style={{opacity: p(f, morph + 6, 8)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 32, marginTop: 18, color: C.pale}}><span>● In progress</span><span>{Math.round(fill)}%</span></div>
          <div style={{height: 18, borderRadius: 9, background: 'rgba(122,150,63,.35)', overflow: 'hidden', marginTop: 14}}>
            <div style={{width: `${fill}%`, height: '100%', background: ACC, boxShadow: '0 0 12px rgba(132,229,114,.6)'}} /></div></div>
      </div>
      <div style={{position: 'absolute', left: 800, top: 985, fontSize: 80, transform: `rotate(${12 + 20 * (1 - Math.min(clover, 1))}deg) scale(${clover})`, filter: `drop-shadow(0 0 14px ${C.mid})`}}>🍀</div>
    </div>
  );
};

/** F13: quest-card morph — avatar pops → pill types the title → morphs into card → button pops on "find out". */
export const CtaCard: React.FC = () => {
  const f = useCurrentFrame();
  const at = 1168, pillAt = 1176, morph = 1196, btn = 1214, out = 1222;
  if (f < at) return null;
  const ex = p(f, out, 8);
  const av = pop(f, at, 7, 1.2);
  const pw = p(f, pillAt, 8);
  const m = p(f, morph, 9);
  const b = pop(f, btn, 7, 1.15);
  const w = interpolate(m, [0, 1], [interpolate(pw, [0, 1], [96, 640]), 780]);
  const h = interpolate(m, [0, 1], [96, 290]);
  return (
    <div style={{position: 'absolute', left: 540 - w / 2, top: 1030, width: w, height: h, borderRadius: interpolate(m, [0, 1], [48, 52]), overflow: 'hidden',
      ...{background: cardStyle.background, border: cardStyle.border, boxShadow: `${cardStyle.boxShadow},0 0 ${60 * (1 - Math.abs(m - 0.5) * 2)}px rgba(132,229,114,.6)`},
      fontFamily: FONT, color: '#fff', opacity: 1 - ex}}>
      <div style={{position: 'absolute', left: 14, top: 10 + 18 * m, display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{width: 72, height: 72, borderRadius: '50%', padding: 4, background: 'conic-gradient(#C2F433,#84E572,#4CDAB4,#C2F433)', transform: `scale(${av})`, flex: 'none'}}>
          <Img src={staticFile('pbl/avatar.png')} style={{width: '100%', height: '100%', borderRadius: '50%', border: `3px solid ${C.ink}`}} /></div>
        <div style={{whiteSpace: 'nowrap'}}>
          <div style={{fontSize: 34, fontWeight: 700, height: 42 * m, opacity: m, overflow: 'hidden'}}>personalbrandlaunch <Badge size={30} /></div>
          <div style={{fontSize: interpolate(m, [0, 1], [40, 50]), fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.05}}>
            {typed(f, 'Submit your test edit', pillAt + 2, morph - 2)}{f < morph && <Caret />}</div>
        </div>
      </div>
      <div style={{...btnStyle, position: 'absolute', left: 30, bottom: 28, transformOrigin: 'left center', transform: `scale(${b})`}}>Submit edit →</div>
    </div>
  );
};
export const Badge: React.FC<{size?: number}> = ({size = 40}) => <span style={{display: 'inline-grid', placeItems: 'center', width: size, height: size, borderRadius: '50%',
  background: ACCT, color: C.dk, fontSize: size * 0.62, fontWeight: 900, verticalAlign: 'middle'}}>✓</span>;
