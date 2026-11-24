# Usage: python3 tools/remove_drums.py SONG.mp3 OUT.wav START_SEC END_SEC  (harmonic/percussive split; keeps the melodic part)
import sys, subprocess, numpy as np
from scipy.ndimage import median_filter
src, out, t0, t1 = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
sr=44100
raw=subprocess.run(['ffmpeg','-v','error','-ss',str(t0),'-t',str(t1-t0),'-i',src,'-ac','2','-ar',str(sr),'-f','f32le','-'],capture_output=True).stdout
x=np.frombuffer(raw,np.float32).reshape(-1,2).T.copy()
n_fft=4096; hop=1024; win=np.hanning(n_fft).astype(np.float32)
def stft(y):
    n=1+(len(y)-n_fft)//hop; idx=np.arange(n_fft)[None,:]+hop*np.arange(n)[:,None]
    return np.fft.rfft(y[idx]*win,axis=1).T
def istft(Z,L):
    fr=np.fft.irfft(Z.T,n=n_fft,axis=1)*win; y=np.zeros(L,np.float32); w=np.zeros(L,np.float32)
    for i,f in enumerate(fr): y[i*hop:i*hop+n_fft]+=f; w[i*hop:i*hop+n_fft]+=win**2
    out=np.where(w>0.1, y/np.maximum(w,1e-6), 0.0).astype(np.float32); return out
mono=x.mean(0); Sm=np.abs(stft(mono))
H=median_filter(Sm,size=(1,31)); P=median_filter(Sm,size=(31,1))
margin=2.0
M=(H**2)/((H**2)+(margin*P)**2+1e-12)   # soft harmonic mask, drums pushed down hard
# also cut sub-bass thumps below 90 Hz where kicks live, gently
f=np.fft.rfftfreq(n_fft,1/sr); M[f<90]*=0.35
outc=[istft(stft(c)*M, x.shape[1]) for c in x]
y=np.stack(outc,1)
pk=np.abs(y).max(); y=y/pk*0.89 if pk>0.89 else y
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i','-',out],input=y.astype(np.float32).tobytes(),check=True)
print('written',out, y.shape[0]/sr,'s')
