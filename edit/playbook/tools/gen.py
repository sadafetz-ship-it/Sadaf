import math, random, os, subprocess, sys
W = sys.argv[1]  # work dir
V = sys.argv[2]  # video
OUT = os.path.join(W, 'pv'); os.makedirs(OUT, exist_ok=True)
INK, DEEP, LIME, MIST = '#08183A', '#173D70', '#E6FF4F', '#F3F7FF'
F = f'file://{W}/fonts'

CSS = f"""
@font-face{{font-family:Allura;src:url({F}/Allura.woff2)}}
@font-face{{font-family:Antonio;src:url({F}/Antonio700.woff2);font-weight:700}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1920px;height:1080px;overflow:hidden;background:{INK};font-family:'Inter Display','Inter',sans-serif;color:{MIST}}}
.stage{{position:absolute;inset:0;overflow:hidden}}
.foot{{position:absolute;inset:0;background-size:cover;background-position:center;filter:brightness(.66) saturate(.75) contrast(1.12)}}
.wash{{position:absolute;inset:0;background:{DEEP};mix-blend-mode:color;opacity:.55}}
.wash2{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,24,58,.35),rgba(8,24,58,0) 30%,rgba(8,24,58,0) 55%,rgba(8,24,58,.88) 100%),radial-gradient(ellipse at 50% 40%,transparent 50%,rgba(8,24,58,.55) 100%)}}
/* explainer world */
.world{{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,#10285A 0%,{INK} 70%)}}
.pool{{position:absolute;border-radius:50%;filter:blur(90px)}}
.grid{{position:absolute;inset:0;background-image:linear-gradient(rgba(243,247,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(243,247,255,.05) 1px,transparent 1px);background-size:72px 72px;-webkit-mask:radial-gradient(ellipse at 50% 45%,#000 20%,transparent 70%)}}
.pt{{position:absolute;border-radius:50%;background:{MIST}}}
/* captions */
.cap{{position:absolute;left:0;right:0;bottom:64px;display:flex;flex-direction:column;align-items:center;text-align:center}}
.setup{{font-weight:300;font-size:46px;letter-spacing:-1.4px;color:{MIST};max-width:1200px;text-wrap:balance;text-shadow:0 2px 12px rgba(8,24,58,.8)}}
.setup .k{{color:{LIME}}}
.pill{{margin-top:6px;padding:0 34px 6px;border-radius:999px;background:linear-gradient(180deg,#F6FFB8,{LIME} 55%,#B9D62C);box-shadow:inset 0 0 0 2px rgba(255,255,255,.55),0 0 22px rgba(230,255,79,.55),0 0 50px rgba(230,255,79,.3);font-family:Allura;font-size:76px;line-height:84px;color:{INK}}}
.heavy{{position:relative;margin-top:-4px;font-weight:620;letter-spacing:-5px;line-height:1.02;filter:drop-shadow(0 0 8px rgba(230,255,79,.35)) drop-shadow(0 2px 14px rgba(0,0,0,.45))}}
.heavy .t{{position:relative;z-index:2;background:linear-gradient(180deg,#fff 30%,#F6FFD2 70%,#EAFF8A 100%);-webkit-background-clip:text;color:transparent;padding:0 4px}}
.heavy .dot{{position:relative;z-index:2;color:{LIME}}}
.heavy .bar{{position:absolute;z-index:1;left:-6px;right:28px;bottom:.12em;height:.26em;border-radius:6px;background:linear-gradient(90deg,{DEEP},{LIME} 60%,#F8FFC9);box-shadow:0 0 18px rgba(230,255,79,.55)}}
.swing{{transform:perspective(900px) rotateY(-10deg) rotateZ(-3deg)}}
/* scripts title */
.st{{position:absolute;font-weight:780;letter-spacing:-.055em;line-height:.9;color:{LIME}}}
.st .w{{position:relative;display:block;white-space:nowrap}}
.st .ghost{{position:absolute;left:30px;top:0;opacity:.28;filter:blur(6px)}}
.st .sm{{position:absolute;font-weight:300;font-size:40px;letter-spacing:-1px;color:{MIST};text-shadow:0 2px 10px rgba(8,24,58,.9)}}
.st .sq{{position:absolute;width:26px;height:26px;border:3px solid {MIST}}}
.px{{position:absolute;box-shadow:0 0 10px rgba(230,255,79,.6)}}
/* glass */
.glass{{position:absolute;border-radius:44px;background:linear-gradient(160deg,rgba(40,86,150,.55),rgba(8,24,58,.88) 70%);border:2px solid rgba(160,195,255,.32);box-shadow:inset 0 -3px 0 rgba(230,255,79,.75),inset 0 -40px 60px -30px rgba(230,255,79,.28),0 0 40px rgba(8,24,58,.6),0 30px 60px rgba(0,0,0,.35);backdrop-filter:blur(14px);overflow:hidden}}
.glass::before{{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(243,247,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(243,247,255,.05) 1px,transparent 1px);background-size:28px 28px}}
.lab{{font-weight:500;font-size:22px;letter-spacing:3px;text-transform:uppercase;color:rgba(243,247,255,.7)}}
.chip{{position:absolute;padding:10px 22px;border-radius:999px;background:rgba(8,24,58,.75);border:2px solid rgba(230,255,79,.7);box-shadow:0 0 18px rgba(230,255,79,.35);font-weight:600;font-size:24px;letter-spacing:2px;color:{MIST}}}
.glow{{filter:drop-shadow(0 0 12px rgba(230,255,79,.75))}}
"""

