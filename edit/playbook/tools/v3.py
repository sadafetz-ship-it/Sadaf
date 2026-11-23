# ---- v3: more visual elements + motion graphics ----
def gcard(x, y, w, h, inner, r=40, extra=''):
    return f'<div class="glass" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:{r}px;{extra}">{inner}</div>'
def ab(x, y, inner, st=''):
    return f'<div style="position:absolute;left:{x}px;top:{y}px;{st}">{inner}</div>'
def lime_btn(txt, size=22):
    return f'<span style="display:inline-block;padding:12px 28px;border-radius:999px;background:{LIME};color:{INK};font-weight:700;font-size:{size}px;box-shadow:0 0 22px rgba(230,255,79,.6)">{txt}</span>'
def sparkles(pts):
    return ''.join(f'<svg style="position:absolute;left:{x-s}px;top:{y-s}px" width="{2*s}" height="{2*s}" class="glow"><path d="M{s} 0 Q{s} {s} {2*s} {s} Q{s} {s} {s} {2*s} Q{s} {s} 0 {s} Q{s} {s} {s} 0Z" fill="{c}"/></svg>' for x, y, s, c in pts)
def person(size, c1='#9CC2FF', c2=DEEP):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 64 64"><defs><linearGradient id="pg{size}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient></defs><circle cx="32" cy="32" r="31" fill="#0C2148" stroke="rgba(243,247,255,.45)" stroke-width="2"/><circle cx="32" cy="25" r="11" fill="url(#pg{size})"/><path d="M12 54c3-11 11-16 20-16s17 5 20 16" fill="url(#pg{size})"/></svg>'

# F1 + music-player card (left)
player = gcard(110, 120, 560, 300,
    ab(36, 34, f'<div style="width:150px;height:150px;border-radius:26px;background:linear-gradient(140deg,{LIME},#9CB82A 40%,{DEEP});box-shadow:0 0 26px rgba(230,255,79,.35);display:flex;align-items:flex-end;padding:14px;font-weight:800;font-size:24px;line-height:1;color:{INK};letter-spacing:-.5px">THE<br>PLAY<br>BOOK</div>')
    + ab(214, 42, f'<div class="lab" style="font-size:18px">Now playing</div><div style="font-weight:700;font-size:40px;letter-spacing:-1.2px;margin-top:6px">The Playbook</div><div style="font-size:22px;color:rgba(243,247,255,.65);margin-top:4px">Episode 01 · Listen up</div>')
    + ab(214, 140, f'<div style="width:86px;height:86px;border-radius:50%;background:{LIME};box-shadow:0 0 0 10px rgba(230,255,79,.15),0 0 30px rgba(230,255,79,.7);display:flex;align-items:center;justify-content:center;gap:9px"><i style="width:10px;height:34px;background:{INK};border-radius:3px"></i><i style="width:10px;height:34px;background:{INK};border-radius:3px"></i></div>')
    + ab(36, 228, f'<div style="width:488px;height:8px;border-radius:4px;background:rgba(243,247,255,.18)"><div style="width:22%;height:8px;border-radius:4px;background:{LIME};box-shadow:0 0 12px {LIME}"></div></div><div style="display:flex;justify-content:space-between;font-size:18px;color:rgba(243,247,255,.55);margin-top:10px"><span>0:02</span><span>0:39</span></div>'))
add('F1', 1.9, 'Music-player card (left) whips in · play button pressed on "up" (ripple) · punch-in · zoom-blur + white-flash open',
    talk(1.9, punch=1.06, extra=player + sparkles([(700, 130, 14, LIME), (640, 440, 9, MIST)]) + caption('Alright,', '', 'listen up')))

