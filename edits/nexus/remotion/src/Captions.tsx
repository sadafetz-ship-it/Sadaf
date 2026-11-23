import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {C, FONT, metallic} from './theme';
import {CAPTION_GROUPS, f, Fx, Group, Tok, tw} from './timing';
import {Arrow, BoxFlash, HighlightBar, RingAround} from './Extras';
import {Dot} from './ui';
import {Swoosh} from './Pixel';
import {bloomIn, GLOW_CAPTION, GLOW_FILL, InkLine, ScriptPixels} from './CardFx';

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
    <>{fx.arrowS && <Arrow at={at} size={56} />}<span style={{font: `400 132px ${FONT.script}`, color: C.lilac, marginRight: 24, padding: '100px 100px 100px 100px', margin: '-100px -58px -100px -100px', position: 'relative', top: 10,
      display: 'inline-block',
      WebkitMaskImage: `linear-gradient(90deg,#000 ${p - 20}%,transparent ${p}%)`}}>
      <span style={{display: 'inline-block', textShadow: '0 2px 14px rgba(0,0,0,.7)'}}>{toks.map((t) => t.text).join(' ')}</span>
    </span></>
  );
};

/** Heavy word(s): "red Scripts" reveal — accent line drops, word blooms in blurry → sharp with stair-step pixel clusters; purple "Golden Hour" glow. */
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
      <ScriptPixels at={first} w={text.length * size * 0.5} h={size} seed={seed} size={Math.round(size * 0.2)} />
      <div style={{display: 'inline-block', position: 'relative', filter: GLOW_CAPTION, transform: `rotate(${tilt}deg)`}}>
        {fx.ring && <RingAround at={last + 2} w={text.length * size * 0.5} h={size} />}
        {fx.bar && <HighlightBar at={last + 2} />}
        {fx.arrowH && <Arrow at={first} size={size * 0.5} />}
        {toks.map((t, i) => {
          const at = f(t.t) - 1;
          return (
            <span key={i} style={{display: 'inline-block', transformOrigin: '0% 70%', marginRight: i < toks.length - 1 ? '0.17em' : 0, ...bloomIn(frame, at)}}>
              <span style={{background: GLOW_FILL, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{t.text}</span>
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
  const light = {font: `300 58px ${FONT.display}`, letterSpacing: -2, lineHeight: 1.1, textShadow: '0 2px 18px rgba(11,18,38,.9)'};
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

/** Swoosh only on the section openers, placed above the caption block (never through text). */
const SECTION = /^(starting off|and last)$/i;

export const Captions: React.FC = () => (
  <>
    {CAPTION_GROUPS.map((g, i) => <CaptionGroup key={i} g={g} i={i} />)}
    {/* pixel dissolve on every caption change (ref R1) */}
    {/* thin accent line drops onto each heavy word just before it blooms in (red "Scripts" ref) */}
    {CAPTION_GROUPS.filter((g) => g.h.length).map((g, i) => <InkLine key={`il${i}`} x={540} y={1650 - 156} at={f(g.h[0].t) - 1} h={120} />)}
    {/* swoosh streak brings in each "First / Second / Third / And lastly" (ref R2) */}
    {CAPTION_GROUPS.filter((g) => SECTION.test(g.l1.slice(0, 2).map((t) => t.text.replace(/[^a-z]/gi, '')).join(' '))).map((g, i) => (
      <Swoosh key={`s${i}`} at={f(g.start) + 2} y={1110} />
    ))}
  </>
);
