// Graphics over the speaker (side zones only: left x 60–700, right x 1240–1860). Absolute frames; mount by range.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BIG_NUM, C, GLASS, HL} from './theme';
import {bez, bezD, bloomIn, Burst, Card3D, Caret, cl, Comet, DrawPath, easeInOut, exitStyle, pop, prog, Pulse, rollNum, ScriptPixels, Sparkles, spr, Star4, typed, wordIn} from './fx';

const between = (f: number, a: number, b: number) => f >= a - 2 && f < b + 14;
const Meta: React.FC<{x: number; y: number; children: React.ReactNode; right?: boolean}> = ({x, y, children, right}) => (
  <div style={{position: 'absolute', [right ? 'right' : 'left']: x, top: y, fontSize: 18, color: 'rgba(243,247,255,.5)'}}>{children}</div>
);
const Lab: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontSize: 24, color: 'rgba(243,247,255,.6)', ...style}}>{children}</div>
);
const glassBody: React.CSSProperties = {...GLASS, position: 'absolute', inset: 0};

/* ---------- Arc gauge ---------- */
const Arc: React.FC<{r: number; frac: number; w?: number; id: string}> = ({r, frac, w = 14, id}) => {
  const start = 150, sweep = 240;
  const pt = (a: number) => [r + 20 + r * Math.cos((a * Math.PI) / 180), r + 20 + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = pt(start), [x1, y1] = pt(start + sweep), [xf, yf] = pt(start + sweep * Math.max(0.001, frac));
  return (
    <svg width={2 * r + 40} height={2 * r + 40} style={{overflow: 'visible'}}>
      <defs><linearGradient id={id} x1="0" x2="1"><stop offset="0" stopColor={C.blue} /><stop offset=".6" stopColor={C.lime} /><stop offset="1" stopColor="#fff" /></linearGradient></defs>
      <path d={`M${x0} ${y0} A${r} ${r} 0 1 1 ${x1} ${y1}`} fill="none" stroke="rgba(243,247,255,.1)" strokeWidth={w} strokeLinecap="round" />
      {Array.from({length: 41}, (_, k) => {
        const a = ((start + (sweep * k) / 40) * Math.PI) / 180, on = k / 40 <= frac;
        return <line key={k} x1={r + 20 + (r - 30) * Math.cos(a)} y1={r + 20 + (r - 30) * Math.sin(a)} x2={r + 20 + (r - 22) * Math.cos(a)} y2={r + 20 + (r - 22) * Math.sin(a)}
          stroke={on ? C.lime : 'rgba(243,247,255,.18)'} strokeWidth={3} strokeLinecap="round" />;
      })}
      <path d={`M${x0} ${y0} A${r} ${r} 0 ${sweep * frac > 180 ? 1 : 0} 1 ${xf} ${yf}`} fill="none" stroke={`url(#${id})`} strokeWidth={w} strokeLinecap="round"
        style={{filter: 'drop-shadow(0 0 10px rgba(230,255,79,.7))'}} />
      <circle cx={xf} cy={yf} r={w * 0.75} fill="#fff" style={{filter: `drop-shadow(0 0 10px ${C.lime})`}} />
    </svg>
  );
};

/* ---------- Scripts title (per-word slide/blur, ghost trail, pixels, setup words, square) ---------- */
export const ScriptsTitle: React.FC<{word: string; at: number; out: number; x: number; y: number; size: number; setL?: [string, number]; setR?: [string, number]; seed: string}> = ({
  word, at, out, x, y, size, setL, setR, seed,
}) => {
  const f = useCurrentFrame();
  if (f < at - 8 || f > out + 10) return null;
  const p = prog(f, at, at + 15);
  const ghost = interpolate(f, [at, at + 26], [60, 18], cl);
  const gO = interpolate(f, [at, at + 26, at + 40], [0.55, 0.25, 0], cl);
  const wEst = word.length * size * 0.6;
  const drift = Math.sin((f - at) / 18) * 3;
  const st: React.CSSProperties = {position: 'absolute', left: 0, top: 0, fontWeight: 780, fontSize: size, letterSpacing: '-0.055em', lineHeight: 0.9, color: C.lime, whiteSpace: 'nowrap'};
  return (
    <div style={{position: 'absolute', left: x, top: y + drift, ...exitStyle(f, out, 8)}}>
      <div style={{position: 'absolute', left: wEst / 2 - 2, top: -160 + 160 * prog(f, at - 6, at), width: 4, height: 150, background: C.lime, boxShadow: `0 0 14px ${C.lime}`,
        opacity: f >= at - 6 && f < at + 4 ? 1 - prog(f, at, at + 4) : 0}} />
      <div style={{...st, transform: `translateX(${ghost}px)`, opacity: f >= at ? gO : 0, filter: 'blur(7px)'}}>{word}</div>
      <div style={{...st, opacity: interpolate(f, [at, at + 3], [0, 1], cl), transform: `translateX(${-90 * (1 - p)}px)`, filter: `blur(${16 * (1 - p)}px) drop-shadow(0 4px 18px rgba(8,24,58,.55))`}}>{word}</div>
      <div style={{position: 'absolute', left: -46, top: size * 0.3, width: 26, height: 26, border: `3px solid ${C.mist}`, ...pop(f, at + 3)}} />
      {setL ? <div style={{position: 'absolute', left: 4, top: -50, whiteSpace: 'nowrap', fontWeight: 300, fontSize: 40, color: C.mist, textShadow: '0 0 6px rgba(8,24,58,.9),0 2px 16px rgba(8,24,58,.9)', ...wordIn(f, setL[1])}}>{setL[0]}</div> : null}
      {setR ? <div style={{position: 'absolute', left: wEst - setR[0].length * 19, top: -50, fontWeight: 300, fontSize: 40, color: C.mist, textShadow: '0 0 6px rgba(8,24,58,.9),0 2px 16px rgba(8,24,58,.9)', whiteSpace: 'nowrap', ...wordIn(f, setR[1])}}>{setR[0]}</div> : null}
      <ScriptPixels at={at} x={0} y={0} w={wEst} h={size * 0.9} seed={seed} size={Math.round(size * 0.13)} life={32}
        anchors={[[-0.05, 1.02], [1.02, 0.1], [0.96, 1.0], [0.5, -0.32]]} />
    </div>
  );
};

/* ---------- F1 player widget ---------- */
const F1: React.FC = () => {
  const f = useCurrentFrame();
  const press = interpolate(f, [47, 49, 55], [0, 1, 0], cl);
  const frac = interpolate(f, [10, 62], [0.02, 0.34], cl);
  return (
    <>
      <Card3D at={6} out={60} from="left" x={110} y={90} w={440} h={440} radius={70} style={glassBody}>
        <Meta x={36} y={30}>Episode 01</Meta><Meta x={36} y={30} right>0:{String(Math.floor(2 + f / 30)).padStart(2, '0')}</Meta>
        <div style={{position: 'absolute', left: 60, top: 64}}><Arc r={140} frac={frac} id="a1" /></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 158, textAlign: 'center'}}>
          <div style={{fontSize: 20, color: 'rgba(243,247,255,.6)'}}>now playing</div>
          <div style={{...BIG_NUM, fontWeight: 400, fontSize: 46, letterSpacing: -1}}>The Playbook</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26}}>
          <Btn s={58}>❚❚</Btn>
          <div style={{transform: `scale(${1 - 0.14 * press})`}}><Btn s={84} on>{f >= 49 ? '❚❚' : '▶'}</Btn></div>
          <Btn s={58}>✕</Btn>
        </div>
      </Card3D>
      <Pulse x={330} y={414} at={49} r={90} />
      <Sparkles pts={[[566, 96, 14], [92, 470, 9], [540, 520, 10]]} at={18} seed="f1" />
    </>
  );
};
const Btn: React.FC<{s: number; on?: boolean; children: React.ReactNode}> = ({s, on, children}) => (
  <div style={{width: s, height: s, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s * 0.36,
    ...(on ? {background: C.lime, color: C.ink, boxShadow: '0 0 26px rgba(230,255,79,.8)'} : {background: 'rgba(243,247,255,.08)', color: C.mist, border: '1.5px solid rgba(243,247,255,.2)'})}}>{children}</div>
);