# F2 + input bar -> orb (left)
bar = gcard(110, 300, 560, 104, ab(30, 26, f'<div style="font-size:34px;letter-spacing:-.8px;color:{MIST}">Reveal the exact playbook<span style="display:inline-block;width:4px;height:38px;margin-left:6px;vertical-align:-6px;background:{LIME};box-shadow:0 0 14px {LIME}"></span></div>'), r=52)
orb = ab(560, 150, f'<div style="width:96px;height:96px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,{LIME} 45%,#6E8A12);box-shadow:0 0 40px rgba(230,255,79,.8),0 0 90px rgba(230,255,79,.35)"></div>') + ab(598, 255, '<div style="width:20px;height:40px;background:linear-gradient(180deg,rgba(230,255,79,.5),transparent);filter:blur(4px)"></div>')
plus = ab(130, 214, f'<div style="width:60px;height:60px;border-radius:18px;background:rgba(8,24,58,.8);border:2px solid {LIME};color:{LIME};font-size:40px;line-height:54px;text-align:center;box-shadow:0 0 16px rgba(230,255,79,.4)">+</div>')
add('F2', 4.2, 'PLAYBOOK Scripts title (right) + input bar types "Reveal the exact playbook" (left) · "+" spins · orb lifts off',
    talk(4.2, extra=scripts_title(['PLAYBOOK'], 1250, 230, 118, setL='the exact', setR='that built', seed=4, width=620)
    + bar + orb + plus + caption("I'm about to reveal", karaoke=1)))

# F3 + $1T counter card (left)
minibars = ''.join(f'<div style="position:absolute;left:{36+i*58}px;bottom:34px;width:38px;height:{h}px;border-radius:10px 10px 3px 3px;background:linear-gradient(180deg,{LIME},rgba(230,255,79,.15));box-shadow:0 0 12px rgba(230,255,79,.35);opacity:{.45+.11*i}"></div>' for i, h in enumerate([30, 46, 70, 96, 128]))
counter = gcard(110, 130, 540, 330, ab(36, 32, '<div class="lab">Assets under management</div>')
    + ab(36, 74, f'<div style="font-weight:700;font-size:84px;letter-spacing:-3px;color:{MIST};text-shadow:0 0 24px rgba(230,255,79,.4)">$1,000,000,000,000</div>', 'transform-origin:left;transform:scale(.62)')
    + ab(36, 150, f'<span style="padding:6px 14px;border-radius:999px;background:rgba(230,255,79,.15);border:1.5px solid {LIME};color:{LIME};font-size:20px;font-weight:600">▲ trillion</span>')
    + minibars + f'<svg style="position:absolute;left:300px;top:150px" width="220" height="150" class="glow"><path d="M10 140 L70 110 L110 120 L160 60 L210 14" fill="none" stroke="{LIME}" stroke-width="6" stroke-linecap="round"/></svg>')
add('F3', 6.65, '$$$ + V lines (right) · $1T counter card rolls up + bar chart grows (left) · "empire" swings in 3D · edge flash',
    talk(6.65, extra=vl + dol + edge + counter + caption('that built a', 'trillion-dollar', 'empire', swing=True)))

