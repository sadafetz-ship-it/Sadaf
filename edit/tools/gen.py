#!/usr/bin/env python3
"""Storyboard preview stills (v1) for the 'sound design' reel. House style, purple set, 9:16.
Writes frames/F<n>.html; render with render.js."""
import json, random, sys, os

W = sys.argv[1]
ST = f'file://{W}/stills'
ALLURA = f'file://{W}/fonts/node_modules/@fontsource/allura/files/allura-latin-400-normal.woff2'
ANTONIO = f'file://{W}/fonts/node_modules/@fontsource/antonio/files/antonio-latin-700-normal.woff2'
os.makedirs(f'{W}/frames', exist_ok=True)

INK, DEEP, VIOLET, LILAC, MIST = '#190D32', '#5426A8', '#8050E8', '#B99AF5', '#EEE7FF'
BLUE, MAG, ROSE = '#5B6CFF', '#C65BF2', '#FF7EC8'
TITLE = '#A97CFF'  # flat solid title accent (purple-set equivalent of Golden Hour #FFB21A)

CSS = f"""
@font-face{{font-family:Allura;src:url({ALLURA})}}
@font-face{{font-family:Antonio;font-weight:700;src:url({ANTONIO})}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:1080px;height:1920px;overflow:hidden;background:#000;font-family:'Inter Display',Inter,sans-serif;color:{MIST}}}
.abs{{position:absolute}}
.bg{{position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover}}
.grade{{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 80% at 50% 38%,rgba(0,0,0,0) 45%,rgba(25,13,50,.55) 100%),
             linear-gradient(180deg,rgba(84,38,168,.10),rgba(25,13,50,.35) 75%,rgba(25,13,50,.7));}}
.tint{{position:absolute;inset:0;background:rgba(128,80,232,.10);mix-blend-mode:soft-light}}
/* captions */
.cap{{position:absolute;left:0;right:0;bottom:270px;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}}
.setup{{font-weight:300;font-size:58px;letter-spacing:-2px;max-width:900px;text-wrap:balance;line-height:1.08;color:#F4EEFF;
  text-shadow:0 2px 14px rgba(0,0,0,.45)}}
.setup .k{{color:{LILAC}}}
.setup .b{{color:{LILAC};filter:blur(4px);opacity:.6;display:inline-block;transform:translateY(6px)}}
.pill{{position:relative;font-family:Allura;font-size:104px;line-height:1;color:{INK};padding:4px 54px 14px;border-radius:999px;
  background:linear-gradient(180deg,#E6DAFF,{LILAC} 55%,{VIOLET});
  box-shadow:inset 0 0 0 2px rgba(255,250,255,.55),0 0 22px rgba(128,80,232,.6),0 0 50px rgba(198,91,242,.45)}}
.heavyrow{{position:relative;display:flex;align-items:baseline;justify-content:center}}
.heavy{{position:relative;font-weight:600;letter-spacing:-7px;line-height:1;
  background:linear-gradient(180deg,#FFF 30%,#E3D6FF 70%,{LILAC} 100%);-webkit-background-clip:text;color:transparent;
  filter:drop-shadow(0 0 8px rgba(128,80,232,.35)) drop-shadow(0 2px 14px rgba(0,0,0,.35));padding:0 6px}}
.dot{{width:.16em;height:.16em;border-radius:50%;background:{ROSE};box-shadow:0 0 12px {ROSE};margin-left:4px}}
.hbar{{position:absolute;left:4px;bottom:.04em;height:.26em;border-radius:.06em;
  background:linear-gradient(90deg,{DEEP},{VIOLET} 55%,{LILAC});box-shadow:0 0 18px rgba(128,80,232,.7)}}
.ink{{position:absolute;left:50%;width:4px;background:linear-gradient({LILAC},{VIOLET});box-shadow:0 0 10px {VIOLET};border-radius:2px}}
.px{{position:absolute;width:var(--c);height:var(--c)}}
/* glass card */
.glass{{position:absolute;border-radius:48px;border:2px solid rgba(185,154,245,.75);overflow:hidden;
  background:linear-gradient(180deg,rgba(40,22,78,.92),rgba(25,13,50,.94) 70%,rgba(60,30,120,.95));
  box-shadow:0 0 0 1px rgba(0,0,0,.3),0 30px 60px rgba(0,0,0,.45),0 18px 40px -10px rgba(128,80,232,.65),inset 0 -3px 0 rgba(238,231,255,.7),inset 0 -40px 60px -30px rgba(185,154,245,.55)}}
.glass::before{{content:'';position:absolute;inset:0;opacity:.18;
  background-image:linear-gradient(rgba(185,154,245,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(185,154,245,.5) 1px,transparent 1px);background-size:36px 36px}}
.chip{{display:inline-flex;align-items:center;gap:10px;padding:8px 18px;border-radius:999px;font-weight:600;font-size:26px;
  background:rgba(128,80,232,.25);border:1.5px solid rgba(185,154,245,.6);color:{MIST}}}
.cdot{{width:12px;height:12px;border-radius:50%;background:{ROSE};box-shadow:0 0 10px {ROSE}}}
/* explainer world */
.world{{position:absolute;inset:0;overflow:hidden;background:radial-gradient(90% 60% at 50% 45%,#2A1258 0%,#190D32 55%,#0B0618 100%)}}
.pool{{position:absolute;border-radius:50%;filter:blur(90px)}}
.grid{{position:absolute;inset:0;opacity:.22;background-image:linear-gradient(rgba(185,154,245,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(185,154,245,.35) 1px,transparent 1px);
  background-size:72px 72px;-webkit-mask:radial-gradient(60% 45% at 50% 45%,#000,transparent)}}
.part{{position:absolute;border-radius:50%;background:{LILAC};box-shadow:0 0 8px {LILAC}}}
.ttl{{position:absolute;font-weight:780;color:{TITLE};letter-spacing:-14px;line-height:.86;white-space:nowrap}}
.sw{{position:absolute;font-weight:300;font-size:40px;color:#F4EEFF;letter-spacing:-1px;text-shadow:0 2px 10px rgba(0,0,0,.5)}}
.sq{{position:absolute;width:26px;height:26px;border:3px solid #F4EEFF}}
.tag{{position:absolute;left:24px;top:24px;font:600 30px Inter;color:#fff;background:rgba(0,0,0,.55);padding:6px 14px;border-radius:10px;letter-spacing:0}}
"""

