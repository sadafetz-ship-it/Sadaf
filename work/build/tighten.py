import json,subprocess,re,sys
segs=json.load(open('build/segs.json'))
o=subprocess.run(["ffmpeg","-hide_banner","-i","build/cut_raw.wav","-af","silencedetect=n=-42dB:d=0.4","-f","null","-"],capture_output=True,text=True).stderr
sil=[(float(a),float(b)) for a,b in re.findall(r"silence_start: ([\d.]+).*?silence_end: ([\d.]+)",o,re.S)]
TARGET=0.32
def locate(t):
  c=0
  for i,(a,b,_) in enumerate(segs):
    if t< c+(b-a): return i,a+(t-c)
    c+=b-a
  return len(segs)-1,segs[-1][1]
edits=[]
for s,e in sil:
  excess=(e-s)-TARGET
  if s==0: edits.append(("head",0,e-0.12));continue
  i,src_s=locate(s); j,src_e=locate(e)
  edits.append(("gap",i,j,src_s,src_e,excess))
# apply from end to start
for ed in sorted(edits,key=lambda x:-x[1]):
  if ed[0]=="head": segs[0][0]+=ed[2];continue
  _,i,j,ss,se,ex=ed
  if i==j:  # inside one segment -> split, keeping TARGET of the pause
    a,b,t=segs[i]; mid=ss+0.16
    segs[i:i+1]=[[a,mid,t+" (a)"],[se-0.16,b,t+" (b)"]]
  else:
    segs[i][1]-=ex*0.6; segs[j][0]+=ex*0.4
json.dump(segs,open('build/segs.json','w'),indent=1)
print(len(segs),round(sum(b-a for a,b,_ in segs),2))
