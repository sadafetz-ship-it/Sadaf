"""Generate v1 still-preview frames (1080x1920) as HTML, then screenshot with Playwright (render.js)."""
import json, random

CSS = r"""
@font-face{font-family:Inter;src:url(inter.woff2) format('woff2');font-weight:100 900}
@font-face{font-family:Allura;src:url(allura.woff2) format('woff2')}
:root{--ink:#160C06;--umber:#6B3410;--ember:#EB8858;--gold:#EDBF1E;--amber:#FFC000;--cream:#FFF4DE;--hot:#FF9A3C}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
.stage{position:absolute;inset:0;overflow:hidden;font-family:Inter;font-variation-settings:'opsz' 32}
.cam{position:absolute;inset:0;transform-origin:50% 35%}
.bg,.cut{position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover}
.grade{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 80% at 50% 35%,rgba(0,0,0,0) 45%,rgba(14,6,0,.62) 100%),
             linear-gradient(180deg,rgba(255,150,60,.10),rgba(40,12,0,.25) 70%,rgba(10,4,0,.55));mix-blend-mode:normal}
.warm{position:absolute;inset:0;background:#ff9a3c;mix-blend-mode:soft-light;opacity:.28}
/* Golden Hour glow */
.gh{background:linear-gradient(180deg,#FFFBE6 8%,#FFE27A 38%,#FFC000 64%,#EB8858 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 0 5px rgba(255,244,222,.55)) drop-shadow(0 0 16px rgba(255,192,0,.9)) drop-shadow(0 0 40px rgba(235,136,88,.9)) drop-shadow(0 0 80px rgba(255,120,30,.45))}
.pill{display:inline-block;border-radius:999px;padding:4px 44px 14px;background:linear-gradient(180deg,#FFE58A 0%,#FFC000 55%,#F0913A 100%);
  box-shadow:0 0 0 2px rgba(255,244,222,.35) inset,0 0 26px rgba(255,192,0,.85),0 0 70px rgba(235,136,88,.7)}
.pill span{font-family:Allura;color:var(--ink);font-size:104px;line-height:1;display:inline-block;transform:translateY(6px)}
/* captions */
.cap{position:absolute;left:0;right:0;bottom:270px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px}
.l1{max-width:900px;font-weight:300;font-size:58px;letter-spacing:-2px;color:var(--cream);line-height:1.08;text-wrap:balance;text-shadow:0 2px 18px rgba(0,0,0,.55)}
.l1 .now{color:var(--amber);text-shadow:0 0 18px rgba(255,192,0,.7)}
.l3{font-weight:620;letter-spacing:-7px;line-height:.95;white-space:nowrap;position:relative}
.dot{display:inline-block;width:.16em;height:.16em;border-radius:50%;background:var(--ember);margin-left:.06em;box-shadow:0 0 18px var(--ember),0 0 40px var(--hot)}
.px{position:absolute;box-shadow:0 0 16px currentColor}
.small{font-size:40px;font-weight:400;letter-spacing:-1px;color:rgba(255,244,222,.8)}
/* behind head */
.name{position:absolute;left:0;right:0;text-align:center;font-weight:800;letter-spacing:-10px;line-height:.9}
.tag{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;padding:12px 26px;border-radius:999px;
  background:rgba(22,12,6,.72);border:2px solid rgba(255,192,0,.7);color:var(--cream);font-weight:600;font-size:30px;letter-spacing:2px;
  box-shadow:0 0 24px rgba(255,192,0,.45);backdrop-filter:blur(8px)}
.tag i{width:14px;height:14px;border-radius:50%;background:var(--amber);box-shadow:0 0 12px var(--amber)}
.cursor{position:absolute;width:46px;height:46px}
/* glass card */
.card{position:absolute;border-radius:52px;background:linear-gradient(165deg,rgba(52,28,12,.92),rgba(22,12,6,.94) 60%);
  border:2px solid rgba(255,214,120,.75);box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 40px rgba(255,170,40,.35),inset 0 -3px 0 rgba(255,220,140,.9),inset 0 -60px 70px -40px rgba(255,170,40,.45);overflow:hidden}
.card:before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,220,150,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,220,150,.06) 1px,transparent 1px);background-size:36px 36px}
.chip{display:inline-flex;align-items:center;gap:10px;padding:8px 20px;border-radius:999px;background:rgba(255,192,0,.16);border:1.5px solid rgba(255,192,0,.7);color:#FFE27A;font-weight:600;font-size:28px}
.chip i{width:12px;height:12px;border-radius:50%;background:var(--ember);box-shadow:0 0 10px var(--ember)}
/* explainer world */
.world{position:absolute;inset:0;background:radial-gradient(60% 40% at 25% 30%,rgba(235,136,88,.35),transparent 70%),radial-gradient(55% 35% at 80% 70%,rgba(255,192,0,.22),transparent 70%),
  radial-gradient(80% 60% at 50% 50%,#2A1508,#0E0703 85%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,210,140,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,210,140,.07) 1px,transparent 1px);background-size:72px 72px;
  -webkit-mask-image:radial-gradient(70% 55% at 50% 45%,#000,transparent)}
.part{position:absolute;border-radius:50%;background:#FFE27A}
.flash{position:absolute;inset:0;box-shadow:inset 0 0 140px 20px rgba(235,136,88,.55);pointer-events:none}
.label{position:absolute;left:24px;top:24px;font:600 26px Inter;color:#fff;background:rgba(0,0,0,.55);padding:8px 16px;border-radius:12px;letter-spacing:.5px}
"""

