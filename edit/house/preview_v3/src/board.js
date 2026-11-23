const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2400, height: 1000 } });
 await p.goto('file://' + process.argv[2]); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
 await p.screenshot({ path: process.argv[3], fullPage: true, type: 'jpeg', quality: 88 }); await b.close(); })();
