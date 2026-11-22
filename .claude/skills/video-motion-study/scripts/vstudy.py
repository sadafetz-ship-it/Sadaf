#!/usr/bin/env python3
"""Helper for studying reference motion-design videos with ffmpeg.

Subcommands
  probe   <out_dir> <video>...            -> index.tsv + overview.jpg (one labelled mid-frame per video)
  split   <out_dir> <ID>=<video>[@CxR] ... -> clips/<ID>.mp4 (or <ID>a,b,c,... per grid cell)
  sheets  <out_dir> [--fps 6]             -> review/<clip>_NN.jpg (timestamped overview sheets)
  frames  <out_dir>                       -> frame_by_frame/<clip>/sheet_NNN.jpg (every frame, numbered)
  zoom    <out_dir> <clip> --crop W:H:X:Y [--fps 2] [--start S] [--end E] [--cols 12]
                                          -> zoom/<clip>_<tag>.jpg (crop a region over time)
  web     <out_dir>                       -> small re-encoded copies in clips_web/ for committing

Only needs ffmpeg/ffprobe on PATH. Grid cells are named a,b,c,d... reading
left-to-right, top-to-bottom (2x2: a=TL b=TR c=BL d=BR).
"""
import argparse, json, math, os, string, subprocess, sys

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(r.stderr[-2000:])
        raise SystemExit(f"command failed: {' '.join(cmd[:6])} ...")
    return r.stdout

def probe_one(path):
    out = run(["ffprobe", "-v", "error", "-show_entries",
               "format=duration:stream=codec_type,width,height,r_frame_rate",
               "-of", "json", path])
    d = json.loads(out)
    v = next((s for s in d["streams"] if s["codec_type"] == "video"), {})
    num, den = (v.get("r_frame_rate", "0/1").split("/") + ["1"])[:2]
    fps = round(float(num) / float(den or 1), 3) if float(den or 1) else 0
    return {"duration": round(float(d["format"].get("duration", 0)), 2),
            "width": v.get("width"), "height": v.get("height"), "fps": fps,
            "audio": any(s["codec_type"] == "audio" for s in d["streams"])}

def clips(out):
    cdir = os.path.join(out, "clips")
    return sorted(f[:-4] for f in os.listdir(cdir) if f.endswith(".mp4"))

def cmd_probe(a):
    os.makedirs(a.out, exist_ok=True)
    rows, thumbs = [], []
    for i, p in enumerate(a.videos, 1):
        vid = f"V{i:02d}"
        info = probe_one(p)
        rows.append([vid, os.path.basename(p), info["duration"], f'{info["width"]}x{info["height"]}',
                     info["fps"], "yes" if info["audio"] else "no"])
        t = os.path.join(a.out, f".mid_{vid}.png")
        run(["ffmpeg", "-v", "error", "-y", "-ss", str(min(2, info["duration"] / 2)), "-i", p,
             "-frames:v", "1", "-vf",
             f"scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2,"
             f"drawtext=text={vid}:x=6:y=440:fontsize=30:fontcolor=yellow:box=1:boxcolor=black", t])
        thumbs.append(t)
    with open(os.path.join(a.out, "index.tsv"), "w") as f:
        f.write("id\tfile\tduration_s\tsize\tfps\taudio\n")
        for r in rows:
            f.write("\t".join(map(str, r)) + "\n")
    cols = min(8, len(thumbs))
    layout = "|".join(f"{(k % cols) * 270}_{(k // cols) * 480}" for k in range(len(thumbs)))
    args = sum((["-i", t] for t in thumbs), [])
    fc = "".join(f"[{k}]" for k in range(len(thumbs)))
    if len(thumbs) == 1:
        run(["ffmpeg", "-v", "error", "-y", *args, os.path.join(a.out, "overview.jpg")])
    else:
        run(["ffmpeg", "-v", "error", "-y", *args, "-filter_complex",
             f"{fc}xstack=inputs={len(thumbs)}:layout={layout}:fill=black",
             os.path.join(a.out, "overview.jpg")])
    for t in thumbs:
        os.remove(t)
    print(open(os.path.join(a.out, "index.tsv")).read())
    print("overview:", os.path.join(a.out, "overview.jpg"))

