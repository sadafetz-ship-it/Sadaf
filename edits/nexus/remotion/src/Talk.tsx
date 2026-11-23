import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT} from './theme';
import {BEHIND_NAMES, cameraZoom, f, JUMP_CUT, SCENES, tw} from './timing';
import {BottomGlow, CardGrid, Plus} from './ui';
import {PillTag} from './Pixel';
import {bloomIn, Comet, GLOW, GLOW_FILL, glowReveal, InkLine, ScriptPixels, whipIn, zoomDropIn} from './CardFx';
import {StackTiles} from './Extras';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Program name behind the head: ink line → bloom (blur 16→0, brightness 1.6→1, scale 1.08→1) + Scripts pixels, pill tag + cursor. */
/**
 * NEXUS in the "Make better Scripts" style (user reference, recoloured blue): one heavy SOLID-colour word with a soft
 * same-colour bloom, small words sitting above each end ("Welcome" / "to"), small outlined squares at both sides,
 * chunky stair-step pixel clusters. Entry: ink line → bloom (blur 16→0, brightness 1.6→1, scale 1.08→1).
 */
const BLUE = '#2F7BFF';
const ScriptsName: React.FC<{name: string; left: string; right: string; t: number; end: number}> = ({name, left, right, t, end}) => {
  const frame = useCurrentFrame();
  const at = f(t) - 1;
  if (frame < at - 6 || frame > f(end) + 4) return null;
  const size = 250;
  const out = interpolate(frame, [f(end) - 2, f(end) + 4], [1, 0], cl);
  const b = bloomIn(frame, at, 10);
  const small = (txt: string, d: number): React.CSSProperties => ({position: 'absolute', top: -58, font: `500 64px ${FONT.ui}`, letterSpacing: -2, color: C.mist,
    textShadow: '0 2px 14px rgba(0,0,0,.6)', opacity: tw(frame, at + d, 6, 0, 1), transform: `translateY(${tw(frame, at + d, 8, 14, 0)}px)`});
  const marker = (side: 'left' | 'right'): React.CSSProperties => ({position: 'absolute', top: '50%', [side]: -78, width: 34, height: 34, marginTop: -10,
    borderRadius: 9, border: `3px solid ${C.lilac}`, opacity: 0.85 * tw(frame, at + 4, 6, 0, 1), boxShadow: `0 0 10px rgba(63,224,255,.45)`});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 560 - size, textAlign: 'center', zIndex: 2, opacity: out, whiteSpace: 'nowrap',
      transform: `scale(${1 + Math.max(0, frame - at) * 0.0006})`}}>
      <div style={{position: 'relative', display: 'inline-block'}}>
        <span style={{...small(left, 2), left: 6}}>{left}</span>
        <span style={{...small(right, 4), right: 6}}>{right}</span>
        <span style={marker('left')} /><span style={marker('right')} />
        <ScriptPixels at={at} w={name.length * size * 0.72} h={size} seed={`sc${name}`} size={44} cols={[BLUE, C.violet, C.blue, '#8FD0FF', BLUE]} />
        <div style={{display: 'inline-block', transformOrigin: '50% 70%', ...b,
          filter: `${b.filter} drop-shadow(0 0 10px rgba(47,123,255,.55)) drop-shadow(0 0 34px rgba(47,123,255,.35))`,
          font: `800 ${size}px ${FONT.display}`, letterSpacing: '-0.06em', lineHeight: 0.9, color: BLUE}}>{name}</div>
      </div>
    </div>
  );
};

const BehindName: React.FC<{name: string; tag: string; t: number; end: number}> = ({name, tag, t, end}) => {
  const frame = useCurrentFrame();
  const at = f(t) - 1;
  if (frame < at - 6 || frame > f(end) + 4) return null;
  const size = Math.min(250, Math.floor(900 / (name.length * 0.8)));
  const drift = 1 + Math.max(0, frame - at) * 0.0006;
  const out = interpolate(frame, [f(end) - 2, f(end) + 4], [1, 0], cl);
  const b = bloomIn(frame, at, 10);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 555 - size, textAlign: 'center', zIndex: 2, transform: `scale(${drift})`,
      opacity: out, whiteSpace: 'nowrap'}}>
      <div style={{position: 'relative', font: `600 ${size}px ${FONT.display}`, letterSpacing: '-0.045em', lineHeight: 0.9}}>
        <ScriptPixels at={at} w={name.length * size * 0.62} h={size} seed={`bn${name}`} size={34} />
        <div style={{display: 'inline-block', transformOrigin: '50% 70%', ...b, filter: `${b.filter} ${GLOW}`}}>
          <span style={{background: GLOW_FILL, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{name}</span>
        </div>
      </div>
      {frame >= at + 6 && <div style={{position: 'absolute', left: 0, right: 0, top: -84, textAlign: 'center'}}><PillTag text={tag} at={at + 6} /></div>}
    </div>
  );
};