PXCOL = [VIOLET, LILAC, MAG, '#D8C4FF', DEEP]
SHAPES = [[(0,0),(1,0),(1,1),(2,1)],[(0,0),(0,1),(1,1),(1,2)],[(0,0),(1,0),(2,0),(1,1)],[(0,1),(1,1),(1,0),(2,0)],[(0,0),(1,0),(0,1)],[(0,0),(1,1)]]

def pixels(x, y, w, h, cell, seed, n=6, fade=1.0, cols=PXCOL):
    """Stair-step clusters at anchor points around a word box (x,y,w,h)."""
    r = random.Random(seed)
    anchors = [(x-cell*1.6, y-cell*0.6), (x+w+cell*0.4, y-cell*1.2), (x-cell*2.2, y+h-cell*1.5), (x+w+cell*0.6, y+h-cell*1.8),
               (x+w*0.35, y-cell*2.0), (x+w*0.62, y+h+cell*0.2)]
    out = []
    for i, (ax, ay) in enumerate(anchors[:n]):
        sh = r.choice(SHAPES); c = r.choice(cols); op = max(0.25, fade - r.random()*0.35)
        for dx, dy in sh:
            out.append(f'<div class="px" style="--c:{cell}px;left:{ax+dx*cell:.0f}px;top:{ay+dy*cell:.0f}px;background:{c};opacity:{op:.2f};box-shadow:0 0 {cell*0.6:.0f}px {c}"></div>')
    return ''.join(out)

def heavy_size(word):
    return min(156, int(1872 / max(1, len(word))))

