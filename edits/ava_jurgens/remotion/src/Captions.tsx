import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, HEAVYFILL, ACC, FONT, cl, p} from './theme';
import groups from './captions.json';

type W = {w: string; f: number};
type G = {l1: W[]; sc: W[]; hv: W[]; bar?: number};
const GS = groups as G[];

const Word: React.FC<{w: W; frame: number}> = ({w, frame}) => {
  const t = p(frame, w.f, 6);
  const settle = p(frame, w.f, 12);
  return <span style={{display: 'inline-block', marginRight: '0.26em', opacity: t, transform: `translateY(${10 * (1 - t)}px)`,
    filter: `blur(${5 * (1 - t)}px)`, color: settle < 1 ? C.pale : C.white}}>{w.w}</span>;
};

const Group: React.FC<{g: G; start: number; end: number}> = ({g, start, end}) => {
  const frame = useCurrentFrame();
  if (frame < start || frame >= end) return null;
  const out = interpolate(frame, [end - 5, end], [0, 1], cl);
  const hvText = g.hv.map((x) => x.w).join(' ');
  const punct = /[.,?!]$/.test(hvText) ? hvText.slice(-1) : '';
  const hvCore = punct ? hvText.slice(0, -1) : hvText;
  const size = Math.min(150, Math.floor(1650 / Math.max(hvText.length, 1)));
  const hf = g.hv[0].f;
  const hb = p(frame, hf, 9);
  const sf = g.sc.length ? g.sc[0].f : hf;
  const sm = p(frame, sf, 12);
  const dotP = interpolate(frame, [hf + 4, hf + 7, hf + 10], [0, 1.35, 1], cl);
  const bar = p(frame, hf + 5, 9);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 250, textAlign: 'center', fontFamily: FONT,
      opacity: 1 - out, transform: `translateY(${-12 * out}px)`, filter: `blur(${4 * out}px)`}}>
      {g.l1.length > 0 && <div style={{fontWeight: 300, fontSize: 56, letterSpacing: -1.5, lineHeight: 1.12, maxWidth: 900, margin: '0 auto 4px', color: '#fff'}}>
        {g.l1.map((w, i) => <Word key={i} w={w} frame={frame} />)}</div>}
      <div style={{display: 'inline-block', textAlign: 'left', position: 'relative'}}>
        {g.sc.length > 0 && <div style={{fontFamily: 'Allura', fontSize: 118, lineHeight: 0.9, color: C.pale, margin: '0 -100px -18px -82px',
          padding: '0 100px 0 100px', whiteSpace: 'nowrap', filter: 'drop-shadow(0 0 3px rgba(216,255,146,.3))',
          WebkitMaskImage: `linear-gradient(90deg,#000 ${sm * 100}%,transparent ${sm * 100 + 8}%)`,
          maskImage: `linear-gradient(90deg,#000 ${sm * 100}%,transparent ${sm * 100 + 8}%)`}}>{g.sc.map((x) => x.w).join(' ')}</div>}
        <div style={{fontWeight: 600, fontSize: size, letterSpacing: -5, lineHeight: 1.02, position: 'relative', whiteSpace: 'nowrap', isolation: 'isolate',
          opacity: hb, transform: `scale(${1.08 - 0.08 * hb})`, transformOrigin: '30% 60%', filter: `blur(${12 * (1 - hb)}px) brightness(${1.6 - 0.6 * hb})`}}>
          {g.bar ? <div style={{position: 'absolute', left: -6, right: -6, bottom: 6, height: 30, borderRadius: 15, background: ACC, opacity: 0.9,
            boxShadow: '0 0 12px rgba(132,229,114,.5)', zIndex: -1, transform: `scaleX(${bar})`, transformOrigin: 'left'}} /> : null}
          <span style={{background: HEAVYFILL, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.35)) drop-shadow(0 0 5px rgba(216,255,146,.22))'}}>{hvCore}</span>
          {punct && <span style={{display: 'inline-block', color: C.lime, textShadow: '0 0 5px rgba(76,218,180,.45)', transform: `scale(${dotP})`}}>{punct}</span>}
        </div>
      </div>
    </div>
  );
};

export const Captions: React.FC<{hide: [number, number][]}> = ({hide}) => {
  const frame = useCurrentFrame();
  if (hide.some(([a, b]) => frame >= a && frame < b)) return null;
  return <>{GS.map((g, i) => {
    const first = [...g.l1, ...g.sc, ...g.hv][0].f;
    const start = first - 2;
    const lastW = g.hv[g.hv.length - 1].f;
    const nextStart = i + 1 < GS.length ? [...GS[i + 1].l1, ...GS[i + 1].sc, ...GS[i + 1].hv][0].f - 2 : 1230;
    const end = Math.min(nextStart, lastW + 45);
    return <Group key={i} g={g} start={start} end={end} />;
  })}</>;
};
