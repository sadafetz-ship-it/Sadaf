import sys, os, random, json
W = sys.argv[1]; OUT = os.path.join(W, 'preview_v9'); os.makedirs(OUT, exist_ok=True)
FONT = os.path.join(W, 'fonts/package/files/allura-latin-400-normal.woff2')
P = lambda f: 'file://' + os.path.join(W, f)
LIME, PALE, INK, OLIVE = '#B8FF37', '#D8FF92', '#17200D', '#7A963F'
MINT, SKY, SUN = '#6CF0C2', '#63D3FF', '#FFD166'
ACC='linear-gradient(90deg,#4CDAB4 0%,#84E572 50%,#C2F433 100%)'
ACCT='linear-gradient(135deg,#C2F433 0%,#84E572 50%,#4CDAB4 100%)'
DK='#0B2A17'
ACCD='linear-gradient(90deg,#34B994 0%,#69C657 50%,#A2CF22 100%)'
HEAVYFILL = "linear-gradient(180deg,#FFFFFF 20%,#F2FFE0 55%,#D8FF92 100%)"
CSS = f"""
@font-face{{font-family:Allura;src:url('{P('fonts/package/files/allura-latin-400-normal.woff2')}')}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1080px;height:1920px;overflow:hidden;background:{INK};font-family:'Inter Display',Inter,sans-serif;color:#fff;position:relative}}
.abs{{position:absolute;inset:0}} .bg{{background-size:cover}}
.grade{{background:linear-gradient(180deg,rgba(23,32,13,.35) 0%,rgba(23,32,13,0) 24%,rgba(23,32,13,0) 48%,rgba(10,14,6,.82) 78%,rgba(10,14,6,.94) 100%)}}
.tint{{background:{OLIVE};mix-blend-mode:soft-light;opacity:.35}}
/* ---- captions: Nexus lockup ---- */
.cap{{position:absolute;left:0;right:0;bottom:250px;text-align:center}}
.c1{{font-weight:300;font-size:56px;letter-spacing:-1.5px;line-height:1.12;max-width:900px;margin:0 auto 4px;text-wrap:balance}}
.blk{{display:inline-block;text-align:left;position:relative}}
.c2{{font-family:Allura;font-size:118px;line-height:.9;color:{PALE};margin:0 -60px -18px 18px;padding:0 60px 0 0;white-space:nowrap;
  filter:drop-shadow(0 0 3px rgba(216,255,146,.3))}}
.c2 .tail{{font-family:'Inter Display';font-weight:300;font-size:52px;color:#fff;letter-spacing:-1px;margin-left:18px;filter:none;vertical-align:18px}}
.c3{{font-weight:600;letter-spacing:-5px;line-height:1.02;position:relative;white-space:nowrap}}
.c3 .g{{background:{HEAVYFILL};-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 2px 6px rgba(0,0,0,.35)) drop-shadow(0 0 5px rgba(216,255,146,.22))}}
.c3 .dot{{color:#C2F433;text-shadow:0 0 5px rgba(76,218,180,.45)}}
.hbar{{position:absolute;left:-6px;right:-6px;bottom:6px;height:30px;border-radius:15px;
  background:{ACC};opacity:.9;box-shadow:0 0 12px rgba(132,229,114,.5);z-index:-1}}
/* ---- top words: Scripts style ---- */
.top{{position:absolute;left:0;right:0;text-align:center}}
.tw{{display:inline-block;position:relative;padding:0 10px}}
.tsm{{position:absolute;top:-34px;font-weight:400;font-size:56px;letter-spacing:-1.5px;color:#fff;opacity:.92;text-shadow:0 2px 14px rgba(0,0,0,.35)}}
.tbig{{font-weight:800;letter-spacing:-9px;line-height:1;background:{ACCD};-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:blur(.5px) drop-shadow(0 0 8px rgba(105,198,87,.3))}}
.ghost{{position:absolute;inset:0;opacity:.14;filter:blur(14px);transform:scale(1.06)}}
.top.light .tbig{{background:linear-gradient(90deg,#0B6B4F 0%,#1F8436 50%,#4E8A0B 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 3px 10px rgba(11,42,23,.28)) drop-shadow(0 0 1px rgba(11,42,23,.6))}}
.top.light .ghost{{display:none}}
.top.light .tsm{{color:#0B2A17;opacity:1;font-weight:500;text-shadow:0 1px 8px rgba(255,255,255,.35)}}
.top.light .hd{{border-color:#0B2A17;box-shadow:none}}
.hd{{position:absolute;width:26px;height:26px;border-radius:7px;border:3px solid rgba(255,255,255,.85);top:50%;margin-top:-6px;box-shadow:0 0 10px rgba(255,255,255,.4)}}
.px{{position:absolute}}
/* ---- shared UI ---- */
.pill{{display:inline-flex;align-items:center;gap:14px;padding:14px 32px;border-radius:999px;background:{ACC};font-size:34px;font-weight:700;letter-spacing:-.5px;color:{DK};box-shadow:inset 0 2px 0 rgba(255,255,255,.45),0 10px 30px rgba(76,218,180,.35)}}
.pill i{{width:14px;height:14px;border-radius:50%;background:{DK};opacity:.75}}
.caret{{display:inline-block;width:4px;height:1em;background:#fff;box-shadow:0 0 10px #fff,0 0 20px {LIME};vertical-align:-4px;margin-left:4px}}
.card{{position:absolute;border-radius:52px;padding:44px 48px;
  background:linear-gradient(180deg,rgba(30,44,16,.95),rgba(14,21,8,.97)),repeating-linear-gradient(0deg,transparent 0 39px,rgba(216,255,146,.05) 39px 40px);
  border:2px solid rgba(132,229,114,.45);box-shadow:inset 0 -3px 0 #84E572,0 40px 90px -30px rgba(76,218,180,.5)}}
.k{{font-size:26px;font-weight:600;color:{OLIVE};letter-spacing:3px;text-transform:uppercase}}
.t{{font-size:58px;font-weight:700;letter-spacing:-2px;line-height:1.02;margin-top:10px}}
.row{{display:flex;align-items:center;gap:22px;font-size:44px;font-weight:500;padding:20px 0;border-top:1px solid rgba(216,255,146,.14)}}
.row .ic{{width:64px;height:64px;border-radius:20px;display:grid;place-items:center;font-size:32px;background:rgba(184,255,55,.12);border:2px solid rgba(184,255,55,.4)}}
.row.on .ic{{background:{LIME};color:{INK};box-shadow:0 0 24px {LIME}}}
.row.off{{color:rgba(255,255,255,.35)}} .row.off .ic{{opacity:.4}}
.row.active{{color:{PALE}}} .row.active .ic{{border-color:{PALE};box-shadow:0 0 30px rgba(216,255,146,.7)}}
.check{{margin-left:auto;color:{LIME};font-size:40px}}
.bar{{height:18px;border-radius:9px;background:rgba(122,150,63,.35);overflow:hidden;margin-top:14px}}
.bar>b{{display:block;height:100%;background:{ACC};box-shadow:0 0 12px rgba(132,229,114,.6)}}
.btn{{display:inline-block;padding:22px 44px;border-radius:999px;background:{ACC};color:{DK};font-size:40px;font-weight:700;box-shadow:inset 0 2px 0 rgba(255,255,255,.45),0 12px 34px rgba(76,218,180,.45)}}
.tile{{position:absolute;width:190px;height:190px;border-radius:52px;display:grid;place-items:center;background:{ACCT};box-shadow:inset 0 3px 0 rgba(255,255,255,.5),inset 0 -6px 0 rgba(11,42,23,.18),0 18px 40px rgba(0,0,0,.35),0 0 30px rgba(132,229,114,.35);font-size:120px;font-weight:800}}
.tile .n{{color:{DK}}}
.sp{{position:absolute}}
.world{{background:radial-gradient(600px 500px at 20% 25%,rgba(184,255,55,.20),transparent 70%),radial-gradient(700px 600px at 85% 70%,rgba(122,150,63,.35),transparent 70%),linear-gradient(180deg,#121A0A,{INK} 60%,#0A1005)}}
.grid{{background-image:linear-gradient(rgba(216,255,146,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(216,255,146,.06) 1px,transparent 1px);background-size:80px 80px;mask-image:radial-gradient(ellipse at 50% 45%,#000 30%,transparent 80%)}}
.bubble{{position:absolute;width:260px;height:260px;border-radius:50%;background-size:260%;background-position:50% 22%;border:4px solid {LIME};box-shadow:0 0 50px rgba(184,255,55,.6)}}
.vbadge{{display:inline-grid;place-items:center;width:40px;height:40px;border-radius:50%;background:{ACCT};color:{DK};font-size:26px;font-weight:900}}
.fcard{{position:absolute;left:280px;width:520px;border-radius:26px;padding:40px 40px 24px;
  background:linear-gradient(165deg,rgba(78,108,44,.92) 0%,rgba(40,60,24,.94) 45%,rgba(20,30,12,.96) 100%);
  border:1px solid rgba(216,255,146,.22);box-shadow:0 30px 70px -20px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.12)}}
.fcard h3{{text-align:center;font-weight:500;font-size:44px;line-height:1.12;letter-spacing:-.5px;color:#fff}}
.fcard .ln{{height:5px;border-radius:3px;margin:20px 8px 24px;background:linear-gradient(90deg,transparent,#4CDAB4 18%,#84E572 50%,#C2F433 82%,transparent);box-shadow:0 0 10px rgba(108,240,194,.6)}}
.fi{{display:flex;align-items:center;gap:20px;font-size:40px;font-weight:400;color:#fff;margin:0 0 26px 6px;white-space:nowrap}}
.fi svg{{flex:none;filter:drop-shadow(0 0 6px {MINT}) drop-shadow(0 0 12px rgba(255,255,255,.6))}}
.fi.dim{{opacity:.55}} .fi.dim span{{-webkit-mask-image:linear-gradient(90deg,#000 15%,transparent 45%);mask-image:linear-gradient(90deg,#000 15%,transparent 45%)}}
.fi.off{{opacity:0}}
"""
STAR='<svg width="44" height="44" viewBox="-22 -22 44 44"><path d="M0,-20 C2,-4 4,-2 20,0 C4,2 2,4 0,20 C-2,4 -4,2 -20,0 C-4,-2 -2,-4 0,-20Z" fill="#fff"/></svg>'
def fcard(title, items, top, state):
    rows=''.join(f'<div class="fi {st}">{STAR}<span>{it}</span></div>' for it,st in zip(items,state))
    return f'<div class="fcard" style="top:{top}px"><h3>{title}</h3><div class="ln"></div>{rows}</div>'