def caption(setup='', pill=None, heavy=None, hbar=None, swing=False, tail=None, px_seed=None, blurlast=False, bottom=270):
    """setup: str with *word* = just-spoken (accent), ~word~ = blurring in."""
    def fmt(s):
        out = []
        for t in s.split(' '):
            if t.startswith('*'): out.append(f'<span class="k">{t.strip("*")}</span>')
            elif t.startswith('~'): out.append(f'<span class="b">{t.strip("~")}</span>')
            else: out.append(t)
        return ' '.join(out)
    h = f'<div class="cap" style="bottom:{bottom}px">'
    if setup: h += f'<div class="setup">{fmt(setup)}</div>'
    if pill: h += f'<div class="pill">{pill}</div>'
    if heavy:
        fs = heavy_size(heavy)
        tr = 'transform:perspective(900px) rotateY(-10deg) rotateZ(-3deg);' if swing else ''
        bar = f'<div class="hbar" style="width:{hbar}%"></div>' if hbar else ''
        word = heavy.rstrip('.,')
        h += f'<div class="heavyrow" style="font-size:{fs}px;{tr}"><div style="position:relative">{bar}<div class="heavy" style="position:relative">{word}</div></div><div class="dot"></div></div>'
    if tail: h += f'<div class="setup" style="font-size:44px">{tail}</div>'
    return h + '</div>'

def page(n, t, body, label):
    html = f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}<div class="tag">F{n} · {t:.2f}s · {label}</div></body></html>'
    open(f'{W}/frames/F{n}.html', 'w').write(html)

def talk(n, behind='', over='', cap=''):
    """footage → behind-head layer → speaker cut-out → grade → chest cards → captions."""
    return (f'<img class="bg" src="{ST}/F{n}.png">{behind}<img class="bg" src="{ST}/F{n}_cut.png">'
            f'<div class="tint"></div><div class="grade"></div>{over}{cap}')

def world(seed=1, extra=''):
    r = random.Random(seed)
    parts = ''.join(f'<div class="part" style="left:{r.randint(20,1060)}px;top:{r.randint(100,1800)}px;width:{(s:=r.choice([3,4,5,6]))}px;height:{s}px;opacity:{r.uniform(.25,.8):.2f}"></div>' for _ in range(46))
    return (f'<div class="world"><div class="pool" style="left:-180px;top:260px;width:720px;height:720px;background:rgba(128,80,232,.55)"></div>'
            f'<div class="pool" style="right:-220px;top:900px;width:760px;height:760px;background:rgba(91,108,255,.38)"></div>'
            f'<div class="grid"></div>{parts}{extra}</div>')

# ---------- icons (simple inline SVG) ----------
def ic(kind, s=64, c=MIST):
    p = {
     'user': f'<circle cx="32" cy="22" r="11" fill="none" stroke="{c}" stroke-width="4"/><path d="M12 54c3-12 12-17 20-17s17 5 20 17" fill="none" stroke="{c}" stroke-width="4" stroke-linecap="round"/>',
     'play': f'<path d="M22 14l28 18-28 18z" fill="{c}"/>',
     'star': f'<path d="M32 8l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="{c}"/>',
     'mute': f'<path d="M10 24h10l14-11v38L20 40H10z" fill="{c}"/><path d="M42 24l14 16M56 24L42 40" stroke="{ROSE}" stroke-width="5" stroke-linecap="round"/>',
     'wave': ''.join(f'<rect x="{6+i*7}" y="{32-h/2}" width="4" height="{h}" rx="2" fill="{c}"/>' for i, h in enumerate([8,18,30,44,26,38,50,30,16,8])),
     'send': f'<path d="M8 30L56 10 44 56 32 36z" fill="{c}"/><path d="M32 36L56 10" stroke="{INK}" stroke-width="3"/>',
     'chat': f'<path d="M10 14h44v28H30l-12 10V42h-8z" fill="none" stroke="{c}" stroke-width="4" stroke-linejoin="round"/>',
     'door': f'<path d="M18 56V10h28v46" fill="none" stroke="{c}" stroke-width="4"/><circle cx="38" cy="34" r="3" fill="{c}"/><path d="M8 56h48" stroke="{c}" stroke-width="4" stroke-linecap="round"/>',
    }[kind]
    return f'<svg width="{s}" height="{s}" viewBox="0 0 64 64">{p}</svg>'

