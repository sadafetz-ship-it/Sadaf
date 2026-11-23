import {interpolate, Easing, staticFile} from 'remotion';
export const C = {
  mint: '#4CDAB4', mid: '#84E572', lime: '#C2F433', limeOld: '#B8FF37', pale: '#D8FF92', white: '#FFFFFF',
  ink: '#17200D', olive: '#7A963F', dk: '#0B2A17', sky: '#63D3FF', sun: '#FFD166', mintD: '#6CF0C2',
};
export const ACC = 'linear-gradient(90deg,#4CDAB4 0%,#84E572 50%,#C2F433 100%)';
export const ACCT = 'linear-gradient(135deg,#C2F433 0%,#84E572 50%,#4CDAB4 100%)';
export const ACC_DEEP = 'linear-gradient(90deg,#0B6B4F 0%,#1F8436 50%,#4E8A0B 100%)';
export const HEAVYFILL = 'linear-gradient(180deg,#FFFFFF 20%,#F2FFE0 55%,#D8FF92 100%)';
export const FONT = "'Inter Display', Inter, sans-serif";
export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const eo = Easing.out(Easing.cubic);
export const eio = Easing.inOut(Easing.cubic);
/** 0→1 progress between a and a+d (eased out) */
export const p = (f: number, a: number, d: number, e = eo) => interpolate(f, [a, a + d], [0, 1], {...cl, easing: e});
/** overshoot pop 0 → 1.15 → 1 */
export const pop = (f: number, a: number, d = 7, peak = 1.15) => interpolate(f, [a, a + d * 0.6, a + d], [0, peak, 1], cl);
export const fontFace = `@font-face{font-family:Allura;src:url('${staticFile('fonts/allura-latin-400-normal.woff2')}')}`;
