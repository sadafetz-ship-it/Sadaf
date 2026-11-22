"""Generate HTML mock-up frames (overlay on real video stills) for storyboard approval.
Usage: python3 build_frames.py <bg_dir> <out_dir>
"""
import sys, pathlib

BG, OUT = pathlib.Path(sys.argv[1]).resolve(), pathlib.Path(sys.argv[2]).resolve()
OUT.mkdir(parents=True, exist_ok=True)

CSS = """
*{margin:0;padding:0;box-sizing:border-box}
:root{--ink:#190D32;--deep:#5426A8;--violet:#8050E8;--lilac:#B99AF5;--mist:#EEE7FF}
body{width:1080px;height:1920px;overflow:hidden;font-family:Inter,sans-serif;color:var(--mist);position:relative;background:#000}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.grade{position:absolute;inset:0;background:
  linear-gradient(180deg,rgba(25,13,50,.55) 0%,rgba(25,13,50,0) 22%,rgba(25,13,50,0) 44%,rgba(25,13,50,.82) 70%,rgba(25,13,50,.94) 100%);}
.hero{position:absolute;left:0;right:0;top:120px;text-align:center}
.setup{font:500 44px Inter;color:var(--mist);opacity:.92;letter-spacing:-.5px;text-shadow:0 2px 20px rgba(25,13,50,.8)}
.big{font:800 118px 'Inter Display';letter-spacing:-4px;line-height:1;margin-top:10px;color:var(--mist);
  text-shadow:0 0 40px rgba(128,80,232,.75),0 4px 30px rgba(25,13,50,.7)}
.big em{font-style:normal;color:var(--lilac)}
.pill{display:inline-block;padding:10px 34px 16px;border-radius:999px;background:linear-gradient(180deg,var(--violet),var(--deep));
  box-shadow:0 0 60px rgba(128,80,232,.7),inset 0 1px 0 rgba(238,231,255,.4)}
.card{position:absolute;left:90px;right:90px;border-radius:56px;overflow:hidden;
  background:linear-gradient(180deg,rgba(25,13,50,.55),rgba(25,13,50,.88));
  backdrop-filter:blur(28px) saturate(140%);-webkit-backdrop-filter:blur(28px) saturate(140%);
  border:2px solid rgba(185,154,245,.30);border-bottom-color:rgba(238,231,255,.85);
  box-shadow:0 50px 90px -40px rgba(185,154,245,.9),0 0 90px rgba(128,80,232,.35),0 30px 80px rgba(0,0,0,.45),inset 0 1px 0 rgba(238,231,255,.18)}
.card:after{content:'';position:absolute;left:-10%;right:-10%;bottom:0;height:300px;z-index:1;
  background:radial-gradient(55% 75% at 50% 112%,#EEE7FF 0%,rgba(185,154,245,.95) 18%,rgba(128,80,232,.7) 42%,rgba(84,38,168,0) 78%);pointer-events:none}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(185,154,245,.07) 2px,transparent 2px),linear-gradient(90deg,rgba(185,154,245,.07) 2px,transparent 2px);
  background-size:60px 60px;-webkit-mask-image:linear-gradient(180deg,transparent,#000 60%);}
.in{position:relative;z-index:2;padding:52px 60px}
.meta{display:flex;justify-content:space-between;align-items:center;font:500 30px Inter;color:rgba(238,231,255,.6)}
.chip{padding:10px 26px;border-radius:999px;background:rgba(185,154,245,.14);border:1.5px solid rgba(185,154,245,.3);color:var(--mist);font:600 28px Inter}
.num{font:700 30px 'JetBrains Mono';color:var(--lilac);letter-spacing:2px}
.title{font:800 92px 'Inter Display';letter-spacing:-3px;margin-top:14px;line-height:1}
.sub{font:500 34px Inter;color:rgba(238,231,255,.7);margin-top:12px}
.kpi{font:800 150px 'Inter Display';letter-spacing:-6px;line-height:1;text-shadow:0 0 50px rgba(128,80,232,.8)}
.label{font:500 32px Inter;color:rgba(238,231,255,.75)}
.row{display:flex;align-items:center;gap:26px;font:600 44px Inter;margin:22px 0}
.star{width:44px;height:44px;flex:none}
.bar{height:26px;border-radius:99px;background:rgba(185,154,245,.15);overflow:hidden;border:1.5px solid rgba(185,154,245,.2)}
.bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--deep),var(--violet),var(--lilac));box-shadow:0 0 30px var(--violet)}
.white{background:var(--mist);color:var(--ink);font:800 56px 'Inter Display';text-align:center;padding:34px;border-radius:999px;box-shadow:0 0 70px rgba(185,154,245,.6)}
.tag{position:absolute;left:24px;bottom:24px;font:600 26px 'JetBrains Mono';color:#fff;background:rgba(0,0,0,.55);padding:8px 16px;border-radius:10px;z-index:9}
.redact{height:44px;border-radius:12px;background:linear-gradient(90deg,rgba(185,154,245,.35),rgba(128,80,232,.25));filter:blur(1px)}
"""

