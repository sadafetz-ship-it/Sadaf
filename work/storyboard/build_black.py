"""Storyboard for the black-theme edit (v4/v5). Frames are stills rendered from the actual edit."""
import html, pathlib, subprocess

ROOT = pathlib.Path(__file__).parent

# (time range, shot, script line, on screen, motion, sound) — times on the 1:04.4 edited timeline
BEATS = [
 ("00:00.0 – 00:04.3", "TALKING HEAD · WIDE + TITLE",
  "If I started an AI marketing agency from zero in 2026,",
  "Clay centred full screen; graded with lifted shadows and natural skin. Title: <b>AI MARKETING AGENCY</b> / <b class=g>FROM ZERO</b> · 2026 (white Poppins, soft shadow, no stroke).",
  "Each word pops in (fade + small rise) on the spoken word.",
  "Music starts under the voice."),
 ("00:04.3 – 00:07.9", "BLACK GRAPHIC · CROSSED-OUT TOOLS",
  "I wouldn't start by building some AI tool or some custom software.",
  "Black background with green sweeping curves and a faint green haze. Dark title card <b>What I wouldn't <span class=g>start with</span></b>. Two app windows, <b>AI Tool</b> and <b>custom software</b>, are struck through in red.",
  "The card fades in empty, then the words pop. Each window appears on its words; the red strike draws across on 'software' and the windows dim.",
  "Soft swipe in, a pop per window, a short swish on the strike."),
 ("00:07.9 – 00:11.0", "TALKING HEAD · CROP-IN + CAPTION",
  "I'd sell local business owners something they already pay for,",
  "Crop-in on the cut (sentence break, head never cut off). Caption: something they <b class=g>already pay for</b>.",
  "Caption words pop with the voice; the green phrase lands on 'already pay for'.",
  "—"),
 ("00:11.0 – 00:13.0", "BLACK GRAPHIC · LOCAL SEARCH",
  "which is more customers from Google.",
  "Headline <b>More customers from <span class=g>Google</span></b> over a dark local-search card: 3 listings with a Call button; the top listing is outlined in green. Marked 'Illustration'.",
  "Card fades in, headline words pop, then the green outline lands on listing 1.",
  "Soft swipe in, click on the highlight."),
 ("00:13.0 – 00:15.1", "TALKING HEAD · WIDE",
  "AI would help me do the work faster,",
  "Back to the wide frame; the framing change hides the join. Clean.",
  "None.", "—"),
 ("00:15.1 – 00:18.9", "BLACK GRAPHIC · FLOW DIAGRAM",
  "but the additional customers they're getting from Google is what I would sell.",
  "Three dark boxes joined by dashed arrows: <b>AI</b> → <b>Does the work faster</b> → <b class=g>More customers</b> (green border and glow), with <b class=g>= what you sell</b> underneath.",
  "Boxes appear one by one; each dashed arrow draws across before the next box; the label lands on 'what I would sell'.",
  "Soft swipe in, a pop per box, a click on the label."),
 ("00:18.9 – 00:21.3", "TALKING HEAD · CROP-IN + LABEL",
  "That's what my agency sells right now.",
  "Crop-in on the cut. Dark label at lower left with a green bar: <b>Review Harvest</b> · <i>my agency</i>.",
  "Label fades up on 'my agency'.", "Pop."),
 ("00:21.3 – 00:32.6", "BLACK GRAPHIC · CLIENT RESULT",
  "For one of our clients, MaidMe, it brought in 50 more organic calls plus 74 high-intent form submissions from their site in the first 90 days without any paid ads.",
  "Dark card: <b>CLIENT RESULT · MaidMe · first 90 days</b>. Tiles: <b>50+</b> organic calls · <b>74</b> high-intent form submissions · <b>90</b> days · <b class=g>$0</b> paid ads. Face-cam bottom right. Compliance line: <i>One client's result. Results vary and are not guaranteed.</i>",
  "Card fades in empty, title pops, then each tile appears on its number and counts up. The join at 00:25.9 is hidden under the card.",
  "Soft swipe in, fast ticks while numbers count, short ping on '$0 paid ads'."),
 ("00:32.6 – 00:38.6", "BLACK GRAPHIC · ROADMAP",
  "In this video, I'll show you the exact offer I'd start with, what I'd charge, how I'd find my first clients,",
  "Dark card titled <i>In this video</i>: The exact <b class=g>offer</b> · What to <b class=g>charge</b> · Finding your <b class=g>first clients</b>. Face-cam bottom right.",
  "One item per spoken point; words pop in. The join at 00:37.1 is hidden under the card.",
  "Soft swipe in, click per item."),
 ("00:38.6 – 00:39.8", "TEASER · LATER IN THIS VIDEO",
  "and how I do the work.",
  "Fast montage of five clips from Clay's real HeySegment walkthrough (Section 4), blurred and darkened so no email, phone or address is readable. Green label <b>LATER IN THIS VIDEO</b>; face-cam bottom right.",
  "Clips change every ~0.4 s; the label pops in.",
  "Soft swipe in, pop on the label."),
 ("00:39.8 – 00:44.9", "BLACK GRAPHIC · ROADMAP (CONTINUES)",
  "Then I'll show you how I turn those first results into a system that brings you new clients.",
  "Back to the roadmap: <b class=g>Doing the work</b> · Turning results into a <b class=g>client system</b>.",
  "Items 4 and 5 pop in on their words.",
  "Soft swipe, click per item."),
 ("00:44.9 – 00:47.7", "TALKING HEAD · CROP-IN + CAPTION",
  "and throughout the process, I'll be honest about the timeline",
  "Crop-in on the cut. Caption: I'll be honest about <b class=g>the timeline</b>.",
  "Caption words pop with the voice.", "Music dips slightly."),
 ("00:47.7 – 00:50.2", "BLACK GRAPHIC · TEXT CARD",
  "because you can build this, it's just not going to be easy.",
  "Dark rounded card: <b>You can build this.</b> / <b class=g>It's just not easy.</b>",
  "Card fades in empty, then the words pop one by one with the voice.",
  "Soft swipe in."),
 ("00:50.2 – 00:53.6", "TALKING HEAD · WIDE + NAME",
  "If you don't know who I am, my name is Clay Lawrence, founder of Review Harvest here.",
  "Wide shot. Dark name label with a green bar: <b>Clay Lawrence</b> / Founder, Review Harvest.",
  "Label fades up on 'Clay Lawrence', holds about 2.5 s, fades out.", "Pop."),
 ("00:53.6 – 00:59.3", "REAL PROOF · STRIPE (AUGUST)",
  "You can see last month we did over $60,000 just helping local business owners get more customers from Google.",
  "Clay's real Stripe dashboard (Aug 1–31, 2026) in a rounded window on the black background; cropped so no account ID, URL or tabs show. Chip: <b>Last month · Stripe, August 2026</b>. Compliance line under the window.",
  "Slow push-in with the edges softly blurred; the real Gross volume figure counts up to <b>$60,498.87</b>, then a green marker sweeps in behind it.",
  "Soft swipe in, fast ticks while counting, click when the marker lands."),
 ("00:59.3 – 01:04.4", "REAL PROOF · STRIPE (THIS MONTH)",
  "And this month, not even two weeks in, we're already on pace to do over $75,000.",
  "Stripe month-to-date (Oct 1–13). Chip: <b>This month · Oct 1 – 13</b>. Count-up to <b>$40,184.90</b> with the green marker; pill on '$75,000': <b class=g>On pace for $75K+</b> (his words).",
  "Same moves as beat 15; the pill pops in last. Music fades out at the end.",
  "Ticks, marker click, pop on the pill."),
]

