"""Preview v3 — mock-up frames (overlays on real video stills) for storyboard approval.

Layer order (back → front): footage → grade → hero word BEHIND the head → speaker cut-out
→ glass card (chest zone) → lower-third caption lockup → stickers / sparkles.

Usage: python3 build_frames.py <bg_dir> <fg_dir> <out_dir>
  bg_dir: <t>.jpg stills from the raw video; fg_dir: <t>.png speaker cut-outs (alpha).
"""
import sys, pathlib

BG, FG, OUT = (pathlib.Path(a).resolve() for a in sys.argv[1:4])
OUT.mkdir(parents=True, exist_ok=True)
FONT = (pathlib.Path(__file__).parent / "fonts" / "allura-latin-400-normal.woff2").resolve()

CSS = f"""
@font-face{{font-family:'Allura';src:url('file://{FONT}')}}
*{{margin:0;padding:0;box-sizing:border-box}}
:root{{--ink:#190D32;--deep:#5426A8;--violet:#8050E8;--lilac:#B99AF5;--mist:#EEE7FF;
  --blue:#5B6CFF;--magenta:#C65BF2;--rose:#FF7EC8}}
body{{width:1080px;height:1920px;overflow:hidden;font-family:Inter,sans-serif;color:var(--mist);position:relative;background:#000}}
.L{{position:absolute;inset:0}}
.bg{{background-size:cover;background-position:center}}
.grade{{background:linear-gradient(180deg,rgba(25,13,50,.45) 0%,rgba(25,13,50,0) 18%,rgba(25,13,50,0) 46%,rgba(25,13,50,.75) 66%,rgba(25,13,50,.95) 100%)}}

/* hero word behind the head */
.behind{{position:absolute;left:0;right:0;top:330px;text-align:center}}
.behind .set{{font:300 44px 'Inter Display';letter-spacing:-1.5px;opacity:.9}}
.behind .name{{font:700 168px 'Inter Display';letter-spacing:-9px;line-height:1;margin-top:4px;
  background:linear-gradient(180deg,#FFFFFF 30%,#CFC3F0 75%,#9C8CC9);-webkit-background-clip:text;color:transparent;
  filter:drop-shadow(0 0 30px rgba(128,80,232,.55))}}
.dot{{display:inline-block;width:.16em;height:.16em;border-radius:50%;background:var(--rose);box-shadow:0 0 18px var(--rose);margin-left:.04em}}

/* lower-third caption lockup (light / script / heavy) */
.cap{{position:absolute;left:0;right:0;bottom:270px;text-align:center;z-index:6}}
.cap .l1{{font:300 58px 'Inter Display';letter-spacing:-2px;line-height:1.1;max-width:900px;margin:0 auto;text-shadow:0 2px 18px rgba(25,13,50,.9)}}
.cap .l2{{font:300 58px 'Inter Display';letter-spacing:-2px;line-height:1;margin-top:-6px}}
.cap .s{{font:400 132px 'Allura';letter-spacing:0;color:var(--lilac);filter:drop-shadow(0 0 14px rgba(128,80,232,.8));margin-right:36px;padding:0 6px;position:relative;top:10px}}
.cap .l3{{font:600 156px 'Inter Display';letter-spacing:-7px;line-height:1;margin-top:-4px;
  background:linear-gradient(180deg,#FFFFFF 35%,#D7CCF5 70%,#A898D6);-webkit-background-clip:text;color:transparent;
  filter:drop-shadow(0 4px 20px rgba(25,13,50,.8))}}

/* glass card (chest zone) */
.card{{position:absolute;left:90px;right:90px;top:850px;border-radius:56px;overflow:hidden;z-index:5;
  transform:scale(.8);transform-origin:50% 0;
  background:linear-gradient(180deg,rgba(25,13,50,.55),rgba(25,13,50,.88));
  backdrop-filter:blur(28px) saturate(140%);-webkit-backdrop-filter:blur(28px) saturate(140%);
  border:2px solid rgba(185,154,245,.30);border-bottom-color:rgba(238,231,255,.85);
  box-shadow:0 50px 90px -40px rgba(185,154,245,.9),0 0 90px rgba(128,80,232,.35),0 30px 80px rgba(0,0,0,.45),inset 0 1px 0 rgba(238,231,255,.18)}}
.card:after{{content:'';position:absolute;left:-10%;right:-10%;bottom:0;height:260px;z-index:1;pointer-events:none;
  background:radial-gradient(55% 75% at 50% 112%,#EEE7FF 0%,rgba(185,154,245,.95) 18%,rgba(128,80,232,.7) 42%,rgba(84,38,168,0) 78%)}}
.grid{{position:absolute;inset:0;background-image:linear-gradient(rgba(185,154,245,.07) 2px,transparent 2px),linear-gradient(90deg,rgba(185,154,245,.07) 2px,transparent 2px);
  background-size:60px 60px;-webkit-mask-image:linear-gradient(180deg,transparent,#000 60%)}}
.in{{position:relative;z-index:2;padding:46px 56px 60px}}
.meta{{display:flex;justify-content:space-between;align-items:center;font:500 30px Inter;color:rgba(238,231,255,.6)}}
.chip{{padding:10px 26px;border-radius:999px;background:rgba(185,154,245,.14);border:1.5px solid rgba(185,154,245,.3);color:var(--mist);font:600 28px Inter}}
.chip:before{{content:'';display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--rose);box-shadow:0 0 12px var(--rose);margin-right:14px;vertical-align:2px}}
.num{{font:700 30px 'JetBrains Mono';letter-spacing:2px;background:linear-gradient(90deg,var(--lilac),var(--blue));-webkit-background-clip:text;color:transparent}}
.label{{font:500 32px Inter;color:rgba(238,231,255,.75)}}
.row{{display:flex;align-items:center;gap:26px;font:600 44px Inter;margin:18px 0}}
.star{{width:44px;height:44px;flex:none}}
.bar{{height:26px;border-radius:99px;background:rgba(185,154,245,.15);overflow:hidden;border:1.5px solid rgba(185,154,245,.2)}}
.bar i{{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--deep),var(--violet),var(--magenta));box-shadow:0 0 30px var(--violet)}}
.bar.b i{{background:linear-gradient(90deg,var(--deep),var(--blue),#9FB0FF);box-shadow:0 0 30px var(--blue)}}
.bar.r i{{background:linear-gradient(90deg,var(--deep),var(--magenta),var(--rose));box-shadow:0 0 30px var(--magenta)}}
.white{{background:var(--mist);color:var(--ink);font:800 54px 'Inter Display';text-align:center;padding:30px;border-radius:999px;box-shadow:0 0 50px rgba(185,154,245,.55),0 0 110px rgba(198,91,242,.45)}}
.redact{{height:40px;border-radius:12px;background:linear-gradient(90deg,rgba(185,154,245,.4),rgba(198,91,242,.3),rgba(91,108,255,.25));filter:blur(1px)}}

.plus{{position:absolute;z-index:7}}
.tag{{position:absolute;left:24px;top:24px;font:600 26px 'JetBrains Mono';color:#fff;background:rgba(0,0,0,.55);padding:8px 16px;border-radius:10px;z-index:9}}
"""

