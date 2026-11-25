// Renders the Einstein 45 s 16:9 video frame by frame with animation timings measured from the 4 reference reels.
const { chromium } = require('playwright'); const fs = require('fs'); const { spawn } = require('child_process');
const S = '/tmp/claude-0/-home-user-Sadaf/a41e21b2-0a7e-5e75-939b-7836ade24636/scratchpad';
const OUT = process.argv[2]; const ONLY = process.argv[3]; // optional "t1,t2,..." preview times
const F = S + '/fonts/node_modules/@fontsource/';
const ff = (fam, file, w, st) => `@font-face{font-family:'${fam}';src:url(data:font/woff2;base64,${fs.readFileSync(F + file).toString('base64')}) format('woff2');font-weight:${w};font-style:${st}}`;
const fonts = [ff('Bodoni','bodoni-moda/files/bodoni-moda-latin-400-normal.woff2',400,'normal'),ff('Bodoni','bodoni-moda/files/bodoni-moda-latin-400-italic.woff2',400,'italic'),
 ff('Play','playfair-display/files/playfair-display-latin-900-italic.woff2',900,'italic'),ff('Play','playfair-display/files/playfair-display-latin-900-normal.woff2',900,'normal'),
 ff('Pop','poppins/files/poppins-latin-700-normal.woff2',700,'normal'),ff('Pop','poppins/files/poppins-latin-800-normal.woff2',800,'normal')].join('\n');
const W = S + '/wm/'; const uri = f => `data:image/${f.endsWith('png')?'png':'jpeg'};base64,` + fs.readFileSync(W + f).toString('base64');
const I = { young: uri('Einstein_patentoffice_cut.png'), youngFull: uri('Einstein_patentoffice.jpg'), sch: uri('Einstein_1921_by_F_Schmutzer_-_restoration_cut.png'),
  schFull: uri('Einstein_1921_by_F_Schmutzer_-_restoration.jpg'), harris: uri('harris1921_crop_cut.png'), eclipse: uri('1919_eclipse_positive.jpg'), bern: uri('bern_crop.jpg'),
  annalen: uri('Annalen_der_Physik_ToC_June_1905.jpg'), bulb: uri('Light_bulb_by_Lewis_Latimer,_1883_-_Museum_of_Science_and_Industry_(Chicago)_-_DSC06448_cut.png'),
  watch: uri('Pocket_watch_MET_SF1979_498_1_img1_cut.png'), board: uri('Classroom_with_chairs_and_blackboard_at_Cornell_University.jpg') };
