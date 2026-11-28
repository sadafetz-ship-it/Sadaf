import json,subprocess,sys
segs=json.load(open(sys.argv[1]));src=sys.argv[2];out=sys.argv[3];fade=0.04
parts=[];
for i,(a,b,_) in enumerate(segs):
  parts.append(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d={fade},afade=t=out:st={b-a-fade}:d={fade}[s{i}]")
fc=";".join(parts)+";"+"".join(f"[s{i}]" for i in range(len(segs)))+f"concat=n={len(segs)}:v=0:a=1[o]"
subprocess.run(["ffmpeg","-v","error","-y","-i",src,"-filter_complex",fc,"-map","[o]",out],check=True)
