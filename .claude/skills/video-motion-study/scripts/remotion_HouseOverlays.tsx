// From the user's house edit (16:9, Golden Hour accent, Nov 2026). Drop into a Remotion src/ with theme.ts (C, GLASS, HEAVY_FILL, HEAVY_FILTER).
// Talk-shot overlays in side zones: Scripts-style title (HOME) + StackedScriptsTitle (STEP BY / STEP, word-by-word), glass gauge + pixel-mosaic, card + 3D gold key + orbit, calendar -> click -> card morph -> button press, $$$ + V lines, edge flash.
// Overlays on the talking-head shots. Face zone (x 690–1165, y 60–540) is kept clear: everything lives in the
// left zone (x 60–640) or right zone (x 1240–1860).
import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {C, GLASS, HEAVY_FILL, HEAVY_FILTER} from './theme';
import {back, bloomIn, cl, Cursor, DrawPath, easeInOut, exitStyle, glassPop, GoldKey, HouseIcon, InkLine, pop, prog, Ripple, ScriptPixels, whipIn, wordIn, zoomDropIn} from './fx';

/* ---------- "Make better Scripts" title (HOME / PLAN) ---------- */
const ScriptsTitle: React.FC<{word: string; left: string; right: string; x: number; top: number; size: number; tl: number; tr: number; at: number; out: number; seed: string}> = ({
  word, left, right, x, top, size, tl, tr, at, out, seed,
}) => {
  const f = useCurrentFrame();
  if (f < tl || f > out + 8) return null;
  const w = size * word.length * 0.64;
  const p = prog(f, at, at + 15);
  const ghostP = prog(f, at, at + 26);
  const drift = Math.sin((f - at) / 26) * 3;
  const big: React.CSSProperties = {
    fontWeight: 780, fontSize: size, letterSpacing: -14, lineHeight: 0.86, color: C.solid, display: 'inline-block', position: 'relative',
    textShadow: '0 6px 24px rgba(60,20,0,.35)',
  };
  return (
    <div style={{position: 'absolute', left: x, top, width: w, textAlign: 'center', ...exitStyle(f, out), transform: `translateY(${drift}px) ${exitStyle(f, out).transform ?? ''}`}}>
      <InkLine x={w / 2} y={0} at={at} h={160} />
      <span style={{position: 'absolute', left: 4, top: -46, fontWeight: 500, fontSize: 40, letterSpacing: -1, color: C.cream, textShadow: '0 2px 12px rgba(0,0,0,.6)', ...wordIn(f, tl)}}>{left}</span>
      <span style={{position: 'absolute', right: 4, top: -46, fontWeight: 500, fontSize: 40, letterSpacing: -1, color: C.cream, textShadow: '0 2px 12px rgba(0,0,0,.6)', ...wordIn(f, tr)}}>{right}</span>
      {f >= at ? (
        <div style={{...big, opacity: interpolate(f, [at, at + 4], [0, 1], cl), filter: `blur(${16 * (1 - p)}px) brightness(${1 + 0.5 * (1 - p)})`,
          transform: `translateX(${-90 * (1 - p)}px) scale(${1.08 - 0.08 * p})`}}>
          {word}
          {/* motion-blur ghost trailing to the right, collapsing in */}
          <span style={{position: 'absolute', inset: 0, color: C.solid, opacity: 0.55 - 0.3 * ghostP, filter: `blur(${10 - 3 * ghostP}px)`, transform: `translateX(${60 - 42 * ghostP}px)`}}>{word}</span>
        </div>
      ) : null}
      <span style={{position: 'absolute', left: -44, top: size * 0.38, width: 26, height: 26, border: '3px solid rgba(255,244,222,.75)', borderRadius: 6, ...pop(f, at + 5)}} />
      <ScriptPixels at={at} x={0} y={0} w={w} h={size * 0.85} seed={seed} size={Math.round(size * 0.13)} life={34}
        anchors={[[0.02, 1.02], [0.1, 1.02], [0.88, -0.05], [0.96, 0.95], [0.84, 1.05], [1.0, 0.0]]} />
    </div>
  );
};

