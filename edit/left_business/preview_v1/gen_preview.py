#!/usr/bin/env python3
"""Preview frames v1 for 'left my $30K business' (9:16). HTML over real stills -> Playwright."""
import sys, os
W = sys.argv[1]
OUT = f'{W}/preview_v1'; os.makedirs(OUT, exist_ok=True)

# Palette sampled from the circled reference ($30K / DIGITAL PRODUCTS)
P = dict(ink='#0D0920', deep='#2A1B5C', blue='#657EFC', peri='#7773FB', violet='#935DF9',
         purple='#AB55F4', orchid='#C052E9', magenta='#D35BC5', lilac='#C9B8FF', mist='#F2EEFF')
GRAD = 'linear-gradient(90deg,#657EFC 0%,#7773FB 22%,#935DF9 45%,#AB55F4 65%,#C052E9 82%,#D35BC5 100%)'

CSS = f"""
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1920px;overflow:hidden;background:#000;font-family:'Inter Display','Inter',sans-serif}}
.abs{{position:absolute}}
.bg,.cut{{position:absolute;inset:0;width:1080px;height:1920px}}
.grade{{position:absolute;inset:0;background:
  radial-gradient(120% 70% at 50% 40%,transparent 45%,rgba(6,3,18,.55) 100%),
  linear-gradient(180deg,rgba(13,9,32,.35) 0%,transparent 18%,transparent 60%,rgba(13,9,32,.75) 100%);}}
.tint{{position:absolute;inset:0;background:radial-gradient(60% 40% at 85% 30%,rgba(147,93,249,.16),transparent 70%);mix-blend-mode:screen}}
/* caption lockup */
.cap{{position:absolute;left:90px;right:90px;bottom:270px;display:flex;flex-direction:column;align-items:center;text-align:center}}
.setup{{font-family:'Inter Display';font-weight:300;font-size:58px;letter-spacing:-2px;color:{P['mist']};max-width:900px;text-wrap:balance;line-height:1.08;
  text-shadow:0 2px 18px rgba(0,0,0,.6)}}
.setup .k{{color:{P['lilac']};text-shadow:0 0 18px rgba(147,93,249,.8)}}
.pill{{margin-top:14px;padding:0 46px 10px;border-radius:999px;background:linear-gradient(180deg,#A9B4FF 0%,#935DF9 50%,#C052E9 100%);
  box-shadow:inset 0 0 0 2px rgba(242,238,255,.55),0 0 22px rgba(147,93,249,.65),0 0 50px rgba(211,91,197,.45);
  font-family:'Allura';font-size:104px;line-height:1.05;color:{P['ink']}}}
.heavy{{margin-top:8px;font-family:'Inter Display';font-weight:600;letter-spacing:-7px;line-height:.98;position:relative;
  background:linear-gradient(180deg,#fff 30%,#E6DDFF 70%,#C9B8FF 100%);-webkit-background-clip:text;color:transparent;
  filter:drop-shadow(0 0 8px rgba(147,93,249,.35)) drop-shadow(0 2px 14px rgba(0,0,0,.35))}}
.heavy.g{{background:{GRAD};-webkit-background-clip:text;filter:drop-shadow(0 0 10px rgba(147,93,249,.45)) drop-shadow(0 2px 14px rgba(0,0,0,.4))}}
.hwrap{{position:relative;display:inline-block}}
.dot{{display:inline-block;width:.16em;height:.16em;border-radius:50%;background:{P['magenta']};box-shadow:0 0 14px {P['magenta']};margin-left:.06em}}
.bar{{position:absolute;left:-10px;right:-10px;bottom:.06em;height:.26em;border-radius:8px;z-index:-1;
  background:linear-gradient(90deg,{P['deep']},{P['violet']} 55%,{P['magenta']});box-shadow:0 0 24px rgba(147,93,249,.6)}}
.tail{{font-family:'Inter Display';font-weight:300;font-size:50px;color:{P['mist']};letter-spacing:-1.5px;margin-top:6px}}
.swing{{transform:perspective(900px) rotateY(-10deg) rotateZ(-3deg)}}
/* pixel clusters */
.px{{position:absolute;box-shadow:0 0 12px currentColor}}
/* glass card */
.glass{{position:absolute;border-radius:52px;border:2px solid rgba(201,184,255,.55);
  background:linear-gradient(170deg,rgba(42,27,92,.92),rgba(13,9,32,.94) 70%);
  box-shadow:inset 0 -3px 0 rgba(201,184,255,.55),inset 0 -40px 60px -30px rgba(147,93,249,.55),0 0 40px rgba(147,93,249,.35),0 30px 60px rgba(0,0,0,.5);overflow:hidden}}
.glass:before{{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:36px 36px}}
.chip{{display:inline-flex;align-items:center;gap:10px;padding:10px 20px;border-radius:999px;font:700 26px 'Inter';letter-spacing:1px;color:{P['mist']};
  background:rgba(13,9,32,.85);border:1.5px solid rgba(201,184,255,.5);box-shadow:0 0 18px rgba(147,93,249,.35)}}
.chip i{{width:12px;height:12px;border-radius:50%;background:{P['magenta']};box-shadow:0 0 10px {P['magenta']}}}
.lbl{{font:600 26px 'Inter';color:{P['lilac']};letter-spacing:2px;text-transform:uppercase}}
/* explainer world */
.world{{position:absolute;inset:0;background:radial-gradient(90% 60% at 50% 45%,#1B1240 0%,{P['ink']} 70%,#06040F 100%);overflow:hidden}}
.pool{{position:absolute;border-radius:50%;filter:blur(90px)}}
.grid{{position:absolute;inset:0;background-image:linear-gradient(rgba(201,184,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(201,184,255,.07) 1px,transparent 1px);
  background-size:72px 72px;-webkit-mask-image:radial-gradient(60% 45% at 50% 45%,#000 30%,transparent 100%)}}
.part{{position:absolute;border-radius:50%;background:{P['lilac']};box-shadow:0 0 8px {P['lilac']}}}
.title-solid{{font-family:'Inter Display';font-weight:800;line-height:.86;letter-spacing:-14px}}
.gtext{{background:{GRAD};-webkit-background-clip:text;color:transparent}}
"""

