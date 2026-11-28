import React from 'react';
import {Composition} from 'remotion';
import {Edit, DURATION} from './Edit';
export const Root: React.FC = () => (
  <Composition id="Edit" component={Edit} durationInFrames={DURATION} fps={30} width={1920} height={1080} />
);
