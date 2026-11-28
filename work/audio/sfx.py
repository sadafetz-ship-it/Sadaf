"""Places real CC0 sound effects (Freesound, via Openverse) on the edit timeline."""
import numpy as np, wave
SR=48000; DUR=64.43
def load(n):
    w=wave.open(f'lib/{n}.wav');x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768
    i=np.where(np.abs(x)>np.abs(x).max()*0.02)[0][0]; x=x[max(0,i-48):]          # trim leading silence
    return x/np.abs(x).max()
S={'whoosh':load('whoosh_0'),'pop':load('pop_2'),'click':load('click_1'),'tick':load('click_2'),'ding':load('ding_0'),'strike':load('whoosh_2')}
out=np.zeros(int(SR*(DUR+2)))
def put(t,name,db):
    x=S[name]*10**(db/20); i=int(t*SR); out[i:i+len(x)]+=x
# graphics cutting in: soft swipe, a touch early so it peaks on the cut
for t in (4.34,11.02,15.06,21.34,32.63,38.60,47.69,53.61,59.31): put(t-0.08,'whoosh',-27)
# cards / boxes / labels / pills popping in
for t in (4.36,5.72,6.86,15.10,15.50,16.12,19.58,38.66,51.49,62.97): put(t,'pop',-25)
put(7.28,'strike',-24)
# highlights and list items
for t in (12.56,18.20,34.00,35.78,37.08,39.85,40.93): put(t,'click',-25)
# counters: fast ticks while numbers roll up
for t0,d in ((23.66,.5),(26.22,.5),(30.12,.5),(54.65,1.0),(59.59,1.0)):
    k=0.0
    while k<d: put(t0+k,'tick',-31+(-4*k/d)); k+=0.055
for t in (55.74,60.69): put(t,'click',-24)        # green marker lands
put(31.26,'ding',-27)                              # "$0 paid ads"
out=out[:int(SR*DUR)]
print("peak dBFS",round(20*np.log10(np.abs(out).max()),1))
w=wave.open('sfx.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(out,-1,1)*32767).astype(np.int16).tobytes());w.close()