def page(body, bg=None, cut=None, grade=True):
    s = f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>'
    if bg: s += f'<img class="bg" src="file://{W}/stills/{bg}.png">'
    s += body.get('behind', '')
    if cut: s += f'<img class="cut" src="file://{W}/stills/{cut}_cut.png">'
    if grade and bg: s += '<div class="grade"></div><div class="tint"></div>'
    s += body.get('front', '')
    return s + '</body></html>'

def cap(setup='', key=None, pill=None, heavy=None, size=140, grad=False, bar=False, tail=None, swing=False, dot=True, lines=None):
    s = '<div class="cap">'
    if setup:
        if key: setup = setup.replace(key, f'<span class="k">{key}</span>')
        s += f'<div class="setup">{setup}</div>'
    if pill: s += f'<div class="pill">{pill}</div>'
    if heavy:
        cls = 'heavy g' if grad else 'heavy'
        d = '<span class="dot"></span>' if dot else ''
        b = '<span class="bar"></span>' if bar else ''
        sw = ' swing' if swing else ''
        s += f'<div class="hwrap{sw}" style="font-size:{size}px;margin-top:10px">{b}<div class="{cls}" style="font-size:{size}px">{heavy}{d}</div></div>'
    if tail: s += f'<div class="tail">{tail}</div>'
    return s + '</div>'

def pix(x, y, cell, cells, cols):
    """stair-step cluster; cells = list of (cx,cy); cols cycle"""
    out = ''
    for i, (cx, cy) in enumerate(cells):
        c = cols[i % len(cols)]
        out += f'<div class="px" style="left:{x+cx*cell}px;top:{y+cy*cell}px;width:{cell-2}px;height:{cell-2}px;background:{c};color:{c}"></div>'
    return out
STAIR = [(0,0),(1,0),(1,1),(2,1),(2,2)]
TETRO = [(0,1),(1,1),(1,0),(2,0)]
L3 = [(0,0),(0,1),(1,1)]

def world(extra=''):
    s = '<div class="world">'
    s += f'<div class="pool" style="left:-180px;top:260px;width:760px;height:760px;background:rgba(101,126,252,.35)"></div>'
    s += f'<div class="pool" style="right:-220px;top:820px;width:820px;height:820px;background:rgba(192,82,233,.30)"></div>'
    s += '<div class="grid"></div>'
    import random; r = random.Random(7)
    for _ in range(34):
        z = r.choice([3,4,5,6]); s += f'<div class="part" style="left:{r.randint(20,1060)}px;top:{r.randint(80,1700)}px;width:{z}px;height:{z}px;opacity:{r.uniform(.25,.8):.2f}"></div>'
    return s + extra + '</div>'