def plus(x, y, size, color="#FF7EC8", rot=0):
    return (f'<svg class="plus" style="left:{x}px;top:{y}px;transform:rotate({rot}deg);filter:drop-shadow(0 0 10px {color})" '
            f'width="{size}" height="{size}" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" stroke="{color}" stroke-width="5" stroke-linecap="round"/></svg>')

def star(c="#EEE7FF"):
    return f'<svg class="star" viewBox="0 0 24 24"><path d="M12 0C12.8 7 17 11.2 24 12 17 12.8 12.8 17 12 24 11.2 17 7 12.8 0 12 7 11.2 11.2 7 12 0Z" fill="{c}" style="filter:drop-shadow(0 0 8px {c})"/></svg>'

LOCK = '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#FF7EC8" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="3"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'

def glow_line(path, w, h, dot=None, extra=""):
    d = ""
    if dot:
        d = (f'<circle cx="{dot[0]}" cy="{dot[1]}" r="32" fill="none" stroke="#FF7EC8" stroke-opacity=".55" stroke-width="2.5"/>'
             f'<circle cx="{dot[0]}" cy="{dot[1]}" r="15" fill="#EEE7FF" style="filter:drop-shadow(0 0 18px #B99AF5) drop-shadow(0 0 30px #8050E8)"/>')
    return f'''<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" style="display:block;overflow:visible">
<defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stop-color="#5B6CFF" stop-opacity=".35"/><stop offset=".55" stop-color="#8050E8"/><stop offset="1" stop-color="#B99AF5"/></linearGradient>
<linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8050E8" stop-opacity=".35"/><stop offset="1" stop-color="#8050E8" stop-opacity="0"/></linearGradient></defs>
<path d="{path} L{w} {h} L0 {h} Z" fill="url(#fill)"/>
<path d="{path}" fill="none" stroke="url(#lg)" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 12px #8050E8)"/>{extra}{d}</svg>'''

