"""Preview v2. Changes from v1:
 - HOME / PLAN in the "Make better Scripts" style: flat solid accent, tight bold, small setup words above at the L/R corners,
   chunky pixel clusters in the same hue, slight motion-blur ghost (no glow fill).
 - Heavy words toned down to the "Nexus." / "$10,000 per month" look: white -> pale-gold fill, soft small glow, accent dot,
   optional glowing highlight bar under the word.
 - Motion graphics from the new reference grid: glass gauge widget (Rc), product-card + light-ribbon loop (Rc),
   music-player card with speaker as album art (Rb), 3D gold key + orbit ring (Ra), '$$$' + V lines + 3D swing heavy (Ra),
   light-beam sweep transition (Rb).
"""
import json, random

CSS = r"""
@font-face{font-family:Inter;src:url(inter.woff2) format('woff2');font-weight:100 900}
@font-face{font-family:Allura;src:url(allura.woff2) format('woff2')}
@font-face{font-family:Antonio;src:url(antonio.woff2) format('woff2');font-weight:700}
:root{--ink:#160C06;--umber:#6B3410;--ember:#EB8858;--gold:#EDBF1E;--amber:#FFC000;--cream:#FFF4DE;--hot:#FF9A3C;--solid:#FFB21A}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
.stage{position:absolute;inset:0;overflow:hidden;font-family:Inter;font-variation-settings:'opsz' 32}
.cam{position:absolute;inset:0;transform-origin:50% 35%}
.bg,.cut{position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover}
.grade{position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 35%,rgba(0,0,0,0) 45%,rgba(14,6,0,.62) 100%),linear-gradient(180deg,rgba(255,150,60,.10),rgba(40,12,0,.25) 70%,rgba(10,4,0,.55))}
.warm{position:absolute;inset:0;background:#ff9a3c;mix-blend-mode:soft-light;opacity:.28}
/* heavy words: Nexus-style, low glow */
.hv{background:linear-gradient(180deg,#FFFFFF 30%,#FFF1CF 70%,#FFE2A0 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 0 8px rgba(255,214,140,.35)) drop-shadow(0 2px 14px rgba(0,0,0,.35))}
.dot{display:inline-block;width:.15em;height:.15em;border-radius:50%;background:var(--amber);margin-left:.05em;box-shadow:0 0 10px rgba(255,192,0,.7)}
.hbar{position:absolute;left:-10px;right:-10px;bottom:.12em;height:.26em;border-radius:6px;z-index:-1;
  background:linear-gradient(90deg,#6B3410,#EB8858 30%,#FFC000 80%,#FFD36B);box-shadow:0 0 26px rgba(255,170,40,.6);opacity:.95}
.pill{display:inline-block;border-radius:999px;padding:4px 44px 14px;background:linear-gradient(180deg,#FFE58A 0%,#FFC000 55%,#F0913A 100%);
  box-shadow:0 0 0 2px rgba(255,244,222,.35) inset,0 0 22px rgba(255,192,0,.6),0 0 50px rgba(235,136,88,.45)}
.pill span{font-family:Allura;color:var(--ink);font-size:104px;line-height:1;display:inline-block;transform:translateY(6px)}
.cap{position:absolute;left:0;right:0;bottom:270px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px}
.l1{max-width:900px;font-weight:300;font-size:58px;letter-spacing:-2px;color:var(--cream);line-height:1.08;text-wrap:balance;text-shadow:0 2px 18px rgba(0,0,0,.55)}
.l1 .now{color:var(--amber)}
.l3{font-weight:620;letter-spacing:-7px;line-height:.95;white-space:nowrap;position:relative;isolation:isolate}
.px{position:absolute}
/* Scripts-style title (behind head) */
.st{position:absolute;left:0;right:0;text-align:center}
.st .big{font-weight:780;letter-spacing:-14px;line-height:.86;color:var(--solid);display:inline-block;position:relative;
  text-shadow:0 6px 24px rgba(60,20,0,.35)}
.st .ghost{position:absolute;inset:0;color:var(--solid);opacity:.35;filter:blur(7px);transform:translateX(18px)}
.st .sm{position:absolute;font-weight:500;font-size:54px;letter-spacing:-1.5px;color:var(--cream);text-shadow:0 2px 12px rgba(0,0,0,.6)}
.box{position:absolute;width:26px;height:26px;border:3px solid rgba(255,244,222,.75);border-radius:6px}
/* glass + cards */
.card{position:absolute;border-radius:52px;background:linear-gradient(165deg,rgba(52,28,12,.92),rgba(22,12,6,.94) 60%);
  border:2px solid rgba(255,214,120,.65);box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 30px rgba(255,170,40,.25),inset 0 -3px 0 rgba(255,220,140,.8),inset 0 -60px 70px -40px rgba(255,170,40,.35);overflow:hidden}
.chip{display:inline-flex;align-items:center;gap:10px;padding:8px 20px;border-radius:999px;background:rgba(255,192,0,.16);border:1.5px solid rgba(255,192,0,.7);color:#FFE27A;font-weight:600;font-size:28px}
.chip i{width:12px;height:12px;border-radius:50%;background:var(--ember)}
.world{position:absolute;inset:0;background:radial-gradient(60% 40% at 25% 30%,rgba(235,136,88,.35),transparent 70%),radial-gradient(55% 35% at 80% 70%,rgba(255,192,0,.22),transparent 70%),radial-gradient(80% 60% at 50% 50%,#2A1508,#0E0703 85%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,210,140,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,210,140,.07) 1px,transparent 1px);background-size:72px 72px;-webkit-mask-image:radial-gradient(70% 55% at 50% 45%,#000,transparent)}
.part{position:absolute;border-radius:50%;background:#FFE27A}
.flash{position:absolute;inset:0;box-shadow:inset 0 0 120px 10px rgba(235,136,88,.45);pointer-events:none}
.ribbon{position:absolute;inset:0;pointer-events:none}
"""

