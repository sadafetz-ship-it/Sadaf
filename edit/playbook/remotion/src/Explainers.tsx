// Full-screen explainers (absolute frames — mount by range) + transitions.
import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {BIG_NUM, C, GLASS} from './theme';
import {bez, bezD, bloomIn, Burst, Card3D, Caret, cl, Comet, Cursor, DrawPath, easeInOut, exitStyle, pop, prog, Pulse, rollNum, spr, typed, wordIn} from './fx';

/* ---------- world ---------- */
export const World: React.FC<{seed: number; ghost?: [string, number, number, number][]}> = ({seed, ghost = []}) => {
  const f = useCurrentFrame();
  const p1 = 25 + Math.sin(f / 50) * 6, p2 = 76 + Math.cos(f / 60) * 5;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: C.night}}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(45% 55% at ${p1}% 28%,rgba(46,100,176,.55),transparent 70%),radial-gradient(40% 50% at ${p2}% 72%,rgba(30,76,140,.5),transparent 70%),radial-gradient(80% 80% at 50% 50%,#10285A,${C.night} 85%)`}} />
      <div style={{position: 'absolute', inset: -72, transform: `translate(${(f * 0.3) % 72}px, ${(f * 0.15) % 72}px)`,
        backgroundImage: 'linear-gradient(rgba(243,247,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(243,247,255,.05) 1px,transparent 1px)', backgroundSize: '72px 72px',
        WebkitMaskImage: 'radial-gradient(60% 60% at 50% 45%,#000,transparent)'}} />
      {ghost.map(([t, x, y, s], i) => (
        <div key={t} style={{position: 'absolute', left: x + (f % 2000) * (i % 2 ? -0.35 : 0.35), top: y, fontWeight: 600, fontSize: s, letterSpacing: '-0.04em', color: 'rgba(243,247,255,.09)', filter: 'blur(5px)', whiteSpace: 'nowrap'}}>{t}</div>
      ))}
      {Array.from({length: 70}, (_, i) => {
        const s = [2, 3, 4, 5][Math.floor(random(`${seed}s${i}`) * 4)];
        const x = random(`${seed}x${i}`) * 1920 + Math.sin((f + i * 13) / 40) * 10;
        const y = ((random(`${seed}y${i}`) * 1200 - f * (0.4 + random(`${seed}v${i}`) * 0.9)) % 1200 + 1200) % 1200 - 60;
        const o = 0.15 + 0.5 * random(`${seed}o${i}`) * (0.6 + 0.4 * Math.sin((f + i * 7) / 9));
        const lime = random(`${seed}c${i}`) < 0.3;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: lime ? C.lime : C.mist, opacity: o, boxShadow: lime ? `0 0 ${s * 3}px ${C.lime}` : undefined}} />;
      })}
    </div>
  );
};

/* ---------- transitions ---------- */
/** Light-beam sweep: the scene is revealed through a widening cone of light from a ring pivot (top-left). */
export const BeamReveal: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 20, easeInOut);
  const px = 160, py = 70, dirA = 50, half = 4 + 136 * p;
  const pts = [`${px}px ${py}px`];
  for (let k = 0; k <= 24; k++) {
    const a = ((dirA - half + (2 * half * k) / 24) * Math.PI) / 180;
    pts.push(`${px + Math.cos(a) * 3200}px ${py + Math.sin(a) * 3200}px`);
  }
  const done = p >= 1;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, clipPath: done ? undefined : `polygon(${pts.join(',')})`}}>{children}</div>
      {!done ? <>
        <div style={{position: 'absolute', left: px - 18, top: py - 18, width: 36, height: 36, borderRadius: '50%', border: `4px solid ${C.mist}`, boxShadow: `0 0 18px ${C.lime},0 0 40px ${C.lime}`, opacity: 1 - p * 0.4}} />
        <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,.9)', opacity: interpolate(f, [at, at + 1, at + 3], [0, 0.5, 0], cl)}} />
      </> : null}
    </>
  );
};

/** 1 f white flash then overexposed fade (cuts back to the speaker). */
export const FlashCut: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 5) return null;
  return <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: interpolate(f, [at, at + 1, at + 5], [0.7, 0.45, 0], cl), zIndex: 60}} />;
};

