"""Reels covers (1080x1920) in the house style. Text stays inside the 4:5 grid crop (y 285-1635) and mostly the 1:1 crop.
Usage: python3 build_thumbs.py BG.png FG.png OUTDIR"""
import sys, pathlib
bg, fg, out = (pathlib.Path(a).resolve() for a in sys.argv[1:4]); out.mkdir(parents=True, exist_ok=True)
FONT = (pathlib.Path(__file__).parent.parent / 'preview' / 'fonts' / 'allura-latin-400-normal.woff2').resolve()
BASE = f"""
@font-face{{font-family:'Allura';src:url('file://{FONT}')}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1080px;height:1920px;overflow:hidden;position:relative;background:#0D0620;font-family:Inter,sans-serif;color:#EEE7FF}}
.L{{position:absolute;inset:0}}
.bg{{background:url('file://{bg}') center/cover;filter:blur(10px) brightness(.55) saturate(1.3);transform:scale(1.08)}}
.fg{{background:url('file://{fg}') center/cover}}
.grade{{background:linear-gradient(180deg,rgba(13,6,32,.35) 0%,rgba(13,6,32,0) 30%,rgba(13,6,32,0) 55%,rgba(25,13,50,.9) 78%,#0D0620 100%)}}
.glow{{filter:drop-shadow(0 0 10px rgba(238,231,255,.5)) drop-shadow(0 0 30px #B99AF5) drop-shadow(0 0 70px rgba(128,80,232,.9))}}
.fill{{background:linear-gradient(180deg,#FFFFFF 20%,#E6DAFF 55%,#B99AF5 100%);-webkit-background-clip:text;color:transparent}}
.dot{{display:inline-block;width:.15em;height:.15em;border-radius:50%;background:#FF7EC8;box-shadow:0 0 18px #FF7EC8;margin-left:.03em}}
.px{{position:absolute;border-radius:6px}}
.tile{{width:200px;height:200px;border-radius:44px;background:radial-gradient(80% 80% at 50% 30%,#3A2380,#1E1046 60%,#0D0620);
  border:3px solid #B99AF5;box-shadow:0 0 30px rgba(185,154,245,.7),0 0 70px rgba(128,80,232,.6);display:flex;align-items:center;justify-content:center;
  font:800 120px 'Inter Display';color:#EEE7FF;text-shadow:0 0 24px #B99AF5}}
.lock{{position:absolute;right:-18px;top:-18px;width:66px;height:66px;border-radius:50%;background:#FF7EC8;display:flex;align-items:center;justify-content:center;box-shadow:0 0 22px #FF7EC8}}
"""
LOCK = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#190D32" stroke-width="2.6"><rect x="4" y="11" width="16" height="10" rx="3"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
def pixels(seed, cx, cy, w, h):
    import random; r = random.Random(seed); cells = []
    cols = ['#8050E8', '#B99AF5', '#C65BF2', '#D8C4FF', '#5426A8']
    for ax, ay in [(-0.05, -0.3), (0.95, -0.35), (1.02, 0.8), (-0.06, 1.0), (0.5, 1.15)]:
        for cx_, cy_ in r.choice([[(0,0),(1,0),(1,1)], [(0,0),(0,1),(1,1),(1,2)], [(0,0),(1,0),(2,0),(2,1)]]):
            c = r.choice(cols); x = cx - w / 2 + ax * w + cx_ * 34; y = cy - h / 2 + ay * h + cy_ * 34
            cells.append(f'<div class="px" style="left:{x}px;top:{y}px;width:32px;height:32px;background:{c};box-shadow:0 0 14px {c};opacity:{r.uniform(.6,1):.2f}"></div>')
    return ''.join(cells)
def page(body): return f'<!DOCTYPE html><html><head><meta charset="utf-8"><style>{BASE}</style></head><body>{body}</body></html>'

# A — "4 crypto sites" behind the head + locked number tiles
A = page(f'''<div class="L bg"></div>
<div style="position:absolute;left:0;right:0;top:330;text-align:center;z-index:2" class="L">
  <div style="position:absolute;left:0;right:0;top:330px;text-align:center">
    <div style="font:600 70px 'Inter Display';letter-spacing:-2px;color:#EEE7FF;text-shadow:0 4px 20px rgba(13,6,32,.8)">4 crypto websites</div>
    <div class="glow" style="font:800 270px 'Inter Display';letter-spacing:-12px;line-height:.9;margin-top:6px"><span class="fill">SECRET</span></div>
  </div>
</div>
<div class="L fg" style="z-index:3;-webkit-mask-image:linear-gradient(180deg,#000 62%,transparent 80%)"></div>
<div class="L grade" style="z-index:4"></div>
{pixels(3, 540, 560, 1000, 300).replace('class="px"','class="px" style="z-index:5" ')}
<div style="position:absolute;left:0;right:0;top:1210px;text-align:center;z-index:6">
  <div style="font:300 64px 'Inter Display';letter-spacing:-2px">I shouldn't be</div>
  <div class="glow" style="font:400 150px Allura;color:#EEE7FF;line-height:.8;margin-top:4px">sharing</div>
  <div class="glow" style="font:700 160px 'Inter Display';letter-spacing:-7px;line-height:1"><span class="fill">these</span><span class="dot"></span></div>
</div>
''')
# B — locked number tiles row
tiles = ''.join(f'<div style="position:relative"><div class="tile">{n}</div><div class="lock">{LOCK}</div></div>' for n in range(1, 5))
B = page(f'''<div class="L bg"></div>
<div class="L fg" style="z-index:3;-webkit-mask-image:linear-gradient(180deg,#000 58%,transparent 76%)"></div>
<div class="L grade" style="z-index:4"></div>
<div style="position:absolute;left:0;right:0;top:330px;text-align:center;z-index:2">
  <div class="glow" style="font:800 250px 'Inter Display';letter-spacing:-12px;line-height:.9"><span class="fill">CRYPTO</span></div>
</div>
<div style="position:absolute;left:0;right:0;top:1010px;display:flex;justify-content:center;gap:34px;z-index:6;transform:rotate(-3deg)">{tiles}</div>
<div style="position:absolute;left:0;right:0;top:1270px;text-align:center;z-index:6">
  <div style="font:300 62px 'Inter Display';letter-spacing:-2px">websites they don't</div>
  <div class="glow" style="font:400 140px Allura;color:#EEE7FF;line-height:.85">want you</div>
  <div class="glow" style="font:700 140px 'Inter Display';letter-spacing:-6px;line-height:1"><span class="fill">to know</span><span class="dot"></span></div>
</div>
''')
for k, v in {'A': A, 'B': B}.items(): (out / f'cover_{k}.html').write_text(v)
print('ok')
