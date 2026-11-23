"""Preview v3: 16:9 (1920x1080) full source frame.
Rules: captions in the lower third (block bottom 64 px above frame bottom, top never above y=720);
visual elements stay out of the face zone (x 650-1210, y 0-560) - they live in the left (x<=620) / right (x>=1240) side zones.
Look/motion carried from v2 (Scripts-style HOME/PLAN, low-glow heavy words, new grid motion graphics)."""
import json, random, re

src = open('gen2.py').read()
CSS = re.search(r'CSS = r"""(.*?)"""', src, re.S).group(1)
CSS = CSS.replace('html,body{width:1080px;height:1920px', 'html,body{width:1920px;height:1080px')
CSS = CSS.replace('.bg,.cut{position:absolute;inset:0;width:1080px;height:1920px', '.bg,.cut{position:absolute;inset:0;width:1920px;height:1080px')
CSS += r"""
.cap{bottom:64px;gap:2px}
.l1{max-width:1200px;font-size:46px;letter-spacing:-1.4px}
.pill{padding:2px 34px 10px}.pill span{font-size:76px}
.l3{letter-spacing:-5px}
.st .sm{font-size:40px;letter-spacing:-1px}
.zone{position:absolute;outline:3px dashed rgba(255,80,80,.0)}
"""
exec(src[src.index('SHAPES ='):src.index("F = {}")].replace('def talk', 'def _talk_unused'))  # pixels, caption, world, scripts_title, HOUSE, KEY, ribbon

def caption3(*a, **k):
    h = caption(*a, **k)
    return re.sub(r'font-size:(\d+)px', lambda m: f'font-size:{min(118, int(int(m.group(1)) * 118/156))}px' if 'l3' in h else m.group(0), h)

def talk(t, behind='', front='', punch=1.0):
    return f'<div class="cam" style="transform:scale({punch})"><img class="bg" src="f169_{t}.jpg">{behind}<img class="cut" src="c169_{t}.png"><div class="warm"></div><div class="grade"></div></div>{front}'

def world169(seed):
    r = random.Random(seed)
    parts = ''.join(f'<div class="part" style="left:{r.randint(0,1920)}px;top:{r.randint(0,1080)}px;width:{(s:=r.choice([3,4,5,7]))}px;height:{s}px;opacity:{r.uniform(.2,.8):.2f};box-shadow:0 0 {s*3}px #FFC000"></div>' for _ in range(60))
    return f'<div class="world"></div><div class="grid"></div>{parts}'

def side_title(word, left, right, x, top, size, seed):
    """Scripts lockup placed in a side zone (fully readable, off the face)."""
    w = size * len(word) * 0.64
    return f'''<div style="position:absolute;left:{x}px;top:{top}px;width:{w:.0f}px;text-align:center" class="st"><div class="big" style="font-size:{size}px">{word}<span class="ghost">{word}</span>
<span class="sm" style="left:4px;top:-46px">{left}</span><span class="sm" style="right:4px;top:-46px">{right}</span>
<span class="box" style="left:-44px;top:{size*0.38:.0f}px"></span></div></div>''' + pixels(x + w/2, top + size*0.45, w, size*0.85, int(size*0.13), seed, .75,
        anchors=[(0.02,1.02),(0.10,1.02),(0.88,-0.05),(0.96,0.95),(0.84,1.05),(1.0,0.0)])

F = {}
F['01'] = ('01.45', '0:01.4  HOME (Scripts style) in the left zone',
  talk('01.45', front=side_title('HOME', 'buying a', 'new', 70, 250, 230, 'home')) + caption3('Are you thinking about'))

