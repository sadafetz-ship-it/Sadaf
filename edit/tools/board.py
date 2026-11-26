import json, sys
W = sys.argv[1]
SUF = sys.argv[2] if len(sys.argv) > 2 else ''
SB = json.load(open(f'{W}/tools/sb{SUF}.json'))
def board(rows, out):
    cards = ''
    for r in rows:
        cards += f'''<div class="c"><img src="file://{W}/frames/F{r['n']}{SUF}.png"><div class="t"><b>F{r['n']}</b> · {r['t']} · <i>{r['mode']}</i></div>
        <div class="w">“{r['words']}”</div><div class="m">{r['motion']}</div><div class="s">♪ {r['sfx']}</div></div>'''
    html = f'''<!doctype html><html><head><meta charset="utf-8"><style>
    body{{margin:0;background:#0E0720;color:#EEE7FF;font-family:Inter;width:{len(rows)*400+40}px;padding:24px 20px}}
    h1{{font:600 30px 'Inter Display';margin:0 0 4px}} .sub{{color:#B99AF5;font-size:17px;margin-bottom:18px}}
    .g{{display:flex;gap:16px}} .c{{width:384px}} img{{width:384px;height:683px;border-radius:14px;display:block;border:1px solid #3A2670}}
    .t{{font-size:17px;margin:10px 0 4px;color:#B99AF5}} .t b{{color:#fff}} .w{{font:600 19px 'Inter Display';margin-bottom:6px}}
    .m{{font-size:15px;line-height:1.38;color:#D9CCF7}} .s{{font-size:14px;color:#FF9FD5;margin-top:6px}}</style></head><body>
    <h1>“Sound design” reel — storyboard preview v2 · yellow</h1><div class="sub">9:16 · 1080×1920 · 30 fps · house style, yellow accent (#FFD000) · stills from the real footage · not built yet, awaiting approval</div>
    <div class="g">{cards}</div></body></html>'''
    open(f'{W}/frames/{out}.html', 'w').write(html)
board(SB[:7], 'board_a'+SUF); board(SB[7:], 'board_b'+SUF)
