import sys,subprocess,os
from PIL import Image,ImageDraw
v,cutsf,out=sys.argv[1:4]
cuts=[0.0]+[float(x) for x in open(cutsf)]
d=float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",v],capture_output=True,text=True).stdout)
W,H,C=320,180,8
ims=[]
for i,c in enumerate(cuts):
  nxt=cuts[i+1] if i+1<len(cuts) else d
  t=min(c+max(0.35,(nxt-c)*0.55),d-0.1)
  f=f"/tmp/_s{i}.jpg"
  subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{t:.2f}","-i",v,"-frames:v","1","-vf",f"crop=1280:720:160:0,scale={W}:{H}",f],check=True)
  im=Image.open(f).convert("RGB");dr=ImageDraw.Draw(im);dr.rectangle([0,0,118,20],fill="black");dr.text((4,4),f"{c:5.1f}s ({nxt-c:.1f})",fill="yellow");ims.append(im)
R=(len(ims)+C-1)//C;g=Image.new("RGB",(W*C,H*R),"white")
for i,im in enumerate(ims): g.paste(im,((i%C)*W,(i//C)*H))
g.save(out,quality=82);print(out,len(ims))
