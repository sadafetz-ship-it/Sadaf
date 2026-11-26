// The 19 scenes of the Einstein short. Each scene receives `g` = its global start (s) for handheld drift.
import React from 'react';
import { AbsoluteFill, Img, random, useCurrentFrame } from 'remotion';
import { EuropeMap } from './map';
import { ARC, Card, Cam, Concept, Credit, Cut, Draw, E, ELLIPSE, F, LIME, LightLeak, LowerThird, Note, P, Pin, RED, Reveal, SCRIBBLE, Tape, WindowShadow, Words, YEL, cl, dolly, img, typed, useT, useWeave } from './lib';

type S = { g: number };
const serif: React.CSSProperties = { fontFamily: '"Bodoni Moda"', fontStyle: 'italic', color: '#fff', textShadow: '0 0 18px rgba(255,255,255,.45),0 2px 10px rgba(0,0,0,.5)', letterSpacing: -1, lineHeight: 0.95, whiteSpace: 'nowrap' };
const serifD: React.CSSProperties = { fontFamily: '"Bodoni Moda"', fontStyle: 'italic', color: '#222', letterSpacing: -1, lineHeight: 0.95, whiteSpace: 'nowrap' };
const pop: React.CSSProperties = { fontFamily: 'Poppins', fontWeight: 800, color: '#fff', letterSpacing: -2, lineHeight: 0.9, whiteSpace: 'nowrap',
  textShadow: '1px 1px 0 #cfcfcf,2px 2px 0 #b9b9b9,3px 3px 0 #a3a3a3,4px 4px 0 #8d8d8d,5px 5px 0 #777,6px 6px 0 #616161,8px 10px 18px rgba(0,0,0,.6),0 0 30px rgba(255,255,255,.55)' };
