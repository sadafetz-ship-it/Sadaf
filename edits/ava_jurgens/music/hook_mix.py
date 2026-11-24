"""Hook intro: open on the drop (n beats), cut back into the breakdown so the drop hits again at DROP_AT; duck under the voice."""
import sys, json, subprocess, numpy as np
song, video, words, out = sys.argv[1:5]
SR=48000; DUR=41.0; DROP_SRC=112.03; DROP_AT=5.40; HOOK_BEATS=6; BEAT=0.4878
HOOK_LEN=HOOK_BEATS*BEAT                     # 2.93 s
def dec(start, dur):
    raw=subprocess.run(['ffmpeg','-v','error','-ss',f'{start:.4f}','-t',f'{dur:.4f}','-i',song,'-ar',str(SR),'-ac','2','-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(raw,np.float32).reshape(-1,2).copy()
XF=int(0.04*SR)
hook=dec(DROP_SRC, HOOK_LEN+0.04)
rest_start=DROP_SRC-(DROP_AT-HOOK_LEN)       # breakdown tail that lands the drop on DROP_AT
rest=dec(rest_start-0.04, DUR-HOOK_LEN+0.05)
h=int(HOOK_LEN*SR)
fo=np.linspace(1,0,XF)[:,None]; fi=np.linspace(0,1,XF)[:,None]
x=np.concatenate([hook[:h-XF], hook[h-XF:h]*fo+rest[:XF]*fi, rest[XF:]])[:int(DUR*SR)]
n=len(x); t=np.arange(n)/SR
w=json.load(open(words)); sp=np.zeros(n,bool)
for q in w: sp[int(max(0,q['s']-0.03)*SR):int(min(DUR,q['e']+0.04)*SR)]=True
rms=np.sqrt((x**2).mean())+1e-9
g=np.where(sp,10**(-28/20)/rms,10**(-23/20)/rms)
g[t<HOOK_LEN]*=10**(3/20)                    # hook +3 dB
a_dn,a_up=1/(0.05*SR),1/(0.15*SR); y=np.empty(n); y[0]=g[0]
for i in range(1,n): y[i]=y[i-1]+(g[i]-y[i-1])*(a_dn if g[i]<y[i-1] else a_up)
fade=np.ones(n); fi2=int(0.08*SR); fade[:fi2]=np.linspace(0,1,fi2); fo2=int(39.6*SR); fade[fo2:]=np.linspace(1,0,n-fo2)
x=(x*(y*fade)[:,None]).astype(np.float32)
m=x.mean(1); db=lambda a:20*np.log10(np.sqrt((a**2).mean())+1e-12)
print('hook %.1f dBFS | words %.1f | pauses %.1f | rest-section starts at %.2f s in song'%(db(m[t<HOOK_LEN]),db(m[sp&(t>=HOOK_LEN)]),db(m[(~sp)&(t>HOOK_LEN)&(t<39)]),rest_start))
tmp=out+'.f32'; x.tofile(tmp)
subprocess.run(['ffmpeg','-v','error','-y','-i',video,'-f','f32le','-ar',str(SR),'-ac','2','-i',tmp,'-filter_complex',
 '[0:a]aresample=48000[v];[v][1:a]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.85:attack=2:release=40:level=false[o]',
 '-map','0:v','-map','[o]','-c:v','copy','-c:a','aac','-b:a','256k',out],check=True)
import os; os.remove(tmp)
