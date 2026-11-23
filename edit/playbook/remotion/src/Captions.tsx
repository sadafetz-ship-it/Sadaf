// Lower-third caption lockup: L1 setup (Inter Display Light, karaoke lime→mist) / L2 Allura script on a lime glow pill / L3 heavy (low glow, lime dot, highlight bar, 3D swing).
import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {WORDS} from './words';
import {C, HEAVY_FILL, HEAVY_FILTER} from './theme';
import {back, bloomIn, cl, InkLine, prog, ScriptPixels, wordIn} from './fx';

type Group = {start: number; end: number; l1: number[]; pill?: number[]; heavy?: number[]; tag?: number[]; bar?: boolean; swing?: boolean; ring?: boolean};
const R = (a: number, b: number) => Array.from({length: b - a + 1}, (_, i) => a + i);

export const GROUPS: Group[] = [
  {start: 0, end: 63, l1: [0], heavy: [1, 2]}, // Alright, / listen up.
  {start: 64, end: 148, l1: R(3, 8)}, // I'm about to reveal the exact  (PLAYBOOK is the title)
  {start: 148, end: 209, l1: R(10, 12), pill: [13, 14], heavy: [15], swing: true}, // that built a / trillion dollar / empire.
  {start: 209, end: 284, l1: R(16, 19), pill: [20], heavy: [21]}, // right in front of / everyone's / eyes.
  {start: 287, end: 386, l1: R(22, 27), pill: [28, 29], heavy: [30], bar: true}, // While most financiers are out there / gatekeeping the / industry.
  {start: 389, end: 452, l1: R(31, 35), pill: [36]}, // I discovered something that was / hidden
  {start: 452, end: 497, l1: R(37, 38), pill: [39], heavy: [40]}, // right in / plain / sight.
  {start: 497, end: 606, l1: R(41, 45), pill: [46, 47], heavy: [48], tag: R(49, 52), ring: true}, // … find. in the first place.
  {start: 609, end: 668, l1: R(53, 54)}, // Now, when  (Steve SCHWARZMAN of Blackstone = title)
  {start: 669, end: 752, l1: R(59, 62), pill: [63], heavy: [64], bar: true}, // left Lehman Brothers in / late / 1985.
  {start: 753, end: 803, l1: R(65, 69), heavy: [70]}, // he didn't have billions of / dollars.
  {start: 803, end: 865, l1: R(71, 74), pill: [75, 76], heavy: [77]}, // He didn't have a / private equity / empire.
  {start: 865, end: 922, l1: R(78, 81), pill: [82], heavy: [83]}, // He didn't have a / massive / team.
  {start: 923, end: 950, l1: R(84, 86), heavy: [87]}, // But he did / have.
  {start: 950, end: 1016, l1: R(88, 90), pill: [91, 92], heavy: [93], bar: true}, // something that was / far more / valuable.
  {start: 1018, end: 1084, l1: R(94, 96), heavy: [97], bar: true}, // a strategy so / powerful.
  {start: 1085, end: 1173, l1: R(98, 102), heavy: [103], swing: true}, // it transformed the financial world / forever.
];

export const HEAVY_FRAMES = GROUPS.filter((g) => g.heavy).map((g) => WORDS[g.heavy![0]][1]);

const L1Word: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const [w, s] = WORDS[i];
  if (f < s) return <span style={{display: 'inline-block', opacity: 0}}>{w}&nbsp;</span>;
  const color = interpolateColors(f, [s, s + 5, s + 18], [C.lime, C.lime, C.mist]);
  return <span style={{...wordIn(f, s), color}}>{w}&nbsp;</span>;
};