TSP='<svg class="sp" style="right:-30px;top:-6px" width="34" height="34" viewBox="-17 -17 34 34"><path d="M0,-16C1.6,-3 3,-1.6 16,0C3,1.6 1.6,3 0,16C-1.6,3 -3,1.6 -16,0C-3,-1.6 -1.6,-3 0,-16Z" fill="#C2F433"/></svg><svg class="sp" style="left:-24px;bottom:4px" width="22" height="22" viewBox="-17 -17 34 34"><path d="M0,-16C1.6,-3 3,-1.6 16,0C3,1.6 1.6,3 0,16C-1.6,3 -3,1.6 -16,0C-3,-1.6 -1.6,-3 0,-16Z" fill="#4CDAB4"/></svg>'
random.seed(4)
def particles(n=60): return ''.join(f'<div style="position:absolute;left:{random.randint(0,1060)}px;top:{random.randint(0,1900)}px;width:{random.choice([3,4,6])}px;height:{random.choice([3,4,6])}px;border-radius:50%;background:{random.choice([PALE,LIME,"#fff"])};opacity:{random.choice([.25,.45,.7])};box-shadow:0 0 8px {LIME}"></div>' for _ in range(n))
def world(inner): return f'<div class="abs world"></div><div class="abs grid"></div>{particles()}{inner}'