/* ---------- Neon pill (prompt / search) ---------- */
const NeonPill: React.FC<{at: number; out: number; x: number; y: number; w: number; h: number; text: string; t0: number; t1: number; glowWord?: string; send?: number}> = ({
  at, out, x, y, w, h, text, t0, t1, glowWord, send,
}) => {
  const f = useCurrentFrame();
  if (f < at - 1 || f > out + 12) return null;
  const s = spr(f, at, {damping: 16});
  const width = 120 + (w - 120) * prog(f, at + 3, at + 16, easeInOut);
  const shown = typed(f, text, t0, t1);
  const parts = glowWord && shown.includes(glowWord) ? shown.split(glowWord) : null;
  const sendP = send ? prog(f, send, send + 10) : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, height: h, width, opacity: interpolate(f, [at, at + 4], [0, 1], cl), transform: `scale(${0.7 + 0.3 * s})`, transformOrigin: 'left center', ...exitStyle(f, out)}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 999, background: '#03081A', border: `3px solid ${C.lime}`,
        boxShadow: `inset 0 0 0 1px rgba(243,247,255,.25),0 0 18px rgba(230,255,79,${0.7 + 0.3 * Math.sin(f / 8)}),0 0 70px 10px rgba(46,100,176,.55),0 0 140px 30px rgba(23,61,112,.6)`}} />
      <div style={{position: 'absolute', left: 46, top: 0, bottom: 0, right: 100, display: 'flex', alignItems: 'center', fontSize: h * 0.34, color: C.mist, whiteSpace: 'pre', overflow: 'hidden'}}>
        {parts ? <>{parts[0]}<span style={HL}>{glowWord}</span>{parts[1]}</> : shown}<Caret h={h * 0.34} f={f} solid={f < t1} />
      </div>
      {send !== undefined ? (
        <svg width={66} height={66} viewBox="0 0 64 64" style={{position: 'absolute', right: 34, top: (h - 66) / 2, transform: `translateY(${-30 * sendP}px)`, opacity: 1 - sendP * 0.6,
          filter: f >= send ? `drop-shadow(0 0 12px ${C.lime})` : undefined}}>
          <path d="M32 54 V12 M14 30 L32 12 L50 30" fill="none" stroke={f >= send ? C.lime : C.mist} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </div>
  );
};

