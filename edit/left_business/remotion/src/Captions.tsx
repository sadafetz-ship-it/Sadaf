// Lower-third caption lockup (9:16): L1 setup (Inter Display Light, karaoke) / script pill (Allura on the accent gradient) /
// heavy word (low glow, dot, optional highlight bar, optional 3D swing, optional circled-gradient fill).
import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {WORDS} from './words';
import {C, HEAVY_FILTER} from './theme';
import {back, bloomIn, cl, InkLine, Letters, prog, ScriptPixels, wordIn} from './fx';

type Group = {start: number; end: number; l1: number[]; pill?: number[]; heavy?: number[]; text?: string[]; tail?: number[];
  bar?: boolean; swing?: boolean; grad?: boolean};
const R = (a: number, b: number) => Array.from({length: b - a + 1}, (_, i) => a + i);

export const GROUPS: Group[] = [
  // 0–53: hook title carries "I left my $30K business"
  {start: 53, end: 163, l1: R(5, 9), pill: [10, 11], heavy: [12, 13], text: ['DIGITAL', 'PRODUCTS'], grad: true, bar: true},
  {start: 164, end: 247, l1: R(14, 21), pill: [22], heavy: [23], text: ['BURNOUT'], bar: true, swing: true},
  {start: 247, end: 351, l1: R(24, 29), heavy: [30, 31, 32, 33], text: ['10–12 HOURS'], tail: [34, 35]},
  {start: 351, end: 429, l1: R(36, 38), heavy: [39, 40], text: ['NO WEEKENDS']},
  {start: 429, end: 482, l1: R(41, 45), pill: [46, 47], heavy: [48], text: ['FRIENDS']},
  {start: 482, end: 540, l1: R(49, 53), pill: [54, 55], heavy: [56], text: ['GYM']},
  {start: 540, end: 623, l1: R(57, 63), heavy: [64, 65], text: ['MISSING MEALS'], bar: true},
  {start: 623, end: 703, l1: R(66, 73), pill: [74], heavy: [75], text: ['ASAP'], swing: true},
  {start: 703, end: 746, l1: R(76, 80)},
  // 746–806: behind-head title "selling low-ticket DIGITAL PRODUCTS"
  {start: 806, end: 839, l1: R(86, 87), heavy: [88], text: ['AUDIENCE'], grad: true},
  {start: 839, end: 905, l1: R(89, 95), heavy: [96, 97, 98], text: ['LINK IN BIO'], grad: true, bar: true},
];

const L1Word: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const [w, s] = WORDS[i];
  if (f < s) return <span style={{display: 'inline-block', opacity: 0}}>{w}&nbsp;</span>;
  const color = interpolateColors(f, [s, s + 5, s + 18], [C.sky, C.sky, C.mist]);
  return <span style={{...wordIn(f, s), color, textShadow: f < s + 14 ? `0 0 18px rgba(101,126,252,.8)` : '0 2px 18px rgba(0,0,0,.6)'}}>{w}&nbsp;</span>;
};

const Pill: React.FC<{idx: number[]}> = ({idx}) => {
  const f = useCurrentFrame();
  const at = WORDS[idx[0]][1];
  const endW = Math.max(WORDS[idx[idx.length - 1]][2], at + 16);
  if (f < at - 1) return null;
  const sc = interpolate(f, [at - 2, at + 8, at + 13], [0.6, 1.06, 1], cl);
  const reveal = interpolate(f, [at + 1, endW], [0, 100], cl);
  const text = idx.map((i) => WORDS[i][0].replace(/[,.]$/, '')).join(' ');
  return (
    <div style={{display: 'inline-block', borderRadius: 999, padding: '0 46px 12px', marginTop: 12, transform: `scale(${sc})`, opacity: interpolate(f, [at - 2, at + 3], [0, 1], cl),
      background: 'linear-gradient(180deg,#A9B4FF 0%,#7C8BFF 35%,#935DF9 70%,#C052E9 100%)',
      boxShadow: 'inset 0 0 0 2px rgba(242,238,255,.5),inset 0 2px 0 rgba(255,255,255,.6),0 0 22px rgba(120,130,252,.65),0 0 50px rgba(192,82,233,.45)'}}>
      <span style={{fontFamily: 'Allura', color: C.ink, fontSize: 104, lineHeight: 1.05, display: 'inline-block', transform: 'translateY(6px)',
        padding: '0 90px', margin: '0 -90px', clipPath: `inset(-90px ${100 - reveal}% -90px 0)`}}>{text}</span>
    </div>
  );
};

