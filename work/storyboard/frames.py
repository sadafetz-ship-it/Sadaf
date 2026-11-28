"""Designs one 1920x1080 still per storyboard beat (HTML), then screenshots them with Playwright."""
import pathlib, subprocess, json

ROOT = pathlib.Path(__file__).parent
SRC = (ROOT / "src").resolve()
OUT = ROOT / "frames"
FONT = "/opt/anim-tools/node_modules/@fontsource/poppins/files"
G = "#0F782B"   # Clay's brand green (only hex he supplied)

BASE_CSS = f"""
@font-face{{font-family:P;src:url(file://{FONT}/poppins-latin-400-normal.woff2);font-weight:400}}
@font-face{{font-family:P;src:url(file://{FONT}/poppins-latin-500-normal.woff2);font-weight:500}}
@font-face{{font-family:P;src:url(file://{FONT}/poppins-latin-600-normal.woff2);font-weight:600}}
@font-face{{font-family:P;src:url(file://{FONT}/poppins-latin-700-normal.woff2);font-weight:700}}
@font-face{{font-family:P;src:url(file://{FONT}/poppins-latin-500-italic.woff2);font-weight:500;font-style:italic}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:1920px;height:1080px;overflow:hidden;font-family:P,sans-serif;color:#141414}}
.stage{{position:absolute;inset:0;overflow:hidden}}
.g{{color:{G}}}
.th{{position:absolute;inset:0;background-size:cover;background-position:center}}
.dark{{background:#050505}}
.dark:after{{content:'';position:absolute;inset:0;box-shadow:inset 0 0 260px 40px rgba(15,120,43,.55)}}
.light{{background:radial-gradient(ellipse 75% 70% at 50% 50%,#ffffff 60%,#dcefe1 100%)}}
.shadow{{text-shadow:0 4px 18px rgba(0,0,0,.55),0 1px 3px rgba(0,0,0,.5)}}
.card{{position:absolute;background:#fff;border-radius:34px;box-shadow:0 30px 80px rgba(0,0,0,.35)}}
.cam{{position:absolute;border-radius:36px;border:8px solid #fff;box-shadow:0 18px 50px rgba(0,0,0,.45);background-size:330%;background-position:50% 30%}}
.pill{{display:inline-block;border-radius:999px;padding:14px 34px;font-weight:700}}
.disc{{position:absolute;font-size:22px;color:#6b6b6b;font-weight:500}}
"""

def th(img, scale=1.0):
    # crop-in centred on Clay's face (face centre ~ x 950, y 430 in the source frame)
    return (f'<div class=th style="background-image:url(file://{SRC}/{img});'
            f'transform:scale({scale});transform-origin:950px 120px"></div>')

def cam(img, x, y, w=330, h=400):
    return f'<div class=cam style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;background-image:url(file://{SRC}/{img})"></div>'

def window(x, y, w, h, title, body, dim=False):
    op = ".6" if dim else "1"
    return f"""<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;opacity:{op};
      background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,.6)">
      <div style="height:54px;background:#f1f1f1;display:flex;align-items:center;gap:10px;padding:0 22px">
        <i style="width:14px;height:14px;border-radius:50%;background:#ff5f57"></i>
        <i style="width:14px;height:14px;border-radius:50%;background:#febc2e"></i>
        <i style="width:14px;height:14px;border-radius:50%;background:#28c840"></i>
        <span style="margin-left:14px;font-size:22px;font-weight:600;color:#444">{title}</span></div>
      <div style="padding:26px 30px">{body}</div></div>"""

F = {}

F["01"] = th("f_02.4.jpg") + f"""
<div class=shadow style="position:absolute;left:0;right:0;bottom:120px;text-align:center;color:#fff">
  <div style="font-size:86px;font-weight:700;letter-spacing:1px">AI MARKETING AGENCY</div>
  <div style="font-size:54px;font-weight:600;margin-top:6px"><span style="color:#7fe39b">FROM ZERO</span> · 2026</div>
</div>"""

chat = """<div style="display:flex;flex-direction:column;gap:18px;font-size:24px">
  <div style="align-self:flex-end;background:#0F782B;color:#fff;border-radius:18px;padding:14px 20px">Write 5 review replies for my client</div>
  <div style="background:#eef0f2;border-radius:18px;padding:14px 20px;width:80%">Sure! Here are five replies…</div>
  <div style="background:#eef0f2;border-radius:18px;padding:14px 20px;width:60%;height:52px"></div></div>"""
