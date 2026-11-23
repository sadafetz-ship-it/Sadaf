const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const d=process.argv[2];const fr=JSON.parse(fs.readFileSync(d+'/frames.json'));
const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1920,height:1080}});
for(const [id] of fr){await p.goto('file://'+d+'/'+id+'.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);await p.screenshot({path:d+'/'+id+'.png'});}
await b.close();})();