const abs = (s: React.CSSProperties): React.CSSProperties => ({ position: 'absolute', ...s });
const cream = <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 45% 40%,#f3efe7,#d9d3c7 80%)' }} />;
const greyWall = <AbsoluteFill style={{ background: 'linear-gradient(115deg,#9d9d9b,#d6d5d1 45%,#a9a8a4)' }} />;
const greyDesk = <AbsoluteFill style={{ background: 'linear-gradient(135deg,#e9e9e7,#cfcfcc)' }} />;
const darkRoom = <AbsoluteFill style={{ background: 'linear-gradient(#2b2826,#1a1817 60%,#0d0c0b)' }} />;
const black = <AbsoluteFill style={{ background: 'radial-gradient(#1c1b1a,#060606)' }} />;
const Linen = () => (<><AbsoluteFill style={{ background: '#cdbfa8' }} /><svg width="1920" height="1080" style={{ position: 'absolute', opacity: 0.35, mixBlendMode: 'multiply' }}><filter id="ln"><feTurbulence type="fractalNoise" baseFrequency=".9 .02" numOctaves={2} /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#ln)" /></svg></>);
const Wood = () => (<svg width="1920" height="1080" style={{ position: 'absolute' }}><filter id="wf"><feTurbulence type="fractalNoise" baseFrequency=".0025 .09" numOctaves={4} seed={7} /><feColorMatrix values="0 0 0 0 .36  0 0 0 0 .21  0 0 0 0 .12  0 0 0 -1.6 1.25" /></filter><rect width="100%" height="100%" fill="#6e4426" /><rect width="100%" height="100%" filter="url(#wf)" /></svg>);
const rack = (t: number, max = 10) => (1 - P(t, 0, 6 * F)) * max;
const LOREM = 'The observations made during the eclipse of May 29 at Sobral and Principe confirm the deflection of light predicted by the new theory. '.repeat(14);

// S1 0.0–1.3  "In 1902" letter typing (Ref 3) over a vintage map: route Ulm → Zürich → Bern, zoom into Bern
export const S1: React.FC<S> = ({ g }) => { const t = useT(); return (
  <AbsoluteFill><Cam gt={g + t}><EuropeMap t={t} />
    <div style={abs({ left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: '"Bodoni Moda"', color: '#2a2218', opacity: 1 - P(t, 0.95, 1.25) })}>
      <span style={{ fontSize: 70 }}>{typed('In', t, 0)}</span><span style={{ fontSize: 230, letterSpacing: -6 }}>{typed('1902', t, 0.13)}</span></div>
  </Cam></AbsoluteFill>); };

// S2 1.3–3.3  Gold frame on grey wall, museum caption, push through the frame (Ref 1)
export const S2: React.FC<S> = ({ g }) => { const t = useT(); const wv = useWeave(); const p = P(t, 1.2, 2.0);
  return (<AbsoluteFill><Cam gt={g + t} s={1 + 0.08 * E.io(P(t, 0, 1.2)) + E.i3(p) * 3.4} origin="960px 420px" blur={Math.sin(p * Math.PI) * 5}>
    {greyWall}<WindowShadow t={t} o={0.3} />
    <div style={abs({ left: 690, top: 90, width: 540, height: 660, padding: 34, background: 'linear-gradient(135deg,#7a5a1c,#e8c66a 25%,#9a7428 45%,#f2d98a 65%,#6d4f15)', boxShadow: '0 30px 60px rgba(0,0,0,.5),inset 0 0 0 6px rgba(60,40,10,.6)' })}>
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}><Img src={img('young.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'grayscale(1) contrast(1.1)', ...wv }} /></div></div>
    <Reveal t={t} t0={0.15} style={abs({ left: 0, right: 0, top: 790, textAlign: 'center' })}><div style={{ ...serifD, fontSize: 84 }}>Albert Einstein</div><div style={{ ...serifD, fontSize: 44, marginTop: 12 }}>in 1902</div></Reveal>
    <Reveal t={t} t0={0.45} style={abs({ left: 1290, top: 560, width: 300, padding: '14px 18px', background: '#f1ece0', boxShadow: '0 6px 14px rgba(0,0,0,.25)', font: '400 18px/1.4 "Special Elite"', color: '#333' })}>
      ALBERT EINSTEIN<br />Bern, c. 1904<br /><span style={{ opacity: 0.6 }}>Gelatin silver print<br />ETH-Bibliothek Zürich</span></Reveal>
  </Cam><LightLeak t={t} t0={1.55} dur={0.6} /></AbsoluteFill>); };

// S3 3.3–6.1  Bern street, caption swaps every 0.4–0.6 s, "rejected" label drops on strings (Ref 1 + Ref 4)
export const S3: React.FC<S> = ({ g }) => { const t = useT(); const cap = ([[0, 'couldn’t get'], [0.55, 'a job'], [0.95, 'at any'], [1.35, 'university.']] as [number, string][]).filter((a) => t >= a[0]).pop();
  const d = P(t, 1.9, 1.9 + 10 * F), k = t - 2.23;
  return (<AbsoluteFill><Cam gt={g + t} blur={rack(t)}>
    <Img src={img('bern.jpg')} style={abs({ inset: 0, width: 1920, height: 1080, objectFit: 'cover', objectPosition: 'center 40%', filter: 'grayscale(1) contrast(1.15) brightness(.7) blur(1.5px)', transform: `scale(${1 + 0.05 * t / 2.8})` })} />
    <AbsoluteFill style={{ background: 'linear-gradient(transparent 40%,rgba(0,0,0,.55))' }} />
    <Cut src="young_cut.png" style={{ left: 520, top: 60, height: 1040, ...dolly(t, 2.8) }} />
    <div style={abs({ ...serif, left: 0, right: 0, top: 760, textAlign: 'center', fontSize: 130 })}>{cap?.[1]}</div>
    <div style={abs({ left: 180, top: -30, width: 520, transformOrigin: '50% 0', opacity: t < 1.9 ? 0 : 1, transform: `translateY(${(1 - E.back(d)) * -420}px) rotate(${k > 0 ? 8 * Math.exp(-4 * k) * Math.sin(12 * k) : 0}deg)` })}>
      <svg width="520" height="300" style={{ position: 'absolute' }}><line x1="60" y1="0" x2="150" y2="300" stroke={RED} strokeWidth="5" /><line x1="460" y1="0" x2="370" y2="300" stroke={RED} strokeWidth="5" /></svg>
      <div style={abs({ left: 40, top: 290, background: '#4a2a1f', padding: '10px 34px 18px', boxShadow: '0 12px 30px rgba(0,0,0,.5)', font: '800 110px/1 Poppins', letterSpacing: -3, color: '#e8d8b0', whiteSpace: 'nowrap', minWidth: 120, minHeight: 128 })}>{typed('rejected', t, 1.95, 1.5)}</div></div>
    <LowerThird t={t} t0={0.25} title="BERN, SWITZERLAND" sub="1902" dur={1.5} />
  </Cam><Credit text="Kramgasse, Bern, 1890s · Rijksmuseum" /></AbsoluteFill>); };

// S4 6.1–8.4  Word stack → slides out → "patent office" + yellow underline (Ref 1 "of the end.")
export const S4: React.FC<S> = ({ g }) => { const t = useT(); const o = E.o3(P(t, 1.4, 1.4 + 6 * F)), dk = P(t, 1.4, 1.7);
  return (<AbsoluteFill><Cam gt={g + t} blur={rack(t, 12)}>
    <Img src={img('bern.jpg')} style={abs({ inset: 0, width: 1920, height: 1080, objectFit: 'cover', objectPosition: 'center 60%', filter: `grayscale(1) contrast(1.1) brightness(${0.6 - 0.25 * dk}) blur(2px)`, transform: `scale(${1 + 0.05 * t / 2.3})` })} />
    <Cut src="sch_cut.png" style={{ left: 980, top: 40, height: 1060, ...dolly(t, 2.3) }} />
    <div style={abs({ left: 150, top: 170, transform: `translate(${-260 * o}px,${-90 * o}px)`, filter: `blur(${o * 10}px)`, opacity: 1 - 0.6 * o })}>
      <Words t={t} blurF={3} style={{ ...serif, fontSize: 150, lineHeight: 1 }} items={[[0.15, 'So'], [0.32, 'he'], [0.48, 'took'], [0.62, '\n'], [0.62, 'a'], [0.78, 'job'], [0.95, 'at'], [1.08, 'a']]} /></div>
    <Reveal t={t} t0={1.45} f={4} style={abs({ ...serif, left: 120, top: 540, fontSize: 230 })}>patent office</Reveal>
    <div style={abs({ left: 130, top: 800, height: 8, width: 1050 * E.o3(P(t, 1.6, 1.6 + 10 * F)), background: YEL, borderRadius: 4, boxShadow: `0 0 12px ${YEL}` })} />
    <Note t={t} t0={1.75} text="Eidgenössisches Amt für geistiges Eigentum" style={{ left: 140, top: 830, fontSize: 34, color: 'rgba(255,255,255,.75)' }} />
  </Cam></AbsoluteFill>); };

// S5 8.4–10.5  Yellow tape unfolds + typed German title + "third class" pop on the spoken word (Ref 1 "Three years later")
export const S5: React.FC<S> = ({ g }) => { const t = useT(); const wv = useWeave(); const u = E.back(P(t, 0.17, 0.17 + 4 * F)), k = P(t, 1.05, 1.05 + 3 * F);
  return (<AbsoluteFill><Cam gt={g + t} s={1.02 + 0.05 * t / 2.1} x={t > 2.0 ? -400 * P(t, 2.0, 2.1) : 0} blur={rack(t) + (t > 2.0 ? 8 : 0)}>
    <Img src={img('young.jpg')} style={abs({ inset: 0, width: 1920, height: 1080, objectFit: 'cover', objectPosition: 'center 25%', filter: 'grayscale(1) contrast(1.1) brightness(.75)', ...wv })} />
    <div style={abs({ left: 560, top: 590, transformOrigin: '0 50%', opacity: t < 0.17 ? 0 : 1, transform: `rotate(-5deg) scale(${0.2 + 0.8 * u},${0.5 + 0.5 * u})` })}>
      <div style={{ background: YEL, padding: '4px 26px 12px', clipPath: 'polygon(0 8%,4% 0,30% 5%,60% 0,100% 6%,97% 50%,100% 94%,70% 100%,35% 95%,3% 100%,0 60%)', boxShadow: '0 8px 20px rgba(0,0,0,.4)', minWidth: 200, height: 100 }}>
        <Words t={t} blurF={2} style={{ font: 'italic 400 70px "Bodoni Moda"', color: '#1a1a1a', whiteSpace: 'nowrap' }} items={[[0.2, 'Technical'], [0.5, 'expert,']]} /></div></div>
    <div style={abs({ ...serif, left: 640, top: 690, fontSize: 190, opacity: t < 1.05 ? 0 : 1, transform: `rotate(-5deg) scale(${1.25 - 0.25 * E.o3(k)})` })}>third class</div>
    <div style={abs({ left: 660, top: 920, transform: 'rotate(-5deg)', font: '400 30px "Special Elite"', color: 'rgba(255,255,255,.8)', textShadow: '0 1px 6px rgba(0,0,0,.8)' })}>{typed('„Technischer Experte III. Klasse“ — 23. Juni 1902', t, 1.25, 1)}</div>
  </Cam><Credit text="Photo: ETH-Bibliothek Zürich" /></AbsoluteFill>); };

// S6 10.5–11.8  Light streaks → "What happened next." (Ref 1 Netflix transition / "What changed.")
export const S6: React.FC<S> = ({ g }) => { const t = useT(); const p = P(t, 0, 0.5), w = 60 + 1860 * E.i3(p);
  if (t < 0.5) return (<AbsoluteFill style={{ background: '#050505' }}>
    <div style={abs({ top: 0, height: 1080, left: 960 - w / 2 + Math.sin(t * 40) * 20, width: w, filter: `blur(${1.5 + p * 3}px)`, background: 'repeating-linear-gradient(90deg,#7a0a0a 0 18px,#d8231c 18px 30px,#ff8a2a 30px 36px,#b5120f 36px 58px,#3a4fd8 58px 64px,#ffcf6a 64px 67px,#8a1f6a 67px 80px,#5a0505 80px 96px)' })} /></AbsoluteFill>);
  return (<AbsoluteFill><Cam gt={g + t}>{greyWall}<AbsoluteFill style={{ background: 'rgba(235,235,232,.55)' }} /><WindowShadow t={t} o={0.18} />
    <Reveal t={t} t0={0.5} max={16} style={abs({ ...serifD, left: 0, right: 0, top: 500, textAlign: 'center', fontSize: 72 })}>What happened next.</Reveal></Cam></AbsoluteFill>); };

// S7 11.8–14.5  Desk lamp flickers on, dust motes in the beam, "spare time" label swings in (Ref 4)
export const S7: React.FC<S> = ({ g }) => { const t = useT(); const on = (t > 0.1 && t < 0.17) || t > 0.23; const p = E.back(P(t, 1.0, 1.0 + 15 * F));
  const motes = Array.from({ length: 34 }, (_, i) => { const r = (n: string) => random(`m${i}${n}`); const x = 420 + r('x') * 760 + Math.sin(t * (0.6 + r('a')) + i) * 30; const y = 260 + ((r('y') * 640 + t * (10 + r('v') * 25)) % 640); return { x, y, s: 2 + r('s') * 4, o: 0.2 + r('o') * 0.5 }; });
  return (<AbsoluteFill><Cam gt={g + t} s={1 + 0.03 * t / 2.7}>{darkRoom}
    <div style={abs({ left: 330, top: 150, width: 1100, height: 900, opacity: on ? 1 : 0, clipPath: 'polygon(18% 0,32% 0,100% 100%,0 100%)', background: 'radial-gradient(ellipse at 25% 0%,rgba(255,240,190,.38),rgba(255,240,190,.08) 70%)', filter: 'blur(10px)' })} />
    {on && motes.map((m, i) => <div key={i} style={abs({ left: m.x, top: m.y, width: m.s, height: m.s, borderRadius: '50%', background: '#fff6d8', opacity: m.o, filter: 'blur(.6px)' })} />)}
    <Cut src="young_cut.png" style={{ left: 820, top: 230, height: 640, ...dolly(t, 2.7, 0.12) }} />
    <div style={abs({ left: 0, right: 0, top: 770, height: 310, background: 'linear-gradient(#4a3322,#24180f)' })} />
    <div style={abs({ left: 860, top: 800, width: 300, height: 200, background: '#e6dcc4', transform: 'perspective(600px) rotateX(55deg) rotate(-6deg)' })} />
    <div style={abs({ left: 1000, top: 810, width: 300, height: 200, background: '#efe7d3', transform: 'perspective(600px) rotateX(55deg) rotate(8deg)' })} />
    <div style={abs({ left: 470, top: 60, width: 12, height: 110, background: '#222' })} />
    <div style={abs({ left: 360, top: 140, width: 240, height: 110, background: 'linear-gradient(#41543f,#1e2a1d)', clipPath: 'polygon(30% 0,70% 0,100% 100%,0 100%)' })} />
    <div style={abs({ left: 400, top: 238, width: 160, height: 16, borderRadius: '50%', background: '#fff6d0', opacity: on ? 1 : 0.15, boxShadow: '0 0 40px 12px rgba(255,240,190,.6)' })} />
    <Reveal t={t} t0={0.5} f={4} style={abs({ ...serif, left: 150, top: 470, fontSize: 96 })}>in his</Reveal>
    <div style={abs({ left: 140, top: 570, opacity: t < 1 ? 0 : 1, transform: `translate(${(1 - p) * -380}px,${(1 - p) * 420}px) rotate(${-25 + 21 * p}deg)` })}>
      <div style={{ background: '#7a1a22', padding: '0 28px 10px', clipPath: 'polygon(1% 6%,20% 0,48% 4%,75% 0,99% 5%,100% 40%,98% 96%,70% 100%,40% 96%,12% 100%,0 92%,2% 45%)', font: 'italic 400 110px "Bodoni Moda"', color: '#f0e6d6', whiteSpace: 'nowrap' }}>spare time</div></div>
    <LowerThird t={t} t0={1.3} title="BERN · KRAMGASSE 49" sub="his flat, 1903–1905" dur={1.2} />
  </Cam></AbsoluteFill>); };

// S8 14.5–15.3  Year counter with glowing dot + spotlight (Ref 4 "day 7 … day 1")
export const S8: React.FC<S> = ({ g }) => { const t = useT(); const w = E.o3(P(t, 0, 5 * F)); const step = Math.min(3, Math.max(0, (t - 0.2) / (4 * F)));
  return (<AbsoluteFill><Cam gt={g + t} y={(1 - w) * 300} blur={(1 - w) * 12}><Linen />
    {['1902', '1903', '1904', '1905'].map((y, i) => <div key={y} style={abs({ left: 890, top: 170 + i * 200, width: 140, height: 140, borderRadius: '50%', background: 'rgba(150,120,100,.35)', textAlign: 'center', font: 'italic 400 44px/140px "Bodoni Moda"', color: '#5a4a3a' })}>{y}</div>)}
    <div style={abs({ left: 905, top: 185 + 600 * E.io(step / 3), width: 110, height: 110, borderRadius: '50%', background: `radial-gradient(#fff3a0,${YEL} 60%,rgba(233,201,59,0) 72%)`, mixBlendMode: 'multiply' })} />
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%,transparent 32%,rgba(20,15,10,.85) 52%)' }} /></Cam></AbsoluteFill>); };

// S9 15.3–18.2  Four papers fly onto a grey desk, tape, red scribble, lime "in 1905", handwritten dates (Ref 1 + Ref 2)
const PAPERS = [{ x: 330, y: 300, r: -8, tag: 'Mar · light' }, { x: 650, y: 250, r: 3, tag: 'May · atoms' }, { x: 970, y: 320, r: 9, tag: 'Jun · relativity' }, { x: 1290, y: 270, r: -4, tag: 'Sep · E=mc²' }];
export const S9: React.FC<S> = ({ g }) => { const t = useT(); const lb = E.o3(P(t, 0.9, 0.9 + 6 * F));
  return (<AbsoluteFill><Cam gt={g + t} s={1 + 0.05 * t / 2.9} r={-2 + 2 * t / 2.9}>{greyDesk}
    {PAPERS.map((pp, i) => { const t0 = i * 4 * F, q = E.back(P(t, t0, t0 + 8 * F)), m = 1 - P(t, t0, t0 + 8 * F);
      return <React.Fragment key={i}>
        <Card src="annalen.jpg" x={pp.x} y={pp.y} w={300} h={420} r={pp.r} style={{ transform: `translate(${(1 - q) * -900}px,${(1 - q) * -700}px) rotate(${pp.r + (1 - q) * 25}deg)`, filter: `blur(${m * 10}px)`, opacity: t < t0 ? 0 : 1 }} />
        <Tape x={pp.x + 80} y={pp.y - 20} r={pp.r * 2} show={t > t0 + 10 * F} />
        <Note t={t} t0={1.6 + i * 0.18} text={pp.tag} style={{ left: pp.x + 30, top: pp.y + 450, transform: `rotate(${pp.r / 2}deg)`, fontSize: 38 }} /></React.Fragment>; })}
    <Draw d={SCRIBBLE} vb="0 0 100 100" t={t} t0={1.1} f={24} color="#d0121c" width={12} style={{ left: 600, top: 190, width: 420, height: 600 }} />
    <WindowShadow t={t} o={0.42} />
    <Words t={t} style={{ ...serifD, position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', fontSize: 140, color: '#1c1c1c' }} items={[[0.5, 'Four'], [0.72, 'papers']]} />
    <div style={abs({ left: 1440, top: 860, transform: 'rotate(-6deg)', opacity: lb > 0.001 ? 1 : 0 })}><div style={{ background: LIME, padding: '6px 26px 12px', font: 'italic 400 64px "Bodoni Moda"', color: '#1a1a1a', whiteSpace: 'nowrap', height: 96, minWidth: 60, transform: `scaleX(${lb})`, transformOrigin: '0 50%' }}>{typed('in 1905', t, 1.12)}</div></div>
  </Cam><Credit text="Annalen der Physik, vol. 17, 1905" dark /></AbsoluteFill>); };

// S10 18.2–19.6  "light": yellow box wipe + typing over an 1883 bulb (Ref 3 "burgers")
export const S10: React.FC<S> = ({ g }) => { const t = useT(); const q = E.o3(P(t, 1.05, 1.05 + 5 * F)); const fl = 0.85 + 0.15 * random(`b${Math.floor(t * 30)}`);
  return (<AbsoluteFill><Cam gt={g + t} s={1 + 0.04 * t / 1.4}>{black}
    <div style={abs({ left: 760, top: 300, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(rgba(255,235,170,.35),transparent 65%)', opacity: fl })} />
    <Img src={img('bulb_cut.png')} style={abs({ left: 780, top: 330, height: 700, transform: `scale(${0.92 + 0.08 * E.o3(P(t, 0, 0.3))})`, filter: `grayscale(1) contrast(1.1) drop-shadow(4px 0 0 ${YEL}) drop-shadow(-4px 0 0 ${YEL}) drop-shadow(0 4px 0 ${YEL}) drop-shadow(0 -4px 0 ${YEL})` })} />
    <div style={abs({ ...serif, left: 0, right: 0, top: 250, textAlign: 'center', fontSize: 64 })}>{typed('One explained', t, 0.05, 1)}</div>
    <div style={abs({ left: 560, top: 450, width: 800, height: 190, background: YEL, transformOrigin: '0 50%', transform: `scaleX(${q})`, opacity: q > 0.001 ? 1 : 0 })} />
    <div style={abs({ left: 0, right: 0, top: 430, textAlign: 'center', font: '800 200px/1 Poppins', color: '#fff', letterSpacing: -6, textShadow: '0 0 30px rgba(255,255,255,.5)' })}>{typed('light', t, 1.15)}</div>
    <Concept t={t} t0={1.4} text="THE PHOTOELECTRIC EFFECT" style={{ left: 110, top: 940 }} />
  </Cam><Credit text="Lewis Latimer lamp, 1883 · Museum of Science and Industry" /></AbsoluteFill>); };

// S11 19.6–21.3  Magnifier over the 1905 page, jiggling particles, "atoms" with red brush wipe (Ref 4)
export const S11: React.FC<S> = ({ g }) => { const t = useT(); const m = E.o3(P(t, 0.05, 0.05 + 10 * F)), b = E.o3(P(t, 0.75, 0.75 + 9 * F));
  return (<AbsoluteFill><Cam gt={g + t} s={1 + 0.04 * t / 1.7}><Linen /><Card src="annalen.jpg" x={640} y={90} w={520} h={760} r={-4} />
    <div style={abs({ left: 700, top: 200, width: 620, height: 760, transform: `translateX(${(1 - m) * 1100}px)` })}>
      <div style={abs({ left: 0, top: 0, width: 520, height: 520, borderRadius: '50%', overflow: 'hidden', border: '22px solid #2a2a2a', boxShadow: '0 30px 60px rgba(0,0,0,.5)' })}>
        <AbsoluteFill style={{ background: '#c9a96a' }} />
        {Array.from({ length: 40 }, (_, i) => <div key={i} style={abs({ left: (i * 97) % 460, top: (i * 151) % 460, width: 18 + (i % 4) * 10, height: 18 + (i % 4) * 10, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%,#fff,#8a7350)', boxShadow: '2px 3px 4px rgba(0,0,0,.35)', transform: `translate(${Math.sin(t * 37 + i) * 3}px,${Math.cos(t * 41 + i * 2) * 3}px)` })} />)}
        <AbsoluteFill style={{ background: 'radial-gradient(circle at 30% 25%,rgba(255,255,255,.35),transparent 45%)' }} /></div>
      <div style={abs({ left: 430, top: 450, width: 70, height: 300, background: 'linear-gradient(90deg,#1b1b1b,#444,#1b1b1b)', transform: 'rotate(-40deg)', borderRadius: 20 })} /></div>
    <Words t={t} blurF={3} style={{ position: 'absolute', left: 140, top: 420, font: '700 80px/1 Poppins', color: '#2a2020' }} items={[[0.3, 'One'], [0.48, '\n'], [0.48, 'proved']]} />
    <Concept t={t} t0={0.6} text="BROWNIAN MOTION" style={{ left: 140, top: 620 }} dark />
    <div style={abs({ left: 330, top: 830, width: 1260, height: 170, background: RED, opacity: t < 0.75 ? 0 : 1, clipPath: 'polygon(0 20%,8% 0,40% 8%,70% 0,100% 15%,96% 80%,100% 100%,60% 90%,20% 100%,2% 85%)', WebkitMaskImage: `linear-gradient(90deg,#000 ${b * 100}%,transparent ${b * 100 + 2}%)` })} />
    <Reveal t={t} t0={0.55} f={3} style={abs({ left: 0, right: 0, top: 800, textAlign: 'center', font: 'italic 900 190px "Playfair Display"', color: YEL, textShadow: '0 4px 0 #6b5a10,0 10px 30px rgba(0,0,0,.4)' })}>atoms</Reveal>
  </Cam></AbsoluteFill>); };

// S12 21.3–23.4  Turning gears + pocket watch, "time" pops on the spoken word (Ref 3 "system")
const Gear: React.FC<{ x: number; y: number; r: number; n: number; rot: number }> = ({ x, y, r, n, rot }) => (
  <svg width={2 * r + 40} height={2 * r + 40} viewBox={`${-r - 20} ${-r - 20} ${2 * r + 40} ${2 * r + 40}`} style={abs({ left: x - r - 20, top: y - r - 20, transform: `rotate(${rot}deg)` })} fill="none" stroke="#9a9a96" strokeWidth={7}>
    <circle r={r} /><circle r={r * 0.45} />{Array.from({ length: n }, (_, i) => <rect key={i} x={-12} y={-r - 22} width={24} height={24} transform={`rotate(${(i * 360) / n})`} />)}</svg>);
export const S12: React.FC<S> = ({ g }) => { const t = useT(); const k = P(t, 1.35, 1.35 + 3 * F);
  return (<AbsoluteFill><Cam gt={g + t} s={1 + 0.04 * t / 2.1}>{black}<Gear x={770} y={540} r={220} n={16} rot={t * 40} /><Gear x={1240} y={580} r={150} n={12} rot={-t * 60} />
    <Img src={img('watch_cut.png')} style={abs({ left: 740, top: 260, height: 560, opacity: 0.9, filter: 'grayscale(1) contrast(1.1)' })} />
    <div style={abs({ ...serif, left: 0, right: 0, top: 330, textAlign: 'center', fontSize: 70 })}>{typed('One changed', t, 0.1, 1.2)}</div>
    <div style={abs({ left: 0, right: 0, top: 420, textAlign: 'center', font: '800 230px/1 Poppins', color: '#f1e3b8', letterSpacing: -8, textShadow: '0 0 30px rgba(255,240,200,.5),0 8px 0 rgba(0,0,0,.3)', opacity: t < 1.35 ? 0 : 1, transform: `scale(${1.2 - 0.2 * E.o3(k)})` })}>time</div>
    <Concept t={t} t0={0.9} text="SPECIAL RELATIVITY" style={{ left: 110, top: 940 }} />
  </Cam><Credit text="Pocket watch · The Metropolitan Museum of Art" /></AbsoluteFill>); };

// S13 23.4–26.6  Lecture room, faint chalk equations, bold 3D words → "E=mc²" → "ever." (Ref 1 "the streaming wars")
export const S13: React.FC<S> = ({ g }) => { const t = useT(); const o = E.o3(P(t, 1.3, 1.3 + 6 * F)), b = P(t, 1.85, 1.85 + 6 * F), e = P(t, 1.95, 1.95 + 3 * F);
  return (<AbsoluteFill><Cam gt={g + t}>
    <Img src={img('board.jpg')} style={abs({ inset: 0, width: 1920, height: 1080, objectFit: 'cover', objectPosition: 'left center', filter: 'grayscale(1) contrast(1.1) brightness(.45) blur(3px)', transform: `scale(${1 + 0.04 * t / 3.2})` })} />
    <div style={abs({ left: 70, top: 120, font: 'italic 400 44px "Bodoni Moda"', color: 'rgba(255,255,255,.16)', lineHeight: 1.5, transform: 'rotate(-3deg)' })}>L = mc² · E₀ = mc²<br />m = E / c²<br />Δm = L / c²</div>
    <Cut src="sch_cut.png" style={{ left: 260, top: 40, height: 1060, ...dolly(t, 3.2, 0.18) }} />
    <div style={abs({ left: 1000, top: 180, transform: `translateX(${-300 * o}px)`, filter: `blur(${o * 12}px)`, opacity: 1 - o })}>
      <Words t={t} blurF={2} style={{ ...pop, fontSize: 140, lineHeight: 1.02 }} items={[[0.2, 'the most'], [0.45, '\n'], [0.45, 'famous'], [0.7, '\n'], [0.7, 'equation']]} /></div>
    <div style={abs({ ...pop, left: 930, top: 340, fontSize: 270, transform: `scale(${1 - 0.15 * b}) translateY(${-40 * b}px)`, filter: `blur(${b * 2}px)`, opacity: 1 - 0.3 * b })}>{typed('E=mc²', t, 1.4, 3)}</div>
    <div style={abs({ left: 930, top: 150, opacity: 1 - P(t, 2.3, 2.6), transform: `scale(${1 - 0.15 * b}) translateY(${-40 * b}px)`, transformOrigin: '400px 330px' })}>
      {[{ x: 0, w: 'energy', t0: 1.55 }, { x: 330, w: 'mass', t0: 1.63 }, { x: 560, w: 'speed of light, squared', t0: 1.71 }].map((a) => t >= a.t0 && (
        <div key={a.w} style={abs({ left: a.x, top: 0 })}>
          <div style={{ font: '700 44px Caveat', color: '#f3ead2', whiteSpace: 'nowrap', textShadow: '0 2px 8px rgba(0,0,0,.7)' }}>{typed(a.w, t, a.t0, 0.6)}</div>
          <svg width="60" height="120" style={{ position: 'absolute', left: 30, top: 52 }}><path d="M10 0 C 30 40, 20 80, 34 110 M22 98 L34 112 L44 96" fill="none" stroke="#f3ead2" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - E.o3(P(t, a.t0, a.t0 + 8 * F))} /></svg>
        </div>))}
    </div>
    <div style={abs({ ...pop, left: 1120, top: 700, fontSize: 220, opacity: t < 1.95 ? 0 : 1, transform: `scale(${1.2 - 0.2 * e})` })}>ever.</div>
  </Cam><LightLeak t={t} t0={1.9} dur={0.5} /></AbsoluteFill>); };

// Explainer: starlight grazing the Sun bends (solid), so the star appears shifted (dashed). Einstein predicted 1.75″.
const EclipseDiagram: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  if (t < t0) return null;
  const d = (a: number, f: number) => E.o3(P(t, t0 + a, t0 + a + f * F)); const card = E.x(P(t, t0, t0 + 8 * F));
  const line = (path: string, p: number, dash?: string, color = '#2a2218') => <path d={path} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray={dash} pathLength={1} style={dash ? { opacity: p > 0 ? 1 : 0 } : { strokeDasharray: 1, strokeDashoffset: 1 - p }} />;
  return (
    <div style={abs({ left: 1080, top: 812, width: 640, height: 240, background: '#f1ece0', boxShadow: '0 10px 24px rgba(0,0,0,.35)', transform: `rotate(-2deg) translateY(${(1 - card) * 40}px)`, opacity: card })}>
      <div style={abs({ left: 18, top: 10, font: '700 30px Caveat', color: '#2a2218' })}>starlight bends around the Sun</div>
      <svg width="640" height="240" style={{ position: 'absolute' }}>
        <circle cx="300" cy="150" r="38" fill="none" stroke="#c98a1a" strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(0.1, 8)} />
        <text x="282" y="210" style={{ font: '400 18px "Special Elite"', fill: '#5a4a32' }}>SUN</text>
        <circle cx="40" cy="160" r="12" fill="#3a6aa0" opacity={d(0.15, 4)} /><text x="22" y="200" style={{ font: '400 18px "Special Elite"', fill: '#5a4a32' }}>EARTH</text>
        <text x="600" y="72" textAnchor="middle" style={{ font: '700 26px Poppins', fill: '#2a2218' }} opacity={d(0.2, 4)}>★</text>
        {line('M600 64 C 420 80, 340 104, 300 106 S 120 140, 52 158', d(0.3, 14), undefined, RED)}
        <path d="M52 158 L 600 40" fill="none" stroke="#2a2218" strokeWidth={2.5} strokeDasharray="10 8" opacity={d(0.75, 6)} />
        <text x="560" y="30" style={{ font: '700 26px Poppins', fill: '#2a2218' }} opacity={d(0.8, 4) * 0.55}>★</text>
        <text x="440" y="190" style={{ font: '700 34px Caveat', fill: RED }} opacity={d(0.95, 6)}>1.75″ shift</text>
      </svg>
    </div>);
};

// S14 26.6–30.2  Whip pan, big "1919", lime "May 29th", eclipse print taped (Ref 2), location lower-third
export const S14: React.FC<S> = ({ g }) => { const t = useT(); const w = E.o3(P(t, 0, 8 * F)), q = E.o3(P(t, 1.0, 1.0 + 5 * F)); const wv = useWeave();
  return (<AbsoluteFill><Cam gt={g + t} x={(1 - w) * -1920} s={1 + 0.04 * t / 3.6} blur={(1 - w) * 14}>{greyDesk}
    <div style={{ ...wv, position: 'absolute', inset: 0 }}><Card src="eclipse.jpg" x={1060} y={150} w={600} h={650} r={5} /></div><Tape x={1250} y={120} r={-6} w={200} />
    <WindowShadow t={t} o={0.45} />
    <div style={abs({ left: 180, top: 250, font: '400 440px/1 "Bodoni Moda"', color: '#1c1c1c', letterSpacing: -14 })}>{t < 0.3 ? '' : t < 0.3 + 6 * F ? '19' : '1919'}</div>
    <div style={abs({ left: 560, top: 680, transform: 'rotate(-4deg)' })}><div style={{ background: LIME, padding: '4px 30px 14px', font: 'italic 400 90px "Bodoni Moda"', color: '#1a1a1a', whiteSpace: 'nowrap', height: 130, transformOrigin: '0 50%', transform: `scaleX(${q})`, opacity: q > 0.001 ? 1 : 0 }}>{typed('May 29th', t, 1.05)}</div></div>
    <EclipseDiagram t={t} t0={1.5} />
    <LowerThird t={t} t0={1.9} title="SOBRAL, BRAZIL · PRÍNCIPE" sub="total solar eclipse" dur={1.4} dark />
  </Cam><Credit text="Eclipse plate, 1919 · Dyson, Eddington & Davidson" dark top /></AbsoluteFill>); };

// S15 30.2–32.8  Newspapers fly onto wood, white arc, highlighter sweep over "Einstein Theory Triumphs" (Ref 1 + Vox highlight)
export const S15: React.FC<S> = ({ g }) => { const t = useT(); const hl = E.o3(P(t, 1.45, 1.45 + 9 * F)), z = E.io(P(t, 1.3, 2.4));
  return (<AbsoluteFill><Cam gt={g + t} s={1 + 0.05 * t / 2.6 + 0.35 * z} origin="560px 560px"><Wood />
    {[0, 1].map((i) => { const t0 = i * 4 * F, q = E.back(P(t, t0, t0 + 8 * F)), m = 1 - P(t, t0, t0 + 8 * F); const base = [-7, 5][i];
      const st: React.CSSProperties = { position: 'absolute', background: 'linear-gradient(160deg,#efe4c9,#d9c7a0)', boxShadow: '0 18px 40px rgba(0,0,0,.55)', padding: '26px 30px', color: '#1d1a16', overflow: 'hidden',
        transform: `translate(${(1 - q) * (i ? 900 : -900)}px,${(1 - q) * -600}px) rotate(${base + (1 - q) * (i ? -20 : 20)}deg)`, filter: `blur(${m * 12}px)` };
      return i === 0 ? (
        <div key={i} style={{ ...st, left: 300, top: 300, width: 560, height: 700 }}>
          <div style={{ font: '900 30px "Playfair Display"', textAlign: 'center', borderBottom: '3px double #333', paddingBottom: 6, marginBottom: 12 }}>The New York Times<div style={{ font: '400 13px "Special Elite"', letterSpacing: 1, marginTop: 4 }}>NEW YORK, MONDAY, NOVEMBER 10, 1919 · TWO CENTS</div></div>
          <div style={{ font: '900 46px/1.02 "Playfair Display"', textAlign: 'center', textTransform: 'uppercase' }}>Lights All Askew in the Heavens</div>
          <div style={{ font: 'italic 400 20px/1.2 "Bodoni Moda"', textAlign: 'center', margin: '10px 0' }}>Men of Science More or Less Agog Over Results of Eclipse Observations</div>
          <div style={{ position: 'relative', font: '900 30px "Playfair Display"', textAlign: 'center', textTransform: 'uppercase' }}>
            <span style={{ position: 'absolute', left: 20, top: 4, height: 34, width: 440 * hl, background: 'rgba(255,225,40,.75)', mixBlendMode: 'multiply' }} />Einstein Theory Triumphs</div>
          <div style={{ columns: 3, columnGap: 16, font: '11px/1.35 Georgia,serif', color: '#3b352c', textAlign: 'justify', marginTop: 12 }}>{LOREM}</div></div>
      ) : (
        <div key={i} style={{ ...st, left: 1000, top: 280, width: 600, height: 720 }}>
          <div style={{ font: '900 30px "Playfair Display"', textAlign: 'center', borderBottom: '3px double #333', paddingBottom: 6, marginBottom: 12 }}>THE TIMES<div style={{ font: '400 13px "Special Elite"', letterSpacing: 1, marginTop: 4 }}>LONDON, FRIDAY, NOVEMBER 7, 1919</div></div>
          <div style={{ font: '900 60px/1.02 "Playfair Display"', textAlign: 'center', textTransform: 'uppercase' }}>Revolution in Science</div>
          <div style={{ font: 'italic 400 20px/1.2 "Bodoni Moda"', textAlign: 'center', margin: '10px 0' }}>New Theory of the Universe. Newtonian Ideas Overthrown.</div>
          <div style={{ columns: 3, columnGap: 16, font: '11px/1.35 Georgia,serif', color: '#3b352c', textAlign: 'justify' }}>{LOREM}</div></div>); })}
    <Draw d={ARC} vb="0 0 100 60" t={t} t0={0.9} f={9} color="#fff" width={5} style={{ left: 260, top: 240, width: 1400, height: 700, opacity: 1 - z }} />
    <Words t={t} style={{ ...serif, position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', fontSize: 120, opacity: 1 - z }} items={[[0.4, 'Revolution'], [0.65, 'in science']]} />
  </Cam><Credit text="The New York Times, 10 Nov 1919 · The Times, 7 Nov 1919 (recreated)" /></AbsoluteFill>); };

// S16 32.8–35.2  Evidence board whip-in, red scribble on face, whip out (Ref 2 "Edward Smith")
export const S16: React.FC<S> = ({ g }) => { const t = useT(); const w = E.o3(P(t, 0, 10 * F)), o = E.i3(P(t, 2.2, 2.4));
  return (<AbsoluteFill><Cam gt={g + t} y={(1 - w) * -600 - o * 900} r={(1 - w) * 8 + 1.5 * t / 2.4} s={1 + 0.06 * t / 2.4} blur={(1 - w) * 12 + o * 14}>{greyDesk}
    <Card src="young.jpg" x={200} y={60} w={360} h={270} r={-4} pos="center 25%" /><Card src="annalen.jpg" x={1360} y={60} w={330} h={270} r={5} /><Card src="bern.jpg" x={200} y={760} w={380} h={260} r={3} /><Card src="eclipse.jpg" x={1360} y={760} w={330} h={270} r={-5} />
    <svg width="1920" height="1080" style={{ position: 'absolute' }}><g stroke="#9b1b22" strokeWidth={5} fill="none" strokeLinecap="round"><path d="M730 270 L1190 270 L1190 800 L730 800 Z" /><path d="M560 320 L730 270 M1360 320 L1190 270 M570 770 L730 800 M1360 770 L1190 800" /></g></svg>
    <Card src="sch.jpg" x={770} y={300} w={380} h={470} r={0} pos="center 20%" />
    <Tape x={240} y={40} r={-15} /><Tape x={1470} y={40} r={10} /><Tape x={880} y={282} r={-3} w={200} />
    {[[730, 270], [1190, 270], [730, 800], [1190, 800], [560, 320], [1360, 320], [570, 770], [1360, 770]].map(([x, y], i) => <Pin key={i} x={x} y={y} />)}
    <div style={abs({ left: 700, top: 760, transform: 'rotate(-90deg)', transformOrigin: 'left top', background: '#111', color: '#fff', font: '900 40px "Playfair Display"', padding: '8px 22px', letterSpacing: 2, whiteSpace: 'nowrap' })}>ALBERT EINSTEIN</div>
    <div style={abs({ left: 690, top: 700, transform: 'rotate(-30deg)', background: '#111', color: '#fff', font: '700 28px Poppins', padding: '5px 14px' })}>PHYSICIST</div>
    <Note t={t} t0={0.6} text="7 Nov 1919 — famous" style={{ left: 1210, top: 640, transform: 'rotate(-6deg)', color: '#9b1b22' }} />
    <Draw d={SCRIBBLE} vb="0 0 100 100" t={t} t0={1.2} f={24} color="#d0121c" width={12} style={{ left: 855, top: 300, width: 250, height: 250 }} />
    <WindowShadow t={t} o={0.4} /></Cam></AbsoluteFill>); };

// S17 35.2–38.2  "Nobel Prize" with lime ellipse + grey↔lime flicker (Ref 1 "billion"), lower-third with the real citation
export const S17: React.FC<S> = ({ g }) => { const t = useT(); const pl = P(t, 2.2, 2.4);
  let c = '#fff'; [1.0, 1.07, 1.13, 1.2].forEach((x, i) => { if (t >= x) c = i % 2 ? '#fff' : LIME; }); if (t >= 1.27) c = LIME;
  return (<AbsoluteFill><Cam gt={g + t} s={1 + 0.02 * t / 3 + 0.06 * E.io(pl)} blur={Math.sin(pl * Math.PI) * 6}>{darkRoom}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 30%,rgba(255,240,200,.18),transparent 60%)' }} />
    <Cut src="harris_cut.png" style={{ left: 940, top: 80, height: 1000, ...dolly(t, 3.0, 0.15) }} />
    <Words t={t} style={{ ...serif, position: 'absolute', left: 160, top: 290, fontSize: 110 }} items={[[0.1, 'Then'], [0.45, 'he won'], [0.7, 'the']]} />
    <Reveal t={t} t0={0.95} f={3} style={abs({ ...serif, left: 120, top: 420, fontSize: 230, color: c })}>Nobel Prize</Reveal>
    <Draw d={ELLIPSE} vb="0 0 100 50" t={t} t0={0.95} f={6} color={LIME} width={7} style={{ left: 40, top: 400, width: 1320, height: 340 }} />
    <LowerThird t={t} t0={1.5} title="NOBEL PRIZE IN PHYSICS · 1921" sub="“for his discovery of the law of the photoelectric effect”" dur={1.4} />
  </Cam><Credit text="Photo: Harris & Ewing, 1921 · National Portrait Gallery" /><LightLeak t={t} t0={2.15} dur={0.5} /></AbsoluteFill>); };

// S18 38.2–44.2  Ink blots spread (Ref 4), zoom-out reveal, typed line, glitch red box "patent clerk." (Ref 3)
export const S18: React.FC<S> = ({ g }) => { const t = useT(); const f = useCurrentFrame(); const z = P(t, 1.3, 1.7);
  const s = t < 2.4 ? '' : t < 2.68 ? 'patent' : 'patent clerk.'; const gl = (t > 2.4 && t < 2.4 + 3 * F) || (t > 2.68 && t < 2.68 + 3 * F);
  return (<AbsoluteFill><Cam gt={g + t} s={1.25 - 0.25 * E.o3(z)} blur={t > 1.3 ? (1 - z) * 8 : 0}>{cream}<WindowShadow t={t} o={0.2} />
    <div style={abs({ left: 0, right: 0, top: 390, textAlign: 'center', font: 'italic 400 76px "Bodoni Moda"', color: '#2a2622' })}>{typed('Not bad for a', t, 1.6)}</div>
    <div style={abs({ left: 0, right: 0, top: 480, textAlign: 'center', transform: gl ? `translateX(${Math.sin(f * 7) * 24}px) skewX(${Math.cos(f * 5) * 8}deg)` : undefined, filter: gl ? 'drop-shadow(6px 0 0 rgba(0,255,255,.6)) drop-shadow(-6px 0 0 rgba(255,0,0,.6))' : undefined })}>
      {s && <span style={{ display: 'inline-block', background: RED, padding: '0 28px 10px', clipPath: 'polygon(1% 6%,20% 0,48% 4%,75% 0,99% 5%,100% 40%,98% 96%,70% 100%,40% 96%,12% 100%,0 92%,2% 45%)', font: '900 170px/1.05 "Playfair Display"', color: '#fff', letterSpacing: -4, transform: 'scaleX(.86)' }}>{s}</span>}</div>
    <Reveal t={t} t0={3.6} style={abs({ left: 0, right: 0, top: 720, textAlign: 'center', font: '400 26px "Special Elite"', color: 'rgba(30,30,30,.7)', letterSpacing: 2 })}>ALBERT EINSTEIN · 1879 – 1955</Reveal>
    <AbsoluteFill>{Array.from({ length: 26 }, (_, i) => { const d = (i % 9) * 0.12, gg = E.o3(P(t, d, d + 0.6));
      return <div key={i} style={abs({ left: ((i * 397) % 1880) - 60, top: ((i * 233) % 1040) - 60, width: 120 + (i % 5) * 70, height: 100 + (i % 4) * 60, borderRadius: `${40 + (i % 3) * 10}% ${60 - (i % 4) * 8}% ${50 + (i % 2) * 14}% 45%`, background: '#151210', filter: 'blur(2px)', transform: `rotate(${i * 37}deg) scale(${0.2 + gg * 1.2})`, opacity: t < 1.3 ? gg : 1 - P(t, 1.3, 1.6) })} />; })}</AbsoluteFill>
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%,transparent 40%,rgba(20,15,10,.7) 70%)' }} />
  </Cam></AbsoluteFill>); };

export const S19: React.FC<S> = () => <AbsoluteFill style={{ background: '#000' }} />;
