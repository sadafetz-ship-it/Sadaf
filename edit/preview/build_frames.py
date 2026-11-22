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
.cap{{position:absolute;left:0;right:0;bottom:280px;text-align:center;z-index:6}}
.cap .l1{{font:300 46px 'Inter Display';letter-spacing:-1.6px;line-height:1.1;text-shadow:0 2px 18px rgba(25,13,50,.9)}}
.cap .l2{{font:300 46px 'Inter Display';letter-spacing:-1.6px;line-height:1;margin-top:-6px}}
.cap .s{{font:400 104px 'Allura';letter-spacing:0;color:var(--lilac);filter:drop-shadow(0 0 14px rgba(128,80,232,.8));margin-right:26px;padding:0 6px;position:relative;top:10px}}
.cap .l3{{font:600 124px 'Inter Display';letter-spacing:-6px;line-height:1;margin-top:-4px;
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

F = {}

# P1 — HOOK (caption + mini "classified" card). punch-in 106 %
F["P1_hook"] = page("1.9", body_front=f'''
<div class="card" style="top:880px;left:200px;right:200px"><div class="grid"></div><div class="in" style="padding:36px 50px 50px">
<div class="meta"><span>Classified</span><span class="chip">4 sites</span></div>
{''.join(f'<div class="row" style="margin:20px 0"><span class="num">0{i}</span>{LOCK}<div class="redact" style="width:{w}px"></div></div>' for i,w in [(1,300),(2,240),(3,330),(4,210)])}
</div></div>
{cap("I should not be giving these", "crypto", "", "websites")}
{plus(150, 1330, 46)}{plus(880, 1450, 64, "#B99AF5", 12)}{plus(210, 1600, 30, "#5B6CFF")}''',
 tag="P1 · 00:01.9 · HOOK · caption + mini card · punch-in 106%", punch=1.06)

# P2 — MAD / FREE (caption + concrete-noun sticker + magenta edge flash)
F["P2_free"] = page("5.8", body_front=f'''
<div class="L" style="z-index:4;box-shadow:inset 0 0 220px rgba(198,91,242,.55)"></div>
<div style="position:absolute;left:720px;top:430px;font-size:120px;transform:rotate(14deg);z-index:6;filter:drop-shadow(0 0 24px rgba(198,91,242,.8))">😤</div>
{plus(250, 470, 40, "#FF7EC8", 20)}
{cap("Other crypto investors are going to be", "mad", "I shared this for", "free")}
{plus(860, 1420, 60, "#B99AF5", -10)}{plus(170, 1560, 34)}''',
 tag="P2 · 00:05.8 · 'mad' → 😤 + magenta edge flash")

# P3 — SITE 1 NAME (hero word behind the head)
F["P3_defillama_name"] = page("7.4", body_back=behind("", "DefiLlama"), body_front=f'''
{plus(110, 300, 52)}{plus(930, 470, 40, "#B99AF5", 15)}
{cap("First,", "we have", "", "")}''',
 tag="P3 · 00:07.4 · site name BEHIND the head · punch-in 104%", punch=1.04)

# P4 — SITE 1 DATA (card + caption)
F["P4_defillama_card"] = page("9.6", body_front=f'''
<div class="card"><div class="grid"></div><div class="in">
<div class="meta"><span class="num">01 / 04</span><span class="chip">DefiLlama</span></div>
<div style="margin:26px -56px 0">{glow_line("M0 200 C120 192 200 168 300 160 S420 96 520 112 S640 48 740 56 S860 32 900 24", 900, 220, dot=(740,56))}</div>
<div class="label" style="text-align:center;margin-top:16px">The DeFi ecosystem, in one dashboard</div>
</div></div>
{cap("the best website to get", "all", "the", "data")}
{plus(880, 1390, 50, "#B99AF5", 10)}''',
 tag="P4 · 00:09.6 · card + caption")

# P5 — SITE 2 (checklist card + caption)
F["P5_coinglass"] = page("17.9", body_front=f'''
<div class="card"><div class="grid"></div><div class="in">
<div class="meta"><span class="num">02 / 04</span><span class="chip">CoinGlass</span></div>
<div style="height:3px;margin:30px 0 8px;background:linear-gradient(90deg,#5B6CFF,#8050E8,#C65BF2,transparent);box-shadow:0 0 16px #8050E8"></div>
<div class="row">{star("#B99AF5")}Open interest</div>
<div class="row">{star("#5B6CFF")}Liquidations</div>
<div class="row" style="opacity:.3">{star("#FF7EC8")}Super important data</div>
</div></div>
{cap("detailed information about", "open interest,", "", "liquidation")}
{plus(150, 1420, 44)}''',
 tag="P5 · 00:17.9 · list builds on each spoken item")

# P6 — SITE 3 (card + caption)
F["P6_cryptoquant"] = page("30.0", body_front=f'''
<div class="card"><div class="grid"></div><div class="in">
<div class="meta"><span class="num">03 / 04</span><span class="chip">CryptoQuant</span></div>
<div style="margin:30px -56px 0">{glow_line("M0 170 C100 160 160 205 260 196 S380 90 460 100 S560 212 640 204 S760 64 900 48", 900, 230,
 extra='<g font-family="Inter" font-weight="700" font-size="26"><circle cx="262" cy="196" r="13" fill="#EEE7FF" style="filter:drop-shadow(0 0 14px #B99AF5)"/><rect x="190" y="126" width="146" height="44" rx="22" fill="#5B6CFF" style="filter:drop-shadow(0 0 12px #5B6CFF)"/><text x="263" y="156" fill="#EEE7FF" text-anchor="middle">ENTRY</text><circle cx="462" cy="100" r="13" fill="#EEE7FF" style="filter:drop-shadow(0 0 14px #B99AF5)"/><rect x="398" y="30" width="128" height="44" rx="22" fill="#FF7EC8" style="filter:drop-shadow(0 0 12px #FF7EC8)"/><text x="462" y="60" fill="#190D32" text-anchor="middle">EXIT</text></g>')}</div>
<div style="display:flex;gap:30px;margin-top:22px"><div style="flex:1"><div class="label"><span style="color:#8E9BFF">↘</span> Inflows</div><div class="bar b" style="margin-top:12px"><i style="width:72%"></i></div></div>
<div style="flex:1"><div class="label"><span style="color:#FF7EC8">↗</span> Outflows</div><div class="bar r" style="margin-top:12px"><i style="width:44%"></i></div></div></div>
</div></div>
{cap("helps investors identify potential", "entry", "and", "exit points")}''',
 tag="P6 · 00:30.0 · card + caption")

# P7 — CTA (full-frame graphic insert)
COIN = '''<svg width="170" height="170" viewBox="0 0 100 100" style="display:block;margin:0 auto;filter:drop-shadow(0 0 30px #8050E8)">
<defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B99AF5"/><stop offset=".5" stop-color="#8050E8"/><stop offset="1" stop-color="#C65BF2"/></linearGradient></defs>
<circle cx="50" cy="50" r="46" fill="url(#cg)"/><circle cx="50" cy="50" r="38" fill="none" stroke="#EEE7FF" stroke-opacity=".5" stroke-width="2"/>
<text x="50" y="68" text-anchor="middle" font-family="DejaVu Sans" font-weight="700" font-size="50" fill="#EEE7FF">₿</text></svg>'''
F["P7_cta"] = page("35.6", insert=True, body_front=f'''
<div class="card" style="top:400px;transform:scale(.86)"><div class="grid"></div><div class="in" style="text-align:center;padding-top:60px">
{COIN}
<div class="label" style="margin-top:26px">Want the full website list?</div>
<div class="bar" style="margin:34px 0 12px"><i style="width:75%"></i></div>
<div style="display:flex;justify-content:space-between" class="label"><span>Sites revealed</span><span>3 / 4</span></div>
<div class="white" style="margin-top:40px">Comment “BITCOIN”</div>
</div></div>
{plus(120, 380, 50)}{plus(900, 760, 40, "#B99AF5", 20)}{plus(170, 1180, 30, "#5B6CFF")}
{cap("if you want the full list, just", "comment", "", "Bitcoin")}''',
 tag="P7 · 00:35.6 · FULL-FRAME INSERT (footage blurred)")

# P8 — SITE 4 (card + caption)
F["P8_farside"] = page("43.6", body_front=f'''
<div class="card"><div class="grid"></div><div class="in">
<div class="meta"><span class="num">04 / 04</span><span class="chip">Farside</span></div>
<div style="margin:20px -56px 0">{glow_line("M0 200 C200 198 380 184 520 144 S760 40 900 16", 900, 210, dot=(900,16))}</div>
<div style="margin-top:14px"><div style="display:flex;justify-content:space-between" class="label"><span><b style="color:#8E9BFF">Ξ</b> Ethereum ETFs</span><span style="color:#EEE7FF">Flows</span></div><div class="bar b" style="margin:12px 0 22px"><i style="width:54%"></i></div>
<div style="display:flex;justify-content:space-between" class="label"><span><b style="color:#FF7EC8">₿</b> Bitcoin ETFs</span><span style="color:#EEE7FF">Flows</span></div><div class="bar r" style="margin-top:12px"><i style="width:82%"></i></div></div>
</div></div>
{cap("inflows and outflows into the", "Ethereum", "and", "Bitcoin ETFs")}''',
 tag="P8 · 00:43.6 · card + caption")

for k, v in F.items():
    (OUT / f"{k}.html").write_text(v)
print("\n".join(F))