def pixels(cell, seed):
    random.seed(seed)
    shapes=[[(0,0),(1,0),(1,1)],[(0,0),(1,0),(2,0),(2,1)],[(0,1),(1,1),(1,0)],[(0,0),(1,0)],[(0,0)],[(0,0),(0,1)]]
    anchors=[(-0.10,0.40),(-0.06,0.05),(1.02,0.05),(1.0,0.45),(0.47,-0.20),(0.30,0.93)]
    cols=[('#C2F433',1),('#84E572',.9),('#4CDAB4',.9),('#C2F433',.45),('#4CDAB4',.6)]
    out=[]
    for ax,ay in anchors:
        sh=random.choice(shapes)
        for dx,dy in sh:
            c,o=random.choice(cols)
            out.append(f'<div class="px" style="left:calc({ax*100:.0f}% + {dx*cell}px);top:calc({ay*100:.0f}% + {dy*cell}px);width:{cell}px;height:{cell}px;background:{c};opacity:{o};box-shadow:0 0 8px {c}"></div>')
    return ''.join(out)

def topword(left, right, big, top, size=220, seed=1, on='light'):
    return f'''<div class="top {on}" style="top:{top}px"><div class="tw">
  <span class="tsm" style="left:30px;top:{-int(size*0.06)-30}px">{left}</span><span class="tsm" style="right:30px;top:{-int(size*0.06)-30}px">{right}</span>
  <span class="ghost tbig" style="font-size:{size}px">{big}</span>
  <span class="tbig" style="font-size:{size}px;position:relative">{big}</span>
  <span class="hd" style="left:-40px"></span><span class="hd" style="right:-40px"></span>
  {pixels(int(size*0.13), seed)}</div></div>'''