/** Glass card body in the Nexus look (navy ink, ice border, bright bottom edge, pooled cyan glow, faint grid). */
const cardBody: React.CSSProperties = {
  position: 'absolute', borderRadius: 52, overflow: 'hidden', whiteSpace: 'nowrap', color: C.mist,
  background: 'linear-gradient(180deg,#16213F,#0B1226 55%,#080D1C)', border: '2px solid rgba(181,243,255,.55)',
  boxShadow: '0 30px 60px -20px rgba(63,224,255,.45), inset 0 -3px 0 rgba(181,243,255,.8), 0 0 0 1px rgba(0,0,0,.4)',
};
const gold: React.CSSProperties = {background: GLOW_FILL, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'};

/** "3 different programs": three tiles, each brought in by a comet and developing from a white flash (comet + glow reveal). */
const LABELS = ['LAUNCHPAD', 'PRO', 'MASTERY'];
const ThreeTiles: React.FC = () => {
  const frame = useCurrentFrame();
  const S = f(7.34), END = f(9.95);
  if (frame < S - 10 || frame >= END) return null;
  const times = [f(7.34), f(7.5), f(7.74)];
  const out = interpolate(frame, [END - 6, END], [1, 0], cl);
  return (
    <>
      {times.map((t, i) => {
        const x = 90 + i * 310, y = 900 + (i === 1 ? 0 : 20), rot = [-5, 0, 5][i];
        const gr = glowReveal(frame, t);
        return (
          <React.Fragment key={i}>
            <Comet d={`M${[-40, 1120, 1120][i]} ${[1060, 760, 1080][i]} Q ${[120, 760, 1040][i]} ${[1080, 820, 1120][i]} ${x + 140} ${y + 140}`} at={t - 8} dur={8} />
            <div style={{...cardBody, left: x, top: y, width: 280, height: 280, zIndex: 8, opacity: out * (gr.style.opacity as number),
              transform: `rotate(${rot}deg) ${gr.style.transform}`, boxShadow: `${cardBody.boxShadow}, ${gr.style.boxShadow}`}}>
              <CardGrid /><BottomGlow c1={C.lilac} c2="rgba(63,224,255,.5)" strength={0.7} />
              <div style={{position: 'relative', textAlign: 'center', marginTop: 50, font: `600 110px ${FONT.display}`, letterSpacing: -6, filter: GLOW}}>
                <span style={gold}>0{i + 1}</span>
              </div>
              <div style={{position: 'relative', textAlign: 'center', font: `500 26px ${FONT.ui}`, letterSpacing: '.12em', color: C.lilac}}>{LABELS[i]}</div>
              <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: gr.whiteness}} />
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

/** Range card: label, "$a → $b /mo", progress bar whose thumb travels on the spoken numbers. Look fixed; motion per recipe. */
const RangeCard: React.FC<{label: string; a: string; b: string; inAt: number; outAt: number; fill: [number, number, number, number]; motion: 'whip' | 'drop'}> = ({
  label, a, b, inAt, outAt, fill, motion,
}) => {
  const frame = useCurrentFrame();
  const S = f(inAt), E = f(outAt);
  if (frame < S || frame > E + 6) return null;
  const m = motion === 'whip' ? whipIn(frame, S, {from: 1, rot: -2}) : zoomDropIn(frame, S, {rot: 2, dx: -120, dy: 220, from: 1.3});
  const out = interpolate(frame, [E - 1, E + 5], [1, 0], cl);
  const [t0, t1, p0, p1] = fill;
  const p = interpolate(frame, [f(t0), f(t1)], [p0, p1], {...cl, easing: (x) => 1 - Math.pow(1 - x, 3)});
  const TRACK = 684;
  return (
    <div style={{...cardBody, left: 150, top: 880, width: 780, height: 330, zIndex: 8, ...m,
      opacity: (m.opacity as number) * out, filter: `${m.filter} blur(${(1 - out) * 18}px)`}}>
      <CardGrid /><BottomGlow c1={C.lilac} c2="rgba(63,224,255,.5)" strength={0.8} />
      <div style={{position: 'absolute', left: 48, top: 40, font: `500 28px ${FONT.ui}`, letterSpacing: '.12em', color: C.lilac}}>{label}</div>
      <div style={{position: 'absolute', left: 48, top: 84, font: `600 96px ${FONT.display}`, letterSpacing: -4, filter: GLOW}}>
        <span style={gold}>{a}</span> <span style={{color: C.blue, fontWeight: 300}}>→</span> <span style={gold}>{b}</span>
        <span style={{font: `300 40px ${FONT.ui}`, color: C.mist, letterSpacing: 0}}> /mo</span>
      </div>
      <div style={{position: 'absolute', left: 48, top: 236, width: TRACK, height: 22, borderRadius: 12, background: 'rgba(91,108,255,.3)'}} />
      <div style={{position: 'absolute', left: 48, top: 236, width: TRACK * p, height: 22, borderRadius: 12,
        background: `linear-gradient(90deg,${C.blue},${C.violet})`, boxShadow: `0 0 20px ${C.violet}`}} />
      <div style={{position: 'absolute', left: 48 + TRACK * p - 21, top: 226, width: 42, height: 42, borderRadius: '50%', background: '#fff',
        boxShadow: `0 0 24px ${C.violet}`}} />
    </div>
  );
};

/** Footage, names behind the head, speaker cut-out, and the talking-head graphics. */
export const Talk: React.FC = () => {
  const frame = useCurrentFrame();
  const z = cameraZoom(frame);
  // shot entry at every return to the talking head (incl. the jump cut): scale 1.12 → 1, blur 28 → 0, 5 f
  const entries = SCENES.filter((s) => s.kind === 'talk' && s.start > 0).map((s) => f(s.start));
  const e = entries.filter((x) => frame >= x && frame < x + 6).pop();
  const entryScale = e !== undefined ? tw(frame, e, 5, 1.12, 1) : 1;
  const entryBlur = e !== undefined ? tw(frame, e, 5, 28, 0) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${z * entryScale})`, transformOrigin: '50% 35%', filter: `blur(${entryBlur}px)`}}>
        <OffthreadVideo src={staticFile('raw.mp4')} muted />
        {BEHIND_NAMES.map((b) => b.name === 'NEXUS'
          ? <ScriptsName key={b.name} name="Nexus" left="Welcome" right="to" t={b.t} end={b.end} />
          : <BehindName key={b.name} {...b} />)}
        <AbsoluteFill style={{zIndex: 3}}>
          <OffthreadVideo src={staticFile('speaker_cutout.webm')} transparent muted />
        </AbsoluteFill>
        {/* neutral darkening only (no colour change): keeps the purple room as filmed, lifts caption contrast */}
        <AbsoluteFill style={{zIndex: 4, background: 'linear-gradient(180deg,rgba(0,0,0,.25) 0%,rgba(0,0,0,0) 16%,rgba(0,0,0,0) 58%,rgba(0,0,0,.55) 74%,rgba(0,0,0,.8) 100%)'}} />
      </AbsoluteFill>
      <ThreeTiles />
      <InkLine x={540} y={880} at={f(12.6)} h={160} />
      <RangeCard label="MEDIA LAUNCHPAD" a="$0" b="$10K" inAt={12.6} outAt={15.55} fill={[13.44, 14.1, 0, 0.22]} motion="whip" />
      <InkLine x={540} y={880} at={f(16.6)} h={160} />
      <RangeCard label="MEDIA PRO" a="$10K" b="$50K" inAt={16.6} outAt={19.35} fill={[17.32, 18.0, 0.22, 0.6]} motion="drop" />
      {/* number tiles stacked beside the head: newest in front */}
      <StackTiles times={[f(11.04), f(16.0), f(21.48)]} show={[[f(JUMP_CUT), f(23.1)]]} />
      {/* sparkles on name moments */}
      {BEHIND_NAMES.map((b, i) => i > 0 && frame >= f(b.t) - 2 && frame < f(b.end) && (
        <React.Fragment key={i}>
          <Plus x={[110, 940, 120, 930][i]} y={[250, 300, 230, 280][i]} size={46} at={f(b.t)} color={C.violet} />
          <Plus x={[930, 110, 920, 120][i]} y={[520, 560, 540, 560][i]} size={36} at={f(b.t) + 2} color={C.lilac} rot={15} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