/* ---------- Multi-word Scripts title, stacked ("STEP BY / STEP"): each word lands on its spoken frame ---------- */
type TW = {w: string; at: number};
const StackedScriptsTitle: React.FC<{lines: TW[][]; left: string; right: string; x: number; top: number; size: number; tl: number; tr: number; out: number; seed: string}> = ({
  lines, left, right, x, top, size, tl, tr, out, seed,
}) => {
  const f = useCurrentFrame();
  if (f < tl || f > out + 10) return null;
  const width = Math.max(...lines.map((l) => l.map((t) => t.w).join(' ').length)) * size * 0.62;
  const first = lines[0][0].at;
  const drift = Math.sin((f - first) / 26) * 3;
  const word = ({w, at}: TW, k: string) => {
    if (f < at) return <span key={k} style={{display: 'inline-block', opacity: 0}}>{w}</span>;
    const p = prog(f, at, at + 15);
    const g = prog(f, at, at + 26);
    return (
      <span key={k} style={{display: 'inline-block', position: 'relative', opacity: interpolate(f, [at, at + 4], [0, 1], cl),
        filter: `blur(${16 * (1 - p)}px) brightness(${1 + 0.5 * (1 - p)})`, transform: `translateX(${-70 * (1 - p)}px) scale(${1.08 - 0.08 * p})`}}>
        {w}
        <span style={{position: 'absolute', inset: 0, color: C.solid, opacity: 0.55 - 0.3 * g, filter: `blur(${10 - 3 * g}px)`, transform: `translateX(${50 - 36 * g}px)`}}>{w}</span>
      </span>
    );
  };
  const small: React.CSSProperties = {position: 'absolute', top: -46, fontWeight: 500, fontSize: 40, letterSpacing: -1, color: C.cream, textShadow: '0 2px 12px rgba(0,0,0,.6)', whiteSpace: 'nowrap'};
  const lh = size * 0.9;
  return (
    <div style={{position: 'absolute', left: x, top, width, ...exitStyle(f, out), transform: `translateY(${drift}px) ${exitStyle(f, out).transform ?? ''}`}}>
      <InkLine x={width / 2} y={0} at={first} h={160} />
      <span style={{...small, left: 4, ...wordIn(f, tl)}}>{left}</span>
      <span style={{...small, right: 4, ...wordIn(f, tr)}}>{right}</span>
      {lines.map((l, li) => (
        <div key={li} style={{fontWeight: 780, fontSize: size, letterSpacing: -9, lineHeight: 0.86, height: lh, color: C.solid, textAlign: li === 0 ? 'left' : 'right',
          whiteSpace: 'nowrap', textShadow: '0 6px 24px rgba(60,20,0,.35)', display: 'flex', gap: size * 0.22, justifyContent: li === 0 ? 'flex-start' : 'flex-end'}}>
          {l.map((t, i) => word(t, `${li}-${i}`))}
        </div>
      ))}
      <span style={{position: 'absolute', left: -44, top: size * 0.32, width: 26, height: 26, border: '3px solid rgba(255,244,222,.75)', borderRadius: 6, ...pop(f, first + 5)}} />
      {lines.flat().map((t, i) => (
        <ScriptPixels key={i} at={t.at} x={0} y={0} w={width} h={lh * lines.length} seed={`${seed}${i}`} size={Math.round(size * 0.14)} life={30}
          anchors={i === 0 ? [[0.0, 0.48], [0.08, 0.5], [0.9, -0.08]] : i === 1 ? [[1.0, 0.02], [0.96, 0.4]] : [[0.3, 1.0], [0.9, 1.02], [0.08, 0.98]]} />
      ))}
    </div>
  );
};