SHAPES = [[(0,0),(1,0),(1,1)], [(0,0),(0,1),(1,1),(1,2)], [(0,0),(1,0),(2,0),(2,1)], [(0,0),(1,1)], [(0,0),(0,1),(1,0)], [(0,0),(1,0),(1,-1),(2,-1)]]
def pixels(cx, cy, w, h, cell, seed, alive=.8, cols=None, glow=False, anchors=None):
    r = random.Random(seed); out = []
    cols = cols or ['#FFB21A','#F0913A','#EB8858','#FFD36B','#FFE9B8']
    anchors = anchors or [(-0.06,-0.18),(0.94,-0.30),(1.02,0.78),(-0.04,0.98),(0.62,1.08),(0.34,-0.36)]
    for k,(ax,ay) in enumerate(anchors):
        for (gx,gy) in r.choice(SHAPES):
            if r.random() > alive: continue
            x = cx - w/2 + ax*w + gx*cell; y = cy - h/2 + ay*h + gy*cell; c = r.choice(cols)
            sh = f'box-shadow:0 0 12px {c};' if glow else ''
            out.append(f'<div class="px" style="left:{x:.0f}px;top:{y:.0f}px;width:{cell-2}px;height:{cell-2}px;background:{c};opacity:{.6+.4*r.random():.2f};{sh}"></div>')
    return ''.join(out)

def caption(l1='', pill='', heavy='', now=None, bar=False, px='', extra=''):
    parts = []
    if l1:
        w = l1.split(' ')
        if now is not None: w[now] = f'<span class="now">{w[now]}</span>'
        parts.append(f'<div class="l1">{" ".join(w)}</div>')
    if pill: parts.append(f'<div class="pill"><span>{pill}</span></div>')
    if heavy:
        heavy = heavy.rstrip('.,?!'); size = min(156, int(1872 / max(1, len(heavy))))
        b = '<span class="hbar"></span>' if bar else ''
        parts.append(f'<div class="l3" style="font-size:{size}px">{b}<span class="hv">{heavy}</span><span class="dot"></span>{px}</div>')
    if extra: parts.append(extra)
    return f'<div class="cap">{"".join(parts)}</div>'

