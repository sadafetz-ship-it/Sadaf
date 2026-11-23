// Behind-the-head titles (Scripts lockup) for the hook ($30K BUSINESS) and the reveal (DIGITAL PRODUCTS).
// `Behind*` renders under the speaker cut-out; `Front*` renders above it.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, GRAD} from './theme';
import {bloomIn, cl, exitStyle, InkLine, OutlinePill, pop, prog, ScriptPixels, wordIn} from './fx';

const gradText: React.CSSProperties = {background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'};

/** Scripts slide-in: ink line drop → slide from −90 px with blur 16→0 (15 f) + motion-blur ghost collapsing (26 f). */
const ScriptsWord: React.FC<{text: string; at: number; size: number; style?: React.CSSProperties; from?: 1 | -1; grad?: boolean}> = ({text, at, size, style, from = -1, grad = true}) => {
  const f = useCurrentFrame();
  if (f < at - 6) return null;
  const p = prog(f, at, at + 15);
  const g = prog(f, at, at + 26);
  const base: React.CSSProperties = {fontFamily: 'Inter Display', fontWeight: 800, fontSize: size, lineHeight: 0.86, letterSpacing: -size * 0.045, whiteSpace: 'nowrap',
    ...(grad ? gradText : {color: C.mist})};
  const idle = Math.sin((f - at) / 18) * 3;
  return (
    <div style={{position: 'absolute', ...style}}>
      <InkLine x={size * 0.6} y={0} at={at} h={160} color={C.violet} />
      {f >= at ? (
        <>
          <div style={{...base, position: 'absolute', left: 0, top: 0, opacity: (0.55 - 0.3 * g) * (1 - prog(f, at + 22, at + 30)),
            transform: `translateX(${-from * (60 - 42 * g)}px)`, filter: 'blur(6px)'}}>{text}</div>
          <div style={{...base, position: 'relative', opacity: interpolate(f, [at, at + 3], [0, 1], cl), transform: `translateX(${from * 90 * (1 - p) + idle}px)`,
            filter: `blur(${16 * (1 - p)}px) drop-shadow(0 0 16px rgba(147,93,249,.45))`}}>{text}</div>
        </>
      ) : null}
    </div>
  );
};

const Square: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', left: x, top: y, width: 26, height: 26, border: `3px solid ${C.mist}`, ...pop(f, at)}} />;
};

const Setup: React.FC<{text: string; at: number; style: React.CSSProperties; accent?: boolean}> = ({text, at, style, accent}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return <div style={{position: 'absolute', fontFamily: 'Inter Display', fontWeight: 300, fontSize: 60, letterSpacing: -2, whiteSpace: 'nowrap',
    color: accent ? C.lilac : C.mist, textShadow: accent ? '0 0 18px rgba(147,93,249,.8)' : '0 2px 18px rgba(0,0,0,.6)', ...wordIn(f, at), ...style}}>{text}</div>;
};

const HOOK_EXIT = 150;
export const BehindHook: React.FC = () => {
  const f = useCurrentFrame();
  if (f > HOOK_EXIT + 10) return null;
  return (
    <div style={{position: 'absolute', inset: 0, ...exitStyle(f, HOOK_EXIT)}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 66, display: 'flex', justifyContent: 'center', gap: 18}}>
        {[['I', 0], ['left', 5], ['my', 10]].map(([t, a]) => (
          <span key={t as string} style={{fontFamily: 'Inter Display', fontWeight: 300, fontSize: 64, letterSpacing: -2, color: t === 'my' ? C.lilac : C.mist,
            ...(f >= (a as number) ? wordIn(f, a as number) : {opacity: 0, display: 'inline-block'})}}>{t}</span>
        ))}
      </div>
      <ScriptsWord text="$30K" at={19} size={300} style={{left: 150, top: 140}} />
      <Square x={118} y={236} at={22} />
      <ScriptPixels at={19} x={150} y={140} w={780} h={260} seed="h30" size={40} life={34}
        anchors={[[-0.12, 0.7], [-0.05, 0.92], [0.98, -0.06], [1.02, 0.2]]} />
    </div>
  );
};

export const FrontHook: React.FC = () => {
  const f = useCurrentFrame();
  if (f > HOOK_EXIT + 10) return null;
  const strike = prog(f, 47, 55);
  const goneReveal = interpolate(f, [56, 74], [0, 100], cl);
  return (
    <div style={{position: 'absolute', inset: 0, ...exitStyle(f, HOOK_EXIT)}}>
      {f >= 41 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 404, textAlign: 'center', ...bloomIn(f, 41)}}>
          <span style={{fontFamily: 'Inter Display', fontWeight: 800, fontSize: 150, letterSpacing: -8, background: 'linear-gradient(180deg,#fff 30%,#E6E4FF 70%,#C3C6FF)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 10px rgba(120,130,252,.45)) drop-shadow(0 4px 18px rgba(0,0,0,.5))'}}>BUSINESS</span>
        </div>
      ) : null}
      {/* light-strike slashes through $30K */}
      <div style={{position: 'absolute', left: 96, top: 252, width: 900, height: 22, borderRadius: 12, transformOrigin: 'left center',
        transform: `rotate(-9deg) scaleX(${strike})`, opacity: strike > 0 ? 1 : 0,
        background: `linear-gradient(90deg,${C.magenta},#F2EEFF 60%,${C.magenta})`, boxShadow: `0 0 24px ${C.magenta},0 0 50px rgba(211,91,197,.6)`}} />
      {f >= 56 ? <div style={{position: 'absolute', left: 800, top: 540, fontFamily: 'Allura', fontSize: 110, color: C.mist, textShadow: `0 0 18px ${C.magenta}`,
        transform: 'rotate(-8deg)', padding: '0 60px', margin: '0 -60px', clipPath: `inset(-60px ${100 - goneReveal}% -60px 0)`}}>gone.</div> : null}
      {f >= 30 ? <div style={{position: 'absolute', left: 780, top: 700, ...pop(f, 30)}}><OutlinePill dot={C.magenta} style={{fontSize: 24, fontWeight: 700, letterSpacing: 1.5,
        background: 'rgba(7,10,31,.85)'}}>TRUE STORY</OutlinePill></div> : null}
    </div>
  );
};

const REVEAL_EXIT = 818;
export const BehindReveal: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 744 || f > REVEAL_EXIT + 10) return null;
  return (
    <div style={{position: 'absolute', inset: 0, ...exitStyle(f, REVEAL_EXIT)}}>
      <Setup text="selling" at={746} style={{left: 96, top: 30}} />
      <Setup text="low-ticket" at={758} style={{right: 96, top: 30}} accent />
      <ScriptsWord text="DIGITAL" at={781} size={170} style={{left: 70, top: 100}} />
      <ScriptsWord text="PRODUCTS" at={794} size={170} style={{right: 60, top: 236}} from={1} />
      <Square x={36} y={150} at={784} />
      <ScriptPixels at={781} x={70} y={100} w={640} h={150} seed="dg" size={28} life={26} anchors={[[-0.06, 1.15], [1.2, -0.2]]} />
      <ScriptPixels at={794} x={330} y={236} w={690} h={150} seed="pr" size={28} life={26} anchors={[[0.96, 1.05]]} />
    </div>
  );
};
