import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(4);
Config.setCodec('h264');
Config.setCrf(18);
// Use the Chromium headless shell that ships with this environment (no download needed).
// Remove this line on your own machine — Remotion will fetch its own browser.
if (process.env.REMOTION_CHROME) Config.setBrowserExecutable(process.env.REMOTION_CHROME);