def cap(l1="", script="", l2="", heavy="", dot=True):
    s = f'<span class="s">{script}</span>' if script else ""
    h = f'<div class="l3">{heavy}{"<span class=dot></span>" if dot else ""}</div>' if heavy else ""
    mid = f'<div class="l2">{s}{l2}</div>' if (s or l2) else ""
    return f'<div class="cap"><div class="l1">{l1}</div>{mid}{h}</div>'

def behind(setup, name):
    return f'<div class="behind" style="z-index:2"><div class="set">{setup}</div><div class="name">{name}<span class="dot"></span></div></div>'

def page(t, body_back="", body_front="", tag="", punch=1.0, insert=False):
    bg = f"url('file://{BG / (t + '.jpg')}')"
    fg = f"url('file://{FG / (t + '.png')}')"
    tf = f"transform:scale({punch});transform-origin:50% 35%;"
    if insert:  # full-frame graphic insert: footage blurred + darkened, no cut-out
        layers = f'<div class="L bg" style="background-image:{bg};{tf}filter:blur(22px) brightness(.45) saturate(1.3)"></div><div class="L grade"></div>'
    else:
        layers = (f'<div class="L bg" style="background-image:{bg};{tf}"></div><div class="L grade"></div>{body_back}'
                  f'<div class="L bg" style="background-image:{fg};{tf}z-index:3;-webkit-mask-image:linear-gradient(180deg,#000 0,#000 44%,transparent 52%)"></div>')
    return f'''<!DOCTYPE html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
{layers}{body_front}<div class="tag">{tag}</div></body></html>'''


# ───────────────────────── full-background explainer scenes ─────────────────────────
XCSS = """
.xbg{position:absolute;inset:0;background:
  radial-gradient(55% 32% at 50% 30%,rgba(128,80,232,.38),transparent 70%),
  radial-gradient(40% 25% at 85% 75%,rgba(198,91,242,.22),transparent 70%),
  radial-gradient(40% 25% at 10% 60%,rgba(91,108,255,.18),transparent 70%),
  linear-gradient(180deg,#120826,#190D32 45%,#0D0620)}
.xgrid{position:absolute;inset:0;background-image:linear-gradient(rgba(185,154,245,.06) 2px,transparent 2px),linear-gradient(90deg,rgba(185,154,245,.06) 2px,transparent 2px);
  background-size:72px 72px;-webkit-mask-image:radial-gradient(70% 55% at 50% 40%,#000,transparent)}
.pt{position:absolute;border-radius:50%;background:#EEE7FF}
.xhead{position:absolute;left:0;right:0;top:150px;text-align:center;z-index:4}
.xhead .k{font:600 30px 'JetBrains Mono';letter-spacing:3px;color:var(--lilac)}
.xhead .t{font:700 112px 'Inter Display';letter-spacing:-5px;line-height:1;margin-top:14px;
  background:linear-gradient(180deg,#FFFFFF 35%,#CFC3F0 75%,#9C8CC9);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 26px rgba(128,80,232,.6))}
.gc{position:absolute;border-radius:48px;overflow:hidden;z-index:4;
  background:linear-gradient(180deg,rgba(40,22,80,.55),rgba(25,13,50,.9));
  border:2px solid rgba(185,154,245,.28);border-bottom-color:rgba(238,231,255,.8);
  box-shadow:0 50px 90px -45px var(--glow,rgba(185,154,245,.9)),0 0 80px rgba(128,80,232,.25),inset 0 1px 0 rgba(238,231,255,.18)}
.gc:after{content:'';position:absolute;left:-10%;right:-10%;bottom:0;height:60%;z-index:0;pointer-events:none;
  background:radial-gradient(55% 60% at 50% 115%,#EEE7FF 0%,var(--g1,#B99AF5) 20%,var(--g2,rgba(128,80,232,.6)) 45%,transparent 80%)}
.gc > *{position:relative;z-index:1}
.ax{font:500 30px Inter;color:rgba(238,231,255,.65)}
.mini{font:600 26px Inter;padding:10px 22px;border-radius:999px;background:rgba(185,154,245,.14);border:1.5px solid rgba(185,154,245,.3)}
"""

