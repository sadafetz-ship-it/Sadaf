import React from 'react';
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile} from 'remotion';
import {useCurrentFrame} from './frame';
import {C, FONT} from './theme';
import {BEHIND_NAMES, cameraZoom, f, pop, SCENES, tw} from './timing';
import {BottomGlow, CardGrid, Chip, Dot, glass, Metallic, Plus} from './ui';
import {AvatarOrbit, GaugeCounter, GlowProductCard} from './RefFx';

/** Motion graphics from the WA0007 grid reference (preview: gauge, avatar orbit, glow product cards). */
const REF_FX = true;
const SITE_CARDS: [string, number, number, string, string][] = [
  ['DefiLlama', 6.74, 8.7, 'DeFi data', 'TVL · yields · chains'],
  ['CoinGlass', 12.98, 13.96, 'Derivatives', 'open interest · liquidations'],
  ['CryptoQuant', 21.12, 22.64, 'On-chain', 'exchange in / outflows'],
  ['Farside', 38.34, 40.0, 'ETF flows', 'Bitcoin & Ethereum ETFs'],
];
import {PillTag} from './Pixel';
import {bloomIn, GLOW, GLOW_FILL, InkLine, ScriptPixels, zoomDropIn} from './CardFx';
import {ArcText, StackTiles} from './Extras';

const LABELS: Record<string, [string, string]> = {
  DefiLlama: ['First,', 'Site 01'], CoinGlass: ['Second,', 'Site 02'], CryptoQuant: ['Third,', 'Site 03'], Farside: ['And lastly,', 'Site 04'],
};
const NAME_FILL = 'linear-gradient(180deg,#D9C9FF 0%,#B08CFF 45%,#8B5CFF 100%)';
const NAME_GLOW = 'drop-shadow(0 4px 10px rgba(13,6,32,.85)) drop-shadow(0 0 10px rgba(139,92,255,.9)) drop-shadow(0 0 28px rgba(128,80,232,.75)) drop-shadow(0 0 60px rgba(84,38,168,.6))';

/** Site name behind the head — Nexus-style lockup (user ref): small word top-left, small label top-right, huge solid
 *  neon name between two outlined rounded squares, Scripts pixel reveal; purple palette. */
const BehindName: React.FC<{name: string; t: number; end: number}> = ({name, t, end}) => {
  const frame = useCurrentFrame();
  const at = f(t) - 1;
  if (frame < at - 6 || frame > f(end)) return null;
  const drift = 1 + Math.max(0, frame - at) * 0.0006;
  const size = Math.min(200, Math.floor(820 / (name.length * 0.6)));
  const [left, right] = LABELS[name];
  const lab = (d: number): React.CSSProperties => ({opacity: tw(frame, at + d, 6, 0, 1), transform: `translateY(${tw(frame, at + d, 8, 14, 0)}px)`,
    filter: `blur(${tw(frame, at + d, 8, 10, 0)}px)`});
  const sq = (d: number): React.CSSProperties => ({width: 40, height: 40, borderRadius: 11, border: '4px solid rgba(238,231,255,.85)',
    boxShadow: '0 0 14px rgba(185,154,245,.7)', flex: 'none', transform: `scale(${pop(frame, at + d, 7)})`});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center', zIndex: 2, transform: `scale(${drift})`}}>
      <div style={{position: 'relative', width: 980}}>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 70px', font: `500 58px ${FONT.display}`, letterSpacing: -1.5, color: C.mist,
          textShadow: '0 2px 16px rgba(25,13,50,.8)'}}>
          <span style={lab(2)}>{left}</span><span style={lab(5)}>{right}</span>
        </div>
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, marginTop: -6}}>
          <div style={sq(4)} />
          <div style={{position: 'relative', font: `800 ${size}px ${FONT.display}`, letterSpacing: -size * 0.045, lineHeight: 1}}>
            <ScriptPixels at={at} w={name.length * size * 0.5} h={size} seed={`bn${name}`} size={34} />
            <div style={{display: 'inline-block', transformOrigin: '50% 70%', ...bloomIn(frame, at, 10), filter: `${bloomIn(frame, at, 10).filter} ${NAME_GLOW}`}}>
              <span style={{background: NAME_FILL, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{name}</span>
            </div>
          </div>
          <div style={sq(6)} />
        </div>
      </div>
    </div>
  );
};