def talk(t, behind='', front='', punch=1.0):
    return f'<div class="cam" style="transform:scale({punch})"><img class="bg" src="v_{t}.jpg">{behind}<img class="cut" src="cut_{t}.png"><div class="warm"></div><div class="grade"></div></div>{front}'

def world(seed=1):
    r = random.Random(seed)
    parts = ''.join(f'<div class="part" style="left:{r.randint(0,1080)}px;top:{r.randint(0,1920)}px;width:{(s:=r.choice([3,4,5,7]))}px;height:{s}px;opacity:{r.uniform(.2,.8):.2f};box-shadow:0 0 {s*3}px #FFC000"></div>' for _ in range(46))
    return f'<div class="world"></div><div class="grid"></div>{parts}'

def scripts_title(word, left, right, top, size, seed):
    """'Make  better / Scripts' lockup: small words over the L and R ends, big flat accent word, pixel clusters, ghost."""
    return f'''<div class="st" style="top:{top}px"><div class="big" style="font-size:{size}px">{word}<span class="ghost">{word}</span>
<span class="sm" style="left:6px;top:-58px">{left}</span><span class="sm" style="right:6px;top:-58px">{right}</span>
<span class="box" style="left:-56px;top:{size*0.38:.0f}px"></span></div></div>''' + pixels(540, top + size*0.45, size*len(word)*0.62, size*0.85, int(size*0.13), seed, .75,
        anchors=[(0.02,1.02),(0.10,1.02),(0.88,-0.05),(0.96,0.95),(0.84,1.05),(1.0,0.0)])

HOUSE = '<svg viewBox="0 0 24 24" width="{s}" height="{s}"><path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z" fill="#160C06"/></svg>'
KEY = '''<svg viewBox="0 0 200 420" width="{w}" style="{st}"><defs><linearGradient id="k" x1="0" x2="1" y1="0" y2="1">
<stop offset="0" stop-color="#FFF1B8"/><stop offset=".35" stop-color="#FFC000"/><stop offset=".7" stop-color="#C8741E"/><stop offset="1" stop-color="#6B3410"/></linearGradient></defs>
<g style="filter:drop-shadow(0 0 18px rgba(255,170,40,.75)) drop-shadow(0 18px 22px rgba(0,0,0,.5))">
<circle cx="100" cy="80" r="66" fill="url(#k)"/><circle cx="100" cy="80" r="30" fill="#2A1508"/>
<circle cx="56" cy="40" r="22" fill="url(#k)"/><circle cx="144" cy="40" r="22" fill="url(#k)"/><circle cx="100" cy="18" r="20" fill="url(#k)"/>
<rect x="86" y="140" width="28" height="220" rx="10" fill="url(#k)"/><rect x="70" y="150" width="60" height="16" rx="6" fill="url(#k)"/>
<rect x="114" y="300" width="46" height="22" rx="5" fill="url(#k)"/><rect x="114" y="336" width="34" height="22" rx="5" fill="url(#k)"/></g></svg>'''

def ribbon(d, w=14, op=1):
    return f'''<svg class="ribbon" width="1080" height="1920"><path d="{d}" fill="none" stroke="#FFF4DE" stroke-width="{w}" stroke-linecap="round" opacity="{op}"
style="filter:blur(3px) drop-shadow(0 0 18px #FFC000) drop-shadow(0 0 44px #EB8858)"/></svg>'''

F = {}

# 1 HOME (Scripts style) - small words over the L/R ends
F['01'] = ('01.45', '0:01.4  HOME behind head (Scripts style)',
  talk('01.45', behind=scripts_title('HOME', 'buying a', 'new', 110, 340, 'home')) + caption('Are you thinking about'))