STAR = '<svg class="star" viewBox="0 0 24 24"><path d="M12 0C12.8 7 17 11.2 24 12 17 12.8 12.8 17 12 24 11.2 17 7 12.8 0 12 7 11.2 11.2 7 12 0Z" fill="#EEE7FF" style="filter:drop-shadow(0 0 6px #B99AF5)"/></svg>'
LOCK = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B99AF5" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="3"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'

def glow_line(path, w, h, dot=None, extra=""):
    d = f'<circle cx="{dot[0]}" cy="{dot[1]}" r="16" fill="#EEE7FF" style="filter:drop-shadow(0 0 18px #B99AF5) drop-shadow(0 0 30px #8050E8)"/>' if dot else ''
    return f'''<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" style="display:block;overflow:visible">
<defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stop-color="#5426A8" stop-opacity=".3"/><stop offset=".6" stop-color="#8050E8"/><stop offset="1" stop-color="#B99AF5"/></linearGradient>
<linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8050E8" stop-opacity=".35"/><stop offset="1" stop-color="#8050E8" stop-opacity="0"/></linearGradient></defs>
<path d="{path} L{w} {h} L0 {h} Z" fill="url(#fill)"/>
<path d="{path}" fill="none" stroke="url(#lg)" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 12px #8050E8)"/>{extra}{d}</svg>'''

def page(bg, body, tag):
    return f'''<!DOCTYPE html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="bg" style="background-image:url('file://{BG / bg}')"></div><div class="grade"></div>{body}<div class="tag">{tag}</div></body></html>'''

F = {}

F["F1_hook"] = page("1.9.jpg", f'''
<div class="hero"><div class="setup">I should <b style="color:#B99AF5">NOT</b> be giving these</div>
<div class="big">crypto <em>websites</em></div><div class="setup" style="margin-top:12px">away.</div></div>
<div class="card" style="top:1080px;height:560px"><div class="grid"></div><div class="in">
<div class="meta"><span>Classified · do not share</span><span class="chip">4 sites</span></div>
{''.join(f'<div class="row" style="margin:30px 0"><span class="num">0{i}</span>{LOCK}<div class="redact" style="width:{w}px"></div></div>' for i,w in [(1,420),(2,340),(3,470),(4,300)])}
</div></div>''', "00:01.9 · HOOK")

F["F2_free"] = page("5.6.jpg", f'''
<div class="hero"><div class="setup">Other crypto investors are going to be <b style="color:#B99AF5">mad</b></div>
<div class="setup" style="margin-top:6px">I shared this for</div>
<div class="big" style="margin-top:22px"><span class="pill">FREE</span></div></div>
<div class="card" style="top:1080px;height:560px"><div class="grid"></div><div class="in">
<div class="meta"><span>Unlocking the list…</span><span class="chip">0 / 4</span></div>
{''.join(f'<div class="row" style="margin:30px 0;opacity:{o}"><span class="num">0{i}</span>{LOCK}<div class="redact" style="width:{w}px"></div></div>' for i,w,o in [(1,420,1),(2,340,.55),(3,470,.4),(4,300,.3)])}
</div></div>''', "00:05.6 · FREE")

F["F3_defillama"] = page("9.0.jpg", f'''
<div class="hero"><div class="setup">First, we have</div><div class="big">Defi<em>Llama</em></div></div>
<div class="card" style="top:1000px;height:680px"><div class="grid"></div><div class="in">
<div class="meta"><span class="num">01 / 04</span><span class="chip">DeFi data ▾</span></div>
<div style="margin:30px -60px 0">{glow_line("M0 250 C120 240 200 210 300 200 S420 120 520 140 S640 60 740 70 S860 40 900 30", 900, 280, dot=(740,70))}</div>
<div style="text-align:center;margin-top:-10px"><div class="label">All the data you need in</div><div class="kpi" style="font-size:110px">DeFi</div></div>
</div></div>''', "00:09.0 · SITE 1")