frames = {}

# F01 0:01.6 HOOK: behind-head title
behind = f'''
<div class="abs setup" style="left:0;right:0;top:70px;text-align:center;font-size:64px">I left <span class="k">my</span></div>
<div class="abs" style="left:0;right:0;top:130px;text-align:center">
  <div class="title-solid gtext" style="font-size:300px;display:inline-block;filter:drop-shadow(0 0 18px rgba(147,93,249,.45))">$30K</div></div>

<div class="abs" style="left:150px;top:250px;width:26px;height:26px;border:3px solid {P['mist']}"></div>
{pix(110,330,40,STAIR,[P['blue'],P['peri'],P['violet']])}
{pix(880,120,40,TETRO,[P['orchid'],P['magenta'],P['purple']])}
'''
front01 = '<div class="abs" style="left:0;right:0;top:400px;text-align:center"><div class="heavy" style="display:inline-block;font-size:150px;font-weight:800;letter-spacing:-8px">BUSINESS</div></div>'
frames['F01'] = page({'behind': behind, 'front': front01}, 'F01', 'F01')

# F02 0:04.8 caption + product card (right chest)
front = f'''
<div class="glass" style="left:860px;top:700px;width:240px;height:320px;transform:rotate(9deg);opacity:.35;filter:blur(5px)"></div>
<div class="glass" style="left:772px;top:640px;width:270px;height:360px;transform:rotate(4deg)">
  <div style="position:absolute;left:0;right:0;top:0;height:150px;background:linear-gradient(160deg,#F2EEFF,#B9A8FF 60%,#935DF9)"></div>
  <div style="position:absolute;left:26px;top:30px;width:84px;height:84px;border-radius:24px;background:{P['ink']};box-shadow:0 0 20px rgba(147,93,249,.6);display:flex;align-items:center;justify-content:center">
    <svg width="44" height="50" viewBox="0 0 44 50"><rect x="3" y="3" width="38" height="44" rx="6" fill="none" stroke="#C9B8FF" stroke-width="4"/><path d="M12 16h20M12 25h20M12 34h12" stroke="#D35BC5" stroke-width="4" stroke-linecap="round"/></svg></div>
  <div style="position:absolute;right:22px;top:40px;font:800 46px 'Inter Display';color:{P['ink']};letter-spacing:-2px">$27</div>
  <div style="position:absolute;left:26px;top:172px;font:800 italic 36px 'Inter';color:{P['mist']};letter-spacing:-1px;line-height:1.05">Starter<br>Template</div>
  <div style="position:absolute;left:26px;top:262px;font:500 20px 'Inter';color:{P['lilac']}">Digital download</div>
  <div style="position:absolute;left:26px;top:298px;font-size:26px;color:{P['magenta']};letter-spacing:4px;text-shadow:0 0 10px {P['magenta']}">★★★★★</div>
</div>
<svg class="abs" style="left:720px;top:590px" width="360" height="470" viewBox="0 0 360 470">
  <path d="M40 120 C 10 300, 120 470, 260 440 S 370 160, 250 60 S 70 30, 40 120" fill="none" stroke="#F2EEFF" stroke-width="10" stroke-linecap="round"
   style="filter:drop-shadow(0 0 10px #935DF9) drop-shadow(0 0 24px #C052E9)" stroke-dasharray="60 26"/></svg>
{cap('to go all in selling', 'selling', 'low ticket', 'DIGITAL<br>PRODUCTS', 128, grad=True, bar=True)}
'''
frames['F02'] = page({'front': front}, 'F02')

