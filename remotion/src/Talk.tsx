import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT} from './theme';
import {BEHIND_NAMES, cameraZoom, f, pop, SCENES, tw} from './timing';
import {BottomGlow, CardGrid, Chip, Dot, glass, Metallic, Plus} from './ui';
import {PillTag, PixelLoader, smearIn} from './Pixel';
import {ArcText, StackTiles} from './Extras';

const TAGS: Record<string, string> = {DefiLlama: 'DeFi data', CoinGlass: 'Derivatives', CryptoQuant: 'On-chain', Farside: 'ETF flows'};

/** Site name behind the head: pixel loader → smear wipe (ref R2 "price."), pill tag + cursor (ref R1). */
const BehindName: React.FC<{name: string; t: number; end: number}> = ({name, t, end}) => {
  const frame = useCurrentFrame();
  const at = f(t) - 1;
  if (frame < at - 20 || frame > f(end)) return null;
  const drift = 1 + Math.max(0, frame - at) * 0.0006;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', zIndex: 2, transform: `scale(${drift})`}}>
      <div style={{position: 'relative', font: `700 168px ${FONT.display}`, letterSpacing: -9, lineHeight: 1}}>
        <PixelLoader land={at} size={66} gap={12} seed={`bn${name}`} />
        <div style={{display: 'inline-block', transformOrigin: '0% 70%', filter: 'drop-shadow(0 0 30px rgba(128,80,232,.55))', ...smearIn(frame, at, 7)}}>
          <Metallic style={{background: 'linear-gradient(180deg,#FFFFFF 30%,#CFC3F0 75%,#9C8CC9)', WebkitBackgroundClip: 'text'}}>{name}</Metallic>
          <Dot at={at + 5} />
        </div>
      </div>
      {frame >= at + 6 && <div style={{position: 'absolute', left: 0, right: 0, top: -70, textAlign: 'center'}}><PillTag text={TAGS[name]} at={at + 6} /></div>}
    </div>
  );
};

const LOCK = (
  <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth={2}>
    <rect x="4" y="11" width="16" height="10" rx="3" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

/** Hook: small "Classified" card with 4 locked rows (on "websites", 1.82 s → out 2.94 s). */
const ClassifiedCard: React.FC = () => {
  const frame = useCurrentFrame();
  const at = f(1.82), out = f(2.94);
  if (frame < at || frame > out + 8) return null;
  const o = interpolate(frame, [out, out + 6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{...glass({left: 230, width: 620, top: 820, padding: '34px 44px 44px', borderRadius: 44}),
      opacity: tw(frame, at, 6, 0, 1) * o, transform: `translateY(${tw(frame, at, 10, 120, 0) + (1 - o) * 60}px) scale(${tw(frame, at, 10, 0.94, 1)})`,
      filter: `blur(${tw(frame, at, 10, 30, 0) + (1 - o) * 20}px)`, zIndex: 30}}>
      <CardGrid /><BottomGlow />
      <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', font: `500 28px ${FONT.ui}`, color: 'rgba(238,231,255,.6)'}}>
        <span>Classified</span><Chip>4 sites</Chip>
      </div>
      {[300, 240, 330, 210].map((w, i) => (
        <div key={i} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 22, margin: '18px 0',
          opacity: tw(frame, at + 3 + i * 3, 6, 0, 1), transform: `translateX(${tw(frame, at + 3 + i * 3, 8, -30, 0)}px)`}}>
          <span style={{font: `700 28px ${FONT.mono}`, color: C.lilac}}>0{i + 1}</span>{LOCK}
          <div style={{height: 36, width: w, borderRadius: 12, background: 'linear-gradient(90deg,rgba(185,154,245,.4),rgba(198,91,242,.3),rgba(91,108,255,.25))'}} />
        </div>
      ))}
    </div>
  );
};

