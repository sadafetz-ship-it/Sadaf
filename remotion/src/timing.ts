import {Easing, interpolate} from 'remotion';
import words from './words.json';

export const FPS = 30;
export const f = (t: number) => Math.round(t * FPS);

/** Audio ends after "ETFs." (44.34 s) — the raw take is cut off mid-sentence at 45.2 s. */
export const SPEECH_END = 44.5;
/** Short hold + fade after the last word (the recap board was removed). */
export const END_HOLD = 0.6;
export const TOTAL_FRAMES = f(SPEECH_END + END_HOLD);

export type Word = {w: string; s: number; e: number};
export const WORDS = words as Word[];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Clamp-interpolate with expo-out by default. */
export const tw = (
  frame: number, start: number, dur: number, from: number, to: number,
  easing: (t: number) => number = Easing.out(Easing.exp),
) => interpolate(frame, [start, start + dur], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

/** scale 0 → 1.15 → 1 pop (skill default: 7 f, back-out feel). */
export const pop = (frame: number, start: number, dur = 7) =>
  interpolate(frame, [start, start + dur * 0.6, start + dur], [0, 1.15, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  });

// ───────────────────────── captions (lower third) ─────────────────────────
// Each group: light line / script word (+ light words) / heavy word(s).
// Tokens are matched to the transcript in order, so every word appears on its spoken frame.
/** Extra caption moves (refs R1/R2): ring around heavy word, tilt + wobble, highlight bar under heavy,
 *  outline box flash around a light word, arrow before script / heavy. */
export type Fx = {ring?: boolean; tilt?: number; bar?: boolean; box?: string; arrowS?: boolean; arrowH?: boolean};
type GroupDef = {l1?: string; s?: string; l2?: string; h?: string; dot?: boolean; fx?: Fx};
const GROUPS: GroupDef[] = [
  {l1: 'I should not be giving these', s: 'crypto', h: 'websites'},
  {l1: 'Other crypto investors are going to be', s: 'mad', l2: 'I shared this for', h: 'free', fx: {tilt: -7, ring: true}},
  {l1: 'First,', s: 'we have'},
  {l1: 'the best website to get', s: 'all', l2: 'the data you need in the', h: 'DeFi ecosystem', fx: {box: 'best'}},
  {l1: 'Second,', s: 'we have'},
  {l1: 'This website gives clear and', s: 'detailed', h: 'information', fx: {box: 'clear'}},
  {l1: 'about open interest, liquidation and other', s: 'super important', h: 'data', fx: {bar: true}},
  {l1: 'Third,', s: 'we have'},
  {l1: 'This website offers', s: 'on-chain', h: 'analytics', fx: {box: 'offers'}},
  {l1: 'like', s: 'inflows', l2: 'and', h: 'outflows', fx: {arrowS: true, arrowH: true}},
  {l1: 'It helps investors identify potential', s: 'entry', l2: 'and', h: 'exit points', fx: {bar: true}},
  {l1: 'Before we get into the', s: 'last', h: 'one', fx: {tilt: 6}},
  {l1: 'if you want the full website list, just', s: 'comment', h: 'Bitcoin', fx: {ring: true, box: 'list,'}},
  {l1: "and I'll send it", s: 'over', l2: 'to', h: 'you'},
  {l1: 'And lastly,', s: 'we have'},
  {l1: 'On this website, you can track the', s: 'inflows', l2: 'and', h: 'outflows', fx: {arrowS: true, arrowH: true, box: 'track'}},
  {l1: 'into the', s: 'Ethereum', l2: 'and', h: 'Bitcoin ETFs'},
];

export type Tok = {text: string; t: number};
export type Group = {l1: Tok[]; s: Tok[]; l2: Tok[]; h: Tok[]; dot: boolean; fx: Fx; start: number; end: number};

const buildGroups = (): Group[] => {
  let cursor = 0;
  const take = (line?: string): Tok[] => {
    if (!line) return [];
    return line.split(' ').map((text) => {
      const n = norm(text);
      let i = cursor;
      while (i < WORDS.length && norm(WORDS[i].w) !== n) i++;
      if (i >= WORDS.length) throw new Error(`Caption token not found in transcript: "${text}"`);
      cursor = i + 1;
      return {text, t: WORDS[i].s};
    });
  };
  const gs = GROUPS.map((g) => {
    const l1 = take(g.l1), s = take(g.s), l2 = take(g.l2), h = take(g.h);
    const all = [...l1, ...s, ...l2, ...h];
    return {l1, s, l2, h, dot: g.dot ?? true, fx: g.fx ?? {}, start: all[0].t - 2 / FPS, end: 0};
  });
  gs.forEach((g, i) => (g.end = i < gs.length - 1 ? gs[i + 1].start : SPEECH_END));
  return gs;
};
export const CAPTION_GROUPS = buildGroups();

// ───────────────────────── scenes ─────────────────────────
export type SceneKind = 'talk' | 'cta' | 'ex-defillama' | 'ex-coinglass' | 'ex-flows' | 'ex-entryexit' | 'ex-farside';
export const SCENES: {kind: SceneKind; start: number; end: number}[] = [
  {kind: 'talk', start: 0, end: 8.7},
  {kind: 'ex-defillama', start: 8.7, end: 11.96},
  {kind: 'talk', start: 11.96, end: 14.0},
  {kind: 'ex-coinglass', start: 14.0, end: 20.56},
  {kind: 'talk', start: 20.56, end: 22.68},
  {kind: 'ex-flows', start: 22.68, end: 27.72},
  {kind: 'ex-entryexit', start: 27.72, end: 31.82},
  {kind: 'talk', start: 31.82, end: 33.5},
  {kind: 'cta', start: 33.5, end: 37.42},
  {kind: 'talk', start: 37.42, end: 39.2},
  {kind: 'ex-farside', start: 39.2, end: SPEECH_END + END_HOLD},
];
export const SWITCHES = SCENES.slice(1).map((s) => s.start);

/** Site names that go up behind the speaker's head. */
export const BEHIND_NAMES = [
  {name: 'DefiLlama', t: 6.74, end: 8.7},
  {name: 'CoinGlass', t: 12.98, end: 14.0},
  {name: 'CryptoQuant', t: 21.12, end: 22.68},
  {name: 'Farside', t: 38.34, end: 39.2},
];

/** Camera: slow push per talking-head stretch + punch-ins on key words (skill: visible change ≈ every 2.5 s). */
const CAM_SEGMENTS: [number, number, number, number][] = [
  [0, 8.7, 1.0, 1.06], [11.96, 14.0, 1.02, 1.06], [20.56, 22.68, 1.02, 1.06],
  [31.82, 33.5, 1.08, 1.0], [33.5, 37.42, 1.0, 1.04], [37.42, 39.2, 1.02, 1.06],
];
const PUNCHES = [1.82, 4.46, 5.7, 6.74, 12.98, 21.12, 38.34];
export const cameraZoom = (frame: number) => {
  const t = frame / FPS;
  const seg = CAM_SEGMENTS.find(([a, b]) => t >= a && t < b);
  if (!seg) return 1;
  const [a, b, z0, z1] = seg;
  let z = interpolate(t, [a, b], [z0, z1], {easing: Easing.inOut(Easing.sin)});
  for (const p of PUNCHES) if (p >= a && p < b) z += tw(frame, f(p), 4, 0, 0.035);
  return z;
};