# F03 0:07.7 explainer: burnout battery
bat = f'''
<div class="abs" style="left:0;right:0;top:300px;text-align:center"><span class="chip"><i></i>ENERGY LEVEL</span></div>
<div class="glass" style="left:190px;top:400px;width:700px;height:760px;border-radius:84px">
  <svg class="abs" style="left:110px;top:70px" width="480" height="300" viewBox="0 0 480 300">
    <path d="M40 260 A 200 200 0 0 1 440 260" fill="none" stroke="rgba(201,184,255,.15)" stroke-width="26" stroke-linecap="round"/>
    <path d="M40 260 A 200 200 0 0 1 62 168" fill="none" stroke="#D35BC5" stroke-width="26" stroke-linecap="round" style="filter:drop-shadow(0 0 12px #D35BC5)"/>
    {''.join(f'<line x1="{240+228*__import__("math").cos(__import__("math").pi*(1-i/16))}" y1="{260-228*__import__("math").sin(__import__("math").pi*(1-i/16))}" x2="{240+248*__import__("math").cos(__import__("math").pi*(1-i/16))}" y2="{260-248*__import__("math").sin(__import__("math").pi*(1-i/16))}" stroke="{"#D35BC5" if i<2 else "rgba(201,184,255,.25)"}" stroke-width="4"/>' for i in range(17))}
  </svg>
  <div class="abs" style="left:0;right:0;top:210px;text-align:center;font:700 190px 'Inter Display';letter-spacing:-10px;color:{P['mist']};text-shadow:0 0 30px rgba(211,91,197,.6)">4<span style="font-size:90px;color:{P['magenta']}">%</span></div>
  <div class="abs" style="left:150px;top:470px;width:400px;height:150px;border:6px solid rgba(201,184,255,.7);border-radius:30px">
    <div style="position:absolute;right:-26px;top:45px;width:18px;height:50px;border-radius:0 8px 8px 0;background:rgba(201,184,255,.7)"></div>
    <div style="position:absolute;left:12px;top:12px;bottom:12px;width:26px;border-radius:12px;background:{P['magenta']};box-shadow:0 0 20px {P['magenta']}"></div></div>
  <div class="abs lbl" style="left:0;right:0;top:660px;text-align:center">Low battery · since 2023</div>
</div>
{pix(140,380,34,STAIR,[P['blue'],P['violet'],P['peri']])}{pix(840,1100,34,TETRO,[P['orchid'],P['magenta']])}
'''
front = world(bat) + cap('And to be honest, the decision came from', 'from', 'pure', 'BURNOUT', 150, bar=True, swing=True)
frames['F03'] = page({'front': front})

# F04 0:11.2 gauge widget right: 10-12 hrs/day
import math
ticks = ''.join(f'<line x1="{150+118*math.cos(math.pi*(1-i/12)):.1f}" y1="{150-118*math.sin(math.pi*(1-i/12)):.1f}" x2="{150+132*math.cos(math.pi*(1-i/12)):.1f}" y2="{150-132*math.sin(math.pi*(1-i/12)):.1f}" stroke="{"#C052E9" if i<=10 else "rgba(201,184,255,.25)"}" stroke-width="5" stroke-linecap="round"/>' for i in range(13))
front = f'''
<div class="glass" style="left:742px;top:560px;width:310px;height:400px;border-radius:72px">
  <svg class="abs" style="left:5px;top:40px" width="300" height="170" viewBox="0 0 300 170">{ticks}
   <path d="M30 150 A 120 120 0 0 1 262 118" fill="none" stroke="url(#gg)" stroke-width="10" stroke-linecap="round" style="filter:drop-shadow(0 0 8px #935DF9)"/>
   <defs><linearGradient id="gg"><stop offset="0" stop-color="#657EFC"/><stop offset=".5" stop-color="#935DF9"/><stop offset="1" stop-color="#D35BC5"/></linearGradient></defs></svg>
  <div class="abs" style="left:0;right:0;top:110px;text-align:center;font:700 120px 'Inter Display';letter-spacing:-6px;color:{P['mist']};text-shadow:0 0 24px rgba(147,93,249,.7)">12</div>
  <div class="abs lbl" style="left:0;right:0;top:256px;text-align:center;font-size:24px">hrs / day</div>
  <div class="abs" style="left:0;right:0;top:310px;text-align:center"><span class="chip" style="font-size:20px;padding:8px 16px"><i></i>10–12 HRS / DAY</span></div>
</div>
{cap('because I was tired of working', 'working', None, '10–12 HOURS', 140, tail='a day,')}
'''
frames['F04'] = page({'front': front}, 'F04')