gauge = '''<div class="card" style="left:1380px;top:170px;width:320px;height:320px;border-radius:84px;background:linear-gradient(180deg,rgba(40,22,8,.55),rgba(30,16,6,.85) 55%,rgba(255,170,40,.55));border-color:rgba(255,226,150,.8)">
<div style="position:absolute;top:30px;width:100%;text-align:center;color:#FFF4DE;font-weight:500;font-size:30px">Timeline</div>
<svg width="320" height="320" style="position:absolute;inset:0"><g transform="translate(160,182)">''' + ''.join(
 f'<line x1="0" y1="-112" x2="0" y2="-100" stroke="rgba(255,244,222,{.7 if i<=24 else .2})" stroke-width="2" transform="rotate({-120+i*240/36})"/>' for i in range(37)) + '''
</g></svg><div class="hv" style="position:absolute;top:110px;width:100%;text-align:center;font-weight:700;font-size:150px;letter-spacing:-8px">10<span style="font-size:44px;letter-spacing:0;vertical-align:70px;margin-left:6px">yrs</span></div></div>'''
F['02'] = ('02.35', '0:02.3  Glass gauge widget, right zone',
  talk('02.35', front=gauge + pixels(1540,330,320,320,34,'g',.55,glow=True)) + caption3('in the next 10 years?', now=3))

F['03'] = ('03.75', '0:03.7  Caption only - heavy with highlight bar',
  talk('03.75', punch=1.04) + caption3("If you're in your", 'late', 'twenties', bar=True))

bar = '''<div class="card" style="left:510px;top:150px;width:900px;height:140px;border-radius:70px;display:flex;align-items:center;gap:26px;padding:0 44px">
<div style="width:70px;height:70px;border-radius:22px;background:linear-gradient(160deg,#FFE27A,#F0913A);display:flex;align-items:center;justify-content:center;font:800 44px Inter;color:#160C06">$</div>
<div style="font-weight:500;font-size:52px;color:#FFF4DE;letter-spacing:-1px">Plan your finances<span style="display:inline-block;width:5px;height:56px;background:#fff;margin-left:6px;vertical-align:-8px;box-shadow:0 0 14px #FFC000"></span></div></div>
<div class="card" style="left:620px;top:330px;width:680px;height:290px"><div style="position:relative;padding:36px 48px;display:flex;flex-direction:column;gap:24px">
<div class="chip" style="align-self:flex-start"><i></i>10-YEAR PLAN</div>
<div style="height:22px;border-radius:11px;background:rgba(255,220,150,.12)"><div style="width:18%;height:100%;border-radius:11px;background:linear-gradient(90deg,#EB8858,#FFC000)"></div></div>
<div style="display:flex;justify-content:space-between;color:rgba(255,244,222,.65);font-size:28px;font-weight:500"><span>Age 28</span><span>Age 38</span></div></div></div>'''
F['04'] = ('05.60', '0:05.6  Explainer (light-beam sweep in) - plan bar',
  world169(4) + ribbon('M-60 640 C 300 420, 520 820, 960 600 S 1600 380, 1980 560', 10, .8).replace('width="1080" height="1920"','width="1920" height="1080"')
  + bar + caption3("I'll show you how to", 'plan your', 'finances'))

nodes = [(330,560,'YR 1',1),(680,420,'YR 3',1),(1000,480,'YR 5',1),(1310,330,'YR 7',.55),(1600,180,'YR 10',1)]
nd = ''
for i,(x,y,l,o) in enumerate(nodes):
    last = i == len(nodes)-1; s = 110 if last else 64
    nd += f'''<div style="position:absolute;left:{x-s/2}px;top:{y-s/2}px;width:{s}px;height:{s}px;border-radius:50%;opacity:{o};{'filter:blur(5px);' if o<1 else ''}
background:{'linear-gradient(160deg,#FFE27A,#F0913A)' if last else 'radial-gradient(#FFE27A,#EB8858)'};box-shadow:0 0 24px rgba(255,192,0,.7);display:flex;align-items:center;justify-content:center">{HOUSE.format(s=58) if last else ''}</div>
<div style="position:absolute;left:{x-80}px;top:{y+s/2+12}px;width:160px;text-align:center;font-weight:600;font-size:30px;color:{'#FFE27A' if last else 'rgba(255,244,222,.75)'};opacity:{o}">{l}</div>'''
line = '<svg style="position:absolute;inset:0" width="1920" height="1080"><path d="M330 560 C 450 480, 560 400, 680 420 S 880 500, 1000 480 S 1200 350, 1310 330 S 1500 240, 1600 180" stroke="#FFC000" stroke-width="6" fill="none" style="filter:drop-shadow(0 0 8px #FFC000)"/></svg>'
F['05'] = ('06.90', '0:06.9  Explainer - 10-year timeline',
  world169(5) + line + nd + caption3('over the next', '', '10 years', bar=True))