def scripts_title(words, x, y, fs, setupL=None, setupR=None, ghost=None, px_seed=0, align=None):
    """Stacked 'Make better Scripts' lockup. words: list of (text, dx, dy, state) state in {'done','ghost','pending'}."""
    h = ''
    for i, (wd, dx, dy, st) in enumerate(words):
        if st == 'pending': continue
        tx = x + dx; ty = y + dy
        if st == 'ghost':
            h += f'<div class="ttl" style="left:{tx+40}px;top:{ty}px;font-size:{fs}px;opacity:.28;filter:blur(7px)">{wd}</div>'
            h += f'<div class="ttl" style="left:{tx}px;top:{ty}px;font-size:{fs}px;filter:blur(.6px)">{wd}</div>'
            h += f'<div class="ink" style="left:{tx+len(wd)*fs*0.30:.0f}px;top:{ty-70}px;height:70px;opacity:.85"></div>'
            h += pixels(tx, ty + fs*0.1, len(wd)*fs*0.58, fs*0.8, int(fs*0.13), px_seed+i, n=4)
        else:
            h += f'<div class="ttl" style="left:{tx}px;top:{ty}px;font-size:{fs}px">{wd}</div>'
    if setupL: h += f'<div class="sw" style="left:{x+8}px;top:{y-56}px">{setupL}</div>'
    if setupR: h += f'<div class="sw" style="left:{setupR[1]}px;top:{y-56}px">{setupR[0]}</div>'
    h += f'<div class="sq" style="left:{x-44}px;top:{y+fs*0.12:.0f}px"></div>'
    return h

faces = json.load(open(f'{W}/stills/faces.json'))
F = []  # (n, t, label, body)

# F1 1.95  hook — "ONE / THING" behind the head (Scripts lockup), riser→whoosh→impact on ONE
b = scripts_title([('ONE', 0, 0, 'done'), ('THING', 160, 196, 'ghost')], 150, 170, 230, setupL='focusing on', setupR=('this', 640), px_seed=11)
F.append((1, 1.95, 'HOOK · title behind head', talk(1, behind=b, cap=caption('Not focusing on *this*'))))

# F2 3.55  "is ruining your videos." + muted video card on chest, rose edge flash
card = f'''<div class="glass" style="left:200px;top:1040px;width:680px;height:250px">
 <div class="abs" style="left:28px;top:28px;width:250px;height:194px;border-radius:28px;background:linear-gradient(135deg,#3A1F70,#1A0E36);display:flex;align-items:center;justify-content:center;border:1.5px solid rgba(185,154,245,.4)">{ic('play',70)}</div>
 <div class="abs" style="left:304px;top:34px;font:600 32px Inter;letter-spacing:-.5px">final_edit_v3.mp4</div>
 <div class="abs" style="left:304px;top:96px;width:340px;height:4px;border-radius:2px;background:rgba(185,154,245,.35)"></div>
 <div class="abs" style="left:304px;top:92px;width:120px;height:12px;border-radius:6px;background:{VIOLET};box-shadow:0 0 12px {VIOLET}"></div>
 <div class="abs" style="left:300px;top:132px">{ic('mute',62)}</div>
 <div class="abs" style="left:380px;top:142px"><span class="chip"><span class="cdot"></span>no sound design</span></div></div>'''
flash = f'<div class="abs" style="inset:0;box-shadow:inset 0 0 120px rgba(255,126,200,.45)"></div>'
F.append((2, 3.55, 'chest card · muted video', talk(2, over=flash + card, cap=caption('is ruining your', heavy='videos.', bottom=270))))

