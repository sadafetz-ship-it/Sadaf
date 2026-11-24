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
SONGS = {'Freedom': '1a591ec1-Freedom.mp3', 'Dark_Red': '0591c744-Dark_Red.mp3',
         'Echo_Sax': '0ff02f01-Echo_Sax_Feeling_Blue_by_caleb.arredondo.mp3', 'Love_Me': '0ee614ee-Love_Me.mp3',
         'Cornfield_Chase': '46e7e3fa-Cornfield_Chase.mp3', 'Original_audio_WQFWRM': 'ecd5830e-Original_audio-WQFWRM.mp3',
         'THANK_YOU': '2493e7ff-THANK_YOU.mp3'}
HITS = np.array([2.7, 11.04, 16.0, 21.48, 27.32])
DUR = 28.8


def rms_db(cmd):
    a = np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32)
    return 20 * np.log10(np.sqrt((a ** 2).mean()) + 1e-9)


voice_db = rms_db(['ffmpeg', '-v', 'error', '-i', f'{R}/public/raw.mp4', '-ac', '1', '-f', 'f32le', '-'])
rep = []
for name, fn in SONGS.items():
    y, sr = librosa.load(U + fn, sr=22050, mono=True)
    max_start = len(y) / sr - DUR - 2
    rms = librosa.feature.rms(y=y)[0]; rt = librosa.frames_to_time(np.arange(len(rms)), sr=sr); rn = rms / rms.max()
    lvl = lambda a, b: rn[(rt >= a) & (rt < b)].mean()
    onset = librosa.onset.onset_strength(y=y, sr=sr)
    _, beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, units='frames')
    bt = librosa.frames_to_time(beats, sr=sr)
    strength = onset[beats] / onset.max()
    best = None
    for s in np.arange(0, max_start, 0.02):
        err, w = 0, 0
        for h in HITS:
            i = np.abs(bt - (s + h)).argmin()
            err += abs(bt[i] - (s + h)) * (1.5 - strength[i])   # prefer strong beats under the hits
        if lvl(s, s + 2) < 0.15:            # don't open on silence
            continue
        climax = lvl(s + 27.0, s + 28.3) - lvl(s + 24.0, s + 26.0)   # song gets bigger right at "$10 million"
        score = err / len(HITS) - 0.08 * climax - 0.04 * lvl(s, s + DUR)
        if best is None or score < best[0]:
            best = (score, s, err / len(HITS))
    s = float(best[1])
    seg_db = rms_db(['ffmpeg', '-v', 'error', '-ss', str(s), '-t', str(DUR), '-i', U + fn, '-ac', '1', '-f', 'f32le', '-'])
    gain = (voice_db - 1) - seg_db           # user: 'can't hear' at −20 dB under speech → now ≈ −9 dB under speech, ≈ −3 dB in gaps
    fc = (
        f"[1:a]atrim={s:.3f}:{s + DUR:.3f},asetpts=PTS-STARTPTS,aresample=48000,volume={gain:.2f}dB,"
        f"volume='if(between(t,26.2,27.28),0.25,1)':eval=frame,"
        f"equalizer=f=1500:t=q:w=1.0:g=-3,"
        f"afade=t=in:st=0:d=0.4,afade=t=out:st={DUR - 1.2}:d=1.2[m];"
        f"[2:a]aresample=48000[key];"
        f"[m][key]sidechaincompress=threshold=0.04:ratio=3:attack=15:release=300:makeup=1[md];"
        f"[0:a]aresample=48000[mix];"
        f"[mix][md]amix=inputs=2:normalize=0,alimiter=limit=0.79:attack=2:release=40:level=false[a]"
    )
    out = f'{OUT}/nexus_song_{name}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{R}/out/nexus_final.mp4', '-i', U + fn, '-i', f'{R}/public/raw.mp4',
                    '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k',
                    '-t', str(DUR), out], check=True)
    pk = 20 * np.log10(np.abs(np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', out, '-ac', '1', '-f', 'f32le', '-'],
                                                           capture_output=True).stdout, np.float32)).max())
    rep.append({'song': name, 'start_in_song_s': round(s, 2), 'mean_hit_to_beat_error_s': round(float(best[2]), 3),
                'gain_db': round(float(gain), 1), 'peak_dbfs': round(float(pk), 2)})
    print(rep[-1], flush=True)
json.dump(rep, open(f'{OUT}/songmix3_report.json', 'w'), indent=1)