def cmd_split(a):
    cdir = os.path.join(a.out, "clips"); os.makedirs(cdir, exist_ok=True)
    for spec in a.specs:
        vid, rest = spec.split("=", 1)
        grid = None
        if "@" in rest and rest.rsplit("@", 1)[1].lower().count("x") == 1:
            rest, g = rest.rsplit("@", 1)
            grid = tuple(int(x) for x in g.lower().split("x"))  # cols x rows
        path = rest
        if not grid:
            run(["ffmpeg", "-v", "error", "-y", "-i", path, "-c", "copy", os.path.join(cdir, vid + ".mp4")])
            print(vid); continue
        info = probe_one(path); c, r = grid
        cw, ch = info["width"] // c, info["height"] // r
        cw -= cw % 2; ch -= ch % 2
        for k in range(c * r):
            x, y = (k % c) * (info["width"] // c), (k // c) * (info["height"] // r)
            name = vid + string.ascii_lowercase[k]
            run(["ffmpeg", "-v", "error", "-y", "-i", path, "-vf", f"crop={cw}:{ch}:{x}:{y}",
                 "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-c:a", "aac",
                 os.path.join(cdir, name + ".mp4")])
            print(name)

def tile_sheets(src, pattern, fps, width, cols, rows, label, quality=4):
    vf = []
    if fps:
        vf.append(f"fps={fps}")
    vf += [f"scale={width}:-2",
           f"drawtext=text='{label}':x=3:y=3:fontsize={max(11, width // 13)}:fontcolor=yellow:box=1:boxcolor=black@0.7",
           f"tile={cols}x{rows}"]
    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf", ",".join(vf), "-q:v", str(quality), pattern])

def cmd_sheets(a):
    d = os.path.join(a.out, "review"); os.makedirs(d, exist_ok=True)
    for c in clips(a.out):
        tile_sheets(os.path.join(a.out, "clips", c + ".mp4"), os.path.join(d, f"{c}_%02d.jpg"),
                    a.fps, a.width, 8, 4, "%{pts\\:flt}")
    print(f"{len(os.listdir(d))} sheets in {d} ({a.fps} fps, 32 frames = {32 / a.fps:.1f}s per sheet)")

def cmd_frames(a):
    root = os.path.join(a.out, "frame_by_frame")
    for c in clips(a.out):
        d = os.path.join(root, c); os.makedirs(d, exist_ok=True)
        tile_sheets(os.path.join(a.out, "clips", c + ".mp4"), os.path.join(d, "sheet_%03d.jpg"),
                    None, a.width, 10, 5, "f%{n} %{pts\\:flt}", quality=5)
        print(c, len(os.listdir(d)), "sheets")

def cmd_zoom(a):
    d = os.path.join(a.out, "zoom"); os.makedirs(d, exist_ok=True)
    src = os.path.join(a.out, "clips", a.clip + ".mp4")
    dur = probe_one(src)["duration"]
    start, end = a.start or 0, a.end or dur
    n = max(1, math.ceil((end - start) * a.fps))
    cols = min(a.cols, n)
    rows = math.ceil(n / cols)
    tag = a.tag or f"{start:g}-{end:g}s"
    out = os.path.join(d, f"{a.clip}_{tag}.jpg")
    run(["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-to", str(end), "-i", src, "-vf",
         f"setpts=PTS+{start}/TB,fps={a.fps},crop={a.crop},scale={a.width}:-2,"
         f"drawtext=text='%{{pts\\:flt}}':x=3:y=3:fontsize=13:fontcolor=yellow:box=1:boxcolor=black,"
         f"tile={cols}x{rows}", "-frames:v", "1", out])
    print(out)

def cmd_web(a):
    d = os.path.join(a.out, "clips_web"); os.makedirs(d, exist_ok=True)
    for c in clips(a.out):
        run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(a.out, "clips", c + ".mp4"),
             "-vf", "scale='min(540,iw)':-2", "-c:v", "libx264", "-crf", "27", "-preset", "medium",
             "-c:a", "aac", "-b:a", "96k", os.path.join(d, c + ".mp4")])
    print("web copies in", d)

def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    s = p.add_subparsers(dest="cmd", required=True)
    x = s.add_parser("probe"); x.add_argument("out"); x.add_argument("videos", nargs="+"); x.set_defaults(f=cmd_probe)
    x = s.add_parser("split"); x.add_argument("out"); x.add_argument("specs", nargs="+",
        help="ID=path or ID=path@2x2 (cols x rows)"); x.set_defaults(f=cmd_split)
    x = s.add_parser("sheets"); x.add_argument("out"); x.add_argument("--fps", type=float, default=6)
    x.add_argument("--width", type=int, default=240); x.set_defaults(f=cmd_sheets)
    x = s.add_parser("frames"); x.add_argument("out"); x.add_argument("--width", type=int, default=144); x.set_defaults(f=cmd_frames)
    x = s.add_parser("zoom"); x.add_argument("out"); x.add_argument("clip"); x.add_argument("--crop", required=True)
    x.add_argument("--fps", type=float, default=2); x.add_argument("--start", type=float); x.add_argument("--end", type=float)
    x.add_argument("--cols", type=int, default=12); x.add_argument("--width", type=int, default=200)
    x.add_argument("--tag"); x.set_defaults(f=cmd_zoom)
    x = s.add_parser("web"); x.add_argument("out"); x.set_defaults(f=cmd_web)
    a = p.parse_args(); a.f(a)

if __name__ == "__main__":
    main()
