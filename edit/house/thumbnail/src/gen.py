import random
CSS=r"""
@font-face{font-family:Inter;src:url(inter.woff2) format('woff2');font-weight:100 900}
@font-face{font-family:Allura;src:url(allura.woff2) format('woff2')}
@font-face{font-family:Antonio;src:url(antonio.woff2) format('woff2');font-weight:700}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1280px;height:720px;overflow:hidden}
.st{position:absolute;inset:0;overflow:hidden;font-family:Inter;font-variation-settings:'opsz' 32;
 background:radial-gradient(70% 80% at 16% 108%,rgba(235,136,88,.38),transparent 60%),radial-gradient(55% 60% at 84% -12%,rgba(255,192,0,.18),transparent 60%),linear-gradient(160deg,#050403 0%,#120a05 55%,#1d0f06 100%)}
.sheen{position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,240,220,.04) 45%,transparent 60%)}
.rim{position:absolute;border-radius:50%;filter:blur(60px)}
.me{position:absolute;bottom:0;filter:brightness(1.07) contrast(1.06) saturate(1.04) drop-shadow(0 0 2px rgba(255,214,150,.9)) drop-shadow(0 0 26px rgba(255,170,60,.55))}
.solid{font-weight:800;color:#FFB21A;letter-spacing:-.06em;line-height:.84;text-shadow:0 8px 30px rgba(60,20,0,.5)}
.hv{font-weight:700;letter-spacing:-.045em;line-height:.9;background:linear-gradient(180deg,#FFFFFF 30%,#FFF1CF 70%,#FFE2A0 100%);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 8px rgba(255,214,140,.35)) drop-shadow(0 4px 18px rgba(0,0,0,.5))}
.sm{font-weight:500;color:#FFF4DE;letter-spacing:-.02em;text-shadow:0 2px 12px rgba(0,0,0,.6)}
.pill{display:inline-block;border-radius:999px;padding:0 34px 10px;background:linear-gradient(180deg,#FFE58A 0%,#FFC000 55%,#F0913A 100%);box-shadow:0 0 0 2px rgba(255,244,222,.35) inset,0 0 26px rgba(255,192,0,.6),0 0 60px rgba(235,136,88,.45)}
.pill span{font-family:Allura;color:#160C06;line-height:1;display:inline-block;transform:translateY(6px)}
.px{position:absolute}
.card{position:absolute;border-radius:28px;background:linear-gradient(165deg,rgba(52,28,12,.95),rgba(22,12,6,.96) 60%);border:2px solid rgba(255,214,120,.7);box-shadow:0 20px 50px rgba(0,0,0,.6),0 0 30px rgba(255,170,40,.3),inset 0 -3px 0 rgba(255,220,140,.8)}
.ic{display:flex;align-items:center;justify-content:center;border-radius:22px;background:linear-gradient(160deg,#FFE27A,#F0913A);box-shadow:0 0 30px rgba(255,170,40,.6)}
.hbar{position:absolute;left:-8px;right:-8px;bottom:.1em;height:.26em;border-radius:6px;z-index:-1;background:linear-gradient(90deg,#6B3410,#EB8858 30%,#FFC000 80%,#FFD36B);box-shadow:0 0 26px rgba(255,170,40,.6)}
.lbl{position:absolute;font-weight:600;color:rgba(255,244,222,.8);font-size:22px}
"""
HOUSE='<svg viewBox="0 0 24 24" width="{s}" height="{s}"><path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z" fill="#160C06"/></svg>'
def pixels(x,y,w,h,cell,seed,anchors):
    r=random.Random(seed); out=[]
    SH=[[(0,0),(1,0),(1,1)],[(0,0),(0,1),(1,1),(1,2)],[(0,0),(1,0),(2,0),(2,1)],[(0,0),(1,1)],[(0,0),(0,1),(1,0)]]
    for ax,ay in anchors:
        for gx,gy in r.choice(SH):
            c=r.choice(['#FFB21A','#F0913A','#EB8858','#FFD36B','#FFE9B8'])
            out.append(f'<div class="px" style="left:{x+ax*w+gx*cell:.0f}px;top:{y+ay*h+gy*cell:.0f}px;width:{cell-2}px;height:{cell-2}px;background:{c};opacity:{.65+.35*r.random():.2f}"></div>')
    return ''.join(out)
