import sys, os
T = sys.argv[1]; CUT = f'file://{T}/cut'
INK, DEEP, LIME, MIST = '#08183A', '#173D70', '#E6FF4F', '#F3F7FF'
CSS = f"""*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1280px;height:720px;overflow:hidden;font-family:'Inter Display','Inter',sans-serif;color:{MIST};background:#040A1C}}
.bg{{position:absolute;inset:0;background:radial-gradient(60% 80% at 72% 40%,rgba(46,100,176,.75),transparent 70%),radial-gradient(50% 60% at 20% 90%,rgba(23,61,112,.8),transparent 70%),linear-gradient(180deg,#0A1C44,#040A1C)}}
.grid{{position:absolute;inset:0;background-image:linear-gradient(rgba(243,247,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(243,247,255,.06) 1px,transparent 1px);background-size:48px 48px;-webkit-mask:radial-gradient(70% 70% at 60% 45%,#000,transparent)}}
.halo{{position:absolute;border-radius:50%;filter:blur(40px)}}
.person{{position:absolute;filter:drop-shadow(0 0 1.5px rgba(243,247,255,.8)) drop-shadow(0 0 12px rgba(230,255,79,.45))}}
.big{{font-weight:900;letter-spacing:-.045em;line-height:.86}}
.lime{{color:{LIME};text-shadow:0 0 24px rgba(230,255,79,.55),0 6px 0 rgba(8,24,58,.9)}}
.mist{{color:{MIST};text-shadow:0 6px 0 rgba(8,24,58,.9),0 0 30px rgba(8,24,58,.8)}}
.glass{{position:absolute;border-radius:28px;background:radial-gradient(130% 70% at 50% 118%,rgba(230,255,79,.42),rgba(46,100,176,.3) 42%,rgba(8,24,58,0) 72%),linear-gradient(180deg,#081533,#040A1C);
  border:1.5px solid rgba(243,247,255,.15);box-shadow:inset 0 -2px 0 rgba(230,255,79,.95),inset 0 -40px 50px -26px rgba(230,255,79,.6),0 24px 50px rgba(0,0,0,.55)}}
.bar{{position:absolute;height:.24em;border-radius:6px;background:linear-gradient(90deg,{DEEP},{LIME} 60%,#F8FFC9);box-shadow:0 0 22px rgba(230,255,79,.6);z-index:-1}}
.vig{{position:absolute;inset:0;background:radial-gradient(90% 90% at 50% 45%,transparent 60%,rgba(2,6,18,.7))}}"""
def page(body): return f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}<div class="vig"></div></body></html>'
def person(t, s, left, top, side='left'):
    scrim = ('linear-gradient(90deg,rgba(4,10,28,.92) 0%,rgba(4,10,28,.78) 34%,rgba(4,10,28,.0) 62%)' if side == 'left'
             else 'linear-gradient(270deg,rgba(4,10,28,.92) 0%,rgba(4,10,28,.78) 34%,rgba(4,10,28,.0) 62%)')
    return (f'<img src="{CUT}/full_{t}.png" style="position:absolute;width:{1920*s}px;left:{left}px;top:{top}px;filter:brightness(.82) contrast(1.08) saturate(.95)">'
            f'<div style="position:absolute;inset:0;background:#173D70;mix-blend-mode:color;opacity:.14"></div>'
            f'<div style="position:absolute;inset:0;background:{scrim}"></div>'
            f'<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,10,28,.35),transparent 25%,transparent 70%,rgba(4,10,28,.55))"></div>'
            f'<img class="person" src="{CUT}/cut_{t}.png" style="width:{1920*s}px;left:{left}px;top:{top}px">')
out = {}
# A — THE $1T PLAYBOOK (face right, intense)
out['A_trillion_playbook'] = page(f'''{person('24.0', 1.0, 0, -60)}
<div style="position:absolute;left:48px;top:86px;width:560px">
  <div class="big lime" style="font-size:176px">$1T</div>
  <div class="big mist" style="font-size:108px;margin-top:6px;position:relative;display:inline-block">PLAYBOOK<span class="bar" style="left:-6px;right:-6px;bottom:.06em"></span></div>
  <div style="margin-top:30px;display:flex;width:max-content;align-items:center;gap:12px;padding:12px 24px;border-radius:999px;background:#03081A;border:3px solid {LIME};box-shadow:0 0 18px rgba(230,255,79,.7),0 0 50px rgba(46,100,176,.6);font-weight:700;font-size:34px">They hid it in <span class="lime" style="text-shadow:0 0 14px rgba(230,255,79,.8)">plain sight</span></div>
</div>''')
# B — $0 → $1T (fist, balance widget)
curve = f'''<svg width="420" height="120" style="position:absolute;left:36px;top:62px;overflow:visible"><path d="M0 110 C 90 106, 150 100, 210 78 S 330 22, 410 8" fill="none" stroke="{LIME}" stroke-width="9" stroke-linecap="round" style="filter:drop-shadow(0 0 10px {LIME})"/>
<circle cx="410" cy="8" r="15" fill="#fff" style="filter:drop-shadow(0 0 14px {LIME}) drop-shadow(0 0 30px {LIME})"/></svg>'''
out['B_zero_to_trillion'] = page(f'''{person('22.0', 1.0, -380, -70, 'right')}
<div style="position:absolute;right:46px;top:70px;text-align:right">
  <div class="big mist" style="font-size:150px">$0 <span class="lime">→</span></div>
  <div class="big lime" style="font-size:190px">$1T</div>
</div>
<div class="glass" style="right:46px;top:470px;width:490px;height:200px">
  <div style="position:absolute;left:30px;top:22px;font-size:22px;color:rgba(243,247,255,.65)">Blackstone · since 1985</div>{curve}
</div>''')
# C — THEY HID THIS (shouting, neon corner frame)
out['C_they_hid_this'] = page(f'''<div style="position:absolute;left:40px;top:60px;width:700px;height:560px;border-top:5px solid {LIME};border-left:5px solid {LIME};border-top-left-radius:70px;box-shadow:-6px -6px 26px -6px rgba(230,255,79,.85);
  background:radial-gradient(120% 90% at 0% 0%,rgba(46,100,176,.45),rgba(4,10,28,.2) 60%);-webkit-mask:linear-gradient(90deg,#000 70%,transparent),linear-gradient(180deg,#000 72%,transparent);-webkit-mask-composite:source-in"></div>
{person('8.8', 1.0, 0, -70)}
<div style="position:absolute;left:84px;top:110px">
  <div style="font-weight:300;font-size:44px;letter-spacing:8px;color:{MIST};opacity:.85">CLASSIFIED</div>
  <div class="big mist" style="font-size:150px;margin-top:14px">THEY</div>
  <div class="big lime" style="font-size:150px">HID</div>
  <div class="big mist" style="font-size:150px;position:relative;display:inline-block">THIS<span class="bar" style="left:-6px;right:-6px;bottom:.06em"></span></div>
</div>''')
for k, v in out.items(): open(f'{T}/{k}.html', 'w').write(v)
print(' '.join(out))
