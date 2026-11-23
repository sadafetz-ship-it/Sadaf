import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {C, FONT} from './theme';
import {f, pop, tw} from './timing';
import {BottomGlow, CardGrid, Chip, DrawPath, ExplainerBG, glass, Plus, XHead, cardIn} from './ui';

/** Mounts a full-background scene for [start, end) with entry: scale 1.08 → 1, blur 20 → 0 (6 f). */
export const SceneWrap: React.FC<{start: number; end: number; seed: number; children: React.ReactNode; bg?: boolean}> = ({start, end, seed, children, bg = true}) => {
  const frame = useCurrentFrame();
  const a = f(start);
  if (frame < a || frame >= f(end)) return null;
  return (
    <AbsoluteFill style={{transform: `scale(${tw(frame, a, 5, 1.12, 1)})`, filter: `blur(${tw(frame, a, 5, 28, 0)}px)`}}>
      {bg && <ExplainerBG seed={seed} />}
      {children}
    </AbsoluteFill>
  );
};

const ax: React.CSSProperties = {font: `500 30px ${FONT.ui}`, color: 'rgba(238,231,255,.65)'};

// ───────────────────────── 01 DefiLlama — dashboard ─────────────────────────
export const DefiLlamaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const S = 8.7;
  const CURVE = 'M0 330 C90 320 150 300 230 290 S360 210 450 225 S580 120 660 130 S780 60 820 40';
  const draw = tw(frame, f(8.84), 24, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  const dot = pop(frame, f(9.34), 7);
  const chips = ['Chains', 'Protocols', 'Yields', 'Stablecoins'];
  return (
    <SceneWrap start={S} end={11.96} seed={4}>
      <XHead k="01 / 04 · DEFI DATA HUB" title="DefiLlama" at={f(S)} />
      <div style={{...glass({left: 100, right: 100, top: 440, height: 700, padding: '44px 50px'}), ...cardIn(frame, f(S) + 1)}}>
        <CardGrid /><BottomGlow />
        <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={ax}>All of DeFi, one dashboard</span><Chip>Live data ▾</Chip>
        </div>
        <div style={{...ax, position: 'absolute', left: 50, top: 150, opacity: tw(frame, f(8.84), 8, 0, 1)}}>Value</div>
        <svg width={780} height={420} style={{position: 'absolute', left: 60, top: 190, overflow: 'visible'}}>
          <defs>
            <linearGradient id="dl" x1="0" x2="1"><stop offset="0" stopColor={C.blue} stopOpacity=".4" /><stop offset=".6" stopColor={C.violet} /><stop offset="1" stopColor={C.lilac} /></linearGradient>
            <linearGradient id="df" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.violet} stopOpacity=".4" /><stop offset="1" stopColor={C.violet} stopOpacity="0" /></linearGradient>
          </defs>
          <DrawPath d="M10 0 V400 H780" p={tw(frame, f(S) + 4, 14, 0, 1)} stroke="rgba(238,231,255,.45)" width={2.5} />
          <path d={`${CURVE} L820 400 L0 400Z`} fill="url(#df)" opacity={draw} />
          <DrawPath d={CURVE} p={draw} stroke="url(#dl)" width={8} glow={C.violet} />
          <circle cx={660} cy={130} r={34 * dot} fill="none" stroke={C.rose} strokeOpacity={0.6} strokeWidth={2.5} />
          <circle cx={660} cy={130} r={16 * dot} fill={C.mist} style={{filter: `drop-shadow(0 0 18px ${C.lilac})`}} />
        </svg>
        <div style={{...ax, position: 'absolute', right: 50, top: 560, opacity: tw(frame, f(8.84) + 8, 8, 0, 1)}}>Time</div>
        <div style={{position: 'absolute', left: 50, right: 50, bottom: 44, display: 'flex', gap: 18, justifyContent: 'center'}}>
          {chips.map((c, i) => (
            <span key={c} style={{font: `600 26px ${FONT.ui}`, padding: '10px 22px', borderRadius: 999, background: 'rgba(185,154,245,.14)',
              border: '1.5px solid rgba(185,154,245,.3)', transform: `scale(${pop(frame, f(10.58) + i * 3, 7)})`}}>{c}</span>
          ))}
        </div>
      </div>
      <Plus x={120} y={400} size={46} at={f(S) + 4} />
      <Plus x={930} y={1150} size={36} color={C.blue} at={f(9.34)} />
    </SceneWrap>
  );
};

