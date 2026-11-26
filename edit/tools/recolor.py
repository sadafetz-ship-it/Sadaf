import sys, re
W=sys.argv[1]
# purple-set literals used in gen.py → token
TOK={'#190D32':'ink','#5426A8':'deep','#8050E8':'main','#B99AF5':'light','#EEE7FF':'mist','#C65BF2':'sec','#FF7EC8':'dot','#A97CFF':'title',
 '#5B6CFF':'sec2','#E6DAFF':'pale','#E3D6FF':'pale','#D8C4FF':'pale','#F4EEFF':'cream','#2A1258':'d2','#3A1F70':'d3','#1A0E36':'d1','#4A2A90':'d3','#1E0F3E':'d1','#0B0618':'d0'}
RGB={'128,80,232':'main','185,154,245':'light','84,38,168':'deep','25,13,50':'ink','198,91,242':'sec','255,126,200':'dot','238,231,255':'mist','91,108,255':'sec2','40,22,78':'d2','60,30,120':'d3','60,36,110':'d3'}
P={
'blue':dict(ink='#06101F',deep='#123C7A',main='#2F7BFF',light='#8CC4FF',mist='#EAF4FF',sec='#36D6FF',dot='#FFB547',title='#4DA3FF',sec2='#36D6FF',pale='#D6EBFF',cream='#F2F8FF',d0='#030810',d1='#0A1A33',d2='#0F2A55',d3='#163A73'),
'teal':dict(ink='#061A1A',deep='#0E5C5A',main='#19C2A8',light='#8FF0DC',mist='#EAFFF9',sec='#3DE0FF',dot='#FF7A6B',title='#2EE6C1',sec2='#2B8CFF',pale='#D2FFF4',cream='#F2FFFB',d0='#020C0C',d1='#0A2626',d2='#0D3634',d3='#125250'),
'gold':dict(ink='#160C06',deep='#6B3410',main='#EB8858',light='#FFE2A0',mist='#FFF4DE',sec='#EDBF1E',dot='#FFC000',title='#FFB21A',sec2='#FFC000',pale='#FFF1CF',cream='#FFF4DE',d0='#0A0502',d1='#22120A',d2='#3A1E0C',d3='#5A2E12'),
'crimson':dict(ink='#1A0710',deep='#7A1030',main='#FF3D6E',light='#FF9FB8',mist='#FFEEF2',sec='#FF6A3D',dot='#FFD23F',title='#FF4D7A',sec2='#B03DFF',pale='#FFE0E8',cream='#FFF3F6',d0='#0C0307',d1='#2A0A16',d2='#3E0E22',d3='#5A1330'),
}
def rgb(h): h=h.lstrip('#'); return ','.join(str(int(h[i:i+2],16)) for i in (0,2,4))
for n in sys.argv[2:]:
    src=open(f'{W}/frames/{n}.html').read()
    for name,pal in P.items():
        s=re.sub('|'.join(map(re.escape,TOK)),lambda m:pal[TOK[m.group(0)]],src)
        s=re.sub(r'rgba\((\d+,\d+,\d+),',lambda m:f'rgba({rgb(pal[RGB[m.group(1)]])},' if m.group(1) in RGB else m.group(0),s)
        s=s.replace('class="tag">',f'class="tag">{name.upper()} · ')
        open(f'{W}/frames/{n}_{name}.html','w').write(s)
