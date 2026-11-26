import sys, glob, json, numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter
sess = ort.InferenceSession(sys.argv[1], providers=['CPUExecutionProvider'])
out = {}
for p in sorted(glob.glob(sys.argv[2] + '/F*.png')):
    if p.endswith('_cut.png'): continue
    im = Image.open(p).convert('RGB'); W, H = im.size
    x = np.asarray(im.resize((320, 320), Image.BILINEAR)).astype(np.float32) / 255.0
    x = ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
    m = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
    m = (m - m.min()) / (m.max() - m.min() + 1e-8)
    al = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.5))).copy()
    full = al.copy(); al[int(H * 0.56):] = 0
    Image.fromarray(np.dstack([np.asarray(im), al])).save(p[:-4] + '_cut.png')
    rows = np.where((full > 128).any(1))[0]; top = int(rows[0])
    band = full[top + 80: top + 320] > 128
    cols = np.where(band.any(0))[0]
    out[p.split('/')[-1][:-4]] = dict(top=top, x0=int(cols[0]), x1=int(cols[-1]), chin=top + 520)
    print(p, out[p.split('/')[-1][:-4]])
json.dump(out, open(sys.argv[2] + '/faces.json', 'w'))
