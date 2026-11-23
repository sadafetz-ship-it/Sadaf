// node stills.mjs 55 120 300 ...  -> out/stills/fNNN.jpg
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'path';
const B = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = await selectComposition({serveUrl, id: 'Main', browserExecutable: B});
for (const a of process.argv.slice(2)) {
  const frame = Number(a);
  await renderStill({serveUrl, composition: comp, frame, output: `out/stills/f${String(frame).padStart(4, '0')}.jpg`, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable: B});
  process.stdout.write(frame + ' ');
}
