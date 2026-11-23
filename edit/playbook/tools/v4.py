# ---- v4: element look from the user's UI references, recoloured navy + lime ----
# Traits: near-black navy bodies, light pooling up from the bottom edge, neon rims,
# big light-weight numbers, glowing typed highlights, blurred ghost words behind.
OLD_CSS = CSS
CSS = CSS + f"""
.glass{{border-radius:56px;background:radial-gradient(130% 70% at 50% 118%,rgba(230,255,79,.42),rgba(46,100,176,.30) 42%,rgba(8,24,58,0) 72%),linear-gradient(180deg,#081533,#040A1C);
  border:1.5px solid rgba(243,247,255,.13);
  box-shadow:inset 0 -2px 0 rgba(230,255,79,.95),inset 0 -50px 70px -30px rgba(230,255,79,.6),inset 0 1px 0 rgba(243,247,255,.12),0 34px 90px -28px rgba(230,255,79,.38),0 24px 60px rgba(0,0,0,.55);backdrop-filter:blur(16px)}}
.glass::before{{background-size:44px 44px;-webkit-mask:linear-gradient(0deg,#000 0%,rgba(0,0,0,.6) 30%,transparent 60%)}}
.lab{{font-weight:400;letter-spacing:.5px;text-transform:none;font-size:22px;color:rgba(243,247,255,.55)}}
.big{{font-weight:300;letter-spacing:-.04em;line-height:1;background:linear-gradient(180deg,#FFFFFF 20%,{MIST} 50%,#EAFF9A 100%);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 18px rgba(230,255,79,.28))}}
.neonpill{{position:absolute;border-radius:999px;background:#03081A;border:3px solid {LIME};box-shadow:0 0 0 1px rgba(243,247,255,.25) inset,0 0 18px rgba(230,255,79,.7),0 0 70px 10px rgba(46,100,176,.55),0 0 140px 30px rgba(23,61,112,.6)}}
.ghostw{{position:absolute;font-weight:600;letter-spacing:-.04em;color:rgba(243,247,255,.09);filter:blur(5px);white-space:nowrap}}
.hl{{color:{LIME};text-shadow:0 0 10px {LIME},0 0 26px rgba(230,255,79,.7)}}
"""
def big(txt, size, extra=''):
    return f'<span class="big" style="font-size:{size}px;{extra}">{txt}</span>'
def circbtn(inner, size=64, on=False):
    bg = f'background:{LIME};color:{INK};box-shadow:0 0 26px rgba(230,255,79,.8)' if on else 'background:rgba(243,247,255,.08);color:'+MIST+';border:1.5px solid rgba(243,247,255,.2)'
    return f'<div style="width:{size}px;height:{size}px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:{int(size*.38)}px;{bg}">{inner}</div>'
def arc(r, frac, w=14, start=150, sweep=240, gid='ag'):
    def pt(a): a = math.radians(a); return r + 20 + r*math.cos(a), r + 20 + r*math.sin(a)
    x0, y0 = pt(start); x1, y1 = pt(start + sweep); xf, yf = pt(start + sweep*frac)
    big1 = 1 if sweep > 180 else 0; bigf = 1 if sweep*frac > 180 else 0
    return (f'<svg width="{2*r+40}" height="{2*r+40}"><defs><linearGradient id="{gid}" x1="0" x2="1"><stop offset="0" stop-color="#2E64B0"/><stop offset=".6" stop-color="{LIME}"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient></defs>'
            f'<path d="M{x0:.1f} {y0:.1f} A{r} {r} 0 {big1} 1 {x1:.1f} {y1:.1f}" fill="none" stroke="rgba(243,247,255,.1)" stroke-width="{w}" stroke-linecap="round"/>'
            f'<path d="M{x0:.1f} {y0:.1f} A{r} {r} 0 {bigf} 1 {xf:.1f} {yf:.1f}" fill="none" stroke="url(#{gid})" stroke-width="{w}" stroke-linecap="round" style="filter:drop-shadow(0 0 10px rgba(230,255,79,.7))"/>'
            f'<circle cx="{xf:.1f}" cy="{yf:.1f}" r="{w*.75}" fill="#fff" style="filter:drop-shadow(0 0 10px {LIME})"/></svg>')
