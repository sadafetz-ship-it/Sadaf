# Sound edit v3: every effect is placed by its SYNC POINT (the frame its visual event happens),
# aligned on the sound's own anchor (transient / peak / end), with fades, varied typing, and VO-aware levels.
import numpy as np, subprocess, os, sys
SR = 48000; L = 45.0; N = int(SR * L); A = os.path.dirname(os.path.abspath(__file__)); rng = np.random.default_rng(3)
def load(path, ch=1):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True).stdout
    x = np.frombuffer(raw, np.float32); return x.reshape(-1, ch) if ch > 1 else x
_raw = {}
def raw(name):
    if name not in _raw:
        path = f'{A}/sfx_ref/{name[4:]}.wav' if name.startswith('REF:') else f'{A}/sfx/{name}.mp3'
        x = load(path); _raw[name] = x / (np.max(np.abs(x)) + 1e-9)
    return _raw[name]
def env_rms(x, w=.01): w = max(1, int(w * SR)); return np.sqrt(np.convolve(x ** 2, np.ones(w) / w, 'same'))
# Library: name -> (file, segment start s, segment end s, anchor) ; anchor = 'peak' | 'onset' | 'end'
LIB = {
 # --- from the user's reference reel (separated from voice + music, music bed spectrally subtracted) ---
 'r_click1': ('REF:click_1', 0, 0.13, 'onset'), 'r_click2': ('REF:click_2', 0, 0.13, 'onset'), 'r_click3': ('REF:click_3', 0, 0.13, 'onset'),
 'r_click5': ('REF:click_5', 0, 0.13, 'onset'), 'r_click8': ('REF:click_8', 0, 0.13, 'onset'),
 'r_pop2': ('REF:pop_2', 0, 0.31, 'peak'), 'r_pop3': ('REF:pop_3', 0, 0.31, 'peak'), 'r_pop4': ('REF:pop_4', 0, 0.31, 'peak'), 'r_pop6': ('REF:pop_6', 0, 0.31, 'peak'),
 'r_swish1': ('REF:swish_1', 0, 0.40, 'peak'), 'r_swish2': ('REF:swish_2', 0, 0.30, 'peak'), 'r_swish4': ('REF:swish_4', 0, 0.30, 'peak'),
 'r_swish5': ('REF:swish_5', 0, 0.37, 'peak'), 'r_swish6': ('REF:swish_6', 0, 0.38, 'peak'), 'r_swish7': ('REF:swish_7', 0, 0.36, 'peak'),
 'r_trans1': ('REF:trans_low_1', 0, 0.75, 'lowpeak'), 'r_trans2': ('REF:trans_low_2', 0, 0.72, 'lowpeak'), 'r_trans3': ('REF:trans_low_3', 0, 0.80, 'lowpeak'),
 'key':      ('type_key', 0.00, 0.20, 'onset'),
 'key2':     ('type_snip', 0.17, 0.32, 'onset'),
 'key3':     ('type_snip', 0.32, 0.50, 'onset'),
 'whoosh_s': ('whoosh_b', 0.00, 0.45, 'peak'),
 'whoosh_m': ('whoosh_a', 0.00, 0.49, 'peak'),
 'whoosh_l': ('whoosh_deep', 0.20, 1.30, 'peak'),
 'riser':    ('riser', 0.40, 2.00, 'end'),
 'riser_s':  ('riser', 1.30, 2.00, 'end'),
 'boom':     ('boom', 0.42, 3.00, 'onset'),
 'sub':      ('bass_boom', 0.40, 3.00, 'onset'),
 'slap':     ('paper_1', 0.00, 0.30, 'onset'),
 'slap2':    ('paper_3', 0.00, 0.40, 'onset'),
 'tape':     ('tape_rip', 0.10, 0.46, 'peak'),
 'click':    ('switch', 0.00, 0.20, 'onset'),
 'tick':     ('clock', 0.00, 0.30, 'onset'),
 'clock':    ('clock', 0.00, 2.40, 'onset'),
 'scribble': ('scribble', 0.10, 0.95, 'onset'),
 'glitch':   ('glitch_vhs', 0.00, 0.30, 'onset'),
 'glitch_l': ('glitch_vhs', 0.00, 0.60, 'onset'),
 'pop':      ('pop_a', 0.00, 0.14, 'peak'),
 'pop2':     ('pop_b', 0.00, 0.13, 'peak'),
 'chime':    ('chime', 1.30, 4.60, 'peak'),
 'creak':    ('rope_creak', 74.45, 75.25, 'onset'),
 'splat':    ('splash', 0.30, 0.85, 'peak'),
 'shutter':  ('shutter', 0.00, 0.30, 'onset'),
}
def punch():
    n = int(.45 * SR); t = np.arange(n) / SR; f = 48 + 140 * np.exp(-t / .035)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .16)
    click = np.random.default_rng(1).standard_normal(n) * np.exp(-t / .004)
    x = np.tanh(2.2 * body) + .5 * click; return x / np.max(np.abs(x)), 0