const Heavy: React.FC<{g: Group}> = ({g}) => {
  const f = useCurrentFrame();
  const at = WORDS[g.heavy![0]][1];
  if (f < at - 6) return null;
  const lines = g.text ?? [g.heavy!.map((i) => WORDS[i][0]).join(' ').replace(/[.,?!]+$/, '').toUpperCase()];
  const longest = Math.max(...lines.map((l) => l.length));
  const size = Math.min(156, Math.floor(930 / (longest * 0.62)));
  const wEst = longest * size * 0.6;
  const hEst = size * lines.length;
  const sw = g.swing
    ? {transform: `perspective(900px) rotateY(${interpolate(f, [at, at + 13, at + 22], [75, -18, -10], {...cl, easing: back})}deg) rotateZ(${interpolate(f, [at, at + 18], [-12, -3], cl)}deg)`}
    : {};
  const barP = prog(f, at + 6, at + 20);
  const filt = g.grad ? 'drop-shadow(0 0 10px rgba(147,93,249,.5)) drop-shadow(0 2px 14px rgba(0,0,0,.45))' : HEAVY_FILTER;
  return (
    <div style={{position: 'relative', marginTop: 10, fontFamily: 'Inter Display', fontWeight: 600, fontSize: size, letterSpacing: -size * 0.045, lineHeight: 0.98,
      whiteSpace: 'nowrap', isolation: 'isolate', ...sw}}>
      <InkLine x={wEst / 2} y={10} at={at} h={140} color={C.violet} />
      {lines.map((l, k) => {
        const lat = at + k * 8; // second line lands 8 f later (on "products" it's spoken ~20 f later; 8 f keeps it readable)
        const b = bloomIn(f, lat);
        const last = k === lines.length - 1;
        return (
          <div key={k} style={{position: 'relative'}}>
            {g.bar && last ? <span style={{position: 'absolute', left: -12, right: -12, bottom: '0.08em', height: '0.26em', borderRadius: 8, zIndex: -1, transformOrigin: 'left',
              transform: `scaleX(${barP})`, background: `linear-gradient(90deg,${C.deep},${C.blue} 35%,${C.violet} 70%,${C.magenta})`, boxShadow: '0 0 26px rgba(120,130,252,.65)'}} /> : null}
            <span style={{display: 'inline-block', filter: filt, opacity: b.opacity}}><Letters text={l} at={lat} grad={g.grad} /></span>
            {last ? <span style={{display: 'inline-block', width: '0.15em', height: '0.15em', borderRadius: '50%', background: C.magenta, marginLeft: '0.05em',
              boxShadow: `0 0 14px ${C.magenta}`, transform: `scale(${interpolate(f, [lat + 10, lat + 16, lat + 21], [0, 1.4, 1], cl)})`}} /> : null}
          </div>
        );
      })}
      <ScriptPixels at={at} x={-wEst * 0.0} y={0} w={wEst} h={hEst} seed={`hv${at}`} size={Math.round(size * 0.2)}
        anchors={[[-0.1, 0.1], [-0.08, 0.7], [1.0, 0.0], [1.02, 0.6], [0.1, 1.02], [0.85, 1.0]]} />
    </div>
  );
};

export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const g = GROUPS.find((x) => f >= x.start && f < x.end);
  if (!g) return null;
  const ex = g.end >= 905 ? 0 : interpolate(f, [g.end - 7, g.end], [0, 1], cl);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, bottom: 270, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      opacity: 1 - ex, filter: ex ? `blur(${10 * ex}px)` : undefined}}>
      <div style={{maxWidth: 900, fontFamily: 'Inter Display', fontWeight: 300, fontSize: 58, letterSpacing: -2, color: C.mist, lineHeight: 1.08, textWrap: 'balance' as never}}>
        {g.l1.map((i) => <L1Word key={i} i={i} />)}
      </div>
      {g.pill ? <Pill idx={g.pill} /> : null}
      {g.heavy ? <Heavy g={g} /> : null}
      {g.tail ? <div style={{fontFamily: 'Inter Display', fontWeight: 300, fontSize: 50, letterSpacing: -1.5, color: C.mist, marginTop: 6}}>{g.tail.map((i) => <L1Word key={i} i={i} />)}</div> : null}
    </div>
  );
};