const RED='#b3122a', YEL='#e9c93b', LIME='#c8e63c';
const css = `${fonts}
*{margin:0;box-sizing:border-box}body{width:1920px;height:1080px;overflow:hidden;position:relative;background:#000}
.sc{position:absolute;inset:0;overflow:hidden;display:none}.cam{position:absolute;inset:0;transform-origin:50% 50%}.a{position:absolute}.full{position:absolute;inset:0}
.serif{font-family:Bodoni;font-style:italic;color:#fff;text-shadow:0 0 18px rgba(255,255,255,.45),0 2px 10px rgba(0,0,0,.5);letter-spacing:-1px;line-height:.95;white-space:nowrap}
.serifd{font-family:Bodoni;font-style:italic;color:#222;letter-spacing:-1px;line-height:.95;white-space:nowrap}
.pop{font-family:Pop;font-weight:800;color:#fff;letter-spacing:-2px;line-height:.9;white-space:nowrap;text-shadow:0 0 22px rgba(255,255,255,.55),0 6px 0 rgba(0,0,0,.25),0 10px 30px rgba(0,0,0,.6)}
.cut{-webkit-mask-image:linear-gradient(#000 82%,transparent 99%);filter:grayscale(1) contrast(1.1) drop-shadow(2px 0 0 rgba(255,40,40,.28)) drop-shadow(-2px 0 0 rgba(40,220,255,.28)) drop-shadow(0 20px 40px rgba(0,0,0,.6))}
.bw{filter:grayscale(1) contrast(1.12) brightness(.9)}
.card{position:absolute;padding:14px;background:#f4f2ec;box-shadow:0 14px 30px rgba(0,0,0,.4)}.card>div{width:100%;height:100%;background-size:cover;background-position:center;filter:grayscale(1) contrast(1.1)}
.tape{position:absolute;height:44px;background:rgba(236,226,196,.85);box-shadow:0 2px 4px rgba(0,0,0,.15)}
.pin{position:absolute;width:28px;height:28px;margin:-14px 0 0 -14px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ff8a8a,#c3121f 55%,#6d0a10);box-shadow:3px 5px 6px rgba(0,0,0,.45)}
.news{position:absolute;background:linear-gradient(160deg,#efe4c9,#d9c7a0);box-shadow:0 18px 40px rgba(0,0,0,.55);padding:26px 30px;color:#1d1a16;overflow:hidden}
.news .m{font:900 30px Play;text-align:center;border-bottom:3px double #333;padding-bottom:6px;margin-bottom:12px}.news .h{font:900 46px/1.02 Play;text-align:center;text-transform:uppercase}
.news .s{font:italic 400 20px/1.2 Bodoni;text-align:center;margin:10px 0}.news .c{columns:3;column-gap:16px;font:11px/1.35 Georgia,serif;color:#3b352c;text-align:justify}
#vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 40%,rgba(0,0,0,.6) 100%);pointer-events:none;z-index:50}
#grain{position:absolute;inset:0;opacity:.2;mix-blend-mode:overlay;pointer-events:none;z-index:51}`;
const lorem = 'The observations made during the eclipse of May 29 at Sobral and Principe confirm the deflection of light predicted by the new theory. '.repeat(14);
const greyWall = `<div class="full" style="background:linear-gradient(115deg,#9d9d9b,#d6d5d1 45%,#a9a8a4)"></div>`;
const cream = `<div class="full" style="background:radial-gradient(ellipse at 45% 40%,#f3efe7,#d9d3c7 80%)"></div>`;
const greyDesk = `<div class="full" style="background:linear-gradient(135deg,#e9e9e7,#cfcfcc)"></div>`;
const linen = `<div class="full" style="background:#cdbfa8"></div><svg class="full" width="1920" height="1080" style="opacity:.35;mix-blend-mode:multiply"><filter id="lnf"><feTurbulence type="fractalNoise" baseFrequency=".9 .02" numOctaves="2"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#lnf)"/></svg>`;
const wood = `<svg class="full" width="1920" height="1080"><filter id="wf"><feTurbulence type="fractalNoise" baseFrequency=".0025 .09" numOctaves="4" seed="7"/><feColorMatrix values="0 0 0 0 .36  0 0 0 0 .21  0 0 0 0 .12  0 0 0 -1.6 1.25"/></filter><rect width="100%" height="100%" fill="#6e4426"/><rect width="100%" height="100%" filter="url(#wf)"/></svg>`;
const darkRoom = `<div class="full" style="background:linear-gradient(#2b2826,#1a1817 60%,#0d0c0b)"></div>`;
const shadow = (id,o=.35) => `<div id="${id}" class="a" style="left:-400px;top:-200px;width:2720px;height:1480px;background:repeating-linear-gradient(125deg,rgba(0,0,0,0) 0 220px,rgba(0,0,0,${o}) 220px 330px,rgba(0,0,0,0) 330px 520px);filter:blur(22px);mix-blend-mode:multiply"></div>`;
const card = (img,x,y,w,h,r,pos='center',id='') => `<div ${id?`id="${id}"`:''} class="card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${r}deg)"><div style="background-image:url(${img});background-position:${pos}"></div></div>`;
const scrib = id => `<svg id="${id}" class="a" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M60 6 C20 2,2 30,8 58 C14 88,60 98,84 78 C100 62,96 20,62 10 C40 4,14 20,12 44" fill="none" stroke="#d0121c" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" vector-effect="non-scaling-stroke" style="stroke-width:12px;opacity:.92"/></svg>`;
const ell = (id,c) => `<svg id="${id}" class="a" viewBox="0 0 100 50" preserveAspectRatio="none"><path d="M8 30 C4 10,60 2,90 12 C102 18,96 40,60 45 C30 49,6 40,10 26 C14 16,40 9,70 9" fill="none" stroke="${c}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" vector-effect="non-scaling-stroke" style="stroke-width:7px"/></svg>`;
const arcSvg = id => `<svg id="${id}" class="a" viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M95 8 C40 -4,0 20,8 40 C14 54,60 58,96 48" fill="none" stroke="#fff" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" vector-effect="non-scaling-stroke" style="stroke-width:5px;opacity:.9"/></svg>`;
const gear = (id,x,y,r,n) => `<svg id="${id}" class="a" style="left:${x-r-20}px;top:${y-r-20}px" width="${2*r+40}" height="${2*r+40}" viewBox="${-r-20} ${-r-20} ${2*r+40} ${2*r+40}" fill="none" stroke="#9a9a96" stroke-width="7"><circle r="${r}"/><circle r="${r*.45}"/>${Array.from({length:n},(_,i)=>`<rect x="-12" y="${-r-22}" width="24" height="24" transform="rotate(${i*360/n})"/>`).join('')}</svg>`;