# F3 7.95  three tiles via comet + glow reveal (clients / better videos / opportunities — 3rd developing)
def tile(x, label, icon, dev=False):
    w = 290
    inner = f'''<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:14px">
      <div style="width:96px;height:96px;border-radius:28px;background:linear-gradient(180deg,{VIOLET},{DEEP});display:flex;align-items:center;justify-content:center;box-shadow:0 0 24px rgba(128,80,232,.7)">{ic(icon,58)}</div>
      <div style="font:600 34px 'Inter Display';letter-spacing:-1px">{label}</div>
      <span class="chip" style="font-size:20px;padding:4px 12px"><span class="cdot" style="width:9px;height:9px"></span>missing</span></div>'''
    tr = 'transform:scale(1.05);' if dev else ''
    wash = '<div class="abs" style="inset:0;background:rgba(255,255,255,.55)"></div>' if dev else ''
    return f'<div class="glass" style="left:{x}px;top:1020px;width:{w}px;height:300px;border-radius:40px;{tr}">{inner}{wash}</div>'
comet = f'''<svg class="abs" style="left:0;top:0" width="1080" height="1920"><defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="{LILAC}" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>
 <path d="M520 1460 Q 760 1360 905 1040" fill="none" stroke="url(#cg)" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 10px {LILAC})"/><circle cx="905" cy="1040" r="10" fill="#fff" style="filter:drop-shadow(0 0 14px #fff)"/></svg>'''
over = tile(50, 'Clients', 'user') + tile(395, 'Better videos', 'play') + tile(740, 'Opportunities', 'door', dev=True) + comet
F.append((3, 7.95, 'chest row · comet + glow reveal', talk(3, over=over, cap=caption('better videos and so many', heavy='opportunities.', bottom=240))))

# F4 9.45  caption-only, punch-in on "thing", highlight bar wiping, Scripts pixels on heavy
fs = heavy_size('thing.'); cap = caption('Just because', pill='one', heavy='thing.', hbar=70)
pxl = pixels(360, 1500, 360, 130, 30, 44, n=5)
F.append((4, 9.45, 'caption-only · punch-in 8 f', f'<div style="position:absolute;inset:0;transform:scale(1.06);transform-origin:540px 720px">{talk(4)}</div>{pxl}{cap}'))

# F5 11.6  glass gauge widget "200+"
ticks = ''
import math
for i in range(25):
    a = math.radians(180 + i * 7.5); lit = i < 21
    x1, y1 = 220 + 150 * math.cos(a), 190 + 150 * math.sin(a); x2, y2 = 220 + 178 * math.cos(a), 190 + 178 * math.sin(a)
    ticks += f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="{LILAC if lit else "rgba(185,154,245,.25)"}" stroke-width="7" stroke-linecap="round" style="{"filter:drop-shadow(0 0 6px "+VIOLET+")" if lit else ""}"/>'
gauge = f'''<div class="glass" style="left:300px;top:1010px;width:480px;height:330px;border-radius:84px;background:linear-gradient(180deg,rgba(60,36,110,.9),rgba(25,13,50,.95) 70%,rgba(128,80,232,.6))">
 <svg class="abs" style="left:20px;top:10px" width="440" height="220">{ticks}</svg>
 <div class="abs" style="left:0;right:0;top:92px;text-align:center;font:700 128px Antonio;color:#fff;text-shadow:0 0 24px {VIOLET}">200+</div>
 <div class="abs" style="left:0;right:0;top:252px;text-align:center;font:600 26px Inter;letter-spacing:6px;color:{LILAC}">VIDEOS EDITED</div></div>'''
F.append((5, 11.6, 'chest · glass gauge widget', talk(5, over=gauge, cap=caption("I've edited more than", pill='200', heavy='videos.', bottom=200))))