def clip(key, pitch=1.0):
    if key == 'punch': return punch()
    f, a, b, anc = LIB[key]; x = raw(f)[int(a * SR):int(b * SR)].copy()
    if pitch != 1.0: x = np.interp(np.arange(0, len(x) - 1, pitch), np.arange(len(x)), x)
    fi, fo = int(.002 * SR), int(min(.04, len(x) / SR / 4) * SR); x[:fi] *= np.linspace(0, 1, fi); x[-fo:] *= np.linspace(1, 0, fo)
    r = env_rms(x); pk = r.max()
    if anc == 'lowpeak':
        from scipy.signal import butter as _bb, sosfilt as _ss
        off = int(np.argmax(env_rms(_ss(_bb(2, 150, 'low', fs=SR, output='sos'), x), .02)))
    elif anc == 'peak': off = np.argmax(r)
    elif anc == 'end': off = len(x)
    else: off = max(0, np.argmax(r > pk * .3) - int(.003 * SR))
    return x / (np.max(np.abs(x)) + 1e-9), off
ev = []  # (sync_time, key, gain_db, pitch, duck_under_vo)
REMAP = {'whoosh_s': ['r_swish2', 'r_swish4', 'r_swish6'], 'whoosh_m': ['r_swish1', 'r_swish5', 'r_swish7'], 'pop': ['r_pop3', 'r_pop6'], 'pop2': ['r_pop2', 'r_pop4']}
def at(t, key, db=0, pitch=1.0, duck=True):
    if key in REMAP: key = REMAP[key][int(t * 7) % len(REMAP[key])]   # reference-reel sounds, varied deterministically
    ev.append((t, key, db, pitch, duck))
def typing(t0, n, step, db=-8):
    for i in range(n): at(t0 + i * step, rng.choice(['r_click1', 'r_click2', 'r_click3', 'r_click5', 'r_click8']), db - 2 + rng.uniform(-3, 1), rng.uniform(.93, 1.08))
F = 1 / 30
# ---- sync points (derived from anim.js v3 scene times and in-scene timings) ----
typing(0.0, 2, 2 * F, -4); typing(0.13, 4, 2 * F, -4)                             # S1 "In" + "1902"
at(1.45, 'whoosh_s', -16)                                                          # S2 caption blur-in
at(3.3, 'riser', -8, duck=False); at(3.22, 'whoosh_l', -3, duck=False)              # S2 push-through ends on the cut
at(3.3, 'sub', -14, duck=False)
typing(5.25, 8, 1.5 * F, -10)                                                      # S3 "rejected" types as label falls
at(5.2, 'whoosh_s', -10); at(5.53, 'slap', -4, duck=False); at(5.6, 'creak', -10)  # label drop, land, swing
at(6.1, 'whoosh_s', -12)                                                           # S4 rack-focus cut
at(7.55, 'whoosh_m', -8); at(7.85, 'whoosh_s', -16)                                 # word block slides out, underline draws
at(8.57, 'tape', -6, duck=False)                                                   # S5 tape unfolds
at(9.45, 'r_pop3', -3, duck=False); at(9.45, 'punch', -7, duck=False); at(9.45, 'boom', -6, duck=False)                                                   # "third class" pop (on the word)
at(10.48, 'whoosh_m', -6)                                                          # motion-blur exit on the cut
at(11.0, 'punch', -4, duck=False); at(11.0, 'riser_s', -6, duck=False); at(10.55, 'glitch_l', -14, duck=False)        # S6 light streaks build to title
at(11.0, 'sub', -8, duck=False)                                                    # "What happened next." lands
at(11.9, 'click', -2, duck=False); at(11.97, 'click', -8, 1.1, duck=False); at(12.03, 'click', -3, .95, duck=False)  # S7 lamp flicker
at(13.0, 'whoosh_m', -8); at(13.3, 'slap2', -5)                                    # label swings in, lands
at(14.53, 'whoosh_m', -6)                                                          # S8 whip in
for i, t in enumerate([14.7, 14.83, 14.97, 15.1]): at(t, 'tick', -6 + i, 1 + .04 * i)   # yellow dot steps
at(15.34, 'tape', -3, .8, duck=False); at(15.3, 'whoosh_s', -12)                   # S9 torn-paper transition
for i in range(4):                                                                 # four papers drop (3D) and land
    at(15.62 + i * 4 * F, 'whoosh_s', -11, rng.uniform(.95, 1.05)); at(15.75 + i * 4 * F, ['slap', 'slap2', 'slap', 'slap2'][i], -5 - i, rng.uniform(.95, 1.05))
