// From the user's house edit (16:9, Golden Hour accent, Nov 2026). Drop into a Remotion src/ with theme.ts (C, GLASS, HEAVY_FILL, HEAVY_FILTER).
// Lower-third caption lockup: karaoke L1, Golden Hour script pill, low-glow heavy word + dot + highlight bar, 3D swing variant. Needs words.ts [word,startFrame,endFrame][].
// Lower-third caption lockup: L1 setup (Inter Display Light, karaoke) / L2 Golden-Hour script pill / L3 heavy (low glow, dot, bar).
import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {WORDS} from './words';
import {C, HEAVY_FILL, HEAVY_FILTER} from './theme';
import {back, bloomIn, cl, InkLine, prog, ScriptPixels, wordIn} from './fx';

type Group = {start: number; end: number; l1: number[]; pill?: number[]; heavy?: number[]; tag?: number[]; bar?: boolean; swing?: boolean};
const R = (a: number, b: number) => Array.from({length: b - a + 1}, (_, i) => a + i);

export const GROUPS: Group[] = [
  {start: 0, end: 48, l1: R(0, 3)},
  {start: 48, end: 80, l1: R(8, 12)},
  {start: 80, end: 135, l1: R(13, 16), pill: [17], heavy: [18], tag: [19, 20], bar: true},
  {start: 135, end: 177, l1: R(21, 25), pill: [26, 27], heavy: [28]},
  {start: 177, end: 213, l1: R(29, 31), heavy: [32, 33], bar: true},
  {start: 213, end: 291, l1: R(34, 44), heavy: [45]},
  {start: 291, end: 328, l1: R(46, 49), pill: R(50, 52)},
  {start: 328, end: 373, l1: R(53, 56), pill: [57], heavy: [58]},
  {start: 373, end: 433, l1: R(59, 66), pill: [67], heavy: [68]},
  {start: 433, end: 470, l1: R(69, 73)},
  {start: 470, end: 516, l1: R(74, 77), pill: [78]},
  {start: 516, end: 560, l1: R(79, 81), heavy: [82], bar: true, swing: true},
];

/** Frames where something lands (used by the SFX cue sheet). */
export const HEAVY_FRAMES = GROUPS.filter((g) => g.heavy).map((g) => WORDS[g.heavy![0]][1]);

const L1Word: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const [w, s] = WORDS[i];
  if (f < s) return <span style={{display: 'inline-block', opacity: 0}}>{w}&nbsp;</span>;
  const color = interpolateColors(f, [s, s + 3, s + 12], [C.amber, C.amber, C.cream]);
  return <span style={{...wordIn(f, s), color}}>{w}&nbsp;</span>;
};

const Pill: React.FC<{idx: number[]}> = ({idx}) => {
  const f = useCurrentFrame();
  const at = WORDS[idx[0]][1];
  const endW = Math.max(WORDS[idx[idx.length - 1]][2], at + 10);
  if (f < at - 1) return null;
  const sc = interpolate(f, [at - 1, at + 4, at + 8], [0.6, 1.06, 1], cl);
  const reveal = interpolate(f, [at + 1, endW], [0, 100], cl); // left→right write-on
  const text = idx.map((i) => WORDS[i][0]).join(' ');
  return (
    <div style={{display: 'inline-block', borderRadius: 999, padding: '2px 34px 10px', transform: `scale(${sc})`, opacity: interpolate(f, [at - 1, at + 2], [0, 1], cl),
      background: 'linear-gradient(180deg,#FFE58A 0%,#FFC000 55%,#F0913A 100%)',
      boxShadow: '0 0 0 2px rgba(255,244,222,.35) inset,0 0 22px rgba(255,192,0,.6),0 0 50px rgba(235,136,88,.45)'}}>
      <span style={{fontFamily: 'Allura', color: C.ink, fontSize: 76, lineHeight: 1, display: 'inline-block', transform: 'translateY(6px)',
        padding: '0 60px', margin: '0 -60px', clipPath: `inset(-60px ${100 - reveal}% -60px 0)`}}>{text}</span>
    </div>
  );
};

const Heavy: React.FC<{idx: number[]; bar?: boolean; swing?: boolean}> = ({idx, bar, swing}) => {
  const f = useCurrentFrame();
  const at = WORDS[idx[0]][1];
  if (f < at - 4) return null;
  const text = idx.map((i) => WORDS[i][0]).join(' ').replace(/[.,?!]+$/, '');
  const size = Math.min(118, Math.floor(1404 / text.length));
  const wEst = text.length * size * 0.52;
  const b = bloomIn(f, at);
  const sw = swing
    ? {transform: `perspective(900px) rotateY(${interpolate(f, [at, at + 8, at + 14], [75, -18, -10], {...cl, easing: back})}deg) rotateZ(${interpolate(f, [at, at + 10], [-12, -3], cl)}deg)`}
    : {};
  const barP = prog(f, at + 4, at + 12);
  return (
    <div style={{position: 'relative', fontWeight: 620, fontSize: size, letterSpacing: -5, lineHeight: 0.95, whiteSpace: 'nowrap', isolation: 'isolate', ...sw}}>
      <InkLine x={wEst / 2} y={10} at={at} h={120} />
      {bar ? (
        <span style={{position: 'absolute', left: -10, right: -10, bottom: '0.12em', height: '0.26em', borderRadius: 6, zIndex: -1, transformOrigin: 'left',
          transform: `scaleX(${barP})`, background: 'linear-gradient(90deg,#6B3410,#EB8858 30%,#FFC000 80%,#FFD36B)', boxShadow: '0 0 26px rgba(255,170,40,.6)', opacity: 0.95}} />
      ) : null}
      <span style={{display: 'inline-block', ...b}}>
        <span style={{background: HEAVY_FILL, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: HEAVY_FILTER}}>{text}</span>
      </span>
      <span style={{display: 'inline-block', width: '0.15em', height: '0.15em', borderRadius: '50%', background: C.amber, marginLeft: '0.05em',
        boxShadow: '0 0 10px rgba(255,192,0,.7)', transform: `scale(${interpolate(f, [at + 6, at + 10, at + 13], [0, 1.4, 1], cl)})`}} />
      <ScriptPixels at={at} x={0} y={0} w={wEst} h={size} seed={`hv${at}`} size={Math.round(size * 0.2)}
        anchors={[[-0.16, 0.15], [-0.12, 0.7], [1.06, 0.05], [1.08, 0.65], [0.15, 1.02], [0.82, 1.02]]} />
    </div>
  );
};

export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const g = GROUPS.find((x) => f >= x.start && f < x.end);
  if (!g) return null;
  const ex = interpolate(f, [g.end - 4, g.end], [0, 1], cl);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2,
      opacity: 1 - ex, filter: `blur(${10 * ex}px)`}}>
      <div style={{maxWidth: 1200, fontWeight: 300, fontSize: 46, letterSpacing: -1.4, color: C.cream, lineHeight: 1.08, textShadow: '0 2px 18px rgba(0,0,0,.55)'}}>
        {g.l1.map((i) => <L1Word key={i} i={i} />)}
      </div>
      {g.pill ? <Pill idx={g.pill} /> : null}
      {g.heavy ? <Heavy idx={g.heavy} bar={g.bar} swing={g.swing} /> : null}
      {g.tag ? (
        <div style={{fontWeight: 400, fontSize: 36, letterSpacing: -1, color: 'rgba(255,244,222,.85)', marginTop: 4}}>
          {g.tag.map((i) => <L1Word key={i} i={i} />)}
        </div>
      ) : null}
    </div>
  );
};