/* ---------- Gatekeepers (Levels timeline) ---------- */
const SIL = (
  <linearGradient id="sil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".35" stopColor="#C9D3E3" /><stop offset=".6" stopColor="#6F7E98" /><stop offset="1" stopColor="#E9EEF7" /></linearGradient>
);
const Padlock: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const shut = prog(f, at + 14, at + 19, (t) => t * t);
  return (
    <svg width={230} height={250} viewBox="0 0 230 250" style={{overflow: 'visible', filter: 'drop-shadow(0 18px 24px rgba(0,0,0,.55)) drop-shadow(0 0 18px rgba(230,255,79,.18))'}}>
      <defs>{SIL}<linearGradient id="lb" x1="0" x2="1"><stop offset="0" stopColor="#2B4C86" /><stop offset=".45" stopColor="#6F8FC6" /><stop offset="1" stopColor="#22406F" /></linearGradient></defs>
      <path d={`M58 ${118 - 34 * (1 - shut)} V${70 - 34 * (1 - shut)} a57 57 0 0 1 114 0 V${118 - 34 * (1 - shut)}`} fill="none" stroke="url(#sil)" strokeWidth={24} />
      <rect x={28} y={110} width={174} height={138} rx={10} fill="url(#lb)" stroke="rgba(243,247,255,.35)" strokeWidth={2} />
      <rect x={34} y={116} width={20} height={126} rx={6} fill="rgba(255,255,255,.18)" />
      <circle cx={115} cy={166} r={13} fill={C.lime} style={{filter: `drop-shadow(0 0 ${8 + 10 * shut}px ${C.lime})`}} /><rect x={109} y={170} width={12} height={38} rx={4} fill={C.lime} />
    </svg>
  );
};
const Swords: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const c = spr(f, at + 4, {damping: 9, stiffness: 150});
  const sw = (rot: number) => (
    <g transform={`translate(130 130) rotate(${rot}) translate(-14 -150)`}>
      <polygon points="14,0 26,22 24,190 4,190 2,22" fill="url(#sil)" stroke="rgba(255,255,255,.6)" strokeWidth={1} />
      <line x1={14} y1={10} x2={14} y2={186} stroke="rgba(80,96,124,.7)" strokeWidth={2} />
      <rect x={-30} y={188} width={88} height={14} rx={7} fill="url(#sil)" /><rect x={7} y={202} width={14} height={58} rx={5} fill="#4B5A74" /><circle cx={14} cy={266} r={12} fill="url(#sil)" />
    </g>
  );
  return <svg width={260} height={300} viewBox="0 0 260 300" style={{overflow: 'visible', filter: 'drop-shadow(0 16px 22px rgba(0,0,0,.55))'}}><defs>{SIL}</defs>{sw(-38 * c - 70 * (1 - c))}{sw(38 * c + 70 * (1 - c))}</svg>;
};
const Coins: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  return (
    <svg width={220} height={270} viewBox="0 0 220 270" style={{overflow: 'visible', filter: 'drop-shadow(0 16px 22px rgba(0,0,0,.55))'}}>
      <defs>{SIL}</defs>
      {Array.from({length: 7}, (_, k) => {
        const s = spr(f, at + k * 2, {damping: 12, stiffness: 170});
        const y = 230 - k * 22 - 120 * (1 - s);
        return <g key={k} opacity={f >= at + k * 2 ? 1 : 0}><ellipse cx={110} cy={y + 10} rx={80} ry={22} fill="#56657F" /><rect x={30} y={y - 6} width={160} height={16} fill="#8794AC" /><ellipse cx={110} cy={y - 6} rx={80} ry={22} fill="url(#sil)" stroke="rgba(255,255,255,.5)" /></g>;
      })}
      <ellipse cx={110} cy={230 - 6 * 22 - 6} rx={36} ry={9} fill="none" stroke={C.lime} strokeWidth={3} opacity={prog(f, at + 18, at + 24)} style={{filter: `drop-shadow(0 0 6px ${C.lime})`}} />
    </svg>
  );
};
const LvCard: React.FC<{at: number; x: number; y: number; label: string; side: 1 | -1; obj: React.ReactNode; ox: number; oy: number}> = ({at, x, y, label, side, obj, ox, oy}) => {
  const f = useCurrentFrame();
  if (f < at - 1) return null;
  const s = spr(f, at, {damping: 16});
  const clip = 100 * (1 - prog(f, at, at + 14, easeInOut));
  const objS = spr(f, at + 6, {damping: 10, stiffness: 130});
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y, width: 640, height: 150, borderRadius: 26, transform: `translateX(${-side * 70 * (1 - s)}px)`, filter: `blur(${(1 - Math.min(1, s)) * 10}px)`,
        clipPath: side > 0 ? `inset(0 ${clip}% 0 0 round 26px)` : `inset(0 0 0 ${clip}% round 26px)`,
        background: 'linear-gradient(120deg,rgba(23,61,112,.55),rgba(6,16,40,.92) 55%)', border: '1.5px solid rgba(156,194,255,.35)', boxShadow: 'inset 0 1px 0 rgba(243,247,255,.18),0 20px 50px rgba(0,0,0,.45)'}}>
        <div style={{position: 'absolute', left: 34, top: 38, fontFamily: 'Playfair', fontStyle: 'italic', fontSize: 54, color: C.mist, textShadow: '0 0 14px rgba(243,247,255,.45)', ...wordIn(f, at + 6)}}>{label}</div>
      </div>
      <div style={{position: 'absolute', left: x + ox, top: y + oy, transform: `translateY(${-220 * (1 - objS) + Math.sin((f - at) / 18) * 4}px) rotate(${(1 - objS) * 16}deg)`, opacity: f >= at + 6 ? 1 : 0,
        filter: `blur(${(1 - Math.min(1, objS)) * 12}px)`}}>{obj}</div>
    </>
  );
};
const Diamond: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  const s = spr(f, at, {damping: 9, stiffness: 170});
  if (f < at) return null;
  return <>
    <div style={{position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, transform: `rotate(${45 + 180 * (1 - s)}deg) scale(${s})`, border: `4px solid ${C.lime}`, borderRadius: 7, background: 'rgba(8,24,58,.9)',
      boxShadow: `0 0 14px ${C.lime},0 0 34px rgba(230,255,79,.45),inset 0 0 10px rgba(230,255,79,.4)`}} />
    <Pulse x={x} y={y} at={at} r={60} dur={18} />
  </>;
};
export const Gatekeepers: React.FC = () => {
  const f = useCurrentFrame();
  const a = 285;
  const push = 1 + 0.04 * prog(f, a, 388, (t) => t);
  const spineH = 520 * prog(f, 294, 330, easeInOut);
  const title = 'Gatekeepers';
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <World seed={8} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%,rgba(23,61,112,.4),rgba(4,10,26,.9) 75%)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '960px 400px'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 20, textAlign: 'center', fontFamily: 'Playfair', fontWeight: 700, fontSize: 96, color: C.mist,
          textShadow: '0 0 18px rgba(243,247,255,.55),0 0 40px rgba(230,255,79,.25)'}}>
          {title.split('').map((ch, i) => <span key={i} style={{display: 'inline-block', ...bloomIn(f, 289 + i * 1.2, 14)}}>{ch}</span>)}
        </div>
        <div style={{position: 'absolute', left: 958, top: 140, width: 4, height: spineH, borderRadius: 2, background: 'linear-gradient(180deg,rgba(243,247,255,.2),#9CC2FF 20%,#9CC2FF)', boxShadow: '0 0 12px rgba(156,194,255,.8)'}} />
        <div style={{position: 'absolute', left: 958, top: 138 + spineH - 6, width: 4, height: 14, borderRadius: 2, background: '#fff', boxShadow: `0 0 16px #fff,0 0 30px ${C.lime}`, opacity: spineH > 0 && spineH < 519 ? 1 : 0}} />
        <div style={{position: 'absolute', left: 960, top: 618, width: 960 * prog(f, 366, 384, easeInOut), height: 4, background: 'linear-gradient(90deg,#9CC2FF,rgba(156,194,255,.6))', boxShadow: '0 0 12px rgba(156,194,255,.8)'}} />
        <Diamond x={960} y={220} at={300} />
        <Diamond x={960} y={420} at={315} />
        <Diamond x={960} y={620} at={328} />
        <LvCard at={302} x={1020} y={145} side={1} label="Closed doors" obj={<Padlock at={308} />} ox={420} oy={-95} />
        <LvCard at={337} x={260} y={345} side={-1} label="Insiders only" obj={<Swords at={343} />} ox={400} oy={-110} />
        <LvCard at={360} x={1020} y={545} side={1} label="Private wealth" obj={<Coins at={366} />} ox={430} oy={-110} />
        <Burst x={1555} y={120} at={327} n={16} r={120} seed="lk" />
        <Burst x={790} y={365} at={351} n={18} r={140} seed="sw" />
      </div>
    </div>
  );
};

