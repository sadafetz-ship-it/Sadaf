import sys,json,numpy as np,wave
sys.path.insert(0,sys.argv[1]); from segs import SEGS
w=wave.open(sys.argv[2]);sr=w.getframerate();x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
hop=int(sr*0.01);n=len(x)//hop;rms=np.sqrt((x[:n*hop].reshape(n,hop)**2).mean(1)+1e-12);db=20*np.log10(rms)
thr=-42
def onset(t,search=0.6):
  i=int(t*100);lo=max(0,i-int(search*100));hi=i+int(search*100)
  for k in range(i+25,lo,-1):
    if db[k-15:k].max()<thr: return k/100
  return t
def offset(t,search=0.6):
  i=int(t*100)
  for k in range(i-25,i+int(search*100)):
    if db[k:k+15].max()<thr: return k/100
  return t
out=[]
for a,b,txt in SEGS:
  on,off=onset(a),offset(b)
  out.append([round(on-0.12,2),round(off+0.18,2),txt])
  print(f"{a:7.2f}->{on-0.12:7.2f}  {b:7.2f}->{off+0.18:7.2f}  dur {off-on+0.30:5.2f}  {txt[:50]}")
json.dump(out,open(sys.argv[3],"w"),indent=1)
print("total",sum(b-a for a,b,_ in out))
