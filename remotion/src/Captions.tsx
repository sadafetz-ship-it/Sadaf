import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {C, FONT, metallic} from './theme';
import {CAPTION_GROUPS, f, Fx, Group, Tok, tw} from './timing';
import {Arrow, BoxFlash, HighlightBar, RingAround} from './Extras';
import {Dot} from './ui';
import {PixelDissolve, PixelLoader, smearIn, Swoosh} from './Pixel';

/** Light word: blur 20 → 0, y +10 → 0, opacity 0 → 1 in 8 f, on its spoken frame. */
const LightWord: React.FC<{tok: Tok; box?: boolean}> = ({tok, box}) => {
  const frame = useCurrentFrame();
  const at = f(tok.t) - 1;
  return (
    <span style={{display: 'inline-block', marginRight: '0.24em', opacity: tw(frame, at, 6, 0, 1),
      color: interpolateColors(frame, [at + 2, at + 12], [C.lilac, C.mist]),
      position: 'relative', filter: `blur(${tw(frame, at, 8, 20, 0)}px)`, transform: `translateY(${tw(frame, at, 8, 10, 0)}px)`}}>
      {box && <BoxFlash at={at + 3} />}{tok.text}</span>
  );
};

/** Script word(s): written on left → right with a soft mask wipe. */
const Script: React.FC<{toks: Tok[]; fx: Fx}> = ({toks, fx}) => {
  const frame = useCurrentFrame();
  if (!toks.length) return null;
  const at = f(toks[0].t) - 1;
  const dur = 8 + 4 * toks.length;
  const p = tw(frame, at, dur, -20, 120);
  return (
    <>{fx.arrowS && <Arrow at={at} size={56} />}<span style={{font: `400 132px ${FONT.script}`, color: C.lilac, marginRight: 24, padding: '40px 18px 34px 12px', margin: '-40px 6px -34px -12px', position: 'relative', top: 10,
      display: 'inline-block', filter: 'drop-shadow(0 0 14px rgba(128,80,232,.8))',
      WebkitMaskImage: `linear-gradient(90deg,#000 ${p - 20}%,transparent ${p}%)`}}>
      {toks.map((t) => t.text).join(' ')}
    </span></>
  );
};

/** Heavy word(s): pixel loader (5 px squares, 2 f apart) then the word smears in L → R on its spoken frame (ref R2). */
const Heavy: React.FC<{toks: Tok[]; dot: boolean; seed: string; fx: Fx}> = ({toks, dot, seed, fx}) => {
  const frame = useCurrentFrame();
  if (!toks.length) return null;
  const size = Math.min(156, Math.floor(1872 / toks.map((t) => t.text).join(' ').length));
  const first = f(toks[0].t) - 1;
  const last = f(toks[toks.length - 1].t);
  const text = toks.map((t) => t.text).join(' ');
  const tilt = fx.tilt ? fx.tilt + fx.tilt * 0.8 * Math.sin((frame - first) / 2.2) * Math.exp(-Math.max(0, frame - first) / 8) : 0;
  return (
    <div style={{position: 'relative', font: `600 ${size}px ${FONT.display}`, letterSpacing: -7, lineHeight: 1, marginTop: -4}}>
      <PixelLoader land={first} size={Math.round(size * 0.36)} gap={Math.round(size * 0.07)} seed={seed} />
      <div style={{display: 'inline-block', position: 'relative', filter: 'drop-shadow(0 4px 20px rgba(25,13,50,.8))', transform: `rotate(${tilt}deg)`}}>
        {fx.ring && <RingAround at={last + 2} w={text.length * size * 0.5} h={size} />}
        {fx.bar && <HighlightBar at={last + 2} />}
        {fx.arrowH && <Arrow at={first} size={size * 0.5} />}
        {toks.map((t, i) => {
          const at = f(t.t) - 1;
          return (
            <span key={i} style={{display: 'inline-block', transformOrigin: '0% 70%', marginRight: i < toks.length - 1 ? '0.17em' : 0, ...smearIn(frame, at)}}>
              <span style={{background: metallic, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{t.text}</span>
            </span>
          );
        })}
        {dot && <Dot at={last + 4} />}
      </div>
    </div>
  );
};

const CaptionGroup: React.FC<{g: Group; i: number}> = ({g, i}) => {
  const frame = useCurrentFrame();
  const out = f(g.end);
  const exitO = interpolate(frame, [out - 1, out + 3], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exitB = interpolate(frame, [out - 1, out + 3], [0, 24], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (frame < f(g.start) - 1 || frame > out + 6) return null;
  const light = {font: `300 58px ${FONT.display}`, letterSpacing: -2, lineHeight: 1.1, textShadow: '0 2px 18px rgba(25,13,50,.9)'};
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 270, textAlign: 'center', color: C.mist, zIndex: 50,
      opacity: exitO, filter: `blur(${exitB}px)`}}>
      {g.l1.length > 0 && <div style={{...light, maxWidth: 900, margin: '0 auto', textWrap: 'balance'} as React.CSSProperties}>{g.l1.map((t, i) => <LightWord key={i} tok={t} box={t.text === g.fx.box} />)}</div>}
      {(g.s.length > 0 || g.l2.length > 0) && (
        <div style={{...light, lineHeight: 1, marginTop: -6}}>
          <Script toks={g.s} fx={g.fx} />
          {g.l2.map((t, i) => <LightWord key={i} tok={t} box={t.text === g.fx.box} />)}
        </div>
      )}
      <Heavy toks={g.h} dot={g.dot} seed={`h${i}`} fx={g.fx} />
    </div>
  );
};

const SECTION = /^(first|second|third|and)$/i;

export const Captions: React.FC = () => (
  <>
    {CAPTION_GROUPS.map((g, i) => <CaptionGroup key={i} g={g} i={i} />)}
    {/* pixel dissolve on every caption change (ref R1) */}
    {CAPTION_GROUPS.slice(1).map((g, i) => <PixelDissolve key={`d${i}`} at={f(g.start)} seed={`pd${i}`} />)}
    {/* swoosh streak brings in each "First / Second / Third / And lastly" (ref R2) */}
    {CAPTION_GROUPS.filter((g) => g.l1.length && SECTION.test(g.l1[0].text.replace(/[^a-z]/gi, ''))).map((g, i) => (
      <Swoosh key={`s${i}`} at={f(g.start) + 2} y={1290} />
    ))}
  </>
);
