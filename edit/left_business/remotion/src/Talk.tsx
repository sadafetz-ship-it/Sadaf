// Widgets over the talking shots (right chest zone x ≥ 735, beside the face) in the user's widget-reference look.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, GRAD} from './theme';
import {BigNum, cl, Corner, DrawPath, easeInOut, OutlinePill, pop, prog, ProgressBar, Ripple, SoftCursor, stamp, Widget, whipIn} from './fx';

const X = 738; // right zone
const W = 314;

/** White placeholder flash that "develops" into the card (glow reveal, 8 f). */
const Develop: React.FC<{at: number; r?: number}> = ({at, r = 60}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 3, at + 11], [0.95, 0.85, 0], cl);
  return o > 0 ? <div style={{position: 'absolute', inset: 0, borderRadius: r, background: '#F4F6FF', opacity: o}} /> : null;
};

const Stamp: React.FC<{text: string; at: number; exit: number; x: number; y: number; rot?: number; color?: string}> = ({text, at, exit, x, y, rot = -10, color = C.magenta}) => {
  const f = useCurrentFrame();
  if (f < at || f > exit + 10) return null;
  const ex = prog(f, exit, exit + 10);
  return <div style={{position: 'absolute', left: x, top: y, font: "900 30px 'Inter'", letterSpacing: 3, color, border: `4px solid ${color}`, borderRadius: 12,
    padding: '6px 14px', background: 'rgba(7,10,31,.75)', textShadow: `0 0 10px ${color}`, boxShadow: `0 0 18px ${color}66,inset 0 0 12px ${color}55`, ...stamp(f, at, rot), opacity: (f < at + 2 ? (f - at) / 2 : 1) * (1 - ex), filter: ex ? `blur(${12 * ex}px)` : stamp(f, at, rot).filter}}>{text}</div>;
};

// B2 — product widget (Conversion-card look) + ALL IN stamp
const Product: React.FC = () => {
  const f = useCurrentFrame();
  const d = 'M 20 190 C 70 186, 90 150, 120 120 C 150 88, 160 40, 190 40 C 222 40, 228 120, 258 150 C 270 162, 282 168, 296 170';
  const dot = prog(f, 72, 92, easeInOut);
  return (
    <>
      <Widget x={X} y={590} w={W} h={420} at={60} exit={152} enter="drop">
        <Develop at={60} />
        <Corner l="New launch" r="Monthly ⌄" />
        <DrawPath d={d} a={70} b={92} w={5} color={C.sky} box={[W, 260]} style={{top: 50}} />
        {f >= 70 ? <div style={{position: 'absolute', left: 190 - 13, top: 50 + 40 - 13, width: 26, height: 26, borderRadius: '50%', background: '#EAF0FF',
          boxShadow: `0 0 0 6px rgba(143,176,255,.25),0 0 24px ${C.sky},0 0 46px ${C.blue}`, transform: `scale(${dot})`}} /> : null}
        <div style={{position: 'absolute', left: 0, right: 0, top: 268, textAlign: 'center', fontSize: 22, color: 'rgba(230,236,255,.75)'}}>Starter template</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center'}}><BigNum size={86}>$27</BigNum></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 386, textAlign: 'center', fontSize: 16, color: C.grey}}>digital download · instant access</div>
      </Widget>
      <Stamp text="ALL IN" at={66} exit={152} x={760} y={556} rot={-12} color={C.mist} />
    </>
  );
};

// B4 — work-day ring (progress-ring widget look): ring fills to 10/12 then 12/12 on "12"
const Clock: React.FC = () => {
  const f = useCurrentFrame();
  const p = f < 309 ? (10 / 12) * prog(f, 276, 309, easeInOut) : 10 / 12 + (2 / 12) * prog(f, 323, 333);
  const hrs = f < 323 ? Math.round(12 * p) : 12;
  const R = 104;
  return (
    <Widget x={X} y={570} w={W} h={420} at={266} exit={343}>
      <Corner l="Work day" r="9 AM–9 PM" />
      <div style={{position: 'absolute', left: (W - 2 * R) / 2 - 10, top: 70, width: 2 * R + 20, height: 2 * R + 20, borderRadius: '50%',
        background: `conic-gradient(from 0deg,#7FD4FF 0deg,#657EFC ${180 * p}deg,#935DF9 ${360 * p}deg,rgba(143,176,255,.10) ${360 * p}deg)`,
        WebkitMask: 'radial-gradient(closest-side,transparent 84%,#000 85%)', filter: `drop-shadow(0 0 12px ${C.blue})`}} />
      <div style={{position: 'absolute', left: (W - 2 * R) / 2 + 12, top: 92, width: 2 * R - 24, height: 2 * R - 24, borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 35%,rgba(101,126,252,.35),rgba(7,10,31,0) 70%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 136, display: 'flex', justifyContent: 'center', alignItems: 'baseline'}}>
        <BigNum size={84}>{hrs}</BigNum><span style={{fontSize: 34, color: C.sky, marginLeft: 4}}>h</span>
      </div>
      <div style={{position: 'absolute', left: 28, top: 330, fontSize: 16, color: C.grey}}>WORK</div>
      <div style={{position: 'absolute', left: 28, top: 352, fontSize: 30, fontWeight: 600}}>{Math.round(p * 100)}%</div>
      <div style={{position: 'absolute', right: 28, top: 330, fontSize: 16, color: C.grey, textAlign: 'right'}}>LIFE</div>
      <div style={{position: 'absolute', right: 28, top: 352, fontSize: 30, fontWeight: 600, color: C.magenta}}>{100 - Math.round(p * 100)}%</div>
    </Widget>
  );
};