def px_clusters(anchors, cell, seed=1):
    r = random.Random(seed); out = []
    shapes = [[(0,0),(1,0),(1,1),(2,1)], [(0,0),(0,1),(1,1)], [(0,0),(1,0),(2,0),(2,-1)], [(0,0),(1,1)], [(0,0),(1,0),(1,-1)]]
    cols = [LIME, '#F4FFB0', '#B9D62C', MIST, '#5E8FD6']
    for (x, y) in anchors:
        for (dx, dy) in r.choice(shapes):
            c = r.choice(cols)
            out.append(f'<div class="px" style="left:{x+dx*cell}px;top:{y+dy*cell}px;width:{cell}px;height:{cell}px;background:{c};opacity:{r.choice([1,1,.8,.55])}"></div>')
    return ''.join(out)

def scripts_title(lines, x, y, size, setL='', setR='', align_right_second=True, seed=1, width=600):
    h = f'<div class="st" style="left:{x}px;top:{y}px;font-size:{size}px;width:{width}px">'
    for i, ln in enumerate(lines):
        al = 'right' if (i == 1 and align_right_second) else 'left'
        gh = (f'<span class="ghost" style="{"left:auto;right:-30px" if al=="right" else ""}">{ln}</span>') if i == len(lines)-1 else ''
        h += f'<span class="w" style="text-align:{al}">{gh}{ln}</span>'
    if setL: h += f'<span class="sm" style="left:4px;top:-50px">{setL}</span>'
    if setR: h += f'<span class="sm" style="right:0;top:-50px">{setR}</span>'
    h += f'<span class="sq" style="left:-46px;top:{int(size*0.3)}px"></span>'
    hh = int(size*0.86*len(lines))
    h += px_clusters([(-20, hh+6), (width+14, int(size*0.15)), (width-30, hh+4)], int(size*0.13), seed)
    return h + '</div>'

def caption(setup='', pill='', heavy='', bar=False, swing=False, karaoke=None):
    h = '<div class="cap">'
    if setup:
        if karaoke:  # last N words lime (just spoken)
            ws = setup.split(); n = karaoke
            setup = ' '.join(ws[:-n]) + ' <span class="k">' + ' '.join(ws[-n:]) + '</span>'
        h += f'<div class="setup">{setup}</div>'
    if pill: h += f'<div class="pill">{pill}</div>'
    if heavy:
        size = min(118, int(1404/len(heavy)))
        b = '<span class="bar"></span>' if bar else ''
        h += f'<div class="heavy{" swing" if swing else ""}" style="font-size:{size}px">{b}<span class="t">{heavy}</span><span class="dot">.</span></div>'
    return h + '</div>'