home = '''<div class="card" style="left:70px;top:200px;width:560px;height:290px;transform:rotate(-3deg)">
<div style="position:relative;padding:34px 36px;display:flex;gap:24px;align-items:center">
<div style="width:104px;height:104px;border-radius:30px;background:linear-gradient(160deg,#FFE27A,#F0913A);display:flex;align-items:center;justify-content:center">''' + HOUSE.format(s=64) + '''</div>
<div><div style="font-weight:300;font-size:30px;color:rgba(255,244,222,.75)">Milestone</div><div class="hv" style="font-weight:700;font-size:62px;letter-spacing:-3px;line-height:1">Homeowner</div></div></div>
<div style="position:absolute;left:36px;bottom:32px"><div class="chip"><i></i>Before 40</div></div></div>
<svg style="position:absolute;inset:0" width="1920" height="1080"><path d="M1300 640 A 330 330 0 0 1 1880 260" fill="none" stroke="rgba(255,244,222,.55)" stroke-width="3"/><circle cx="1420" cy="470" r="10" fill="#FFF4DE"/></svg>''' + KEY.format(w=140, st='position:absolute;left:1560px;top:180px;transform:rotate(28deg)')
F['06'] = ('09.30', '0:09.3  Card left zone + 3D gold key right zone',
  talk('09.30', front=home) + caption3("So you can buy a home before you're out of your", '', 'thirties'))

F['07'] = ('10.60', '0:10.6  PLAN (Scripts style) in the right zone',
  talk('10.60', front=side_title('PLAN', 'your', '10-year', 1240, 250, 215, 'plan')) + caption3("Let's break it down", 'step by step'))

tracks = [('Step 1 - Budget', 1), ('Step 2 - Save', 0), ('Step 3 - Credit', 0)]
tr = ''.join(f'''<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0">
<div><div style="font-weight:600;font-size:28px;color:{'#FFC000' if a else '#FFF4DE'}">{t}</div><div style="font-size:21px;color:rgba(255,244,222,.5);display:flex;align-items:center;gap:8px"><i style="display:inline-block;width:13px;height:13px;border-radius:50%;background:#FFC000"></i>Your money plan</div></div>
<div style="color:rgba(255,244,222,.5);font-size:28px;letter-spacing:2px">···</div></div>''' for t,a in tracks)
player = f'''<div class="card" style="left:1250px;top:110px;width:600px;height:470px;border-radius:40px;background:linear-gradient(180deg,rgba(60,32,10,.94),rgba(16,9,4,.96))">
<div style="position:relative;padding:28px 34px"><div style="display:flex;gap:22px;align-items:flex-end">
<div style="width:130px;height:130px;border-radius:12px;background:url(f169_11.95.jpg) 49% 8%/560px auto;box-shadow:0 12px 30px rgba(0,0,0,.6)"></div>
<div style="flex:1"><div style="font-weight:700;font-size:38px;color:#FFF4DE;letter-spacing:-1px;line-height:1.05">The 10-Year Plan</div><div style="font-size:22px;color:rgba(255,244,222,.6);margin-top:6px">Playlist · 4 steps</div></div>
<div style="width:80px;height:80px;border-radius:50%;background:#FFC000;box-shadow:0 0 26px rgba(255,192,0,.7);display:flex;align-items:center;justify-content:center;transform:scale(.92)">
<svg width="36" height="36" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" fill="#160C06"/><rect x="14" y="5" width="4" height="14" fill="#160C06"/></svg></div></div>
<div style="margin-top:14px">{tr}</div></div></div>'''
F['08'] = ('11.95', '0:11.9  Player card right zone - play pressed on "started"',
  talk('11.95', front=player) + caption3('so you can get', 'started', 'today'))