def corner(x, y, txt):  # small top-corner meta text
    return ab(x, y, f'<span style="font-size:18px;color:rgba(243,247,255,.5)">{txt}</span>')

# F1: player widget (like the "42 min reading" tile)
w1 = gcard(120, 90, 440, 440, corner(36, 30, 'Episode 01') + corner(340, 30, '0:02')
    + ab(60, 64, arc(140, .3, 14, gid='a1'))
    + ab(0, 156, f'<div style="width:440px;text-align:center"><div style="font-size:20px;color:rgba(243,247,255,.6)">now playing</div>{big("The Playbook", 46, "font-weight:400;letter-spacing:-1px")}</div>')
    + ab(0, 330, f'<div style="width:440px;display:flex;justify-content:center;align-items:center;gap:26px">{circbtn("❚❚", 58)}{circbtn("▶", 84, True)}{circbtn("✕", 58)}</div>'), r=70)
add('F1', 1.9, 'Player widget (left), dark body with lime bottom glow: arc progress starts, play button pressed on "up" · punch-in · zoom-blur + white-flash open',
    talk(1.9, punch=1.06, extra=w1 + caption('Alright,', '', 'listen up')))

# F2: neon pill prompt (like "motion designer? ↑") + PLAYBOOK title
pill2 = (f'<div class="neonpill" style="left:90px;top:250px;width:600px;height:120px"></div>'
    + ab(140, 284, f'<span style="font-size:40px;letter-spacing:-.8px;color:{MIST}">Reveal the <span class="hl">playbook</span>?</span>')
    + ab(600, 276, f'<svg width="66" height="66" viewBox="0 0 64 64"><path d="M32 54 V12 M14 30 L32 12 L50 30" fill="none" stroke="{MIST}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>'))
add('F2', 4.2, 'Neon prompt pill (left) types "Reveal the playbook?", "playbook" glows lime, arrow sends · PLAYBOOK Scripts title (right)',
    talk(4.2, extra=scripts_title(['PLAYBOOK'], 1250, 230, 118, setL='the exact', setR='that built', seed=4, width=620) + pill2
    + caption("I'm about to reveal", karaoke=1)))

# Balance-style card (like the "Balance $198454" ref)
def balance(x, y, w, label, amount, delta, ticks, fill, icon=''):
    tk = ''.join(f'<span>{t}</span>' for t in ticks)
    return gcard(x, y, w, 300, ab(44, 50, f'<div style="font-size:26px;color:rgba(243,247,255,.6)">{label}</div>'
        f'<div style="margin-top:6px;display:flex;align-items:baseline;gap:14px">{big(amount, 66 if len(amount)<10 else 46, "font-weight:600;letter-spacing:-1.5px")}<span style="font-size:22px;color:{LIME}">{delta}</span></div>')
        + ab(w-110, 52, icon)
        + ab(44, 190, f'<div style="width:{w-88}px;display:flex;justify-content:space-between;font-size:20px;letter-spacing:1px;color:rgba(243,247,255,.55)">{tk}</div>'
        f'<div style="margin-top:14px;width:{w-88}px;height:12px;border-radius:6px;background:rgba(243,247,255,.08)"><div style="width:{fill}%;height:12px;border-radius:6px;background:linear-gradient(90deg,#B9D62C,{LIME});box-shadow:0 0 14px {LIME},0 0 34px rgba(230,255,79,.6)"></div></div>'), r=48)
bank = f'<svg width="62" height="62" viewBox="0 0 64 64"><g fill="rgba(243,247,255,.5)"><path d="M32 6 L60 20 H4Z"/><rect x="8" y="24" width="7" height="26"/><rect x="22" y="24" width="7" height="26"/><rect x="35" y="24" width="7" height="26"/><rect x="49" y="24" width="7" height="26"/><rect x="4" y="52" width="56" height="7"/></g></svg>'
add('F3', 6.65, 'Balance-style AUM card (left): "$1T" counts up, glowing lime bar fills 1985 → today · $$$ + V lines (right) · "empire" swings in 3D',
    talk(6.65, extra=vl + dol + edge + balance(90, 140, 600, 'Assets under management', '$1,000,000,000,000', '▲', ['1985', '1995', '2005', '2015', 'TODAY'], 100, bank)
    + caption('that built a', 'trillion-dollar', 'empire', swing=True)))