def talk(t, punch=1.0, extra=''):
    img = f'{W}/pv/st_{t}.jpg'
    if not os.path.exists(img):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', V, '-frames:v', '1', '-q:v', '2', img], check=True)
    tf = f'transform:scale({punch});transform-origin:1000px 300px;' if punch != 1 else ''
    return f'<div class="stage" style="{tf}"><div class="foot" style="background-image:url(file://{img})"></div><div class="wash"></div></div><div class="wash2"></div>' + extra

def world(seed=3, pools=((420, 300, '#173D70'), (1500, 700, '#1E4C8C'))):
    r = random.Random(seed)
    h = '<div class="world"></div>'
    for (x, y, c) in pools:
        h += f'<div class="pool" style="left:{x-350}px;top:{y-250}px;width:700px;height:500px;background:{c};opacity:.85"></div>'
    h += '<div class="grid"></div>'
    for _ in range(60):
        s = r.choice([2, 2, 3, 4])
        h += f'<div class="pt" style="left:{r.randint(0,1920)}px;top:{r.randint(0,1080)}px;width:{s}px;height:{s}px;opacity:{r.uniform(.15,.6):.2f};{"background:"+LIME if r.random()<.25 else ""}"></div>'
    return h

def globe(cx, cy, R, seed=5, net=True):
    r = random.Random(seed)
    s = f'<svg style="position:absolute;left:{cx-R-40}px;top:{cy-R-40}px" width="{2*R+80}" height="{2*R+80}" viewBox="{-R-40} {-R-40} {2*R+80} {2*R+80}">'
    s += f'<defs><radialGradient id="gb{seed}" cx="40%" cy="35%"><stop offset="0" stop-color="#2D63B0" stop-opacity=".75"/><stop offset=".7" stop-color="#173D70" stop-opacity=".55"/><stop offset="1" stop-color="#08183A" stop-opacity=".9"/></radialGradient></defs>'
    s += f'<circle r="{R+22}" fill="none" stroke="{LIME}" stroke-opacity=".18" stroke-width="2"/>'
    s += f'<circle r="{R}" fill="url(#gb{seed})" stroke="#9CC2FF" stroke-opacity=".55" stroke-width="2"/>'
    for k in range(1, 6):
        s += f'<ellipse rx="{R*math.cos(math.pi/2*k/6):.1f}" ry="{R}" fill="none" stroke="#9CC2FF" stroke-opacity=".22"/>'
    for k in range(-4, 5):
        y = R*math.sin(math.pi/2*k/5); rx = math.sqrt(max(R*R-y*y, 0))
        s += f'<ellipse cy="{y:.1f}" rx="{rx:.1f}" ry="{rx*0.18:.1f}" fill="none" stroke="#9CC2FF" stroke-opacity=".2"/>'
    if net:
        pts = []
        for _ in range(70):
            th = r.uniform(0, 2*math.pi); ph = r.uniform(-1.2, 1.2)
            x = R*.95*math.cos(ph)*math.sin(th); y = R*.95*math.sin(ph)
            if math.cos(th) > -0.1: pts.append((x, y))
        for i, a in enumerate(pts):
            for b in pts[i+1:]:
                if math.dist(a, b) < R*.32:
                    s += f'<line x1="{a[0]:.0f}" y1="{a[1]:.0f}" x2="{b[0]:.0f}" y2="{b[1]:.0f}" stroke="{LIME}" stroke-opacity=".55" stroke-width="1.6"/>'
        for (x, y) in pts:
            s += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="4.5" fill="{LIME}" style="filter:drop-shadow(0 0 6px {LIME})"/>'
    return s + '</svg>'

