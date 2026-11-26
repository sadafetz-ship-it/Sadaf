import React from 'react';
import { Composition } from 'remotion';
import { Main } from './Main';

export const Root: React.FC = () => (
  <>
    <Composition id="Einstein" component={Main} durationInFrames={1350} fps={30} width={1920} height={1080} defaultProps={{ motionBlur: true, audio: true }} />
    <Composition id="EinsteinPreview" component={Main} durationInFrames={1350} fps={30} width={1920} height={1080} defaultProps={{ motionBlur: false, audio: false }} />
  </>
);