gc = '''<div style="position:absolute;left:740px;top:90px;width:440px;height:520px;border-radius:52px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 0 2px rgba(255,226,150,.6)">
<div style="height:280px;background:linear-gradient(180deg,#FFF1CF,#FFD580);display:flex;align-items:center;justify-content:center">
<div style="width:160px;height:160px;border-radius:42px;background:linear-gradient(160deg,#FFC000,#EB8858);display:flex;align-items:center;justify-content:center">''' + HOUSE.format(s=104) + '''</div></div>
<div style="height:240px;background:linear-gradient(180deg,#2A1508,#160C06);text-align:center;padding-top:30px">
<div style="font-weight:800;font-style:italic;font-size:58px;color:#FFF4DE;letter-spacing:-2px">Buy a home</div>
<div style="font-size:26px;color:rgba(255,244,222,.6);margin-top:6px">goal #1 for most people</div>
<div style="font-size:38px;color:#FFC000;letter-spacing:8px;margin-top:12px">★★★★★</div></div></div>''' + ''.join(
f'<div style="position:absolute;left:{x}px;top:150px;width:300px;height:400px;border-radius:44px;background:linear-gradient(180deg,rgba(255,241,207,.35),rgba(42,21,8,.7));transform:rotate({r}deg);filter:blur(4px);opacity:.55"></div>' for x,r in [(470,-8),(1150,8)])
rib = lambda d,w,o: ribbon(d,w,o).replace('width="1080" height="1920"','width="1920" height="1080"')
F['09'] = ('14.20', '0:14.2  Explainer - goal card + light ribbon',
  world169(9) + rib('M760 120 C 520 260, 560 640, 880 660 S 1420 620, 1300 330 S 1000 20, 760 120', 16, .9) + gc
  + rib('M880 660 C 1080 690, 1300 640, 1330 470', 16, 1) + caption3('Buying a home is one of the biggest', 'financial', 'goals'))

F['10'] = ('16.60', '0:16.6  Caption only (punch-in)',
  talk('16.60', punch=1.04) + caption3("but as you're likely", 'aware,'))

dollars = '''<div style="position:absolute;left:1260px;top:150px;width:600px;text-align:center;font-family:Antonio;font-weight:700;font-size:330px;line-height:1;letter-spacing:-6px;
background:linear-gradient(180deg,rgba(255,241,207,.9),rgba(255,192,0,.4));-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 8px 30px rgba(0,0,0,.4))">$$$</div>
<svg style="position:absolute;inset:0" width="1920" height="1080"><path d="M1270 120 L 1560 560 L 1860 120" fill="none" stroke="rgba(255,244,222,.5)" stroke-width="3"/></svg>'''
cap11 = caption3("it's gotten pretty", '', 'pricey', bar=True).replace('<div class="l3" style="', '<div class="l3" style="transform:perspective(900px) rotateY(-14deg) rotateZ(-3deg);')
F['11'] = ('18.10', '0:18.1  $$$ + V lines right zone, heavy swings in, edge flash',
  talk('18.10', front=dollars + '<div class="flash"></div>') + cap11)

for k,(t,label,body) in F.items():
    open(f'h{k}.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="stage">{body}</div></body></html>')
json.dump({k:[v[0],v[1]] for k,v in F.items()}, open('frames3.json','w'), indent=1)
print('wrote', len(F))
