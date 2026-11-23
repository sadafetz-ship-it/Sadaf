import type React from 'react';
// Golden Hour palette (from the circled "Golden Hour" reference swatches #EB8858 / #EDBF1E / #FFC000)
export const C = {
  ink: '#160C06',
  umber: '#6B3410',
  ember: '#EB8858',
  gold: '#EDBF1E',
  amber: '#FFC000',
  cream: '#FFF4DE',
  hot: '#FF9A3C',
  solid: '#FFB21A', // Scripts-style title fill
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = 560;

// Scene cuts (frames)
export const CUT = {
  explainA: 135, // "I'll show you how to plan your finances"
  talkB: 213, // "So you can buy a home"
  explainB: 373, // "Buying a home is one of the biggest financial goals"
  talkC: 470, // "but as you're likely aware"
  fadeOut: 548,
};

// Low-glow heavy words ("Nexus." / "$10,000 per month" look)
export const HEAVY_FILL = 'linear-gradient(180deg,#FFFFFF 30%,#FFF1CF 70%,#FFE2A0 100%)';
export const HEAVY_FILTER = 'drop-shadow(0 0 8px rgba(255,214,140,.35)) drop-shadow(0 2px 14px rgba(0,0,0,.35))';

export const GLASS: React.CSSProperties = {
  position: 'absolute',
  borderRadius: 52,
  background: 'linear-gradient(165deg,rgba(52,28,12,.92),rgba(22,12,6,.94) 60%)',
  border: '2px solid rgba(255,214,120,.65)',
  boxShadow:
    '0 30px 80px rgba(0,0,0,.6),0 0 30px rgba(255,170,40,.25),inset 0 -3px 0 rgba(255,220,140,.8),inset 0 -60px 70px -40px rgba(255,170,40,.35)',
  overflow: 'hidden',
};
