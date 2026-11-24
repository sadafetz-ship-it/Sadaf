"""Original instrumental beds for the crypto-websites reel (royalty-free, generated in code).
Each track is 45.1 s, beat-grid aligned so a bar starts exactly on the first site name (6.74 s);
intro = tension (pad + filtered arp + riser), drums drop at 6.74, lighter section for the CTA (33.5-37.4), fade at the end.
Usage: python3 compose.py OUTDIR
"""
import sys, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
SR = 44100; DUR = 45.1; N = int(SR * DUR)
out = sys.argv[1]
rng = np.random.default_rng(7)
NOTE = lambda m: 440.0 * 2 ** ((m - 69) / 12)

def lp(x, fc, order=2): return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, order=2): return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def env(n, a, d):  # attack/decay in seconds
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d); return e
def saw(f, n, ph=0.0):
    t = np.arange(n) / SR; return 2 * ((t * f + ph) % 1) - 1
def place(buf, s, at):
    i = int(at * SR); j = min(len(buf), i + len(s))
    if i < len(buf) and j > i: buf[i:j] += s[:j - i]

def kick(punch=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 95 * np.exp(-t / 0.035); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.18) * punch + 0.25 * np.exp(-t / 0.004) * rng.standard_normal(n) * punch
def clap():
    n = int(0.25 * SR); x = bp(rng.standard_normal(n), 900, 3500) * 0.6
    e = np.exp(-np.arange(n) / SR / 0.06); return x * e * 0.6
def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR); return hp(rng.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR / (0.06 if open_ else 0.012)) * 0.09
def pluck(m, d=0.25, bright=3000):
    n = int(d * 1.6 * SR); f = NOTE(m); x = np.sign(np.sin(2 * np.pi * f * np.arange(n) / SR)) * 0.5 + saw(f * 1.005, n) * 0.5
    return lp(x, bright) * env(n, 0.003, d)
def pad(ms, n, cutoff):
    x = sum(saw(NOTE(m) * dt, n, rng.random()) for m in ms for dt in (0.995, 1.0, 1.006)) / (3 * len(ms))
    return lp(x, cutoff)