at(16.2, 'tape', -9); typing(16.42, 7, 2 * F, -11); at(16.4, 'scribble', -4)       # lime label, typing, red scribble
at(18.2, 'boom', -5, duck=False); typing(18.25, 13, 1 * F, -14)                    # S10 hard cut + fast small typing
pass                             # yellow box wipe + "light"
at(19.75, 'whoosh_m', -6)                                                          # S11 magnifier slides in
pass                                    # "atoms", red brush wipe
at(21.3, 'clock', -8); typing(21.4, 11, 1.2 * F, -14)                              # S12 gears/clock, typing
pass                                                  # "time" pop (on the word)
at(23.4, 'whoosh_s', -12)                                                          # S13 cut
for t in [23.6, 23.85, 24.1]: at(t, 'pop2', -12, rng.uniform(.95, 1.05))           # words pop in
at(24.72, 'whoosh_m', -8)                                                          # block blurs out
for i in range(5): at(24.8 + i * 3 * F, 'pop', -8, 1 + .05 * i)                    # E=mc² builds letter by letter
pass                        # pushes back, "ever." hits
at(26.7, 'whoosh_l', -4, duck=False)                                               # S14 whip pan in
at(26.9, 'sub', -6, duck=False); at(27.1, 'pop', -12)                              # "19" … "1919"
at(27.6, 'tape', -9); typing(27.65, 8, 2 * F, -10)                                 # lime label + "May 29th"
at(30.35, 'whoosh_s', -8); at(30.48, 'whoosh_s', -9, 1.06)                         # S15 papers fly
at(30.47, 'slap', -4, duck=False); at(30.6, 'slap2', -5, duck=False)               # land
at(31.15, 'whoosh_s', -15)                                                         # white arc draws
at(32.9, 'whoosh_l', -4, duck=False)                                               # S16 whip in (rotation)
at(34.0, 'scribble', -4)                                                           # red scribble on face
at(35.12, 'whoosh_l', -5, duck=False)                                              # whip out on the cut
at(36.15, 'r_pop3', -3, duck=False); at(36.15, 'punch', -7, duck=False); at(36.15, 'boom', -4, duck=False); at(36.15, 'chime', -8, duck=False)              # S17 "Nobel Prize"
at(36.18, 'whoosh_s', -15)                                                         # ellipse draws
for t in [36.2, 36.27, 36.33, 36.4]: at(t, 'pop2', -16, 1.3)                       # lime flicker
at(37.5, 'whoosh_m', -10)                                                          # push pulse
for i, t in enumerate(sorted(set(38.2 + (k % 9) * .12 for k in range(26)))): at(t + .05, 'splat', -8 - (i % 3), rng.uniform(.9, 1.1), duck=False)  # S18 ink blots spread
at(39.62, 'whoosh_m', -8)                                                          # zoom-out reveal
typing(39.8, 13, 2 * F, -8)                                                        # "Not bad for a"
pass                           # red box "patent"
pass               # "patent clerk." hit
at(44.2, 'sub', -14, duck=False)                                                   # cut to black
at(27.08, 'slap', -8, .9); at(19.93, 'slap2', -14)                                 # eclipse print lands; magnifier page lands
# ---- documentary details v5: map, E=mc² notes, eclipse diagram ----
at(0.1, 'scribble', -16, .9)                                                        # route pencil Ulm→Zürich→Bern
for t in [0.1, 0.45, 0.8]: at(t, 'pop2', -11, rng.uniform(.95, 1.1))                 # city pins
# (zoom into Bern uses the 1.3 s cut whoosh)
for t in [24.95, 25.03, 25.11]: at(t, 'scribble', -19, 1.15)   # (+0.2 S13 shift → 25.15–25.31)                        # pencil notes on E=mc²
at(28.4, 'slap2', -11); at(28.5, 'scribble', -15)                                    # diagram card lands, path draws
# ---- documentary details (Remotion v4) ----
at(2.05, 'slap2', -14)                                                              # museum caption card
for t in [3.55, 13.1, 28.5, 36.7]: at(t, 'click', -14, 1.2, duck=False); at(t + .05, 'whoosh_s', -18)   # lower-thirds
at(7.85, 'scribble', -15)                                                           # pencil note (German office name)
typing(9.65, 24, 2 * F, -18)                                                        # German job title typed
for i in range(4): at(16.9 + i * .18, 'scribble', -17, rng.uniform(1.05, 1.2))       # pencil date tags on papers
at(20.2, 'pop2', -15)                                    # concept labels
at(28.2, 'scribble', -15); at(33.4, 'scribble', -15)                                # pencil notes
at(31.65, 'scribble', -8, .85); at(31.9, 'whoosh_m', -13, .8)                       # highlighter sweep + zoom-in
at(41.8, 'slap2', -20)                                                              # end title card
# ---- cut hits (Ref 5): every scene cut gets whoosh-into-impact; strength by importance ----
CUTS = [(1.3,1),(3.3,3),(6.1,2),(8.4,2),(10.5,2),(11.8,1),(14.5,2),(15.3,1),(18.2,3),(19.6,1),(21.3,2),(23.4,2),(26.6,3),(30.2,2),(32.8,2),(35.2,2),(38.2,3)]
for t, w in CUTS:
    if w == 1:
        if t != 19.6: at(t - .03, 'whoosh_m', -10, rng.uniform(.95, 1.05), duck=False)
        at(t + .02, 'punch', -12, duck=False)
    else:
        at(t + .02, ['r_trans1', 'r_trans2', 'r_trans3'][int(t * 3) % 3], [0, -6, -2][w - 1], duck=False)
        at(t + .02, 'punch', -6 if w == 3 else -11, duck=False)   # marks the cut frame under the reel transition
        if w == 3: at(t + .02, 'sub', -10, duck=False)
