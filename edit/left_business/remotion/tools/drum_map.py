# Usage: python3 tools/drum_map.py SONG  (per-second percussive share + lowest-drum 31 s windows)
import sys, subprocess, numpy as np
from scipy.ndimage import median_filter
f=sys.argv[1]; sr=22050
y=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar',str(sr),'-f','f32le','-'],capture_output=True).stdout,np.float32)
n_fft=2048; hop=512; n=(len(y)-n_fft)//hop
idx=np.arange(n_fft)[None,:]+hop*np.arange(n)[:,None]
S=np.abs(np.fft.rfft(y[idx]*np.hanning(n_fft),axis=1)).T  # freq x time
H=median_filter(S,size=(1,17)); P=median_filter(S,size=(17,1))
mP=P**2/(H**2+P**2+1e-12)
perc=(mP*S**2).sum(0); tot=(S**2).sum(0)+1e-9
fps=sr/hop; sec=int(n/fps)
ratio=np.array([perc[int(i*fps):int((i+1)*fps)].sum()/tot[int(i*fps):int((i+1)*fps)].sum() for i in range(sec)])
loud=np.array([10*np.log10(tot[int(i*fps):int((i+1)*fps)].mean()) for i in range(sec)])
print('per-second percussive % (loudness dB):')
for i in range(0,sec,10): print(f'{i:4d}s ', ' '.join(f'{int(100*ratio[j]):2d}' for j in range(i,min(sec,i+10))), '  |', ' '.join(f'{loud[j]:.0f}' for j in range(i,min(sec,i+10))))
L=31
best=sorted(range(0,sec-L), key=lambda s: ratio[s:s+L].mean())[:8]
print('lowest-drum 31 s windows (start, mean perc %, max perc %, mean loud):')
for s in best: print(s, round(100*ratio[s:s+L].mean()), round(100*ratio[s:s+L].max()), round(loud[s:s+L].mean(),1))