# F4 eye tile restyle (widget)
eye4 = gcard(1400, 150, 340, 340, corner(34, 30, 'live') + corner(250, 30, '8B+')
    + f'<svg style="position:absolute;left:50px;top:80px" width="240" height="200" viewBox="0 0 240 200" class="glow"><circle cx="120" cy="100" r="96" fill="none" stroke="{LIME}" stroke-opacity=".2" stroke-width="3"/><circle cx="120" cy="100" r="76" fill="none" stroke="{LIME}" stroke-opacity=".4" stroke-width="3"/><path d="M20 100 Q120 10 220 100 Q120 190 20 100Z" fill="rgba(8,24,58,.6)" stroke="{MIST}" stroke-width="6"/><circle cx="120" cy="100" r="34" fill="{LIME}"/><circle cx="120" cy="100" r="14" fill="{INK}"/><circle cx="130" cy="90" r="6" fill="#fff"/></svg>'
    + ab(0, 280, f'<div style="width:340px;text-align:center;font-size:22px;color:rgba(243,247,255,.6)">everyone\'s watching</div>'), r=64)
add('F4', 8.9, 'Avatar crowd pops in (left) on "everyone\'s" · eye widget with pulse rings (right) on "eyes" · punch-in',
    talk(8.9, punch=1.05, extra=av + avlab + eye4 + caption('right in front of', "everyone's", 'eyes')))

# F5b: neon corner-outline frame (like "CREATIVE UI ANIM") with ghost text
frame5b = (f'<div style="position:absolute;left:1300px;top:120px;width:640px;height:520px;border-top:4px solid {LIME};border-left:4px solid {LIME};border-top-left-radius:70px;'
    f'box-shadow:-6px -6px 22px -6px rgba(230,255,79,.8);background:radial-gradient(120% 90% at 0% 0%,rgba(46,100,176,.45),rgba(4,10,28,.85) 60%);-webkit-mask:linear-gradient(90deg,#000 70%,transparent),linear-gradient(180deg,#000 75%,transparent);-webkit-mask-composite:source-in"></div>'
    + ab(1370, 230, f'<div style="font-weight:300;font-size:64px;letter-spacing:3px;color:{MIST};text-shadow:0 0 20px rgba(243,247,255,.35)">CLASSIFIED</div>'
    f'<div style="margin-top:22px;width:440px;font-size:26px;line-height:1.5;color:rgba(243,247,255,.35)">How one firm turned a single idea into the <span class="hl">biggest</span> playbook in finance…</div>'))
add('F5b', 14.0, 'NEW · Zoom-blur back to speaker · neon corner frame draws in (right): "CLASSIFIED" glows on, ghost text types with one lime glowing word on "discovered"',
    talk(14.0, extra=frame5b + caption('I discovered something that was', 'hidden', '')))

# F6: dark window with glowing typed highlight (like the ChatGPT window ref)
dots = ''.join(f'<i style="display:inline-block;width:16px;height:16px;border-radius:50%;margin-right:10px;background:{c}"></i>' for c in (LIME, MIST, '#2E64B0'))
win = (f'<div class="glass" style="left:110px;top:80px;width:560px;height:430px;border-radius:26px;padding:28px 40px">'
    f'<div style="display:flex;justify-content:space-between;align-items:center">{dots and "<div>"+dots+"</div>"}<span style="font-size:18px;color:rgba(243,247,255,.4)">playbook/notes</span></div>'
    f'<div style="height:1px;background:rgba(243,247,255,.1);margin:18px -40px 20px"></div>'
    f'<div style="font-size:26px;font-weight:600;margin-bottom:8px">Research</div>'
    + ''.join(f'<div style="font-size:23px;color:rgba(243,247,255,.7);margin:6px 0 6px 18px">{t}</div>' for t in ('Private equity 101', 'Blackstone, 1985', 'Who kept it quiet'))
    + f'<div style="font-size:26px;font-weight:600;margin:16px 0 8px">Found</div>'
    f'<div style="font-size:25px;color:{MIST};margin-left:18px">Hidden in <span class="hl">plain sight</span><span style="display:inline-block;width:3px;height:26px;margin-left:4px;vertical-align:-4px;background:{LIME};box-shadow:0 0 10px {LIME}"></span></div></div>')
