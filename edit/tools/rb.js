const { chromium } = require('playwright');
const W = process.argv[2];
(async () => { const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
 for (const n of ['board_a','board_b']) { const p = await b.newPage({ viewport: { width: 2840, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto(`file://${W}/frames/${n}.html`); await p.waitForTimeout(300); await p.screenshot({ path: `${W}/frames/${n}.png`, fullPage: true }); }
 await b.close(); })();
