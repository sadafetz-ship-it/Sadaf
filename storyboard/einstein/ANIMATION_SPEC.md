# Animation spec: measured from your 4 reference videos

All timings were measured frame by frame at **30 fps** (1 f = 1 frame = 0.033 s).
**Ref 1** = Netflix, **Ref 2** = Titanic, **Ref 3** = McDonald's, **Ref 4** = Elizabeth Loftus.
The rendered video `einstein_45s_16x9.mp4` uses exactly these values. The renderer is `renderer/anim.js`.

## 1. Global rules (seen in every reference)
| Rule | Measured value | Where measured |
|---|---|---|
| Shot length | 1.3–3 s, then a hard cut | all |
| Shot start | **Rack focus**: blur 10–14 px → 0 over **6 f** | Ref 1 5.2 s, 7.4 s, 17.5 s |
| Camera | Constant slow **push-in, +4–6 % per shot** (linear) | all |
| Top-down shots | Push-in + slow **rotation drift 1.5–2°** | Ref 2 18–26 s |
| Grade | B&W, contrast +10 %, grain every frame, dark vignette | all |
| Edge fringing | Red/cyan offset ±2 px on cutouts | Ref 2, Ref 4 |

## 2. Text animations
| Name | Recipe | Reference | Einstein scene |
|---|---|---|---|
| **Letter typing** | 1 letter every **2 f**, no fade, no blur. Years type digit by digit ("1", "19", "195", "1955") | Ref 3 0.0–0.5 s, Ref 2 6.4 s ("April") | S1 "In 1902", S9 "in 1905", S10 "light", S14 "May 29th", S18 "Not bad for a" |
| **Fast small serif typing** | 1 letter per **1 f** for small captions | Ref 3 11.1 s ("it perfected a") | S10 "One explained", S12 "One changed" |
| **Caption swap** | Chest-height italic serif, the phrase **hard-swaps every 0.6 s**, no transition | Ref 1 2.0–5.1 s ("Netflix lost / one million / subscribers…") | S3 "couldn’t get / a job / at any / university." |
| **Word-by-word stack** | Each word appears every **0.15–0.2 s** with **blur-in 3–4 f**, stacking into lines | Ref 1 5.3–6.4 s ("People thought it was the…") | S4, S9, S15, S17 |
| **Stack exit + key phrase** | Stacked block slides **left ~260 px + blurs 10 px over 6 f**; key phrase blur-ins in **4 f**; **yellow underline draws over 10 f** | Ref 1 6.47–6.9 s ("of the end.") | S4 "patent office" |
| **Big word pop** | Scale **1.2 → 1.0 in 3 f**, glow | Ref 3 11.8 s ("system"), Ref 1 7.97 s ("later") | S5 "third class", S12 "time", S13 "ever." |
| **Bold glow words build, then push back** | Sans words pop one at a time (≈0.25 s apart); then the block **scales to 85 % and dims** while the next line pops in front | Ref 1 28.4–32.2 s ("Netflix didn't just survive / the streaming wars / They WON them.") | S13 "the most famous equation → E=mc² → ever." |
| **Glitch swap** | Box word changes with **3 f of horizontal jitter + red/cyan split** | Ref 3 13.2 s, 13.8 s, 15.0 s (speed → consistency → global expansion) | S18 "patent → patent clerk." |
| **Letter drop-out** | Letters disappear and reappear randomly over **6 f** | Ref 4 33.9–34.1 s ("smashed") | (optional in S18) |

## 3. Labels, boxes and drawn marks
| Name | Recipe | Reference | Einstein scene |
|---|---|---|---|
| **Yellow tape unfold** | Torn yellow shape grows **scaleX 0.2 → 1, scaleY 0.5 → 1 in 4 f** (ease-out-back); words type into it one at a time | Ref 1 7.5–7.8 s ("Three years") | S5 "Technical expert," |
| **Hanging label drop** | Label on 2 red strings drops in **10 f** (ease-out-back), then swings **±8° damped** to rest over about 1 s | Ref 4 9.7–10.4 s ("to find out") | S3 "rejected" |
| **Label swing-in** | Label enters from the bottom-left, **rotation −25° → −4°**, **15 f** with overshoot | Ref 4 12.1–12.6 s ("into her lab") | S7 "spare time" |
| **Highlight box wipe** | Box grows left → right **(scaleX 0 → 1) in 5–6 f**, then text types inside | Ref 3 10.17 s ("burgers"), Ref 2 6.7 s (lime "April 15th") | S9, S10, S14 |
| **Red brush wipe** | Red brush stroke reveals left → right behind the word in **9 f** | Ref 4 23.4–23.7 s ("smashed") | S11 "atoms" |
| **Red marker scribble** | Thick red circle draws on over **24 f**, overshooting its start | Ref 2 23.4–24.2 s (Edward Smith) | S9, S16 |
| **White arc** | Thin white hand-drawn arc draws on over **9 f** | Ref 1 9.2–9.5 s (newspapers) | S15 |
| **Ellipse around word** | Lime ellipse draws on over **6 f** as the word lands | Ref 1 12.53 s ("billion") | S17 "Nobel Prize" |
| **Selective-colour flicker** | Grey ↔ lime **3 times, 2 f each**, then stays lime | Ref 1 12.6–12.87 s (money stacks) | S17 "Nobel Prize" text |

