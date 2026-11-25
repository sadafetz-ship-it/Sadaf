# Synthesises sound effects, places them on the animation timeline, adds Piper VO + music bed with ducking.
import numpy as np, subprocess, sys, os
from scipy.signal import butter, sosfilt
SR = 48000; L = 45.0; N = int(SR * L); rng = np.random.default_rng(7)
A = os.path.dirname(os.path.abspath(__file__))
def env(n, a=.002, d=.2):  # attack/exp decay envelope
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
def noise(s): return rng.standard_normal(int(SR * s))
def sweep_noise(s, f0, f1, q=.35):  # time-varying band-pass noise via short overlapping blocks
    n = int(SR * s); out = np.zeros(n); blk = 1024; x = noise(s + .1)
    win = np.hanning(blk * 2)
    for i in range(0, n, blk):
        f = f0 * (f1 / f0) ** (i / n); seg = x[i:i + blk * 2]
        if len(seg) < blk * 2: break
        y = bp(seg, f * (1 - q), f * (1 + q)) * win; out[i:i + blk * 2] += y[:len(out[i:i + blk * 2])]
    return out
def norm(x, g=1.0): m = np.max(np.abs(x)) or 1; return x / m * g
# ---- sound library ----
def type_click(): return norm(hp(noise(.03), 2000) * env(int(SR * .03), .0005, .006) + .6 * lp(noise(.03), 300) * env(int(SR * .03), .0005, .01), .5)
def whoosh(s=.45, up=False):
    x = sweep_noise(s, 300 if up else 2500, 2500 if up else 250); t = np.linspace(0, 1, len(x)); e = np.sin(np.pi * t) ** 1.5
    return norm(x * e, .7)
def slap(): n = int(SR * .12); return norm(lp(noise(.12), 3000) * env(n, .0005, .02) + .8 * np.sin(2 * np.pi * 90 * np.arange(n) / SR) * env(n, .001, .03), .8)
def hit(s=1.6):
    n = int(SR * s); t = np.arange(n) / SR; f = 45 + 80 * np.exp(-t / .06); ph = 2 * np.pi * np.cumsum(f) / SR
    return norm(np.sin(ph) * env(n, .002, .45) + .35 * lp(noise(s), 800) * env(n, .001, .05) + .15 * np.tanh(3 * np.sin(ph)) * env(n, .002, .25), .95)
def riser(s=.6): x = sweep_noise(s, 200, 6000); t = np.linspace(0, 1, len(x)); return norm(x * t ** 2, .6)
def pop(): n = int(SR * .08); t = np.arange(n) / SR; return norm(np.sin(2 * np.pi * (700 - 3000 * t) * t) * env(n, .001, .025), .6)
def glitch(s=.12):
    n = int(SR * s); x = np.sign(np.sin(2 * np.pi * rng.uniform(200, 1200) * np.arange(n) / SR)) * (rng.random(n) > .3)
    x = np.round(x * rng.random(n) * 4) / 4; return norm(hp(x, 300) * env(n, .001, s), .5)
def twang(f=98, s=1.0):  # Karplus-Strong
    n = int(SR * s); p = int(SR / f); buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n): out[i] = buf[i % p]; buf[i % p] = .5 * (buf[i % p] + buf[(i + 1) % p]) * .996
    return norm(out, .5)
def lamp_click(): n = int(SR * .08); t = np.arange(n) / SR; return norm(hp(noise(.08), 1500) * env(n, .0003, .004) + .3 * np.sin(2 * np.pi * 2600 * t) * env(n, .0005, .02), .55)
def tick(): n = int(SR * .04); t = np.arange(n) / SR; return norm(np.sin(2 * np.pi * 3200 * t) * env(n, .0003, .005) + .5 * hp(noise(.04), 4000) * env(n, .0003, .003), .4)
def marker(s=.8):
    n = int(SR * s); t = np.arange(n) / SR; am = .5 + .5 * np.sin(2 * np.pi * 9 * t) ** 2
    return norm(bp(noise(s), 1800, 5000) * am * np.minimum(1, t / .05) * np.minimum(1, (s - t) / .08), .35)
def splat(): n = int(SR * .35); return norm(lp(noise(.35), 900) * env(n, .001, .07) + .9 * np.sin(2 * np.pi * 60 * np.arange(n) / SR) * env(n, .001, .08), .8)
def shimmer(s=2.0):
    n = int(SR * s); t = np.arange(n) / SR; x = sum(np.sin(2 * np.pi * f * t) * a for f, a in [(1318, .5), (1976, .35), (2637, .25), (3951, .15)])
    return norm(x * env(n, .005, .6), .35)
