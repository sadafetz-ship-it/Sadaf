import json,subprocess
s=json.load(open('build/segs.json'))
G="curves=master='0/0 0.06/0.08 0.25/0.287 0.5/0.522 0.8/0.81 1/0.985',eq=saturation=1.08:contrast=1.02,colorbalance=rs=0.012:gs=0.003:bs=-0.012"
args=["ffmpeg","-v","error","-y"];fc=[];c=0.0;total=0
for i,(a,b,_) in enumerate(s):
  f0=round(c*30); c+=b-a; f1=round(c*30); n=f1-f0; total+=n   # frame-exact: cumulative rounding, no drift
  args+=["-ss",f"{a:.3f}","-t",f"{b-a+0.2:.3f}","-i","wc400.mp4"]
  fc.append(f"[{i}:v]fps=30,trim=end_frame={n},setpts=PTS-STARTPTS[v{i}]")
fc.append("".join(f"[v{i}]" for i in range(len(s)))+f"concat=n={len(s)}:v=1:a=0,{G},format=yuv420p[o]")
args+=["-filter_complex",";".join(fc),"-map","[o]","-c:v","libx264","-crf","14","-preset","medium","build/base.mp4"]
subprocess.run(args,check=True);print("frames",total,"audio",round(c,3),"->",round(c*30))