def ico(name, size=64, col=LIME):
    p = {
        'lock': f'<rect x="14" y="30" width="36" height="28" rx="6" fill="none" stroke="{col}" stroke-width="4"/><path d="M22 30v-8a10 10 0 0 1 20 0v8" fill="none" stroke="{col}" stroke-width="4"/><circle cx="32" cy="43" r="4" fill="{col}"/>',
        'coins': f'<g fill="none" stroke="{col}" stroke-width="3.5"><ellipse cx="32" cy="16" rx="18" ry="6"/><path d="M14 16v10c0 3.3 8 6 18 6s18-2.7 18-6V16"/><path d="M14 26v10c0 3.3 8 6 18 6s18-2.7 18-6V26"/><path d="M14 36v10c0 3.3 8 6 18 6s18-2.7 18-6V36"/></g>',
        'bldg': f'<g fill="none" stroke="{col}" stroke-width="3.5"><path d="M12 56V20l20-10 20 10v36"/><path d="M8 56h48"/><path d="M22 28v6M32 28v6M42 28v6M22 40v6M32 40v6M42 40v6"/></g>',
        'team': f'<g fill="none" stroke="{col}" stroke-width="3.5"><circle cx="32" cy="20" r="7"/><circle cx="14" cy="26" r="5.5"/><circle cx="50" cy="26" r="5.5"/><path d="M20 52c0-8 5-14 12-14s12 6 12 14"/><path d="M4 50c0-6 4-10 10-10 3 0 5 1 7 3M60 50c0-6-4-10-10-10-3 0-5 1-7 3"/></g>',
        'wave': '',
    }[name]
    return f'<svg width="{size}" height="{size}" viewBox="0 0 64 64" class="glow">{p}</svg>'

def page(body):
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'

frames = []
def add(fid, t, label, body):
    global frames
    frames = [f for f in frames if f[0] != fid]
    frames.append((fid, t, label))
    open(f'{OUT}/{fid}.html', 'w').write(page(body))

def ring_around(cx, cy, w, h):
    return f'<svg style="position:absolute;left:{cx-w//2-20}px;top:{cy-h//2-20}px" width="{w+40}" height="{h+40}" class="glow"><path d="M{w*0.55+20} {22} C{w+30} {10}, {w+40} {h+20}, {w*0.5+20} {h+16} S 6 {h*0.6}, {w*0.2+20} {h*0.25+20} S {w*0.7} 14, {w*0.8+20} 34" fill="none" stroke="{LIME}" stroke-width="6" stroke-linecap="round"/></svg>'

# F1 caption only
add('F1', 1.9, 'Caption only · zoom-blur + white-flash open · punch-in on "up"',
    talk(1.9, punch=1.06, extra=caption('Alright,', '', 'listen up')))
# F2 PLAYBOOK title
add('F2', 4.2, 'PLAYBOOK Scripts title (right zone)',
    talk(4.2, extra=scripts_title(['PLAYBOOK'], 1250, 230, 118, setL='the exact', setR='that built', seed=4, width=620)
    + caption("I'm about to reveal", karaoke=1)))
# F3 $$$
dol = ''.join(f'<div style="position:absolute;left:{1290+i*175}px;top:{150+(i%2)*14}px;font-family:Antonio;font-weight:700;font-size:330px;line-height:1;background:linear-gradient(180deg,{MIST} 20%,#F4FFB0 55%,{LIME});-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 14px rgba(230,255,79,.45));transform:scale({1.07 if i==1 else 1})">$</div>' for i in range(3))
vl = f'<svg style="position:absolute;left:1240px;top:90px" width="640" height="560"><path d="M20 20 L320 520 L620 20" fill="none" stroke="{MIST}" stroke-opacity=".55" stroke-width="2"/><path d="M90 20 L320 450 L550 20" fill="none" stroke="{LIME}" stroke-opacity=".5" stroke-width="2"/></svg>'
edge = '<div style="position:absolute;inset:0;background:linear-gradient(270deg,rgba(230,255,79,.16),transparent 22%)"></div>'
add('F3', 6.65, '$$$ + V lines (right zone) · "empire" swings in 3D · lime edge flash',
    talk(6.65, extra=vl + dol + edge + caption('that built a', 'trillion-dollar', 'empire', swing=True)))
# F4
add('F4', 8.9, 'Caption only · punch-in on "eyes"',
    talk(8.9, punch=1.08, extra=caption('right in front of', "everyone's", 'eyes')))