const Pill: React.FC<{idx: number[]}> = ({idx}) => {
  const f = useCurrentFrame();
  const at = WORDS[idx[0]][1];
  const endW = Math.max(WORDS[idx[idx.length - 1]][2], at + 16);
  if (f < at - 2) return null;
  const sc = interpolate(f, [at - 2, at + 8, at + 13], [0.6, 1.06, 1], cl);
  const reveal = interpolate(f, [at + 1, endW], [0, 100], cl);
  const text = idx.map((i) => WORDS[i][0]).join(' ').replace(/[.,?!]+$/, '');
  return (
    <div style={{display: 'inline-block', borderRadius: 999, padding: '0 34px 10px', marginTop: 4, transform: `scale(${sc})`, opacity: interpolate(f, [at - 2, at + 3], [0, 1], cl),
      background: `linear-gradient(180deg,#F6FFB8,${C.lime} 55%,${C.limeDk})`,
      boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.55),0 0 22px rgba(230,255,79,.55),0 0 50px rgba(230,255,79,.3)'}}>
      <span style={{fontFamily: 'Allura', color: C.ink, fontSize: 76, lineHeight: 1, display: 'inline-block', transform: 'translateY(6px)',
        padding: '0 80px', margin: '0 -80px', clipPath: `inset(-60px ${100 - reveal}% -60px 0)`}}>{text}</span>
    </div>
  );
};

const Heavy: React.FC<{idx: number[]; bar?: boolean; swing?: boolean; ring?: boolean}> = ({idx, bar, swing, ring}) => {
  const f = useCurrentFrame();
  const at = WORDS[idx[0]][1];
  if (f < at - 4) return null;
  const text = idx.map((i) => WORDS[i][0]).join(' ').replace(/[.,?!]+$/, '');
  const size = Math.min(118, Math.floor(1404 / text.length));
  const wEst = text.length * size * 0.52;
  const b = bloomIn(f, at);
  const sw = swing
    ? {transform: `perspective(900px) rotateY(${interpolate(f, [at, at + 13, at + 22], [75, -18, -10], {...cl, easing: back})}deg) rotateZ(${interpolate(f, [at, at + 18], [-12, -3], cl)}deg)`}
    : {};
  const barP = prog(f, at + 6, at + 20);
  const ringP = prog(f, at + 4, at + 22);
  return (
    <div style={{position: 'relative', fontWeight: 620, fontSize: size, letterSpacing: -5, lineHeight: 1.0, whiteSpace: 'nowrap', isolation: 'isolate', ...sw}}>
      <InkLine x={wEst / 2} y={10} at={at} h={120} />
      {bar ? <span style={{position: 'absolute', left: -10, right: 26, bottom: '0.12em', height: '0.26em', borderRadius: 6, zIndex: -1, transformOrigin: 'left',
        transform: `scaleX(${barP})`, background: `linear-gradient(90deg,${C.deep},${C.lime} 60%,#F8FFC9)`, boxShadow: '0 0 22px rgba(230,255,79,.55)'}} /> : null}
      <span style={{display: 'inline-block', ...b}}>
        <span style={{background: HEAVY_FILL, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: HEAVY_FILTER, padding: '0 4px'}}>{text}</span>
      </span>
      <span style={{display: 'inline-block', width: '0.15em', height: '0.15em', borderRadius: '50%', background: C.lime, marginLeft: '0.04em',
        boxShadow: '0 0 10px rgba(230,255,79,.8)', transform: `scale(${interpolate(f, [at + 10, at + 16, at + 21], [0, 1.4, 1], cl)})`}} />
      {ring ? (
        <svg width={wEst + 120} height={size * 1.5} style={{position: 'absolute', left: -60, top: -size * 0.2, overflow: 'visible'}}>
          <ellipse cx={(wEst + 120) / 2} cy={size * 0.62} rx={(wEst + 80) / 2} ry={size * 0.62} fill="none" stroke={C.lime} strokeWidth={6} pathLength={1}
            strokeDasharray={`${ringP} 2`} transform={`rotate(-4 ${(wEst + 120) / 2} ${size * 0.62})`} style={{filter: `drop-shadow(0 0 10px ${C.lime})`}} strokeLinecap="round" />
        </svg>
      ) : null}
      <ScriptPixels at={at} x={0} y={0} w={wEst} h={size} seed={`hv${at}`} size={Math.round(size * 0.18)}
        anchors={[[-0.16, 0.15], [-0.12, 0.7], [1.06, 0.05], [1.08, 0.65], [0.15, 1.02], [0.82, 1.02]]} />
    </div>
  );
};

export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const g = GROUPS.find((x) => f >= x.start && f < x.end);
  if (!g) return null;
  const ex = interpolate(f, [g.end - 7, g.end], [0, 1], cl);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2,
      opacity: 1 - ex, filter: `blur(${10 * ex}px)`, zIndex: 50}}>
      <div style={{maxWidth: 1200, fontWeight: 300, fontSize: 46, letterSpacing: -1.4, color: C.mist, lineHeight: 1.08, textShadow: '0 2px 18px rgba(8,24,58,.75)'}}>
        {g.l1.map((i) => <L1Word key={i} i={i} />)}
      </div>
      {g.pill ? <Pill idx={g.pill} /> : null}
      {g.heavy ? <Heavy idx={g.heavy} bar={g.bar} swing={g.swing} ring={g.ring} /> : null}
      {g.tag ? <div style={{fontWeight: 400, fontSize: 34, letterSpacing: -1, color: 'rgba(243,247,255,.85)', marginTop: 2}}>{g.tag.map((i) => <L1Word key={i} i={i} />)}</div> : null}
    </div>
  );
};
