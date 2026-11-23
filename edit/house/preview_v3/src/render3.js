const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = process.argv[2];
  const frames = JSON.parse(fs.readFileSync(path.join(dir, 'frames3.json')));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  for (const k of Object.keys(frames)) {
    await p.goto('file://' + path.join(dir, `h${k}.html`));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(150);
    await p.screenshot({ path: path.join(dir, `out3/frame_${k}.png`) });
    console.log('frame', k);
  }
  await b.close();
})();
