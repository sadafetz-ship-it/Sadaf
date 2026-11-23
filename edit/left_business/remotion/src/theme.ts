import type React from 'react';

// Accent: the circled "$30K" / "DIGITAL PRODUCTS" gradient (sampled), blue-led like the widget references.
export const C = {
  ink: '#070A1F', // widget body / explainer world
  navy: '#0B1030',
  deep: '#1A1E5C',
  blue: '#657EFC',
  sky: '#8FB0FF', // light highlights (rim light, chart line)
  cyan: '#7FD4FF',
  peri: '#7773FB',
  violet: '#935DF9',
  purple: '#AB55F4',
  orchid: '#C052E9',
  magenta: '#D35BC5',
  lilac: '#C9B8FF',
  mist: '#F2EEFF',
  grey: 'rgba(214,222,255,.55)',
};
export const GRAD = 'linear-gradient(90deg,#657EFC 0%,#7773FB 22%,#935DF9 45%,#AB55F4 65%,#C052E9 82%,#D35BC5 100%)';
export const BAR_GRAD = 'linear-gradient(90deg,#7FD4FF 0%,#657EFC 45%,#935DF9 100%)';
export const NUM_FILL = 'linear-gradient(180deg,#FFFFFF 25%,#C7D3FF 75%,#9DB0FF 100%)';
export const HEAVY_FILL = 'linear-gradient(180deg,#FFFFFF 30%,#E6E4FF 70%,#C3C6FF 100%)';
export const HEAVY_FILTER = 'drop-shadow(0 0 8px rgba(120,130,252,.38)) drop-shadow(0 2px 14px rgba(0,0,0,.4))';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 905; // 30.17 s

// Scene timeline (frames @30)
export const CUT = {
  explainA: 168, // burnout (beam sweep in)
  talkB: 247, // "because I was tired…" (flash cut back)
  explainB: 429, // notifications
  talkC: 482, // "or do simple things…"
  switchAt: 662, // "switch" — colour comes back
  explainC: 826, // "audience" (title holds through "to my")
  talkD: 862, // CTA
  fadeOut: 897,
};
export const COLD_FROM = CUT.explainA;

// Face centre for punch-ins (from the U²-Net mask on the stills)
export const FACE = {x: 510, y: 600};

/** Widget look (user's references): navy squircle, top rim light, bottom light pool, soft blue spill. */
export const WIDGET: React.CSSProperties = {
  position: 'absolute',
  borderRadius: 64,
  background:
    'radial-gradient(120% 70% at 50% 118%,rgba(101,126,252,.62) 0%,rgba(101,126,252,.18) 38%,rgba(7,10,31,0) 62%),linear-gradient(180deg,#0D1236 0%,#070A1F 100%)',
  border: '1.5px solid rgba(143,176,255,.32)',
  boxShadow:
    'inset 0 1.5px 0 rgba(190,210,255,.35),inset 0 -2px 0 rgba(143,176,255,.85),0 34px 80px rgba(0,0,0,.65),0 26px 70px -14px rgba(101,126,252,.55)',
  overflow: 'hidden',
  fontFamily: 'Inter',
  color: C.mist,
};