def cap(l1, script, heavy, tail='', bar=False, dot='.'):
    size = min(150, int(1650/max(len(heavy),1)))
    t = f'<span class="tail">{tail}</span>' if tail else ''
    b = '<div class="hbar"></div>' if bar else ''
    return f'''<div class="cap"><div class="c1">{l1}</div><div class="blk"><div class="c2">{script}{t}</div>
<div class="c3" style="font-size:{size}px;isolation:isolate">{b}<span class="g">{heavy}</span><span class="dot">{dot}</span></div></div></div>'''

def talk(t, behind='', front='', c=''):
    cut = f'<img class="abs" src="{P(f"stills/c_{t}.png")}">' if behind else ''
    return f'''<div class="abs bg" style="background-image:url('{P(f"stills/s_{t}.png")}')"></div>{behind}{cut}<div class="abs tint"></div><div class="abs grade"></div>{front}{c}'''

def contour(cx,cy,n=7,seed=2,op=.22):
    random.seed(seed); import math
    paths=[]
    for i in range(n):
        r=90+i*70; pts=[]
        p1,p2,p3=random.uniform(0,6.3),random.uniform(0,6.3),random.uniform(0,6.3)
        for a in range(0,361,4):
            ra=math.radians(a); rr=r*(1+.10*math.sin(3*ra+p1)+.06*math.sin(5*ra+p2)+.04*math.sin(8*ra+p3)); pts.append((cx+rr*math.cos(math.radians(a)),cy+rr*math.sin(math.radians(a))*0.8))
        d='M'+' L'.join(f'{x:.0f},{y:.0f}' for x,y in pts)+'Z'
        paths.append(f'<path d="{d}" fill="none" stroke="{PALE}" stroke-width="2.5" opacity="{op}" stroke-linejoin="round"/>')
    return f'<svg class="abs" width="1080" height="1920" style="filter:drop-shadow(0 0 6px {LIME})">{"".join(paths)}</svg>'

F = {}
# F1 — top word Scripts style
F[1] = ('1.30','TOP WORD (Scripts style) + caption','0.0–1.6 s', talk('1.30',
  behind=topword('Meet','CEO','Ava', 75, 230, seed=3),
  c=cap('My name is','Ava','Jurgens')))
# F2 — PBL Instagram page, animated
posts=''.join(f'<div style="width:236px;height:310px;border-radius:18px;background:url({P(f"pbl/post{i}.jpg")}) center/cover;box-shadow:0 0 0 2px rgba(216,255,146,.35);{"transform:translateY(-26px) scale(1.04);box-shadow:0 0 0 3px "+LIME+",0 0 40px "+LIME if i==2 else ""}"></div>' for i in (1,2,3))
F[2] = ('3.80','PBL PAGE · card rises + counters roll','1.6–4.9 s', world(f'''
 {contour(540,700,8,5,.15)}
 <div style="position:absolute;top:120px;left:0;right:0;text-align:center"><span class="pill" style="font-size:40px"><i></i>Personal Brand Laun<span class="caret"></span></span></div>
 <div class="card" style="left:70px;top:240px;width:940px;padding:40px 44px;transform:perspective(1600px) rotateX(8deg) rotateY(-6deg);border-top:3px solid {LIME};box-shadow:0 -6px 40px rgba(184,255,55,.6),inset 0 -3px 0 rgba(184,255,55,.9),0 40px 90px -30px rgba(184,255,55,.55)">
  <div style="display:flex;align-items:center;gap:14px;font-size:46px;font-weight:700;letter-spacing:-1px">personalbrandlaunch <span class="vbadge">✓</span></div>
  <div style="display:flex;align-items:center;gap:40px;margin-top:30px">
   <div style="width:200px;height:200px;border-radius:50%;padding:7px;background:conic-gradient(#C2F433,#84E572,#4CDAB4,#C2F433);box-shadow:0 0 40px rgba(184,255,55,.6)"><div style="width:100%;height:100%;border-radius:50%;border:6px solid {INK};background:url({P('pbl/avatar.png')}) center/cover"></div></div>
   <div style="display:flex;gap:44px;text-align:center">
    <div><div style="font-size:60px;font-weight:700">1,467</div><div style="font-size:30px;opacity:.7">posts</div></div>
    <div><div style="font-size:84px;font-weight:800;background:{ACC};-webkit-background-clip:text;color:transparent;line-height:.9">1M</div><div style="font-size:30px;color:{PALE}">followers</div></div>
    <div><div style="font-size:60px;font-weight:700">245</div><div style="font-size:30px;opacity:.7">following</div></div></div></div>
  <div style="font-size:34px;line-height:1.45;margin-top:26px;opacity:.95">Ava | Content Marketing | Social Media Management<br>
   <span style="color:{PALE}">▸</span> Helping Business Owners Grow &amp; Sell on Social<br><span style="color:{PALE}">▸</span> Built million $ biz w/ social media<span class="caret"></span><br>
   <span style="color:{LIME}">pblaunch.com</span></div>
  <div style="display:flex;gap:18px;margin-top:24px"><div class="btn" style="flex:1;text-align:center;padding:18px;font-size:34px">Follow</div><div class="btn" style="flex:1;text-align:center;padding:18px;font-size:34px;background:rgba(216,255,146,.12);color:#fff;box-shadow:none;border:2px solid rgba(216,255,146,.4)">Message</div></div>
  <div style="display:flex;gap:16px;margin-top:30px;justify-content:space-between">{posts}</div>
 </div>
 {cap('the social media','marketing','agency')}'''))
