import sys, numpy as np, onnxruntime as ort
from PIL import Image
sess = ort.InferenceSession(sys.argv[1], providers=['CPUExecutionProvider'])
inp = sess.get_inputs()[0]; size = 1024
for src in sys.argv[2:]:
    im = Image.open(src).convert('RGB'); W, H = im.size
    x = np.asarray(im.resize((size, size), Image.BILINEAR)).astype(np.float32) / 255.
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    x = x.transpose(2, 0, 1)[None].astype(np.float32)
    out = sess.run(None, {inp.name: x})[-1][0, 0]
    m = 1 / (1 + np.exp(-out)) if out.min() < 0 or out.max() > 1 else out
    m = Image.fromarray((m * 255).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)
    rgba = im.copy(); rgba.putalpha(m)
    dst = src.rsplit('.', 1)[0] + '_cut.png'; rgba.save(dst); print('cut', dst)
