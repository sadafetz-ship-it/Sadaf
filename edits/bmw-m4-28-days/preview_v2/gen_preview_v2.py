"""Preview stills v1 for the BMW M4 edit (9:16). Writes f*.html; render.js screenshots them."""
import os, random
P = os.path.dirname(os.path.abspath(__file__))
FN = os.path.join(P, "..", "fonts", "node_modules")
# Circled palette (user) + one derived dark
IVORY, BUTTER, LILAC, LAV, AMBER, CYAN = "#F3E8B8", "#E8D98B", "#B99ACB", "#8E78B5", "#F4A64A", "#159CC2"
INK = "#1A1428"  # derived: deep lavender-ink for card bodies / script text

CSS = f"""
@font-face{{font-family:Inter;src:url(file://{FN}/@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2);font-weight:100 900}}
@font-face{{font-family:Allura;src:url(file://{FN}/@fontsource/allura/files/allura-latin-400-normal.woff2)}}
@font-face{{font-family:Antonio;src:url(file://{FN}/@fontsource/antonio/files/antonio-latin-700-normal.woff2);font-weight:700}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1080px;height:1920px;overflow:hidden;background:#000;font-family:Inter}}
.L{{position:absolute;inset:0}}
.bg{{position:absolute;inset:0;background-size:cover;background-position:center}}
.grade{{position:absolute;inset:0;background:
  radial-gradient(120% 70% at 50% 35%,transparent 55%,rgba(26,20,40,.45) 100%),
  linear-gradient(180deg,rgba(243,232,184,.06),transparent 30%,transparent 62%,rgba(26,20,40,.55) 100%);
  mix-blend-mode:normal}}
/* captions: lower third, bottom edge 270px above frame bottom */
.cap{{position:absolute;left:0;right:200px;bottom:270px;display:flex;flex-direction:column;align-items:center;text-align:center}}
.setup{{font-weight:300;font-variation-settings:'opsz' 32;font-size:58px;letter-spacing:-2px;color:{IVORY};max-width:900px;
  text-wrap:balance;text-shadow:0 2px 14px rgba(0,0,0,.55);line-height:1.1}}
.setup .k{{color:{CYAN};filter:blur(2px)}} .setup .n{{opacity:0}}
.pill{{display:inline-block;margin-top:6px;padding:0 44px 10px;border-radius:999px;font-family:Allura;font-size:104px;line-height:1.05;color:{INK};
  background:linear-gradient(180deg,#E3D4EE,{LILAC} 55%,{LAV});box-shadow:inset 0 0 0 2px rgba(243,232,184,.7),
  0 0 22px rgba(185,154,203,.7),0 0 50px rgba(21,156,194,.35)}}
.pill .m{{opacity:.0}}
.heavy{{position:relative;margin-top:-4px;font-weight:620;font-variation-settings:'opsz' 32;letter-spacing:-7px;line-height:1.02;
  background:linear-gradient(180deg,#FFFFFF 30%,{IVORY} 70%,{BUTTER} 100%);-webkit-background-clip:text;color:transparent;
  filter:drop-shadow(0 0 8px rgba(232,217,139,.35)) drop-shadow(0 2px 14px rgba(0,0,0,.45))}}
.hw{{position:relative;display:inline-block}}
.dot{{display:inline-block;width:.16em;height:.16em;border-radius:50%;background:{AMBER};margin-left:.04em;box-shadow:0 0 14px {AMBER}}}
.bar{{position:absolute;left:-.04em;bottom:.08em;height:.26em;border-radius:.06em;z-index:-1;
  background:linear-gradient(90deg,{LAV},{CYAN} 55%,{IVORY});box-shadow:0 0 18px rgba(21,156,194,.7)}}
/* Scripts title */
.title{{position:absolute;font-weight:780;letter-spacing:-14px;line-height:.86;color:{CYAN}}}
.ghost{{position:absolute;font-weight:780;letter-spacing:-14px;line-height:.86;color:{CYAN};opacity:.35;filter:blur(6px)}}
.sw{{position:absolute;font-size:40px;color:{IVORY};font-weight:400;text-shadow:0 2px 10px rgba(0,0,0,.5)}}
.sq{{position:absolute;width:26px;height:26px;border:3px solid {IVORY}}}
.px{{position:absolute;box-shadow:0 0 10px currentColor}}
/* glass */
.glass{{position:absolute;border-radius:56px;background:linear-gradient(165deg,rgba(52,40,82,.92),rgba(26,20,40,.95) 60%);
  border:2px solid rgba(185,154,203,.8);overflow:hidden;
  box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 30px rgba(21,156,194,.25),inset 0 -3px 0 rgba(21,156,194,.9),inset 0 -70px 80px -40px rgba(21,156,194,.45)}}
"""