import random
def particles(n=26, seed=3):
    r = random.Random(seed); out = []
    for _ in range(n):
        x, y, sz, o = r.randint(30, 1050), r.randint(120, 1300), r.choice([4, 5, 6, 8]), r.uniform(.25, .8)
        c = r.choice(["#EEE7FF", "#B99AF5", "#FF7EC8", "#5B6CFF"])
        out.append(f'<div class="pt" style="left:{x}px;top:{y}px;width:{sz}px;height:{sz}px;opacity:{o:.2f};background:{c};box-shadow:0 0 {sz*3}px {c}"></div>')
    return "".join(out)

def xpage(body, caption, tag, seed=3):
    return f'''<!DOCTYPE html><html><head><meta charset="utf-8"><style>{CSS}{XCSS}</style></head><body>
<div class="xbg"></div><div class="xgrid"></div>{particles(seed=seed)}{body}
<div class="L" style="z-index:5;background:linear-gradient(180deg,transparent 60%,rgba(13,6,32,.85) 78%)"></div>{caption}<div class="tag">{tag}</div></body></html>'''

def xhead(k, t):
    return f'<div class="xhead"><div class="k">{k}</div><div class="t">{t}<span class="dot"></span></div></div>'

ICON = {
 "bars": '<svg viewBox="0 0 64 64" width="120" height="120"><defs><linearGradient id="ib" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5426A8"/><stop offset="1" stop-color="#9FB0FF"/></linearGradient></defs><rect x="6" y="34" width="12" height="24" rx="4" fill="url(#ib)"/><rect x="26" y="22" width="12" height="36" rx="4" fill="url(#ib)"/><rect x="46" y="8" width="12" height="50" rx="4" fill="url(#ib)"/></svg>',
 "bolt": '<svg viewBox="0 0 64 64" width="120" height="120"><defs><linearGradient id="il" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3B6FF"/><stop offset="1" stop-color="#C65BF2"/></linearGradient></defs><path d="M36 4 10 36h18l-4 24 28-34H34z" fill="url(#il)"/></svg>',
 "target": '<svg viewBox="0 0 64 64" width="120" height="120" fill="none"><circle cx="32" cy="32" r="26" stroke="#FF7EC8" stroke-width="6"/><circle cx="32" cy="32" r="14" stroke="#FFB3DD" stroke-width="6"/><circle cx="32" cy="32" r="5" fill="#FFE3F2"/></svg>',
 "wallet": '<svg viewBox="0 0 64 64" width="96" height="96" fill="none" stroke="#EEE7FF" stroke-width="4"><rect x="8" y="16" width="48" height="36" rx="8"/><path d="M40 30h16v12H40a6 6 0 0 1 0-12z"/></svg>',
 "bank": '<svg viewBox="0 0 64 64" width="120" height="120" fill="none" stroke="#EEE7FF" stroke-width="4" stroke-linejoin="round"><path d="M6 24 32 8l26 16z"/><path d="M12 28v20M24 28v20M40 28v20M52 28v20M6 54h52"/></svg>',
}

F = {}

# ── talking head frames ──
F["P01_hook"] = page("1.9", body_front=f'''
<div class="card" style="top:880px;left:200px;right:200px"><div class="grid"></div><div class="in" style="padding:36px 50px 50px">
<div class="meta"><span>Classified</span><span class="chip">4 sites</span></div>
{''.join(f'<div class="row" style="margin:20px 0"><span class="num">0{i}</span>{LOCK}<div class="redact" style="width:{w}px"></div></div>' for i,w in [(1,300),(2,240),(3,330),(4,210)])}
</div></div>
{cap("I should not be giving these", "crypto", "", "websites")}
{plus(110, 1250, 46)}{plus(920, 1380, 64, "#B99AF5", 12)}{plus(150, 1610, 30, "#5B6CFF")}''',
 tag="P01 · 00:01.9 · TALKING HEAD · hook + mini card", punch=1.06)

