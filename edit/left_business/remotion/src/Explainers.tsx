// Full-screen explainer scenes (ink world + widgets in the reference look) and the transitions in/out.
import React from 'react';
import {interpolate, OffthreadVideo, random, staticFile, useCurrentFrame} from 'remotion';
import {C} from './theme';
import {BigNum, cl, Corner, DrawPath, easeInOut, OutlinePill, pop, prog, ScriptPixels, Widget} from './fx';

/** Ink world: navy radial base, two drifting light pools, masked 72 px grid, particles drifting up. */
export const World: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const t = f - at;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: 'radial-gradient(90% 60% at 50% 45%,#121A4A 0%,#070A1F 70%,#03040C 100%)'}}>
      <div style={{position: 'absolute', left: -200 + Math.sin(t / 40) * 60, top: 260, width: 780, height: 780, borderRadius: '50%', background: 'rgba(101,126,252,.38)', filter: 'blur(100px)'}} />
      <div style={{position: 'absolute', right: -240 + Math.cos(t / 46) * 60, top: 860, width: 820, height: 820, borderRadius: '50%', background: 'rgba(147,93,249,.32)', filter: 'blur(110px)'}} />
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(143,176,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(143,176,255,.07) 1px,transparent 1px)',
        backgroundSize: '72px 72px', backgroundPosition: `0 ${-t * 0.6}px`, WebkitMaskImage: 'radial-gradient(60% 45% at 50% 45%,#000 30%,transparent 100%)'}} />
      {Array.from({length: 36}).map((_, i) => {
        const z = 3 + Math.floor(random(`p${i}`) * 4);
        const y = ((random(`y${i}`) * 1920 - t * (0.6 + random(`v${i}`) * 1.4)) % 1920 + 1920) % 1920;
        return <div key={i} style={{position: 'absolute', left: random(`x${i}`) * 1080, top: y, width: z, height: z, borderRadius: '50%', background: C.sky,
          boxShadow: `0 0 8px ${C.sky}`, opacity: 0.25 + random(`o${i}`) * 0.5}} />;
      })}
    </div>
  );
};

/** Light-beam sweep: the scene is revealed through a cone of light from a ring pivot near the top-left (20 f). */
export const BeamReveal: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 20, easeInOut);
  const px = 160, py = 120, Rr = 4200;
  const a0 = (70 - 115 * p) * (Math.PI / 180), a1 = (70 + 115 * p) * (Math.PI / 180);
  const pt = (a: number) => `${px + Rr * Math.cos(a)}px ${py + Rr * Math.sin(a)}px`;
  const mids = Array.from({length: 9}, (_, i) => pt(a0 + ((a1 - a0) * i) / 8)).join(',');
  const clip = p >= 1 ? 'none' : `polygon(${px}px ${py}px, ${mids})`;
  const edge = (a: number) => <line x1={px} y1={py} x2={px + Rr * Math.cos(a)} y2={py + Rr * Math.sin(a)} stroke="#EAF0FF" strokeWidth={6} opacity={0.85 * (1 - p)}
    style={{filter: `blur(3px) drop-shadow(0 0 16px ${C.blue})`}} />;
  const flash = interpolate(f, [at, at + 2, at + 7], [0, 0.5, 0], cl);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, clipPath: clip}}>{children}</div>
      {p < 1 && f >= at ? (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {edge(a0)}{edge(a1)}
          <circle cx={px} cy={py} r={22} fill="none" stroke="#EAF0FF" strokeWidth={4} opacity={1 - p} />
        </svg>
      ) : null}
      <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash, pointerEvents: 'none'}} />
    </>
  );
};

/** White flash + overexposed fade for cuts back to the speaker. */
export const FlashCut: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 2, at + 8], [0.7, 0.45, 0], cl);
  if (f < at || o <= 0) return null;
  return <div style={{position: 'absolute', inset: 0, background: '#F4F6FF', opacity: o, pointerEvents: 'none'}} />;
};