def px_cluster(x, y, cell, cols, seed):
    random.seed(seed)
    shapes = [[(0,0),(1,0),(1,1),(2,1)], [(0,0),(0,1),(1,1),(2,1),(2,2)], [(0,0),(1,0),(2,0),(1,1)], [(0,1),(1,1),(1,0),(2,0)]]
    out = ""
    for (cx, cy) in random.choice(shapes):
        c = random.choice(cols)
        out += f'<div class="px" style="left:{x+cx*cell}px;top:{y+cy*cell}px;width:{cell-2}px;height:{cell-2}px;background:{c};color:{c}"></div>'
    return out

def setup(words, upto, accent_last=1):
    """words: list; upto: count spoken; last `accent_last` spoken words still in karaoke accent"""
    s = []
    for i, w in enumerate(words):
        cls = "n" if i >= upto else ("k" if i >= upto - accent_last else "")
        s.append(f'<span class="{cls}">{w}</span>')
    return '<div class="setup">' + " ".join(s) + "</div>"

def pill(text, shown_chars=None):
    if shown_chars is None or shown_chars >= len(text):
        return f'<div class="pill">{text}</div>'
    return f'<div class="pill">{text[:shown_chars]}<span class="m">{text[shown_chars:]}</span></div>'

def heavy(word, size, bar=None, dot=True, extra_style=""):
    b = f'<div class="bar" style="width:{bar}"></div>' if bar else ""
    d = '<span class="dot"></span>' if dot else ""
    return f'<div class="heavy" style="font-size:{size}px;{extra_style}"><span class="hw">{b}{word}</span>{d}</div>'

def cap(*parts):
    return '<div class="cap">' + "".join(parts) + "</div>"

def page(body, still, cut=None, zoom=1.0, origin="400px 640px"):
    img = f"file://{P}/{still}"
    cutl = f'<div class="bg" style="background-image:url(file://{P}/{cut});transform:scale({zoom});transform-origin:{origin}"></div>' if cut else ""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="bg" style="background-image:url({img});transform:scale({zoom});transform-origin:{origin}"></div>
{body.get('behind','')}{cutl}<div class="grade"></div>{body.get('front','')}</body></html>"""

def explainer_world():
    random.seed(7)
    parts = "".join(f'<div style="position:absolute;left:{random.randint(20,1060)}px;top:{random.randint(80,1840)}px;width:{s}px;height:{s}px;border-radius:50%;background:{random.choice([IVORY,LILAC,CYAN])};opacity:{random.uniform(.25,.7):.2f};box-shadow:0 0 8px currentColor"></div>' for s in [random.choice([3,4,5,6]) for _ in range(46)])
    return f"""<div class="L" style="background:radial-gradient(90% 60% at 50% 40%,#2A2142,{INK} 70%)"></div>
<div class="L" style="background:radial-gradient(38% 26% at 22% 30%,rgba(185,154,203,.55),transparent 70%),
 radial-gradient(34% 22% at 82% 62%,rgba(21,156,194,.45),transparent 70%),radial-gradient(40% 20% at 50% 92%,rgba(243,232,184,.18),transparent 70%)"></div>