F["P02_free"] = page("5.8", body_front=f'''
<div class="L" style="z-index:4;box-shadow:inset 0 0 220px rgba(198,91,242,.55)"></div>
<div style="position:absolute;left:720px;top:430px;font-size:120px;transform:rotate(14deg);z-index:6;filter:drop-shadow(0 0 24px rgba(198,91,242,.8))">😤</div>
{plus(250, 470, 40, "#FF7EC8", 20)}
{cap("Other crypto investors are going to be", "mad", "I shared this for", "free")}
{plus(940, 1150, 60, "#B99AF5", -10)}{plus(120, 1600, 34)}''',
 tag="P02 · 00:05.8 · TALKING HEAD · 'mad' sticker + flash")

F["P03_defillama_name"] = page("7.4", body_back=behind("", "DefiLlama"), body_front=f'''
{plus(110, 330, 52)}{plus(930, 520, 40, "#B99AF5", 15)}
{cap("First,", "we have", "", "")}''',
 tag="P03 · 00:07.4 · TALKING HEAD · name behind the head", punch=1.04)

# ── explainer: DefiLlama dashboard ──
CURVE = "M0 330 C90 320 150 300 230 290 S360 210 450 225 S580 120 660 130 S780 60 820 40"
F["P04_defillama_explainer"] = xpage(f'''
{xhead("01 / 04 · DEFI DATA HUB", "DefiLlama")}
<div class="gc" style="left:100px;right:100px;top:440px;height:700px;padding:44px 50px">
 <div style="display:flex;justify-content:space-between;align-items:center"><span class="ax">All of DeFi, one dashboard</span><span class="chip">Live data ▾</span></div>
 <div class="ax" style="position:absolute;left:50px;top:150px">Value</div>
 <svg width="780" height="420" style="position:absolute;left:60px;top:190px;overflow:visible">
  <path d="M10 0 V400 H780" fill="none" stroke="rgba(238,231,255,.45)" stroke-width="2.5" stroke-dasharray="10 10"/>
  <defs><linearGradient id="dl" x1="0" x2="1"><stop offset="0" stop-color="#5B6CFF" stop-opacity=".4"/><stop offset=".6" stop-color="#8050E8"/><stop offset="1" stop-color="#B99AF5"/></linearGradient>
  <linearGradient id="df" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8050E8" stop-opacity=".4"/><stop offset="1" stop-color="#8050E8" stop-opacity="0"/></linearGradient></defs>
  <path d="{CURVE} L820 400 L0 400Z" fill="url(#df)"/>
  <path d="{CURVE}" fill="none" stroke="url(#dl)" stroke-width="8" stroke-linecap="round" style="filter:drop-shadow(0 0 14px #8050E8)"/>
  <circle cx="660" cy="130" r="34" fill="none" stroke="#FF7EC8" stroke-opacity=".6" stroke-width="2.5"/>
  <circle cx="660" cy="130" r="16" fill="#EEE7FF" style="filter:drop-shadow(0 0 18px #B99AF5)"/>
 </svg>
 <div class="ax" style="position:absolute;right:50px;top:560px">Time</div>
 <div style="position:absolute;left:50px;right:50px;bottom:44px;display:flex;gap:18px;justify-content:center">
  <span class="mini">Chains</span><span class="mini">Protocols</span><span class="mini">Yields</span><span class="mini">Stablecoins</span></div>
</div>
{plus(120, 400, 46)}{plus(930, 1150, 36, "#5B6CFF")}''',
 cap("the best website to get", "all", "the", "data"),
 "P04 · 00:09.6 · FULL-BG EXPLAINER · dashboard + value/time axes", seed=4)