# F05 0:13.9 calendar: no weekends
days = ['M','T','W','T','F','S','S']
cells = ''
for i, d in enumerate(days):
    r, c = divmod(i, 4); x = 26 + c*68; y = 120 + r*110
    we = i >= 5
    bg = f'background:linear-gradient(180deg,{P["orchid"]},{P["magenta"]});box-shadow:0 0 22px {P["magenta"]};transform:scale(1.12)' if we else 'background:rgba(147,93,249,.22);border:1.5px solid rgba(201,184,255,.35)'
    cells += f'<div class="abs" style="left:{x}px;top:{y}px;width:58px;height:92px;border-radius:16px;{bg}"><div style="font:700 22px Inter;color:{P["mist"]};text-align:center;margin-top:8px">{d}</div><div style="margin:10px 9px 0;height:8px;border-radius:4px;background:{P["lilac"]};opacity:.8"></div><div style="margin:6px 9px 0;height:8px;border-radius:4px;background:{P["lilac"]};opacity:.5"></div></div>'
front = f'''
<div class="glass" style="left:742px;top:600px;width:310px;height:400px;border-radius:56px">
  <div class="abs" style="left:28px;top:36px;font:700 34px 'Inter Display';color:{P['mist']};letter-spacing:-1px">This week</div>
  <div class="abs lbl" style="left:28px;top:80px;font-size:18px">Client calls · 7/7 days</div>
  {cells}
  <svg class="abs" style="left:150px;top:215px" width="160" height="130" viewBox="0 0 160 130"><path d="M20 70 C 10 20, 130 5, 148 55 S 70 128, 22 92 S 60 18, 118 26" fill="none" stroke="#F2EEFF" stroke-width="5" stroke-linecap="round" style="filter:drop-shadow(0 0 6px #D35BC5)"/></svg>
</div>
<div class="abs" style="left:770px;top:1030px"><span class="chip"><i></i>NO WEEKENDS</span></div>
{cap('fulfilling for clients,', None, None, 'NO WEEKENDS', 130)}
'''
frames['F05'] = page({'front': front}, 'F05')

# F06 0:15.8 explainer: notifications (family / friends)
def notif(y, who, msg, t, init, dim=1.0, scale=1.0):
    return f'''<div class="glass" style="left:120px;top:{y}px;width:840px;height:150px;border-radius:44px;opacity:{dim};transform:scale({scale})">
  <div class="abs" style="left:28px;top:30px;width:90px;height:90px;border-radius:50%;background:{GRAD};display:flex;align-items:center;justify-content:center;font:800 38px 'Inter Display';color:{P['ink']}">{init}</div>
  <div class="abs" style="left:146px;top:32px;font:700 34px 'Inter Display';color:{P['mist']}">{who}</div>
  <div class="abs" style="left:146px;top:80px;font:400 28px 'Inter';color:{P['lilac']}">{msg}</div>
  <div class="abs" style="right:34px;top:36px;font:500 22px 'Inter';color:rgba(201,184,255,.7)">{t}</div></div>'''
n = notif(430, 'Family', 'Missed call (3)', 'now', 'F', .55, .9) + notif(600, 'The boys', '“you coming out tonight?”', '2h', 'B', .75, .95) + notif(780, 'Mom', 'Missed FaceTime · “call me back”', '5h', 'M')
n += f'<div class="abs" style="left:0;right:0;top:330px;text-align:center"><span class="chip"><i></i>DO NOT DISTURB · CLIENT WORK</span></div>'
front = world(n + pix(90,980,34,L3,[P['blue'],P['peri']]) + pix(900,360,34,STAIR,[P['orchid'],P['magenta']])) + cap('no time spent with my', None, 'family or', 'FRIENDS', 150)
frames['F06'] = page({'front': front})

# F07 0:20.45 stacked deck of icon tiles (gym / eat / meals), struck
def tile(x, y, rot, svg, label, z, op=1.0):
    return f'''<div class="glass" style="left:{x}px;top:{y}px;width:230px;height:250px;border-radius:48px;transform:rotate({rot}deg);z-index:{z};opacity:{op}">
  <div class="abs" style="left:0;right:0;top:40px;display:flex;justify-content:center">{svg}</div>
  <div class="abs lbl" style="left:0;right:0;top:186px;text-align:center;font-size:20px">{label}</div>
  <div class="abs" style="left:24px;right:24px;top:118px;height:8px;border-radius:4px;background:{P['magenta']};box-shadow:0 0 14px {P['magenta']};transform:rotate(-18deg)"></div></div>'''
