import React from 'react';
import {Audio, getStaticFiles, Sequence, staticFile} from 'remotion';
import {f} from './timing';

/**
 * Sound-effect cues. Drop files into public/sfx/ with these names (mp3 or wav) and re-render.
 * Any missing file is simply skipped, so the edit renders fine with none, some or all of them.
 */
const CUES: {file: string; t: number; vol?: number}[] = [
  // riser into the first site
  {file: 'riser', t: 4.9, vol: 0.5},
  // whoosh on every mode switch
  ...[8.7, 11.96, 14.0, 20.56, 22.68, 27.72, 31.82, 33.5, 37.42, 39.2, 44.5].map((t) => ({file: 'whoosh', t: t - 0.12, vol: 0.55})),
  // soft impact when a site name lands behind the head
  ...[6.74, 12.98, 21.12, 38.34].map((t) => ({file: 'hit', t, vol: 0.6})),
  // UI pops: cards, tags, button
  ...[1.82, 16.7, 17.84, 19.04, 29.84, 30.66, 35.12].map((t) => ({file: 'pop', t, vol: 0.5})),
  // "mad" sting
  {file: 'sting', t: 4.46, vol: 0.5},
  // sparkle / shimmer on the coin and the recap
  {file: 'sparkle', t: 33.75, vol: 0.45},
  {file: 'sparkle', t: 44.7, vol: 0.45},
  // quick clicks while graph/bars draw
  ...[8.84, 25.32, 26.16, 40.44, 41.16].map((t) => ({file: 'click', t, vol: 0.35})),
];

export const Sfx: React.FC = () => {
  const have = new Map<string, string>();
  for (const s of getStaticFiles()) {
    const m = s.name.match(/^sfx\/([a-z]+)\.(mp3|wav|m4a|ogg)$/i);
    if (m) have.set(m[1].toLowerCase(), s.name);
  }
  return (
    <>
      {CUES.filter((c) => have.has(c.file)).map((c, i) => (
        <Sequence key={i} from={Math.max(0, f(c.t))} layout="none">
          <Audio src={staticFile(have.get(c.file)!)} volume={c.vol ?? 0.5} />
        </Sequence>
      ))}
    </>
  );
};