STYLE = """
<b>Style (from the two 'Overall style for layouts and edit' references in the editing notes)</b>
<ul>
<li><b>Theme:</b> black backgrounds with Clay's green (<b class=g>#0F782B</b>, brighter tint on black) as the only accent: sweeping green curves and a faint green haze in the corners. Dark rounded cards, white text, key words in green.</li>
<li><b>Type:</b> Poppins everywhere, consistent sizes, italic card titles. No text strokes, only soft shadows (editing notes).</li>
<li><b>Animation:</b> cards fade in empty, then words pop in one by one with the voice. Diagrams build box by box with dashed arrows drawing in. Numbers count up in place.</li>
<li><b>Captions:</b> on talking-head shots, key phrases only, with the key words in green.</li>
<li><b>Proof:</b> Clay's real Stripe dashboard with a slow push-in, soft blurred edges, a live count-up and a green marker. 'Results not typical or guaranteed' on every result claim; no invented numbers.</li>
<li><b>Teaser:</b> 'LATER IN THIS VIDEO' over a blurred montage of his real screen recording; face-cam bottom right.</li>
<li><b>Cut:</b> best take of every line, natural breaths kept, short fades on every audio cut. Jump cuts hidden by crop-ins at sentence breaks or by cutting to a graphic. No light leaks or flashy transitions.</li>
<li><b>Sound:</b> dedicated mic only, cleaned gently, -14 LUFS with no volume jumps. Music ('Inspired', Kevin MacLeod, CC BY 4.0) under the voice with ducking. Real CC0 sound effects, kept subtle.</li>
</ul>
"""

