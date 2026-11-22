// node render.js <html_dir>  -> writes PNG next to each HTML (1080x1920)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = path.resolve(process.argv[2]);
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort()) {
    await p.goto('file://' + path.join(dir, f));
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(dir, f.replace('.html', '.png')) });
  }
  await b.close();
})();