def me(t,h,right=None,left=None):
    pos=f'right:{right}px' if right is not None else f'left:{left}px'
    return f'<div class="rim" style="{pos};bottom:60px;width:{h*0.8:.0f}px;height:{h*0.8:.0f}px;background:rgba(255,170,60,.35)"></div><img class="me" src="cut_{t}.png" style="height:{h}px;{pos}">'
T={}
# A: hook question — curious face, HOME BY 40?
T['A']=('"Home by 40?" (hook question)', me('1.0',700,right=-40)+f'''
<div style="position:absolute;left:64px;top:110px;width:680px">
 <div class="sm" style="font-size:44px;margin-left:8px">Buy a</div>
 <div class="solid" style="font-size:250px">HOME</div>
 <div style="margin-top:14px;margin-left:6px"><div class="pill"><span style="font-size:96px">before 40?</span></div></div>
</div>'''+pixels(64,150,620,210,30,'a',[(0.0,1.0),(0.08,1.03),(0.92,-0.1),(1.0,0.0),(0.95,0.9)])+
 f'<div class="card" style="left:560px;top:520px;width:200px;height:120px;display:flex;align-items:center;gap:14px;padding:0 18px;transform:rotate(-4deg)"><div class="ic" style="width:72px;height:72px">{HOUSE.format(s=46)}</div><div style="color:#FFE27A;font-weight:700;font-size:26px;line-height:1.05">10-yr<br>plan</div></div>')
# B: plan — friendly face, timeline to house
line='<svg style="position:absolute;inset:0" width="1280" height="720"><path d="M80 600 C 200 560, 260 470, 360 480 S 520 520, 600 440 S 740 300, 820 230" stroke="#FFC000" stroke-width="9" fill="none" stroke-linecap="round" style="filter:drop-shadow(0 0 10px #FFC000) drop-shadow(0 0 24px #EB8858)"/></svg>'
nodes=''.join(f'<div style="position:absolute;left:{x-18}px;top:{y-18}px;width:36px;height:36px;border-radius:50%;background:radial-gradient(#FFE27A,#EB8858);box-shadow:0 0 22px rgba(255,192,0,.8)"></div><div class="lbl" style="left:{x-40}px;top:{y+24}px;width:80px;text-align:center">{l}</div>' for x,y,l in [(80,600,'YR 1'),(360,480,'YR 3'),(600,440,'YR 6')])
T['B']=('"10-year home plan" (promise)', me('12.1',690,right=-110)+line+nodes+f'''
<div class="ic" style="position:absolute;left:770px;top:170px;width:110px;height:110px;border-radius:30px">{HOUSE.format(s=70)}</div><div class="lbl" style="left:780px;top:290px;color:#FFE27A">YR 10</div>
<div style="position:absolute;left:60px;top:46px">
 <div class="hv" style="font-size:118px">Your 10-year</div>
 <div style="margin-top:4px"><div class="pill"><span style="font-size:104px">home plan</span></div></div>
</div>''')
# C: pain — grimace face, PRICEY + $$$
T['C']=('"Homes got pricey" (problem)', me('17.3',700,right=-30)+f'''
<div style="position:absolute;left:70px;top:70px;font-family:Antonio;font-weight:700;font-size:260px;line-height:1;letter-spacing:-6px;background:linear-gradient(180deg,rgba(255,241,207,.95),rgba(255,192,0,.45));-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 8px 30px rgba(0,0,0,.4))">$$$</div>
<svg style="position:absolute;inset:0" width="1280" height="720"><path d="M70 120 L 290 420 L 520 120" fill="none" stroke="rgba(255,244,222,.45)" stroke-width="3"/></svg>
<div style="position:absolute;left:64px;top:390px">
 <div class="sm" style="font-size:52px;margin-left:6px">Homes got</div>
 <div style="position:relative;isolation:isolate;display:inline-block;transform:rotate(-3deg);font-size:170px"><span class="hbar"></span><span class="hv">PRICEY</span></div>
</div>'''+pixels(64,430,520,170,28,'c',[(1.02,0.1),(1.06,0.7),(-0.04,1.05),(0.85,1.08)]))
for k,(label,body) in T.items():
    open(f'thumb_{k}.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="st"><div class="sheen"></div>{body}</div></body></html>')
import json; json.dump({k:v[0] for k,v in T.items()},open('thumbs.json','w'))