/* ---------- $$$ + V lines + edge flash ---------- */
const Dollars: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 158 || f > 222) return null;
  const pulse = interpolate(f, [194, 199, 206], [1, 1.07, 1], cl);
  return (
    <div style={exitStyle(f, 206)}>
      <DrawPath d="M1260 110 L1560 610 L1860 110" a={158} b={178} w={2} color={C.mist} glow="drop-shadow(0 0 6px rgba(243,247,255,.6))" opacity={0.6} />
      <DrawPath d="M1330 110 L1560 540 L1790 110" a={162} b={182} w={2} opacity={0.55} />
      {[0, 1, 2].map((i) => {
        const at = 168 + i * 8;
        const p = spr(f, at, {damping: 11, stiffness: 140});
        return <div key={i} style={{position: 'absolute', left: 1290 + i * 175, top: 150 + (i % 2) * 14, fontFamily: 'Antonio', fontWeight: 700, fontSize: 330, lineHeight: 1,
          background: `linear-gradient(180deg,${C.mist} 20%,#F4FFB0 55%,${C.lime})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          filter: `drop-shadow(0 0 14px rgba(230,255,79,.45)) blur(${8 * (1 - Math.min(1, p))}px)`, opacity: interpolate(f, [at, at + 3], [0, 1], cl),
          transform: `translateY(${-140 * (1 - p)}px) scale(${(i === 1 ? 1.07 : 1) * pulse})`}}>$</div>;
      })}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(270deg,rgba(230,255,79,.22),transparent 25%)', opacity: interpolate(f, [194, 196, 208], [0, 1, 0], cl)}} />
    </div>
  );
};

/* ---------- Balance card ---------- */
const Balance: React.FC<{at: number; out: number; label: string; value: (f: number) => string; delta: string; ticks: string[]; fill: (f: number) => number; chip?: [string, number]; small?: boolean}> = ({
  at, out, label, value, delta, ticks, fill, chip, small,
}) => {
  const f = useCurrentFrame();
  return (
    <Card3D at={at} out={out} from="left" x={90} y={140} w={600} h={300} radius={48} style={glassBody}>
      <div style={{position: 'absolute', left: 44, top: 46}}>
        <Lab style={{fontSize: 26}}>{label}</Lab>
        <div style={{marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 14}}>
          <span style={{...BIG_NUM, fontWeight: 600, fontSize: small ? 46 : 66, letterSpacing: -1.5}}>{value(f)}</span>
          <span style={{fontSize: 22, color: C.lime, ...wordIn(f, at + 14)}}>{delta}</span>
        </div>
      </div>
      <svg width={62} height={62} viewBox="0 0 64 64" style={{position: 'absolute', right: 46, top: 52}}><g fill="rgba(243,247,255,.5)"><path d="M32 6 L60 20 H4Z" /><rect x={8} y={24} width={7} height={26} /><rect x={22} y={24} width={7} height={26} /><rect x={35} y={24} width={7} height={26} /><rect x={49} y={24} width={7} height={26} /><rect x={4} y={52} width={56} height={7} /></g></svg>
      {chip ? <div style={{position: 'absolute', right: 130, top: 60, padding: '6px 14px', borderRadius: 999, border: `1.5px solid ${C.lime}`, color: C.lime, fontSize: 20, fontWeight: 600, ...pop(f, chip[1])}}>{chip[0]}</div> : null}
      <div style={{position: 'absolute', left: 44, right: 44, top: 190}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 20, letterSpacing: 1, color: 'rgba(243,247,255,.55)'}}>
          {ticks.map((t, i) => <span key={t} style={wordIn(f, at + 8 + i * 3)}>{t}</span>)}
        </div>
        <div style={{marginTop: 14, height: 12, borderRadius: 6, background: 'rgba(243,247,255,.08)'}}>
          <div style={{width: `${fill(f)}%`, height: 12, borderRadius: 6, background: `linear-gradient(90deg,${C.limeDk},${C.lime})`, boxShadow: `0 0 14px ${C.lime},0 0 34px rgba(230,255,79,.6)`}} />
        </div>
      </div>
    </Card3D>
  );
};
const fmtT = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

/* ---------- F4 avatars + eye ---------- */
const Person: React.FC<{c: string}> = ({c}) => (
  <svg width={100} height={100} viewBox="0 0 64 64"><circle cx={32} cy={32} r={31} fill="#0C2148" stroke="rgba(243,247,255,.45)" strokeWidth={2} /><circle cx={32} cy={25} r={11} fill={c} /><path d="M12 54c3-11 11-16 20-16s17 5 20 16" fill={c} /></svg>
);
const F4: React.FC = () => {
  const f = useCurrentFrame();
  const out = 280;
  return (
    <>
      <div style={exitStyle(f, out)}>
        {Array.from({length: 7}, (_, i) => {
          const at = 236 + i * 3;
          const s = spr(f, at, {damping: 10, stiffness: 160});
          return <div key={i} style={{position: 'absolute', left: 130 + (i % 4) * 118 + (i >= 4 ? 59 : 0), top: 150 + Math.floor(i / 4) * 112,
            transform: `scale(${s}) translateY(${Math.sin((f + i * 9) / 14) * 3}px)`, opacity: (f >= at ? 1 : 0) * (i < 6 ? 1 : 0.55)}}><Person c={i % 3 ? C.mist : C.lime} /></div>;
        })}
        <div style={{position: 'absolute', left: 140, top: 390, fontSize: 26, fontWeight: 600, letterSpacing: 3, ...wordIn(f, 250)}}>EVERYONE <span style={{color: C.lime}}>8B+ watching</span></div>
      </div>
      <Card3D at={252} out={out} from="right" x={1400} y={150} w={340} h={340} radius={64} style={glassBody}>
        <Meta x={34} y={30}>live</Meta><Meta x={34} y={30} right>8B+</Meta>
        <svg width={240} height={200} viewBox="0 0 240 200" style={{position: 'absolute', left: 50, top: 80, filter: `drop-shadow(0 0 12px rgba(230,255,79,.7))`}}>
          {[96, 76].map((r, k) => <circle key={r} cx={120} cy={100} r={r * (1 + 0.08 * Math.sin((f - k * 8) / 6))} fill="none" stroke={C.lime} strokeOpacity={0.2 + 0.2 * k} strokeWidth={3} />)}
          <path d="M20 100 Q120 10 220 100 Q120 190 20 100Z" fill="rgba(8,24,58,.6)" stroke={C.mist} strokeWidth={6} />
          <g transform={`translate(120 100) scale(1 ${interpolate(f, [258, 261, 265], [1, 0.1, 1], cl)}) translate(-120 -100)`}>
            <circle cx={120 + Math.sin(f / 12) * 8} cy={100} r={34} fill={C.lime} /><circle cx={120 + Math.sin(f / 12) * 8} cy={100} r={14} fill={C.ink} /><circle cx={130 + Math.sin(f / 12) * 8} cy={90} r={6} fill="#fff" />
          </g>
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 284, textAlign: 'center', fontSize: 22, color: 'rgba(243,247,255,.6)'}}>everyone's watching</div>
      </Card3D>
      <Pulse x={1570} y={330} at={262} r={200} dur={28} />
    </>
  );
};

/* ---------- F5b neon corner frame ---------- */
const F5b: React.FC = () => {
  const f = useCurrentFrame();
  const out = 450;
  if (f < 393 || f > out + 12) return null;
  const para = 'How one firm turned a single idea into the biggest playbook in finance…';
  const shown = typed(f, para, 412, 446);
  const parts = shown.split('biggest');
  return (
    <div style={exitStyle(f, out)}>
      <div style={{position: 'absolute', left: 1300, top: 120, width: 640, height: 520, borderTopLeftRadius: 70, overflow: 'hidden',
        background: 'radial-gradient(120% 90% at 0% 0%,rgba(46,100,176,.5),rgba(4,10,28,.88) 60%)', opacity: prog(f, 395, 408),
        WebkitMaskImage: 'linear-gradient(90deg,#000 70%,transparent),linear-gradient(180deg,#000 75%,transparent)', WebkitMaskComposite: 'source-in'}} />
      <DrawPath d="M1302 640 L1302 192 Q1302 122 1372 122 L1940 122" a={395} b={413} w={4} />
      <Comet pts={[[1302, 640], [1302, 400], [1302, 200], [1302, 192], [1302, 150], [1330, 122], [1372, 122], [1600, 122], [1800, 122], [1940, 122]]} a={395} b={413} size={9} />
      <div style={{position: 'absolute', left: 1370, top: 230, fontWeight: 300, fontSize: 64, letterSpacing: 3, color: C.mist, textShadow: '0 0 20px rgba(243,247,255,.35)', ...bloomIn(f, 404)}}>CLASSIFIED</div>
      <div style={{position: 'absolute', left: 1370, top: 330, width: 440, fontSize: 26, lineHeight: 1.5, color: 'rgba(243,247,255,.45)'}}>
        {parts.length > 1 ? <>{parts[0]}<span style={HL}>biggest</span>{parts[1]}</> : shown}<Caret h={26} f={f} solid={f < 446} />
      </div>
      <Sparkles pts={[[1300, 120, 16], [1820, 560, 11]]} at={410} seed="f5b" />
    </div>
  );
};

/* ---------- F6 notes window ---------- */
const F6: React.FC = () => {
  const f = useCurrentFrame();
  const lines = ['Private equity 101', 'Blackstone, 1985', 'Who kept it quiet'];
  const found = typed(f, 'Hidden in plain sight', 466, 492);
  const fp = found.split('plain sight');
  return (
    <Card3D at={448} out={560} from="left" x={110} y={80} w={560} h={430} radius={26} style={{...glassBody, borderRadius: 26}}>
      <div style={{position: 'absolute', left: 40, right: 40, top: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>{[C.lime, C.mist, C.blue].map((c) => <i key={c} style={{display: 'inline-block', width: 16, height: 16, borderRadius: '50%', marginRight: 10, background: c}} />)}</div>
        <span style={{fontSize: 18, color: 'rgba(243,247,255,.4)'}}>playbook/notes</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 74, height: 1, background: 'rgba(243,247,255,.1)'}} />
      <div style={{position: 'absolute', left: 40, top: 96}}>
        <div style={{fontSize: 26, fontWeight: 600, marginBottom: 8, ...wordIn(f, 452)}}>Research</div>
        {lines.map((t, i) => <div key={t} style={{fontSize: 23, color: 'rgba(243,247,255,.7)', margin: '6px 0 6px 18px', whiteSpace: 'nowrap'}}>{typed(f, t, 454 + i * 5, 460 + i * 5)}</div>)}
        <div style={{fontSize: 26, fontWeight: 600, margin: '16px 0 8px', ...wordIn(f, 462)}}>Found</div>
        <div style={{fontSize: 25, marginLeft: 18, whiteSpace: 'nowrap'}}>
          {fp.length > 1 ? <>{fp[0]}<span style={{...HL, position: 'relative'}}>plain sight<span style={{position: 'absolute', left: 0, bottom: -6, height: 5, borderRadius: 3, width: `${100 * prog(f, 484, 496)}%`, background: C.lime, boxShadow: `0 0 12px ${C.lime}`}} /></span></> : found}
          <Caret h={26} f={f} solid={f < 492} />
        </div>
      </div>
    </Card3D>
  );
};

/* ---------- F7 search results ---------- */
const F7: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(rollNum(f, 528, 543, 12400, 0));
  return (
    <>
      <NeonPill at={502} out={604} x={1260} y={150} w={600} h={110} text="how they really built it" t0={508} t1={526} />
      <Card3D at={526} out={604} from="up" x={1300} y={310} w={520} h={220} radius={44} style={glassBody}>
        <div style={{position: 'absolute', left: 40, top: 34}}>
          <Lab style={{fontSize: 22}}>Search results</Lab>
          <div style={{...BIG_NUM, fontSize: 110}}>{n.toLocaleString('en-US')}</div>
        </div>
        <div style={{position: 'absolute', left: 270, top: 96, fontSize: 24, color: 'rgba(243,247,255,.75)', ...wordIn(f, 543)}}>They never wanted<br />it <span style={HL}>found</span>.</div>
      </Card3D>
    </>
  );
};

/* ---------- F9 line path + gauge ---------- */
const F9: React.FC = () => {
  const f = useCurrentFrame();
  const out = 750;
  const yr = Math.round(rollNum(f, 680, 716, 1950, 1985));
  const ghostL = 1 - prog(f, 700, 716) * 0.5;
  return (
    <>
      <div style={exitStyle(f, out)}>
        {f >= 671 ? <>
          <DrawPath d="M160 390 C 300 390, 320 200, 480 210 S 640 200, 660 180" a={676} b={706} w={5} flow />
          <div style={{position: 'absolute', left: 146, top: 376, width: 28, height: 28, borderRadius: '50%', background: C.ink, border: `4px solid ${C.mist}`, ...pop(f, 676)}} />
          <div style={{position: 'absolute', left: 646, top: 164, width: 32, height: 32, borderRadius: '50%', background: C.lime, boxShadow: `0 0 18px ${C.lime}`, ...pop(f, 704)}} />
          <div style={{position: 'absolute', left: 110, top: 432, padding: '10px 20px', borderRadius: 16, background: 'rgba(8,24,58,.8)', border: '1.5px solid rgba(243,247,255,.3)', fontSize: 24,
            opacity: f >= 683 ? 0.4 + 0.6 * ghostL : 0, filter: `blur(${(1 - ghostL) * 3}px)`, ...wordIn(f, 683)}}>Lehman Brothers</div>
          <div style={{position: 'absolute', left: 520, top: 100, padding: '12px 24px', borderRadius: 16, background: 'rgba(8,24,58,.9)', border: `2px solid ${C.lime}`, fontWeight: 700, fontSize: 28,
            boxShadow: '0 0 18px rgba(230,255,79,.4)', ...bloomIn(f, 704)}}>Blackstone</div>
          <div style={{position: 'absolute', left: 330, top: 300, padding: '6px 14px', borderRadius: 999, background: C.lime, color: C.ink, fontWeight: 700, fontSize: 20, ...pop(f, 716)}}>LEFT · 1985</div>
        </> : null}
      </div>
      <Card3D at={674} out={out} from="right" x={1330} y={120} w={460} h={460} radius={70} style={glassBody}>
        <Meta x={40} y={34}>Year</Meta><Meta x={40} y={34} right>NYC</Meta>
        <div style={{position: 'absolute', left: 70, top: 70}}><Arc r={140} frac={interpolate(f, [680, 716], [0.05, 0.82], {...cl, easing: easeInOut})} w={16} id="a9" /></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 172, textAlign: 'center'}}><span style={{...BIG_NUM, fontSize: 112}}>{yr}</span></div>
        <div style={{position: 'absolute', left: 40, top: 380}}><div style={{fontSize: 16, letterSpacing: 1, color: 'rgba(243,247,255,.5)'}}>LEFT</div><div style={{fontSize: 24}}>Lehman</div></div>
        <div style={{position: 'absolute', right: 40, top: 380, textAlign: 'right'}}><div style={{fontSize: 16, letterSpacing: 1, color: 'rgba(243,247,255,.5)'}}>FOUNDED</div><div style={{fontSize: 24, color: C.lime}}>Blackstone</div></div>
      </Card3D>
      <Burst x={1560} y={360} at={716} r={260} seed="yr" />
    </>
  );
};

/* ---------- Number tile deck (01/02/03): newest lands in front, older slide back up-right ---------- */
const TILES: [string, string, number][] = [['01', 'BILLIONS', 770], ['02', 'PE EMPIRE', 823], ['03', 'MASSIVE TEAM', 887]];
const Deck: React.FC = () => {
  const f = useCurrentFrame();
  const out = 950;
  if (f < 766 || f > out + 12) return null;
  const landed = TILES.filter((t) => f >= t[2] - 2).length;
  return (
    <div style={exitStyle(f, out)}>
      {TILES.map(([n, lab, at], i) => {
        if (f < at - 2) return null;
        const depth = landed - 1 - i; // 0 = front
        const dS = spr(f, TILES[Math.min(i + depth, 2)][2]);
        const d = depth === 0 ? 0 : (depth - 1) + dS;
        const s = spr(f, at, {damping: 12, stiffness: 140});
        const size = 330 - 45 * d;
        const x = 1330 + 140 * d, y = 250 - 75 * d;
        const strike = prog(f, at + 9, at + 17);
        return (
          <div key={n} style={{position: 'absolute', left: x, top: y + (-260 * (1 - s)), width: size, height: size, zIndex: 10 - Math.round(d * 2), opacity: (1 - 0.28 * d) * interpolate(f, [at - 2, at + 3], [0, 1], cl),
            transform: `rotate(${(1 - s) * -12 + d * 3}deg)`, filter: `blur(${(1 - Math.min(1, s)) * 14 + d * 1.5}px)`}}>
            <div style={{...glassBody, borderRadius: size * 0.17, borderColor: depth === 0 ? 'rgba(230,255,79,.7)' : undefined}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: size * 0.1, textAlign: 'center'}}><span style={{...BIG_NUM, fontSize: size * 0.48, color: depth === 0 ? undefined : undefined}}>{n}</span></div>
              <div style={{position: 'absolute', left: 0, right: 0, top: size * 0.68, textAlign: 'center', fontWeight: 600, fontSize: size * 0.085, letterSpacing: 2}}>{lab}</div>
              <div style={{position: 'absolute', left: 40, top: size * 0.74, height: 6, borderRadius: 3, width: (size - 80) * strike, background: C.lime, boxShadow: `0 0 14px ${C.lime}`}} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- F10 sparkle-bullet list card (+F10b strike cascade + payoff) ---------- */
const ITEMS: [string, number][] = [['Billions of dollars', 803], ['A private equity empire', 823], ['A massive team', 887], ['A track record', 897], ['Famous investors', 903], ['A big office', 909]];
const ListCard: React.FC = () => {
  const f = useCurrentFrame();
  const at = 805, out = 952;
  if (f < at - 1 || f > out + 12) return null;
  const s = spr(f, at, {damping: 15});
  return (
    <div style={{position: 'absolute', left: 90, top: 50, width: 560, perspective: 1400, opacity: interpolate(f, [at, at + 4], [0, 1], cl), ...exitStyle(f, out)}}>
      <div style={{transform: `translateX(${-420 * (1 - s)}px) rotateY(${30 * (1 - s) + Math.sin((f - at) / 37) * 2}deg) translateY(${Math.sin((f - at) / 22) * 4}px)`, filter: `blur(${(1 - Math.min(1, s)) * 16}px)`,
        padding: '46px 48px 34px', borderRadius: 10, background: `linear-gradient(180deg,#2457A0 0%,${C.deep} 45%,#0B2350 100%)`,
        boxShadow: '0 30px 60px rgba(0,0,0,.45),inset 0 1px 0 rgba(243,247,255,.25),0 0 0 1px rgba(156,194,255,.18)', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 0%,rgba(243,247,255,.18),transparent 60%)'}} />
        <div style={{position: 'relative', textAlign: 'center', fontWeight: 500, fontSize: 42, lineHeight: 1.1, ...wordIn(f, at + 4)}}>What he didn't have<br />in 1985</div>
        <div style={{position: 'relative', height: 5, borderRadius: 3, margin: '26px auto 40px', width: `${100 * prog(f, at + 8, at + 22)}%`, background: C.lime, boxShadow: `0 0 12px ${C.lime},0 0 30px rgba(230,255,79,.6)`}} />
        <div style={{position: 'relative'}}>
          {ITEMS.map(([t, a], k) => {
            const ia = Math.max(a, at + 10 + k * 3);
            const w = prog(f, ia, ia + 12);
            const st = prog(f, 925 + k * 3, 931 + k * 3);
            return (
              <div key={t} style={{display: 'flex', alignItems: 'center', gap: 20, margin: '0 0 28px', opacity: f >= ia ? 1 : 0,
                WebkitMaskImage: `linear-gradient(90deg,#000 ${w * 100}%,transparent ${w * 100 + 18}%)`}}>
                <Star4 s={34} style={{transform: `rotate(${interpolate(f, [ia, ia + 14], [-90, 0], cl)}deg) scale(${interpolate(f, [ia, ia + 6, ia + 12], [0.3, 1.4, 1], cl)})`}} />
                <span style={{position: 'relative', fontWeight: 500, fontSize: 31, color: st > 0 ? `rgba(243,247,255,${1 - 0.55 * st})` : C.mist, whiteSpace: 'nowrap'}}>
                  {t}<span style={{position: 'absolute', left: -4, top: '52%', height: 3, width: `${st * 104}%`, background: C.lime, boxShadow: `0 0 8px ${C.lime}`}} />
                </span>
              </div>
            );
          })}
          {f >= 938 ? (
            <div style={{display: 'flex', alignItems: 'center', gap: 20, WebkitMaskImage: `linear-gradient(90deg,#000 ${prog(f, 938, 950) * 100}%,transparent ${prog(f, 938, 950) * 100 + 18}%)`}}>
              <Star4 s={40} color={C.lime} />
              <span style={{fontWeight: 700, fontSize: 36, ...HL}}>But he had… ?</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/* ---------- F11 key + curve widget ---------- */
const Key: React.FC = () => {
  const f = useCurrentFrame();
  const at = 955, out = 1012;
  if (f < at - 1 || f > out + 12) return null;
  const s = spr(f, at, {damping: 11});
  const bob = Math.sin((f - at) / 16) * 6;
  return (
    <div style={{position: 'absolute', left: 150, top: 90, width: 520, height: 400, ...exitStyle(f, out)}}>
      <DrawPath d="M190 350 A 230 120 -18 1 1 620 240" a={962} b={978} w={3} color={C.mist} glow="drop-shadow(0 0 6px rgba(243,247,255,.7))" />
      <svg width={520} height={400} viewBox="0 0 520 400" style={{position: 'absolute', inset: 0, overflow: 'visible', transform: `translate(${-120 * (1 - s)}px, ${-200 * (1 - s) + bob}px) scale(${1.5 - 0.5 * s}) rotate(${(1 - s) * -30}deg)`,
        filter: `blur(${(1 - Math.min(1, s)) * 20}px) drop-shadow(0 0 18px rgba(230,255,79,.6))`, opacity: interpolate(f, [at, at + 3], [0, 1], cl)}}>
        <defs><linearGradient id="kk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".45" stopColor={C.lime} /><stop offset="1" stopColor="#5E7A12" /></linearGradient></defs>
        <g transform="translate(150 70) rotate(38)">
          <circle cx={60} cy={60} r={58} fill="url(#kk)" /><circle cx={60} cy={60} r={26} fill="#0C2148" />
          <rect x={110} y={48} width={190} height={24} rx={8} fill="url(#kk)" /><rect x={240} y={70} width={22} height={40} rx={4} fill="url(#kk)" /><rect x={274} y={70} width={22} height={56} rx={4} fill="url(#kk)" />
          <rect x={120} y={50} width={170} height={6} rx={3} fill="rgba(255,255,255,.7)" opacity={0.6 + 0.4 * Math.sin(f / 7)} />
        </g>
      </svg>
      <Sparkles pts={[[100, 90, 12], [440, 300, 9], [60, 330, 7], [480, 60, 10]]} at={966} seed="key" />
    </div>
  );
};
const CURVE: [number, number][] = [[0, 170], [90, 150], [140, 190], [200, 150], [250, 110], [255, 20], [280, 20], [305, 20], [320, 140], [360, 160], [420, 175], [470, 150], [520, 140]];
const CurveCard: React.FC = () => {
  const f = useCurrentFrame();
  const [dx, dy] = bez(CURVE, 0.5 * prog(f, 970, 999, easeInOut));
  return (
    <>
      <Card3D at={958} out={1012} from="right" x={1300} y={90} w={520} h={520} radius={60} style={glassBody}>
        <Meta x={40} y={36}>Updated 1985</Meta>
        <div style={{position: 'absolute', right: 34, top: 26, padding: '8px 18px', borderRadius: 999, background: 'rgba(243,247,255,.1)', fontSize: 18, color: 'rgba(243,247,255,.75)'}}>All time ⌄</div>
        <div style={{position: 'absolute', left: 0, top: 80, width: 520, height: 220}}>
          <svg width={520} height={220} style={{position: 'absolute', overflow: 'visible'}}>
            <defs><linearGradient id="cv" x1="0" x2="1"><stop offset="0" stopColor={C.blue} stopOpacity={0.2} /><stop offset=".5" stopColor={C.lime} /><stop offset="1" stopColor={C.blue} stopOpacity={0.3} /></linearGradient></defs>
            <path d={bezD(CURVE)} pathLength={1} strokeDasharray={`${prog(f, 964, 990, easeInOut)} 2`} fill="none" stroke="url(#cv)" strokeWidth={7} strokeLinecap="round" style={{filter: 'drop-shadow(0 0 8px rgba(230,255,79,.6))'}} />
          </svg>
          {f >= 970 ? <div style={{position: 'absolute', left: dx - 14, top: dy - 14, width: 28, height: 28, borderRadius: '50%', background: '#fff', boxShadow: `0 0 14px ${C.lime},0 0 30px ${C.lime}`}} /> : null}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center'}}>
          <Lab style={{fontSize: 26}}>Value</Lab>
          <div style={bloomIn(f, 999)}><span style={{...BIG_NUM, fontSize: 92}}>Far more</span></div>
          <div style={{fontSize: 18, color: 'rgba(243,247,255,.5)', marginTop: 6, ...wordIn(f, 1004)}}>than money, empire or team</div>
        </div>
      </Card3D>
      <Pulse x={1300 + dx} y={170 + dy} at={999} r={90} />
    </>
  );
};

export const TalkOverlays: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteLayer>
      {between(f, 0, 62) ? <F1 /> : null}
      {between(f, 66, 160) ? <>
        <NeonPill at={70} out={150} x={90} y={250} w={600} h={120} text="Reveal the playbook?" t0={76} t1={112} glowWord="playbook" send={118} />
        <ScriptsTitle word="PLAYBOOK" at={118} out={160} x={1250} y={230} size={118} setL={['the exact', 94]} setR={['that built', 136]} seed="pb" />
      </> : null}
      {between(f, 148, 208) ? <>
        <Balance at={150} out={206} label="Assets under management" value={(ff) => fmtT(rollNum(ff, 160, 196, 400000, 1e12))} delta="▲" ticks={['1985', '1995', '2005', '2015', 'TODAY']} fill={(ff) => 100 * prog(ff, 162, 196, easeInOut)} small />
        <Dollars />
      </> : null}
      {between(f, 228, 282) ? <F4 /> : null}
      {between(f, 393, 452) ? <F5b /> : null}
      {between(f, 448, 562) ? <F6 /> : null}
      {between(f, 500, 606) ? <F7 /> : null}
      {between(f, 616, 668) ? <ScriptsTitle word="SCHWARZMAN" at={635} out={666} x={110} y={220} size={92} setL={['Steve', 624]} setR={['of Blackstone', 655]} seed="sz" /> : null}
      {between(f, 671, 752) ? <F9 /> : null}
      {between(f, 753, 798) ? <Balance at={755} out={796} label="Starting capital" value={() => '$0.00'} delta="−100%" ticks={['CASH', 'FUNDS', 'TEAM', 'BRAND', 'DEALS']}
        fill={(ff) => 2 + 1.5 * Math.sin(ff / 5)} chip={['✕ billions', 772]} /> : null}
      {between(f, 766, 952) ? <Deck /> : null}
      {between(f, 805, 952) ? <ListCard /> : null}
      {between(f, 955, 1012) ? <><Key /><CurveCard /></> : null}
    </AbsoluteLayer>
  );
};
const AbsoluteLayer: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{position: 'absolute', inset: 0, zIndex: 20}}>{children}</div>;