# F5 explainer: ink pill labels typing + neon ribbon
ribbon = f'<svg style="position:absolute;left:0;top:0" width="1920" height="1080"><path d="M-40 640 C 300 420, 620 760, 960 560 S 1600 300, 1980 520" fill="none" stroke="{MIST}" stroke-width="16" stroke-linecap="round" style="filter:blur(3px) drop-shadow(0 0 18px {LIME}) drop-shadow(0 0 40px rgba(230,255,79,.5))" opacity=".9"/></svg>'
def inkpill(x, y, txt, caret=False, size=54):
    c = f'<span style="display:inline-block;width:4px;height:{size}px;margin-left:6px;vertical-align:-8px;background:{LIME};box-shadow:0 0 12px {LIME}"></span>' if caret else ''
    return f'<div style="position:absolute;left:{x}px;top:{y}px;padding:18px 38px;border-radius:999px;background:linear-gradient(180deg,#0E2450,{INK});border:2px solid rgba(230,255,79,.75);box-shadow:0 0 24px rgba(230,255,79,.3),0 20px 40px rgba(0,0,0,.4);font-weight:500;font-size:{size}px;letter-spacing:-1px;color:{MIST};white-space:nowrap">{txt}{c}</div>'
box = f'<div style="position:absolute;left:888px;top:380px;width:484px;height:142px;border:3px solid {LIME};border-radius:24px;box-shadow:0 0 22px rgba(230,255,79,.6)"></div>'
add('F5', 12.3, 'Explainer · ink pill labels type on · outline-box flash on "Gatekeeping" · neon ribbon behind',
    world(seed=8) + ribbon + inkpill(470, 220, 'Most financiers') + inkpill(910, 400, 'Gatekeeping', caret=True, size=64) + box
    + caption('While most financiers are out there', 'gatekeeping the', 'industry', bar=True))
# F6 quest card (morphed state)
mag = f'<svg width="54" height="54" viewBox="0 0 64 64"><circle cx="27" cy="27" r="17" fill="none" stroke="{INK}" stroke-width="6"/><path d="M40 40 L56 56" stroke="{INK}" stroke-width="7" stroke-linecap="round"/></svg>'
add('F6', 16.35, 'Quest-card morph (left zone): icon → typing pill "Hidden in plain sight" → card',
    talk(16.35, extra=
    f'<div class="glass" style="left:120px;top:110px;width:540px;height:330px;padding:40px">'
    f'<div style="display:flex;align-items:center;gap:20px"><div style="width:84px;height:84px;border-radius:24px;background:linear-gradient(180deg,#F6FFB8,{LIME});display:flex;align-items:center;justify-content:center;box-shadow:0 0 24px rgba(230,255,79,.5)">{mag}</div>'
    f'<div><div style="display:inline-block;padding:4px 14px;border-radius:999px;background:rgba(230,255,79,.15);border:1.5px solid {LIME};color:{LIME};font-size:18px;font-weight:600;letter-spacing:2px">● FOUND</div>'
    f'<div style="font-weight:700;font-size:44px;letter-spacing:-1.5px;margin-top:6px">The Playbook</div></div></div>'
    f'<div style="margin-top:22px;font-size:26px;color:rgba(243,247,255,.7)">Hidden in plain sight</div>'
    f'<div style="display:flex;gap:16px;margin-top:30px"><div style="padding:14px 30px;border-radius:999px;border:2px solid rgba(243,247,255,.3);font-size:22px">Later</div>'
    f'<div style="padding:14px 34px;border-radius:999px;background:{LIME};color:{INK};font-weight:700;font-size:22px;box-shadow:0 0 22px rgba(230,255,79,.6)">Open playbook</div></div></div>'
    + caption('I discovered something that was hidden right in', 'plain', 'sight')))
# F7 ring around find
add('F7', 18.45, 'Caption only · lime ring draws around "find"',
    talk(18.45, extra=caption('something that they never wanted', 'me to', 'find') + ring_around(968, 950, 300, 130)))
# F8 name
add('F8', 21.75, 'SCHWARZMAN name lockup (left zone) · riser→whoosh→impact',
    talk(21.75, extra=scripts_title(['SCHWARZMAN'], 110, 220, 92, setL='Steve', setR='of Blackstone', seed=9, width=640)
    + caption('Now, when')))
