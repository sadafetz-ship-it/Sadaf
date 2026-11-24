# Song-under-voice mixer for "The Playbook": drop aligned to 34.0 s, transcript-driven ducking, stop-hits, limiter.
import json, subprocess, sys, numpy as np
MUS, VID, WORDS, OUT = sys.argv[1:5]
SR = 48000; DUR = 39.104
def dec(path, ss=0.0, t=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', path] + (['-t', str(t)] if t else []) + ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).reshape(-1, 2).copy()
base = dec(VID); N = len(base)
# song sections: list of (song_start, length) laid end to end with 0.25 s crossfades; video_offset = where the music starts
PLAN = {
  'runaway':    dict(parts=[(4.0, DUR)], at=0.0),                     # piano intro; drums enter at 0:38 → video 34.0
  'cornfield':  dict(parts=[(8.2, DUR)], at=0.0),                     # ticking build; organ swell at 0:42.2 → 34.0
  'memory':     dict(parts=[(139.0, DUR)], at=0.0),                   # beat drop at 2:53 → 34.0
  'succession': dict(parts=[(0.5, 6.66), (0.5, DUR)], at=0.0),        # 2 piano bars repeated → beat (0:15) lands on "Schwarzman" 21.16
  'succession_up': dict(parts=[(15.0 - 1.62, DUR)], at=0.0),          # beat (0:15) lands on "listen UP" 1.62
  'succession_playbook': dict(parts=[(15.0 - 3.94, DUR)], at=0.0),    # 2 bars of piano, beat lands on "playbook" 3.94
}
name = sys.argv[5]; p = PLAN[name]
mus = np.zeros((0, 2), np.float32); xf = int(0.25 * SR)
for ss, ln in p['parts']:
    seg = dec(MUS, ss, ln)
    if len(mus) == 0: mus = seg
    else:
        r = np.linspace(0, 1, xf)[:, None]
        mus = np.concatenate([mus[:-xf], mus[-xf:] * (1 - r) + seg[:xf] * r, seg[xf:]])
mus = np.concatenate([np.zeros((int(p['at'] * SR), 2), np.float32), mus])[:N]
if len(mus) < N: mus = np.concatenate([mus, np.zeros((N - len(mus), 2), np.float32)])
# levels
words = json.load(open(WORDS))
t = np.arange(N) / SR
speech = np.zeros(N, bool)
for w in words: speech[int(max(0, w['s'] - 0.08) * SR):int((w['e'] + 0.12) * SR)] = True
# fill short gaps < 0.35 s
idx = np.flatnonzero(np.diff(speech.astype(int)))
for a, b in zip(idx[1::2], idx[2::2]):
    if (b - a) / SR < 0.35: speech[a:b + 1] = True
vr = np.sqrt(np.mean(base[speech] ** 2)); vdb = 20 * np.log10(vr)
blk = int(0.4 * SR)
def lvl(a, b):
    seg = mus[int(a * SR):int(b * SR)]
    r = np.array([np.sqrt(np.mean(seg[i:i + blk] ** 2) + 1e-12) for i in range(0, len(seg) - blk, blk)])
    return 20 * np.log10(np.percentile(r[r > 1e-5], 95))
pre, post = lvl(0.5, 33.5), lvl(34.0, 38.5)
mdb = post
early = name in ('succession_up', 'succession_playbook')
if early: pre = post = lvl(4.0, 38.5)        # steady theme: one level for the whole track
reg = np.where(t < 33.8, pre, post)           # level each side of the drop separately
off = np.where(t < 33.8, 19.0, 15.0) if not early else np.where(t < 33.8, 18.0, 15.5)          # under-speech target below the voice: build −19 dB, payoff −15 dB
g = (vdb - off) - reg
g[~speech] += 7.0                             # gaps: lift 7 dB
for h in (25.16, 26.84, 28.86):              # stop-hits on each "he didn't have"
    g[(t >= h - 0.06) & (t < h + 0.32)] = -60
# smooth in dB (attack 40 ms, release 250 ms), one-pole at 1 kHz control rate
step = SR // 1000; c = g[::step].copy(); s = np.empty_like(c); s[0] = c[0]
aa, ar = np.exp(-1 / 40), np.exp(-1 / 250)
for i in range(1, len(c)):
    k = aa if c[i] < s[i - 1] else ar
    s[i] = k * s[i - 1] + (1 - k) * c[i]
gain = 10 ** (np.repeat(s, step)[:N] / 20)
if len(gain) < N: gain = np.concatenate([gain, np.full(N - len(gain), gain[-1])])
fade = np.clip(t / 0.3, 0, 1) * np.clip((DUR - t) / 0.9, 0, 1)
mix = base + mus * (gain * fade)[:, None]
mm = mus * (gain * fade)[:, None]
for a_, b_ in ((1, 9), (10, 20), (21, 25), (34, 38)):
    sl = slice(int(a_ * SR), int(b_ * SR)); sp = speech[sl]
    print('   %2d-%2ds music under speech %.1f dB vs voice' % (a_, b_, 20 * np.log10(np.sqrt(np.mean(mm[sl][sp] ** 2)) + 1e-9) - vdb))
pk = np.abs(mix).max(); print(name, 'voice %.1f dBFS rms, music section %.1f, pre-limiter peak %.2f' % (vdb, mdb, 20 * np.log10(pk)))
wav = OUT + '.f32'
mix.astype(np.float32).tofile(wav)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', VID, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
  '-af', 'alimiter=limit=0.85:attack=2:release=60:level=false', '-c:a', 'aac', '-b:a', '256k', '-shortest', OUT], check=True)
import os; os.remove(wav)