const scenes = `
<div class="sc" id="S1"><div class="cam">${cream}${shadow('sh1',.22)}<div class="a" style="left:0;right:0;top:400px;text-align:center;font-family:Bodoni;color:#2a2622"><span id="s1a" style="font-size:70px"></span><span id="s1b" style="font-size:230px;letter-spacing:-6px"></span></div></div></div>
<div class="sc" id="S2"><div class="cam" style="transform-origin:960px 420px">${greyWall}${shadow('sh2',.3)}
<div class="a" style="left:690px;top:90px;width:540px;height:660px;padding:34px;background:linear-gradient(135deg,#7a5a1c,#e8c66a 25%,#9a7428 45%,#f2d98a 65%,#6d4f15);box-shadow:0 30px 60px rgba(0,0,0,.5),inset 0 0 0 6px rgba(60,40,10,.6)"><div style="width:100%;height:100%;background:url(${I.youngFull}) center 20%/cover;filter:grayscale(1) contrast(1.1)"></div></div>
<div id="s2c" class="a" style="left:0;right:0;top:790px;text-align:center"><div class="serifd" style="font-size:84px">Albert Einstein</div><div class="serifd" style="font-size:44px;margin-top:12px">in 1902</div></div></div></div>
<div class="sc" id="S3"><div class="cam"><div id="s3bg" class="full bw" style="background:url(${I.bern}) center 40%/cover;filter:grayscale(1) contrast(1.15) brightness(.7) blur(1.5px)"></div><div class="full" style="background:linear-gradient(transparent 40%,rgba(0,0,0,.55))"></div>
<img id="s3p" class="a cut" src="${I.young}" style="left:560px;top:120px;height:960px">
<div id="s3c" class="a serif" style="left:0;right:0;top:790px;text-align:center;font-size:96px"></div>
<div id="s3l" class="a" style="left:180px;top:-30px;width:520px;transform-origin:50% 0"><svg class="a" style="left:0;top:0" width="520" height="300"><line x1="60" y1="0" x2="150" y2="300" stroke="${RED}" stroke-width="5"/><line x1="460" y1="0" x2="370" y2="300" stroke="${RED}" stroke-width="5"/></svg>
<div class="a" style="left:40px;top:290px;background:#4a2a1f;padding:10px 34px 18px;box-shadow:0 12px 30px rgba(0,0,0,.5);font:800 110px/1 Pop;letter-spacing:-3px;color:#e8d8b0;white-space:nowrap"><span id="s3lt"></span></div></div></div></div>
<div class="sc" id="S4"><div class="cam"><div id="s4bg" class="full" style="background:url(${I.bern}) center 60%/cover"></div>
<img class="a cut" src="${I.sch}" style="left:1040px;top:110px;height:970px">
<div id="s4w" class="a serif" style="left:180px;top:200px;font-size:110px;line-height:1"></div>
<div id="s4k" class="a serif" style="left:170px;top:560px;font-size:190px">patent office</div><div id="s4u" class="a" style="left:180px;top:770px;height:8px;background:${YEL};border-radius:4px;box-shadow:0 0 12px ${YEL}"></div></div></div>
<div class="sc" id="S5"><div class="cam"><div class="full" style="background:url(${I.youngFull}) center 25%/cover;filter:grayscale(1) contrast(1.1) brightness(.75)"></div>
<div id="s5t" class="a" style="left:560px;top:590px;transform-origin:0 50%"><div style="background:${YEL};padding:4px 26px 12px;clip-path:polygon(0 8%,4% 0,30% 5%,60% 0,100% 6%,97% 50%,100% 94%,70% 100%,35% 95%,3% 100%,0 60%);box-shadow:0 8px 20px rgba(0,0,0,.4);font:italic 400 70px Bodoni;color:#1a1a1a;min-width:200px;height:100px;white-space:nowrap"><span id="s5tw"></span></div></div>
<div id="s5k" class="a serif" style="left:640px;top:690px;font-size:190px">third class</div></div></div>
<div class="sc" id="S6"><div id="s6str" class="full" style="background:#050505"><div id="s6s" class="a" style="top:0;height:1080px;left:50%;background:repeating-linear-gradient(90deg,#7a0a0a 0 18px,#d8231c 18px 30px,#ff8a2a 30px 36px,#b5120f 36px 58px,#3a4fd8 58px 64px,#ffcf6a 64px 67px,#8a1f6a 67px 80px,#5a0505 80px 96px);filter:blur(1.5px)"></div></div>
<div id="s6p" class="full">${greyWall}<div class="full" style="background:rgba(235,235,232,.55)"></div>${shadow('sh6',.18)}<div id="s6t" class="a serifd" style="left:0;right:0;top:500px;text-align:center;font-size:72px">What happened next.</div></div></div>
<div class="sc" id="S7"><div class="cam">${darkRoom}
<div id="s7cone" class="a" style="left:330px;top:150px;width:1100px;height:900px;clip-path:polygon(18% 0,32% 0,100% 100%,0 100%);background:radial-gradient(ellipse at 25% 0%,rgba(255,240,190,.38),rgba(255,240,190,.08) 70%);filter:blur(10px)"></div>
<img class="a cut" src="${I.young}" style="left:820px;top:230px;height:640px">
<div class="a" style="left:0;right:0;top:770px;height:310px;background:linear-gradient(#4a3322,#24180f)"></div>
<div class="a" style="left:860px;top:800px;width:300px;height:200px;background:#e6dcc4;transform:perspective(600px) rotateX(55deg) rotate(-6deg)"></div><div class="a" style="left:1000px;top:810px;width:300px;height:200px;background:#efe7d3;transform:perspective(600px) rotateX(55deg) rotate(8deg)"></div>
<div class="a" style="left:470px;top:60px;width:12px;height:110px;background:#222"></div><div class="a" style="left:360px;top:140px;width:240px;height:110px;background:linear-gradient(#41543f,#1e2a1d);clip-path:polygon(30% 0,70% 0,100% 100%,0 100%)"></div>
<div id="s7bulb" class="a" style="left:400px;top:238px;width:160px;height:16px;border-radius:50%;background:#fff6d0;box-shadow:0 0 40px 12px rgba(255,240,190,.6)"></div>
<div id="s7a" class="a serif" style="left:150px;top:470px;font-size:96px">in his</div>
<div id="s7l" class="a" style="left:140px;top:570px"><div style="background:#7a1a22;padding:0 28px 10px;clip-path:polygon(1% 6%,20% 0,48% 4%,75% 0,99% 5%,100% 40%,98% 96%,70% 100%,40% 96%,12% 100%,0 92%,2% 45%);font:italic 400 110px Bodoni;color:#f0e6d6;white-space:nowrap">spare time</div></div></div></div>
<div class="sc" id="S8"><div class="cam">${linen}${['1902','1903','1904','1905'].map((y,i)=>`<div class="a" style="left:890px;top:${170+i*200}px;width:140px;height:140px;border-radius:50%;background:rgba(150,120,100,.35);text-align:center;font:italic 400 44px/140px Bodoni;color:#5a4a3a">${y}</div>`).join('')}
<div id="s8d" class="a" style="left:905px;width:110px;height:110px;border-radius:50%;background:radial-gradient(#fff3a0,${YEL} 60%,rgba(233,201,59,0) 72%);mix-blend-mode:multiply"></div>
<div class="full" style="background:radial-gradient(circle at 50% 50%,transparent 32%,rgba(20,15,10,.85) 52%)"></div></div></div>
<div class="sc" id="S9"><div class="cam">${greyDesk}${card(I.annalen,430,300,330,450,-8,'center','p0')}${card(I.annalen,800,250,330,450,3,'center','p1')}${card(I.annalen,1170,320,330,450,9,'center','p2')}
<div id="tp0" class="tape" style="left:520px;top:280px;width:150px;transform:rotate(-20deg)"></div><div id="tp1" class="tape" style="left:900px;top:232px;width:150px;transform:rotate(4deg)"></div><div id="tp2" class="tape" style="left:1260px;top:300px;width:150px;transform:rotate(14deg)"></div>
${scrib('s9s')}${shadow('sh9',.42)}
<div id="s9w" class="a serifd" style="left:0;right:0;top:70px;text-align:center;font-size:140px;color:#1c1c1c"></div>
<div id="s9l" class="a" style="left:1380px;top:820px;transform:rotate(-6deg)"><div id="s9lb" style="background:${LIME};padding:6px 26px 12px;font:italic 400 64px Bodoni;color:#1a1a1a;white-space:nowrap;height:96px;min-width:60px"><span id="s9lt"></span></div></div></div></div>
<div class="sc" id="S10"><div class="cam"><div class="full" style="background:radial-gradient(#1c1b1a,#060606)"></div>
<img id="s10b" class="a" src="${I.bulb}" style="left:780px;top:330px;height:700px;filter:grayscale(1) contrast(1.1) drop-shadow(4px 0 0 ${YEL}) drop-shadow(-4px 0 0 ${YEL}) drop-shadow(0 4px 0 ${YEL}) drop-shadow(0 -4px 0 ${YEL})">
<div id="s10s" class="a serif" style="left:0;right:0;top:250px;text-align:center;font-size:64px"></div>
<div id="s10y" class="a" style="left:560px;top:450px;width:800px;height:190px;background:${YEL};transform-origin:0 50%"></div>
<div id="s10w" class="a" style="left:0;right:0;top:430px;text-align:center;font:800 200px/1 Pop;color:#fff;letter-spacing:-6px;text-shadow:0 0 30px rgba(255,255,255,.5)"></div></div></div>
<div class="sc" id="S11"><div class="cam">${linen}${card(I.annalen,640,90,520,760,-4)}
<div id="s11m" class="a" style="left:700px;top:200px;width:620px;height:760px">
<div class="a" style="left:0;top:0;width:520px;height:520px;border-radius:50%;overflow:hidden;border:22px solid #2a2a2a;box-shadow:0 30px 60px rgba(0,0,0,.5)"><div class="full" style="background:#c9a96a"></div>
${Array.from({length:40},(_,i)=>`<div class="a dot" data-i="${i}" style="left:${(i*97)%460}px;top:${(i*151)%460}px;width:${18+(i%4)*10}px;height:${18+(i%4)*10}px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff,#8a7350);box-shadow:2px 3px 4px rgba(0,0,0,.35)"></div>`).join('')}
<div class="full" style="background:radial-gradient(circle at 30% 25%,rgba(255,255,255,.35),transparent 45%)"></div></div>
<div class="a" style="left:430px;top:450px;width:70px;height:300px;background:linear-gradient(90deg,#1b1b1b,#444,#1b1b1b);transform:rotate(-40deg);border-radius:20px"></div></div>
<div id="s11w" class="a" style="left:140px;top:420px;font:700 80px/1 Pop;color:#2a2020"></div>
<div id="s11r" class="a" style="left:330px;top:830px;width:1260px;height:170px;background:${RED};clip-path:polygon(0 20%,8% 0,40% 8%,70% 0,100% 15%,96% 80%,100% 100%,60% 90%,20% 100%,2% 85%)"></div>
<div id="s11k" class="a" style="left:0;right:0;top:800px;text-align:center;font:italic 900 190px Play;color:${YEL};text-shadow:0 4px 0 #6b5a10,0 10px 30px rgba(0,0,0,.4)">atoms</div></div></div>
<div class="sc" id="S12"><div class="cam"><div class="full" style="background:radial-gradient(#1c1b1a,#060606)"></div>${gear('g1',770,540,220,16)}${gear('g2',1240,580,150,12)}
<img class="a" src="${I.watch}" style="left:740px;top:260px;height:560px;opacity:.9;filter:grayscale(1) contrast(1.1)">
<div id="s12s" class="a serif" style="left:0;right:0;top:330px;text-align:center;font-size:70px"></div>
<div id="s12k" class="a" style="left:0;right:0;top:420px;text-align:center;font:800 230px/1 Pop;color:#f1e3b8;letter-spacing:-8px;text-shadow:0 0 30px rgba(255,240,200,.5),0 8px 0 rgba(0,0,0,.3)">time</div></div></div>
<div class="sc" id="S13"><div class="cam"><div class="full" style="background:url(${I.board}) left center/cover;filter:grayscale(1) contrast(1.1) brightness(.45) blur(3px)"></div>
<img class="a cut" src="${I.sch}" style="left:340px;top:120px;height:960px">
<div id="s13a" class="a pop" style="left:1060px;top:300px;font-size:90px;line-height:1.05"></div>
<div id="s13k" class="a pop" style="left:1040px;top:420px;font-size:250px"></div><div id="s13e" class="a pop" style="left:1180px;top:700px;font-size:150px">ever.</div></div></div>
<div class="sc" id="S14"><div class="cam">${greyDesk}${card(I.eclipse,1060,150,600,650,5)}<div class="tape" style="left:1250px;top:120px;width:200px;transform:rotate(-6deg)"></div>${shadow('sh14',.45)}
<div id="s14y" class="a" style="left:180px;top:250px;font:400 440px/1 Bodoni;color:#1c1c1c;letter-spacing:-14px"></div>
<div class="a" style="left:560px;top:680px;transform:rotate(-4deg)"><div id="s14b" style="background:${LIME};padding:4px 30px 14px;font:italic 400 90px Bodoni;color:#1a1a1a;white-space:nowrap;height:130px;transform-origin:0 50%"><span id="s14t"></span></div></div></div></div>
<div class="sc" id="S15"><div class="cam">${wood}
<div id="n0" class="news" style="left:300px;top:300px;width:560px;height:700px;transform:rotate(-7deg)"><div class="m">The New York Times</div><div class="h">Lights All Askew in the Heavens</div><div class="s">Men of Science More or Less Agog Over Results of Eclipse Observations</div><div class="h" style="font-size:30px">Einstein Theory Triumphs</div><div class="c" style="margin-top:12px">${lorem}</div></div>
<div id="n1" class="news" style="left:1000px;top:280px;width:600px;height:720px;transform:rotate(5deg)"><div class="m">THE TIMES</div><div class="h" style="font-size:60px">Revolution in Science</div><div class="s">New Theory of the Universe. Newtonian Ideas Overthrown.</div><div class="c">${lorem}</div></div>
${arcSvg('s15a')}<div id="s15w" class="a serif" style="left:0;right:0;top:80px;text-align:center;font-size:120px"></div></div></div>
<div class="sc" id="S16"><div class="cam">${greyDesk}
${card(I.youngFull,200,60,360,270,-4,'center 25%')}${card(I.annalen,1360,60,330,270,5)}${card(I.bern,200,760,380,260,3)}${card(I.eclipse,1360,760,330,270,-5)}
<svg class="full" width="1920" height="1080"><g stroke="#9b1b22" stroke-width="5" fill="none" stroke-linecap="round"><path d="M730 270 L1190 270 L1190 800 L730 800 Z"/><path d="M560 320 L730 270 M1360 320 L1190 270 M570 770 L730 800 M1360 770 L1190 800"/></g></svg>
${card(I.schFull,770,300,380,470,0,'center 20%')}
<div class="tape" style="left:240px;top:40px;width:150px;transform:rotate(-15deg)"></div><div class="tape" style="left:1470px;top:40px;width:150px;transform:rotate(10deg)"></div><div class="tape" style="left:880px;top:282px;width:200px;transform:rotate(-3deg)"></div>
${[[730,270],[1190,270],[730,800],[1190,800],[560,320],[1360,320],[570,770],[1360,770]].map(([x,y])=>`<div class="pin" style="left:${x}px;top:${y}px"></div>`).join('')}
<div class="a" style="left:700px;top:760px;transform:rotate(-90deg);transform-origin:left top;background:#111;color:#fff;font:900 40px Play;padding:8px 22px;letter-spacing:2px;white-space:nowrap">ALBERT EINSTEIN</div>
<div class="a" style="left:690px;top:700px;transform:rotate(-30deg);background:#111;color:#fff;font:700 28px Pop;padding:5px 14px">PHYSICIST</div>
${scrib('s16s')}${shadow('sh16',.4)}</div></div>
<div class="sc" id="S17"><div class="cam">${darkRoom}<div class="full" style="background:radial-gradient(ellipse at 70% 30%,rgba(255,240,200,.18),transparent 60%)"></div>
<img class="a cut" src="${I.harris}" style="left:960px;top:140px;height:940px">
<div id="s17a" class="a serif" style="left:220px;top:330px;font-size:86px"></div><div id="s17k" class="a serif" style="left:200px;top:440px;font-size:190px">Nobel Prize</div>${ell('s17e',LIME)}</div></div>
<div class="sc" id="S18"><div class="cam">${cream}${shadow('sh18',.2)}
<div id="s18a" class="a" style="left:0;right:0;top:390px;text-align:center;font:italic 400 76px Bodoni;color:#2a2622"></div>
<div id="s18k" class="a" style="left:0;right:0;top:480px;text-align:center"><span id="s18b" style="display:inline-block;background:${RED};padding:0 28px 10px;clip-path:polygon(1% 6%,20% 0,48% 4%,75% 0,99% 5%,100% 40%,98% 96%,70% 100%,40% 96%,12% 100%,0 92%,2% 45%);font:900 170px/1.05 Play;color:#fff;letter-spacing:-4px;transform:scaleX(.86)"></span></div>
<div id="s18i" class="full">${Array.from({length:26},(_,i)=>`<div class="a blot" data-d="${(i%9)*0.12}" style="left:${(i*397)%1880-60}px;top:${(i*233)%1040-60}px;width:${120+(i%5)*70}px;height:${100+(i%4)*60}px;border-radius:${40+i%3*10}% ${60-i%4*8}% ${50+i%2*14}% 45%;background:#151210;filter:blur(2px);transform:rotate(${i*37}deg)"></div>`).join('')}</div>
<div class="full" style="background:radial-gradient(circle at 50% 50%,transparent 40%,rgba(20,15,10,.7) 70%)"></div></div></div>
<div class="sc" id="S19"><div class="full" style="background:#000"></div></div>`;