// A — burnout: PiP of the speaker, low-battery alert, energy-level wave widget draining to 4 %
export const ExplainA: React.FC = () => {
  const f = useCurrentFrame();
  const lvl = interpolate(f, [182, 224], [0.72, 0.04], {...cl, easing: easeInOut});
  const pct = Math.round(lvl * 100);
  const wave = (amp: number, ph: number, yy: number) => {
    let d = `M 0 ${yy}`;
    for (let x = 0; x <= 700; x += 20) d += ` L ${x} ${yy + Math.sin(x / 70 + ph) * amp}`;
    return d + ' L 700 760 L 0 760 Z';
  };
  const waterY = 760 - 560 * lvl;
  const pip = pop(f, 176, 12);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <World at={168} />
      {/* PiP: the live cut-out of the speaker, desaturated, centred in a gradient ring */}
      <div style={{position: 'absolute', left: 70, top: 120, width: 230, height: 230, borderRadius: '50%', padding: 6, ...pip,
        background: 'linear-gradient(135deg,#657EFC,#935DF9,#D35BC5)', boxShadow: '0 0 30px rgba(147,93,249,.7)'}}>
        <div style={{position: 'relative', width: 218, height: 218, borderRadius: '50%', overflow: 'hidden', background: 'radial-gradient(circle at 50% 40%,#1A1E5C,#070A1F 75%)'}}>
          <OffthreadVideo src={staticFile('speaker_cutout.webm')} transparent muted
            style={{position: 'absolute', left: -54, top: -84, width: 346, height: 614, filter: 'saturate(.25) brightness(.9) contrast(1.08)'}} />
        </div>
      </div>
      {/* low-battery alert (system-update card look) */}
      <Widget x={330} y={150} w={690} h={124} at={186} radius={40} grid={false}>
        <div style={{position: 'absolute', left: 26, top: 28, width: 68, height: 68, borderRadius: 20, background: C.magenta, boxShadow: `0 0 20px ${C.magenta}`,
          font: "900 46px 'Inter'", color: '#fff', textAlign: 'center', lineHeight: '68px'}}>!</div>
        <div style={{position: 'absolute', left: 116, top: 26, fontSize: 32, fontWeight: 600}}>Battery critically low</div>
        <div style={{position: 'absolute', left: 116, top: 70, fontSize: 22, color: C.grey}}>{pct}% · no charge since you started</div>
      </Widget>
      {/* energy level (wave widget look) */}
      <Widget x={190} y={400} w={700} h={760} at={180} radius={110} grid={false} enter="drop">
        <svg width={700} height={760} style={{position: 'absolute', inset: 0}}>
          <defs><linearGradient id="wv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8FB0FF" /><stop offset=".4" stopColor="#657EFC" /><stop offset="1" stopColor="#2A2F9C" /></linearGradient></defs>
          <path d={wave(18, f / 9, waterY)} fill="url(#wv)" opacity={0.95} />
          <path d={wave(14, f / 7 + 2, waterY + 16)} fill="#3D4BC0" opacity={0.55} />
        </svg>
        <div style={{position: 'absolute', left: 50, top: 54, fontSize: 46, fontWeight: 600, letterSpacing: -1.5}}>Energy lvl</div>
        <div style={{position: 'absolute', left: 50, top: 112, fontSize: 24, color: C.grey}}>since 2023</div>
        <div style={{position: 'absolute', right: 50, top: 62, fontSize: 24, color: C.grey}}>Mon 11:48 PM</div>
        <div style={{position: 'absolute', left: 50, top: 230}}>
          <BigNum size={230} weight={500} style={{filter: pct <= 5 ? `drop-shadow(0 0 26px ${C.magenta})` : undefined}}>{pct}%</BigNum>
        </div>
        <div style={{position: 'absolute', right: 50, bottom: 50, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.18)',
          border: '1.5px solid rgba(255,255,255,.45)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 300, color: '#fff'}}>+</div>
      </Widget>
      <ScriptPixels at={224} x={190} y={400} w={700} h={760} seed="bat" size={34} anchors={[[-0.08, -0.06], [1.0, 0.95]]} />
    </div>
  );
};

