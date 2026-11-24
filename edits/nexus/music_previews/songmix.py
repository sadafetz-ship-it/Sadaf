"""Preview mixes with the user's own songs (vocal songs: no time-stretch).
Pick the start point (within the first `max_start` s) whose beat grid best matches the 5 big hits,
sit the song lower than an instrumental (vocals compete with speech), duck harder while he talks,
carve the vocal/speech band, dip 1 bar before "$10 million", keep voice + SFX on top.
"""
import json, subprocess, sys
import numpy as np, librosa

R = '/home/user/Sadaf/edits/nexus/remotion'
U = '/root/.claude/uploads/f5954015-c892-54a5-bfc7-c48901baf7de/'
OUT = sys.argv[1]
SONGS = {'Blinding_Lights': ('a7cc1dca-Blinding_Lights.mp3', 40), 'Money_Trees': ('3ee5dbf7-Money_Trees_feat._Jay_Rock.mp3', 40)}
HITS = np.array([2.7, 11.04, 16.0, 21.48, 27.32])
DUR = 28.8


def rms_db(cmd):
    a = np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32)
    return 20 * np.log10(np.sqrt((a ** 2).mean()) + 1e-9)


voice_db = rms_db(['ffmpeg', '-v', 'error', '-i', f'{R}/public/raw.mp4', '-ac', '1', '-f', 'f32le', '-'])
rep = []
for name, (fn, max_start) in SONGS.items():
    y, sr = librosa.load(U + fn, sr=22050, mono=True, duration=max_start + DUR + 5)
    onset = librosa.onset.onset_strength(y=y, sr=sr)
    _, beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, units='frames')
    bt = librosa.frames_to_time(beats, sr=sr)
    strength = onset[beats] / onset.max()
    best = None
    for s in np.arange(0, max_start, 0.01):
        err, w = 0, 0
        for h in HITS:
            i = np.abs(bt - (s + h)).argmin()
            err += abs(bt[i] - (s + h)) * (1.5 - strength[i])   # prefer strong beats under the hits
        if best is None or err < best[0]:
            best = (err, s)
    s = float(best[1])
    seg_db = rms_db(['ffmpeg', '-v', 'error', '-ss', str(s), '-t', str(DUR), '-i', U + fn, '-ac', '1', '-f', 'f32le', '-'])
    gain = (voice_db - 11) - seg_db          # a little lower than the instrumentals: lyrics compete with speech
    fc = (
        f"[1:a]atrim={s:.3f}:{s + DUR:.3f},asetpts=PTS-STARTPTS,aresample=48000,volume={gain:.2f}dB,"
        f"volume='if(between(t,26.2,27.28),0.25,1)':eval=frame,"
        f"equalizer=f=1500:t=q:w=1.0:g=-6,"
        f"afade=t=in:st=0:d=0.4,afade=t=out:st={DUR - 1.2}:d=1.2[m];"
        f"[2:a]aresample=48000[key];"
        f"[m][key]sidechaincompress=threshold=0.025:ratio=6:attack=10:release=300:makeup=1[md];"
        f"[0:a]aresample=48000[mix];"
        f"[mix][md]amix=inputs=2:normalize=0,alimiter=limit=0.79:attack=2:release=40:level=false[a]"
    )
    out = f'{OUT}/nexus_song_{name}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{R}/out/nexus_final.mp4', '-i', U + fn, '-i', f'{R}/public/raw.mp4',
                    '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k',
                    '-t', str(DUR), out], check=True)
    pk = 20 * np.log10(np.abs(np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', out, '-ac', '1', '-f', 'f32le', '-'],
                                                           capture_output=True).stdout, np.float32)).max())
    rep.append({'song': name, 'start_in_song_s': round(s, 2), 'mean_hit_to_beat_error_s': round(float(best[0]) / len(HITS), 3),
                'gain_db': round(float(gain), 1), 'peak_dbfs': round(float(pk), 2)})
    print(rep[-1], flush=True)
json.dump(rep, open(f'{OUT}/songmix_report.json', 'w'), indent=1)