# F6 14.9  light-beam sweep transition into explainer (cone ~110° of 230°)
cone = (f'<div class="abs" style="inset:0;-webkit-mask:conic-gradient(from 90deg at 130px 170px,#000 0deg,#000 108deg,transparent 116deg)">{world(6)}</div>'
        f'<svg class="abs" style="left:0;top:0" width="1080" height="1920"><line x1="130" y1="170" x2="130" y2="1920" stroke="#F4EEFF" stroke-width="5" style="filter:drop-shadow(0 0 16px #fff) drop-shadow(0 0 30px {LILAC})" opacity=".8"/>'
        f'<line x1="130" y1="170" x2="{130-1750*math.sin(math.radians(108)):.0f}" y2="{170+1750*math.cos(math.radians(108)):.0f}" stroke="#F4EEFF" stroke-width="4" opacity=".6" style="filter:drop-shadow(0 0 16px #fff)"/>'
        f'<circle cx="130" cy="170" r="22" fill="none" stroke="#F4EEFF" stroke-width="4" style="filter:drop-shadow(0 0 10px #fff)"/></svg>')
F.append((6, 14.9, 'transition · light-beam sweep', talk(6, over=cone, cap=caption('that I discovered', heavy='this.'))))

# F7 16.9  explainer: Sound Design product card + light ribbon loop, ghost cards
def pcard(x, y, title, sub, w=520, h=640, extra=''):
    stars = ''.join(f'<span style="display:inline-block;margin-right:6px">{ic("star",40,LILAC)}</span>' for _ in range(5))
    return f'''<div class="abs" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:56px;overflow:hidden;border:2px solid rgba(185,154,245,.8);
      box-shadow:0 0 60px rgba(128,80,232,.6),0 40px 80px rgba(0,0,0,.5);{extra}">
      <div style="height:46%;background:linear-gradient(180deg,#F4EEFF,{LILAC} 70%,{VIOLET});display:flex;align-items:center;justify-content:center">
        <div style="width:150px;height:150px;border-radius:40px;background:{INK};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(25,13,50,.5)">{ic('wave',110,LILAC)}</div></div>
      <div style="height:54%;background:linear-gradient(180deg,#1E0F3E,{INK});padding:34px 40px">
        <div style="font:italic 800 66px 'Inter Display';letter-spacing:-2.5px;line-height:1">{title}</div>
        <div style="font:400 28px Inter;color:{LILAC};margin-top:14px">{sub}</div>
        <div style="margin-top:26px">{stars}</div></div></div>'''
ghosts = (pcard(-330, 560, 'Color', 'grading', extra='transform:rotate(-12deg) scale(.8);filter:blur(7px);opacity:.45') +
          pcard(880, 620, 'Captions', 'kinetic type', extra='transform:rotate(11deg) scale(.8);filter:blur(7px);opacity:.45'))
ribbon = f'''<svg class="abs" style="left:0;top:0" width="1080" height="1920"><path d="M540 300 C 980 300 1010 1340 540 1300 C 70 1260 90 300 540 300" fill="none" stroke="#F4EEFF" stroke-width="16" stroke-linecap="round"
  stroke-dasharray="3000" stroke-dashoffset="520" style="filter:blur(1.5px) drop-shadow(0 0 14px {LILAC}) drop-shadow(0 0 34px {VIOLET})"/></svg>'''
ex7 = world(7, ghosts + pcard(280, 470, 'Sound<br>Design', 'the layer most editors skip', h=700) + ribbon)
F.append((7, 16.9, 'EXPLAINER · product card + ribbon', ex7 + caption('The importance of', pill='sound designing')))

# F8 18.6  explainer: waveform world + rings, heavy "world." 3D swing
rings = ''.join(f'<circle cx="540" cy="820" r="{r}" fill="none" stroke="{LILAC}" stroke-opacity="{o}" stroke-width="3"/>' for r, o in [(150,.8),(260,.5),(370,.3),(480,.15)])
bars = ''.join(f'<rect x="{40+i*25}" y="{820-h/2:.0f}" width="13" height="{h:.0f}" rx="6" fill="url(#wg)"/>' for i, h in enumerate([abs(math.sin(i*0.55))*220*math.exp(-((i-20)/11)**2)+20 for i in range(41)]))
wave = f'''<svg class="abs" style="left:0;top:0" width="1080" height="1920"><defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4EEFF"/><stop offset=".5" stop-color="{LILAC}"/><stop offset="1" stop-color="{VIOLET}"/></linearGradient></defs>
  <g style="filter:drop-shadow(0 0 12px {VIOLET})">{rings}{bars}</g></svg>'''
