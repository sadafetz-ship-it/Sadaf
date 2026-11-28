// Bundle once, then grab one still per storyboard beat.
import {bundle} from '@remotion/bundler';
import {selectComposition, renderStill} from '@remotion/renderer';
import path from 'node:path';
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const frames = [114, 228, 324, 387, 420, 558, 615, 960, 1152, 1182, 1335, 1422, 1500, 1578, 1755, 1926];
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Edit', browserExecutable});
for (const [i, frame] of frames.entries()) {
  const output = path.resolve(`../storyboard/frames_black/${String(i + 1).padStart(2, '0')}.png`);
  await renderStill({serveUrl, composition, frame, output, browserExecutable});
  console.log('still', i + 1, frame);
}