PX_L = ['#EB8858', '#F0913A', '#FF9A3C', '#D9733F']   # reference: orange clusters on the left
PX_R = ['#FFC000', '#EDBF1E', '#FFE27A', '#F5C93A']   # yellow clusters on the right
SHAPES = [[(0,0),(1,0),(1,1)], [(0,0),(0,1),(1,1),(1,2)], [(0,0),(1,0),(2,0),(2,1)], [(0,0),(1,1)], [(0,0),(0,1),(1,0)], [(0,0),(1,0),(1,-1),(2,-1)]]

def pixels(cx, cy, w, h, cell, seed, alive=0.8):
    """Stair-step tetromino clusters at 6 anchors around a word box (orange left, yellow right)."""
    r = random.Random(seed); out = []
    anchors = [(-0.10,-0.30),(0.90,-0.42),(1.04,0.70),(-0.08,0.95),(0.55,1.10),(0.30,-0.50)]
    for k,(ax,ay) in enumerate(anchors):
        sh = r.choice(SHAPES); cols = PX_L if ax < 0.5 else PX_R
        for (gx,gy) in sh:
            if r.random() > alive: continue
            x = cx - w/2 + ax*w + gx*cell; y = cy - h/2 + ay*h + gy*cell
            c = r.choice(cols); o = 0.55 + 0.45*r.random()
            out.append(f'<div class="px" style="left:{x:.0f}px;top:{y:.0f}px;width:{cell-3}px;height:{cell-3}px;background:{c};color:{c};opacity:{o:.2f}"></div>')
    return ''.join(out)

def caption(l1='', pill='', heavy='', now=None, heavy_px=None, extra=''):
    parts = []
    if l1:
        words = l1.split(' ')
        if now is not None:
            words[now] = f'<span class="now">{words[now]}</span>'
        parts.append(f'<div class="l1">{" ".join(words)}</div>')
    if pill:
        parts.append(f'<div class="pill"><span>{pill}</span></div>')
    if heavy:
        heavy = heavy.rstrip('.,?!')
        size = min(156, int(1872 / max(1, len(heavy))))
        px = heavy_px or ''
        parts.append(f'<div class="l3" style="font-size:{size}px"><span class="gh">{heavy}</span><span class="dot"></span>{px}</div>')
    if extra: parts.append(extra)
    return f'<div class="cap">{"".join(parts)}</div>'

CURSOR = '<svg class="cursor" viewBox="0 0 24 24" style="{s}"><path d="M3 2l17 8-7 2-3 7z" fill="#FFF4DE" stroke="#160C06" stroke-width="1.4" stroke-linejoin="round"/></svg>'

def talk(t, body_behind='', body_front='', punch=1.0):
    return f'''<div class="cam" style="transform:scale({punch})">
<img class="bg" src="v_{t}.jpg">{body_behind}<img class="cut" src="cut_{t}.png"><div class="warm"></div><div class="grade"></div></div>{body_front}'''

