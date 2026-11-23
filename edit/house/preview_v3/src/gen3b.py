# F8 alternatives (right zone, off the face). Reuses gen3 helpers.
import re
src=open('gen3.py').read()
exec(src[:src.rindex("F = {}")])
CUR='<svg viewBox="0 0 24 24" style="position:absolute;{s}" width="54" height="54"><path d="M3 2l17 8-7 2-3 7z" fill="#FFF4DE" stroke="#160C06" stroke-width="1.4" stroke-linejoin="round"/></svg>'
A = ('8A: Ink pill label types "Start today" (from the BMW pill, Rd)',
 '''<div style="position:absolute;left:1270px;top:250px;width:580px;display:flex;flex-direction:column;align-items:center;gap:22px">
<div style="font-weight:500;font-size:34px;color:rgba(255,244,222,.8);letter-spacing:6px">STEP 1</div>
<div style="padding:22px 46px;border-radius:24px;background:#160C06;border:2px solid rgba(255,192,0,.65);box-shadow:0 18px 40px rgba(0,0,0,.55),0 0 24px rgba(255,170,40,.35);
font-weight:600;font-size:64px;color:#FFF4DE;letter-spacing:-1.5px">Start <span style="color:#FFC000">today</span><span style="display:inline-block;width:5px;height:60px;background:#fff;margin-left:8px;vertical-align:-8px;box-shadow:0 0 12px #FFC000"></span></div></div>''')
days=''.join(f'<div style="height:52px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:24px;{"background:#FFC000;color:#160C06;box-shadow:0 0 22px rgba(255,192,0,.8);transform:scale(1.12)" if d==23 else "color:rgba(255,244,222,.55);background:rgba(255,244,222,.05)"}">{d}</div>' for d in range(16,30))
B = ('8B: Glass calendar widget, TODAY circled (Rc widget style)',
 f'''<div class="card" style="left:1290px;top:150px;width:540px;height:400px;border-radius:56px">
<div style="position:relative;padding:34px 36px"><div style="display:flex;justify-content:space-between;align-items:center">
<div style="font-weight:700;font-size:40px;color:#FFF4DE">Day 1</div><div class="chip"><i></i>TODAY</div></div>
<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;margin-top:28px">{''.join(f'<div style="text-align:center;font-size:20px;color:rgba(255,244,222,.4)">{d}</div>' for d in 'MTWTFSS')}{days}</div>
<div style="margin-top:24px;font-size:26px;color:rgba(255,244,222,.65)">Your 10-year plan starts here</div></div></div>
<svg style="position:absolute;inset:0" width="1920" height="1080"><ellipse cx="1356" cy="376" rx="54" ry="42" fill="none" stroke="#FFF4DE" stroke-width="4" transform="rotate(-8 1356 376)" style="filter:drop-shadow(0 0 8px #FFC000)"/></svg>''')
C = ('8C: Quest-style CTA card, "Get started" pressed by cursor (quest-card morph)',
 '''<div class="card" style="left:1290px;top:170px;width:540px;height:400px;border-radius:48px"><div style="position:relative;padding:34px 38px;text-align:center">
<div style="width:96px;height:96px;margin:0 auto;border-radius:28px;background:linear-gradient(160deg,#FFE27A,#F0913A);display:flex;align-items:center;justify-content:center">''' + HOUSE.format(s=60) + '''</div>
<div style="display:inline-block;margin-top:14px;padding:4px 14px;border-radius:8px;background:#FFC000;color:#160C06;font-weight:700;font-size:20px;letter-spacing:2px">STEP 1</div>
<div style="font-weight:700;font-size:46px;color:#FFF4DE;margin-top:10px;letter-spacing:-1px">Your home plan</div>
<div style="display:flex;gap:16px;margin-top:26px"><div style="flex:1;padding:18px;border-radius:999px;border:2px solid rgba(255,244,222,.25);color:rgba(255,244,222,.6);font-weight:600;font-size:26px">Later</div>
<div style="flex:1.4;padding:18px;border-radius:999px;background:linear-gradient(180deg,#FFE27A,#FFC000);color:#160C06;font-weight:700;font-size:26px;box-shadow:0 0 26px rgba(255,192,0,.7);transform:scale(.95)">Get started</div></div></div></div>''' + CUR.format(s='left:1700px;top:505px'))
for k,(label,body) in {'8A':A,'8B':B,'8C':C}.items():
    html=talk('11.95', front=body) + caption3('so you can get', 'started', 'today')
    open(f'h{k}.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="stage">{html}</div></body></html>')
import json; json.dump({k:['11.95',v[0]] for k,v in {'8A':A,'8B':B,'8C':C}.items()}, open('frames3b.json','w'))

# 8BC: calendar (left zone) + CTA card (right zone)
Bl = B[1].replace('left:1290px;top:150px', 'left:70px;top:150px').replace('cx="1356" cy="376"', 'cx="136" cy="376"').replace('rotate(-8 1356 376)', 'rotate(-8 136 376)')
html = talk('11.95', front=Bl + C[1]) + caption3('so you can get', 'started', 'today')
open('h8BC.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="stage">{html}</div></body></html>')
json.dump({'8BC':['11.95','8 B+C']}, open('frames3c.json','w'))

# 8 sequence: (1) cursor clicks 23 on the calendar, (2) home card opens out of the 23 cell, over the dimmed calendar (left zone)
ripple = '<div style="position:absolute;left:96px;top:336px;width:80px;height:80px;border-radius:50%;border:3px solid rgba(255,244,222,.8);box-shadow:0 0 18px #FFC000;transform:scale(1.35);opacity:.7"></div>'
s1 = Bl + ripple + CUR.format(s='left:150px;top:385px')
cal_dim = '<div style="filter:blur(6px) brightness(.55);transform:scale(.96);transform-origin:20% 50%">' + Bl + '</div>'
card = C[1].replace('left:1290px;top:170px', 'left:110px;top:170px').replace("CUR", "")
card = re.sub(r'<svg viewBox="0 0 24 24" style="position:absolute;left:1700px;top:505px".*?</svg>', '', card, flags=re.S)
s2 = cal_dim + card + CUR.format(s='left:520px;top:505px')
for k,body in {'8S1':s1,'8S2':s2}.items():
    html = talk('11.95', front=body) + caption3('so you can get', 'started', 'today')
    open(f'h{k}.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="stage">{html}</div></body></html>')
json.dump({'8S1':['11.95','8.1'],'8S2':['11.95','8.2']}, open('frames3c.json','w'))