/* ---------- Growth path (F11b) ---------- */
const GP: [number, number][] = [[100, 760], [300, 760], [380, 650], [480, 645], [580, 640], [700, 560], [890, 525], [1080, 490], [1120, 420], [1300, 400], [1480, 380], [1640, 300], [1780, 120]];
const ICONS: Record<string, React.ReactNode> = {
  cap: <g fill="none" stroke={C.lime} strokeWidth={4}><ellipse cx={32} cy={18} rx={18} ry={6} /><path d="M14 18v10c0 3.3 8 6 18 6s18-2.7 18-6V18" /><path d="M14 28v10c0 3.3 8 6 18 6s18-2.7 18-6V28" /><path d="M14 38v10c0 3.3 8 6 18 6s18-2.7 18-6V38" /></g>,
  deal: <g fill="none" stroke={C.lime} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round"><path d="M10 22 H50 L40 12" /><path d="M54 42 H14 L24 52" /></g>,
  ret: <g fill="none" stroke={C.lime} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 50 L24 34 L34 42 L56 18" /><path d="M42 18 H56 V32" /></g>,
  scale: <g fill="none" stroke={C.lime} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round"><path d="M32 6 C44 16 46 32 40 46 H24 C18 32 20 16 32 6Z" /><circle cx={32} cy={24} r={5} /><path d="M24 46 L16 56 M40 46 L48 56 M32 48 V58" /></g>,
};
const Step: React.FC<{at: number; x: number; y: number; n: number; name: string; val: React.ReactNode; icon: string; hot?: number}> = ({at, x, y, n, name, val, icon, hot}) => {
  const f = useCurrentFrame();
  const h = hot !== undefined ? prog(f, hot, hot + 6) : 0;
  return (
    <Card3D at={at} from="pop" x={x} y={y} w={330} h={210} radius={48} style={{...GLASS, position: 'absolute', inset: 0,
      boxShadow: h ? `inset 0 -2px 0 #fff,inset 0 -60px 80px -30px rgba(230,255,79,${0.6 + 0.2 * h}),0 0 0 ${2 * h}px rgba(230,255,79,.8),0 0 ${60 * h}px rgba(230,255,79,.55),0 40px 100px -20px rgba(230,255,79,.6)` : GLASS.boxShadow}}>
      <div style={{position: 'absolute', left: 30, top: 26, fontSize: 18, color: 'rgba(243,247,255,.5)'}}>Step {String(n).padStart(2, '0')}</div>
      <div style={{position: 'absolute', right: 26, top: 22, width: 72, height: 72, borderRadius: 22, background: 'rgba(230,255,79,.08)', border: '1.5px solid rgba(230,255,79,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...pop(f, at + 6)}}>
        <svg width={44} height={44} viewBox="0 0 64 64" style={{filter: `drop-shadow(0 0 6px ${C.lime})`}}>{ICONS[icon]}</svg>
      </div>
      <div style={{position: 'absolute', left: 30, top: 82}}>
        <div style={{fontSize: 26, color: 'rgba(243,247,255,.7)'}}>{name}</div>
        <div style={{...BIG_NUM, fontSize: 56}}>{val}</div>
      </div>
    </Card3D>
  );
};
export const Growth: React.FC = () => {
  const f = useCurrentFrame();
  const hit = 1055;
  const T = rollNum(f, 1048, 1060, 0, 1);
  const flare = interpolate(f, [hit, hit + 4, hit + 30], [0, 1, 0.35], cl);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <World seed={17} ghost={[['strategy', 60, 40, 260], ['powerful', 820, 600, 200]]} />
      <div style={{position: 'absolute', left: 1180, top: -60, width: 760, height: 700, background: 'radial-gradient(circle,rgba(230,255,79,.3),rgba(46,100,176,.2) 40%,transparent 70%)', opacity: 0.4 + flare}} />
      {[230, 300, 370].map((r, k) => <Pulse key={r} x={1555} y={275} at={hit + k * 5} r={r} dur={30} />)}
      <DrawPath d={bezD(GP)} a={1020} b={1052} w={7} grad="1" />
      <Comet pts={GP.slice(6)} a={1040} b={hit} size={14} />
      <Step at={1024} x={150} y={540} n={1} name="Capital" val="$400K" icon="cap" />
      <Step at={1031} x={560} y={420} n={2} name="Deals" val="Buyouts" icon="deal" />
      <Step at={1038} x={970} y={300} n={3} name="Returns" val="Compound" icon="ret" />
      <Step at={1045} x={1390} y={170} n={4} name="Scale" val={T < 1 ? `$${Math.round(T * 1000)}B` : '$1T+'} icon="scale" hot={hit} />
      <Burst x={1780} y={120} at={hit} n={28} r={260} seed="gh" />
      <div style={{position: 'absolute', inset: 0, background: 'rgba(230,255,79,.12)', opacity: interpolate(f, [hit, hit + 2, hit + 8], [0, 1, 0], cl), mixBlendMode: 'screen'}} />
    </div>
  );
};

/* ---------- Big panel with neon streak (F12) ---------- */
export const Panel: React.FC = () => {
  const f = useCurrentFrame();
  const a = 1082;
  const s = spr(f, a + 2, {damping: 15});
  const streak = prog(f, a + 8, a + 30, easeInOut);
  const text = typed(f, 'The Strategy', a + 12, a + 34);
  const cx = interpolate(f, [a + 30, a + 48], [1700, 1080], {...cl, easing: easeInOut});
  const cy = interpolate(f, [a + 30, a + 48], [900, 470], {...cl, easing: easeInOut});
  const press = interpolate(f, [a + 50, a + 52, a + 58], [0, 1, 0], cl);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <World seed={13} ghost={[['forever', 200, 640, 240]]} />
      <div style={{position: 'absolute', left: 330, top: 150, width: 1260, height: 520, perspective: 1600}}>
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${260 * (1 - s)}px) rotateX(${28 * (1 - s)}deg) scale(${(0.92 + 0.08 * s) * (1 - 0.01 * press)})`, filter: `blur(${(1 - Math.min(1, s)) * 14}px)`,
          opacity: interpolate(f, [a, a + 5], [0, 1], cl), borderRadius: '90px 90px 40px 40px', overflow: 'hidden', background: `linear-gradient(180deg,#2457A0,${C.deep} 60%,#0B2350)`, boxShadow: '0 40px 100px rgba(0,0,0,.6)'}}>
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(80% 60% at 50% 0%,rgba(243,247,255,.18),transparent 60%)'}} />
          <div style={{position: 'absolute', left: 60, top: 0, height: 5, width: `${streak * 105}%`, background: `linear-gradient(90deg,rgba(230,255,79,0),${C.lime} 40%,#fff 92%,#fff)`, boxShadow: `0 0 18px ${C.lime},0 0 40px rgba(230,255,79,.7)`}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', fontWeight: 400, fontSize: 132, letterSpacing: -4, color: C.mist, textShadow: '0 0 24px rgba(243,247,255,.45)'}}>
            {text}<Caret h={110} f={f} solid={f < a + 34} />
          </div>
          <div style={{position: 'absolute', inset: 0, background: 'rgba(243,247,255,.16)', opacity: interpolate(f, [a + 52, a + 53, a + 62], [0, 1, 0], cl)}} />
        </div>
      </div>
      {f >= a + 30 ? <Cursor x={cx} y={cy} press={press} size={110} opacity={interpolate(f, [a + 30, a + 34], [0, 1], cl)} /> : null}
      <Pulse x={cx + 20} y={cy + 14} at={a + 52} r={110} />
      <Card3D at={a + 42} from="left" x={170} y={720} w={300} h={150} radius={30} style={{...GLASS, position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 30, top: 22, fontSize: 18, color: 'rgba(243,247,255,.5)'}}>AUM</div>
        <div style={{position: 'absolute', left: 30, top: 50, ...BIG_NUM, fontWeight: 600, fontSize: 58, letterSpacing: -2, color: C.lime, background: 'none', WebkitBackgroundClip: undefined}}><span style={{display: 'inline-block', ...pop(f, a + 48, 14)}}>$1T+</span></div>
      </Card3D>
      <Card3D at={a + 46} from="right" x={1450} y={720} w={300} h={150} radius={30} style={{...GLASS, position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 30, top: 22, fontSize: 18, color: 'rgba(243,247,255,.5)'}}>Since</div>
        <div style={{position: 'absolute', left: 30, top: 50, ...BIG_NUM, fontWeight: 600, fontSize: 58, letterSpacing: -2}}>1985</div>
      </Card3D>
    </div>
  );
};
export {exitStyle};