add('F6', 16.35, 'Dark notes window (left): lines type on, then "Hidden in plain sight" with "plain sight" glowing lime on the spoken words',
    talk(16.35, extra=win + caption('I discovered something that was hidden right in', 'plain', 'sight')))

# F7: neon search pill + results widget
pill7 = (f'<div class="neonpill" style="left:1260px;top:150px;width:600px;height:110px"></div>'
    + ab(1310, 182, f'<span style="font-size:34px;color:{MIST}">how they really built it</span><span style="display:inline-block;width:3px;height:34px;margin-left:6px;vertical-align:-6px;background:{LIME};box-shadow:0 0 10px {LIME}"></span>')
    + gcard(1300, 310, 520, 220, ab(40, 36, f'<div style="font-size:22px;color:rgba(243,247,255,.55)">Search results</div>{big("0", 110, "font-weight:300")}')
        + ab(220, 92, f'<div style="font-size:24px;color:rgba(243,247,255,.75)">They never wanted<br>it <span class="hl">found</span>.</div>'), r=44))
add('F7', 18.45, 'Neon search pill types "how they really built it" (right) → results widget counts to "0" · lime ring draws around "find"',
    talk(18.45, extra=pill7 + caption('something that they never wanted', 'me to', 'find') + ring_around(968, 950, 300, 130)))

# F9: arc gauge widget (like the pie / "42" tiles)
g9 = gcard(1330, 120, 460, 460, corner(40, 34, 'Year') + corner(360, 34, 'NYC')
    + ab(70, 70, arc(140, .82, 16, gid='a9'))
    + ab(0, 175, f'<div style="width:460px;text-align:center">{big("1985", 112)}</div>')
    + ab(40, 380, f'<div style="font-size:16px;letter-spacing:1px;color:rgba(243,247,255,.5)">LEFT</div><div style="font-size:24px">Lehman</div>')
    + ab(300, 380, f'<div style="font-size:16px;letter-spacing:1px;color:rgba(243,247,255,.5);text-align:right">FOUNDED</div><div style="font-size:24px;color:{LIME}">Blackstone</div>'), r=70)
add('F9', 24.3, 'Arc gauge widget (right): arc sweeps, light-weight "1985" rolls up, Lehman → Blackstone corners · line path Lehman → Blackstone (left)',
    talk(24.3, extra=g9 + path9 + caption('left Lehman Brothers in', 'late', '1985', bar=True)))

# F9b: balance card $0 (empty bar) + widget tile
add('F9b', 26.3, 'NEW · Balance card "Starting capital $0.00" (left): bar stays empty, ticks CASH/FUNDS/TEAM · tile 01 BILLIONS struck (right)',
    talk(26.3, extra=balance(90, 140, 600, 'Starting capital', '$0.00', '−100%', ['CASH', 'FUNDS', 'TEAM', 'BRAND', 'DEALS'], 2, bank)
    + tile(1340, 220, 330, '01', 'BILLIONS', 1, True) + caption("he didn't have billions of", '', 'dollars')))

# F11: conversion-style curve card (like "Conversion rate 400%")
curve = (f'<svg style="position:absolute;left:0;top:80px" width="520" height="220"><defs><linearGradient id="cv" x1="0" x2="1"><stop offset="0" stop-color="#2E64B0" stop-opacity=".2"/><stop offset=".5" stop-color="{LIME}"/><stop offset="1" stop-color="#2E64B0" stop-opacity=".3"/></linearGradient></defs>'
    f'<path d="M0 170 C 90 150, 140 190, 200 150 S 250 20, 280 20 S 320 140, 360 160 S 460 150, 520 140" fill="none" stroke="url(#cv)" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 8px rgba(230,255,79,.6))"/>'
    f'<circle cx="280" cy="20" r="14" fill="#fff" style="filter:drop-shadow(0 0 14px {LIME}) drop-shadow(0 0 30px {LIME})"/></svg>')
