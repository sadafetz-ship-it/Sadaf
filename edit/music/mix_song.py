"""Mix a song section under the final video with transcript-driven ducking (≈9 dB under the voice, +4 dB lift in breaths)."""
import sys, json, subprocess, numpy as np, soundfile as sf
song, start, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
tmp = out + '.sec.wav'
subprocess.run(['ffmpeg','-v','error','-y','-ss',str(start),'-t','45.2','-i',song,'-ar','48000','-ac','2',tmp],check=True)
x,sr=sf.read(tmp); n=len(x); t=np.arange(n)/sr
if n < int(45.1*sr): x=np.resize(x,(int(45.2*sr),2)); n=len(x); t=np.arange(n)/sr   # short clips loop
w=json.load(open('/home/user/Sadaf/remotion/src/words.json'))
sp=np.zeros(n,bool)
for q in w:
    sp[int(max(0,q['s']-0.03)*sr):int(min(44.5,q['e']+0.04)*sr)]=True
sp[int(44.4*sr):]=False
rms=np.sqrt((x**2).mean())+1e-9
g=np.where(sp,10**(-27/20)/rms,10**(-20/20)/rms)
k_dn,k_up=int(0.05*sr),int(0.12*sr); y=np.empty(n); y[0]=g[0]
for i in range(1,n): y[i]=y[i-1]+(g[i]-y[i-1])*((1/k_dn) if g[i]<y[i-1] else (1/k_up))
fade=np.ones(n); fi=int(0.8*sr); fade[:fi]=np.linspace(0,1,fi); fo=int(44.6*sr); fade[fo:]=np.linspace(1,0,n-fo)
sf.write(tmp,x*(y*fade)[:,None],sr)
subprocess.run(['ffmpeg','-v','error','-y','-i','/home/user/Sadaf/edit/render/crypto-websites_FINAL.mp4','-i',tmp,'-filter_complex',
 '[0:a]aresample=48000[v];[v][1:a]amix=inputs=2:duration=first:normalize=0,volume=0.85,alimiter=limit=0.7:attack=1:release=50:level=false[o]',
 '-map','[o]','-b:a','192k',out],check=True)
import os; os.remove(tmp)
