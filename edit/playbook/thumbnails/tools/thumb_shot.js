const {chromium}=require('playwright');(async()=>{const d=process.argv[2];const b=await chromium.launch({args:['--allow-file-access-from-files']});
const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:2});
for(const n of process.argv.slice(3)){await p.goto('file://'+d+'/'+n+'.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);await p.screenshot({path:d+'/'+n+'@2x.png'});}await b.close();})();
