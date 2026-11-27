import React from 'react';
import {Composition, AbsoluteFill, OffthreadVideo, Img, staticFile} from 'remotion';
// Toolchain smoke test only: footage + speaker cut-out + car asset. The real edit is built after preview approval.
const Smoke: React.FC = () => (
  <AbsoluteFill style={{background: '#1A1428'}}>
    <OffthreadVideo src={staticFile('raw.mp4')} muted />
    <Img src={staticFile('bmw_m4_cutout.png')} style={{position: 'absolute', left: 90, top: 1250, width: 900, opacity: 0.9}} />
    <OffthreadVideo src={staticFile('speaker_cutout.webm')} transparent muted />
  </AbsoluteFill>
);
export const Root: React.FC = () => (
  <Composition id="Smoke" component={Smoke} durationInFrames={286} fps={30} width={1080} height={1920} />
);
