"""Preview mixes: each candidate track under the finished Nexus edit.
- stretch to 122 BPM (the grid the 5 big hits sit on), choose its most energetic section,
  align one of its strong beats to the NEXUS hit (2.7 s);
- level the bed ≈14 dB under the voice, sidechain-duck it further while he talks,
  dip it 1 bar before "$10 million" (26.2–27.3 s) so the hit lands into space;
- keep the voice + SFX mix on top, limit to −2 dBFS.
"""
import json, subprocess, sys
import numpy as np, librosa

R = '/home/user/Sadaf/edits/nexus/remotion'
T = '/tmp/claude-0/-home-user-Sadaf/f5954015-c892-54a5-bfc7-c48901baf7de/scratchpad/music/tracks'
OUT = sys.argv[1]
META = {'Rising_Tide_faster': 122, 'Thats_a_Wrap': 124, 'Thinking_Out_Loud': 124, 'Galactic_Rap': 120, 'Cephalopod': 124, 'Long_Time_Coming': 120}
DUR, HIT = 28.8, 2.7


def rms_db(path, start=None, dur=None):
    cmd = ['ffmpeg', '-v', 'error']
    if start is not None:
        cmd += ['-ss', str(start), '-t', str(dur)]
    cmd += ['-i', path, '-ac', '1', '-f', 'f32le', '-']
    a = np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32)
    return 20 * np.log10(np.sqrt((a ** 2).mean()) + 1e-9)


voice_db = rms_db(f'{R}/public/raw.mp4')
report = []
for name, bpm in META.items():
    src = f'{T}/{name}/track.mp3'
    y, sr = librosa.load(src, sr=22050, mono=True)
    r = 122.0 / bpm                                   # atempo factor
    L = DUR * r                                       # source seconds needed
    onset = librosa.onset.onset_strength(y=y, sr=sr)
    _, beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, units='frames')
    bt = librosa.frames_to_time(beats, sr=sr)
    rms = librosa.feature.rms(y=y)[0]
    rt = librosa.frames_to_time(np.arange(len(rms)), sr=sr)
    best = None
    for i in range(0, len(bt), 4):                    # candidate downbeats every 4 beats
        b0 = bt[i]
        s = b0 - HIT * r
        if s < 8 or s + L > len(y) / sr - 1:          # skip the intro and the tail
            continue
        m = (rt >= s) & (rt < s + L)
        e = rms[m].mean() + 0.3 * onset[beats[i]] / onset.max()
        if best is None or e > best[0]:
            best = (e, s)
    s = best[1]
    seg_db = rms_db(src, s, L)
    gain = (voice_db - 8) - seg_db                    # measured: lands ≈17 dB under speech, ≈11 dB under in gaps
    fc = (
        f"[1:a]atrim={s:.3f}:{s + L:.3f},asetpts=PTS-STARTPTS,atempo={r:.5f},aresample=48000,"
        f"volume={gain:.2f}dB,"
        f"volume='if(between(t,26.2,27.28),0.25,1)':eval=frame,"   # 1-bar dip before $10M
        f"equalizer=f=1200:t=q:w=1.2:g=-4,"                         # carve space for the voice
        f"afade=t=in:st=0:d=0.4,afade=t=out:st={DUR - 1.2}:d=1.2[m];"
        f"[2:a]aresample=48000[key];"
        f"[m][key]sidechaincompress=threshold=0.03:ratio=4:attack=15:release=250:makeup=1[md];"
        f"[0:a]aresample=48000[mix];"
        f"[mix][md]amix=inputs=2:normalize=0,alimiter=limit=0.79:attack=2:release=40:level=false[a]"
    )
    out = f'{OUT}/nexus_{name}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{R}/out/nexus_final.mp4', '-i', src, '-i', f'{R}/public/raw.mp4',
                    '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k',
                    '-t', str(DUR), out], check=True)
    pk = 20 * np.log10(np.abs(np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', out, '-ac', '1', '-f', 'f32le', '-'],
                                                           capture_output=True).stdout, np.float32)).max())
    report.append({'track': name, 'bpm': bpm, 'stretch': round(r, 4), 'section_start_s': round(float(s), 2), 'bed_gain_db': round(float(gain), 1), 'peak_dbfs': round(float(pk), 2)})
    print(report[-1], flush=True)
json.dump(report, open(f'{OUT}/premix_report.json', 'w'), indent=1)