dumb = '<svg width="130" height="110" viewBox="0 0 130 110"><rect x="8" y="30" width="18" height="50" rx="5" fill="#C9B8FF"/><rect x="28" y="20" width="18" height="70" rx="5" fill="#935DF9"/><rect x="46" y="49" width="38" height="12" fill="#C9B8FF"/><rect x="84" y="20" width="18" height="70" rx="5" fill="#935DF9"/><rect x="104" y="30" width="18" height="50" rx="5" fill="#C9B8FF"/></svg>'
fork = '<svg width="130" height="110" viewBox="0 0 130 110"><path d="M38 10v30c0 10 8 14 8 14v50M30 10v26M46 10v26M54 10v26" stroke="#C9B8FF" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M92 104V10c-18 10-18 44 0 52" stroke="#935DF9" stroke-width="8" stroke-linecap="round" fill="none"/></svg>'
plate = '<svg width="130" height="110" viewBox="0 0 130 110"><circle cx="65" cy="55" r="48" fill="none" stroke="#C9B8FF" stroke-width="6"/><circle cx="65" cy="55" r="28" fill="none" stroke="#935DF9" stroke-width="6"/></svg>'
front = f'''{tile(800,560,10,dumb,'Gym',1,.55)}{tile(785,640,-6,fork,'Eat out',2,.8)}{tile(770,720,3,plate,'Meals',3)}
{cap('or sometimes even', 'even', None, 'MISSING MEALS', 120, bar=True)}'''
frames['F07'] = page({'front': front}, 'F07')

# F08 0:22.6 toggle switch + ASAP
front = f'''
<div class="abs" style="inset:0;box-shadow:inset 0 0 140px rgba(211,91,197,.55)"></div>
<div class="glass" style="left:742px;top:600px;width:310px;height:360px;border-radius:56px">
  <div class="abs lbl" style="left:0;right:0;top:40px;text-align:center;font-size:20px">Business model</div>
  <div class="abs" style="left:28px;top:96px;font:600 26px Inter;color:rgba(201,184,255,.45);text-decoration:line-through">Client work</div>
  <div class="abs" style="left:65px;top:150px;width:180px;height:96px;border-radius:999px;background:{GRAD};box-shadow:0 0 30px rgba(192,82,233,.7),inset 0 0 0 2px rgba(242,238,255,.5)">
    <div style="position:absolute;right:8px;top:8px;width:80px;height:80px;border-radius:50%;background:#F2EEFF;box-shadow:0 0 20px #fff"></div></div>
  <div class="abs" style="left:0;right:0;top:272px;text-align:center;font:800 30px 'Inter Display';color:{P['mist']};letter-spacing:-1px">Digital products</div>
  <div class="abs" style="left:0;right:0;top:312px;text-align:center"><span style="font:600 18px Inter;color:{P['magenta']}">● LIVE</span></div>
</div>
{cap('So I knew I had to make the', None, 'switch', 'ASAP', 170, swing=True)}
{pix(250,1600,30,TETRO,[P['blue'],P['violet']])}{pix(760,1440,30,STAIR,[P['orchid'],P['magenta']])}
'''
frames['F08'] = page({'front': front}, 'F08')

# F09 0:26.6 behind-head stacked title
behind = f'''
<div class="abs" style="left:96px;top:36px;font:300 52px 'Inter Display';color:{P['mist']};letter-spacing:-2px">selling</div>
<div class="abs" style="right:96px;top:36px;font:300 52px 'Inter Display';color:{P['lilac']};letter-spacing:-2px">low-ticket</div>
<div class="abs" style="left:70px;top:96px"><div class="title-solid gtext" style="font-size:170px;filter:drop-shadow(0 0 16px rgba(147,93,249,.45))">DIGITAL</div></div>
<div class="abs" style="right:60px;top:232px"><div class="title-solid gtext" style="font-size:170px;filter:drop-shadow(0 0 16px rgba(147,93,249,.45))">PRODUCTS</div></div>
<div class="abs" style="left:40px;top:180px;width:26px;height:26px;border:3px solid {P['mist']}"></div>
{pix(30,300,36,STAIR,[P['blue'],P['peri'],P['violet']])}{pix(930,120,36,TETRO,[P['orchid'],P['magenta']])}
'''
frames['F09'] = page({'behind': behind}, 'F09', 'F09')