/* ---------- Glass gauge widget "10 yrs" (Rc "Performance 48°"), right zone ---------- */
const Gauge: React.FC<{at: number; out: number}> = ({at, out}) => {
  const f = useCurrentFrame();
  if (f < at - 4 || f > out + 8) return null;
  const X = 1380, Y = 170, S = 320;
  const lit = interpolate(f, [at + 2, at + 32], [0, 24], cl);
  const num = Math.round(interpolate(f, [at + 2, at + 12], [0, 10], cl));
  // pixel-mosaic dissolve (squares flicker on, then dissolve as the glass card resolves)
  const tiles: React.ReactNode[] = [];
  const T = 44;
  for (let i = -1; i < 9; i++) for (let j = -1; j < 9; j++) {
    const id = `gz${i}-${j}`;
    const on = at - 4 + Math.floor(random(id + 'a') * 8);
    const off = at + 4 + Math.floor(random(id + 'b') * 16);
    if (f < on || f > off || random(id + 'k') < 0.35) continue;
    const c = random(id + 'c') > 0.5 ? 'rgba(255,192,0,.55)' : 'rgba(107,52,16,.7)';
    tiles.push(<div key={id} style={{position: 'absolute', left: X + i * T, top: Y + j * T, width: T - 3, height: T - 3, background: c, boxShadow: '0 0 10px rgba(255,170,40,.4)',
      opacity: interpolate(f, [off - 5, off], [1, 0], cl)}} />);
  }
  return (
    <div style={exitStyle(f, out)}>
      <div style={{...GLASS, left: X, top: Y, width: S, height: S, borderRadius: 84, ...glassPop(f, at + 1, 14),
        background: 'linear-gradient(180deg,rgba(40,22,8,.55),rgba(30,16,6,.85) 55%,rgba(255,170,40,.55))', borderColor: 'rgba(255,226,150,.8)'}}>
        <div style={{position: 'absolute', top: 30, width: '100%', textAlign: 'center', color: C.cream, fontWeight: 500, fontSize: 30}}>Timeline</div>
        <svg width={S} height={S} style={{position: 'absolute', inset: 0}}>
          <g transform="translate(160,182)">
            {Array.from({length: 37}, (_, i) => (
              <line key={i} x1="0" y1="-112" x2="0" y2="-100" stroke={i <= lit ? 'rgba(255,214,120,.95)' : 'rgba(255,244,222,.18)'} strokeWidth={i <= lit ? 3 : 2}
                transform={`rotate(${-120 + (i * 240) / 36})`} />
            ))}
          </g>
        </svg>
        <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 150, letterSpacing: -8,
          background: HEAVY_FILL, WebkitBackgroundClip: 'text', color: 'transparent', filter: HEAVY_FILTER}}>
          {num}<span style={{fontSize: 44, letterSpacing: 0, verticalAlign: 70, marginLeft: 6}}>yrs</span>
        </div>
      </div>
      {tiles}
    </div>
  );
};

