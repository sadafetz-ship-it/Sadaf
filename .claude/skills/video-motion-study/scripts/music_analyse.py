import json, sys, os, numpy as np, subprocess, librosa, warnings
from multiprocessing import Pool
warnings.filterwarnings('ignore')
M=sys.argv[1]; OUT=f'{M}/features.jsonl'
MAJ=np.array([6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88]); MIN=np.array([6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.17])
SR=16000
def feat(c):
    try:
        a=subprocess.run(['ffmpeg','-v','error','-ss','15','-t','32','-i',f"{M}/clips/{c['id']}.mp3",'-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True,timeout=60).stdout
        y=np.frombuffer(a,np.float32).copy()
        if len(y)<SR*15: return None
        S=np.abs(librosa.stft(y,n_fft=1024,hop_length=512))
        P=(S**2).mean(1); fr=librosa.fft_frequencies(sr=SR,n_fft=1024)
        onset=librosa.onset.onset_strength(S=librosa.amplitude_to_db(S),sr=SR,hop_length=512)
        tempo=float(np.atleast_1d(librosa.feature.tempo(onset_envelope=onset,sr=SR,hop_length=512,start_bpm=112))[0])
        # beat phase: grid offset that collects the most onset energy
        fps=SR/512; per=60/tempo*fps; best=(-1,0)
        for k in range(int(per)):
            idx=np.arange(k,len(onset),per).astype(int); v=onset[idx].sum()
            if v>best[0]: best=(v,k)
        phase=best[1]/fps+15
        mid=P[(fr>=300)&(fr<2500)].sum()/P.sum(); low=P[fr<150].sum()/P.sum()
        cent=float(np.mean(librosa.feature.spectral_centroid(S=S,sr=SR)))
        rms=librosa.feature.rms(S=S,frame_length=1024)[0]; dyn=float(rms.std()/(rms.mean()+1e-9))
        ch=librosa.feature.chroma_stft(S=S**2,sr=SR).mean(1)
        mj=max(np.corrcoef(np.roll(MAJ,k),ch)[0,1] for k in range(12)); mn=max(np.corrcoef(np.roll(MIN,k),ch)[0,1] for k in range(12))
        return {'id':c['id'],'tempo':round(tempo,1),'mid':round(float(mid),3),'low':round(float(low),3),'busy':round(float(np.mean(onset)),3),'cent':round(cent),'dyn':round(dyn,3),'major':round(float(mj-mn),3),'phase':round(float(phase),3)}
    except Exception as e:
        import traceback; traceback.print_exc(); return None
if __name__=='__main__':
    C=json.load(open(f'{M}/candidates.json'))
    done=set()
    if os.path.exists(OUT): done={json.loads(l)['id'] for l in open(OUT)}
    todo=[c for c in C if c['id'] not in done]
    with Pool(4) as p, open(OUT,'a') as f:
        for i,r in enumerate(p.imap_unordered(feat,todo,chunksize=2)):
            if r: f.write(json.dumps(r)+'\n'); f.flush()
            if i%50==0: print(i,'/',len(todo),flush=True)
    print('done')
