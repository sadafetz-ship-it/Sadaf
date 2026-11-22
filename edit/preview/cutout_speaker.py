import sys, numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter
sess = ort.InferenceSession(sys.argv[1], providers=["CPUExecutionProvider"])
for src, dst in zip(sys.argv[2::2], sys.argv[3::2]):
    im = Image.open(src).convert("RGB"); W, H = im.size
    x = np.asarray(im.resize((320, 320), Image.LANCZOS)).astype(np.float32) / 255.0
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    x = x.transpose(2, 0, 1)[None].astype(np.float32)
    m = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
    m = (m - m.min()) / (m.max() - m.min() + 1e-8)
    a = Image.fromarray((m * 255).astype(np.uint8)).resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.5))
    im.putalpha(a); im.save(dst)
    print(dst)