/* ---------- Homeowner card (left) + 3D gold key on an orbit ring (right) ---------- */
const HomeownerAndKey: React.FC<{at: number; keyAt: number; chipAt: number; out: number}> = ({at, keyAt, chipAt, out}) => {
  const f = useCurrentFrame();
  if (f < at - 2 || f > out + 8) return null;
  const ang = Math.PI - interpolate(f, [keyAt, out], [0.15, 1.3], cl); // dot travels along the upper arc
  const R = 330, cx = 1640, cy = 600;
  const keyFloat = Math.sin((f - keyAt) / 18) * 6;
  const sparkle = (k: number, x: number, y: number) => {
    const s = 0.5 + 0.5 * Math.sin((f + k * 7) / 7);
    return <div key={k} style={{position: 'absolute', left: x, top: y, width: 22, height: 22, transform: `scale(${s}) rotate(45deg)`, opacity: f > keyAt + 12 ? s : 0,
      background: 'radial-gradient(circle,#FFF4DE 0 20%,transparent 21%)', boxShadow: '0 0 12px #FFC000'}} />;
  };
  return (
    <div style={exitStyle(f, out)}>
      <div style={{...GLASS, left: 70, top: 200, width: 560, height: 290, ...whipIn(f, at, {from: -1, dist: 640, rot: -3})}}>
        <div style={{position: 'relative', padding: '34px 36px', display: 'flex', gap: 24, alignItems: 'center'}}>
          <div style={{width: 104, height: 104, borderRadius: 30, background: 'linear-gradient(160deg,#FFE27A,#F0913A)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...pop(f, at + 5)}}>
            <HouseIcon s={64} />
          </div>
          <div>
            <div style={{fontWeight: 300, fontSize: 30, color: 'rgba(255,244,222,.75)', ...wordIn(f, at + 6)}}>Milestone</div>
            <div style={{display: 'inline-block', ...bloomIn(f, at + 8)}}>
              <span style={{fontWeight: 700, fontSize: 62, letterSpacing: -3, lineHeight: 1, background: HEAVY_FILL, WebkitBackgroundClip: 'text', color: 'transparent', filter: HEAVY_FILTER}}>Homeowner</span>
            </div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 36, bottom: 32, ...pop(f, chipAt)}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 999, background: 'rgba(255,192,0,.16)', border: '1.5px solid rgba(255,192,0,.7)', color: '#FFE27A', fontWeight: 600, fontSize: 28}}>
            <i style={{width: 12, height: 12, borderRadius: '50%', background: C.ember}} />Before 40
          </div>
        </div>
      </div>
      <DrawPath d={`M${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} a={keyAt - 4} b={keyAt + 18} w={3} color="rgba(255,244,222,.55)" glow="none" />
      {f > keyAt + 8 ? <div style={{position: 'absolute', left: cx + R * Math.cos(ang) - 10, top: cy - R * Math.sin(ang) - 10, width: 20, height: 20, borderRadius: '50%', background: C.cream, boxShadow: '0 0 14px #FFC000'}} /> : null}
      <div style={{position: 'absolute', left: 1560, top: 180, ...zoomDropIn(f, keyAt, {dx: 80, dy: -240, from: 1.5, rot: 28})}}>
        <div style={{transform: `translateY(${keyFloat}px)`}}><GoldKey w={140} /></div>
      </div>
      {[sparkle(1, 1540, 200), sparkle(2, 1720, 320), sparkle(3, 1600, 520)]}
    </div>
  );
};

/* ---------- Calendar → click 23 → "Your home plan" card opens out of the 23 cell (left zone) ---------- */
const CAL = {x: 70, y: 150, w: 540, h: 400};
const CELL = (k: number) => ({x: CAL.x + 36 + (k % 7) * 68, y: CAL.y + 168 + Math.floor(k / 7) * 62, w: 58, h: 52}); // k=0 → 16
const CARD = {x: 110, y: 170, w: 540, h: 400};

const CalendarToCard: React.FC<{at: number; click: number; press: number; out: number}> = ({at, click, press, out}) => {
  const f = useCurrentFrame();
  if (f < at - 1 || f > out + 8) return null;
  const c23 = CELL(7);
  const morph = prog(f, click + 1, click + 15, easeInOut);
  const dim = prog(f, click + 1, click + 15);
  // cursor path: enter → 23 → "Get started"
  const btn = {x: CARD.x + 300, y: CARD.y + 296};
  const p1 = prog(f, at, click - 1, easeInOut);
  const p2 = prog(f, click + 16, press - 4, easeInOut);
  let cx = 720 + (c23.x + 34 - 720) * p1, cy = 760 + (c23.y + 30 - 760) * p1;
  if (f > click + 16) { cx = c23.x + 34 + (btn.x + 120 - (c23.x + 34)) * p2; cy = c23.y + 30 + (btn.y + 40 - (c23.y + 30)) * p2; }
  const pressK = (k: number) => interpolate(f, [k, k + 3, k + 9], [0, 1, 0], cl);
  const btnPress = pressK(press);
  const morphBox = {
    x: c23.x + (CARD.x - c23.x) * morph, y: c23.y + (CARD.y - c23.y) * morph,
    w: c23.w + (CARD.w - c23.w) * morph, h: c23.h + (CARD.h - c23.h) * morph, r: 12 + 36 * morph,
  };
  const cardIn = f >= click + 1;
  const content = (k: number) => ({opacity: interpolate(f, [click + 13 + k, click + 19 + k], [0, 1], cl)});
  return (
    <div style={exitStyle(f, out)}>
      {/* calendar */}
      <div style={{...GLASS, left: CAL.x, top: CAL.y, width: CAL.w, height: CAL.h, borderRadius: 56, ...glassPop(f, at, 12),
        filter: `${glassPop(f, at, 12).filter} blur(${6 * dim}px) brightness(${1 - 0.45 * dim})`, transform: `${glassPop(f, at, 12).transform} scale(${1 - 0.04 * dim})`}}>
        <div style={{position: 'absolute', left: 36, top: 34, fontWeight: 700, fontSize: 40, color: C.cream}}>Day 1</div>
        <div style={{position: 'absolute', right: 36, top: 34, ...pop(f, at + 6)}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 999, background: 'rgba(255,192,0,.16)', border: '1.5px solid rgba(255,192,0,.7)', color: '#FFE27A', fontWeight: 600, fontSize: 28}}>
            <i style={{width: 12, height: 12, borderRadius: '50%', background: C.ember}} />TODAY
          </div>
        </div>
        {'MTWTFSS'.split('').map((d, k) => (
          <div key={k} style={{position: 'absolute', left: 36 + k * 68, top: 130, width: 58, textAlign: 'center', fontSize: 20, color: 'rgba(255,244,222,.4)'}}>{d}</div>
        ))}
        {Array.from({length: 14}, (_, k) => {
          const c = CELL(k);
          const is23 = k === 7;
          const t = at + 3 + k * 0.8;
          const flash = is23 ? interpolate(f, [click, click + 3, click + 10], [0, 1, 0], cl) : 0;
          return (
            <div key={k} style={{position: 'absolute', left: c.x - CAL.x, top: c.y - CAL.y, width: c.w, height: c.h, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: 24, opacity: interpolate(f, [t, t + 5], [0, 1], cl), transform: `translateY(${interpolate(f, [t, t + 7], [10, 0], cl)}px) scale(${is23 ? 1.12 : 1})`,
              ...(is23 ? {background: flash > 0 ? '#FFF4DE' : C.amber, color: C.ink, boxShadow: `0 0 ${22 + 30 * flash}px rgba(255,192,0,.8)`} : {color: 'rgba(255,244,222,.55)', background: 'rgba(255,244,222,.05)'})}}>
              {16 + k}
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 36, top: 312, fontSize: 26, color: 'rgba(255,244,222,.65)', ...wordIn(f, at + 14)}}>Your 10-year plan starts here</div>
      </div>
      {/* hand-drawn circle around 23 */}
      <DrawPath d={`M${c23.x + 62} ${c23.y + 4} C ${c23.x + 80} ${c23.y + 40}, ${c23.x + 40} ${c23.y + 64}, ${c23.x + 6} ${c23.y + 54} S ${c23.x - 22} ${c23.y + 6}, ${c23.x + 24} ${c23.y - 8} S ${c23.x + 74} ${c23.y - 2}, ${c23.x + 70} ${c23.y + 18}`}
        a={at + 14} b={at + 24} w={4} color={C.cream} style={{opacity: 1 - dim}} />
      {/* morph: the 23 cell grows into the card */}
      {cardIn ? (
        <div style={{position: 'absolute', left: morphBox.x, top: morphBox.y, width: morphBox.w, height: morphBox.h, borderRadius: morphBox.r, overflow: 'hidden',
          background: `linear-gradient(165deg,rgba(52,28,12,${0.92 * morph}),rgba(22,12,6,${0.94 * morph}) 60%), ${C.amber}`,
          border: `2px solid rgba(255,214,120,${0.65 * morph + 0.3})`,
          boxShadow: `0 30px 80px rgba(0,0,0,${0.6 * morph}),0 0 ${70 * (1 - morph) + 30}px rgba(255,170,40,${0.8 - 0.55 * morph}),inset 0 -3px 0 rgba(255,220,140,.8)`}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: CARD.w, height: CARD.h, textAlign: 'center', paddingTop: 34}}>
            <div style={{width: 96, height: 96, margin: '0 auto', borderRadius: 28, background: 'linear-gradient(160deg,#FFE27A,#F0913A)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...pop(f, click + 14)}}>
              <HouseIcon s={60} />
            </div>
            <div style={{display: 'inline-block', marginTop: 14, padding: '4px 14px', borderRadius: 8, background: C.amber, color: C.ink, fontWeight: 700, fontSize: 20, letterSpacing: 2, ...pop(f, click + 16)}}>STEP 1</div>
            <div style={{fontWeight: 700, fontSize: 46, color: C.cream, marginTop: 10, letterSpacing: -1, ...content(4)}}>Your home plan</div>
            <div style={{display: 'flex', gap: 16, margin: '26px 38px 0'}}>
              <div style={{flex: 1, padding: 18, borderRadius: 999, border: '2px solid rgba(255,244,222,.25)', color: 'rgba(255,244,222,.6)', fontWeight: 600, fontSize: 26, ...pop(f, click + 18)}}>Later</div>
              <div style={{flex: 1.4, padding: 18, borderRadius: 999, background: 'linear-gradient(180deg,#FFE27A,#FFC000)', color: C.ink, fontWeight: 700, fontSize: 26,
                ...pop(f, click + 20), transform: `${pop(f, click + 20).transform} scale(${1 - 0.07 * btnPress})`,
                boxShadow: `0 0 ${26 + 40 * btnPress}px rgba(255,192,0,${0.7 + 0.3 * btnPress})`}}>Get started</div>
            </div>
          </div>
        </div>
      ) : null}
      <Ripple x={c23.x + 29} y={c23.y + 26} at={click} />
      <Ripple x={btn.x + 120} y={btn.y + 30} at={press} r={90} />
      <Cursor x={cx} y={cy} press={pressK(click) + btnPress} opacity={interpolate(f, [at, at + 3, out - 2, out], [0, 1, 1, 0], cl)} />
    </div>
  );
};

/* ---------- "$$$" + V lines (Ra "Multibillion dollar / $$$"), right zone ---------- */
const Dollars: React.FC<{at: number; hit: number}> = ({at, hit}) => {
  const f = useCurrentFrame();
  if (f < at - 1) return null;
  const pulse = interpolate(f, [hit, hit + 5, hit + 16], [1, 1.07, 1], cl);
  return (
    <>
      <DrawPath d="M1270 120 L 1560 560 L 1860 120" a={at + 4} b={at + 26} w={3} color="rgba(255,244,222,.5)" glow="none" />
      <div style={{position: 'absolute', left: 1260, top: 150, width: 600, display: 'flex', justifyContent: 'center', transform: `scale(${pulse}) translateY(${Math.sin((f - at) / 24) * 4}px)`}}>
        {[0, 1, 2].map((k) => {
          const t = at + k * 4;
          const p = prog(f, t, t + 14, back);
          return (
            <span key={k} style={{fontFamily: 'Antonio', fontWeight: 700, fontSize: 330, lineHeight: 1, letterSpacing: -6, display: 'inline-block',
              background: 'linear-gradient(180deg,rgba(255,241,207,.92),rgba(255,192,0,.4))', WebkitBackgroundClip: 'text', color: 'transparent',
              opacity: interpolate(f, [t, t + 5], [0, 1], cl), transform: `translateY(${-140 * (1 - p)}px) scale(${1.3 - 0.3 * p})`,
              filter: `blur(${18 * (1 - prog(f, t, t + 10))}px) drop-shadow(0 8px 30px rgba(0,0,0,.4))`}}>$</span>
          );
        })}
      </div>
    </>
  );
};

export const EdgeFlash: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 3, at + 22], [0, 1, 0], cl);
  if (o <= 0) return null;
  return <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 160px 24px rgba(235,136,88,${0.6 * o})`, pointerEvents: 'none'}} />;
};

export const TalkOverlays: React.FC = () => (
  <>
    <ScriptsTitle word="HOME" left="buying a" right="new" x={70} top={250} size={230} tl={24} tr={37} at={41} out={74} seed="home" />
    <Gauge at={58} out={112} />
    <HomeownerAndKey at={240} keyAt={250} chipAt={274} out={281} />
    <StackedScriptsTitle lines={[[{w: 'STEP', at: 308}, {w: 'BY', at: 315}], [{w: 'STEP', at: 320}]]} left="Let's break" right="it down"
      x={1235} top={215} size={140} tl={291} tr={299} out={352} seed="sbs" />
    <CalendarToCard at={310} click={336} press={362} out={368} />
    <Dollars at={516} hit={538} />
  </>
);