def world(seed=1):
    r = random.Random(seed)
    parts = ''.join(f'<div class="part" style="left:{r.randint(0,1080)}px;top:{r.randint(0,1920)}px;width:{(s:=r.choice([3,4,5,7]))}px;height:{s}px;opacity:{r.uniform(.2,.8):.2f};box-shadow:0 0 {s*3}px #FFC000"></div>' for _ in range(46))
    return f'<div class="world"></div><div class="grid"></div>{parts}'

F = {}

# F1 1.45  HOOK - "HOME" behind head, Golden-Hour pixel reveal mid-flight
F['01'] = ('01.45', '0:01.4  Name behind head',
  talk('01.45',
    body_behind='<div class="name gh" style="top:120px;font-size:370px">HOME</div>' + pixels(540, 290, 960, 330, 40, 'home', .85)
      , body_front='<div class="tag" style="top:40px"><i></i>THE GOAL</div>' + CURSOR.format(s='left:680px;top:62px'))
  + caption('Are you thinking about', 'buying a new'))

# F2 2.35  number-tile deck on chest
tile = lambda x,y,r,o,txt,z: f'''<div class="card" style="left:{x}px;top:{y}px;width:250px;height:284px;transform:rotate({r}deg);opacity:{o};z-index:{z};border-radius:46px">
<svg style="position:absolute;inset:0" viewBox="0 0 300 340" width="250" height="284"><path d="M40 60 L110 120 L95 190 M210 40 L180 110 L240 170" stroke="rgba(255,240,210,.18)" stroke-width="2" fill="none"/></svg>
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
<div class="gh" style="font-weight:800;font-size:160px;letter-spacing:-10px;line-height:1">{txt}</div>
<div style="font-weight:600;font-size:34px;letter-spacing:10px;color:#FFE27A;margin-top:-6px">YEARS</div></div></div>'''
F['02'] = ('02.35', '0:02.3  Card on chest - 10-year tile deck',
  talk('02.35', body_front=tile(440,1062,-11,.55,'',1)+tile(425,1052,-5,.8,'',2)+tile(415,1045,3,1,'10',3)
    + pixels(540, 1187, 250, 284, 28, 'ten', .5))
  + caption('in the next 10 years?', now=3))

# F3 3.75  caption-only, punch-in, Golden-Hour heavy with pixels
F['03'] = ('03.75', '0:03.7  Caption only (punch-in)',
  talk('03.75', punch=1.06)
  + caption("If you're in your", 'late', 'twenties', heavy_px=pixels(330, 80, 700, 150, 30, 'tw', .75)))

# F4 5.60  explainer - input bar typing "Plan your finances"
bar = '''<div class="card" style="left:110px;top:640px;width:860px;height:150px;border-radius:75px;display:flex;align-items:center;gap:26px;padding:0 44px">
<div style="width:70px;height:70px;border-radius:22px;background:linear-gradient(160deg,#FFE27A,#F0913A);box-shadow:0 0 26px rgba(255,170,40,.8);display:flex;align-items:center;justify-content:center;font:800 44px Inter;color:#160C06">$</div>
<div style="font-weight:500;font-size:52px;color:#FFF4DE;letter-spacing:-1px;position:relative;z-index:1">Plan your finances<span style="display:inline-block;width:5px;height:56px;background:#fff;margin-left:6px;vertical-align:-8px;box-shadow:0 0 18px #fff,0 0 36px #FFC000"></span></div></div>
<div class="card" style="left:200px;top:830px;width:680px;height:330px;opacity:.9">
<div style="position:relative;padding:40px 48px;display:flex;flex-direction:column;gap:26px">
<div class="chip" style="align-self:flex-start"><i></i>10-YEAR PLAN</div>
<div style="height:22px;border-radius:11px;background:rgba(255,220,150,.12)"><div style="width:18%;height:100%;border-radius:11px;background:linear-gradient(90deg,#EB8858,#FFC000);box-shadow:0 0 18px #FFC000"></div></div>
<div style="display:flex;justify-content:space-between;color:rgba(255,244,222,.65);font-size:28px;font-weight:500"><span>Age 28</span><span>Age 38</span></div></div></div>'''
F['04'] = ('05.60', '0:05.6  Full-background explainer - plan bar',
  world(4) + bar + caption("I'll show you how to", 'plan your', 'finances', heavy_px=pixels(390, 80, 780, 150, 30, 'fin', .7)))