# F3 — glow-ring card cycle + top word
F[3] = ('8.35','EXPLAINER · glow-ring cards + TOP WORD','5.4–8.6 s', world(f'''
 <div style="position:absolute;left:290px;top:600px;width:500px;height:500px;border-radius:120px;border:16px solid {LIME};filter:blur(10px);opacity:.85;transform:rotate(14deg)"></div>
 <div style="position:absolute;left:290px;top:600px;width:500px;height:500px;border-radius:120px;border:4px solid #F4FFE0;filter:blur(1px);opacity:.9;transform:rotate(14deg)"></div>
 <div style="position:absolute;left:160px;top:700px;width:300px;height:330px;border-radius:44px;background:rgba(216,255,146,.10);border:2px solid rgba(216,255,146,.2);filter:blur(6px);transform:rotate(-8deg) scale(.85)"></div>
 <div style="position:absolute;left:340px;top:640px;width:400px;height:430px;border-radius:56px;overflow:hidden;box-shadow:0 0 60px rgba(184,255,55,.55),0 30px 60px rgba(0,0,0,.5)">
  <div style="height:220px;background:linear-gradient(160deg,#EFFFD2,{PALE});display:grid;place-items:center;font-size:120px;color:{INK}">◎</div>
  <div style="height:210px;background:linear-gradient(180deg,#1E2B12,{INK});text-align:center;padding-top:26px">
   <div style="font-size:54px;font-weight:800;font-style:italic;letter-spacing:-1px">Committed</div>
   <div style="font-size:26px;color:{PALE};opacity:.8;margin-top:4px">every deadline, every client</div>
   <div style="font-size:34px;color:{LIME};letter-spacing:6px;margin-top:10px;color:{SUN}">★★★★★</div></div></div>
 <div style="position:absolute;left:0;right:0;top:1130px;display:flex;justify-content:center;gap:16px">
  <span class="pill" style="font-size:28px;opacity:.55">Talented</span><span class="pill" style="font-size:28px;opacity:.55">Hardworking</span><span class="pill" style="font-size:28px;border-color:{LIME};color:#fff"><i></i>Committed</span></div>
 {topword("we're","hiring",'EDITORS',210,200,seed=8,on='dark')}
 {cap('talented, hardworking and','committed','editors')}'''))
