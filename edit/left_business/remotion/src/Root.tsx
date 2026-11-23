import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {DURATION, FPS, H, W} from './theme';

export const Root: React.FC = () => <Composition id="Main" component={Main} durationInFrames={DURATION} fps={FPS} width={W} height={H} />;