# F5 6.90  explainer - 10-year timeline (ink line, ghost-to-sharp nodes)
nodes = [(170,1040,'YR 1',1),(370,900,'YR 3',1),(560,960,'YR 5',1),(750,800,'YR 7',.55),(920,640,'YR 10',1)]
nd = ''
for i,(x,y,l,o) in enumerate(nodes):
    last = i == len(nodes)-1
    blur = 'filter:blur(5px);' if o < 1 else ''
    size = 120 if last else 74
    inner = '<svg viewBox="0 0 24 24" width="62" height="62"><path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z" fill="#160C06"/></svg>' if last else ''
    nd += f'''<div style="position:absolute;left:{x-size/2}px;top:{y-size/2}px;width:{size}px;height:{size}px;border-radius:50%;opacity:{o};{blur}
 background:{'linear-gradient(160deg,#FFE27A,#F0913A)' if last else 'radial-gradient(#FFE27A,#EB8858)'};box-shadow:0 0 30px #FFC000,0 0 70px rgba(235,136,88,.8);display:flex;align-items:center;justify-content:center">{inner}</div>
<div style="position:absolute;left:{x-80}px;top:{y+size/2+14}px;width:160px;text-align:center;font-weight:600;font-size:32px;color:{'#FFE27A' if last else 'rgba(255,244,222,.75)'};opacity:{o}">{l}</div>'''
line = '<svg style="position:absolute;inset:0" width="1080" height="1920"><path d="M170 1040 C 260 960, 300 880, 370 900 S 480 990, 560 960 S 680 830, 750 800 S 860 690, 920 640" stroke="#FFC000" stroke-width="6" fill="none" style="filter:drop-shadow(0 0 10px #FFC000) drop-shadow(0 0 24px #EB8858)"/></svg>'
F['05'] = ('06.90', '0:06.9  Explainer - 10-year timeline',
  world(5) + line + nd + caption('over the next', '', '10 years.'))

# F6 9.30  card on chest - whip-in homeowner card
home = '''<div class="card" style="left:190px;top:1000px;width:700px;height:330px;transform:rotate(-3deg)">
<div style="position:relative;padding:38px 44px;display:flex;gap:30px;align-items:center">
<div style="width:120px;height:120px;border-radius:34px;background:linear-gradient(160deg,#FFE27A,#F0913A);box-shadow:0 0 40px rgba(255,170,40,.8);display:flex;align-items:center;justify-content:center">
<svg viewBox="0 0 24 24" width="76" height="76"><path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z" fill="#160C06"/></svg></div>
<div><div style="font-weight:300;font-size:36px;color:rgba(255,244,222,.75)">Milestone</div>
<div class="gh" style="font-weight:700;font-size:72px;letter-spacing:-3px;line-height:1">Homeowner</div></div></div>
<div style="position:absolute;left:44px;bottom:36px;display:flex;gap:16px"><div class="chip"><i></i>Before 40</div><div class="chip" style="background:rgba(255,244,222,.08);border-color:rgba(255,244,222,.3);color:#FFF4DE">Keys ready</div></div></div>'''
F['06'] = ('09.30', '0:09.3  Card on chest - whip-in milestone card',
  talk('09.30', body_front=home) + caption("So you can buy a home before you're out of your", '', 'thirties.'))

# F7 10.60  behind head - "THE PLAN"
F['07'] = ('10.60', '0:10.6  Name behind head',
  talk('10.60', body_behind='<div class="name gh" style="top:120px;font-size:380px;white-space:nowrap">PLAN</div>' + pixels(540, 290, 900, 330, 38, 'plan', .8)
      , body_front='<div class="tag" style="top:40px"><i></i>STEP BY STEP</div>' + CURSOR.format(s='left:740px;top:62px'))
  + caption("Let's break it down", 'step by step'))

# F8 11.95  caption only + swoosh arc above
sw = '<svg style="position:absolute;left:0;top:0" width="1080" height="1920"><path d="M180 1340 Q 540 1180 900 1300" stroke="#FFF4DE" stroke-width="7" stroke-linecap="round" fill="none" style="filter:drop-shadow(0 0 10px #fff) drop-shadow(0 0 26px #FFC000)"/></svg>'
F['08'] = ('11.95', '0:11.9  Caption only + swoosh (punch-in)',
  talk('11.95', punch=1.06) + sw + caption('so you can get', 'started', 'today.'))

