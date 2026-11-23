#!/usr/bin/env python3
"""Cut the speaker out of every frame → VP9 WebM with alpha (for text BEHIND the head in Remotion).

Model: u2net_human_seg.onnx (https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net_human_seg.onnx)
Needs: pip install onnxruntime pillow numpy ; ffmpeg.

Usage: python3 -I cutout_speaker.py MODEL.onnx INPUT.mp4 OUTPUT.webm [--keep 0.56] [--w 1080 --h 1920 --fps 30]
--keep: fraction of frame height (from the top) whose alpha is kept; below is cleared (head + shoulders only).
"""
import argparse, subprocess, sys
import numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument('model'); ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--keep', type=float, default=0.56)
ap.add_argument('--w', type=int, default=1080); ap.add_argument('--h', type=int, default=1920); ap.add_argument('--fps', default='30')
a = ap.parse_args()
W, H = a.w, a.h
sess = ort.InferenceSession(a.model, providers=['CPUExecutionProvider'])
dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', a.src, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{W}x{H}', '-r', a.fps, '-i', '-',
                        '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '2M', '-deadline', 'realtime', '-cpu-used', '8', '-row-mt', '1', a.out],
                       stdin=subprocess.PIPE)
n = 0
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    rgb = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    x = np.asarray(Image.fromarray(rgb).resize((320, 320), Image.BILINEAR)).astype(np.float32) / 255.0
    x = ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
    m = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
    m = (m - m.min()) / (m.max() - m.min() + 1e-8)
    al = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.5))).copy()
    al[int(H * a.keep):] = 0
    enc.stdin.write(np.dstack([rgb, al]).tobytes()); n += 1
    if n % 100 == 0: print(n, 'frames', file=sys.stderr, flush=True)
enc.stdin.close(); enc.wait(); print('done', n, 'frames →', a.out)
