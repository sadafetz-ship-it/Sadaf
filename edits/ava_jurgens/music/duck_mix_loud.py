"""Duck a music bed under Ava's voice: ~-27 dBFS-equivalent under words, lifted to ~-21 in breaths; drop aligned to 5.4 s."""
import sys, json, subprocess, numpy as np
song, offset, video, out = sys.argv[1], float(sys.argv[2]), sys.argv[3], sys.argv[4]
DUR=41.0; SR=48000
raw=subprocess.run(['ffmpeg','-v','error','-ss',str(offset),'-t',str(DUR),'-i',song,'-ar',str(SR),'-ac','2','-f','f32le','-'],capture_output=True).stdout
x=np.frombuffer(raw,np.float32).reshape(-1,2).copy(); n=len(x)
w=json.load(open(sys.argv[5]))
sp=np.zeros(n,bool)
for q in w: sp[int(max(0,q['s']-0.03)*SR):int(min(DUR,q['e']+0.04)*SR)]=True
rms=np.sqrt((x**2).mean())+1e-9
g=np.where(sp,10**(-28/20)/rms,10**(-23/20)/rms)
a_dn,a_up=1/(0.05*SR),1/(0.15*SR); y=np.empty(n); y[0]=g[0]
for i in range(1,n): y[i]=y[i-1]+(g[i]-y[i-1])*(a_dn if g[i]<y[i-1] else a_up)
fade=np.ones(n); fi=int(0.6*SR); fade[:fi]=np.linspace(0,1,fi); fo=int(39.6*SR); fade[fo:]=np.linspace(1,0,n-fo)
x=(x*(y*fade)[:,None]).astype(np.float32)
m=x.mean(1); db=lambda a:20*np.log10(np.sqrt((a**2).mean())+1e-12); mid=(np.arange(n)>SR)&(np.arange(n)<39*SR); print("bed under words %.1f dBFS, in pauses %.1f dBFS"%(db(m[sp]),db(m[(~sp)&mid])))
tmp=out+'.bed.f32'; x.tofile(tmp)
subprocess.run(['ffmpeg','-v','error','-y','-i',video,'-f','f32le','-ar',str(SR),'-ac','2','-i',tmp,'-filter_complex',
 '[0:a]aresample=48000[v];[v][1:a]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.85:attack=2:release=40:level=false[o]',
 '-map','0:v','-map','[o]','-c:v','copy','-c:a','aac','-b:a','256k',out],check=True)
import os; os.remove(tmp)
