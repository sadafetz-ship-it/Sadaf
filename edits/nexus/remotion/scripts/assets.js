// Builds public/raw.mp4 (the edited base: raw 0–9.95 s + 13.85–32.20 s, retakes cut) if missing.
// Set NEXUS_RAW to the original upload. Symlinks break in Remotion bundles, so the file is written, not linked.
const {execSync} = require('child_process'); const fs = require('fs');
if (fs.existsSync('public/raw.mp4')) process.exit(0);
const src = process.env.NEXUS_RAW; if (!src) { console.error('Set NEXUS_RAW=/path/to/nexus.mp4'); process.exit(1); }
execSync(`ffmpeg -loglevel error -y -i "${src}" -filter_complex "[0:v]trim=0:9.95,setpts=PTS-STARTPTS[v0];[0:a]atrim=0:9.95,asetpts=PTS-STARTPTS,afade=t=out:st=9.92:d=0.03[a0];[0:v]trim=13.85:32.20,setpts=PTS-STARTPTS[v1];[0:a]atrim=13.85:32.20,asetpts=PTS-STARTPTS,afade=t=in:d=0.03[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -r 30 -c:v libx264 -crf 14 -pix_fmt yuv420p -c:a aac -b:a 256k public/raw.mp4`, {stdio: 'inherit'});