code = """<pre style="font-family:monospace;font-size:24px;line-height:1.6;color:#333">
<span style="color:#a626a4">const</span> app = <span style="color:#4078f2">createApp</span>({
  reviews: <span style="color:#986801">true</span>,
  crm: <span style="color:#986801">true</span>,
  billing: <span style="color:#50a14f">'stripe'</span>,
});
<span style="color:#999">// 6 months of building…</span></pre>"""
F["02"] = f"""<div class="stage dark"></div>
{window(250,250,640,470,'AI Tool',chat,dim=True)}
{window(1030,250,640,470,'custom-software.js',code,dim=True)}
<div style="position:absolute;left:200px;right:200px;top:478px;height:10px;background:#ff4d4d;border-radius:6px;transform:rotate(-6deg);box-shadow:0 0 30px rgba(255,77,77,.6)"></div>
<div class=shadow style="position:absolute;left:0;right:0;top:800px;text-align:center;color:#fff;font-size:64px;font-weight:700">Not where I'd start</div>"""

F["03"] = th("f_09.5.jpg", 1.12)

listing = lambda n, name, stars, rev, hi: f"""
<div style="display:flex;align-items:center;gap:26px;padding:26px 32px;border-radius:20px;{'outline:6px solid #0F782B;background:#f2faf4' if hi else ''}">
  <div style="width:96px;height:96px;border-radius:16px;background:linear-gradient(135deg,#d9e7dd,#b8cfbf)"></div>
  <div style="flex:1"><div style="font-size:34px;font-weight:600">{name}</div>
  <div style="font-size:26px;color:#555">{stars} <span style="color:#f5a623">★★★★★</span> ({rev}) · House cleaning · Open now</div></div>
  <div class=pill style="border:3px solid #0F782B;color:#0F782B;font-size:26px;padding:10px 30px">Call</div></div>"""
F["04"] = f"""<div class="stage light"></div>
<div style="position:absolute;left:0;right:0;top:90px;text-align:center;font-size:76px;font-weight:700">More customers from <span class=g>Google</span></div>
<div class=card style="left:330px;top:250px;width:1260px;padding:34px 40px">
  <div style="border:2px solid #dfe1e5;border-radius:999px;padding:18px 34px;font-size:30px;color:#333;margin-bottom:24px">🔍&nbsp; house cleaner near me</div>
  {listing(1,'Sparkle Home Cleaning','4.9','212',True)}
  {listing(2,'Bright Maids Co.','4.6','87',False)}
  {listing(3,'City Clean Pros','4.3','41',False)}
</div>
<div class=disc style="right:40px;bottom:24px">Illustration</div>"""

F["05"] = th("f_14.5.jpg")

def bullet_card(title, items, img):
    lis = "".join(
        f'<div style="display:flex;gap:22px;align-items:baseline;margin-top:30px;font-size:46px;font-weight:700;color:{c}">'
        f'<span style="font-size:30px;color:{G}">●</span><span>{t}</span></div>' for t, c in items)
    return f"""<div class="stage" style="background:radial-gradient(ellipse at 50% 40%,#2a2a2a,#050505 75%)"></div>
<div class=card style="left:240px;top:250px;width:1440px;padding:64px 80px 70px 470px">
  <div style="font-size:50px;font-style:italic;font-weight:500">{title}</div>{lis}</div>
{cam(img,150,300,380,460)}"""

F["06"] = bullet_card("What I'd actually sell",
    [("AI → does the work faster", "#9a9a9a"),
     ("More customers → what the owner pays for", G)], "f_17.0.jpg")

F["07"] = th("f_20.0.jpg", 1.12) + """
<div style="position:absolute;left:90px;bottom:110px;background:#fff;border-radius:18px;padding:20px 34px;box-shadow:0 14px 40px rgba(0,0,0,.35);display:flex;gap:18px;align-items:center">
  <div style="width:10px;height:56px;background:#0F782B;border-radius:6px"></div>
  <div><div style="font-size:40px;font-weight:700">Review Harvest</div><div style="font-size:26px;color:#666;font-style:italic">my agency</div></div></div>"""

tile = lambda big, lab, green=False: f"""
<div style="flex:1;background:#f6f8f7;border-radius:26px;padding:36px 34px;border-bottom:8px solid {G}">
  <div style="font-size:96px;font-weight:700;line-height:1;color:{G if green else '#141414'}">{big}</div>
  <div style="font-size:30px;color:#555;margin-top:14px;font-weight:500">{lab}</div></div>"""
