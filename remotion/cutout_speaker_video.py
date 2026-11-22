# Stream a video through U2Net human segmentation; emit RGBA raw frames to stdout.
import sys, subprocess, numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter
model, src, W, H, n = sys.argv[1], sys.argv[2], 1080, 1920, int(sys.argv[3])
sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
dec = subprocess.Popen(["ffmpeg","-v","error","-i",src,"-frames:v",str(n),"-f","rawvideo","-pix_fmt","rgb24","-"], stdout=subprocess.PIPE)
out = sys.stdout.buffer; i = 0
while True:
    buf = dec.stdout.read(W*H*3)
    if len(buf) < W*H*3: break
    rgb = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    im = Image.fromarray(rgb)
    x = np.asarray(im.resize((320,320), Image.BILINEAR)).astype(np.float32)/255.0
    x = ((x-[0.485,0.456,0.406])/[0.229,0.224,0.225]).transpose(2,0,1)[None].astype(np.float32)
    m = sess.run(None, {sess.get_inputs()[0].name: x})[0][0,0]
    m = (m-m.min())/(m.max()-m.min()+1e-8)
    a = np.asarray(Image.fromarray((m*255).astype(np.uint8)).resize((W,H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.5)))
    a = a.copy(); a[int(H*0.56):] = 0            # only head + shoulders are needed in front of text
    out.write(np.dstack([rgb, a]).tobytes()); i += 1
    if i % 100 == 0: print(i, file=sys.stderr, flush=True)