c11 = gcard(1300, 90, 520, 520, corner(40, 36, 'Updated 1985') + ab(370, 26, '<span style="padding:8px 18px;border-radius:999px;background:rgba(243,247,255,.1);font-size:18px;color:rgba(243,247,255,.75)">All time ⌄</span>')
    + curve + ab(0, 320, f'<div style="width:520px;text-align:center"><div style="font-size:26px;color:rgba(243,247,255,.65)">Value</div>{big("Far more", 92)}<div style="font-size:18px;color:rgba(243,247,255,.5);margin-top:6px">than money, empire or team</div></div>'), r=60)
add('F11', 33.75, 'Curve widget (right): line draws, the glowing dot rides to the peak on "valuable", "Far more" fades up · lime key + orbit ring (left)',
    talk(33.75, extra=key + c11 + caption('something that was', 'far more', 'valuable', bar=True)))

# F11b: add ghost words behind the node path (like "seamless integration")
add('F11b', 35.3, 'NEW · Explainer: huge blurred ghost words "strategy" / "powerful" drift behind · lime line path draws Capital → Deals → Returns → Scale, nodes ghost-to-sharp · "powerful" glows',
    world(seed=17) + '<div class="ghostw" style="left:120px;top:40px;font-size:260px">strategy</div><div class="ghostw" style="left:700px;top:560px;font-size:220px">powerful</div>'
    + npath + nn + caption('a strategy so', '', 'powerful', bar=True))

# F12: big panel with neon top-edge streak (like "Build a l") + widgets
panel = (f'<div style="position:absolute;left:330px;top:150px;width:1260px;height:520px;border-radius:90px 90px 40px 40px;background:linear-gradient(180deg,#2457A0,{DEEP} 60%,#0B2350);'
    f'box-shadow:0 40px 100px rgba(0,0,0,.6);overflow:hidden"><div style="position:absolute;left:60px;right:-40px;top:0;height:5px;background:linear-gradient(90deg,rgba(230,255,79,0),{LIME} 20%,#fff 60%,{LIME});box-shadow:0 0 18px {LIME},0 0 40px rgba(230,255,79,.7)"></div>'
    f'<div style="position:absolute;inset:0;background:radial-gradient(80% 60% at 50% 0%,rgba(243,247,255,.18),transparent 60%)"></div></div>'
    + ab(330, 290, f'<div style="width:1260px;text-align:center;font-weight:400;font-size:132px;letter-spacing:-4px;color:{MIST};text-shadow:0 0 24px rgba(243,247,255,.45)">The Strategy</div>')
    + ab(1080, 470, f'<svg width="120" height="120" viewBox="0 0 64 64" style="filter:drop-shadow(0 6px 10px rgba(0,0,0,.4))"><path d="M10 6 L56 30 L34 36 L24 58Z" fill="{MIST}" stroke="rgba(8,24,58,.3)" stroke-width="1.5" stroke-linejoin="round"/></svg>'))
add('F12', 38.2, 'Explainer: big blue panel slides up with a lime neon streak racing along its top edge, "The Strategy" types on, cursor clicks · ghost word "forever" behind · "forever" swings in 3D · short fade',
    world(seed=13, pools=((960, 420, '#1E4C8C'), (300, 200, '#173D70'))) + '<div class="ghostw" style="left:200px;top:640px;font-size:240px">forever</div>' + panel
    + caption('it transformed the financial world', '', 'forever', swing=True))

# number tiles: light-weight gradient numerals
import glob
for f in glob.glob(f'{OUT}/F*.html'):
    h = open(f).read().replace(OLD_CSS, CSS)
    h = h.replace(f'font-weight:700;font-size:{int(330*0.48)}px', f'font-weight:300;font-size:{int(330*0.48)}px')
    open(f, 'w').write(h)