# ── explainer: CoinGlass three cards ──
def tri(x, icon, title, sub, g1, g2, glow, op=1):
    return f'''<div class="gc" style="left:{x}px;top:560px;width:290px;height:520px;padding:150px 28px 0;--g1:{g1};--g2:{g2};--glow:{glow};opacity:{op}">
<div style="font:700 40px 'Inter Display';letter-spacing:-1.5px;line-height:1.05">{title}</div>
<div class="ax" style="margin-top:16px;font-size:27px;line-height:1.35">{sub}</div></div>
<div style="position:absolute;left:{x+85}px;top:470px;z-index:6;opacity:{op};filter:drop-shadow(0 0 26px {g1})">{icon}</div>'''
F["P05_coinglass_explainer"] = xpage(f'''
{xhead("02 / 04 · DERIVATIVES DATA", "CoinGlass")}
{tri(60, ICON["bars"], "Open<br>interest", "Open futures positions across exchanges", "#8E9BFF", "rgba(91,108,255,.6)", "rgba(91,108,255,.9)")}
{tri(395, ICON["bolt"], "Liquidations", "Positions force-closed, by price level", "#E7A0FF", "rgba(198,91,242,.6)", "rgba(198,91,242,.9)")}
{tri(730, ICON["target"], "Key<br>data", "Funding rates, long/short ratios &amp; more", "#FFB3DD", "rgba(255,126,200,.55)", "rgba(255,126,200,.9)", op=.3)}
{plus(90, 430, 40)}{plus(960, 1140, 50, "#B99AF5", 20)}''',
 cap("detailed information about", "open interest,", "", "liquidation"),
 "P05 · 00:17.9 · FULL-BG EXPLAINER · 3 cards build on each spoken item", seed=5)

# ── explainer: CryptoQuant flow diagram ──
F["P06_cryptoquant_flows"] = xpage(f'''
{xhead("03 / 04 · ON-CHAIN ANALYTICS", "CryptoQuant")}
<div class="gc" style="left:70px;top:620px;width:280px;height:280px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;--g1:#8E9BFF;--g2:rgba(91,108,255,.5)">
 {ICON["wallet"]}<div style="font:700 40px 'Inter Display';margin-top:10px">Wallets</div></div>
<div class="gc" style="left:690px;top:590px;width:330px;height:340px;display:flex;flex-direction:column;align-items:center;justify-content:center">
 {ICON["bank"]}<div style="font:700 42px 'Inter Display';margin-top:12px">Exchange</div></div>
<svg width="1080" height="600" style="position:absolute;left:0;top:520px;z-index:5;overflow:visible">
 <defs><marker id="ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9FB0FF"/></marker>
 <marker id="ah2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#FF7EC8"/></marker></defs>
 <path d="M360 140 C480 60 560 60 670 120" fill="none" stroke="#5B6CFF" stroke-width="7" marker-end="url(#ah)" style="filter:drop-shadow(0 0 12px #5B6CFF)"/>
 <path d="M680 320 C560 390 480 390 360 330" fill="none" stroke="#FF7EC8" stroke-width="7" marker-end="url(#ah2)" style="filter:drop-shadow(0 0 12px #FF7EC8)"/>
 <circle cx="450" cy="86" r="9" fill="#EEE7FF" style="filter:drop-shadow(0 0 10px #9FB0FF)"/><circle cx="560" cy="78" r="7" fill="#EEE7FF" opacity=".7"/>
 <circle cx="590" cy="372" r="9" fill="#EEE7FF" style="filter:drop-shadow(0 0 10px #FF7EC8)"/><circle cx="470" cy="378" r="7" fill="#EEE7FF" opacity=".7"/>
 <text x="515" y="30" fill="#9FB0FF" font-family="Inter" font-weight="700" font-size="36" text-anchor="middle">INFLOWS</text>
 <text x="520" y="450" fill="#FF7EC8" font-family="Inter" font-weight="700" font-size="36" text-anchor="middle">OUTFLOWS</text>
</svg>
{plus(140, 1010, 40, "#B99AF5")}{plus(900, 450, 44)}''',
 cap("on-chain analytics like", "inflows", "and", "outflows"),
 "P06 · 00:26.2 · FULL-BG EXPLAINER · flow diagram, arrows animate", seed=6)