# F4 + avatars (left) + eye tile (right)
av = ''.join(ab(130 + (i % 4) * 118 + (59 if i >= 4 else 0), 150 + (i // 4) * 112, person(100, MIST if i % 3 else LIME), f'opacity:{1 if i<6 else .55}') for i in range(7))
avlab = ab(140, 390, f'<span style="font-weight:600;font-size:26px;letter-spacing:3px;color:{MIST}">EVERYONE </span><span style="color:{LIME};font-weight:700;font-size:26px">8B+ watching</span>')
eye = gcard(1400, 160, 320, 320, f'<svg style="position:absolute;left:40px;top:60px" width="240" height="200" viewBox="0 0 240 200" class="glow"><circle cx="120" cy="100" r="96" fill="none" stroke="{LIME}" stroke-opacity=".25" stroke-width="3"/><circle cx="120" cy="100" r="76" fill="none" stroke="{LIME}" stroke-opacity=".45" stroke-width="3"/><path d="M20 100 Q120 10 220 100 Q120 190 20 100Z" fill="rgba(8,24,58,.6)" stroke="{MIST}" stroke-width="7"/><circle cx="120" cy="100" r="34" fill="{LIME}"/><circle cx="120" cy="100" r="14" fill="{INK}"/><circle cx="130" cy="90" r="6" fill="#fff"/></svg>', r=64)
add('F4', 8.9, 'Avatar crowd pops in (left, 2 f stagger) on "everyone\'s" · glass eye tile with pulse rings (right) on "eyes" · punch-in',
    talk(8.9, punch=1.05, extra=av + avlab + eye + caption('right in front of', "everyone's", 'eyes')))

# F5 + access meter + chips
meter = gcard(1340, 600, 460, 150, ab(34, 28, '<div class="lab">Access to the industry</div>')
    + ab(34, 74, f'<div style="width:300px;height:12px;border-radius:6px;background:rgba(243,247,255,.15)"><div style="width:4%;height:12px;border-radius:6px;background:{LIME};box-shadow:0 0 12px {LIME}"></div></div>')
    + ab(360, 56, f'<div style="font-weight:700;font-size:46px;color:{LIME}">2%</div>'), r=34)
chips5 = '<div class="chip" style="left:180px;top:420px">BANKS</div><div class="chip" style="left:300px;top:540px">FUNDS</div><div class="chip" style="left:120px;top:640px">INSIDERS</div>'
add('F5', 12.3, 'Explainer (light-beam sweep in) · ink pills type on · outline-box flash on "Gatekeeping" · chips BANKS/FUNDS/INSIDERS pop · access meter stuck at 2%',
    world(seed=8) + ribbon + inkpill(470, 220, 'Most financiers') + inkpill(910, 400, 'Gatekeeping', caret=True, size=64) + box + chips5 + meter
    + caption('While most financiers are out there', 'gatekeeping the', 'industry', bar=True))

# NEW F5b: light-beam cone reveals hidden card (right)
cone = f'<svg style="position:absolute;left:0;top:0" width="1920" height="1080"><defs><linearGradient id="cn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{MIST}" stop-opacity=".85"/><stop offset="1" stop-color="{LIME}" stop-opacity=".18"/></linearGradient></defs><path d="M1560 40 L1300 640 L1840 640 Z" fill="url(#cn)" style="filter:blur(6px)"/><circle cx="1560" cy="40" r="16" fill="none" stroke="{MIST}" stroke-width="4" style="filter:drop-shadow(0 0 10px {LIME})"/></svg>'
hid = gcard(1390, 330, 360, 250, ab(30, 30, '<div class="lab">Classified · 1985</div>') + ab(30, 80, ''.join(f'<div style="height:14px;width:{w}px;border-radius:7px;background:rgba(243,247,255,.22);margin:14px 0;filter:blur(2px)"></div>' for w in (290, 240, 270))) + ab(30, 184, f'<span style="color:{LIME};font-weight:700;font-size:24px;letter-spacing:2px">✦ DISCOVERED</span>'), r=34)
add('F5b', 14.0, 'NEW · Zoom-blur back to speaker · light-beam cone sweeps in from a ring pivot and reveals a hidden glass file (right) on "discovered" · sparkles',
    talk(14.0, extra=cone + hid + sparkles([(1380, 320, 16, LIME), (1770, 600, 11, MIST), (1340, 560, 8, LIME)]) + caption('I discovered something that was', 'hidden', '')))

# F6 + magnifier highlight sweep under 'hidden in plain sight' + sparkles
add('F6', 16.35, 'Quest-card morph (left): icon → typing pill → card "The Playbook · FOUND" · lime underline sweeps under "Hidden in plain sight" · sparkles',
    talk(16.35, extra=
    f'<div class="glass" style="left:120px;top:110px;width:540px;height:330px;padding:40px">'
    f'<div style="display:flex;align-items:center;gap:20px"><div style="width:84px;height:84px;border-radius:24px;background:linear-gradient(180deg,#F6FFB8,{LIME});display:flex;align-items:center;justify-content:center;box-shadow:0 0 24px rgba(230,255,79,.5)">{mag}</div>'
    f'<div><div style="display:inline-block;padding:4px 14px;border-radius:999px;background:rgba(230,255,79,.15);border:1.5px solid {LIME};color:{LIME};font-size:18px;font-weight:600;letter-spacing:2px">● FOUND</div>'
    f'<div style="font-weight:700;font-size:44px;letter-spacing:-1.5px;margin-top:6px">The Playbook</div></div></div>'
    f'<div style="margin-top:22px;font-size:26px;color:{MIST};position:relative;display:inline-block">Hidden in plain sight<div style="position:absolute;left:0;right:0;bottom:-6px;height:5px;border-radius:3px;background:{LIME};box-shadow:0 0 12px {LIME}"></div></div>'
    f'<div style="display:flex;gap:16px;margin-top:30px"><div style="padding:14px 30px;border-radius:999px;border:2px solid rgba(243,247,255,.3);font-size:22px">Later</div>'
    f'<div style="padding:14px 34px;border-radius:999px;background:{LIME};color:{INK};font-weight:700;font-size:22px;box-shadow:0 0 22px rgba(230,255,79,.6)">Open playbook</div></div></div>'
    + sparkles([(660, 110, 16, LIME), (110, 440, 10, MIST), (690, 400, 8, LIME)])
    + caption('I discovered something that was hidden right in', 'plain', 'sight')))

# F7 + search bar with 0 results (right)
search = gcard(1290, 150, 560, 330, ab(30, 30, f'<div style="display:flex;align-items:center;gap:14px;padding:16px 22px;border-radius:999px;background:rgba(8,24,58,.75);border:2px solid rgba(243,247,255,.3);width:500px"><svg width="30" height="30" viewBox="0 0 64 64"><circle cx="27" cy="27" r="17" fill="none" stroke="{MIST}" stroke-width="6"/><path d="M40 40 L56 56" stroke="{MIST}" stroke-width="7" stroke-linecap="round"/></svg><span style="font-size:28px">how they really built it</span><span style="width:3px;height:30px;background:{LIME};box-shadow:0 0 10px {LIME}"></span></div>')
    + ab(40, 130, f'<div style="font-weight:700;font-size:54px;letter-spacing:-2px">0 results</div><div style="font-size:22px;color:rgba(243,247,255,.6);margin-top:6px">They never wanted it found.</div>')
    + ab(40, 250, ''.join(f'<span style="display:inline-block;margin-right:10px;padding:6px 14px;border-radius:999px;border:1.5px solid rgba(243,247,255,.3);font-size:18px;color:rgba(243,247,255,.5);text-decoration:line-through;text-decoration-color:{LIME}">{t}</span>' for t in ('books', 'courses', 'news'))), r=40)
add('F7', 18.45, 'Search bar types "how they really built it" → "0 results" (right) · chips struck through · lime ring draws around "find"',
    talk(18.45, extra=search + caption('something that they never wanted', 'me to', 'find') + ring_around(968, 950, 300, 130)))

# F9 + line path Lehman -> Blackstone (left)
path9 = (f'<svg style="position:absolute;left:100px;top:120px" width="600" height="340"><path d="M60 270 C 200 270, 220 80, 380 90 S 540 80, 560 60" fill="none" stroke="{LIME}" stroke-width="5" stroke-linecap="round" style="filter:drop-shadow(0 0 8px {LIME})"/><circle cx="60" cy="270" r="14" fill="{INK}" stroke="{MIST}" stroke-width="4"/><circle cx="560" cy="60" r="16" fill="{LIME}" style="filter:drop-shadow(0 0 10px {LIME})"/></svg>'
    + ab(110, 412, f'<div style="padding:10px 20px;border-radius:16px;background:rgba(8,24,58,.75);border:1.5px solid rgba(243,247,255,.3);font-size:24px;opacity:.55;filter:blur(1px)">Lehman Brothers</div>')
    + ab(470, 110, f'<div style="padding:12px 24px;border-radius:16px;background:rgba(8,24,58,.85);border:2px solid {LIME};font-weight:700;font-size:28px;box-shadow:0 0 18px rgba(230,255,79,.4)">Blackstone</div>')
    + ab(300, 300, f'<span style="padding:6px 14px;border-radius:999px;background:{LIME};color:{INK};font-weight:700;font-size:20px">LEFT · 1985</span>'))
add('F9', 24.3, 'Glass gauge rolls to 1985 (right) · line path draws Lehman Brothers (ghosted) → Blackstone (sharp) (left) · pixel-mosaic in',
    talk(24.3, extra=mosaic +
    f'<div class="glass" style="left:1340px;top:150px;width:420px;height:420px;border-radius:84px"><svg style="position:absolute;left:0;top:0" width="420" height="420">{ticks}</svg>'
    f'<div style="position:absolute;left:0;right:0;top:118px;text-align:center" class="lab">Year</div>'
    f'<div style="position:absolute;left:0;right:0;top:152px;text-align:center;font-weight:700;font-size:112px;letter-spacing:-5px;color:{MIST};text-shadow:0 0 26px rgba(230,255,79,.45)">1985</div>'
    f'<div style="position:absolute;left:0;right:0;top:290px;text-align:center;font-size:22px;color:rgba(243,247,255,.65)">left Lehman Brothers</div></div>'
    + path9 + caption('left Lehman Brothers in', 'late', '1985', bar=True)))

# NEW F9b: billions -> $0 balance card (left) + tile 01 (right)
bal = gcard(110, 130, 540, 320, ab(36, 32, '<div class="lab">Starting capital</div>')
    + ab(36, 80, f'<div style="font-weight:700;font-size:110px;letter-spacing:-4px;color:{MIST}">$0<span style="font-size:60px;color:rgba(243,247,255,.5)">.00</span></div>')
    + ab(36, 220, ''.join(f'<div style="display:inline-block;width:52px;height:{h}px;margin-right:14px;border-radius:8px;border:2px dashed rgba(243,247,255,.3);vertical-align:bottom"></div>' for h in (40, 60, 80, 70, 50)))
    + ab(330, 44, f'<span style="padding:6px 14px;border-radius:999px;border:1.5px solid {LIME};color:{LIME};font-size:20px;font-weight:600">✕ billions</span>'))
add('F9b', 26.3, 'NEW · "$0.00 starting capital" card drops in (left), empty bar outlines · tile 01 BILLIONS lands and is struck (right)',
    talk(26.3, extra=bal + tile(1340, 220, 330, '01', 'BILLIONS', 1, True) + caption("he didn't have billions of", '', 'dollars')))

# F10 + checklist card (left)
rows = [('Billions of dollars', 1), ('Private equity empire', 1), ('Massive team', 1), ('?????????', 0)]
chk = gcard(110, 110, 520, 360, ab(34, 30, '<div class="lab">What he had in 1985</div>') + ab(34, 80, ''.join(
    f'<div style="display:flex;align-items:center;gap:16px;margin:16px 0;font-size:30px;{"color:rgba(243,247,255,.5);text-decoration:line-through;text-decoration-color:"+LIME+";text-decoration-thickness:3px" if d else "color:"+LIME+";filter:blur(3px)"}"><span style="width:34px;height:34px;border-radius:10px;border:2px solid {LIME if not d else "rgba(243,247,255,.4)"};display:inline-flex;align-items:center;justify-content:center;font-size:22px;color:{LIME};text-decoration:none">{"✕" if d else ""}</span>{t}</div>' for t, d in rows)), r=40)
add('F10', 30.0, 'Tile deck 01/02/03 (right), each struck on its word · checklist card ticks ✕ on each line (left), 4th line stays blurred (foreshadows "strategy")',
    talk(30.0, extra=chk + tile(1610, 90, 240, '01', 'BILLIONS', .45) + tile(1480, 160, 280, '02', 'PE EMPIRE', .7) + tile(1300, 250, 330, '03', 'MASSIVE TEAM', 1, True)
    + caption("He didn't have a", 'massive', 'team')))

# F11 + value chart card (right)
val = gcard(1320, 150, 480, 330, ab(34, 30, '<div class="lab">Value</div>')
    + f'<svg style="position:absolute;left:30px;top:80px" width="420" height="220" class="glow"><path d="M10 200 L120 180 L200 170 L280 120 L340 60 L400 14" fill="none" stroke="{LIME}" stroke-width="7" stroke-linecap="round"/><path d="M10 200 L120 180 L200 170 L280 120 L340 60 L400 14 L400 210 L10 210Z" fill="rgba(230,255,79,.12)"/><circle cx="400" cy="14" r="9" fill="{LIME}"/></svg>'
    + ab(300, 24, f'<span style="padding:6px 14px;border-radius:999px;background:{LIME};color:{INK};font-weight:700;font-size:20px">FAR MORE ▲</span>'), r=40)
add('F11', 33.75, 'Lime key zoom-drops in + orbit ring (left) · value chart draws up (right) · highlight bar on "valuable" · sparkles',
    talk(33.75, extra=key + val + caption('something that was', 'far more', 'valuable', bar=True)))

# NEW F11b: node diagram explainer "strategy so powerful"
nodes = [('Capital', 330, 500), ('Deals', 750, 300), ('Returns', 1170, 500), ('Scale', 1590, 300)]
npath = f'<svg style="position:absolute;left:0;top:0" width="1920" height="1080"><path d="M330 500 C 500 500, 580 300, 750 300 S 1000 500, 1170 500 S 1420 300, 1590 300" fill="none" stroke="{LIME}" stroke-width="6" stroke-linecap="round" style="filter:drop-shadow(0 0 12px {LIME})"/></svg>'
nn = ''.join(gcard(x - 130, y - 70, 260, 140, ab(0, 0, f'<div style="width:260px;height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px"><div class="lab" style="font-size:18px">Step {i+1}</div><div style="font-weight:700;font-size:40px;letter-spacing:-1px">{n}</div></div>'), r=32,
    extra=('opacity:.45;filter:blur(5px);transform:scale(.9)' if i == 3 else '')) for i, (n, x, y) in enumerate(nodes))
add('F11b', 35.3, 'NEW · Explainer (light-beam sweep in) · lime line path draws Capital → Deals → Returns → Scale; each node ghost-to-sharp on the beat · "powerful" blooms',
    world(seed=17) + npath + nn + caption('a strategy so', '', 'powerful', bar=True))

# F12 + floating counters
add('F12', 38.2, 'Explainer · "The Strategy" card develops from white · lime ribbon loop flows · counters "$1T+ AUM" / "Since 1985" float in · "forever" swings in 3D · short fade',
    world(seed=13, pools=((960, 420, '#1E4C8C'), (300, 200, '#173D70'))) + ghost(330, -8) + ghost(1250, 8) + loop + card
    + gcard(170, 140, 300, 150, ab(30, 24, '<div class="lab" style="font-size:18px">AUM</div>') + ab(30, 56, f'<div style="font-weight:700;font-size:58px;letter-spacing:-2px;color:{LIME}">$1T+</div>'), r=30)
    + gcard(1450, 140, 300, 150, ab(30, 24, '<div class="lab" style="font-size:18px">Since</div>') + ab(30, 56, f'<div style="font-weight:700;font-size:58px;letter-spacing:-2px">1985</div>'), r=30)
    + sparkles([(560, 160, 14, LIME), (1380, 700, 12, MIST), (1500, 380, 9, LIME)])
    + caption('it transformed the financial world', '', 'forever', swing=True))
