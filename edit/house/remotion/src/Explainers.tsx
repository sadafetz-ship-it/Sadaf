// Full-background explainer scenes + transitions (light-beam sweep, zoom-blur/white-flash).
import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {C, GLASS, HEAVY_FILL, HEAVY_FILTER} from './theme';
import {back, cl, DrawPath, easeInOut, glassPop, HouseIcon, pop, prog, Ripple, whipIn, wordIn, zoomDropIn} from './fx';

/* ---------- world background ---------- */
export const World: React.FC<{seed: number}> = ({seed}) => {
  const f = useCurrentFrame();
  const parts = Array.from({length: 70}, (_, i) => {
    const s = [3, 4, 5, 7][Math.floor(random(`${seed}s${i}`) * 4)];
    const x = random(`${seed}x${i}`) * 1920 + Math.sin((f + i * 13) / 40) * 10;
    const y = ((random(`${seed}y${i}`) * 1200 - f * (0.4 + random(`${seed}v${i}`) * 0.9)) % 1200 + 1200) % 1200 - 60;
    const o = 0.2 + 0.6 * random(`${seed}o${i}`) * (0.6 + 0.4 * Math.sin((f + i * 7) / 9));
    return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: '#FFE27A', opacity: o, boxShadow: `0 0 ${s * 3}px #FFC000`}} />;
  });
  const p1 = 25 + Math.sin(f / 50) * 6, p2 = 78 + Math.cos(f / 60) * 5;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(45% 55% at ${p1}% 30%,rgba(235,136,88,.35),transparent 70%),radial-gradient(40% 50% at ${p2}% 72%,rgba(255,192,0,.22),transparent 70%),radial-gradient(80% 80% at 50% 50%,#2A1508,#0E0703 85%)`}} />
      <div style={{position: 'absolute', inset: -72, transform: `translate(${(f * 0.3) % 72}px, ${(f * 0.15) % 72}px)`,
        backgroundImage: 'linear-gradient(rgba(255,210,140,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,210,140,.07) 1px,transparent 1px)', backgroundSize: '72px 72px',
        WebkitMaskImage: 'radial-gradient(60% 60% at 50% 45%,#000,transparent)'}} />
      {parts}
    </div>
  );
};

const Ribbon: React.FC<{d: string; a: number; b: number; w?: number; o?: number}> = ({d, a, b, w = 14, o = 0.9}) => (
  <DrawPath d={d} a={a} b={b} w={w} color={C.cream} blur={3} opacity={o} flow glow="drop-shadow(0 0 18px #FFC000) drop-shadow(0 0 44px #EB8858)" />
);

