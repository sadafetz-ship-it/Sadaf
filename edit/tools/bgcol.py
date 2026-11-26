import numpy as np, glob, colorsys, json
from PIL import Image
px=[]; regions={}
for p in sorted(glob.glob('stills/F*_cut.png')):
    a=np.asarray(Image.open(p)).astype(np.float32)
    rgb,al=a[...,:3],a[...,3]
    # cutout keeps alpha only above 56% height; restrict to that band for "background"
    band=rgb[:1075][al[:1075]<20]
    px.append(band[::37])
X=np.concatenate(px)
# simple kmeans
rng=np.random.default_rng(0); C=X[rng.choice(len(X),8,replace=False)]
for _ in range(30):
    d=((X[:,None]-C[None])**2).sum(-1); l=d.argmin(1)
    C=np.array([X[l==k].mean(0) if (l==k).any() else C[k] for k in range(8)])
cnt=np.bincount(l,minlength=8); o=np.argsort(-cnt)
for k in o:
    r,g,b=C[k]; h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255)
    print(f'#{int(r):02X}{int(g):02X}{int(b):02X}  {cnt[k]/len(X)*100:5.1f}%  hue {h*360:5.1f}  sat {s:.2f}  val {v:.2f}')
# named regions on F9 (raw still)
im=np.asarray(Image.open('stills/F9.png').convert('RGB')).astype(int)
for name,(x0,y0,x1,y1) in {'lamp':(160,960,300,1060),'wall_upper':(80,200,300,500),'ceiling':(500,0,700,150),'door_dark':(900,500,1060,900),'shirt':(380,1200,700,1500),'skin':(470,700,560,780)}.items():
    m=im[y0:y1,x0:x1].reshape(-1,3).mean(0); h,s,v=colorsys.rgb_to_hsv(*(m/255))
    print(f'{name:11s} #{int(m[0]):02X}{int(m[1]):02X}{int(m[2]):02X} hue {h*360:5.1f} sat {s:.2f} val {v:.2f}')
