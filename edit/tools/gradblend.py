#!/usr/bin/env python3
"""Gradient blends: yellow flows into a second/third hue inside each element (titles, pill, heavy words, bars, card borders, glows).
Uses recolor.py token mapping for base colours, then injects gradient CSS overrides."""
import sys, re, importlib.util
W = sys.argv[1]
spec = importlib.util.spec_from_file_location('rc', f'{W}/tools/recolor_lib.py'); rc = importlib.util.module_from_spec(spec); spec.loader.exec_module(rc)
B = {
 'sunset': dict(c=('#FFD000', '#FF9A3C', '#FF4D8D'), base=dict(ink='#170A12', deep='#7A1E4A', main='#FFD000', light='#FFE866', mist='#FFFBEA', sec='#FF4D8D', dot='#FF7A59', title='#FFD000', sec2='#FF9A3C', pale='#FFD9A0', cream='#FFFBEA', d0='#0B0408', d1='#22101C', d2='#34142A', d3='#4A1C3A')),
 'citrus': dict(c=('#FFD000', '#B9F03C', '#2FD3C9'), base=dict(ink='#061716', deep='#0E5C5A', main='#FFD000', light='#FFE866', mist='#FFFBEA', sec='#2FD3C9', dot='#7FE38A', title='#FFD000', sec2='#B9F03C', pale='#E6FF9E', cream='#FFFBEA', d0='#020C0C', d1='#0A2626', d2='#0D3634', d3='#125250')),
 'goldsky': dict(c=('#FFD000', '#FFF1B0', '#6FB8FF'), base=dict(ink='#071226', deep='#1E4FBF', main='#FFD000', light='#FFE866', mist='#FFFBEA', sec='#6FB8FF', dot='#9CCBFF', title='#FFD000', sec2='#3D8BFF', pale='#CFE6FF', cream='#FFFBEA', d0='#030810', d1='#0A1A33', d2='#0F2A55', d3='#163A73')),
}
def rgba(h, a): h = h.lstrip('#'); return f'rgba({int(h[0:2],16)},{int(h[2:4],16)},{int(h[4:6],16)},{a})'
def css(c0, c1, c2, b):
    return f"""
.ttl{{background:linear-gradient(100deg,{c0} 0%,{c0} 42%,{c1} 74%,{c2} 100%);-webkit-background-clip:text;background-clip:text;color:transparent!important}}
.pill{{background:linear-gradient(90deg,#FFF2A6 0%,{c0} 32%,{c1} 76%,{c2} 100%)!important;box-shadow:inset 0 0 0 2px rgba(255,255,255,.5),0 0 22px {rgba(c0,.55)},0 0 50px {rgba(c2,.45)}!important}}
.heavy{{background:linear-gradient(90deg,#FFFFFF 0%,#FFF6CC 28%,{c0} 68%,{c1} 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;
  filter:drop-shadow(0 0 8px {rgba(c1,.35)}) drop-shadow(0 2px 14px rgba(0,0,0,.35))!important}}
.hbar{{background:linear-gradient(90deg,{c0},{c1} 60%,{c2})!important;box-shadow:0 0 18px {rgba(c1,.7)}!important}}
.dot{{background:linear-gradient(135deg,{c0},{c2})!important;box-shadow:0 0 12px {c1}!important}}
.glass{{border-color:transparent!important;background:linear-gradient(180deg,{rgba(b['d2'],.93)},{rgba(b['ink'],.94)} 70%,{rgba(b['d3'],.95)}) padding-box,linear-gradient(125deg,{c0},{c1} 55%,{c2}) border-box!important;
  box-shadow:0 30px 60px rgba(0,0,0,.45),0 18px 40px -10px {rgba(c1,.6)},inset 0 -3px 0 {rgba(c0,.7)},inset 0 -40px 60px -30px {rgba(c2,.5)}!important}}
.chip{{background:linear-gradient(90deg,{rgba(c0,.28)},{rgba(c2,.28)})!important;border-color:{rgba(c1,.8)}!important}}
.cdot{{background:linear-gradient(135deg,{c0},{c2})!important}}
.ink{{background:linear-gradient({c0},{c2})!important}}
.sq{{border-image:linear-gradient(135deg,{c0},{c2}) 1!important}}
.tint{{background:linear-gradient(160deg,{rgba(c0,.10)},{rgba(c2,.12)})!important}}
"""
names = sys.argv[2].split(','); frames = sys.argv[3:]
for n in frames:
    src = open(f'{W}/frames/{n}.html').read()
    for name in names:
        b = B[name]; s = rc.apply(src, b['base'])
        # pixel clusters: cycle gradient stops so clusters blend across the hues
        cyc = iter([b['c'][0], b['c'][1], b['c'][0], b['c'][2], '#FFE866'] * 400)
        s = re.sub(r'(class="px" style="[^"]*?background:)(#[0-9A-Fa-f]{6})(;[^"]*?box-shadow:0 0 \d+px )(#[0-9A-Fa-f]{6})', lambda m: (lambda c: f'{m.group(1)}{c}{m.group(3)}{c}')(next(cyc)), s)
        c0, c1, c2 = b['c']; diag = f'linear-gradient(135deg,#FFF2A6,{c0} 38%,{c1} 74%,{c2})'
        s = s.replace('linear-gradient(180deg,#FFFBEA,#FFE866 70%,#FFD000)', diag)          # product-card top
        s = s.replace('linear-gradient(180deg,#FFE866,#FFD000)', diag)                      # buttons / pill tiles
        s = s.replace(f"linear-gradient(0deg,{b['base']['deep']},#FFD000 45%,#FFE866 80%,{b['base']['dot']})", f'linear-gradient(0deg,{c2},{c1} 28%,{c0} 58%,#FFF2A6)')  # meter bars
        s = s.replace('id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFBEA"/><stop offset=".5" stop-color="#FFE866"/><stop offset="1" stop-color="#FFD000"/>',
                      f'id="wg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{c2}"/><stop offset=".3" stop-color="{c1}"/><stop offset=".5" stop-color="{c0}"/><stop offset=".7" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/>')
        s = s.replace('<path d="M540 300 C 980 300 1010 1340 540 1300 C 70 1260 90 300 540 300" fill="none" stroke="#FFFBEA"',
                      f'<defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".4" stop-color="{c0}"/><stop offset=".75" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient></defs><path d="M540 300 C 980 300 1010 1340 540 1300 C 70 1260 90 300 540 300" fill="none" stroke="url(#rg)"')
        s = s.replace('<div class="grid"></div>', f'<div class="pool" style="left:180px;top:1300px;width:620px;height:520px;background:{rgba(c2,.40)}"></div><div class="grid"></div>')
        s = s.replace('</style>', css(c0, c1, c2, b['base']) + '</style>')
        open(f'{W}/frames/{n}_g{name}.html', 'w').write(s)
print('ok')