<div class="L" style="background-image:linear-gradient(rgba(243,232,184,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(243,232,184,.06) 1px,transparent 1px);
 background-size:72px 72px;-webkit-mask:radial-gradient(60% 45% at 50% 45%,#000,transparent)"></div>{parts}"""

CAR = f"""<svg viewBox="0 0 64 64" width="120" height="120"><path d="M10 38l5-12c1-3 3-4 6-4h22c3 0 5 1 6 4l5 12v10a3 3 0 01-3 3h-3a3 3 0 01-3-3v-3H19v3a3 3 0 01-3 3h-3a3 3 0 01-3-3z" fill="{INK}"/>
<path d="M18 36l3-9h22l3 9z" fill="{CYAN}"/><circle cx="19" cy="41" r="3" fill="{AMBER}"/><circle cx="45" cy="41" r="3" fill="{AMBER}"/></svg>"""

def product_card(x, y, w=520, scale=1.0, ghost=False, title="BMW M4", sub="Goal car · 28-day plan"):
    blur = "filter:blur(10px);opacity:.45;" if ghost else ""
    stars = "".join(f'<span style="color:{AMBER};text-shadow:0 0 10px {AMBER}">★</span>' for _ in range(5))
    return f"""<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;transform:scale({scale});{blur}border-radius:56px;overflow:hidden;
 border:2px solid rgba(243,232,184,.8);box-shadow:0 40px 90px rgba(0,0,0,.6),0 0 40px rgba(21,156,194,.35)">
 <div style="height:{int(w*.62)}px;background:linear-gradient(170deg,{IVORY},{BUTTER} 60%,{AMBER});display:flex;align-items:center;justify-content:center">
  <div style="width:190px;height:190px;border-radius:48px;background:linear-gradient(160deg,#FFF6D8,{IVORY});display:flex;align-items:center;justify-content:center;
   box-shadow:0 14px 34px rgba(142,120,181,.55),inset 0 -4px 0 rgba(142,120,181,.35)">{CAR}</div></div>
 <div style="background:linear-gradient(180deg,#2B2245,{INK});padding:34px 40px 40px;text-align:center">
  <div style="font-weight:800;font-style:italic;font-size:92px;letter-spacing:-4px;color:{IVORY};line-height:1">{title}</div>
  <div style="font-size:30px;color:{LILAC};margin-top:10px">{sub}</div>
  <div style="font-size:42px;letter-spacing:8px;margin-top:16px">{stars}</div></div></div>"""

CARIMG = "file:///home/user/Sadaf/edits/bmw-m4-28-days/remotion/public/bmw_m4_cutout.png"
def product_card_photo(x, y, w=600):
    stars = "".join(f'<span style="color:{AMBER};text-shadow:0 0 10px {AMBER}">★</span>' for _ in range(5))
    return f"""<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;border-radius:56px;overflow:visible;">
 <div style="height:{int(w*.62)}px;border-radius:56px 56px 0 0;background:linear-gradient(170deg,{IVORY},{BUTTER} 60%,{AMBER});border:2px solid rgba(243,232,184,.8);border-bottom:0"></div>
 <img src="{CARIMG}" style="position:absolute;left:-70px;top:{int(w*.05)}px;width:{w+140}px;filter:drop-shadow(0 26px 22px rgba(26,20,40,.55))">
 <div style="background:linear-gradient(180deg,#2B2245,{INK});padding:34px 40px 40px;text-align:center;border-radius:0 0 56px 56px;border:2px solid rgba(243,232,184,.8);border-top:0;
  box-shadow:0 40px 90px rgba(0,0,0,.6),0 0 40px rgba(21,156,194,.35)">
  <div style="font-weight:800;font-style:italic;font-size:96px;letter-spacing:-4px;color:{IVORY};line-height:1">BMW M4</div>
  <div style="font-size:30px;color:{LILAC};margin-top:10px">Goal car · 28-day plan</div>
  <div style="font-size:42px;letter-spacing:8px;margin-top:16px">{stars}</div></div></div>"""

def ribbon(cx, cy, rx, ry, prog=1.0):
    import math
    L = 2 * math.pi * math.sqrt((rx * rx + ry * ry) / 2)
    return f"""<svg class="L" width="1080" height="1920" style="overflow:visible">
<defs><filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>
<g transform="rotate(-14 {cx} {cy})">
<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" stroke="{CYAN}" stroke-width="40" opacity=".55" filter="url(#g)" stroke-dasharray="{L*prog} {L}"/>
<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" stroke="{IVORY}" stroke-width="12" stroke-linecap="round" stroke-dasharray="{L*prog} {L}"
 style="filter:drop-shadow(0 0 10px {CYAN}) drop-shadow(0 0 24px {CYAN})"/></g></svg>"""

import math
FR = {}
def edge_flash(c=AMBER, a=.55):
    r,g,b = int(c[1:3],16),int(c[3:5],16),int(c[5:7],16)
    return f'<div class="L" style="box-shadow:inset 0 0 160px 40px rgba({r},{g},{b},{a})"></div>'
def sparkles(pts, c=IVORY):
    out = ""
    for x, y, s in pts:
        out += f'<svg style="position:absolute;left:{x-s}px;top:{y-s}px;filter:drop-shadow(0 0 8px {CYAN}) drop-shadow(0 0 3px #fff)" width="{2*s}" height="{2*s}" viewBox="-10 -10 20 20"><path d="M0-10C1-2 2-1 10 0 2 1 1 2 0 10-1 2-2 1-10 0-2-1-1-2 0-10Z" fill="{c}"/></svg>'
    return out
def title_block(strike=0.0, fall=0.0, ghost=True, job=True):
    st = f"filter:saturate({1-strike*.7}) brightness({1-strike*.15});transform:translateY({fall*60}px) rotate({fall*4}deg);transform-origin:300px 300px;opacity:{1-fall*.5}"
    t = f'<div class="L" style="{st}">'
    t += f'<div class="sw" style="left:120px;top:4px">getting</div><div class="sw" style="left:860px;top:4px">that</div>'
    t += f'<div class="sq" style="left:74px;top:84px"></div>'
    t += f'<div class="title" style="left:112px;top:40px;font-size:160px">PART-TIME</div>'
    if job:
        if ghost: t += f'<div class="ghost" style="left:420px;top:150px;font-size:240px">JOB</div>'
        t += f'<div class="title" style="left:370px;top:150px;font-size:240px">JOB</div>'
    if strike < .5:
        t += px_cluster(150, 230, 26, [CYAN, LILAC, AMBER], 3) + px_cluster(210, 282, 26, [LILAC, CYAN], 9)
        t += px_cluster(960, 40, 30, [CYAN, AMBER, LILAC], 5) + px_cluster(1000, 118, 30, [LILAC, CYAN], 11)
    t += "</div>"
    return t
def slash(prog=1.0):
    L = 1150
    return f"""<svg class="L" width="1080" height="1920"><path d="M60 250 L 1010 70" stroke="{AMBER}" stroke-width="22" stroke-linecap="round"
 stroke-dasharray="{L*prog} {L}" style="filter:drop-shadow(0 0 10px {AMBER}) drop-shadow(0 0 26px rgba(244,166,74,.7))"/></svg>"""
RING_D = "M820 210 C 1010 190, 1060 620, 1010 1060 C 980 1330, 860 1400, 760 1310 C 650 1180, 640 640, 700 380 C 730 250, 790 205, 880 200"
def ring(prog):
    return f"""<svg class="L" width="1080" height="1920"><path d="{RING_D}" fill="none" stroke="{IVORY}" stroke-width="9" stroke-linecap="round"
 stroke-dasharray="{3000*prog} 3400" style="filter:drop-shadow(0 0 8px {CYAN}) drop-shadow(0 0 22px {CYAN})"/></svg>"""
def bubble():
    dots = "".join(f'<i style="display:inline-block;width:22px;height:22px;border-radius:50%;margin:0 7px;background:{c};box-shadow:0 0 10px {c};opacity:{o}"></i>' for c,o in [(IVORY,1),(IVORY,.75),(CYAN,.5)])
    return f"""<div class="glass" style="left:70px;top:70px;width:290px;height:150px;border-radius:75px;display:flex;align-items:center;justify-content:center">{dots}</div>
<div class="glass" style="left:300px;top:226px;width:46px;height:46px;border-radius:50%"></div><div class="glass" style="left:350px;top:276px;width:24px;height:24px;border-radius:50%"></div>"""
def calendar(lit=28, circled=True):
    cells = ""
    for i in range(28):
        n = i + 1; r, c = divmod(i, 7); x = 26 + c * 58; y = 128 + r * 58
        on = n <= lit
        if n == 28 and on:
            cells += f'<div style="position:absolute;left:{x-4}px;top:{y-4}px;width:56px;height:56px;border-radius:16px;background:{AMBER};color:{INK};font-weight:800;font-size:26px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 22px {AMBER}">28</div>'
        else:
            bg = f"linear-gradient(160deg,{LILAC},{LAV})" if on else "rgba(185,154,203,.12)"
            col = INK if on else "rgba(243,232,184,.35)"
            cells += f'<div style="position:absolute;left:{x}px;top:{y}px;width:48px;height:48px;border-radius:13px;background:{bg};color:{col};font-size:20px;font-weight:600;display:flex;align-items:center;justify-content:center">{n}</div>'
    circ = f'<svg style="position:absolute;left:{26+6*58-18}px;top:{128+3*58-18}px;overflow:visible" width="84" height="84"><path d="M42 4 C 76 2, 84 40, 74 62 C 62 84, 18 84, 8 58 C 0 34, 14 8, 50 6" fill="none" stroke="{IVORY}" stroke-width="5" stroke-linecap="round" style="filter:drop-shadow(0 0 6px {CYAN})"/></svg>' if circled else ""
    car = f'<img src="{CARIMG}" style="position:absolute;left:420px;top:228px;width:200px;filter:drop-shadow(0 10px 14px rgba(0,0,0,.6))">' if circled else ""
    return f"""<div class="glass" style="left:40px;top:1098px;width:460px;height:380px;border-radius:52px;overflow:visible;transform:scale(.86);transform-origin:0 0">
<div style="position:absolute;left:28px;top:30px;font-weight:700;font-size:40px;color:{IVORY};letter-spacing:-1px">Day 1 → 28</div>
<div style="position:absolute;left:28px;top:82px;font-size:20px;color:{CYAN};letter-spacing:2px;font-weight:700">● 28-DAY PLAN</div>
{cells}{circ}{car}</div>"""
def comet(x1, y1, x2, y2):
    return f"""<svg class="L" width="1080" height="1920"><defs><linearGradient id="cg" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="{LILAC}" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>
<path d="M{x1} {y1} Q {(x1+x2)/2+260} {min(y1,y2)-220} {x2} {y2}" fill="none" stroke="url(#cg)" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 10px {LILAC})"/>
<circle cx="{x2}" cy="{y2}" r="14" fill="#fff" style="filter:drop-shadow(0 0 16px #fff) drop-shadow(0 0 30px {CYAN})"/></svg>"""
def develop_card(x, y, w, white):
    return f'<div style="position:relative">{product_card_photo(x, y, w)}<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{int(w*.62)+260}px;border-radius:56px;background:#fff;opacity:{white};box-shadow:0 0 80px rgba(255,255,255,{white})"></div></div>'
def glint(pts):
    return "".join(f'<div style="position:absolute;left:{x-90}px;top:{y-90}px;width:180px;height:180px;background:radial-gradient(circle,#fff 0,rgba(21,156,194,.8) 12%,transparent 60%);mix-blend-mode:screen"></div><div style="position:absolute;left:{x-160}px;top:{y-3}px;width:320px;height:6px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(1px)"></div>' for x,y in pts)
def ink_pill(text, caret=True):
    c = f'<i style="display:inline-block;width:4px;height:40px;background:#fff;margin-left:8px;vertical-align:middle;box-shadow:0 0 10px #fff,0 0 20px {CYAN}"></i>' if caret else ""
    return f'<div style="position:absolute;left:70px;top:110px;padding:18px 34px;border-radius:999px;background:{INK};border:2px solid {CYAN};box-shadow:0 0 24px rgba(21,156,194,.5);font-weight:800;font-size:56px;color:{IVORY};letter-spacing:2px">{text}{c}</div>'

G1 = lambda n: cap(setup(["Don't", "even"], min(n,2), 1 if n<=2 else 0), *( [pill("think about")] if n>2 else []))
FR["P01"] = dict(still="still_8.png", zoom=1.08, origin="420px 640px", front=edge_flash(a=.42) + cap(setup(["Don't", "even"], 2, 1)),
    label="f8 · 0:00.3 · HOOK — “Don't” blurs in cyan · 8 f punch-in 1.00→1.08 · amber edge flash (2 f up / 12 f down)")
FR["P02"] = dict(still="still_30.png", zoom=1.03, origin="420px 640px", front=bubble() + G1(3),
    label="f30 · 0:01.0 · “think about” — lilac glass thought bubble pops beside the head on “think”, dots pulse")
FR["P03"] = dict(still="still_63.png", cut="cut_63.png", behind=title_block(), front=G1(3),
    label="f63 · 0:02.1 · NAME HIT — “PART-TIME” lands f43, “JOB” f57 behind the head · ghost trail · pixel clusters")
FR["P04"] = dict(still="still_74.png", cut="cut_74.png", behind=title_block(strike=1, ghost=False) + slash(1), front=cap(setup(["when", "you", "can", "just"], 1, 1)),
    label="f74 · 0:02.5 · STRIKE — amber ink slash rips through the title on “when” · title drains colour, then drops away")
FR["P05"] = dict(still="still_100.png", zoom=1.04, origin="850px 760px", front=ring(.45) + cap(setup(["when", "you", "can", "just"], 4, 0), pill("do this")),
    label="f100 · 0:03.3 · “this” — camera eases toward the slime · hand-drawn ring starts circling it")
FR["P06"] = dict(still="still_110.png", zoom=1.05, origin="850px 760px", front=ring(1) + sparkles([(1000,300,26),(690,520,18),(1020,900,22),(720,1180,16)]) + cap(setup(["when", "you", "can", "just"], 4, 0), pill("do this"), heavy("instead", 156, bar="55%")),
    label="f110 · 0:03.7 · “instead.” blooms + highlight bar · ring closed · cyan-white sparkles twinkle on the slime")
beam = f"""<div class="L" style="clip-path:polygon(90px 150px,1080px 0,1080px 1920px,420px 1920px)">{explainer_world()}</div>
<svg class="L" width="1080" height="1920"><defs><filter id="b"><feGaussianBlur stdDeviation="10"/></filter></defs>
<line x1="90" y1="150" x2="1180" y2="-20" stroke="{IVORY}" stroke-width="22" filter="url(#b)" opacity=".9"/>
<line x1="90" y1="150" x2="440" y2="2000" stroke="{IVORY}" stroke-width="22" filter="url(#b)" opacity=".9"/>
<circle cx="90" cy="150" r="22" fill="none" stroke="{IVORY}" stroke-width="5" style="filter:drop-shadow(0 0 10px {CYAN})"/></svg>"""
FR["P07"] = dict(still="still_126.png", front=beam + cap(setup(["If", "I", "had", "to"], 2, 1)),
    label="f126 · 0:04.2 · TRANSITION — light-beam cone sweeps open from a ring pivot into the lavender world (20 f)")
FR["P08"] = dict(still="still_160.png", front=explainer_world() + develop_card(240, 380, 600, .55) + comet(980, 1500, 860, 470) + cap(setup(["If", "I", "had", "to"], 4, 0), pill("buy a")),
    label="f160 · 0:05.3 · “BMW” — comet arcs in, card flashes white and develops into the M4 photo card (8 f)")
exb = explainer_world() + product_card(-170, 560, w=460, ghost=True, title="", sub="") + product_card(790, 560, w=460, ghost=True, title="", sub="")
exb += ribbon(540, 820, 420, 580, .999) + product_card_photo(240, 380) + glint([(540, 640), (783, 612)])
FR["P09"] = dict(still="still_180.png", front=exb + cap(setup(["If", "I", "had", "to"], 4, 0), pill("buy a")),
    label="f180 · 0:06.0 · “M4” — headlights glint · ribbon loops + flows · ghost cards drift behind · 5 stars pop (2 f stagger)")
FR["P10"] = dict(still="still_190.png", zoom=1.12, origin="420px 640px",
    front='<div class="L" style="backdrop-filter:blur(22px)"></div><div class="L" style="background:radial-gradient(circle at 45% 35%,rgba(255,255,255,.65),rgba(255,255,255,.3) 60%)"></div>' + cap(setup(["in", "the", "next"], 1, 1)),
    label="f190 · 0:06.3 · TRANSITION — 1 f white flash + zoom-blur (1.12→1, blur 28→0) back to the speaker")
FR["P11"] = dict(still="still_210.png", front=calendar() + px_cluster(14, 1380, 24, [CYAN, LILAC], 21) + cap(setup(["in", "the", "next"], 3, 0), heavy("28 days,", 156, dot=False)),
    label="f210 · 0:07.0 · “28 days” — 28 cells cascade in (0.8 f stagger) · Day 28 fills amber on “28” · hand-circled · tiny M4 parks on it")
FR["P12"] = dict(still="still_250.png", zoom=1.08, origin="420px 620px", front=cap(setup(["this", "is"], 2, 0), pill("exactly")),
    label="f250 · 0:08.3 · “exactly” — 8 f punch-in · calendar folds away · pill pops and writes on")
FR["P13"] = dict(still="still_282.png", zoom=1.06, origin="420px 620px",
    front=ink_pill("STEP 1") + cap(setup(["this", "is"], 2, 0), pill("exactly"),
              heavy("what I would do", 116, bar="16%;left:auto;right:-.02em", extra_style="transform:perspective(900px) rotateY(-10deg) rotateZ(-3deg)")),
    label="f282 · 0:09.4 · CLOSE — heavy line swings in 3D · bar under “do.” · optional “STEP 1” ink pill types on as a hook to part 2")
for k, v in FR.items():
    html = page(dict(behind=v.get("behind", ""), front=v["front"]), v["still"], v.get("cut"), v.get("zoom", 1.0), v.get("origin", "400px 640px"))
    open(os.path.join(P, "v2", f"{k}.html"), "w").write(html)
import json; json.dump({k: v["label"] for k, v in FR.items()}, open(os.path.join(P, "v2", "labels.json"), "w"), indent=1)
print("ok", list(FR))
