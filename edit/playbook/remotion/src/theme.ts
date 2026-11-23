import type React from 'react';
// Navy + Lime palette (the four colours the user circled: #08183A #173D70 #E6FF4F #F3F7FF)
export const C = {
  ink: '#08183A',
  deep: '#173D70',
  blue: '#2E64B0', // tint of deep, used only for glows
  lime: '#E6FF4F',
  limeDk: '#B9D62C',
  mist: '#F3F7FF',
  night: '#040A1C',
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = 1173; // 39.1 s

// Full-screen explainer ranges (frames)
export const EX = {
  gate: [285, 388] as const, // "While most financiers … gatekeeping the industry"
  growth: [1016, 1082] as const, // "a strategy so powerful"
  panel: [1082, DURATION] as const, // "it transformed the financial world forever"
  fadeOut: 1158,
};

export const HEAVY_FILL = 'linear-gradient(180deg,#FFFFFF 30%,#F6FFD2 70%,#EAFF8A 100%)';
export const HEAVY_FILTER = 'drop-shadow(0 0 8px rgba(230,255,79,.35)) drop-shadow(0 2px 14px rgba(0,0,0,.45))';

/** Dark UI-widget body (user's UI references): near-black navy, light pooling up from the bottom edge, lime rim. */
export const GLASS: React.CSSProperties = {
  position: 'absolute',
  borderRadius: 56,
  background:
    'radial-gradient(130% 70% at 50% 118%,rgba(230,255,79,.42),rgba(46,100,176,.30) 42%,rgba(8,24,58,0) 72%),linear-gradient(180deg,#081533,#040A1C)',
  border: '1.5px solid rgba(243,247,255,.13)',
  boxShadow:
    'inset 0 -2px 0 rgba(230,255,79,.95),inset 0 -50px 70px -30px rgba(230,255,79,.6),inset 0 1px 0 rgba(243,247,255,.12),0 34px 90px -28px rgba(230,255,79,.38),0 24px 60px rgba(0,0,0,.55)',
  overflow: 'hidden',
};

export const BIG_NUM: React.CSSProperties = {
  fontWeight: 300,
  letterSpacing: '-0.04em',
  lineHeight: 1,
  background: 'linear-gradient(180deg,#FFFFFF 20%,#F3F7FF 50%,#EAFF9A 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  filter: 'drop-shadow(0 0 18px rgba(230,255,79,.28))',
};

export const HL: React.CSSProperties = {color: C.lime, textShadow: `0 0 10px ${C.lime}, 0 0 26px rgba(230,255,79,.7)`};