def brush(): x = sweep_noise(.3, 1200, 5000); t = np.linspace(0, 1, len(x)); return norm(x * np.sin(np.pi * t), .45)
def zap(): n = int(SR * .05); t = np.arange(n) / SR; return norm(np.sin(2 * np.pi * 2200 * t) * env(n, .0005, .015), .25)
def creak(s=.5): n = int(SR * s); t = np.arange(n) / SR; return norm(bp(np.sign(np.sin(2 * np.pi * (25 + 10 * np.sin(2 * np.pi * 3 * t)) * t)) + .2 * noise(s), 300, 1500) * np.sin(np.pi * t / s), .3)
def flicker_buzz(): n = int(SR * .06); t = np.arange(n) / SR; return norm(np.sign(np.sin(2 * np.pi * 120 * t)) * env(n, .001, .03), .25)
# ---- timeline (seconds, sound, gain) — synced to anim.js scene times ----
ev = []
def add(t, x, g=1.0): ev.append((t, x, g))
for i, t in enumerate([0, .067, .13, .2, .27, .33]): add(t, type_click(), .8)                   # S1 "In 1902" typing
add(2.35, riser(.95), .7); add(3.25, whoosh(.5), .9)                                             # S2 frame push-through
add(5.30, creak(.6), .8); add(5.63, slap(), .9); add(5.63, twang(110, .9), .4)                     # S3 label on strings
for i in range(8): add(5.35 + i * .05, type_click(), .35)
add(6.3, whoosh(.35), .5); add(7.7, whoosh(.3), .6); add(7.9, brush(), .5)                         # S4 slide + underline
add(8.77, slap(), .8); add(9.25, hit(1.0), .55); add(10.15, whoosh(.3), .7)                       # S5 tape + pop + blur out
add(10.3, riser(.5), .8); add(10.3, glitch(.4), .3); add(10.8, hit(1.5), .5)                      # S6 light streak → title
add(11.7, lamp_click(), .9); add(11.77, flicker_buzz(), .6); add(11.83, lamp_click(), .9)          # S7 lamp
add(12.55, whoosh(.45), .7); add(13.08, slap(), .7)
add(14.2, whoosh(.25, True), .7)                                                                   # S8 whip + dot steps
for i in range(4): add(14.4 + i * .133, tick(), .9)
for i in range(3): add(15.0 + i * .133, whoosh(.25), .55); add(15.27 + i * .133, slap(), .6)    # S9 papers fly + land
add(15.9, slap(), .45); add(16.1, marker(.8), 1.0)
for i in range(7): add(16.12 + i * .067, type_click(), .5)
add(17.6, hit(1.2), .7); add(18.1, brush(), .5)                                                    # S10 light
for i in range(5): add(18.15 + i * .067, type_click(), .6)
add(19.25, whoosh(.35), .6); add(20.2, brush(), .7)                                                # S11 magnifier + red brush
for i in range(12): add(20.9 + i * .16, tick(), .55)                                              # S12 clock ticks
add(21.7, pop(), .8)
add(22.8, whoosh(.3), .5)                                                                          # S13
for i in range(3): add(23.0 + i * .25, pop(), .5)
add(24.1, whoosh(.25), .5)
for i in range(5): add(24.2 + i * .1, pop(), .6)
add(25.3, hit(1.6), .75)
add(26.0, whoosh(.3, True), .8); add(26.45, slap(), .5)                                           # S14 whip + 1919
for i in range(8): add(26.5 + i * .067, type_click(), .5)
add(27.1, hit(1.4), .7)
add(28.6, whoosh(.25), .6); add(28.73, whoosh(.25), .5); add(28.87, slap(), .7); add(29.0, slap(), .6)  # S15 newspapers
add(29.5, brush(), .4)
add(31.2, whoosh(.35, True), .8); add(32.4, marker(.8), 1.0); add(33.95, whoosh(.3), .8)          # S16 board
add(35.1, hit(1.4), .6); add(35.1, shimmer(2.2), .8)                                               # S17 Nobel
for t in [35.2, 35.27, 35.33, 35.4]: add(t, zap(), .7)
add(36.75, whoosh(.4, True), .5)
for i in range(9): add(38.0 + (i % 9) * .12, splat(), .45)                                        # S18 ink spread
add(39.3, whoosh(.4), .6)
for i in range(13): add(39.6 + i * .067, type_click(), .6)
add(40.6, glitch(.1), .9); add(40.9, glitch(.1), .9); add(40.9, hit(2.5), .85)
add(44.0, hit(1.0), .3)
sfx = np.zeros(N)
for t, x, g in ev:
    i = int(t * SR); j = min(N, i + len(x)); sfx[i:j] += x[:j - i] * g
def load(path, ch=1):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch) if ch > 1 else np.frombuffer(raw, np.float32)
# VO
vo = np.zeros(N)
for line in open(A + '/vo/lines.tsv'):
    n, t, _ = line.rstrip('\n').split('\t'); x = load(f'{A}/vo/vo_{n}.wav'); x = x / (np.max(np.abs(x)) + 1e-9) * .9
    i = int(float(t) * SR); j = min(N, i + len(x)); vo[i:j] += x[:j - i]
# music bed, ducked under VO
mus = load(A + '/music/Darkest Child.mp3', 2)[:N]; mus = np.pad(mus, ((0, max(0, N - len(mus))), (0, 0)))
tt = np.arange(N) / SR; fade = np.minimum(1, tt / .8) * np.clip((44.6 - tt) / 1.5, 0, 1)
venv = np.convolve(np.abs(vo), np.ones(int(SR * .25)) / (SR * .25), 'same'); duck = 1 - .55 * np.clip(venv / .08, 0, 1)
mus = mus * (fade * duck * .35)[:, None]
mix = mus + (vo * 1.0 + sfx * .55)[:, None]
mix = np.tanh(mix * 1.2) / np.tanh(1.2)  # gentle limiter
out = A + '/mix.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-af', 'loudnorm=I=-14:TP=-1:LRA=9', '-ar', str(SR), out], input=mix.astype(np.float32).tobytes())
print('events', len(ev), 'wrote', out)
