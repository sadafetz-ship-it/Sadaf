# Real CC0 sound effects (Freesound) + Kokoro voiceover + ducked music, synced to anim.js v3 scene times.
import numpy as np, subprocess, os
SR = 48000; L = 45.0; N = int(SR * L); A = os.path.dirname(os.path.abspath(__file__))
def load(path, ch=1):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True).stdout
    x = np.frombuffer(raw, np.float32); return x.reshape(-1, ch) if ch > 1 else x
cache = {}
def fx(name, dur=None, gain=1.0, fade=.03):
    if name not in cache:
        x = load(f'{A}/sfx/{name}.mp3'); a = np.abs(x) > .02 * np.max(np.abs(x)); x = x[max(0, np.argmax(a) - 200):]  # trim leading silence
        cache[name] = x / (np.max(np.abs(x)) + 1e-9)
    x = cache[name].copy()
    if dur: x = x[:int(dur * SR)]; f = int(fade * SR); x[-f:] *= np.linspace(1, 0, f)
    return x * gain
ev = []
def add(t, x): ev.append((t, x))
key = lambda g=.35: fx('type_key', .25, g)
for t in [0, .067, .13, .2, .27, .33]: add(t, key(.45))                                  # S1 In 1902 typing
add(2.3, fx('riser', 1.0, .5)); add(3.15, fx('whoosh_deep', 1.2, .8))                  # S2 frame push-through
add(5.1, fx('rope_creak', .6, .5)); add(5.5, fx('paper_1', None, .8))                    # S3 label on strings
for i in range(8): add(5.25 + i * .05, key(.25))
add(6.1, fx('whoosh_b', None, .5)); add(7.5, fx('whoosh_a', None, .6)); add(7.7, fx('whoosh_b', None, .3))  # S4
add(8.6, fx('tape_rip', None, .6)); add(9.45, fx('boom', 2.0, .45)); add(10.4, fx('whoosh_a', None, .6))  # S5
add(10.5, fx('glitch_vhs', .5, .5)); add(10.5, fx('riser', .5, .4)); add(11.0, fx('bass_boom', 2.5, .5))   # S6 streaks
add(11.9, fx('switch', .15, .8)); add(12.03, fx('switch', .15, .7))                       # S7 lamp
add(12.75, fx('whoosh_b', None, .6)); add(13.3, fx('paper_3', None, .7))
add(14.5, fx('whoosh_a', None, .6))                                                        # S8 counter
for i in range(4): add(14.7 + i * .133, fx('pop_b', None, .35))
for i in range(3): add(15.3 + i * .133, fx('whoosh_b', None, .45)); add(15.57 + i * .133, fx(['paper_1', 'paper_3', 'paper_1'][i], None, .6))  # S9
add(16.2, fx('tape_rip', None, .4)); add(16.4, fx('scribble', .85, .8))
for i in range(7): add(16.25 + i * .067, key(.3))
add(18.2, fx('bass_boom', 2.0, .7)); add(18.7, fx('whoosh_b', None, .4))                 # S10 light
for i in range(5): add(18.8 + i * .067, key(.4))
add(19.65, fx('whoosh_a', None, .55)); add(20.6, fx('whoosh_b', None, .5))               # S11 atoms
add(21.3, fx('clock', 2.1, .5)); add(22.85, fx('pop_a', None, .6))                       # S12 time
add(23.4, fx('whoosh_a', None, .4))                                                       # S13 E=mc2
for t in [23.6, 23.85, 24.1]: add(t, fx('pop_b', None, .4))
add(24.7, fx('whoosh_b', None, .45))
for i in range(5): add(24.8 + i * .1, fx('pop_a', None, .35))
add(25.9, fx('boom', 3.0, .7))
add(26.6, fx('whoosh_deep', 1.0, .7)); add(26.9, fx('bass_boom', 2.5, .55))              # S14 1919
add(27.6, fx('tape_rip', None, .4))
for i in range(8): add(27.65 + i * .067, key(.3))
add(30.2, fx('whoosh_a', None, .5)); add(30.33, fx('whoosh_b', None, .45))               # S15 newspapers
add(30.47, fx('paper_1', None, .7)); add(30.6, fx('paper_3', None, .6)); add(31.1, fx('whoosh_b', None, .3))
add(32.8, fx('whoosh_deep', 1.0, .7)); add(34.0, fx('scribble', .85, .8)); add(35.0, fx('whoosh_a', None, .6))  # S16 board
add(36.15, fx('boom', 3.0, .55)); add(36.15, fx('chime', 2.5, .5))                       # S17 Nobel
for t in [36.2, 36.27, 36.33, 36.4]: add(t, fx('pop_b', None, .25))
add(37.4, fx('whoosh_deep', .8, .4))
for i in range(6): add(38.2 + i * .18, fx('splash', .4, .45))                            # S18 ink
add(39.5, fx('whoosh_a', None, .5))
for i in range(13): add(39.8 + i * .067, key(.35))
add(40.8, fx('glitch_vhs', .15, .7)); add(41.1, fx('glitch_vhs', .15, .7)); add(41.1, fx('bass_boom', 3.0, .8))
add(44.2, fx('boom', 0.8, .25))
sfx = np.zeros(N)
for t, x in ev: i = int(t * SR); j = min(N, i + len(x)); sfx[i:j] += x[:j - i]
vo = np.zeros(N)
for line in open(A + '/vo2/lines.tsv'):
    n, t = line.split(); x = load(f'{A}/vo2/vo_{n}.wav'); x = x / (np.max(np.abs(x)) + 1e-9) * .9
    i = int(float(t) * SR); j = min(N, i + len(x)); vo[i:j] += x[:j - i]
# light voice polish: low-cut + gentle presence via ffmpeg-free numpy (pre-emphasis blend)
vo = vo + .15 * np.concatenate([[0], np.diff(vo)])
mus = load(A + '/music/Darkest Child.mp3', 2)[:N]; mus = np.pad(mus, ((0, max(0, N - len(mus))), (0, 0)))
tt = np.arange(N) / SR; fade = np.minimum(1, tt / .8) * np.clip((44.8 - tt) / 1.2, 0, 1)
venv = np.convolve(np.abs(vo), np.ones(int(SR * .3)) / (SR * .3), 'same'); duck = 1 - .6 * np.clip(venv / .06, 0, 1)
mix = mus * (fade * duck * .32)[:, None] + (vo * 1.0 + sfx * .5)[:, None]
mix = np.tanh(mix * 1.15) / np.tanh(1.15)
out = A + '/mix2.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-af', 'highpass=f=40,loudnorm=I=-14:TP=-1:LRA=9', '-ar', str(SR), out], input=mix.astype(np.float32).tobytes())
print('events', len(ev), '->', out)
