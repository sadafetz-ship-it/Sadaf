import sys,subprocess
from PIL import Image,ImageDraw
v,a,b,fps,out=sys.argv[1],float(sys.argv[2]),float(sys.argv[3]),float(sys.argv[4]),sys.argv[5]
W,H,C=320,180,8
subprocess.run(f"rm -f /tmp/_st*.jpg",shell=True)
subprocess.run(["ffmpeg","-v","error","-y","-ss",str(a),"-i",v,"-t",str(b-a),"-vf",f"crop=1280:720:160:0,fps={fps},scale={W}:{H}","/tmp/_st%03d.jpg"],check=True)
import glob;fs=sorted(glob.glob("/tmp/_st*.jpg"))
R=(len(fs)+C-1)//C;g=Image.new("RGB",(W*C,H*R),"white")
for i,f in enumerate(fs):
  im=Image.open(f);d=ImageDraw.Draw(im);d.rectangle([0,0,60,16],fill="black");d.text((3,2),f"{a+i/fps:.2f}",fill="yellow");g.paste(im,((i%C)*W,(i//C)*H))
g.save(out,quality=80);print(out,len(fs))