/* ---------- Explainer A: "plan your finances" input bar → 10-year timeline ---------- */
export const ExplainA: React.FC = () => {
  const f = useCurrentFrame(); // global frame (scene 135–213)
  const barW = interpolate(f, [140, 148], [140, 900], {...cl, easing: easeInOut});
  const text = 'Plan your finances';
  const n = Math.floor(interpolate(f, [146, 172], [0, text.length], cl));
  const caretOn = Math.floor(f / 4) % 2 === 0 || n < text.length;
  const out = prog(f, 177, 185, (t) => t * t);
  const outStyle: React.CSSProperties = {opacity: 1 - out, transform: `translateY(${-50 * out}px)`, filter: `blur(${12 * out}px)`};
  const fill = interpolate(f, [166, 182], [0, 18], {...cl, easing: easeInOut});
  // timeline
  const nodes: [number, number, string][] = [[330, 560, 'YR 1'], [680, 420, 'YR 3'], [1000, 480, 'YR 5'], [1310, 330, 'YR 7'], [1600, 180, 'YR 10']];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <World seed={4} />
      <Ribbon d="M-60 640 C 300 420, 520 820, 960 600 S 1600 380, 1980 560" a={138} b={165} w={10} o={0.8} />
      <div style={outStyle}>
        {f >= 140 ? (
          <div style={{...GLASS, left: 960 - barW / 2, top: 150, width: barW, height: 140, borderRadius: 70, display: 'flex', alignItems: 'center', gap: 26, padding: '0 34px',
            opacity: interpolate(f, [140, 142], [0, 1], cl)}}>
            <div style={{flex: 'none', width: 70, height: 70, borderRadius: 22, background: 'linear-gradient(160deg,#FFE27A,#F0913A)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 44, color: C.ink, ...pop(f, 141)}}>$</div>
            <div style={{fontWeight: 500, fontSize: 52, color: C.cream, letterSpacing: -1, whiteSpace: 'nowrap'}}>
              {text.slice(0, n)}
              <span style={{display: 'inline-block', width: 5, height: 56, background: '#fff', marginLeft: 6, verticalAlign: -8, opacity: caretOn ? 1 : 0, boxShadow: '0 0 14px #FFC000, 0 0 30px #fff'}} />
            </div>
          </div>
        ) : null}
        <div style={{...GLASS, left: 620, top: 330, width: 680, height: 290, ...zoomDropIn(f, 158, {dx: 0, dy: -80, from: 1.3, rot: 0})}}>
          <div style={{position: 'relative', padding: '36px 48px', display: 'flex', flexDirection: 'column', gap: 24}}>
            <div style={{alignSelf: 'flex-start', ...pop(f, 162)}}>
              <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 999, background: 'rgba(255,192,0,.16)', border: '1.5px solid rgba(255,192,0,.7)', color: '#FFE27A', fontWeight: 600, fontSize: 28}}>
                <i style={{width: 12, height: 12, borderRadius: '50%', background: C.ember}} />10-YEAR PLAN
              </div>
            </div>
            <div style={{height: 22, borderRadius: 11, background: 'rgba(255,220,150,.12)'}}>
              <div style={{width: `${fill}%`, height: '100%', borderRadius: 11, background: 'linear-gradient(90deg,#EB8858,#FFC000)', boxShadow: '0 0 14px rgba(255,192,0,.6)'}} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', color: 'rgba(255,244,222,.65)', fontSize: 28, fontWeight: 500}}>
              <span style={wordIn(f, 166)}>Age 28</span><span style={wordIn(f, 170)}>Age 38</span>
            </div>
          </div>
        </div>
      </div>
      {/* timeline */}
      <DrawPath d="M330 560 C 450 480, 560 400, 680 420 S 880 500, 1000 480 S 1200 350, 1310 330 S 1500 240, 1600 180" a={180} b={206} w={6} />
      {nodes.map(([x, y, l], i) => {
        const t = 180 + i * 6.5;
        const last = i === nodes.length - 1;
        const s = last ? 110 : 64;
        const sharp = prog(f, t, t + 10);
        if (f < t - 1) return null;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%',
              opacity: 0.4 + 0.6 * sharp, filter: `blur(${14 * (1 - sharp)}px)`, transform: `scale(${last ? interpolate(f, [t, t + 5, t + 9], [0.3, 1.2, 1], cl) : 0.88 + 0.12 * sharp})`,
              background: last ? 'linear-gradient(160deg,#FFE27A,#F0913A)' : 'radial-gradient(#FFE27A,#EB8858)', boxShadow: `0 0 ${24 + (last ? 30 * (1 - sharp) : 0)}px rgba(255,192,0,.7)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{last ? <HouseIcon s={58} /> : null}</div>
            <div style={{position: 'absolute', left: x - 80, top: y + s / 2 + 12, width: 160, textAlign: 'center', fontWeight: 600, fontSize: 30, color: last ? '#FFE27A' : 'rgba(255,244,222,.75)', ...wordIn(f, t + 2)}}>{l}</div>
          </React.Fragment>
        );
      })}
      <Ripple x={1600} y={180} at={206} r={110} />
    </div>
  );
};

/* ---------- Explainer B: goal card + light-ribbon loop ---------- */
export const ExplainB: React.FC = () => {
  const f = useCurrentFrame(); // global frame (scene 373–470)
  const at = 383; // "home"
  const dev = prog(f, at, at + 8);
  const float = Math.sin((f - at) / 15) * 5;
  const pulse = interpolate(f, [422, 425, 434], [0, 1, 0], cl); // "goals"
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <World seed={9} />
      {/* side ghost cards (carousel) */}
      {[[470, -8, -1], [1150, 8, 1]].map(([x, r, d], k) => (
        <div key={k} style={{position: 'absolute', left: x, top: 150, width: 300, height: 400, borderRadius: 44, background: 'linear-gradient(180deg,rgba(255,241,207,.35),rgba(42,21,8,.7))',
          ...whipIn(f, 375 + k * 2, {from: d as 1 | -1, dist: 500, rot: r}), filter: `${whipIn(f, 375 + k * 2, {from: d as 1 | -1, dist: 500, rot: r}).filter} blur(4px)`, opacity: 0.55 * interpolate(f, [375, 380], [0, 1], cl),
          transform: `${whipIn(f, 375 + k * 2, {from: d as 1 | -1, dist: 500, rot: r}).transform} translateY(${Math.sin((f + k * 20) / 18) * 6}px)`}} />
      ))}
      <Ribbon d="M760 120 C 520 260, 560 640, 880 660 S 1420 620, 1300 330 S 1000 20, 760 120" a={381} b={410} w={16} />
      {f >= at - 1 ? (
        <div style={{position: 'absolute', left: 740, top: 90, width: 440, height: 520, borderRadius: 52, overflow: 'hidden',
          opacity: interpolate(f, [at - 1, at + 1], [0, 1], cl), transform: `translateY(${float}px) scale(${interpolate(f, [at, at + 4, at + 8], [0.6, 1.06, 1], cl)})`,
          boxShadow: `0 30px 80px rgba(0,0,0,.6),0 0 0 2px rgba(255,226,150,.6),0 0 ${40 * (1 - dev) + 30 * pulse + 10}px rgba(255,214,140,${0.9 * (1 - dev) + 0.5 * pulse + 0.15})`}}>
          <div style={{height: 280, background: 'linear-gradient(180deg,#FFF1CF,#FFD580)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{width: 160, height: 160, borderRadius: 42, background: 'linear-gradient(160deg,#FFC000,#EB8858)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 16px 30px rgba(107,52,16,.35)', ...pop(f, at + 6, 9)}}><HouseIcon s={104} /></div>
          </div>
          <div style={{height: 240, background: 'linear-gradient(180deg,#2A1508,#160C06)', textAlign: 'center', paddingTop: 30}}>
            <div style={{fontWeight: 800, fontStyle: 'italic', fontSize: 58, color: C.cream, letterSpacing: -2, ...wordIn(f, at + 6)}}>Buy a home</div>
            <div style={{fontSize: 26, color: 'rgba(255,244,222,.6)', marginTop: 6, ...wordIn(f, 404)}}>goal #1 for most people</div>
            <div style={{fontSize: 38, color: C.amber, letterSpacing: 8, marginTop: 12}}>
              {[0, 1, 2, 3, 4].map((k) => <span key={k} style={{display: 'inline-block', ...pop(f, 408 + k * 2)}}>★</span>)}
            </div>
          </div>
          {/* white placeholder that "develops" into the card */}
          <div style={{position: 'absolute', inset: 0, background: '#FFF8E8', opacity: 1 - dev}} />
        </div>
      ) : null}
      <Ribbon d="M880 660 C 1080 690, 1300 640, 1330 470" a={395} b={410} w={16} o={1} />
      {/* "for a lot of people": a row of people pops under the card */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', gap: 18}}>
        {Array.from({length: 7}, (_, k) => (
          <div key={k} style={{width: 44, height: 44, ...pop(f, 441 + k * 1.5)}}>
            <svg viewBox="0 0 24 24" width={44} height={44}><circle cx="12" cy="8" r="4.2" fill={k === 3 ? C.amber : 'rgba(255,244,222,.75)'} /><path d="M3.5 21c.8-4.6 4.2-7 8.5-7s7.7 2.4 8.5 7z" fill={k === 3 ? C.amber : 'rgba(255,244,222,.75)'} /></svg>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Transitions ---------- */
/** Light-beam sweep: reveals children through a widening cone from a ring pivot (12 f). */
export const BeamReveal: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, easeInOut);
  const px = 240, py = 60, Rr = 3200;
  const a0 = (80 - 115 * p) * (Math.PI / 180), a1 = (80 + 115 * p) * (Math.PI / 180);
  const pt = (a: number) => `${px + Rr * Math.cos(a)}px ${py + Rr * Math.sin(a)}px`;
  const mids = Array.from({length: 9}, (_, i) => pt(a0 + ((a1 - a0) * i) / 8)).join(',');
  const clip = p >= 1 ? 'none' : `polygon(${px}px ${py}px, ${mids})`;
  const edge = (a: number) => (
    <line x1={px} y1={py} x2={px + Rr * Math.cos(a)} y2={py + Rr * Math.sin(a)} stroke="#FFF4DE" strokeWidth={6} opacity={0.85 * (1 - p)} style={{filter: 'blur(3px) drop-shadow(0 0 16px #FFC000)'}} />
  );
  const flash = interpolate(f, [at, at + 1, at + 4], [0, 0.55, 0], cl);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, clipPath: clip}}>{children}</div>
      {p < 1 && f >= at ? (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {edge(a0)}{edge(a1)}
          <circle cx={px} cy={py} r={20} fill="none" stroke="#FFF4DE" strokeWidth={4} opacity={1 - p} />
        </svg>
      ) : null}
      <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash, pointerEvents: 'none'}} />
    </>
  );
};

/** White flash + overexposed fade (Golden Hour entry) for cuts back to the speaker. */
export const FlashCut: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 1, at + 4], [0.7, 0.45, 0], cl);
  if (f < at || o <= 0) return null;
  return <div style={{position: 'absolute', inset: 0, background: '#FFF8EC', opacity: o, pointerEvents: 'none'}} />;
};
