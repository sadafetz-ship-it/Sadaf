import {Easing, interpolate} from 'remotion';
import words from './words.json';

export const FPS = 30;
export const f = (t: number) => Math.round(t * FPS);

/** Edited timeline: raw 0–9.95 + raw 13.85–32.20 (two retakes cut) = 28.32 s. Last word "month." ends ≈28.3 s. */
export const SPEECH_END = 28.3;
export const END_HOLD = 0.5;
export const TOTAL_FRAMES = f(SPEECH_END + END_HOLD);
/** Jump cut between the two kept takes. */
export const JUMP_CUT = 9.95;

export type Word = {w: string; s: number; e: number};
export const WORDS = words as Word[];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export const tw = (
  frame: number, start: number, dur: number, from: number, to: number,
  easing: (t: number) => number = Easing.out(Easing.exp),
) => interpolate(frame, [start, start + dur], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

export const pop = (frame: number, start: number, dur = 7) =>
  interpolate(frame, [start, start + dur * 0.6, start + dur], [0, 1.15, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  });

// ───────────────────────── captions (lower third) ─────────────────────────
export type Fx = {ring?: boolean; tilt?: number; bar?: boolean; box?: string; arrowS?: boolean; arrowH?: boolean};
/** skip: spoken words consumed from the transcript but NOT shown (names that appear big at the top instead). */
type GroupDef = {l1?: string; s?: string; l2?: string; h?: string; dot?: boolean; fx?: Fx; skip?: string};
const GROUPS: GroupDef[] = [
  {l1: 'Alright ladies and gentlemen,', dot: false, skip: 'welcome to Nexus'},
  {l1: 'Nexus is the link between', s: 'online business', l2: 'and the', h: 'creator economy', fx: {box: 'link'}},
  {l1: 'And we have', s: '3 different', h: 'programs'},
  {l1: 'in Nexus that do', s: 'just', h: 'that'},
  {l1: 'Starting off, we have', dot: false, skip: 'Media Launchpad'},
  {l1: 'which is built for entrepreneurs making', s: 'anywhere from', l2: '$0 to', h: '$10,000 per month', fx: {bar: true}, skip: 'We have Media Pro'},
  {l1: 'for entrepreneurs that are making', s: '$10 to', h: '$50,000 per month', fx: {bar: true}},
  {l1: 'And last but for damn sure', s: 'not least,', dot: false, skip: 'we have Media Mastery'},
  {l1: 'And Media Mastery is designed for', s: 'entrepreneurs', dot: false},
  {l1: 'making anywhere from', h: '$50,000 per month'},
  {l1: 'all the way up to', s: '$10 million', h: 'per month', fx: {ring: true}},
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
    take(g.skip);
    const all = [...l1, ...s, ...l2, ...h];
    return {l1, s, l2, h, dot: g.dot ?? true, fx: g.fx ?? {}, start: all[0].t - 2 / FPS, end: 0};
  });
  // a group leaves at the next group's start, or 1.2 s after its last word (names are shown big at the top, not in captions)
  gs.forEach((g, i) => {
    const last = Math.max(...[...g.l1, ...g.s, ...g.l2, ...g.h].map((t) => t.t));
    g.end = i < gs.length - 1 ? Math.min(gs[i + 1].start, last + 1.2) : SPEECH_END + END_HOLD;
  });
  return gs;
};
export const CAPTION_GROUPS = buildGroups();

// ───────────────────────── scenes ─────────────────────────
export type SceneKind = 'talk' | 'ex-link' | 'ex-ladder';
export const SCENES: {kind: SceneKind; start: number; end: number}[] = [
  {kind: 'talk', start: 0, end: 3.5},
  {kind: 'ex-link', start: 3.5, end: 6.9},
  {kind: 'talk', start: 6.9, end: JUMP_CUT},
  {kind: 'talk', start: JUMP_CUT, end: 24.1},
  {kind: 'ex-ladder', start: 24.1, end: SPEECH_END + END_HOLD},
];
export const SWITCHES = SCENES.slice(1).map((s) => s.start);

/** Program names behind the speaker's head. */
export const BEHIND_NAMES = [
  {name: 'NEXUS', tag: 'THE PROGRAM', t: 2.7, end: 3.5},
  {name: 'LAUNCHPAD', tag: 'PROGRAM 01', t: 11.04, end: 11.9},
  {name: 'MEDIA PRO', tag: 'PROGRAM 02', t: 16.0, end: 16.75},
  {name: 'MASTERY', tag: 'PROGRAM 03', t: 21.48, end: 22.6},
];

/** Camera: slow push per talking-head stretch + 4 f punch-ins on key words. */
const CAM_SEGMENTS: [number, number, number, number][] = [
  [0, 3.5, 1.0, 1.05], [6.9, JUMP_CUT, 1.02, 1.06], [JUMP_CUT, 24.1, 1.0, 1.08],
];
const PUNCHES = [2.7, 7.34, 11.04, 16.0, 20.22, 21.48];
export const cameraZoom = (frame: number) => {
  const t = frame / FPS;
  const seg = CAM_SEGMENTS.find(([a, b]) => t >= a && t < b);
  if (!seg) return 1;
  const [a, b, z0, z1] = seg;
  let z = interpolate(t, [a, b], [z0, z1], {easing: Easing.inOut(Easing.sin)});
  for (const p of PUNCHES) if (p >= a && p < b) z += tw(frame, f(p), 4, 0, 0.035);
  return z;
};