// B5 — week bars (stress-bars widget look): 7/7 days, weekend bars flare magenta on "no weekends"
const Week: React.FC = () => {
  const f = useCurrentFrame();
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const hs = [0.86, 0.92, 0.8, 0.95, 0.88, 0.9, 0.84];
  const hit = prog(f, 406, 416);
  return (
    <>
      <Widget x={X} y={580} w={W} h={430} at={350} exit={422}>
        <div style={{position: 'absolute', left: -40, right: -40, top: -150, height: 330, borderRadius: '50%',
          background: 'radial-gradient(70% 80% at 50% 100%,rgba(101,126,252,.55),rgba(26,30,92,.6) 60%,rgba(11,16,48,.9))', borderBottom: '1.5px solid rgba(143,176,255,.4)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 44, display: 'flex', justifyContent: 'center'}}><BigNum size={78}>7/7</BigNum></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 132, display: 'flex', justifyContent: 'center'}}><OutlinePill dot={C.magenta} style={{fontSize: 18, padding: '7px 14px'}}>days on client work</OutlinePill></div>
        <div style={{position: 'absolute', left: 26, top: 214, fontSize: 16, color: C.grey}}>Hours / day</div>
        <div style={{position: 'absolute', right: 26, top: 214, fontSize: 16, color: C.grey}}>this week</div>
        {days.map((d, i) => {
          const g = prog(f, 358 + i * 3, 372 + i * 3);
          const we = i >= 5;
          const hh = 120 * hs[i] * g;
          const col = we ? `linear-gradient(180deg,${C.magenta},${C.orchid})` : 'linear-gradient(180deg,#9DB0FF,#657EFC 60%,#3D4BC0)';
          return (
            <div key={i}>
              <div style={{position: 'absolute', left: 30 + i * 38, top: 372 - hh, width: 22, height: hh, borderRadius: 8,
                background: we && hit > 0 ? col : 'linear-gradient(180deg,#9DB0FF,#657EFC 60%,#3D4BC0)',
                boxShadow: we && hit > 0 ? `0 0 ${20 * hit}px ${C.magenta}` : `0 0 10px rgba(101,126,252,.5)`, transform: we ? `scaleX(${1 + 0.25 * hit})` : undefined}} />
              <div style={{position: 'absolute', left: 30 + i * 38, width: 22, top: 384, textAlign: 'center', fontSize: 16, color: we && hit > 0 ? C.magenta : C.grey}}>{d}</div>
            </div>
          );
        })}
        <DrawPath d="M 222 330 C 196 262, 300 236, 306 300 C 312 372, 224 404, 210 352 C 200 316, 250 270, 290 276" a={408} b={420} w={4} color={C.mist}
          glow={`drop-shadow(0 0 6px ${C.magenta})`} box={[W, 430]} />
      </Widget>
      {f >= 409 && f < 432 ? <div style={{position: 'absolute', left: 776, top: 1034, ...pop(f, 409)}}><OutlinePill dot={C.magenta} style={{background: 'rgba(7,10,31,.85)', fontWeight: 700, letterSpacing: 1}}>NO WEEKENDS</OutlinePill></div> : null}
    </>
  );
};

// B7 — "Today" list (walk-stats widget look); each item strikes on its word, then SKIPPED
const Todo: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, number][] = [['Hit the gym', 528], ['Eat out with friends', 555], ['Lunch', 609]];
  const drain = 1 - prog(f, 600, 616);
  return (
    <>
      <Widget x={X} y={560} w={W} h={450} at={488} exit={640} enter="whip">
        <div style={{position: 'absolute', left: 26, top: 30, width: 66, height: 66, borderRadius: '50%', background: 'rgba(143,176,255,.12)', border: '1.5px solid rgba(143,176,255,.35)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, paddingBottom: 18}}>
          {[14, 24, 18].map((h, i) => <div key={i} style={{width: 7, height: h, borderRadius: 3, background: C.mist}} />)}
        </div>
        <div style={{position: 'absolute', left: 108, top: 32, fontSize: 36, fontWeight: 600, letterSpacing: -1}}>Today</div>
        <div style={{position: 'absolute', left: 108, top: 76, fontSize: 18, color: C.grey}}>0 of 3 done</div>
        <div style={{position: 'absolute', right: 26, top: 36, fontSize: 18, color: C.grey}}>9:41 PM</div>
        {rows.map(([t, at], i) => {
          const s = prog(f, at, at + 8);
          return (
            <div key={t} style={{position: 'absolute', left: 22, right: 22, top: 128 + i * 74, height: 60, borderRadius: 20, background: 'rgba(143,176,255,.08)',
              border: '1.5px solid rgba(143,176,255,.22)', opacity: 1 - 0.35 * s}}>
              <div style={{position: 'absolute', left: 14, top: 16, width: 26, height: 26, borderRadius: 8, border: `2.5px solid ${s > 0 ? C.magenta : C.lilac}`}} />
              <div style={{position: 'absolute', left: 52, top: 16, fontSize: 21, fontWeight: 500, color: 'rgba(242,238,255,.92)', whiteSpace: 'nowrap'}}>{t}</div>
              <div style={{position: 'absolute', left: 48, top: 29, height: 4, width: 210 * s, borderRadius: 2, background: C.magenta, boxShadow: `0 0 10px ${C.magenta}`}} />
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 22, top: 362}}><ProgressBar p={0.62 * drain} w={W - 44} h={34} /></div>
        <div style={{position: 'absolute', left: 26, top: 408, fontSize: 18, color: C.grey}}>Energy</div>
        <div style={{position: 'absolute', right: 26, top: 404, fontSize: 24, fontWeight: 600, color: drain < 0.3 ? C.magenta : C.mist}}>{Math.round(62 * drain)}%</div>
      </Widget>
      <Stamp text="SKIPPED" at={613} exit={640} x={770} y={968} rot={-10} />
    </>
  );
};

// B8 — "System update" card on the chest: progress fills, the cursor presses "Make the switch" on "switch"
const SwitchCard: React.FC = () => {
  const f = useCurrentFrame();
  const at = 628, press = 662, exit = 698;
  if (f < at - 1 || f > exit + 10) return null;
  const p = prog(f, 634, 660, easeInOut);
  const done = f >= press;
  const cx = interpolate(f, [636, 656], [980, 600], {...cl, easing: easeInOut});
  const cy = interpolate(f, [636, 656], [1300, 1128], {...cl, easing: easeInOut});
  const pr = interpolate(f, [press - 2, press, press + 6], [0, 1, 0], cl);
  const e = whipIn(f, at, {from: 1, dist: 700});
  const ex = f > exit ? {opacity: 1 - prog(f, exit, exit + 10), filter: `blur(${12 * prog(f, exit, exit + 10)}px)`} : {};
  return (
    <div style={{position: 'absolute', inset: 0, ...ex}}>
      <div style={{position: 'absolute', left: 230, top: 884, width: 620, height: 330, ...e}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 64, background: 'linear-gradient(180deg,#0C1238,#070A1F)', border: '2px solid rgba(101,126,252,.75)',
          boxShadow: `0 0 0 1px rgba(255,255,255,.04),0 0 40px rgba(101,126,252,.55),0 0 90px rgba(147,93,249,.35),inset 0 1.5px 0 rgba(190,210,255,.4)`, overflow: 'hidden', fontFamily: 'Inter', color: C.mist}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontSize: 22, color: C.grey}}>{done ? 'Update installed' : 'Business model update'}</div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center', fontSize: 44, fontWeight: 600, letterSpacing: -1.2}}>{done ? 'Digital products' : 'Client work → ?'}</div>
          <div style={{position: 'absolute', left: 50, top: 140}}><ProgressBar p={done ? 1 : p} w={520} h={26} /></div>
          <div style={{position: 'absolute', left: 50, top: 176, fontSize: 20, color: 'rgba(230,236,255,.8)'}}>{done ? 'Live' : 'Progress'}</div>
          <div style={{position: 'absolute', right: 50, top: 176, fontSize: 20, color: 'rgba(230,236,255,.8)'}}>{done ? '100%' : `${(p * 100).toFixed(2)}%`}</div>
          <div style={{position: 'absolute', left: 50, right: 50, top: 222, height: 78, borderRadius: 999, background: done ? GRAD : '#F4F6FF',
            boxShadow: done ? `0 0 34px rgba(192,82,233,.85)` : '0 6px 20px rgba(0,0,0,.35)', transform: `scale(${1 - 0.05 * pr})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 600, color: done ? '#fff' : C.ink}}>
            {done ? '✓ Switched' : 'Make the switch'}
          </div>
        </div>
      </div>
      <Ripple x={540} y={1145} at={press} r={110} />
      {f >= 636 && f < exit ? <SoftCursor x={cx} y={cy} press={pr} size={110} opacity={interpolate(f, [636, 640, exit - 6, exit], [0, 1, 1, 0], cl)} /> : null}
    </div>
  );
};

// B11 — CTA: pill → glowing blue card (laptop reference), text types on, soft cursor taps on "bio"
export const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const at = 862, press = 896;
  if (f < at) return null;
  const m = prog(f, at + 4, at + 14, easeInOut);
  const w = interpolate(m, [0, 1], [300, 820]);
  const h = interpolate(m, [0, 1], [86, 280]);
  const txt = 'Get the starter pack';
  const n = Math.floor(interpolate(f, [at + 14, at + 28], [0, txt.length], cl));
  const pr = interpolate(f, [press - 2, press, press + 6], [0, 1, 0], cl);
  const cx = interpolate(f, [878, 892], [940, 640], {...cl, easing: easeInOut});
  const cy = interpolate(f, [878, 892], [1400, 1180], {...cl, easing: easeInOut});
  return (
    <>
      <div style={{position: 'absolute', left: 540 - w / 2, top: 1010, width: w, height: h, borderRadius: 999 * (1 - m) + 70 * m, ...pop(f, at, 10),
        background: 'radial-gradient(120% 90% at 50% 120%,#7C8BFF 0%,#3F63FF 45%,#2A44D8 100%)', overflow: 'hidden',
        boxShadow: `inset 0 3px 0 rgba(160,200,255,.9),0 -2px 26px rgba(127,212,255,.65),0 0 60px rgba(63,99,255,.6),0 30px 70px rgba(0,0,0,.55)`,
        transform: `${pop(f, at, 10).transform} scale(${1 - 0.03 * pr})`}}>
        <div style={{position: 'absolute', left: '6%', right: '6%', top: 0, height: 3, background: 'linear-gradient(90deg,transparent,#fff,transparent)', boxShadow: '0 0 18px #7FD4FF'}} />
        {m < 0.6 ? <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, letterSpacing: 2,
          color: '#fff', opacity: 1 - m / 0.6}}>LINK IN BIO</div> : null}
        {m >= 1 ? (
          <>
            <div style={{position: 'absolute', left: 50, top: 40}}><OutlinePill dot="#fff" style={{background: 'rgba(255,255,255,.14)', border: '1.5px solid rgba(255,255,255,.45)', color: '#fff'}}>link in bio</OutlinePill></div>
            <div style={{position: 'absolute', left: 50, top: 112, fontSize: 64, fontWeight: 600, letterSpacing: -2, color: '#fff', textShadow: '0 0 24px rgba(255,255,255,.45)', whiteSpace: 'nowrap'}}>
              {txt.slice(0, n)}<span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0.2}}>|</span>
            </div>
            <div style={{position: 'absolute', left: 50, top: 210, fontSize: 24, color: 'rgba(255,255,255,.8)'}}>Low-ticket digital products</div>
          </>
        ) : null}
      </div>
      <Ripple x={600} y={1190} at={press} r={120} />
      {f >= 878 ? <SoftCursor x={cx} y={cy} press={pr} size={130} /> : null}
    </>
  );
};

/** Magenta edge flash (inset glow, 2 f up, 12 f down) — on "ASAP". */
export const EdgeFlash: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 2, at + 14], [0, 1, 0], cl);
  return o > 0 ? <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 160px rgba(211,91,197,${0.75 * o}),inset 0 0 40px rgba(211,91,197,${0.6 * o})`}} /> : null;
};

export const TalkOverlays: React.FC = () => (
  <>
    <Product />
    <Clock />
    <Week />
    <Todo />
    <SwitchCard />
  </>
);
