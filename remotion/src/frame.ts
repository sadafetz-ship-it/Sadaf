import {useCurrentFrame as useRemotionFrame} from 'remotion';

/** Render at 60 fps for smoother motion while every animation keeps its timing in 30-fps "design frames".
 *  useCurrentFrame() returns a fractional 30-fps frame, so all existing frame-count animations play at the same speed
 *  but get twice as many in-between samples. */
export const RENDER_FPS = 60;
export const SCALE = RENDER_FPS / 30;
export const useCurrentFrame = () => useRemotionFrame() / SCALE;
