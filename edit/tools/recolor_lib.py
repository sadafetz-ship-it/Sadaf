import sys, re
# purple-set literals used in gen.py → token
TOK={'#190D32':'ink','#5426A8':'deep','#8050E8':'main','#B99AF5':'light','#EEE7FF':'mist','#C65BF2':'sec','#FF7EC8':'dot','#A97CFF':'title',
 '#5B6CFF':'sec2','#E6DAFF':'pale','#E3D6FF':'pale','#D8C4FF':'pale','#F4EEFF':'cream','#2A1258':'d2','#3A1F70':'d3','#1A0E36':'d1','#4A2A90':'d3','#1E0F3E':'d1','#0B0618':'d0'}
RGB={'128,80,232':'main','185,154,245':'light','84,38,168':'deep','25,13,50':'ink','198,91,242':'sec','255,126,200':'dot','238,231,255':'mist','91,108,255':'sec2','40,22,78':'d2','60,30,120':'d3','60,36,110':'d3'}

def rgb(h): h=h.lstrip('#'); return ','.join(str(int(h[i:i+2],16)) for i in (0,2,4))
def apply(src,pal):
    s=re.sub('|'.join(map(re.escape,TOK)),lambda m:pal[TOK[m.group(0)]],src)
    return re.sub(r'rgba\((\d+,\d+,\d+),',lambda m:f'rgba({rgb(pal[RGB[m.group(1)]])},' if m.group(1) in RGB else m.group(0),s)
