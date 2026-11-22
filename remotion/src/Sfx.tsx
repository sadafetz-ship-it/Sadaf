import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {CAPTION_GROUPS, f, FPS} from './timing';

/**
 * Sound design. Files live in public/sfx/ (peak-normalised to −3 dBFS).
 * Each cue's `at` is the animation moment; `peak` is where the sound's own peak sits inside the file,
 * so the sound starts at `at − peak` and its hit lands exactly on the frame.
 */
type Cue = {file: string; at: number; peak?: number; vol: number; len?: number};

const PEAK: Record<string, number> = {
  whoosh_a: 0.51, whoosh_b: 0.4, whoosh_deep: 0.3, whoosh_air: 0.72, whoosh_arrow: 0.29, impact: 0.28, data_load: 0.62,
  soft_ui: 0.21, dissolve: 0.11, digital_burst: 0.23, premium_open: 0.73, paper_slide: 0.35, pop_ui: 0.28, pop_media: 0.12,
  pop_double: 0.14, button_2: 0.06, click_digital: 0.07, stretch: 0.32, menu: 0.11, game_over: 0.11, typing: 0,
  gears: 0.1, premium_gear: 0.3, sparkle: 0.55, double_click: 0.12, notification: 0.2, ui_enter: 0.08, riser: 2.71,
  button_1: 0.15, button_3: 0.04, envoye: 0.21, interface: 0.21, scifi_ui: 0.26,
};

const NAMES = [6.74, 12.98, 21.12, 38.34];
const heavyLands = CAPTION_GROUPS.filter((g) => g.h.length).map((g) => g.h[0].t);
const captionChanges = CAPTION_GROUPS.slice(1).map((g) => g.start);

const CUES: Cue[] = [
  // ── opening + hook
  {file: 'scifi_ui', at: 0.12, vol: 0.35},
  {file: 'typing', at: 1.22, vol: 0.35, len: 0.9},            // text arcing over the head types on
  {file: 'paper_slide', at: 1.82, vol: 0.45},                  // "Classified" card slides up
  {file: 'game_over', at: 4.46, vol: 0.45},                    // "mad" 😤 retro fail sting
  {file: 'pop_double', at: 5.7, vol: 0.5},                     // tilted "free." bounces
  {file: 'stretch', at: 5.8, vol: 0.3},                        // ring draws round "free."
  {file: 'riser', at: 6.74, vol: 0.45},                        // builds into the first site name
  {file: 'whoosh_air', at: 6.2, vol: 0.3},                     // swoosh streak on "First,"
  // ── site names behind the head: pixel loader → impact → pill tag
  ...NAMES.flatMap((t) => [
    {file: 'data_load', at: t, vol: 0.35},
    {file: 'impact', at: t, vol: 0.6},
    {file: 'button_2', at: t + 0.2, vol: 0.4},
  ]),
  // ── scene switches (whoosh + digital burst for the pixel grid)
  ...[[8.7, 'whoosh_a'], [11.96, 'whoosh_b'], [14.0, 'whoosh_a'], [20.56, 'whoosh_b'], [22.68, 'whoosh_a'],
    [27.72, 'whoosh_b'], [31.82, 'whoosh_a'], [37.42, 'whoosh_b']].flatMap(([t, w]) => [
    {file: w as string, at: t as number, vol: 0.5},
    {file: 'digital_burst', at: t as number, vol: 0.22},
  ]),
  {file: 'whoosh_deep', at: 33.5, vol: 0.45},                  // into the CTA insert
  // ── DefiLlama dashboard
  {file: 'premium_open', at: 8.85, vol: 0.25},
  {file: 'gears', at: 8.84, vol: 0.35},                        // curve draws on
  {file: 'pop_ui', at: 9.34, vol: 0.45},                       // glowing dot
  ...[0, 1, 2, 3].map((i) => ({file: 'click_digital', at: 10.58 + i * 0.1, vol: 0.3})), // chips
  // ── CoinGlass three cards
  ...[16.7, 17.84, 19.04].map((t) => ({file: 'pop_media', at: t, vol: 0.5})),
  // ── CryptoQuant
  {file: 'button_3', at: 23.62, vol: 0.4},                     // "On-chain" chip
  {file: 'whoosh_arrow', at: 25.5, vol: 0.4},                  // INFLOWS arrow draws
  {file: 'whoosh_arrow', at: 26.34, vol: 0.4},                 // OUTFLOWS arrow draws
  {file: 'gears', at: 28.0, vol: 0.3},                         // chart draws on
  {file: 'pop_ui', at: 29.84, vol: 0.5},                       // ENTRY
  {file: 'pop_ui', at: 30.66, vol: 0.5},                       // EXIT
  {file: 'pop_double', at: 32.6, vol: 0.4},                    // tilted "one."
  // ── CTA
  {file: 'sparkle', at: 33.78, vol: 0.4},                      // ₿ coin flips in
  {file: 'premium_gear', at: 34.0, vol: 0.35},                 // progress bar fills
  {file: 'double_click', at: 35.12, vol: 0.55},                // "comment" → button pressed
  {file: 'notification', at: 35.4, vol: 0.45},                 // "Bitcoin" lands
  {file: 'stretch', at: 35.47, vol: 0.25},                     // ring round "Bitcoin."
  // ── Farside: typing bar → orb drop → card → buttons → cube
  {file: 'whoosh_a', at: 39.2, vol: 0.5},
  {file: 'digital_burst', at: 39.2, vol: 0.22},
  {file: 'typing', at: 39.27, vol: 0.4, len: 0.45},
  {file: 'stretch', at: 39.8, vol: 0.25},                      // orb lifts off the "+"
  {file: 'premium_open', at: 40.44, vol: 0.4},                 // orb drops, card opens
  {file: 'button_1', at: 40.44, vol: 0.4},
  {file: 'button_3', at: 41.16, vol: 0.45},
  {file: 'envoye', at: 42.34, vol: 0.45},
  {file: 'interface', at: 43.24, vol: 0.45},
  {file: 'pop_double', at: 43.4, vol: 0.45},                   // 3D cube bounces in
  {file: 'sparkle', at: 43.45, vol: 0.3},
  {file: 'dissolve', at: 44.6, vol: 0.3},                      // card collapses
  // ── small caption details
  ...heavyLands.map((t) => ({file: 'soft_ui', at: t, vol: 0.25})),      // heavy word smears in
  ...captionChanges.map((t) => ({file: 'dissolve', at: t, vol: 0.18})), // pixel dissolve
  ...[7.82, 14.88, 23.16, 34.2, 40.06].map((t) => ({file: 'click_digital', at: t + 0.1, vol: 0.3})), // box flashes
  ...[20.03, 31.01].map((t) => ({file: 'menu', at: t, vol: 0.35})),     // highlight bars
];

export const Sfx: React.FC = () => (
  <>
    {CUES.map((c, i) => {
      const start = c.at - (c.peak ?? PEAK[c.file] ?? 0);
      const from = Math.max(0, f(start));
      const trim = start < 0 ? f(-start) : 0;
      return (
        <Sequence key={i} from={from} durationInFrames={c.len ? Math.round(c.len * FPS) : undefined} layout="none">
          <Audio src={staticFile(`sfx/${c.file}.wav`)} volume={c.vol} startFrom={trim} />
        </Sequence>
      );
    })}
  </>
);