# 2 glass gauge widget (Rc "Performance 48°")
gauge = '''<div class="card" style="left:380px;top:1000px;width:320px;height:320px;border-radius:84px;background:linear-gradient(180deg,rgba(40,22,8,.55),rgba(30,16,6,.85) 55%,rgba(255,170,40,.55));border-color:rgba(255,226,150,.8)">
<div style="position:absolute;top:30px;width:100%;text-align:center;color:#FFF4DE;font-weight:500;font-size:30px">Timeline</div>
<svg width="320" height="320" style="position:absolute;inset:0"><g transform="translate(160,182)">''' + ''.join(
 f'<line x1="0" y1="-112" x2="0" y2="-100" stroke="rgba(255,244,222,{.7 if i<=24 else .2})" stroke-width="2" transform="rotate({-120+i*240/36})"/>' for i in range(37)) + '''
<line x1="0" y1="0" x2="0" y2="-96" stroke="#FFF4DE" stroke-width="3" transform="rotate(40)" opacity=".7"/></g></svg>
<div class="hv" style="position:absolute;top:110px;width:100%;text-align:center;font-weight:700;font-size:150px;letter-spacing:-8px">10<span style="font-size:44px;letter-spacing:0;vertical-align:70px;margin-left:6px">yrs</span></div></div>'''
F['02'] = ('02.35', '0:02.3  Glass gauge widget on chest (pixel-mosaic in)',
  talk('02.35', front=gauge + pixels(540,1160,320,320,34,'g',.55,glow=True)) + caption('in the next 10 years?', now=3))

# 3 caption only, Nexus heavy + highlight bar
F['03'] = ('03.75', '0:03.7  Caption only - heavy with highlight bar',
  talk('03.75', punch=1.06) + caption("If you're in your", 'late', 'twenties', bar=True))

# 4 explainer: input bar + plan card, light ribbon behind
bar = '''<div class="card" style="left:110px;top:640px;width:860px;height:150px;border-radius:75px;display:flex;align-items:center;gap:26px;padding:0 44px">
<div style="width:70px;height:70px;border-radius:22px;background:linear-gradient(160deg,#FFE27A,#F0913A);display:flex;align-items:center;justify-content:center;font:800 44px Inter;color:#160C06">$</div>
<div style="font-weight:500;font-size:52px;color:#FFF4DE;letter-spacing:-1px">Plan your finances<span style="display:inline-block;width:5px;height:56px;background:#fff;margin-left:6px;vertical-align:-8px;box-shadow:0 0 14px #FFC000"></span></div></div>
<div class="card" style="left:200px;top:830px;width:680px;height:330px"><div style="position:relative;padding:40px 48px;display:flex;flex-direction:column;gap:26px">
<div class="chip" style="align-self:flex-start"><i></i>10-YEAR PLAN</div>
<div style="height:22px;border-radius:11px;background:rgba(255,220,150,.12)"><div style="width:18%;height:100%;border-radius:11px;background:linear-gradient(90deg,#EB8858,#FFC000)"></div></div>
<div style="display:flex;justify-content:space-between;color:rgba(255,244,222,.65);font-size:28px;font-weight:500"><span>Age 28</span><span>Age 38</span></div></div></div>'''
F['04'] = ('05.60', '0:05.6  Explainer (light-beam sweep in) - plan bar',
  world(4) + ribbon('M-60 1300 C 200 1100, 380 1500, 640 1240 S 980 1000, 1160 1180', 10, .8) + bar + caption("I'll show you how to", 'plan your', 'finances'))

# 5 timeline
nodes = [(170,1040,'YR 1',1),(370,900,'YR 3',1),(560,960,'YR 5',1),(750,800,'YR 7',.55),(920,640,'YR 10',1)]
nd = ''
for i,(x,y,l,o) in enumerate(nodes):
    last = i == len(nodes)-1; s = 120 if last else 70
    nd += f'''<div style="position:absolute;left:{x-s/2}px;top:{y-s/2}px;width:{s}px;height:{s}px;border-radius:50%;opacity:{o};{'filter:blur(5px);' if o<1 else ''}
background:{'linear-gradient(160deg,#FFE27A,#F0913A)' if last else 'radial-gradient(#FFE27A,#EB8858)'};box-shadow:0 0 24px rgba(255,192,0,.7);display:flex;align-items:center;justify-content:center">{HOUSE.format(s=62) if last else ''}</div>
<div style="position:absolute;left:{x-80}px;top:{y+s/2+14}px;width:160px;text-align:center;font-weight:600;font-size:32px;color:{'#FFE27A' if last else 'rgba(255,244,222,.75)'};opacity:{o}">{l}</div>'''
line = '<svg style="position:absolute;inset:0" width="1080" height="1920"><path d="M170 1040 C 260 960, 300 880, 370 900 S 480 990, 560 960 S 680 830, 750 800 S 860 690, 920 640" stroke="#FFC000" stroke-width="6" fill="none" style="filter:drop-shadow(0 0 8px #FFC000)"/></svg>'
F['05'] = ('06.90', '0:06.9  Explainer - 10-year timeline',
  world(5) + line + nd + caption('over the next', '', '10 years', bar=True))