// ───────────────────────── 02 CoinGlass — three cards ─────────────────────────
const ICONS = {
  bars: (
    <svg viewBox="0 0 64 64" width={120} height={120}><defs><linearGradient id="ib" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={C.deep} /><stop offset="1" stopColor="#9FB0FF" /></linearGradient></defs>
      <rect x="6" y="34" width="12" height="24" rx="4" fill="url(#ib)" /><rect x="26" y="22" width="12" height="36" rx="4" fill="url(#ib)" /><rect x="46" y="8" width="12" height="50" rx="4" fill="url(#ib)" /></svg>
  ),
  bolt: (
    <svg viewBox="0 0 64 64" width={120} height={120}><defs><linearGradient id="il" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F3B6FF" /><stop offset="1" stopColor={C.magenta} /></linearGradient></defs>
      <path d="M36 4 10 36h18l-4 24 28-34H34z" fill="url(#il)" /></svg>
  ),
  target: (
    <svg viewBox="0 0 64 64" width={120} height={120} fill="none"><circle cx="32" cy="32" r="26" stroke={C.rose} strokeWidth={6} /><circle cx="32" cy="32" r="14" stroke="#FFB3DD" strokeWidth={6} /><circle cx="32" cy="32" r="5" fill="#FFE3F2" /></svg>
  ),
};