# ── explainer: CryptoQuant entry / exit chart (ref: growth chart w/ axes) ──
WAVE = "M0 300 C90 290 150 340 240 330 S360 160 450 170 S560 360 640 350 S780 120 880 90"
F["P07_cryptoquant_entry_exit"] = xpage(f'''
{xhead("03 / 04 · CRYPTOQUANT", "Spot the moves")}
<svg width="960" height="560" style="position:absolute;left:60px;top:520px;z-index:4;overflow:visible">
 {''.join(f'<line x1="60" x2="940" y1="{y}" y2="{y}" stroke="rgba(238,231,255,.12)" stroke-width="2"/>' for y in (80,180,280,380))}
 <path d="M60 0 V470 H940" fill="none" stroke="rgba(238,231,255,.45)" stroke-width="2.5" stroke-dasharray="10 10"/>
 <text x="0" y="20" class="ax" fill="rgba(238,231,255,.65)" font-family="Inter" font-size="28">Price</text>
 <text x="940" y="515" fill="rgba(238,231,255,.65)" font-family="Inter" font-size="28" text-anchor="end">Time</text>
 <g transform="translate(60 40)">
  <defs><linearGradient id="wl" x1="0" x2="1"><stop offset="0" stop-color="#5B6CFF"/><stop offset=".5" stop-color="#8050E8"/><stop offset="1" stop-color="#B99AF5"/></linearGradient></defs>
  <rect x="226" y="330" width="28" height="100" fill="url(#wl)" opacity=".18"/><rect x="436" y="170" width="28" height="260" fill="#FF7EC8" opacity=".12"/>
  <path d="{WAVE}" fill="none" stroke="url(#wl)" stroke-width="9" stroke-linecap="round" style="filter:drop-shadow(0 0 16px #8050E8)"/>
  <circle cx="240" cy="330" r="18" fill="#EEE7FF" style="filter:drop-shadow(0 0 16px #5B6CFF)"/>
  <rect x="150" y="372" width="180" height="58" rx="29" fill="#5B6CFF" style="filter:drop-shadow(0 0 16px #5B6CFF)"/><text x="240" y="411" fill="#EEE7FF" font-family="Inter" font-weight="800" font-size="30" text-anchor="middle">ENTRY</text>
  <circle cx="450" cy="170" r="18" fill="#EEE7FF" style="filter:drop-shadow(0 0 16px #FF7EC8)"/>
  <rect x="370" y="78" width="160" height="58" rx="29" fill="#FF7EC8" style="filter:drop-shadow(0 0 16px #FF7EC8)"/><text x="450" y="117" fill="#190D32" font-family="Inter" font-weight="800" font-size="30" text-anchor="middle">EXIT</text>
 </g>
</svg>
{plus(110, 470, 44)}{plus(940, 1120, 40, "#5B6CFF")}''',
 cap("helps investors identify potential", "entry", "and", "exit points"),
 "P07 · 00:30.0 · FULL-BG EXPLAINER · chart draws, ENTRY/EXIT pop on the words", seed=7)

# ── CTA (blurred footage insert) ──
COIN = '''<svg width="170" height="170" viewBox="0 0 100 100" style="display:block;margin:0 auto;filter:drop-shadow(0 0 30px #8050E8)">
<defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B99AF5"/><stop offset=".5" stop-color="#8050E8"/><stop offset="1" stop-color="#C65BF2"/></linearGradient></defs>
<circle cx="50" cy="50" r="46" fill="url(#cg)"/><circle cx="50" cy="50" r="38" fill="none" stroke="#EEE7FF" stroke-opacity=".5" stroke-width="2"/>
<text x="50" y="68" text-anchor="middle" font-family="DejaVu Sans" font-weight="700" font-size="50" fill="#EEE7FF">₿</text></svg>'''
F["P08_cta"] = page("35.6", insert=True, body_front=f'''
<div class="card" style="top:300px;transform:scale(.86)"><div class="grid"></div><div class="in" style="text-align:center;padding-top:60px">
{COIN}
<div class="label" style="margin-top:26px">Want the full website list?</div>
<div class="bar" style="margin:34px 0 12px"><i style="width:75%"></i></div>
<div style="display:flex;justify-content:space-between" class="label"><span>Sites revealed</span><span>3 / 4</span></div>
<div class="white" style="margin-top:40px">Comment “BITCOIN”</div>
</div></div>
{plus(120, 280, 50)}{plus(900, 660, 40, "#B99AF5", 20)}{plus(170, 1080, 30, "#5B6CFF")}
{cap("if you want the full list, just", "comment", "", "Bitcoin")}''',
 tag="P08 · 00:35.6 · FULL-FRAME INSERT · CTA over blurred footage")

