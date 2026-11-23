"""Synthesised stand-in SFX (swap for the user's library: same names, peak offsets re-measured). 48 kHz stereo 16-bit."""
import numpy as np, json, wave, os
SR = 48000; rng = np.random.default_rng(7); OUT = 'public/sfx'; os.makedirs(OUT, exist_ok=True)
t = lambda d: np.arange(int(SR * d)) / SR
def bandnoise(n, lo, hi):
    X = np.fft.rfft(rng.standard_normal(n)); fr = np.fft.rfftfreq(n, 1 / SR); X[(fr < lo) | (fr > hi)] = 0; return np.fft.irfft(X, n)
def sweep_noise(d, f0, f1, q=0.5):
    n = int(SR * d); out = np.zeros(n); seg = 1024
    for i in range(0, n, seg // 2):
        c = f0 * (f1 / f0) ** (i / n); m = min(seg, n - i)
        out[i:i + m] += bandnoise(m, c * (1 - q), c * (1 + q)) * np.hanning(m)
    return out
def norm(x, peak=0.7): return x / (np.max(np.abs(x)) + 1e-9) * peak
def save(name, x, stereo_w=0.0):
    x = np.clip(x, -1, 1); L = x; R = np.roll(x, int(stereo_w * SR / 1000)) if stereo_w else x
    d = (np.stack([L, R], 1) * 32767).astype('<i2')
    with wave.open(f'{OUT}/{name}.wav', 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes())
    return x
S = {}
# click: crisp UI tick
d = t(0.06); S['click'] = norm(bandnoise(len(d), 2500, 9000) * np.exp(-d * 260) + 0.6 * np.sin(2 * np.pi * 3200 * d) * np.exp(-d * 180), 0.8)
# key: tiny keyboard tick
d = t(0.04); S['key'] = norm(bandnoise(len(d), 1800, 7000) * np.exp(-d * 400), 0.55)
# pop: soft bubble pop
d = t(0.12); fr = 900 * np.exp(-d * 18) + 260; S['pop'] = norm(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-d * 38) * (1 - np.exp(-d * 900)), 0.7)
# whoosh: band sweep, peak in the middle
d = t(0.5); env = np.sin(np.pi * np.clip(d / 0.5, 0, 1)) ** 2.2; S['whoosh'] = norm(sweep_noise(len(d) / SR, 300, 4200, 0.6) * env, 0.75)
# impact: sub thump + transient
d = t(0.7); thump = np.sin(2 * np.pi * (48 * d + 30 * (1 - np.exp(-d * 30)) / 30)) * np.exp(-d * 7)
S['impact'] = norm(thump + 0.5 * bandnoise(len(d), 80, 2500) * np.exp(-d * 45), 0.9)
# riser: noise + rising tone, peak at the end
d = t(0.8); env = (d / 0.8) ** 2.4; fr = 180 * (8 ** (d / 0.8))
S['riser'] = norm((sweep_noise(0.8, 400, 6000, 0.5) * 0.8 + 0.5 * np.sin(2 * np.pi * np.cumsum(fr) / SR)) * env * (1 - np.exp(-(0.8 - d) * 120)), 0.6)
# shimmer: sparkly high partials
d = t(0.9); sh = sum(np.sin(2 * np.pi * f * d + rng.uniform(0, 6)) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(8, 18) * d)) for f in rng.uniform(2600, 7200, 9))
S['shimmer'] = norm(sh * np.exp(-d * 4) * (1 - np.exp(-d * 60)), 0.45)
# data: digital chirps (pixel clusters)
d = t(0.32); sq = np.zeros(len(d)); step = int(SR * 0.022)
for i in range(0, len(d), step): sq[i:i + step] = np.sign(np.sin(2 * np.pi * rng.choice([880, 1320, 1760, 2640, 3520]) * d[i:i + step]))
S['data'] = norm(sq * np.exp(-d * 9) * 0.6, 0.45)
# ding: bell
d = t(1.2); S['ding'] = norm((np.sin(2 * np.pi * 1318 * d) + 0.45 * np.sin(2 * np.pi * 2637 * d) + 0.2 * np.sin(2 * np.pi * 3951 * d)) * np.exp(-d * 4.5) * (1 - np.exp(-d * 800)), 0.6)
# swell: short reverse-like swell (card morph)
d = t(0.3); S['swell'] = norm(sweep_noise(0.3, 900, 5000, 0.4) * (d / 0.3) ** 2 * (1 - np.exp(-(0.3 - d) * 200)), 0.55)
# scripts hit: data burst + soft impact (bold words: always the same sound)
d = t(0.5); hit = np.zeros(len(d)); dd = S['data'][: len(d)]; hit[: len(dd)] += 0.8 * dd
th = S['impact'][: len(d)] * 0.55; hit[: len(th)] += th; S['scripts_hit'] = norm(hit, 0.8)
peaks = {}
for k, x in S.items():
    save(k, x, 0.35 if k in ('whoosh', 'shimmer', 'riser') else 0)
    env = np.convolve(np.abs(x), np.ones(240) / 240, 'same'); peaks[k] = round(float(np.argmax(env)) / SR, 4)
json.dump(peaks, open('src/sfx_peaks.json', 'w'), indent=1); print(peaks)
