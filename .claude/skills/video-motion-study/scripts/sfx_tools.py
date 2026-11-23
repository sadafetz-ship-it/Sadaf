#!/usr/bin/env python3
"""SFX helpers.

  analyse  FILES...                         duration, onset, peak offset, body length, brightness (centroid), loudness, dupes
  split    VIDEO OUTDIR name=start-end ...  cut events out of a reference video (5 ms / 40 ms fades), peak-normalise to -3 dBFS
  normalise IN OUT                          peak-normalise one file to -3 dBFS (48 kHz stereo)

Place cues so the file's PEAK lands on the animation frame: start = at - peak_offset.
Run Whisper on unknown long files first: if it transcribes speech, it is a voiceover, not an SFX.
"""
import hashlib, os, re, subprocess, sys
import numpy as np

def load(f, sr=16000):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32)

def max_db(f):
    err = subprocess.run(['ffmpeg', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.search(r'max_volume: ([-0-9.]+)', err).group(1))

def normalise(src, dst):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', f'volume={-3 - max_db(src)}dB', '-ac', '2', '-ar', '48000', dst], check=True)

def analyse(files):
    seen = {}
    for f in files:
        a = load(f); sr = 16000
        if not len(a): continue
        env = np.sqrt(np.convolve(a * a, np.ones(320) / 320, 'same'))
        pk = env.argmax() / sr; on = np.argmax(env > env.max() * 0.2) / sr
        idx = np.where(env > env.max() * 0.1)[0]; body = (idx[-1] - idx[0]) / sr if len(idx) else 0
        i = env.argmax(); seg = a[max(0, i - 1600):i + 1600]
        sp = np.abs(np.fft.rfft(seg * np.hanning(len(seg)))); fr = np.fft.rfftfreq(len(seg), 1 / sr)
        h = hashlib.md5(open(f, 'rb').read()).hexdigest(); dup = seen.get(h); seen.setdefault(h, os.path.basename(f))
        print(f"{os.path.basename(f):44s} dur {len(a)/sr:5.2f}s onset {on:4.2f} PEAK {pk:4.2f} body {body:4.2f} "
              f"centroid {(sp*fr).sum()/sp.sum():5.0f}Hz peak {20*np.log10(np.abs(a).max()+1e-9):5.1f}dB" + (f"  DUP of {dup}" if dup else ''))

def split(video, outdir, specs):
    os.makedirs(outdir, exist_ok=True)
    wav = os.path.join(outdir, '_src.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-vn', '-ac', '2', '-ar', '48000', wav], check=True)
    for s in specs:
        name, rng = s.split('='); a, b = map(float, rng.split('-')); d = b - a
        tmp = os.path.join(outdir, f'_{name}.wav'); out = os.path.join(outdir, f'{name}.wav')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(a), '-t', str(d), '-i', wav,
                        '-af', f'afade=t=in:d=0.005,afade=t=out:st={d-0.04:.3f}:d=0.04', tmp], check=True)
        normalise(tmp, out); os.remove(tmp); print('cut', out)
    os.remove(wav)

if __name__ == '__main__':
    cmd, *rest = sys.argv[1:] or ['-h']
    if cmd == 'analyse': analyse(rest)
    elif cmd == 'split': split(rest[0], rest[1], rest[2:])
    elif cmd == 'normalise': normalise(rest[0], rest[1])
    else: print(__doc__)
