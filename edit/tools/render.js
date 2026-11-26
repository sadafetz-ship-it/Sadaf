const { chromium } = require('playwright');
const [W, ...ids] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const id of ids) {
    await p.goto(`file://${W}/frames/${id}.html`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: `${W}/frames/${id}.png` });
  }
  await b.close();
})();