# F9 gauge widget
ticks = ''
for k in range(37):
    a = math.radians(135 + k*7.5); r1, r2 = 150, 172
    on = k <= 30
    ticks += f'<line x1="{210+r1*math.cos(a):.1f}" y1="{210+r1*math.sin(a):.1f}" x2="{210+r2*math.cos(a):.1f}" y2="{210+r2*math.sin(a):.1f}" stroke="{LIME if on else "rgba(243,247,255,.25)"}" stroke-width="5" stroke-linecap="round" {"style=\"filter:drop-shadow(0 0 5px #E6FF4F)\"" if on else ""}/>'
mosaic = ''.join(f'<div style="position:absolute;left:{x}px;top:{y}px;width:44px;height:44px;background:{c};opacity:{o}"></div>' for x, y, c, o in [(1270,120,LIME,.7),(1314,120,DEEP,.8),(1270,164,DEEP,.6),(1790,560,LIME,.55),(1746,560,DEEP,.7),(1790,516,DEEP,.5)])
add('F9', 24.3, 'Glass gauge widget (right zone) · pixel-mosaic dissolve in · number rolls to 1985',
    talk(24.3, extra=mosaic +
    f'<div class="glass" style="left:1340px;top:150px;width:420px;height:420px;border-radius:84px"><svg style="position:absolute;left:0;top:0" width="420" height="420">{ticks}</svg>'
    f'<div style="position:absolute;left:0;right:0;top:118px;text-align:center" class="lab">Year</div>'
    f'<div style="position:absolute;left:0;right:0;top:152px;text-align:center;font-weight:700;font-size:112px;letter-spacing:-5px;color:{MIST};text-shadow:0 0 26px rgba(230,255,79,.45)">1985</div>'
    f'<div style="position:absolute;left:0;right:0;top:290px;text-align:center;font-size:22px;color:rgba(243,247,255,.65)">left Lehman Brothers</div></div>'
    + caption('left Lehman Brothers in', 'late', '1985', bar=True)))
# F10 number tiles stacked deck
def tile(x, y, s, n, lab, op, front=False):
    strike = f'<div style="position:absolute;left:40px;right:40px;top:{int(s*0.74)}px;height:6px;border-radius:3px;background:{LIME};box-shadow:0 0 14px {LIME}"></div>'
    return (f'<div class="glass" style="left:{x}px;top:{y}px;width:{s}px;height:{s}px;border-radius:{int(s*0.17)}px;opacity:{op};border-color:rgba(230,255,79,{.7 if front else .3})">'
        f'<svg style="position:absolute;inset:0" width="{s}" height="{s}"><path d="M{s*.15} {s*.2} L{s*.35} {s*.45} L{s*.3} {s*.6}" stroke="rgba(243,247,255,.12)" fill="none" stroke-width="2"/><path d="M{s*.8} {s*.1} L{s*.7} {s*.35}" stroke="rgba(243,247,255,.12)" fill="none" stroke-width="2"/></svg>'
        f'<div style="position:absolute;left:0;right:0;top:{int(s*0.1)}px;text-align:center;font-weight:700;font-size:{int(s*0.48)}px;letter-spacing:-4px;color:{LIME if front else MIST};text-shadow:0 0 28px rgba(230,255,79,.55)">{n}</div>'
        f'<div style="position:absolute;left:0;right:0;top:{int(s*0.68)}px;text-align:center;font-weight:600;font-size:{int(s*0.085)}px;letter-spacing:2px">{lab}</div>{strike}</div>')
add('F10', 30.0, 'Number tiles stacked deck (right zone) · each lands in front on its "he didn\'t have…" and is struck through',
    talk(30.0, extra=tile(1610, 90, 240, '01', 'BILLIONS', .45) + tile(1480, 160, 280, '02', 'PE EMPIRE', .7) + tile(1300, 250, 330, '03', 'MASSIVE TEAM', 1, True)
    + caption("He didn't have a", 'massive', 'team')))