# ---- render ----
vo = np.zeros(N)
for line in open(A + '/vo2/lines.tsv'):
    n, t = line.split(); x = load(f'{A}/vo2/vo_{n}.wav'); x = x / (np.max(np.abs(x)) + 1e-9) * .9
    i = int(float(t) * SR); j = min(N, i + len(x)); vo[i:j] += x[:j - i]
from scipy.signal import butter as _b, sosfilt as _sf
vo = vo + 0.7 * _sf(_b(2, [2000, 6000], 'band', fs=SR, output='sos'), vo)   # VO presence boost (~+4 dB at 2–6 kHz) so consonants cut through
venv = np.clip(np.convolve(np.abs(vo), np.ones(int(SR * .25)) / (SR * .25), 'same') / .06, 0, 1)
sfx = np.zeros(N); log = []
for t, key, db, pitch, duck in ev:
    x, off = clip(key, pitch); g = 10 ** (db / 20); i = int(round(t * SR)) - off
    if i < 0: x = x[-i:]; i = 0
    j = min(N, i + len(x)); seg = x[:j - i] * g
    if duck: seg = seg * (1 - .25 * venv[i:j])   # ~ -2.5 dB under the voice
    sfx[i:j] += seg; log.append((t, key, i / SR))
mus = load(A + '/music/Darkest Child.mp3', 2)[:N]; mus = np.pad(mus, ((0, max(0, N - len(mus))), (0, 0)))
tt = np.arange(N) / SR; fade = np.minimum(1, tt / .5) * np.clip((44.2 - tt) / .04, 0, 1)
mus = mus * (fade * (1 - .45 * venv) * .30)[:, None]
from scipy.signal import butter, sosfilt
drone = sosfilt(butter(2, 120, 'low', fs=SR, output='sos'), rng.standard_normal(N)) * 2.5 + .5 * np.sin(2 * np.pi * 43.65 * tt) + .25 * np.sin(2 * np.pi * 65.4 * tt)
drone *= .06 * (1 - .5 * venv) * np.minimum(1, tt / 1.0) * np.clip((44.2 - tt) / .04, 0, 1) * (1 + .3 * np.sin(2 * np.pi * .12 * tt))
proj = rng.standard_normal(N); proj = sosfilt(butter(2, [300, 3000], 'band', fs=SR, output='sos'), proj) * (0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 24 * tt)))
proj *= 10 ** (-46 / 20) * 4 * np.minimum(1, tt / 1.0) * np.clip((44.2 - tt) / .04, 0, 1)   # quiet film-projector flutter
mix = mus + (vo + sfx * 1.0 + drone + proj)[:, None]
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
# master: fixed gain to -14 LUFS (measured, no dynamic pumping) + true-peak limiter
pre = A + '/_pre.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-af', 'highpass=f=35', pre], input=mix.astype(np.float32).tobytes())
meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', pre, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(meas.split('Integrated loudness:')[1].split('I:')[1].split('LUFS')[0])
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', f'volume={-14.0 - I:.2f}dB,alimiter=limit=0.89:attack=1:release=60:level=disabled', '-ar', str(SR), A + '/mix3.wav'])
np.save(A + '/sfx_only.npy', sfx.astype(np.float32))
with open(A + '/sfx_cue_sheet.tsv', 'w') as f:
    f.write('sync_s\tsound\tclip_starts_s\n'); [f.write(f'{t:.3f}\t{k}\t{s:.3f}\n') for t, k, s in sorted(log)]
print('events', len(ev))
