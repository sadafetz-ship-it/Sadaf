import sys, subprocess, numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter
model, video, out_dir, *times = sys.argv[1:]
sess = ort.InferenceSession(model, providers=['CPUExecutionProvider'])
for t in times:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', t, '-i', video, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    rgb = np.frombuffer(raw, np.uint8).reshape(1080, 1920, 3)
    x = np.asarray(Image.fromarray(rgb).resize((320, 320), Image.BILINEAR)).astype(np.float32) / 255.0
    x = ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
    m = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
    m = (m - m.min()) / (m.max() - m.min() + 1e-8)
    al = Image.fromarray((m * 255).astype(np.uint8)).resize((1920, 1080), Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.2))
    al = np.asarray(al).astype(np.float32); al = np.clip((al - 40) * 1.25, 0, 255).astype(np.uint8)   # tighten soft halo
    Image.fromarray(np.dstack([rgb, al])).save(f'{out_dir}/cut_{t}.png')
    Image.fromarray(rgb).save(f'{out_dir}/full_{t}.png')
    ys, xs = np.nonzero(al > 128); print(t, 'person box x', xs.min(), xs.max(), 'y', ys.min(), ys.max())