# F11 key + orbit
key = f'''<svg style="position:absolute;left:150px;top:90px" width="520" height="400" viewBox="0 0 520 400">
<defs><linearGradient id="kk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="{LIME}"/><stop offset="1" stop-color="#5E7A12"/></linearGradient></defs>
<path d="M40 260 A 230 120 -18 1 1 470 150" fill="none" stroke="{MIST}" stroke-opacity=".7" stroke-width="3"/>
<circle cx="470" cy="150" r="9" fill="{MIST}" style="filter:drop-shadow(0 0 8px {MIST})"/>
<g transform="translate(150 70) rotate(38)" style="filter:drop-shadow(0 0 18px rgba(230,255,79,.6))">
<circle cx="60" cy="60" r="58" fill="url(#kk)"/><circle cx="60" cy="60" r="26" fill="#0C2148"/>
<rect x="110" y="48" width="190" height="24" rx="8" fill="url(#kk)"/><rect x="240" y="70" width="22" height="40" rx="4" fill="url(#kk)"/><rect x="274" y="70" width="22" height="56" rx="4" fill="url(#kk)"/></g>
<g fill="{LIME}" style="filter:drop-shadow(0 0 6px {LIME})"><path d="M90 90 h20 M100 80 v20" stroke="{LIME}" stroke-width="4"/><path d="M430 300 h16 M438 292 v16" stroke="{LIME}" stroke-width="4"/><path d="M60 330 h12 M66 324 v12" stroke="{MIST}" stroke-width="3"/></g></svg>'''
add('F11', 33.75, 'Key + orbit ring (left zone), recoloured mist→lime · highlight bar on "valuable"',
    talk(33.75, extra=key + caption('something that was', 'far more', 'valuable', bar=True)))
# F12 product card + ribbon loop
star = ''.join(f'<span style="color:{LIME};font-size:30px;text-shadow:0 0 10px {LIME}">★</span>' for _ in range(5))
arrowico = f'<svg width="70" height="70" viewBox="0 0 64 64"><path d="M8 50 L26 32 L36 40 L56 16" fill="none" stroke="{LIME}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M56 16 l-14 2 M56 16 l-2 14" stroke="{LIME}" stroke-width="6" stroke-linecap="round"/></svg>'
ghost = lambda x, r: f'<div class="glass" style="left:{x}px;top:250px;width:340px;height:440px;transform:rotate({r}deg);filter:blur(7px);opacity:.45"></div>'
card = (f'<div style="position:absolute;left:770px;top:150px;width:380px;height:520px;border-radius:44px;overflow:hidden;box-shadow:0 0 60px rgba(230,255,79,.3),0 30px 60px rgba(0,0,0,.5);border:2px solid rgba(243,247,255,.4)">'
    f'<div style="height:250px;background:linear-gradient(180deg,{MIST},#F1FFA8 60%,{LIME});display:flex;align-items:center;justify-content:center"><div style="width:120px;height:120px;border-radius:32px;background:{INK};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(8,24,58,.4)">{arrowico}</div></div>'
    f'<div style="height:270px;background:linear-gradient(180deg,#0E2450,{INK});padding:30px 34px;text-align:center"><div style="font-weight:800;font-style:italic;font-size:48px;letter-spacing:-1.5px">The Strategy</div>'
    f'<div style="font-size:22px;color:rgba(243,247,255,.65);margin:8px 0 20px">transformed the financial world</div><div>{star}</div></div></div>')
loop = f'<svg style="position:absolute;left:560px;top:80px" width="800" height="680"><ellipse cx="400" cy="340" rx="330" ry="250" transform="rotate(-14 400 340)" fill="none" stroke="{MIST}" stroke-width="14" stroke-dasharray="1500 120" style="filter:blur(2px) drop-shadow(0 0 16px {LIME}) drop-shadow(0 0 34px rgba(230,255,79,.5))"/></svg>'
add('F12', 38.2, 'Explainer · "The Strategy" card develops from white · lime light-ribbon loop flows · "forever" swings in 3D',
    world(seed=13, pools=((960, 420, '#1E4C8C'), (300, 200, '#173D70'))) + ghost(330, -8) + ghost(1250, 8) + loop + card
    + caption('it transformed the financial world', '', 'forever', swing=True, ))

exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'v3.py')).read())
import json
frames.sort(key=lambda f: f[1])
json.dump(frames, open(f'{OUT}/frames.json', 'w'))
print(len(frames))