F["F4_coinglass"] = page("18.6.jpg", f'''
<div class="hero"><div class="setup">Second, we have</div><div class="big">Coin<em>Glass</em></div></div>
<div class="card" style="top:1000px;height:680px"><div class="grid"></div><div class="in">
<div class="meta"><span class="num">02 / 04</span><span class="chip">Derivatives</span></div>
<div style="font:700 50px 'Inter Display';margin-top:34px">Clear, detailed data</div>
<div style="height:3px;margin:22px 0 10px;background:linear-gradient(90deg,#8050E8,#B99AF5,transparent);box-shadow:0 0 16px #8050E8"></div>
<div class="row">{STAR}Open interest</div>
<div class="row">{STAR}Liquidations</div>
<div class="row" style="opacity:.35">{STAR}Super important data</div>
</div></div>''', "00:18.6 · SITE 2 (list ticks on each word)")

F["F5_cryptoquant"] = page("29.6.jpg", f'''
<div class="hero"><div class="setup">Third, we have</div><div class="big">Crypto<em>Quant</em></div></div>
<div class="card" style="top:1000px;height:680px"><div class="grid"></div><div class="in">
<div class="meta"><span class="num">03 / 04</span><span class="chip">On-chain</span></div>
<div style="margin:40px -60px 0">{glow_line("M0 200 C100 190 160 240 260 230 S380 110 460 120 S560 250 640 240 S760 80 900 60", 900, 280,
 extra='<g font-family="Inter" font-weight="700" font-size="26"><circle cx="262" cy="230" r="13" fill="#EEE7FF" style="filter:drop-shadow(0 0 14px #B99AF5)"/><rect x="190" y="160" width="146" height="44" rx="22" fill="#5426A8"/><text x="263" y="190" fill="#EEE7FF" text-anchor="middle">ENTRY</text><circle cx="462" cy="120" r="13" fill="#EEE7FF" style="filter:drop-shadow(0 0 14px #B99AF5)"/><rect x="398" y="50" width="128" height="44" rx="22" fill="#EEE7FF"/><text x="462" y="80" fill="#190D32" text-anchor="middle">EXIT</text></g>')}</div>
<div style="display:flex;gap:30px;margin-top:30px"><div style="flex:1"><div class="label">↘ Exchange inflows</div><div class="bar" style="margin-top:14px"><i style="width:72%"></i></div></div>
<div style="flex:1"><div class="label">↗ Exchange outflows</div><div class="bar" style="margin-top:14px"><i style="width:44%"></i></div></div></div>
</div></div>''', "00:29.6 · SITE 3 (entry / exit points)")

F["F6_cta"] = page("35.2.jpg", f'''
<div class="hero"><div class="setup">Want the</div><div class="big">full <em>list?</em></div></div>
<div class="card" style="top:1060px;height:600px;text-align:center"><div class="in" style="padding-top:60px">
<div class="label">Unlock every website</div>
<div style="font:800 70px 'Inter Display';letter-spacing:-2px;margin-top:10px">Comment below</div>
<div class="bar" style="margin:44px 0 14px"><i style="width:75%"></i></div>
<div style="display:flex;justify-content:space-between" class="label"><span>Sites revealed</span><span>3 / 4</span></div>
<div class="white" style="margin-top:44px">Comment “BITCOIN”</div>
</div></div>''', "00:35.2 · CTA")

F["F7_farside"] = page("42.6.jpg", f'''
<div class="hero"><div class="setup">And lastly,</div><div class="big">Far<em>side</em></div></div>
<div class="card" style="top:1000px;height:680px"><div class="grid"></div><div class="in">
<div class="meta"><span class="num">04 / 04</span><span class="chip">ETF flows ▾</span></div>
<div style="margin:24px -60px 0">{glow_line("M0 250 C200 248 380 230 520 180 S760 50 900 20", 900, 260, dot=(900,20))}</div>
<div style="margin-top:10px"><div style="display:flex;justify-content:space-between" class="label"><span>₿ Bitcoin ETFs</span><span style="color:#EEE7FF">Inflows</span></div><div class="bar" style="margin:12px 0 26px"><i style="width:82%"></i></div>
<div style="display:flex;justify-content:space-between" class="label"><span>Ξ Ethereum ETFs</span><span style="color:#EEE7FF">Inflows</span></div><div class="bar" style="margin-top:12px"><i style="width:54%"></i></div></div>
</div></div>''', "00:42.6 · SITE 4")

for k, v in F.items():
    (OUT / f"{k}.html").write_text(v)
print("\n".join(F))