F.append((8, 18.6, 'EXPLAINER · sound world, 3D swing', world(8, wave) + caption("it's a whole new", heavy='world.', swing=True)))

# F9 19.9  back to speaker (zoom-blur + flash cut at 19.0), caption-only
F.append((9, 19.9, 'caption-only (after zoom-blur cut)', talk(9, cap=caption('You may not get it', pill='now,'))))

# F10 22.3  chest: audio level meter rising to the top on "level"
hs = [.35,.5,.62,.74,.86,.95,1,1,.97,.9,.8,.7,.58,.46,.34,.25]
meter = ''.join(f'<div class="abs" style="left:{40+i*36}px;bottom:70px;width:24px;height:{int(h*170)}px;border-radius:6px;background:linear-gradient(0deg,{DEEP},{VIOLET} 45%,{LILAC} 80%,{ROSE});box-shadow:0 0 {14 if h>.95 else 6}px {VIOLET if h<.95 else ROSE}"></div>' for i, h in enumerate(hs))
lvl = f'''<div class="glass" style="left:230px;top:1010px;width:620px;height:300px">{meter}
  <div class="abs" style="left:40px;bottom:22px;font:600 24px Inter;letter-spacing:5px;color:{LILAC}">LEVEL</div>
  <div class="abs" style="right:34px;top:26px"><span class="chip" style="font-size:22px">▲ new level</span></div></div>'''
F.append((10, 22.3, 'chest · level meter', talk(10, over=lvl, cap=caption('but your videos get to a', heavy='new level.', hbar=55, bottom=230))))

# F11 24.4  chest: video card, play pressed on "video" (cursor + ripple)
def vcard(prog, pressed):
    btn = f'transform:scale(.93);box-shadow:0 0 40px {LILAC},0 0 0 18px rgba(185,154,245,.25)' if pressed else f'box-shadow:0 0 24px {VIOLET}'
    return f'''<div class="glass" style="left:150px;top:1010px;width:780px;height:300px">
  <div class="abs" style="left:28px;top:28px;width:300px;height:244px;border-radius:30px;background:radial-gradient(circle at 40% 40%,#4A2A90,{INK});border:1.5px solid rgba(185,154,245,.4);display:flex;align-items:center;justify-content:center">{ic('wave',150,LILAC)}</div>
  <div class="abs" style="left:356px;top:36px;font:700 40px 'Inter Display';letter-spacing:-1.2px;line-height:1.05;width:380px">The exact video<br>that taught me</div>
  <div class="abs" style="left:356px;top:144px"><span class="chip" style="font-size:22px"><span class="cdot"></span>sound design</span></div>
  <div class="abs" style="left:356px;top:232px;width:250px;height:8px;border-radius:4px;background:rgba(185,154,245,.3)"><div style="width:{prog}%;height:100%;border-radius:4px;background:{LILAC};box-shadow:0 0 10px {LILAC}"></div></div>
  <div class="abs" style="left:640px;top:180px;width:100px;height:100px;border-radius:50%;background:linear-gradient(180deg,{LILAC},{VIOLET});display:flex;align-items:center;justify-content:center;{btn}">{ic('play',52,INK) if pressed else '<div style="display:flex;gap:10px"><i style="width:12px;height:40px;background:'+INK+';border-radius:3px"></i><i style="width:12px;height:40px;background:'+INK+';border-radius:3px"></i></div>'}</div></div>'''
cursor = f'<svg class="abs" style="left:735px;top:1245px" width="60" height="70" viewBox="0 0 24 28"><path d="M2 2l18 11-8 2 5 9-3 2-5-9-6 6z" fill="#fff" stroke="{INK}" stroke-width="1.5"/></svg>'
F.append((11, 24.4, 'chest · video card, play click', talk(11, over=vcard(4, True) + cursor, cap=caption('I want to share the exact same', heavy='video', bottom=200))))