const LOCK = (
  <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth={2}>
    <rect x="4" y="11" width="16" height="10" rx="3" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

/** Hook: small "Classified" card with 4 locked rows (on "websites", 1.82 s → out 2.94 s). */
const ClassifiedCard: React.FC = () => {
  const frame = useCurrentFrame();
  const at = f(1.82), out = f(2.94);
  if (frame < at || frame > out + 8) return null;
  const o = interpolate(frame, [out, out + 6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{...glass({left: 230, width: 620, top: 820, padding: '34px 44px 44px', borderRadius: 44}),
      ...zoomDropIn(frame, at, {rot: -3}), opacity: zoomDropIn(frame, at, {rot: -3}).opacity as number * o,
      filter: `${zoomDropIn(frame, at, {rot: -3}).filter} blur(${(1 - o) * 20}px)`, zIndex: 30}}>
      <CardGrid /><BottomGlow />
      <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', font: `500 28px ${FONT.ui}`, color: 'rgba(238,231,255,.6)'}}>
        <span>Classified</span><Chip>4 sites</Chip>
      </div>
      {[300, 240, 330, 210].map((w, i) => (
        <div key={i} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 22, margin: '18px 0',
          opacity: tw(frame, at + 3 + i * 3, 6, 0, 1), transform: `translateX(${tw(frame, at + 3 + i * 3, 8, -30, 0)}px)`}}>
          <span style={{font: `700 28px ${FONT.mono}`, color: C.lilac}}>0{i + 1}</span>{LOCK}
          <div style={{height: 36, width: w, borderRadius: 12, background: 'linear-gradient(90deg,rgba(185,154,245,.4),rgba(198,91,242,.3),rgba(91,108,255,.25))'}} />
        </div>
      ))}
    </div>
  );
};