/** "mad": 😤 sticker beside the head + magenta edge flash. */
const MadSticker: React.FC = () => {
  const frame = useCurrentFrame();
  const at = f(4.46) - 1, out = f(6.34);
  if (frame < at || frame > out) return null;
  const s = interpolate(frame, [at, at + 5, at + 8], [0, 1.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wobble = Math.sin((frame - at) / 3) * 6 * Math.exp(-(frame - at) / 20);
  return (
    <>
      <AbsoluteFill style={{zIndex: 25, boxShadow: `inset 0 0 220px rgba(198,91,242,${interpolate(frame, [at, at + 2, at + 14], [0, 0.75, 0.25], {extrapolateRight: 'clamp'})})`}} />
      <div style={{position: 'absolute', left: 720, top: 430, fontSize: 120, zIndex: 26, transform: `scale(${s}) rotate(${14 + wobble}deg)`,
        filter: 'drop-shadow(0 0 24px rgba(198,91,242,.8))'}}>😤</div>
    </>
  );
};


/** Farside list board over the chest (ref: "The Fundamentals of Design" card): title, glowing divider,
 *  star bullets that type on as each item is spoken. */
const FarsideBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const at = f(39.2), out = f(44.5) + 6;
  if (frame < at) return null;
  const items: [string, number][] = [['Inflows', 40.44], ['Outflows', 41.16], ['Ethereum ETFs', 42.34], ['Bitcoin ETFs', 43.24]];
  const o = interpolate(frame, [out, out + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const line = tw(frame, at + 8, 12, 0, 100);
  return (
    <div style={{position: 'absolute', left: 290, width: 500, top: 730, zIndex: 30, borderRadius: 22, overflow: 'hidden', padding: '42px 48px 30px',
      background: `linear-gradient(170deg,rgba(128,80,232,.78) 0%,rgba(84,38,168,.82) 45%,rgba(25,13,50,.9) 100%)`,
      border: '1.5px solid rgba(185,154,245,.45)', boxShadow: '0 30px 80px rgba(25,13,50,.55), 0 0 60px rgba(128,80,232,.35), inset 0 1px 0 rgba(238,231,255,.3)',
      backdropFilter: 'blur(16px)', ...{opacity: o * tw(frame, at, 6, 0, 1)},
      transform: `translateY(${tw(frame, at, 10, 90, 0)}px) scale(${tw(frame, at, 10, 0.94, 1)})`, filter: `blur(${tw(frame, at, 8, 20, 0)}px)`}}>
      <div style={{textAlign: 'center', font: `600 46px ${FONT.display}`, letterSpacing: -1, lineHeight: 1.05, color: C.mist}}>
        Farside<br /><span style={{font: `500 34px ${FONT.display}`, color: 'rgba(238,231,255,.85)'}}>ETF Flow Tracker</span>
      </div>
      <div style={{height: 5, borderRadius: 3, margin: '26px auto 22px', width: `${line}%`, background: `linear-gradient(90deg,${C.lilac},${C.mist},${C.lilac})`,
        boxShadow: `0 0 14px ${C.lilac}, 0 0 30px ${C.violet}`}} />
      {items.map(([label, t], i) => {
        const a = f(t) - 1;
        if (frame < a) return <div key={i} style={{height: 58}} />;
        const chars = Math.floor(tw(frame, a, 8, 0, label.length, (x) => x));
        const tw2 = 1 + 0.5 * Math.exp(-(frame - a) / 5) * Math.abs(Math.sin((frame - a) / 2));
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, height: 58, font: `500 38px ${FONT.ui}`, color: C.mist}}>
            <svg width={40} height={40} viewBox="0 0 24 24" style={{transform: `scale(${pop(frame, a, 6) * tw2}) rotate(${(frame - a) * 2}deg)`,
              filter: `drop-shadow(0 0 8px ${C.mist}) drop-shadow(0 0 16px ${C.lilac})`}}>
              <path d="M12 0C12.6 8 16 11.4 24 12 16 12.6 12.6 16 12 24 11.4 16 8 12.6 0 12 8 11.4 11.4 8 12 0Z" fill={C.mist} />
            </svg>
            <span>{label.slice(0, chars)}<span style={{opacity: chars < label.length ? 0.5 : 0}}>{label[chars] ?? ''}</span></span>
          </div>
        );
      })}
    </div>
  );
};