# 6 milestone card + 3D gold key + orbit ring (Ra "Consistency is the Key")
home = '''<div class="card" style="left:120px;top:1010px;width:640px;height:320px;transform:rotate(-3deg)">
<div style="position:relative;padding:38px 40px;display:flex;gap:28px;align-items:center">
<div style="width:116px;height:116px;border-radius:34px;background:linear-gradient(160deg,#FFE27A,#F0913A);display:flex;align-items:center;justify-content:center">''' + HOUSE.format(s=72) + '''</div>
<div><div style="font-weight:300;font-size:34px;color:rgba(255,244,222,.75)">Milestone</div><div class="hv" style="font-weight:700;font-size:68px;letter-spacing:-3px;line-height:1">Homeowner</div></div></div>
<div style="position:absolute;left:40px;bottom:36px;display:flex;gap:16px"><div class="chip"><i></i>Before 40</div></div></div>
<svg style="position:absolute;inset:0" width="1080" height="1920"><path d="M640 1400 A 300 300 0 0 1 1060 980" fill="none" stroke="rgba(255,244,222,.55)" stroke-width="3"/><circle cx="742" cy="1258" r="11" fill="#FFF4DE"/></svg>''' + KEY.format(w=150, st='position:absolute;left:790px;top:900px;transform:rotate(32deg)')
F['06'] = ('09.30', '0:09.3  Card on chest + 3D gold key with orbit ring',
  talk('09.30', front=home) + caption("So you can buy a home before you're out of your", '', 'thirties'))

# 7 PLAN (Scripts style)
F['07'] = ('10.60', '0:10.6  PLAN behind head (Scripts style)',
  talk('10.60', behind=scripts_title('PLAN', 'your', '10-year', 110, 340, 'plan')) + caption("Let's break it down", 'step by step'))

# 8 music-player card (Rb) - speaker as album art, steps as tracks, play pressed on "started"
tracks = [('Step 1 - Budget', 1), ('Step 2 - Save', 0)]
tr = ''.join(f'''<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0">
<div><div style="font-weight:600;font-size:30px;color:{'#FFC000' if a else '#FFF4DE'}">{t}</div><div style="font-size:22px;color:rgba(255,244,222,.5);display:flex;align-items:center;gap:8px"><i style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#FFC000"></i>Your money plan</div></div>
<div style="color:rgba(255,244,222,.5);font-size:30px;letter-spacing:2px">···</div></div>''' for t,a in tracks)
player = f'''<div class="card" style="left:200px;top:925px;width:680px;height:380px;border-radius:40px;background:linear-gradient(180deg,rgba(60,32,10,.94),rgba(16,9,4,.96))">
<div style="position:relative;padding:26px 34px">
<div style="display:flex;gap:24px;align-items:flex-end">
<div style="width:130px;height:130px;border-radius:12px;background:url(v_11.95.jpg) 50% 20%/240px auto;box-shadow:0 12px 30px rgba(0,0,0,.6)"></div>
<div style="flex:1"><div style="font-weight:700;font-size:40px;color:#FFF4DE;letter-spacing:-1px;line-height:1.05">The 10-Year Plan</div>
<div style="font-size:24px;color:rgba(255,244,222,.6);margin-top:8px">Playlist · 4 steps</div></div>
<div style="width:84px;height:84px;border-radius:50%;background:#FFC000;box-shadow:0 0 30px rgba(255,192,0,.7);display:flex;align-items:center;justify-content:center;transform:scale(.92)">
<svg width="40" height="40" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" fill="#160C06"/><rect x="14" y="5" width="4" height="14" fill="#160C06"/></svg></div></div>
<div style="margin-top:10px">{tr}</div></div></div>'''
F['08'] = ('11.95', '0:11.9  Player card - play pressed on "started"',
  talk('11.95', front=player) + caption('so you can get', 'started', 'today'))