/** "mad": 😤 sticker beside the head + magenta edge flash. */
const MadSticker: React.FC = () => {
  const frame = useCurrentFrame();
  const at = f(4.46) - 1, out = f(6.34);
  if (frame < at || frame > out) return null;
  const s = interpolate(frame, [at, at + 5, at + 8], [0, 1.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wobble = Math.sin((frame - at) / 3) * 6 * Math.exp(-(frame - at) / 20);
  return (
    <>
      <AbsoluteFill style={{zIndex: 25, boxShadow: `inset 0 0 220px rgba(198,91,242,${interpolate(frame, [at, at + 2, at + 14], [0, 0.75, 0.25], {extrapolateRight: 'clamp'})})`}} />
      <div style={{position: 'absolute', left: 720, top: 430, fontSize: 120, zIndex: 26, transform: `scale(${s}) rotate(${14 + wobble}deg)`,
        filter: 'drop-shadow(0 0 24px rgba(198,91,242,.8))'}}>😤</div>
    </>
  );
};



/** Farside board — ORIGINAL look (purple card over the chest: title, glowing divider, star bullets),
 *  animated like the input-bar reference: starts as a small bar whose title types on behind a spark → "+" →
 *  orb lifts off, hovers, drops in (white flash) → bar expands into the full board → bullets pop on their words →
 *  glossy cube bounces onto the corner → folds back into the bar at the end. */
const FarsideBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const S = f(39.75), END = f(44.5 + 0.6);   // starts as the Farside product card hands over
  if (frame < S) return null;
  const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const LEFT = 290, W = 500, TOP = 830, BAR_H = 140, FULL_H = 350;
  const t1 = 'Farside', t2 = 'ETF Flow Tracker';
  // 1 · bar in + title typing with a spark caret
  const typed = Math.floor(interpolate(frame, [S + 2, S + 9], [0, t1.length + t2.length], cl));
  const s1 = t1.slice(0, Math.min(typed, t1.length)), s2 = t2.slice(0, Math.max(0, typed - t1.length));
  const plusS = pop(frame, S + 9, 5);
  // 2 · orb lifts off the "+", hovers, drops on "inflows"
  const drop = f(40.44) - 3;
  const lift = interpolate(frame, [S + 10, S + 15], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const fall = interpolate(frame, [drop - 4, drop], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
  const orbX = LEFT + W - 44 + lift * 60 + Math.sin(frame / 7) * 5 * (1 - fall);
  const orbY = TOP + 44 - lift * 170 + Math.cos(frame / 9) * 7 * (1 - fall) + fall * 190;
  // 3 · flash + expand to the full board; fold back at the end
  const flashW = interpolate(frame, [drop, drop + 2, drop + 7], [0, 0.85, 0], cl);
  const open = tw(frame, drop + 1, 10, 0, 1);
  const collapse = interpolate(frame, [END - 16, END - 8], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
  const amt = open * (1 - collapse);
  const h = BAR_H + (FULL_H - BAR_H) * amt;
  const line = tw(frame, drop + 4, 12, 0, 100) * (1 - collapse);
  const fade = interpolate(frame, [END - 8, END - 1], [1, 0], cl);
  const items: [string, number][] = [['Inflows', 40.44], ['Outflows', 41.16], ['Ethereum ETFs', 42.34], ['Bitcoin ETFs', 43.24]];
  const cube = f(43.24) + 4;
  const cubeS = interpolate(frame, [cube, cube + 5, cube + 9, cube + 12], [0, 1.25, 0.92, 1], cl) * (1 - collapse);
  return (
    <>
      <div style={{position: 'absolute', left: LEFT, width: W, top: TOP, height: h, zIndex: 30, borderRadius: 22, overflow: 'hidden', padding: '36px 48px 30px',
        background: `linear-gradient(170deg,rgba(128,80,232,.78) 0%,rgba(84,38,168,.82) 45%,rgba(25,13,50,.9) 100%)`,
        border: '1.5px solid rgba(185,154,245,.45)', boxShadow: '0 30px 80px rgba(25,13,50,.55), 0 0 60px rgba(128,80,232,.35), inset 0 1px 0 rgba(238,231,255,.3)',
        backdropFilter: 'blur(16px)', opacity: fade * tw(frame, S, 6, 0, 1),
        transform: `translateY(${tw(frame, S, 10, 90, 0)}px) scale(${tw(frame, S, 10, 0.94, 1)})`, filter: `blur(${tw(frame, S, 8, 20, 0)}px)`}}>
        <div style={{textAlign: 'center', font: `600 46px ${FONT.display}`, letterSpacing: -1, lineHeight: 1.05, color: C.mist, minHeight: 84}}>
          {s1}<br /><span style={{font: `500 34px ${FONT.display}`, color: 'rgba(238,231,255,.85)'}}>{s2}</span>
        </div>
        <div style={{position: 'absolute', right: 16, top: 16, width: 44, height: 44, borderRadius: '50%', background: 'rgba(238,231,255,.16)',
          border: '1.5px solid rgba(238,231,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.mist, font: `300 34px ${FONT.ui}`,
          transform: `scale(${plusS}) rotate(${(1 - plusS) * 180 + open * 45}deg)`}}>+</div>
        <div style={{height: 5, borderRadius: 3, margin: '22px auto 22px', width: `${line}%`, background: `linear-gradient(90deg,${C.lilac},${C.mist},${C.lilac})`,
          boxShadow: `0 0 14px ${C.lilac}, 0 0 30px ${C.violet}`}} />
        {items.map(([label, t], i) => {
          const a = Math.max(f(t) - 1, drop + 6);
          if (frame < a) return <div key={i} style={{height: 38}} />;
          const chars = Math.floor(tw(frame, a, 8, 0, label.length, (x) => x));
          const tw2 = 1 + 0.5 * Math.exp(-(frame - a) / 5) * Math.abs(Math.sin((frame - a) / 2));
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, height: 38, font: `500 30px ${FONT.ui}`, color: C.mist, opacity: 1 - collapse,
              transform: `scale(${interpolate(frame, [a, a + 4, a + 7], [0.6, 1.08, 1], cl)})`, transformOrigin: '0 50%'}}>
              <svg width={40} height={40} viewBox="0 0 24 24" style={{transform: `scale(${pop(frame, a, 6) * tw2}) rotate(${(frame - a) * 2}deg)`,
                filter: `drop-shadow(0 0 8px ${C.mist}) drop-shadow(0 0 16px ${C.lilac})`}}>
                <path d="M12 0C12.6 8 16 11.4 24 12 16 12.6 12.6 16 12 24 11.4 16 8 12.6 0 12 8 11.4 11.4 8 12 0Z" fill={C.mist} />
              </svg>
              <span>{label.slice(0, chars)}<span style={{opacity: chars < label.length ? 0.5 : 0}}>{label[chars] ?? ''}</span></span>
            </div>
          );
        })}
        <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flashW}} />
      </div>
      {/* glossy cube bounces onto the corner */}
      <div style={{position: 'absolute', left: LEFT + W - 56, top: TOP + h - 96, width: 92, height: 92, zIndex: 31, borderRadius: 24, opacity: fade,
        transform: `scale(${cubeS}) rotate(${-12 + Math.sin((frame - cube) / 4) * 4 * Math.exp(-Math.max(0, frame - cube) / 14)}deg)`,
        background: `linear-gradient(150deg,#E6D8FF 0%,${C.lilac} 30%,${C.violet} 70%,${C.deep} 100%)`,
        boxShadow: `inset 0 4px 0 rgba(255,255,255,.7), inset -10px -14px 20px rgba(84,38,168,.6), 0 20px 40px rgba(0,0,0,.5), 0 0 50px rgba(185,154,245,.6)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', font: `800 56px ${FONT.display}`, color: C.mist, textShadow: '0 3px 8px rgba(84,38,168,.8)'}}>₿</div>
      {/* spark caret while typing, then the orb */}
      {frame >= S + 2 && frame < S + 10 && <BoardSpark x={LEFT + W / 2 + (typed <= t1.length ? s1.length * 13 : s2.length * 9.5)} y={TOP + (typed <= t1.length ? 60 : 104)} size={16} />}
      {frame >= S + 10 && frame < drop + 1 && <BoardSpark x={orbX} y={orbY} size={24} />}
    </>
  );
};

const BoardSpark: React.FC<{x: number; y: number; size: number}> = ({x, y, size}) => (
  <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%', background: '#fff', zIndex: 35,
    boxShadow: `0 0 ${size}px ${size / 2}px rgba(255,255,255,.9), 0 0 ${size * 3}px ${size}px rgba(185,154,245,.7), 0 0 ${size * 6}px ${size * 2}px rgba(128,80,232,.45)`}} />
);

/** Footage layer, behind-head names, speaker cut-out, plus talking-head-only graphics. Always mounted until speech ends. */
export const Talk: React.FC = () => {
  const frame = useCurrentFrame();
  const z = cameraZoom(frame);
  const cta = SCENES.find((s) => s.kind === 'cta')!;
  const ctaAmt = interpolate(frame, [f(cta.start), f(cta.start) + 6, f(cta.end) - 4, f(cta.end)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // shot-entry: scale 1.2 → 1, blur 30 → 0 over 4 f at every return to the talking head
  const entries = SCENES.filter((s) => s.kind === 'talk').map((s) => f(s.start));
  const e = entries.filter((x) => frame >= x && frame < x + 5).pop();
  const entryScale = e !== undefined ? tw(frame, e, 4, 1.2, 1) : 1;
  const entryBlur = e !== undefined ? tw(frame, e, 4, 30, 0) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${z * entryScale})`, transformOrigin: '50% 35%',
        filter: `blur(${entryBlur + ctaAmt * 22}px) brightness(${1 - ctaAmt * 0.55}) saturate(${1 + ctaAmt * 0.3})`}}>
        <OffthreadVideo src={staticFile('raw.mp4')} muted />
        {BEHIND_NAMES.map((b) => <BehindName key={b.name} {...b} />)}
        <AbsoluteFill style={{zIndex: 3}}>
          <OffthreadVideo src={staticFile('speaker_cutout.webm')} transparent muted />
        </AbsoluteFill>
        <AbsoluteFill style={{zIndex: 4, background: 'linear-gradient(180deg,rgba(25,13,50,.45) 0%,rgba(25,13,50,0) 18%,rgba(25,13,50,0) 46%,rgba(25,13,50,.75) 66%,rgba(25,13,50,.95) 100%)'}} />
      </AbsoluteFill>
      <InkLine x={540} y={820} at={f(1.82)} h={160} />
      {REF_FX ? <GaugeCounter at={f(1.82)} out={f(2.94)} value={4} kicker="CLASSIFIED" label="crypto websites" x={540} y={975} scale={0.72} /> : <ClassifiedCard />}
      {REF_FX && <AvatarOrbit at={f(2.94)} collapse={f(4.46)} out={f(4.75)} cx={540} cy={520} r={430} />}
      {REF_FX && SITE_CARDS.map(([name, t, end, title, sub]) => (
        <GlowProductCard key={name} at={f(t) + 8} out={f(end) - 8} name={name} title={title} sub={sub} x={540} y={985} scale={0.62} />
      ))}
      <FarsideBoard />
      {/* text arcing over the head (ref R1) */}
      <ArcText text="these crypto websites" at={f(1.22)} end={f(2.94)} cx={540} cy={610} r={285} />
      {/* stacked 3D tiles counting the sites (ref R1) */}
      <StackTiles times={BEHIND_NAMES.map((b) => f(b.t))}
        show={[[f(6.34), f(8.7)], [f(11.96), f(14.0)], [f(20.56), f(22.68)], [f(37.42), f(39.2)]]} />
      <MadSticker />
      {/* talking-head sparkles */}
      {frame < f(8.7) && <>
        <Plus x={110} y={1250} size={46} at={f(1.5)} />
        <Plus x={930} y={1150} size={60} color={C.lilac} at={f(1.82)} rot={12} />
        <Plus x={250} y={470} size={40} at={f(4.46)} rot={20} />
        <Plus x={110} y={330} size={52} at={f(6.74)} />
        <Plus x={930} y={520} size={40} color={C.lilac} at={f(6.8)} rot={15} />
      </>}
      {frame >= f(11.96) && frame < f(14) && <><Plus x={120} y={340} size={48} at={f(12.98)} /><Plus x={920} y={540} size={38} color={C.blue} at={f(13.05)} /></>}
      {frame >= f(20.56) && frame < f(22.68) && <><Plus x={100} y={360} size={44} color={C.lilac} at={f(21.12)} /><Plus x={950} y={520} size={40} at={f(21.2)} /></>}
      {frame >= f(31.82) && frame < f(33.5) && <><Plus x={130} y={1260} size={46} at={f(32.4)} /><Plus x={920} y={1180} size={52} color={C.lilac} at={f(32.6)} /></>}
      {frame >= f(37.42) && frame < f(39.2) && <><Plus x={120} y={340} size={48} at={f(38.34)} /><Plus x={930} y={540} size={40} color={C.blue} at={f(38.4)} /></>}
    </AbsoluteFill>
  );
};