# ── explainer: Farside ETF flows ──
def flowbars(seed, colpos, colneg):
    r = random.Random(seed); out = []
    for i in range(12):
        v = r.uniform(-.5, 1)
        h = abs(v) * 150; x = 20 + i * 30
        y = 170 - h if v > 0 else 170
        c = colpos if v > 0 else colneg
        out.append(f'<rect x="{x}" y="{y:.0f}" width="20" height="{h:.0f}" rx="6" fill="{c}" style="filter:drop-shadow(0 0 8px {c})"/>')
    return f'<svg width="380" height="340" style="display:block;margin-top:24px"><line x1="10" x2="380" y1="170" y2="170" stroke="rgba(238,231,255,.4)" stroke-dasharray="8 8" stroke-width="2"/>{"".join(out)}</svg>'
F["P09_farside_explainer"] = xpage(f'''
{xhead("04 / 04 · ETF FLOW TRACKER", "Farside")}
<div class="gc" style="left:70px;top:500px;width:450px;height:620px;padding:40px 34px;--g1:#8E9BFF;--g2:rgba(91,108,255,.55);--glow:rgba(91,108,255,.9)">
 <div style="font:700 46px 'Inter Display';letter-spacing:-1.5px"><span style="color:#8E9BFF">Ξ</span> Ethereum ETFs</div>
 <div class="ax" style="margin-top:6px;font-size:26px">Daily flows · in ▲ / out ▼</div>
 {flowbars(11, "#8E9BFF", "#FF7EC8")}</div>
<div class="gc" style="left:560px;top:500px;width:450px;height:620px;padding:40px 34px;--g1:#FFB3DD;--g2:rgba(255,126,200,.5);--glow:rgba(255,126,200,.9)">
 <div style="font:700 46px 'Inter Display';letter-spacing:-1.5px"><span style="color:#FF7EC8">₿</span> Bitcoin ETFs</div>
 <div class="ax" style="margin-top:6px;font-size:26px">Daily flows · in ▲ / out ▼</div>
 {flowbars(5, "#B99AF5", "#FF7EC8")}</div>
{plus(100, 440, 44)}{plus(950, 1150, 40, "#5B6CFF")}''',
 cap("inflows and outflows into the", "Ethereum", "and", "Bitcoin ETFs"),
 "P09 · 00:43.6 · FULL-BG EXPLAINER · bars grow from the zero line", seed=9)

# ── recap grid (ref: app tiles) ──
def tile(x, y, n, name, what, g1, g2):
    return f'''<div class="gc" style="left:{x}px;top:{y}px;width:440px;height:400px;padding:40px 36px;--g1:{g1};--g2:{g2}">
<div class="num">{n}</div><div style="font:700 62px 'Inter Display';letter-spacing:-2.5px;margin-top:70px">{name}</div>
<div class="ax" style="margin-top:8px">{what}</div></div>'''
F["P10_recap"] = xpage(f'''
{xhead("SAVE THIS", "The list")}
{tile(80, 420, "01", "DefiLlama", "DeFi data", "#B99AF5", "rgba(128,80,232,.6)")}
{tile(560, 420, "02", "CoinGlass", "Derivatives", "#8E9BFF", "rgba(91,108,255,.55)")}
{tile(80, 860, "03", "CryptoQuant", "On-chain", "#E7A0FF", "rgba(198,91,242,.55)")}
{tile(560, 860, "04", "Farside", "ETF flows", "#FFB3DD", "rgba(255,126,200,.5)")}''',
 cap("But before you", "", "", "leave", dot=False).replace('</div></div>', ',</div></div>', 1) if False else cap("But before you", "leave,", "", ""),
 "P10 · 00:44.6 · FULL-BG RECAP · 4 tiles pop, 2 f stagger", seed=10)

for k, v in F.items():
    (OUT / f"{k}.html").write_text(v)
print("\n".join(F))