def build(name, bpm, chords, arp_pattern, swing=0.0, drum_style='four', bass_oct=36, lofi=False, energy=1.0):
    beat = 60 / bpm; bar = 4 * beat
    k = int(6.74 // bar); off = 6.74 - k * bar          # a bar lands on 6.74
    L = np.zeros(N); R = np.zeros(N); drums = np.zeros(N); bass = np.zeros(N)
    sc = np.ones(N)                                      # kick sidechain
    DROP, CTA0, CTA1, END = 6.74, 33.5, 37.42, 44.5
    t0 = off - bar * 3
    b = 0
    while t0 + b * bar < DUR:
        bs = t0 + b * bar; ch = chords[b % len(chords)]
        if bs + bar > 0:
            # pad (whole bar), opens up after the drop
            n = int(bar * SR) + int(0.3 * SR)
            cut = 900 if bs < DROP else (1600 if CTA0 <= bs < CTA1 else 2600)
            p = pad([m - 12 for m in ch] + [m for m in ch], n, cut) * env(n, 0.25, 6) * (0.5 if not lofi else 0.42)
            if bs < DROP: p *= 1.6                      # intro: pad carries the tension
            if bs >= 0:
                place(L, p, bs); place(R, np.roll(p, 220), bs)
            # arp 16ths
            for s in range(16):
                st = bs + s * beat / 4 + (swing * beat / 4 if s % 2 else 0)
                if st < 0 or st >= END: continue
                idx = arp_pattern[s % len(arp_pattern)]
                if idx is None: continue
                m = ch[idx % len(ch)] + 12 + 12 * (idx // len(ch))
                bright = 1200 + 2600 * min(1, max(0, (st - 0.5) / (DROP - 0.5))) if st < DROP else (2200 if CTA0 <= st < CTA1 else 3800)
                pl = pluck(m, beat * 0.45, bright) * 0.42 * energy
                place(L if s % 4 < 2 else R, pl, st); place(R if s % 4 < 2 else L, pl * 0.6, st + 0.012)
            # bass + drums after the drop
            if bs >= DROP - 0.01 and bs < END:
                quiet = CTA0 <= bs < CTA1
                for q in range(8):
                    st = bs + q * beat / 2
                    bn = int(beat / 2 * SR); f = NOTE(ch[0] + bass_oct - 12 * 0)
                    bl = (np.sin(2 * np.pi * f * np.arange(bn) / SR) + 0.3 * np.sin(4 * np.pi * f * np.arange(bn) / SR)) * env(bn, 0.005, beat * 0.4) * 0.2
                    place(bass, bl * (0.6 if quiet else 1), st)
                for q in range(4):
                    st = bs + q * beat
                    if drum_style == 'four' or (drum_style == 'half' and q in (0, 2)) or (drum_style == 'lofi' and q in (0, 2)):
                        kk = kick(0.4 if quiet else 0.6); place(drums, kk, st)
                        i = int(st * SR); j = min(N, i + int(0.22 * SR))
                        if j > i: sc[i:j] = np.minimum(sc[i:j], 0.35 + 0.65 * np.linspace(0, 1, j - i))
                    if q in (1, 3) and not quiet: place(drums, clap() * (0.7 if drum_style != 'lofi' else 0.5), st)
                    for h in range(2):
                        hs = st + h * beat / 2 + (swing * beat / 4 if h else 0)
                        place(drums, hat(open_=(h == 1 and drum_style == 'four')) * (0.5 if quiet else 1), hs)
        b += 1
    # riser into the drop (and into the CTA return)
    for r0, r1 in [(DROP - 2.2, DROP), (CTA1 - 1.2, CTA1)]:
        n = int((r1 - r0) * SR); t = np.linspace(0, 1, n)
        nz = rng.standard_normal(n); x = np.zeros(n)
        for seg in range(20):
            a = seg * n // 20; z = (seg + 1) * n // 20; fc = 400 + 7000 * (seg / 20) ** 2
            x[a:z] = bp(nz, fc * 0.7, min(fc * 1.3, 18000))[a:z]
        x *= t ** 2 * 0.35; place(L, x, r0); place(R, x, r0)
    pads_sc = sc
    mix_l = L * pads_sc + bass * pads_sc + drums; mix_r = R * pads_sc + bass * pads_sc + drums
    if lofi:
        crackle = (rng.random(N) > 0.9993) * rng.standard_normal(N) * 0.25 + lp(rng.standard_normal(N), 3000) * 0.006
        mix_l = lp(mix_l, 6500) + crackle; mix_r = lp(mix_r, 6500) + crackle
    st = np.stack([mix_l, mix_r], 1)
    fade = np.ones(N); a = int(END * SR); fade[a:] = np.linspace(1, 0, N - a); st *= fade[:, None]
    fi = int(0.4 * SR); st[:fi] *= np.linspace(0, 1, fi)[:, None]
    st = np.stack([lp(st[:, 0], 11000), lp(st[:, 1], 11000)], 1)
    st = np.tanh(st * 1.4) / np.tanh(1.4)
    st /= np.abs(st).max() / 0.89
    sf.write(f'{out}/{name}.wav', st, SR)
    print(name, f'{bpm} BPM, bar offset {off:.3f}s')

Am, F, C, G, Dm, E, Em = [57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62], [50, 53, 57], [52, 56, 59], [52, 55, 59]
build('A_dark_pulse', 110, [Am, F, C, G], [0, 1, 2, 3, 2, 1, 0, 2], drum_style='four', bass_oct=-24)
build('B_neon_glide', 100, [Am, F, Dm, E], [0, None, 2, 1, None, 3, 2, None], swing=0.35, drum_style='half', bass_oct=-24)
build('C_lofi_ledger', 86, [Dm, Am, F, C], [0, None, 1, None, 2, None, 1, None], swing=0.5, drum_style='lofi', bass_oct=-24, lofi=True, energy=0.8)
build('D_insider_drive', 120, [Em, C, G, Dm], [0, 2, 1, 3, 0, 2, 4, 2], drum_style='four', bass_oct=-24, energy=1.15)