const runtime = `
const E={o3:t=>1-Math.pow(1-t,3),io:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,i3:t=>t*t*t,back:t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)}};
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)), P=(t,a,b)=>cl((t-a)/(b-a)), $=id=>document.getElementById(id), F=1/30;
const st=(id,o)=>Object.assign($(id).style,o);
function type(id,s,t,t0,fpc=2){const n=Math.floor((t-t0)/(fpc*F))+1;$(id).textContent=t<t0?'':s.slice(0,n);}
function words(id,arr,t,blurF=4){$(id).innerHTML=arr.filter(([tm])=>t>=tm).map(([tm,w])=>w==='\\n'?'<br>':'<span style="display:inline-block;filter:blur('+((1-P(t,tm,tm+blurF*F))*14).toFixed(1)+'px);opacity:'+P(t,tm,tm+2*F)+'">'+w+'</span>').join(' ');}
function blurIn(id,t,t0,f=6,max=14){const p=P(t,t0,t0+f*F);st(id,{filter:'blur('+((1-p)*max).toFixed(1)+'px)',opacity:t<t0?0:Math.min(1,p*2)});}
function draw(id,t,t0,f){const p=E.o3(P(t,t0,t0+f*F));$(id).querySelector('path').style.strokeDashoffset=1-p;$(id).style.opacity=p>0.001?1:0;}
function cam(sc,o){const c=$(sc).querySelector('.cam');c.style.transform='translate('+(o.x||0)+'px,'+(o.y||0)+'px) scale('+(o.s||1)+') rotate('+(o.r||0)+'deg)';c.style.filter=o.f||'none';}
function drift(id,t){ if($(id)) $(id).style.transform='translate('+(t*40)+'px,'+(t*12)+'px)'; }
const SC=[
['S1',0,1.3,(t)=>{type('s1a','In',t,0);type('s1b','1902',t,.13);cam('S1',{s:1+.06*t/1.3});drift('sh1',t);}],
['S2',1.3,3.3,(t)=>{blurIn('s2c',t,.15,6);drift('sh2',t);let s=1+.08*E.io(P(t,0,1.2));const p=P(t,1.2,2.0);s+=E.i3(p)*3.4;cam('S2',{s,f:'blur('+(Math.sin(p*Math.PI)*5).toFixed(1)+'px)'});}],
['S3',3.3,6.3,(t)=>{const cap=[[0,'couldn’t get'],[.6,'a job'],[1.2,'at any'],[1.8,'university.']].filter(a=>t>=a[0]).pop();$('s3c').textContent=cap?cap[1]:'';
 cam('S3',{s:1.06-.06*E.o3(P(t,0,.4))+.04*t/3,f:'blur('+((1-P(t,0,6*F))*10).toFixed(1)+'px)'});
 const d=P(t,2.0,2.0+10*F),k=t-2.33;st('s3l',{transform:'translateY('+((1-E.back(d))*-420)+'px) rotate('+(k>0?8*Math.exp(-4*k)*Math.sin(12*k):0)+'deg)',opacity:t<2?0:1});type('s3lt','rejected',t,2.05,1.5);}],
['S4',6.3,8.6,(t)=>{cam('S4',{s:1+.04*t/2.3,f:'blur('+((1-P(t,0,6*F))*12).toFixed(1)+'px)'});const dk=P(t,1.4,1.7);st('s4bg',{filter:'grayscale(1) contrast(1.1) brightness('+(.6-.25*dk)+') blur(2px)'});
 words('s4w',[[.15,'So'],[.32,'he'],[.48,'took'],[.62,'\\n'],[.62,'a'],[.78,'job'],[.95,'at'],[1.08,'a']],t,3);
 const o=E.o3(P(t,1.4,1.4+6*F));st('s4w',{transform:'translate('+(-260*o)+'px,'+(-90*o)+'px)',filter:'blur('+(o*10)+'px)',opacity:1-.6*o});
 blurIn('s4k',t,1.45,4);st('s4u',{width:(820*E.o3(P(t,1.6,1.6+10*F)))+'px'});}],
['S5',8.6,10.3,(t)=>{cam('S5',{s:1.02+.05*t/1.7,x:t>1.6?-400*P(t,1.6,1.7):0,f:'blur('+(((1-P(t,0,6*F))*10)+(t>1.6?8:0)).toFixed(1)+'px)'});
 const u=E.back(P(t,.17,.17+4*F));st('s5t',{transform:'rotate(-5deg) scale('+(0.2+0.8*u)+','+(0.5+0.5*u)+')',opacity:t<.17?0:1});
 words('s5tw',[[.25,'Technical'],[.45,'expert,']],t,2);const k=P(t,.65,.65+3*F);st('s5k',{transform:'rotate(-5deg) scale('+(1.25-.25*E.o3(k))+')',opacity:t<.65?0:1});}],
['S6',10.3,11.6,(t)=>{const p=P(t,0,.5);$('s6str').style.display=t<.5?'block':'none';$('s6p').style.display=t<.5?'none':'block';
 const w=60+1860*E.i3(p);st('s6s',{width:w+'px',marginLeft:(-w/2)+'px',filter:'blur('+(1.5+p*3)+'px)',transform:'translateX('+Math.sin(t*40)*20+'px)'});
 blurIn('s6t',t,.5,6,16);drift('sh6',t);}],
['S7',11.6,14.2,(t)=>{cam('S7',{s:1+.05*t/2.6});const on=(t>.1&&t<.17)||t>.23;st('s7cone',{opacity:on?1:0});st('s7bulb',{opacity:on?1:.15});
 blurIn('s7a',t,.5,4);const p=E.back(P(t,1.0,1.0+15*F));st('s7l',{transform:'translate('+((1-p)*-380)+'px,'+((1-p)*420)+'px) rotate('+(-25+21*p)+'deg)',opacity:t<1?0:1});}],
['S8',14.2,15.0,(t)=>{const w=E.o3(P(t,0,5*F));cam('S8',{y:(1-w)*300,f:'blur('+((1-w)*12)+'px)'});const step=Math.min(3,Math.max(0,(t-.2)/(4*F)));st('s8d',{top:(185+200*E.io(step/3)*3)+'px'});}],
['S9',15.0,17.6,(t)=>{cam('S9',{s:1+.05*t/2.6,r:-2+2*t/2.6});drift('sh9',t);
 [0,1,2].forEach(i=>{const t0=i*4*F,p=E.back(P(t,t0,t0+8*F)),m=1-P(t,t0,t0+8*F);st('p'+i,{transform:'translate('+((1-p)*-900)+'px,'+((1-p)*-700)+'px) rotate('+([-8,3,9][i]+(1-p)*25)+'deg)',filter:'blur('+(m*10)+'px)',opacity:t<t0?0:1});
  st('tp'+i,{opacity:t>t0+10*F?1:0});});
 words('s9w',[[.5,'Four'],[.72,'papers']],t,4);st('s9s',{left:'760px',top:'190px',width:'420px',height:'640px'});draw('s9s',t,1.1,24);
 {const q=E.o3(P(t,.9,.9+6*F));st('s9lb',{transform:'scaleX('+q+')',transformOrigin:'0 50%',opacity:q>0.001?1:0});}type('s9lt','in 1905',t,1.12,2);}],
['S10',17.6,19.2,(t)=>{type('s10s','One explained',t,.05,1);st('s10b',{transform:'scale('+(0.92+.08*E.o3(P(t,0,.3)))+')'});{const q=E.o3(P(t,.5,.5+5*F));st('s10y',{transform:'scaleX('+q+')',opacity:q>0.001?1:0});}type('s10w','light',t,.55,2);cam('S10',{s:1+.04*t/1.6});}],
['S11',19.2,20.9,(t)=>{cam('S11',{s:1+.04*t/1.7});const m=E.o3(P(t,.05,.05+10*F));st('s11m',{transform:'translateX('+((1-m)*1100)+'px)'});
 document.querySelectorAll('#S11 .dot').forEach(d=>{const i=+d.dataset.i;d.style.transform='translate('+(Math.sin(t*37+i)*3)+'px,'+(Math.cos(t*41+i*2)*3)+'px)';});
 words('s11w',[[.3,'One'],[.48,'\\n'],[.48,'proved']],t,3);blurIn('s11k',t,.8,3);st('s11r',{clipPath:'polygon(0 20%,8% 0,40% 8%,70% 0,100% 15%,96% 80%,100% 100%,60% 90%,20% 100%,2% 85%)',WebkitMaskImage:'linear-gradient(90deg,#000 '+(E.o3(P(t,1.0,1.0+9*F))*100)+'%,transparent '+(E.o3(P(t,1.0,1.0+9*F))*100+2)+'%)',opacity:t<1.0?0:1});}],
['S12',20.9,22.8,(t)=>{st('g1',{transform:'rotate('+(t*40)+'deg)'});st('g2',{transform:'rotate('+(-t*60)+'deg)'});type('s12s','One changed',t,.1,1.2);const k=P(t,.8,.8+3*F);st('s12k',{opacity:t<.8?0:1,transform:'scale('+(1.2-.2*E.o3(k))+')'});cam('S12',{s:1+.04*t/1.9});}],
['S13',22.8,26.0,(t)=>{cam('S13',{s:1.06-.06*t/3.2});words('s13a',[[.2,'the most'],[.45,'\\n'],[.45,'famous'],[.7,'\\n'],[.7,'equation']],t,2);
 const o=E.o3(P(t,1.3,1.3+6*F));st('s13a',{transform:'translateX('+(-300*o)+'px)',filter:'blur('+(o*12)+'px)',opacity:1-o});
 type('s13k','E=mc²',t,1.4,3);const b=P(t,2.4,2.4+6*F);st('s13k',{transform:'scale('+(1-.15*b)+') translateY('+(-40*b)+'px)',filter:'blur('+(b*2)+'px)',opacity:1-.3*b});
 const e=P(t,2.5,2.5+3*F);st('s13e',{opacity:t<2.5?0:1,transform:'scale('+(1.2-.2*e)+')'});}],
['S14',26.0,28.6,(t)=>{const w=E.o3(P(t,0,8*F));cam('S14',{x:(1-w)*-1920,s:1+.04*t/2.6,f:'blur('+((1-w)*14)+'px)'});drift('sh14',t);
 {const q=E.o3(P(t,.45,.45+5*F));st('s14b',{transform:'scaleX('+q+')',opacity:q>0.001?1:0});}type('s14t','May 29th',t,.5,2);
 $('s14y').textContent=t<1.1?'':t<1.1+6*F?'19':'1919';}],
['S15',28.6,31.2,(t)=>{cam('S15',{s:1+.05*t/2.6});[0,1].forEach(i=>{const t0=i*4*F,p=E.back(P(t,t0,t0+8*F)),m=1-P(t,t0,t0+8*F);st('n'+i,{transform:'translate('+((1-p)*(i?900:-900))+'px,'+((1-p)*-600)+'px) rotate('+([-7,5][i]+(1-p)*(i?-20:20))+'deg)',filter:'blur('+(m*12)+'px)'});});
 st('s15a',{left:'260px',top:'240px',width:'1400px',height:'700px'});draw('s15a',t,.9,9);words('s15w',[[.4,'famous'],[.65,'overnight']],t,4);}],
['S16',31.2,34.2,(t)=>{const w=E.o3(P(t,0,10*F)),o=E.i3(P(t,2.8,3.0));cam('S16',{y:(1-w)*-600-o*900,r:(1-w)*8+1.5*t/3,s:1+.06*t/3,f:'blur('+((1-w)*12+o*14)+'px)'});drift('sh16',t);
 st('s16s',{left:'855px',top:'300px',width:'250px',height:'250px'});draw('s16s',t,1.2,24);}],
['S17',34.2,38.0,(t)=>{const pl=P(t,2.6,2.8);cam('S17',{s:1+.04*t/3.8+.06*E.io(pl),f:'blur('+(Math.sin(pl*Math.PI)*6)+'px)'});
 words('s17a',[[.2,'Then'],[.4,'he won'],[.6,'the']],t,4);blurIn('s17k',t,.9,3);
 const fl=[1.0,1.07,1.13,1.2];let c='#fff';fl.forEach((x,i)=>{if(t>=x)c=i%2?'#fff':'${LIME}';});if(t>=1.27)c='${LIME}';$('s17k').style.color=c;
 st('s17e',{left:'150px',top:'450px',width:'1080px',height:'230px'});draw('s17e',t,.95,6);}],
['S18',38.0,44.0,(t)=>{document.querySelectorAll('#S18 .blot').forEach(b=>{const d=+b.dataset.d;const g=E.o3(P(t,d,d+.6));b.style.opacity=t<1.3?g:1-P(t,1.3,1.6);b.style.scale=0.2+g*1.2;});
 const z=P(t,1.3,1.7);cam('S18',{s:1.25-.25*E.o3(z),f:'blur('+((1-z)*(t>1.3?8:0))+'px)'});
 type('s18a','Not bad for a',t,1.6,2);const s=t<2.6?'':t<2.9?'patent':'patent clerk.';$('s18b').textContent=s;$('s18b').style.display=s?'inline-block':'none';
 const g=(t>2.6&&t<2.6+3*F)||(t>2.9&&t<2.9+3*F);st('s18k',{transform:g?'translateX('+(Math.sin(t*900)*24)+'px) skewX('+(Math.cos(t*700)*8)+'deg)':'none',filter:g?'drop-shadow(6px 0 0 rgba(0,255,255,.6)) drop-shadow(-6px 0 0 rgba(255,0,0,.6))':'none'});}],
['S19',44.0,45.01,()=>{}]];
function render(t){for(const [id,a,b,f] of SC){const on=t>=a&&t<b;$(id).style.display=on?'block':'none';if(on)f(t-a);} $('gt').setAttribute('seed',Math.floor(t*30)%97);}
`;
const html = `<html><head><meta charset="utf-8"><style>${css}</style></head><body>${scenes}<div id="vig"></div><svg id="grain" width="1920" height="1080"><filter id="gf"><feTurbulence id="gt" type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="1"/></filter><rect width="100%" height="100%" filter="url(#gf)"/></svg><script>${runtime}</script></body></html>`;
fs.writeFileSync(S + '/sb3/page.html', html);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + S + '/sb3/page.html'); await p.waitForTimeout(500);
  fs.mkdirSync(OUT, { recursive: true });
  if (ONLY) { for (const t of ONLY.split(',').map(Number)) { await p.evaluate(t => render(t), t); await p.screenshot({ path: `${OUT}/t${t.toFixed(2)}.jpg`, type: 'jpeg', quality: 80 }); } await b.close(); return; }
  const ffm = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', OUT + '/einstein_45s_16x9.mp4']);
  for (let f = 0; f < 1350; f++) { await p.evaluate(t => render(t), f / 30); ffm.stdin.write(await p.screenshot({ type: 'jpeg', quality: 92 })); if (f % 150 === 0) console.log('frame', f); }
  ffm.stdin.end(); await new Promise(r => ffm.on('close', r)); await b.close(); console.log('done');
})();
