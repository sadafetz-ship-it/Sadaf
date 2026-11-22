import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, metallic} from './theme';
import {CAPTION_GROUPS, f, Group, pop, Tok, tw} from './timing';
import {Dot} from './ui';

/** Light word: blur 20 → 0, y +10 → 0, opacity 0 → 1 in 8 f, on its spoken frame. */
const LightWord: React.FC<{tok: Tok}> = ({tok}) => {
  const frame = useCurrentFrame();
  const at = f(tok.t) - 1;
  return (
    <span style={{display: 'inline-block', marginRight: '0.24em', opacity: tw(frame, at, 6, 0, 1),
      filter: `blur(${tw(frame, at, 8, 20, 0)}px)`, transform: `translateY(${tw(frame, at, 8, 10, 0)}px)`}}>{tok.text}</span>
  );
};

/** Script word(s): written on left → right with a soft mask wipe. */
const Script: React.FC<{toks: Tok[]}> = ({toks}) => {
  const frame = useCurrentFrame();
  if (!toks.length) return null;
  const at = f(toks[0].t) - 1;
  const dur = 8 + 4 * toks.length;
  const p = tw(frame, at, dur, -20, 120);
  return (
    <span style={{font: `400 132px ${FONT.script}`, color: C.lilac, marginRight: 36, padding: '0 6px', position: 'relative', top: 10,
      display: 'inline-block', filter: 'drop-shadow(0 0 14px rgba(128,80,232,.8))',
      WebkitMaskImage: `linear-gradient(90deg,#000 ${p - 20}%,transparent ${p}%)`}}>
      {toks.map((t) => t.text).join(' ')}
    </span>
  );
};

/** Heavy word(s): each pops 0 → 115 → 100 % (7 f) on its spoken frame; rose dot 3 f after the last. */
const Heavy: React.FC<{toks: Tok[]; dot: boolean}> = ({toks, dot}) => {
  const frame = useCurrentFrame();
  if (!toks.length) return null;
  const last = f(toks[toks.length - 1].t);
  return (
    <div style={{font: `600 ${Math.min(156, Math.floor(1872 / toks.map((t) => t.text).join(' ').length))}px ${FONT.display}`, letterSpacing: -7, lineHeight: 1, marginTop: -4,
      filter: 'drop-shadow(0 4px 20px rgba(25,13,50,.8))'}}>
      {toks.map((t, i) => {
        const at = f(t.t) - 1;
        return (
          <span key={i} style={{display: 'inline-block', transform: `scale(${pop(frame, at, 7)})`, transformOrigin: '50% 70%',
            marginRight: i < toks.length - 1 ? '0.17em' : 0}}>
            <span style={{background: metallic, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{t.text}</span>
          </span>
        );
      })}
      {dot && <Dot at={last + 3} />}
    </div>
  );
};

const CaptionGroup: React.FC<{g: Group}> = ({g}) => {
  const frame = useCurrentFrame();
  const out = f(g.end);
  const exitO = interpolate(frame, [out, out + 5], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exitB = interpolate(frame, [out, out + 5], [0, 20], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (frame < f(g.start) - 1 || frame > out + 6) return null;
  const light = {font: `300 58px ${FONT.display}`, letterSpacing: -2, lineHeight: 1.1, textShadow: '0 2px 18px rgba(25,13,50,.9)'};
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 270, textAlign: 'center', color: C.mist, zIndex: 50,
      opacity: exitO, filter: `blur(${exitB}px)`}}>
      {g.l1.length > 0 && <div style={{...light, maxWidth: 900, margin: '0 auto', textWrap: 'balance'} as React.CSSProperties}>{g.l1.map((t, i) => <LightWord key={i} tok={t} />)}</div>}
      {(g.s.length > 0 || g.l2.length > 0) && (
        <div style={{...light, lineHeight: 1, marginTop: -6}}>
          <Script toks={g.s} />
          {g.l2.map((t, i) => <LightWord key={i} tok={t} />)}
        </div>
      )}
      <Heavy toks={g.h} dot={g.dot} />
    </div>
  );
};

export const Captions: React.FC = () => (
  <>{CAPTION_GROUPS.map((g, i) => <CaptionGroup key={i} g={g} />)}</>
);