## 4. Objects
| Name | Recipe | Reference | Einstein scene |
|---|---|---|---|
| **Papers fly in** | Each sheet flies from off-screen top-left with **motion blur**, lands in **8 f** (ease-out-back), sheets **4 f apart**; tape appears after landing | Ref 1 8.7–9.0 s | S9, S15 |
| **Year counter** | Circles in a column; a glowing yellow dot steps down **4 f per step** | Ref 4 24.6 s ("day 7 … day 1") | S8 |
| **Magnifier slide-in** | Slides in from the right in **10 f** (ease-out); detail jiggles inside the lens | Ref 4 7.3–9.3 s | S11 |
| **Gears** | Two gear outlines turn constantly in opposite directions (≈40°/s and 60°/s) | Ref 3 11.0–12.3 s | S12 |
| **Lamp flicker** | Light on 2 f, off 2 f, on | Ref 4 desk scene | S7 |
| **Window light** | Diagonal shadow bars drift slowly (≈40 px/s) | Ref 2, Ref 1 opening | S1, S2, S6, S9, S14, S16, S18 |

## 5. Transitions
| Name | Recipe | Reference | Einstein scene |
|---|---|---|---|
| **Frame push-through** | Gold frame slow push **+8 % over 1.2 s**, then **ease-in zoom through the frame in 0.8 s** with blur peaking mid-move | Ref 1 0.0–2.0 s | S2 → S3 |
| **Light streaks** | A narrow strip of red/orange/blue streaks widens to full screen in **15 f** (ease-in), jittering | Ref 1 16.6–17.4 s | S6 |
| **Whip pan** | Whole scene slides in **6–10 f** with directional blur (plus rotation on top-down shots) | Ref 2 6.0–6.4 s, 18.0–18.8 s, 26.0–26.8 s | S8, S14, S16 in/out |
| **Motion-blur cut** | Last 3 f of a shot slide sideways and blur, then cut | Ref 1 8.63 s | S5 |
| **Ink spread** | Black ink blots grow across the frame over about 1.2 s, then a zoom-out blur reveals the next scene | Ref 4 34.0–36.3 s | S18 |
| **Hard cut** | Most cuts have no transition at all | all | everywhere else |

## 6. Einstein timeline (45 s, 1350 frames)
| Scene | Time | Content |
|---|---|---|
| S1 | 0.0–1.3 | "In 1902" letter typing |
| S2 | 1.3–3.3 | Gold frame + push-through |
| S3 | 3.3–6.3 | Bern street, caption swap, "rejected" hanging label |
| S4 | 6.3–8.6 | Word stack → "patent office" + yellow underline |
| S5 | 8.6–10.3 | Yellow tape "Technical expert," + "third class" pop |
| S6 | 10.3–11.6 | Light streaks → "What happened next." |
| S7 | 11.6–14.2 | Lamp flicker, "spare time" label swing-in |
| S8 | 14.2–15.0 | Year counter 1902 → 1905 |
| S9 | 15.0–17.6 | Papers fly in, red scribble, lime "in 1905" |
| S10 | 17.6–19.2 | "light": yellow box wipe + typing |
| S11 | 19.2–20.9 | Magnifier + "atoms" red brush wipe |
| S12 | 20.9–22.8 | Gears + "time" pop |
| S13 | 22.8–26.0 | Bold words → "E=mc²" → "ever." |
| S14 | 26.0–28.6 | Whip pan, lime "May 29th", "1919" |
| S15 | 28.6–31.2 | Newspapers fly in, white arc, "famous overnight" |
| S16 | 31.2–34.2 | Corkboard whip in, red scribble, whip out |
| S17 | 34.2–38.0 | "Nobel Prize" + lime ellipse + selective-colour flicker |
| S18 | 38.0–44.0 | Ink spread → "Not bad for a" + glitch "patent clerk." |
| S19 | 44.0–45.0 | Black |

**Audio:** the video is silent. Record the voiceover to this timeline, or shift scene times in `anim.js` to match your recording (each scene's start and end are in the `SC` list).