rows = []
for i, (t, shot, line, vis, mot, snd) in enumerate(BEATS, 1):
    rows.append(f"""
<section class=beat>
 <div class=hd><span class=n>{i:02d}</span><span class=t>{t}</span><span class=s>{shot}</span></div>
 <div class=line>“{html.escape(line)}”</div>
 <img class=frame src="frames_black/{i:02d}.jpg">
 <div class=d><b>On screen:</b> {vis}</div>
 <div class=d><b>Motion:</b> {mot}</div>
 <div class=d><b>Sound:</b> {snd}</div>
</section>""")

page = f"""<!doctype html><html><head><meta charset=utf-8><title>Storyboard – First Minute (Black)</title>
<style>
body{{font-family:Poppins,Inter,Arial,sans-serif;margin:0;padding:28px;color:#151515;background:#fff;font-size:13px;line-height:1.45}}
h1{{font-size:24px;margin:0 0 4px}} .sub{{color:#555;margin-bottom:16px}}
.g{{color:#0F782B}}
.style{{background:#f3f7f4;border-left:4px solid #0F782B;padding:10px 16px;margin-bottom:18px}}
.style ul{{margin:6px 0 0 18px;padding:0}}
.beat{{border:1px solid #e3e3e3;border-radius:12px;padding:14px 16px;margin-bottom:16px;break-inside:avoid}}
.hd{{display:flex;gap:12px;align-items:center;margin-bottom:6px}}
.n{{background:#0F782B;color:#fff;border-radius:6px;padding:2px 8px;font-weight:700}}
.t{{font-weight:700}} .s{{color:#0F782B;font-weight:700;font-size:12px;letter-spacing:.04em}}
.line{{font-style:italic;color:#333;margin-bottom:8px}}
.frame{{width:100%;border-radius:10px;display:block;margin-bottom:8px;border:1px solid #ddd}}
.d{{margin-top:4px}}
</style></head><body>
<h1>Storyboard · First Minute (Hook + Intro) · Black theme</h1>
<div class=sub>Every frame is a still from the actual edit. “If I Started an AI Marketing Agency In 2026, I'd Do This” · Clay Lawrence · 1:04.4 · 16 beats · 1920×1080 · 30 fps</div>
<div class=style>{STYLE}</div>
{''.join(rows)}
</body></html>"""
(ROOT / "storyboard_black.html").write_text(page)
js = """const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://%s');await p.waitForTimeout(800);
await p.pdf({path:'%s',format:'A4',printBackground:true,margin:{top:'10mm',bottom:'10mm',left:'8mm',right:'8mm'}});await b.close()})()""" % (
    (ROOT / "storyboard_black.html").resolve(), (ROOT / "Storyboard_First_Minute_Black.pdf").resolve())
subprocess.run(["node", "-e", js], check=True)
print("ok", len(BEATS), "beats")