# F9 14.20  explainer - goals board, "Buy a home" highlighted
rows = [('Emergency fund', 0), ('Retirement', 0), ('Pay off debt', 0), ('Buy a home', 1)]
rh = ''
for i,(t,hi) in enumerate(rows):
    if hi:
        rh += f'''<div style="display:flex;align-items:center;gap:22px;padding:22px 28px;border-radius:30px;background:linear-gradient(90deg,rgba(255,192,0,.28),rgba(235,136,88,.18));border:2px solid #FFC000;box-shadow:0 0 34px rgba(255,192,0,.55)">
<div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(160deg,#FFE27A,#F0913A);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="38" height="38"><path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z" fill="#160C06"/></svg></div>
<div class="gh" style="font-weight:700;font-size:54px;letter-spacing:-2px">{t}</div></div>'''
    else:
        rh += f'''<div style="display:flex;align-items:center;gap:22px;padding:18px 28px;opacity:.55">
<div style="width:56px;height:56px;border-radius:16px;border:2px solid rgba(255,244,222,.4)"></div><div style="font-weight:400;font-size:46px;color:#FFF4DE">{t}</div></div>'''
board = f'''<div class="card" style="left:120px;top:560px;width:840px;height:640px"><div style="position:relative;padding:44px 40px;display:flex;flex-direction:column;gap:12px">
<div class="chip" style="align-self:flex-start;margin-bottom:10px"><i></i>BIGGEST FINANCIAL GOALS</div>{rh}</div></div>'''
F['09'] = ('14.20', '0:14.2  Explainer - goals board',
  world(9) + board + CURSOR.format(s='left:770px;top:1090px;width:60px;height:60px') + caption('Buying a home is one of the biggest', 'financial', 'goals'))

# F10 16.60  caption only
F['10'] = ('16.60', '0:16.6  Caption only (punch-in)',
  talk('16.60', punch=1.05) + caption("but as you're likely", 'aware,'))

# F11 18.10  card on chest - price chart + edge flash
chart = '''<div class="card" style="left:200px;top:1010px;width:680px;height:330px">
<div style="position:relative;padding:36px 44px"><div style="display:flex;justify-content:space-between;align-items:center">
<div style="font-weight:500;font-size:38px;color:#FFF4DE">Home prices</div><div class="chip"><i></i>&#9650; Rising</div></div>
<svg width="592" height="190" viewBox="0 0 652 270" style="margin-top:10px;overflow:visible">
<defs><linearGradient id="a" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FFC000" stop-opacity=".45"/><stop offset="1" stop-color="#FFC000" stop-opacity="0"/></linearGradient></defs>
<path d="M0 230 C 90 220, 140 200, 210 190 S 330 170, 380 140 S 500 90, 560 50 L 640 12 L 640 270 L 0 270Z" fill="url(#a)"/>
<path d="M0 230 C 90 220, 140 200, 210 190 S 330 170, 380 140 S 500 90, 560 50 L 640 12" stroke="#FFC000" stroke-width="7" fill="none" style="filter:drop-shadow(0 0 10px #FFC000) drop-shadow(0 0 24px #EB8858)"/>
<circle cx="640" cy="12" r="14" fill="#FFF4DE" style="filter:drop-shadow(0 0 14px #FFC000)"/></svg></div></div>
<div style="position:absolute;left:790px;top:950px;width:120px;height:120px;border-radius:34px;transform:rotate(12deg);background:linear-gradient(160deg,#FFE27A,#F0913A);box-shadow:0 0 50px rgba(255,170,40,.9);display:flex;align-items:center;justify-content:center;font:800 78px Inter;color:#160C06">$</div>'''
F['11'] = ('18.10', '0:18.1  Card on chest - price chart + edge flash',
  talk('18.10', body_front=chart + '<div class="flash"></div>') + caption("it's gotten pretty", '', 'pricey.', heavy_px=pixels(310, 80, 620, 150, 30, 'pr', .7)))

for k,(t,label,body) in F.items():
    open(f'f{k}.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="stage">{body}</div></body></html>')
json.dump({k:[v[0],v[1]] for k,v in F.items()}, open('frames.json','w'), indent=1)
print('wrote', len(F))