F["08"] = f"""<div class="stage light"></div>
<div class=card style="left:170px;top:130px;width:1580px;height:760px;padding:60px 70px 0 70px">
  <div style="font-size:28px;font-weight:600;color:#666;letter-spacing:2px">CLIENT RESULT</div>
  <div style="font-size:72px;font-weight:700;margin-bottom:46px">MaidMe <span style="font-size:40px;color:#888;font-weight:500">· first 90 days</span></div>
  <div style="display:flex;gap:30px;padding-left:0">
    {tile('50+','organic calls')}{tile('74','high-intent form submissions')}{tile('90','days')}{tile('$0','paid ads',True)}
  </div>
  <div style="font-size:24px;color:#777;margin-top:44px">One client's result. Results vary and are not guaranteed.</div>
</div>
{cam('f_24.0.jpg',1460,700,300,360)}"""

F["09"] = bullet_card("In this video",
    [("1&nbsp; The exact offer", "#9a9a9a"), ("2&nbsp; What to charge", "#9a9a9a"),
     ("3&nbsp; Finding your first clients", "#9a9a9a"), ("4&nbsp; Doing the work", "#9a9a9a"),
     ("5&nbsp; Turning results into a client system", "#141414")], "f_34.5.jpg").replace("margin-top:30px", "margin-top:22px").replace("font-size:46px", "font-size:42px")

F["10"] = th("f_47.0.jpg", 1.12)

F["11"] = """<div class="stage dark"></div>
<div style="position:absolute;left:0;right:0;top:400px;text-align:center;color:#fff;font-size:76px;font-weight:600;line-height:1.35">
You can absolutely build this.<br><span style="color:#5fd884">It's just not easy.</span></div>"""

F["12"] = th("f_52.5.jpg") + """
<div style="position:absolute;left:110px;bottom:120px;background:#fff;border-radius:20px;padding:24px 40px 24px 30px;box-shadow:0 14px 40px rgba(0,0,0,.35);display:flex;gap:22px;align-items:center">
  <div style="width:12px;height:84px;background:#0F782B;border-radius:6px"></div>
  <div><div style="font-size:52px;font-weight:700;line-height:1.1">Clay Lawrence</div><div style="font-size:30px;color:#555">Founder, Review Harvest</div></div></div>"""

def stripe(m, label, headline=None, pill=None, disc="Results not typical or guaranteed."):
    # Depth-of-field push-in: full dashboard blurred behind, the real Gross volume box magnified and sharp in front.
    hl = f'<div style="position:absolute;left:0;right:0;top:56px;text-align:center;font-size:72px;font-weight:700;z-index:3">{headline}</div>' if headline else ""
    pl = f'<div class=pill style="position:absolute;right:250px;top:760px;background:{G};color:#fff;font-size:46px;z-index:3;box-shadow:0 14px 34px rgba(15,120,43,.4)">{pill}</div>' if pill else ""
    top = 170 if headline else 90
    return f"""<div class="stage light"></div>{hl}
<div style="position:absolute;left:120px;top:{top}px;width:1680px;height:{1080-top-90}px;border-radius:30px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.25);background:#fff">
  <img src="file://{SRC}/stripe_{m}.png" style="position:absolute;width:2300px;left:-150px;top:-40px;filter:blur(6px);opacity:.6">
  <div style="position:absolute;left:30px;top:24px;background:#fff;border-radius:14px;padding:10px 22px;font-size:30px;font-weight:700;box-shadow:0 6px 20px rgba(0,0,0,.15);z-index:2">{label}</div>
</div>
<img src="file://{SRC}/gross_{m}.png" style="position:absolute;left:{960-697}px;top:{(1080+top-90)//2-154-(40 if pill else 0)}px;width:1395px;border-radius:22px;outline:7px solid {G};box-shadow:0 30px 80px rgba(0,0,0,.3);background:#fff">{pl}
<div class=disc style="left:130px;bottom:30px">{disc}</div>"""

F["13"] = stripe("aug", "Last month · August 2026")
F["14"] = stripe("oct", "This month · Oct 1 – 13", headline="Not even <span class=g>2 weeks</span> in", pill="On pace for $75K+")

if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for k, body in F.items():
        (OUT / f"{k}.html").write_text(f"<!doctype html><html><head><meta charset=utf-8><style>{BASE_CSS}</style></head><body>{body}</body></html>")
    js = """const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
for(const k of %s){await p.goto('file://%s/'+k+'.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.jpg',type:'jpeg',quality:88});}
await b.close()})()""" % (json.dumps(list(F)), OUT.resolve(), OUT.resolve())
    subprocess.run(["node", "-e", js], check=True)
    print("rendered", len(F))
