// Vintage parchment map of central Europe with Einstein's route Ulm (1879) → Zürich (1900) → Bern (1902).
// Borders come from Natural Earth via the world-atlas package.
import React, { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import topo from 'world-atlas/countries-50m.json';
import { E, F, P, RED } from './lib';

const W = 1920, H = 1080;
export const CITIES = [
  { name: 'ULM', year: 'born 1879', lon: 9.99, lat: 48.4 },
  { name: 'ZÜRICH', year: 'ETH, 1900', lon: 8.54, lat: 47.37 },
  { name: 'BERN', year: '1902', lon: 7.45, lat: 46.95 },
];
const HIGHLIGHT = new Set(['756']); // Switzerland (ISO numeric)

export const useMap = () => useMemo(() => {
  const proj = geoMercator().center([8.6, 47.6]).scale(13000).translate([W / 2, H / 2 + 40]);
  const path = geoPath(proj);
  const fc: any = feature(topo as any, (topo as any).objects.countries);
  const countries = fc.features.map((f: any) => ({ id: String(f.id), d: path(f) || '' })).filter((c: any) => c.d.length > 0);
  const pts = CITIES.map((c) => proj([c.lon, c.lat]) as [number, number]);
  return { countries, pts };
}, []);

/** t: scene seconds. Route draws 0.1→0.8 s, pins pop as reached, then camera zooms into Bern. */
export const EuropeMap: React.FC<{ t: number }> = ({ t }) => {
  const { countries, pts } = useMap();
  const route = `M${pts[0][0]},${pts[0][1]} Q${(pts[0][0] + pts[1][0]) / 2 + 40},${(pts[0][1] + pts[1][1]) / 2 - 60} ${pts[1][0]},${pts[1][1]} Q${(pts[1][0] + pts[2][0]) / 2 - 10},${(pts[1][1] + pts[2][1]) / 2 - 50} ${pts[2][0]},${pts[2][1]}`;
  const r = E.io(P(t, 0.1, 0.8));
  const z = E.i3(P(t, 0.75, 1.3)), [bx, by] = pts[2];
  return (
    <AbsoluteFill style={{ background: '#d8cfb6' }}>
      <AbsoluteFill style={{ transformOrigin: `${bx}px ${by}px`, transform: `scale(${1 + 2.2 * z})` }}>
        <svg width={W} height={H} style={{ position: 'absolute' }}>
          <defs>
            <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves={3} seed={4} /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope=".18" /></feComponentTransfer></filter>
            <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="10" stroke={RED} strokeWidth="2" opacity=".35" /></pattern>
          </defs>
          {countries.map((c: any) => (
            <g key={c.id}>
              <path d={c.d} fill={HIGHLIGHT.has(c.id) ? '#efe3c4' : '#ebe2c8'} stroke="#8a7a5a" strokeWidth={1.6} strokeDasharray={HIGHLIGHT.has(c.id) ? undefined : '6 4'} />
              {HIGHLIGHT.has(c.id) && <path d={c.d} fill="url(#hatch)" stroke={RED} strokeWidth={2.5} opacity={E.x(P(t, 0.55, 0.85))} />}
            </g>
          ))}
          <text x={pts[1][0] - 60} y={pts[1][1] + 130} style={{ font: '400 30px "Special Elite"', letterSpacing: 8, fill: '#7a6a4a', opacity: 0.8 }}>SCHWEIZ</text>
          <text x={pts[0][0] + 40} y={pts[0][1] - 120} style={{ font: '400 30px "Special Elite"', letterSpacing: 8, fill: '#7a6a4a', opacity: 0.8 }}>DEUTSCHES REICH</text>
          <path d={route} fill="none" stroke={RED} strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" pathLength={1000}
            style={{ strokeDashoffset: 0 }} mask="url(#routeMask)" />
          <mask id="routeMask"><path d={route} fill="none" stroke="#fff" strokeWidth={12} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - r} /></mask>
          {pts.map(([x, y], i) => {
            const at = [0.1, 0.45, 0.8][i], p = E.back(P(t, at, at + 6 * F));
            return (
              <g key={i} transform={`translate(${x},${y}) scale(${p})`} opacity={t < at ? 0 : 1}>
                <circle r={13} fill={RED} stroke="#fff" strokeWidth={4} />
                <text x={22} y={-8} style={{ font: '700 30px Poppins', letterSpacing: 4, fill: '#2a2218' }}>{CITIES[i].name}</text>
                <text x={22} y={26} style={{ font: '400 24px "Special Elite"', fill: '#5a4a32' }}>{CITIES[i].year}</text>
              </g>
            );
          })}
          <rect width={W} height={H} filter="url(#paper)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%,transparent 45%,rgba(60,40,20,.45) 100%)' }} />
    </AbsoluteFill>
  );
};