export const CoinGlassScene: React.FC = () => {
  const frame = useCurrentFrame();
  const S = 14.0;
  const cards = [
    {x: 60, icon: ICONS.bars, title: <>Open<br />interest</>, sub: 'Open futures positions across exchanges', t: 16.7, g1: C.blueLight, g2: 'rgba(91,108,255,.6)'},
    {x: 395, icon: ICONS.bolt, title: <>Liquidations</>, sub: 'Positions force-closed, by price level', t: 17.84, g1: '#E7A0FF', g2: 'rgba(198,91,242,.6)'},
    {x: 730, icon: ICONS.target, title: <>Key<br />data</>, sub: 'Funding rates, long/short ratios & more', t: 19.04, g1: '#FFB3DD', g2: 'rgba(255,126,200,.55)'},
  ];
  return (
    <SceneWrap start={S} end={20.56} seed={5}>
      <XHead k="02 / 04 · DERIVATIVES DATA" title="CoinGlass" at={f(S)} />
      {cards.map((c, i) => {
        const ghost = tw(frame, f(S) + 6 + i * 3, 8, 0, 0.28); // outline appears early, lights up on its word
        const lit = tw(frame, f(c.t) - 1, 8, 0, 1);
        const iconY = interpolate(frame, [f(c.t) - 1, f(c.t) + 6, f(c.t) + 10], [-140, 8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const bump = interpolate(frame, [f(c.t) - 1, f(c.t) + 3, f(c.t) + 8], [1, 1.05, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <React.Fragment key={i}>
            <div style={{...glass({left: c.x, top: 560, width: 290, height: 520, padding: '150px 28px 0'}), opacity: Math.max(ghost, lit), transform: `scale(${bump})`}}>
              <BottomGlow c1={c.g1} c2={c.g2} strength={lit} />
              <div style={{position: 'relative', font: `700 40px ${FONT.display}`, letterSpacing: -1.5, lineHeight: 1.05, opacity: 0.35 + 0.65 * lit}}>{c.title}</div>
              <div style={{position: 'relative', ...ax, marginTop: 16, fontSize: 27, lineHeight: 1.35, opacity: lit}}>{c.sub}</div>
            </div>
            <div style={{position: 'absolute', left: c.x + 85, top: 470 + iconY, opacity: lit, zIndex: 6, filter: `drop-shadow(0 0 26px ${c.g1})`}}>{c.icon}</div>
          </React.Fragment>
        );
      })}
      <Plus x={90} y={430} size={40} at={f(16.7)} />
      <Plus x={960} y={1140} size={50} color={C.lilac} at={f(19.04)} rot={20} />
    </SceneWrap>
  );
};

// ───────────────────────── 03a CryptoQuant — flow diagram ─────────────────────────
export const FlowsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const S = 22.68;
  const inP = tw(frame, f(25.32) - 1, 12, 0, 1), outP = tw(frame, f(26.16) - 1, 12, 0, 1);
  const IN = 'M360 140 C480 60 560 60 670 120', OUT = 'M680 320 C560 390 480 390 360 330';
  // particles travelling along the arrows (parametric bezier)
  const bez = (t: number, p: number[]) => {
    const [x0, y0, x1, y1, x2, y2, x3, y3] = p, u = 1 - t;
    return [u ** 3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3, u ** 3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3];
  };
  const runners = (p: number[], start: number, col: string) => frame < start + 12 ? null : [0, 0.33, 0.66].map((o, i) => {
    const t = ((frame - start) / 30 + o) % 1; const [x, y] = bez(t, p);
    return <circle key={i} cx={x} cy={y} r={8} fill={C.mist} style={{filter: `drop-shadow(0 0 10px ${col})`}} />;
  });
  return (
    <SceneWrap start={S} end={27.72} seed={6}>
      <XHead k="03 / 04 · ON-CHAIN ANALYTICS" title="CryptoQuant" at={f(S)} />
      <div style={{...glass({left: 70, top: 620, width: 280, height: 280, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}),
        transform: `scale(${pop(frame, f(S) + 6, 8)})`}}>
        <BottomGlow c1={C.blueLight} c2="rgba(91,108,255,.5)" />
        <svg viewBox="0 0 64 64" width={96} height={96} fill="none" stroke={C.mist} strokeWidth={4} style={{position: 'relative'}}><rect x="8" y="16" width="48" height="36" rx="8" /><path d="M40 30h16v12H40a6 6 0 0 1 0-12z" /></svg>
        <div style={{position: 'relative', font: `700 40px ${FONT.display}`, marginTop: 10}}>Wallets</div>
      </div>
      <div style={{...glass({left: 690, top: 590, width: 330, height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}),
        transform: `scale(${pop(frame, f(S) + 10, 8)})`}}>
        <BottomGlow />
        <svg viewBox="0 0 64 64" width={120} height={120} fill="none" stroke={C.mist} strokeWidth={4} strokeLinejoin="round" style={{position: 'relative'}}><path d="M6 24 32 8l26 16z" /><path d="M12 28v20M24 28v20M40 28v20M52 28v20M6 54h52" /></svg>
        <div style={{position: 'relative', font: `700 42px ${FONT.display}`, marginTop: 12}}>Exchange</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center', opacity: tw(frame, f(23.62), 8, 0, 1),
        transform: `translateY(${tw(frame, f(23.62), 8, 20, 0)}px)`}}><Chip>On-chain</Chip></div>
      <svg width={1080} height={600} style={{position: 'absolute', left: 0, top: 520, overflow: 'visible', zIndex: 5}}>
        <defs>
          <marker id="ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9FB0FF" /></marker>
          <marker id="ah2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill={C.rose} /></marker>
        </defs>
        <DrawPath d={IN} p={inP} stroke={C.blue} width={7} glow={C.blue} marker="url(#ah)" />
        <DrawPath d={OUT} p={outP} stroke={C.rose} width={7} glow={C.rose} marker="url(#ah2)" />
        {runners([360, 140, 480, 60, 560, 60, 670, 120], f(25.32), C.blueLight)}
        {runners([680, 320, 560, 390, 480, 390, 360, 330], f(26.16), C.rose)}
        <text x={515} y={30} fill="#9FB0FF" fontFamily="Inter" fontWeight={700} fontSize={36} textAnchor="middle" opacity={inP}
          style={{transform: `scale(${pop(frame, f(25.32), 7)})`, transformOrigin: '515px 20px'}}>INFLOWS</text>
        <text x={520} y={450} fill={C.rose} fontFamily="Inter" fontWeight={700} fontSize={36} textAnchor="middle" opacity={outP}
          style={{transform: `scale(${pop(frame, f(26.16), 7)})`, transformOrigin: '520px 440px'}}>OUTFLOWS</text>
      </svg>
      <Plus x={140} y={1010} size={40} color={C.lilac} at={f(25.32)} />
      <Plus x={900} y={450} size={44} at={f(S) + 8} />
    </SceneWrap>
  );
};