# 9 product-card + light-ribbon loop (Rc)
gc = '''<div style="position:absolute;left:300px;top:640px;width:480px;height:560px;border-radius:56px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 0 2px rgba(255,226,150,.6)">
<div style="height:300px;background:linear-gradient(180deg,#FFF1CF,#FFD580);display:flex;align-items:center;justify-content:center">
<div style="width:170px;height:170px;border-radius:44px;background:linear-gradient(160deg,#FFC000,#EB8858);display:flex;align-items:center;justify-content:center;box-shadow:0 16px 30px rgba(107,52,16,.35)">''' + HOUSE.format(s=110) + '''</div></div>
<div style="height:260px;background:linear-gradient(180deg,#2A1508,#160C06);text-align:center;padding-top:34px">
<div style="font-weight:800;font-style:italic;font-size:62px;color:#FFF4DE;letter-spacing:-2px">Buy a home</div>
<div style="font-size:28px;color:rgba(255,244,222,.6);margin-top:6px">goal #1 for most people</div>
<div style="font-size:40px;color:#FFC000;letter-spacing:8px;margin-top:14px">★★★★★</div></div></div>
<div style="position:absolute;left:170px;top:700px;width:300px;height:420px;border-radius:44px;background:linear-gradient(180deg,rgba(255,241,207,.35),rgba(42,21,8,.7));transform:rotate(-8deg);filter:blur(4px);opacity:.6"></div>
<div style="position:absolute;left:620px;top:700px;width:300px;height:420px;border-radius:44px;background:linear-gradient(180deg,rgba(255,241,207,.35),rgba(42,21,8,.7));transform:rotate(8deg);filter:blur(4px);opacity:.6"></div>'''
F['09'] = ('14.20', '0:14.2  Explainer - goal card carousel + light ribbon',
  world(9) + ribbon('M330 560 C 120 760, 140 1180, 420 1260 S 960 1220, 900 880 S 600 470, 330 560', 16, .9).replace('<svg class="ribbon"','<svg class="ribbon" style="z-index:0"')
  + gc + ribbon('M420 1260 C 640 1300, 880 1240, 930 1020', 16, 1) + caption('Buying a home is one of the biggest', 'financial', 'goals'))

# 10 caption only
F['10'] = ('16.60', '0:16.6  Caption only (punch-in)',
  talk('16.60', punch=1.05) + caption("but as you're likely", 'aware,'))

# 11 '$$$' + V lines + 3D swing heavy (Ra "Multibillion dollar / $$$")
dollars = '''<div style="position:absolute;left:0;right:0;top:930px;text-align:center;font-family:Antonio;font-weight:700;font-size:400px;line-height:1;letter-spacing:-6px;
background:linear-gradient(180deg,rgba(255,241,207,.85),rgba(255,192,0,.35));-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 8px 30px rgba(0,0,0,.4))">$$$</div>
<svg style="position:absolute;inset:0" width="1080" height="1920"><path d="M40 1180 L 540 1520 L 1040 1180" fill="none" stroke="rgba(255,244,222,.55)" stroke-width="3"/></svg>'''
F['11'] = ('18.10', '0:18.1  $$$ + V lines, heavy swings in (3D), edge flash',
  talk('18.10', front=dollars + '<div class="flash"></div>')
  + caption("it's gotten pretty", '', 'pricey', bar=True).replace('<div class="l3"', '<div class="l3" style2="" ').replace('style2="" style="', 'style="transform:perspective(900px) rotateY(-14deg) rotateZ(-3deg);'))

for k,(t,label,body) in F.items():
    open(f'g{k}.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="stage">{body}</div></body></html>')
json.dump({k:[v[0],v[1]] for k,v in F.items()}, open('frames2.json','w'), indent=1)
print('wrote', len(F))
