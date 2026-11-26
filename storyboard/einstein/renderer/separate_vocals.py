# MDX-Net vocal separation (Kim_Vocal_2) — STFT 7680/1024, 3072 bins × 256 frames chunks.
import numpy as np, onnxruntime as ort, subprocess, soundfile as sf, sys
from scipy.signal import stft, istft, get_window
SR, NFFT, HOP, DIMF, DIMT = 44100, 7680, 1024, 3072, 256
CH = HOP * (DIMT - 1); TRIM = NFFT // 2; GEN = CH - 2 * TRIM
win = get_window('hann', NFFT); ws = win.sum()
sess = ort.InferenceSession(sys.argv[1], providers=['CPUExecutionProvider'])
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[2], '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
mix = np.frombuffer(raw, np.float32).reshape(-1, 2).T.copy()   # (2, n)
n = mix.shape[1]; pad = GEN - n % GEN
x = np.concatenate([np.zeros((2, TRIM)), mix, np.zeros((2, pad + TRIM))], 1)
out = np.zeros_like(x)
for i in range(0, n + pad, GEN):
    seg = x[:, i:i + CH]
    _, _, Z = stft(seg, window=win, nperseg=NFFT, noverlap=NFFT - HOP, boundary='even', padded=False, return_onesided=True)
    Z = Z * ws                                                   # match torch.stft (no scaling)
    Z = Z[:, :DIMF, :DIMT]
    inp = np.stack([Z[0].real, Z[0].imag, Z[1].real, Z[1].imag])[None].astype(np.float32)
    o = sess.run(None, {'input': inp})[0][0]
    S2 = np.zeros((2, NFFT // 2 + 1, o.shape[-1]), np.complex64)
    S2[0, :DIMF] = o[0] + 1j * o[1]; S2[1, :DIMF] = o[2] + 1j * o[3]
    _, y = istft(S2 / ws, window=win, nperseg=NFFT, noverlap=NFFT - HOP, boundary=True, input_onesided=True)
    y = y[:, :CH]; out[:, i + TRIM:i + TRIM + GEN] = y[:, TRIM:TRIM + GEN]
voc = out[:, TRIM:TRIM + n] * 1.009
sf.write(sys.argv[3] + '_vocals.wav', voc.T, SR); sf.write(sys.argv[3] + '_inst.wav', (mix - voc).T, SR)
print('done', n / SR, 's')
