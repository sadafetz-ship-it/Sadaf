import numpy as np, wave
SR=48000; DUR=65.14
rng=np.random.default_rng(7)
out=np.zeros(int(SR*(DUR+2)))
def env(n,a=0.003,d=0.08):
    t=np.arange(n)/SR; return np.minimum(1,t/a)*np.exp(-t/d)
def bp(x,lo,hi):
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/SR);X[(f<lo)|(f>hi)]=0;return np.fft.irfft(X,len(x))
def db(x,level):
    return x/ (np.max(np.abs(x))+1e-9) * 10**(level/20)
def pop(level=-25):
    n=int(.12*SR);t=np.arange(n)/SR;f=900*np.exp(-t*18)+380
    x=np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.035)+bp(rng.normal(0,1,n),2000,8000)*env(n,.001,.008)*.3
    return db(x,level)
def soft_in(level=-31):   # gentle air swell for a graphic cutting in
    n=int(.28*SR);t=np.arange(n)/SR
    x=bp(rng.normal(0,1,n),500,4000)*np.sin(np.pi*t/t[-1])**2
    return db(x,level)
def click(level=-27):
    n=int(.03*SR);x=bp(rng.normal(0,1,n),1500,9000)*env(n,.0005,.004);return db(x,level)
def tick(level=-29):
    n=int(.05*SR);t=np.arange(n)/SR;x=np.sin(2*np.pi*2400*t)*env(n,.0005,.01);return db(x,level)
def typing(dur=.4,level=-28):
    n=int(dur*SR);x=np.zeros(n);k=0
    while k<n-2000:
        c=click(level+rng.uniform(-3,1));x[k:k+len(c)]+=c;k+=int(SR*rng.uniform(.03,.05))
    return x
def ding(level=-27):
    n=int(1.0*SR);t=np.arange(n)/SR
    x=(np.sin(2*np.pi*1568*t)+.45*np.sin(2*np.pi*2352*t)+.2*np.sin(2*np.pi*3136*t))*env(n,.002,.35)
    return db(x,level)
def scratch(level=-30):
    n=int(.2*SR);t=np.arange(n)/SR;x=bp(rng.normal(0,1,n),1200,6000)*np.sin(np.pi*t/t[-1]);return db(x,level)
def put(t,x):
    i=int(t*SR);out[i:i+len(x)]+=x
for t in (4.34,11.02,15.06,21.34,32.63,38.60,40.54,48.40,54.32,60.02): put(t,soft_in())
for t in (5.72,6.86,38.72,63.68,19.58,52.20): put(t,pop())
put(7.28,scratch())
for t in (12.56,): put(t,click(-25))
for t in (15.20,15.74,34.00,35.78,37.08,40.54,41.64): put(t,tick())
for t in (23.66,26.22,30.12): put(t,typing(.45,-30))
put(31.26,ding())
put(55.36,typing(.4)); put(60.40,typing(.4))
out=out[:int(SR*DUR)]
pk=np.max(np.abs(out)); print("peak dBFS",20*np.log10(pk))
w=wave.open('sfx.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(out,-1,1)*32767).astype(np.int16).tobytes());w.close()
