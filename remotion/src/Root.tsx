import {Composition} from 'remotion';
import {Main} from './Main';
import {TOTAL_FRAMES} from './timing';
import {RENDER_FPS, SCALE} from './frame';

export const RemotionRoot: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={TOTAL_FRAMES * SCALE} fps={RENDER_FPS} width={1080} height={1920} />
);