# F4 — Content Flow
F[4] = ('10.40','EXPLAINER · Content Flow line graph','8.6–10.9 s', world(f'''
 {contour(300,900,9,7,.28)}
 <div style="position:absolute;left:90px;top:380px;width:900px;height:640px;border-radius:40px;background:linear-gradient(160deg,rgba(70,82,60,.85),rgba(30,38,24,.92));border:1.5px solid rgba(216,255,146,.25);box-shadow:0 -4px 0 {LIME},0 0 60px rgba(184,255,55,.35),0 40px 80px rgba(0,0,0,.5);transform:perspective(1400px) rotateX(14deg) rotateY(-16deg) rotateZ(-3deg);overflow:hidden">
  <div style="position:absolute;left:50px;top:40px;font-size:64px;font-weight:700;letter-spacing:-2px">Content <span style="color:{LIME};text-shadow:0 0 5px rgba(184,255,55,.4)">Flow</span></div>
  <div style="position:absolute;left:52px;top:118px;font-size:26px;opacity:.6">From raw clip to impact</div>
  <svg width="900" height="640" style="position:absolute;inset:0">
   <line x1="40" y1="560" x2="860" y2="560" stroke="#fff" stroke-width="2" stroke-dasharray="10 10" opacity=".6"/>
   <line x1="40" y1="160" x2="40" y2="560" stroke="#fff" stroke-width="2" stroke-dasharray="10 10" opacity=".4"/>
   <text x="790" y="600" fill="#fff" opacity=".7" font-size="26" font-family="Inter Display">Time</text>
   <path d="M40,560 C160,540 200,470 240,430 S380,380 450,360 S600,300 650,250 S760,190 800,170" fill="none" stroke="{LIME}" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 10px {LIME}) drop-shadow(0 0 24px {LIME})"/>
  </svg>
  {''.join(f'<div style="position:absolute;left:{x}px;top:{y}px;text-align:center;width:150px"><div style="font-size:28px;margin-bottom:8px;color:{c}">{lab}</div><div style="margin:0 auto;width:92px;height:92px;border-radius:24px;display:grid;place-items:center;font-size:52px;background:{ACCT if bg>.5 else 'rgba(76,218,180,.15)'};border:2px solid #84E572;box-shadow:0 0 {g//2}px rgba(132,229,114,.6);color:{DK if bg>.5 else '#C2F433'}">{ic}</div></div>' for x,y,lab,ic,c,bg,g in [(160,320,'Raw clip','●','#fff',.9,40),(380,250,'Edit','▶',PALE,.9,50),(590,150,'Publish','➚','#fff',.15,18)])}
  <div style="position:absolute;left:795px;top:155px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 0 20px #fff,0 0 40px {LIME}"></div>
 </div>
 {cap("who can edit our client's",'short-form','content')}'''))
# F5 — test card
F[5] = ('12.70','CHEST CARD · input bar → card','11.2–15.0 s', talk('12.70', front=f'''
 <div class="card" style="left:150px;top:1030px;width:780px;padding:34px 44px"><div class="k">Application · Step 2 of 3</div><div class="t">Editing test</div>
 <div style="display:flex;justify-content:space-between;font-size:32px;margin-top:24px;color:{PALE}"><span>● In progress</span><span>64%</span></div><div class="bar"><b style="width:64%"></b></div></div>
 <div style="position:absolute;left:800px;top:985px;font-size:80px;transform:rotate(12deg);filter:drop-shadow(0 0 20px {LIME})">🍀</div>''',
 c=cap("you're doing the",'editing','test')))
# F6 — beam wipe + remote pill
F[6] = ('17.30','LIGHT-BEAM WIPE → remote pill','15.3–17.7 s', world(f'''
 <div class="bubble" style="left:410px;top:170px;background-image:url('{P("stills/s_17.30.png")}')"></div>
 <div style="position:absolute;inset:0;background:linear-gradient(115deg,rgba(242,255,220,.95),rgba(216,255,146,.55) 60%,transparent);clip-path:polygon(760px 520px,1080px 300px,1080px 1500px);filter:blur(2px)"></div>
 <div style="position:absolute;left:736px;top:496px;width:48px;height:48px;border-radius:50%;border:4px solid #fff;box-shadow:0 0 20px #fff,0 0 40px {LIME}"></div>
 <div style="position:absolute;top:520px;left:0;right:0;text-align:center"><span class="pill" style="font-size:30px"><i></i>POSITION INFO</span></div>
 <div style="position:absolute;top:760px;left:0;right:0;text-align:center"><span style="display:inline-flex;align-items:center;gap:24px;padding:30px 54px;border-radius:999px;background:{ACC};color:{DK};font-size:60px;font-weight:700;letter-spacing:-1px;box-shadow:inset 0 3px 0 rgba(255,255,255,.45),0 16px 44px rgba(76,218,180,.45)">⌂ Remote job · work from anywh<span class="caret" style="background:#0B2A17;box-shadow:none"></span></span></div>
 {cap('This is a','remote','job')}'''))