// ───────────────────────── 03b CryptoQuant — entry / exit chart ─────────────────────────
export const EntryExitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const S = 27.72;
  const WAVE = 'M0 300 C90 290 150 340 240 330 S360 160 450 170 S560 360 640 350 S780 120 880 90';
  const draw = tw(frame, f(28.0), 30, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  const en = pop(frame, f(29.84) - 1, 7), ex = pop(frame, f(30.66) - 1, 7);
  return (
    <SceneWrap start={S} end={31.82} seed={7}>
      <XHead k="03 / 04 · CRYPTOQUANT" title="Spot the moves" at={f(S)} />
      <svg width={960} height={560} style={{position: 'absolute', left: 60, top: 520, overflow: 'visible'}}>
        {[80, 180, 280, 380].map((y, i) => <line key={y} x1={60} x2={60 + 880 * tw(frame, f(S) + 3 + i * 2, 12, 0, 1)} y1={y} y2={y} stroke="rgba(238,231,255,.12)" strokeWidth={2} />)}
        <DrawPath d="M60 0 V470 H940" p={tw(frame, f(S) + 2, 14, 0, 1)} stroke="rgba(238,231,255,.45)" width={2.5} />
        <text x={0} y={20} fill="rgba(238,231,255,.65)" fontFamily="Inter" fontSize={28}>Price</text>
        <text x={940} y={515} fill="rgba(238,231,255,.65)" fontFamily="Inter" fontSize={28} textAnchor="end">Time</text>
        <g transform="translate(60 40)">
          <defs><linearGradient id="wl" x1="0" x2="1"><stop offset="0" stopColor={C.blue} /><stop offset=".5" stopColor={C.violet} /><stop offset="1" stopColor={C.lilac} /></linearGradient></defs>
          <rect x={226} y={330} width={28} height={100 * en} fill="url(#wl)" opacity={0.18} />
          <rect x={436} y={170} width={28} height={260 * ex} fill={C.rose} opacity={0.12} />
          <DrawPath d={WAVE} p={draw} stroke="url(#wl)" width={9} glow={C.violet} />
          <g style={{transform: `scale(${en})`, transformOrigin: '240px 360px'}}>
            <circle cx={240} cy={330} r={18} fill={C.mist} style={{filter: `drop-shadow(0 0 16px ${C.blue})`}} />
            <rect x={150} y={372} width={180} height={58} rx={29} fill={C.blue} style={{filter: `drop-shadow(0 0 16px ${C.blue})`}} />
            <text x={240} y={411} fill={C.mist} fontFamily="Inter" fontWeight={800} fontSize={30} textAnchor="middle">ENTRY</text>
          </g>
          <g style={{transform: `scale(${ex})`, transformOrigin: '450px 140px'}}>
            <circle cx={450} cy={170} r={18} fill={C.mist} style={{filter: `drop-shadow(0 0 16px ${C.rose})`}} />
            <rect x={370} y={78} width={160} height={58} rx={29} fill={C.rose} style={{filter: `drop-shadow(0 0 16px ${C.rose})`}} />
            <text x={450} y={117} fill={C.ink} fontFamily="Inter" fontWeight={800} fontSize={30} textAnchor="middle">EXIT</text>
          </g>
        </g>
      </svg>
      <Plus x={110} y={470} size={44} at={f(29.84)} />
      <Plus x={940} y={1120} size={40} color={C.blue} at={f(30.66)} />
    </SceneWrap>
  );
};