# F12 26.3  same card held (≥1.2 s), playing; "skills." highlight bar
F.append((12, 26.3, 'card held · playing', talk(12, over=vcard(38, False), cap=caption('that helped me master', heavy='skills.', hbar=90, bottom=230))))

# F13 27.6  CTA — "EFFECTS" behind the head + quest-card morph (comment box) on chest
b = scripts_title([('EFFECTS', 0, 0, 'ghost')], 70, 230, 220, setupL='Just comment', setupR=('some', 900), px_seed=31)
qc = f'''<div class="glass" style="left:170px;top:1010px;width:740px;height:280px;box-shadow:0 0 70px rgba(185,154,245,.6),inset 0 -3px 0 rgba(238,231,255,.7)">
  <div class="abs" style="left:34px;top:30px;display:flex;align-items:center;gap:16px"><div style="width:72px;height:72px;border-radius:22px;background:linear-gradient(180deg,{VIOLET},{DEEP});display:flex;align-items:center;justify-content:center">{ic('chat',46)}</div>
     <div style="font:700 40px 'Inter Display';letter-spacing:-1px">Comment</div></div>
  <div class="abs" style="left:34px;top:130px;width:500px;height:100px;border-radius:30px;background:rgba(25,13,50,.8);border:2px solid rgba(185,154,245,.6);padding:24px 30px;font:600 44px Inter;color:#fff">effects<span style="display:inline-block;width:4px;height:46px;background:{LILAC};box-shadow:0 0 10px #fff;margin-left:6px;vertical-align:-8px"></span></div>
  <div class="abs" style="left:560px;top:130px;width:146px;height:100px;border-radius:30px;background:linear-gradient(180deg,{LILAC},{VIOLET});display:flex;align-items:center;justify-content:center;box-shadow:0 0 24px {VIOLET}">{ic('send',54,INK)}</div></div>'''
F.append((13, 27.6, 'CTA · title behind head + comment card', talk(13, behind=b, over=qc, cap=caption('Just comment some', bottom=500))))

# F14 29.1  DM sent card, paper-plane comet; end (cut "Also, you know that.")
dm = f'''<div class="glass" style="left:170px;top:1010px;width:740px;height:280px">
  <div class="abs" style="left:34px;top:32px;width:200px;height:216px;border-radius:30px;background:radial-gradient(circle at 40% 40%,#4A2A90,{INK});display:flex;align-items:center;justify-content:center;border:1.5px solid rgba(185,154,245,.4)">{ic('play',70)}</div>
  <div class="abs" style="left:262px;top:44px;font:700 42px 'Inter Display';letter-spacing:-1.2px">Sent to you</div>
  <div class="abs" style="left:262px;top:104px;font:400 28px Inter;color:{LILAC}">the exact video ✓✓</div>
  <div class="abs" style="left:262px;top:176px"><span class="chip"><span class="cdot"></span>delivered</span></div></div>'''
plane = f'''<svg class="abs" style="left:0;top:0" width="1080" height="1920"><defs><linearGradient id="pg" x1="0" x2="1"><stop offset="0" stop-color="{LILAC}" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>
  <path d="M700 1150 Q 900 1000 960 880" fill="none" stroke="url(#pg)" stroke-width="6" stroke-linecap="round" style="filter:drop-shadow(0 0 10px {LILAC})"/>
  <g transform="translate(940 840) rotate(-20) scale(1.1)" style="filter:drop-shadow(0 0 14px #fff)">{ic('send',64,'#fff')[ic('send',64,'#fff').index('>')+1:-6]}</g></svg>'''
F.append((14, 29.1, 'END · DM sent, then fade', talk(14, over=dm + plane, cap=caption("and I'll send it to you", heavy='right now.', bottom=230))))

for n, t, label, body in F:
    page(n, t, body, label)
json.dump([[n, t, label] for n, t, label, _ in F], open(f'{W}/frames/index.json', 'w'))
print('wrote', len(F), 'frames')