/** Footage layer, behind-head names, speaker cut-out, plus talking-head-only graphics. Always mounted until speech ends. */
export const Talk: React.FC = () => {
  const frame = useCurrentFrame();
  const z = cameraZoom(frame);
  const cta = SCENES.find((s) => s.kind === 'cta')!;
  const ctaAmt = interpolate(frame, [f(cta.start), f(cta.start) + 6, f(cta.end) - 4, f(cta.end)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // shot-entry: scale 1.2 → 1, blur 30 → 0 over 4 f at every return to the talking head
  const entries = SCENES.filter((s) => s.kind === 'talk').map((s) => f(s.start));
  const e = entries.filter((x) => frame >= x && frame < x + 5).pop();
  const entryScale = e !== undefined ? tw(frame, e, 4, 1.2, 1) : 1;
  const entryBlur = e !== undefined ? tw(frame, e, 4, 30, 0) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${z * entryScale})`, transformOrigin: '50% 35%',
        filter: `blur(${entryBlur + ctaAmt * 22}px) brightness(${1 - ctaAmt * 0.55}) saturate(${1 + ctaAmt * 0.3})`}}>
        <OffthreadVideo src={staticFile('raw.mp4')} muted />
        {BEHIND_NAMES.map((b) => <BehindName key={b.name} {...b} />)}
        <AbsoluteFill style={{zIndex: 3}}>
          <OffthreadVideo src={staticFile('speaker_cutout.webm')} transparent muted />
        </AbsoluteFill>
        <AbsoluteFill style={{zIndex: 4, background: 'linear-gradient(180deg,rgba(25,13,50,.45) 0%,rgba(25,13,50,0) 18%,rgba(25,13,50,0) 46%,rgba(25,13,50,.75) 66%,rgba(25,13,50,.95) 100%)'}} />
      </AbsoluteFill>
      <ClassifiedCard />
      <FarsideBoard />
      {/* text arcing over the head (ref R1) */}
      <ArcText text="these crypto websites" at={f(1.22)} end={f(2.94)} cx={540} cy={610} r={285} />
      {/* stacked 3D tiles counting the sites (ref R1) */}
      <StackTiles times={BEHIND_NAMES.map((b) => f(b.t))}
        show={[[f(6.34), f(8.7)], [f(11.96), f(14.0)], [f(20.56), f(22.68)], [f(37.42), f(39.2)]]} />
      <MadSticker />
      {/* talking-head sparkles */}
      {frame < f(8.7) && <>
        <Plus x={110} y={1250} size={46} at={f(1.5)} />
        <Plus x={930} y={1150} size={60} color={C.lilac} at={f(1.82)} rot={12} />
        <Plus x={250} y={470} size={40} at={f(4.46)} rot={20} />
        <Plus x={110} y={330} size={52} at={f(6.74)} />
        <Plus x={930} y={520} size={40} color={C.lilac} at={f(6.8)} rot={15} />
      </>}
      {frame >= f(11.96) && frame < f(14) && <><Plus x={120} y={340} size={48} at={f(12.98)} /><Plus x={920} y={540} size={38} color={C.blue} at={f(13.05)} /></>}
      {frame >= f(20.56) && frame < f(22.68) && <><Plus x={100} y={360} size={44} color={C.lilac} at={f(21.12)} /><Plus x={950} y={520} size={40} at={f(21.2)} /></>}
      {frame >= f(31.82) && frame < f(33.5) && <><Plus x={130} y={1260} size={46} at={f(32.4)} /><Plus x={920} y={1180} size={52} color={C.lilac} at={f(32.6)} /></>}
      {frame >= f(37.42) && frame < f(39.2) && <><Plus x={120} y={340} size={48} at={f(38.34)} /><Plus x={930} y={540} size={40} color={C.blue} at={f(38.4)} /></>}
    </AbsoluteFill>
  );
};