// ───────────────────────── CTA — card over blurred footage ─────────────────────────
export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const S = 33.5;
  const bar = tw(frame, f(34.0), 14, 0, 75);
  const btn = pop(frame, f(35.12) - 1, 8);
  const pulse = interpolate(frame, [f(35.4), f(35.4) + 6, f(35.4) + 16], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <SceneWrap start={S} end={37.42} seed={8} bg={false}>
      <div style={{...glass({left: 120, right: 120, top: 300, padding: '56px 56px 64px', textAlign: 'center', borderRadius: 52}), ...cardIn(frame, f(S) + 2)}}>
        <CardGrid /><BottomGlow />
        <svg width={170} height={170} viewBox="0 0 100 100" style={{position: 'relative', display: 'block', margin: '0 auto',
          transform: `scale(${pop(frame, f(S) + 8, 8) * (1 + pulse * 0.12)}) rotateY(${tw(frame, f(S) + 8, 16, 180, 0)}deg)`,
          filter: `drop-shadow(0 0 ${30 + pulse * 30}px ${C.violet})`}}>
          <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={C.lilac} /><stop offset=".5" stopColor={C.violet} /><stop offset="1" stopColor={C.magenta} /></linearGradient></defs>
          <circle cx={50} cy={50} r={46} fill="url(#cg)" /><circle cx={50} cy={50} r={38} fill="none" stroke={C.mist} strokeOpacity={0.5} strokeWidth={2} />
          <text x={50} y={68} textAnchor="middle" fontFamily="DejaVu Sans" fontWeight={700} fontSize={50} fill={C.mist}>₿</text>
        </svg>
        <div style={{position: 'relative', font: `500 34px ${FONT.ui}`, color: 'rgba(238,231,255,.75)', marginTop: 26}}>Want the full website list?</div>
        <div style={{position: 'relative', height: 26, borderRadius: 99, background: 'rgba(185,154,245,.15)', border: '1.5px solid rgba(185,154,245,.2)', margin: '34px 0 12px', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${bar}%`, borderRadius: 99, background: `linear-gradient(90deg,${C.deep},${C.violet},${C.magenta})`, boxShadow: `0 0 30px ${C.violet}`}} />
        </div>
        <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', font: `500 30px ${FONT.ui}`, color: 'rgba(238,231,255,.75)'}}>
          <span>Sites revealed</span><span>{Math.round((bar / 75) * 3)} / 4</span>
        </div>
        <div style={{position: 'relative', marginTop: 40, background: C.mist, color: C.ink, font: `800 54px ${FONT.display}`, padding: 30, borderRadius: 999,
          transform: `scale(${btn * (1 + pulse * 0.06)})`, boxShadow: `0 0 ${50 + pulse * 40}px rgba(185,154,245,.6),0 0 ${110 + pulse * 60}px rgba(198,91,242,.5)`}}>
          Comment “BITCOIN”
        </div>
      </div>
      <Plus x={120} y={280} size={50} at={f(S) + 6} />
      <Plus x={900} y={330} size={40} color={C.lilac} at={f(35.12)} rot={20} />
      <Plus x={170} y={1080} size={30} color={C.blue} at={f(35.4)} />
    </SceneWrap>
  );
};