# F7 — gauge 5–8 + wave + week
days=''.join(f'<div style="width:96px;height:96px;border-radius:26px;display:grid;place-items:center;font-size:40px;font-weight:700;{("background:"+ACCT+";color:"+DK) if i<5 else "border:2px solid rgba(216,255,146,.25);color:rgba(255,255,255,.3)"}">{d}</div>' for i,d in enumerate('MTWTFSS'))
F[7] = ('19.90','GAUGE CARD + neon wave + week chips','17.7–20.4 s', world(f'''
 <svg class="abs" width="1080" height="1920"><path d="M-40,1150 C200,1180 300,900 480,960 S760,1200 1120,1000" fill="none" stroke="{LIME}" stroke-width="70" opacity=".55" style="filter:blur(28px)"/><path d="M-40,1150 C200,1180 300,900 480,960 S760,1200 1120,1000" fill="none" stroke="#F4FFE0" stroke-width="10" style="filter:blur(3px) drop-shadow(0 0 20px {LIME})"/></svg>
 <div style="position:absolute;left:260px;top:300px;width:560px;height:520px;border-radius:110px;background:linear-gradient(180deg,rgba(40,56,24,.75),rgba(23,32,13,.85));border:2px solid rgba(216,255,146,.45);box-shadow:inset 0 -40px 60px -20px rgba(184,255,55,.55),0 0 60px rgba(184,255,55,.35);text-align:center">
  <div style="font-size:34px;margin-top:46px;opacity:.85">Hours / day</div>
  <svg width="560" height="300" style="position:absolute;left:0;top:90px">{''.join(f'<line x1="280" y1="290" x2="{280+230*__import__("math").cos(__import__("math").radians(200+i*7.0)):.0f}" y2="{290+230*__import__("math").sin(__import__("math").radians(200+i*7.0)):.0f}" stroke="{LIME if 5<=i<=13 else "rgba(216,255,146,.25)"}" stroke-width="4" stroke-dasharray="0 205 25 0"/>' for i in range(21))}</svg>
  <div style="font-size:200px;font-weight:700;letter-spacing:-8px;margin-top:40px;line-height:1;background:{HEAVYFILL};-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 6px rgba(184,255,55,.3))">5–8<span style="font-size:70px;letter-spacing:0">h</span></div></div>
 <div style="position:absolute;top:880px;left:0;right:0;display:flex;justify-content:center;gap:14px">{days}</div>
 {cap('Monday','through','Friday',bar=True)}'''))
# F8 — orbit of content
import math
orb=''
items=['post1.jpg','post2.jpg','post3.jpg','avatar.png','post2.jpg','post1.jpg','post3.jpg','post1.jpg']
for i,f in enumerate(items):
    a=math.radians(-90+i*45); x=540+360*math.cos(a)-75; y=780+360*math.sin(a)-95
    orb+=f'<div style="position:absolute;left:{x:.0f}px;top:{y:.0f}px;width:150px;height:190px;border-radius:18px;border:5px solid #fff;background:url({P("pbl/"+f)}) center/cover;transform:rotate({random.choice([-14,-8,8,14,4])}deg);box-shadow:0 0 30px rgba(184,255,55,.5)"></div>'
F[8] = ('21.10','EXPLAINER · content orbit · no caption','20.5–21.6 s', world(f'''
 <div style="position:absolute;left:340px;top:580px;width:400px;height:400px;border-radius:50%;border:2px dashed rgba(216,255,146,.35)"></div>
 {orb}
 <div style="position:absolute;left:0;right:0;top:700px;text-align:center;font-size:46px;font-weight:300">We get<br><span style="font-weight:700;color:{LIME};text-shadow:0 0 6px rgba(184,255,55,.35)">a lot of content</span><br>for you</div>
 '''))
# F9 — WHO top word
F[9] = ('22.40','TOP WORD · question · no caption','21.9–23.2 s', talk('22.40',
 behind=topword('Who is','for?','THIS JOB', 110, 170, seed=13),
 c=''))
# F10 — First
F[10] = ('26.90','TILE 1 + list card · no caption','23.2–28.9 s', talk('26.90', front=f'''
 <div class="tile" style="left:60px;top:560px;transform:rotate(-8deg)">{TSP}<span class="n">1</span></div>
 {fcard('Edit in the<br>style of', ['Hormozi','Ali Abdaal','Codie Sanchez','+ way more'], 1035, ['','','dim','off'])}''',
 c=''))