// B — notifications pile up (system-update card look); the newest lands on top and older ones recede
export const ExplainB: React.FC = () => {
  const f = useCurrentFrame();
  const items: [string, string, string, string, number][] = [
    ['M', 'Mom', 'Missed FaceTime · “call me back”', '5h', 437],
    ['F', 'Family group', '12 new messages', '1h', 451],
    ['B', 'The boys', '“you coming out tonight?”', 'now', 467],
  ];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <World at={429} />
      {f >= 431 ? <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', ...pop(f, 431)}}>
        <OutlinePill dot={C.magenta}>Do not disturb · client work</OutlinePill></div> : null}
      {items.map(([ini, who, msg, t, at], i) => {
        const newer = items.filter((x) => x[4] <= f && x[4] > at).length;
        const y = 420 + newer * 0 + i * 0; // stack position from age
        const slot = items.filter((x) => x[4] <= f).length - 1 - i;
        if (f < at - 1) return null;
        const sl = prog(f, at, at + 12);
        return (
          <Widget key={who} x={110} y={y + 190 * Math.max(0, slot) + 60 * (1 - sl)} w={860} h={160} at={at} radius={48} grid={false}
            style={{opacity: 1 - 0.18 * newer, transform: `scale(${1 - 0.04 * newer})`}}>
            <div style={{position: 'absolute', left: 30, top: 34, width: 92, height: 92, borderRadius: '50%', background: 'linear-gradient(135deg,#7FD4FF,#657EFC 50%,#935DF9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', font: "700 40px 'Inter'", color: C.ink}}>{ini}</div>
            <div style={{position: 'absolute', left: 150, top: 36, fontSize: 36, fontWeight: 600}}>{who}</div>
            <div style={{position: 'absolute', left: 150, top: 88, fontSize: 28, color: 'rgba(214,222,255,.7)'}}>{msg}</div>
            <div style={{position: 'absolute', right: 34, top: 40, fontSize: 22, color: C.grey}}>{t}</div>
          </Widget>
        );
      })}
      {f >= 471 ? <div style={{position: 'absolute', left: 900, top: 380, width: 92, height: 92, borderRadius: '50%', background: C.magenta, boxShadow: `0 0 28px ${C.magenta}`,
        font: "800 40px 'Inter'", color: '#fff', textAlign: 'center', lineHeight: '92px', ...pop(f, 471)}}>47</div> : null}
    </div>
  );
};

// C — audience: big chart card (Conversion-card look), line draws, glowing dot rides to the peak, order chips pop around it
export const ExplainC: React.FC = () => {
  const f = useCurrentFrame();
  const d = 'M 30 330 C 140 326, 200 300, 260 250 C 320 200, 330 80, 400 80 C 470 80, 480 220, 540 260 C 580 284, 620 290, 670 292';
  const ride = prog(f, 834, 852, easeInOut);
  const chips: [number, number, number][] = [[70, 330, 840], [640, 1250, 846], [90, 1290, 852]];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <World at={826} />
      <Widget x={180} y={420} w={720} h={800} at={830} radius={110} enter="drop">
        <Corner l="Data updated 2h ago" r="" top={48} pad={52} size={24} />
        <div style={{position: 'absolute', right: 46, top: 36}}><OutlinePill>Monthly ⌄</OutlinePill></div>
        <DrawPath d={d} a={834} b={852} w={6} color={C.sky} box={[720, 420]} style={{top: 110}} />
        {f >= 834 ? <div style={{position: 'absolute', left: 400 - 18, top: 110 + 80 - 18, width: 36, height: 36, borderRadius: '50%', background: '#EAF0FF',
          boxShadow: `0 0 0 8px rgba(143,176,255,.25),0 0 30px ${C.sky},0 0 60px ${C.blue}`, transform: `scale(${ride})`}} /> : null}
        <div style={{position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', fontSize: 34, color: 'rgba(230,236,255,.85)'}}>Your audience</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 548, display: 'flex', justifyContent: 'center'}}><BigNum size={170}>$27</BigNum></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 728, textAlign: 'center', fontSize: 22, color: C.grey}}>per download · low-ticket</div>
      </Widget>
      {chips.map(([x, y, at]) => (f >= at ? (
        <div key={at} style={{position: 'absolute', left: x, top: y, ...pop(f, at)}}>
          <OutlinePill dot="#7FD4FF" style={{background: 'rgba(7,10,31,.85)', fontSize: 24}}>New order · <b style={{color: '#fff'}}>+$27</b></OutlinePill>
        </div>
      ) : null))}
    </div>
  );
};