# F10 0:27.8 explainer: product card + ribbon + audience sales
sales = ''
for i, (x, y, nm) in enumerate([(70, 360, 'Jess'), (700, 470, 'Marco'), (90, 1020, 'Ava'), (690, 1100, 'Leo')]):
    sales += f'<div class="abs chip" style="left:{x}px;top:{y}px;font-size:24px"><span style="width:44px;height:44px;border-radius:50%;background:{GRAD};display:inline-block"></span>{nm} bought · <b style="color:#fff">+$27</b></div>'
card = f'''
<div class="glass" style="left:240px;top:520px;width:600px;height:560px;border-radius:64px;transform:rotate(-3deg)">
  <div style="position:absolute;left:0;right:0;top:0;height:250px;background:linear-gradient(160deg,#F2EEFF,#B9A8FF 55%,#935DF9)"></div>
  <div class="abs" style="left:40px;top:46px;width:140px;height:140px;border-radius:36px;background:{P['ink']};box-shadow:0 0 30px rgba(147,93,249,.6)"></div>
  <div class="abs" style="right:40px;top:70px;font:800 90px 'Inter Display';color:{P['ink']};letter-spacing:-4px">$27</div>
  <div class="abs" style="left:40px;top:286px;font:800 italic 62px Inter;color:{P['mist']};letter-spacing:-2px;line-height:1">Low-ticket<br>digital product</div>
  <div class="abs" style="left:40px;top:440px;font-size:40px;color:{P['magenta']};letter-spacing:6px;text-shadow:0 0 10px {P['magenta']}">★★★★★</div>
  <div class="abs" style="right:40px;top:450px;font:600 26px Inter;color:{P['lilac']}">124 sold</div></div>
<svg class="abs" style="left:140px;top:430px" width="800" height="760" viewBox="0 0 800 760"><path d="M90 200 C 0 520, 300 760, 560 690 S 820 260, 620 110 S 160 40, 90 200" fill="none" stroke="#F2EEFF" stroke-width="14" stroke-linecap="round" stroke-dasharray="90 34" style="filter:drop-shadow(0 0 12px #935DF9) drop-shadow(0 0 30px #C052E9)"/></svg>
{sales}'''
front = world(card) + cap('to my', None, None, 'AUDIENCE', 150, grad=True)
frames['F10'] = page({'front': front})

# F11 0:29.95 CTA card on chest + LINK IN BIO
front = f'''
<div class="glass" style="left:250px;top:930px;width:580px;height:300px;border-radius:56px">
  <div class="abs" style="left:30px;top:34px;width:96px;height:96px;border-radius:28px;background:{GRAD};box-shadow:0 0 24px rgba(147,93,249,.7)"></div>
  <div class="abs" style="left:150px;top:40px"><span class="chip" style="font-size:18px;padding:6px 14px"><i></i>LINK IN BIO</span></div>
  <div class="abs" style="left:150px;top:88px;font:800 38px 'Inter Display';color:{P['mist']};letter-spacing:-1px">Low-ticket starter pack</div>
  <div class="abs" style="left:30px;right:30px;top:180px;height:90px;border-radius:999px;background:{GRAD};box-shadow:0 0 34px rgba(192,82,233,.8),inset 0 0 0 2px rgba(242,238,255,.5);transform:scale(.95);
    display:flex;align-items:center;justify-content:center;font:800 38px 'Inter Display';color:#fff;letter-spacing:1px">GET IT →</div>
  <div class="abs" style="left:380px;top:226px;width:200px;height:200px;border-radius:50%;border:3px solid rgba(242,238,255,.5);transform:translate(-50%,-50%) scale(.6)"></div>
</div>
<svg class="abs" style="left:640px;top:1150px" width="60" height="70" viewBox="0 0 60 70"><path d="M6 4 L6 56 L20 44 L30 66 L40 61 L30 40 L48 40 Z" fill="#F2EEFF" stroke="#0D0920" stroke-width="3" style="filter:drop-shadow(0 0 8px #935DF9)"/></svg>
{cap('which by the way, if you’re curious,', 'curious,', None, 'LINK IN BIO', 150, grad=True, bar=True)}
'''
frames['F11'] = page({'front': front}, 'F11')

for k, v in frames.items():
    open(f'{OUT}/{k}.html', 'w').write(v)
print('wrote', len(frames))