# F11 — Consistency key
F[11] = ('30.90','EXPLAINER · "Consistency is the key"','28.9–31.2 s', world(f'''
 <svg class="abs" width="1080" height="1920"><circle cx="980" cy="1250" r="560" fill="none" stroke="{PALE}" stroke-width="3" opacity=".5"/>
  <circle cx="{980+560*math.cos(math.radians(200)):.0f}" cy="{1250+560*math.sin(math.radians(200)):.0f}" r="14" fill="{LIME}" style="filter:drop-shadow(0 0 10px {LIME})"/>
  <circle cx="{980+560*math.cos(math.radians(240)):.0f}" cy="{1250+560*math.sin(math.radians(240)):.0f}" r="14" fill="{LIME}" style="filter:drop-shadow(0 0 10px {LIME})"/></svg>
 <div style="position:absolute;left:780px;top:260px;width:110px;height:110px;border-radius:30px;border:3px solid rgba(216,255,146,.5);transform:rotate(20deg)"></div>
 <div style="position:absolute;left:140px;top:420px;font-size:190px;font-weight:800;letter-spacing:-6px;transform:scaleX(.78);transform-origin:left;line-height:1;background:{HEAVYFILL};-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 6px rgba(184,255,55,.25))">Consistency</div>
 <div style="position:absolute;left:150px;top:620px;font-size:46px;font-weight:300">is the <span style="font-family:Allura;font-size:96px;color:{PALE}">key</span></div>
 <svg style="position:absolute;left:560px;top:560px;transform:rotate(-38deg);filter:drop-shadow(0 0 14px {LIME}) drop-shadow(0 0 40px {LIME})" width="380" height="160">
  <circle cx="70" cy="80" r="56" fill="none" stroke="{LIME}" stroke-width="22"/><rect x="120" y="70" width="230" height="22" rx="8" fill="{LIME}"/>
  <rect x="290" y="88" width="20" height="44" rx="4" fill="{LIME}"/><rect x="326" y="88" width="20" height="34" rx="4" fill="{LIME}"/></svg>
 <div class="tile" style="left:110px;top:900px;width:150px;height:150px;font-size:100px;border-radius:34px;transform:rotate(-6deg)">{TSP}<span class="n">2</span></div>
 {cap('someone looking','for','consistency')}'''))
# F11b — Second list card
F['11b'] = ('31.90','TILE 2 + list card · no caption','31.2–33.2 s', talk('31.90', front=f'''
 <div class="tile" style="left:50px;top:540px;transform:rotate(-12deg);opacity:.55">{TSP}<span class="n">1</span></div>
 <div class="tile" style="left:80px;top:575px;transform:rotate(-4deg)">{TSP}<span class="n">2</span></div>
 {fcard('What you<br>get here', ['Consistency','Security','Long-term job'], 1035, ['','','dim'])}''',
 c=''))
# F12 — Third
F[12] = ('37.70','TILE 3 + list card · no caption','33.3–38.2 s', talk('37.70', front=f'''
 <div class="tile" style="left:40px;top:530px;transform:rotate(-14deg);opacity:.4">{TSP}<span class="n">1</span></div>
 <div class="tile" style="left:65px;top:560px;transform:rotate(-7deg);opacity:.6">{TSP}<span class="n">2</span></div>
 <div class="tile" style="left:90px;top:595px;transform:rotate(2deg)">{TSP}<span class="n">3</span></div>
 {fcard('Someone<br>who is', ['On time, always','Dependable','Very organized'], 1035, ['','','dim'])}''',
 c=''))
# F13 — CTA
F[13] = ('40.10','TOP WORD + CTA card (PBL)','38.4–41.0 s', talk('40.10',
 behind=topword('Is this','?','YOU', 75, 230, seed=21),
 front=f'''<div class="card" style="left:150px;top:1030px;width:780px;padding:26px 40px">
  <div style="display:flex;align-items:center;gap:18px"><div style="width:86px;height:86px;border-radius:50%;padding:4px;background:conic-gradient(#C2F433,#84E572,#4CDAB4,#C2F433)"><div style="width:100%;height:100%;border-radius:50%;background:url({P('pbl/avatar.png')}) center/cover;border:3px solid {INK}"></div></div>
  <div style="font-size:36px;font-weight:700">personalbrandlaunch <span class="vbadge" style="width:32px;height:32px;font-size:20px">✓</span><div style="font-size:26px;font-weight:400;color:{PALE}">Editor application</div></div></div>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px"><div class="t" style="margin:0;font-size:50px">Submit your<br>test edit</div><div class="btn">Submit edit →</div></div></div>''',
 c=cap("Submit your test edit and","let's find",'out')))

for k,(t,mode,rng,body) in F.items():
    open(os.path.join(OUT,(f'f{k:02d}' if isinstance(k,int) else 'f'+k)+'.html'),'w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>')
json.dump({k:[t,mode,rng] for k,(t,mode,rng,_) in F.items()}, open(os.path.join(OUT,'frames.json'),'w'))
print('wrote',len(F))
