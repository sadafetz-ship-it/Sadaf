"""Builds the first-minute storyboard (HTML -> PDF) from the beat list below."""
import html, pathlib, sys

ROOT = pathlib.Path(__file__).parent
IMG = ROOT / "img"

# (time range, shot type, script line, footage thumb, style ref, on-screen visual, motion, sound)
BEATS = [
 ("00:00.0 – 00:04.3", "TALKING HEAD · WIDE",
  "If I started an AI marketing agency from zero in 2026,", "", "",
  "Clay centred full screen, warm grade with lifted shadows. Headline at the bottom: <b>AI MARKETING AGENCY</b> / <b class=g>FROM ZERO · 2026</b> (white Poppins, soft shadow, no stroke).",
  "Words fade in one at a time, landing on each spoken word (about 0.15 s each). No camera move.",
  "Music starts under the voice (grounded, motivational). Very soft tick per word."),
 ("00:04.3 – 00:07.9", "FULL-SCREEN GRAPHIC · DARK",
  "I wouldn't start by building some AI tool or some custom software.", "", "",
  "Hard cut to black with a green edge glow (it also hides the join). Two mock windows: <b>AI Tool</b> (chat) and <b>custom software</b> (code editor), then a red strike line and <b>Not where I'd start</b>.",
  "The card cuts in. Each window appears on its words ('AI tool', 'custom software'); the strike draws across in 6 frames on 'software'; the text fades in word by word.",
  "Subtle pop per window, soft scratch on the strike."),
 ("00:07.9 – 00:11.0", "TALKING HEAD · CROP-IN + CAPTION",
  "I'd sell local business owners something they already pay for,", "", "",
  "Crop-in on the cut (sentence boundary, head never cut off). Key-phrase caption: something they <b class=g>already pay for</b>.",
  "Caption words fade in with the voice; the green phrase lands on 'already pay for'.",
  "—"),
 ("00:11.0 – 00:13.0", "FULL-SCREEN GRAPHIC · LIGHT",
  "which is more customers from Google.", "", "",
  "White panel with a soft green edge. Headline <b>More customers from <span class=g>Google</span></b> over a local-search mock (3 listings with a Call button, the top one outlined green). Marked 'Illustration'.",
  "Hard cut in; headline word-by-word, then the green outline draws around listing 1.",
  "Soft click on the highlight."),
 ("00:13.0 – 00:15.0", "TALKING HEAD · WIDE",
  "AI would help me do the work faster,", "", "",
  "Back to the wide frame: the framing change hides the join. Clean.",
  "None.", "—"),
 ("00:15.0 – 00:18.9", "BULLET CARD + FACE-CAM",
  "but the additional customers they're getting from Google is what I would sell.", "", "",
  "White rounded card on dark, with the face-cam in a rounded square with a white border. Italic title <i>What I'd actually sell</i>. Bullets: AI → does the work <b class=g>faster</b> · <b class=g>More customers</b> → what the owner pays for.",
  "The card cuts in. Each bullet's words fade in with the voice; accent words are green.",
  "Soft tick per bullet."),
 ("00:18.9 – 00:21.3", "TALKING HEAD · CROP-IN",
  "That's what my agency sells right now.", "", "",
  "Crop-in on the cut. Small label at lower left: <b>Review Harvest</b> · <i>my agency</i>.",
  "The label fades in on 'my agency'.", "—"),
 ("00:21.3 – 00:32.6", "PROOF CARD · CLIENT RESULT",
  "For one of our clients, MaidMe, it brought in 50 more organic calls plus 74 high-intent form submissions from their site in the first 90 days without any paid ads.", "", "",
  "Light card: <b>CLIENT RESULT · MaidMe · first 90 days</b>. Tiles: <b>50+</b> organic calls · <b>74</b> high-intent form submissions · <b>90</b> days · <b class=g>$0</b> paid ads. Face-cam bottom right. Compliance line: <i>One client's result. Results vary and are not guaranteed.</i>",
  "The card cuts in. Each tile appears on its number and types up quickly (0→50, 0→74). The join at 00:25.9 is hidden under the card.",
  "Counter ticks; soft 'ding' on $0 paid ads."),
 ("00:32.6 – 00:38.6", "ROADMAP CARD + FACE-CAM",
  "In this video, I'll show you the exact offer I'd start with, what I'd charge, how I'd find my first clients,", "", "",
  "Same card layout, title <i>In this video</i>. Numbered items appear as he says them: 1 The exact <b class=g>offer</b> · 2 What to <b class=g>charge</b> · 3 Finding your <b class=g>first clients</b>.",
  "One item per spoken point, words fading in. The join at 00:37.1 is hidden under the card.",
  "Soft tick per item."),
 ("00:38.6 – 00:40.5", "TEASER · LATER IN THE VIDEO",
  "and how I do the work.", "", "",
  "Real screen recording from Clay's Section 4 walkthrough: the HeySegment homepage, cropped so no browser tabs, URL or bookmarks show. White pill: <b>LATER IN THE VIDEO</b>. Face-cam bottom left.",
  "Hard cut in; the page scrolls slightly (real footage); the pill fades in. The join at 00:39.8 is hidden here.",
  "Soft whoosh-free cut, light click on the pill."),
 ("00:40.5 – 00:45.6", "ROADMAP CARD (CONTINUES)",
  "Then I'll show you how I turn those first results into a system that brings you new clients.", "", "",
  "Back to the roadmap: 4 <b class=g>Doing the work</b> · 5 Turning results into a <b class=g>client system</b>.",
  "Items 4 and 5 fade in on their words.", "Soft tick."),
 ("00:45.6 – 00:48.4", "TALKING HEAD · CROP-IN + CAPTION",
  "and throughout the process, I'll be honest about the timeline", "", "",
  "Crop-in on the cut. Caption: I'll be honest about <b class=g>the timeline</b>.",
  "Caption fades in word by word.", "Music dips slightly."),
 ("00:48.4 – 00:50.9", "FULL-SCREEN TEXT CARD · DARK",
  "because you can build this, it's just not going to be easy.", "", "",
  "Black with a green edge glow. <b>You can absolutely build this.</b> / <b class=g>It's just not easy.</b>",
  "Words fade in one by one over about 0.8 s; the green line comes in on 'not going to be easy'.",
  "—"),
 ("00:50.9 – 00:54.3", "TALKING HEAD · WIDE + NAME",
  "If you don't know who I am, my name is Clay Lawrence, founder of Review Harvest here.", "", "",
  "Wide shot. Name label: <b>Clay Lawrence</b> / Founder, Review Harvest (white card with a green bar).",
  "Label fades in on 'Clay Lawrence', holds about 2.5 s, fades out.", "—"),
 ("00:54.3 – 01:00.0", "REAL PROOF · STRIPE (AUGUST)",
  "You can see last month we did over $60,000 just helping local business owners get more customers from Google.", "", "",
  "Headline <b>Last month</b> above Clay's real Stripe dashboard (Aug 1–31, 2026, cropped so no account ID, URL or tabs show). Green label over the Gross volume figure: <b>$60,498.87</b>.",
  "Hard cut in; headline word-by-word; the green label pops on and the number types in on '$60,000'.",
  "Soft typing tick."),
 ("01:00.0 – 01:05.9", "REAL PROOF · STRIPE (THIS MONTH)",
  "And this month, not even two weeks in, we're already on pace to do over $75,000.", "", "",
  "Headline <b>Not even <span class=g>2 weeks</span> in</b> over Stripe month-to-date (Oct 1–13). Green label <b>$40,184.90</b>. Pill on '$75,000': <b>On pace for $75K+</b> (his words). Compliance line: <i>Results not typical or guaranteed.</i>",
  "Same moves as beat 15; the pill fades in last. The join at 01:01.1 is hidden under the graphic.",
  "Typing tick; music resolves into Section 1."),
]

STYLE = """
<b>Style (matched to the reference videos)</b>
<ul>
<li><b>Graphics:</b> full-frame light panels (white with a soft coloured vignette at the edges) and dark panels (black with a coloured edge glow). One accent colour, used only on the key words. Accent = Clay's brand green <b class=g>#0F782B</b>.</li>
<li><b>Type:</b> one clean rounded sans (Poppins) everywhere, with consistent sizes. Titles are italic. No text strokes, only soft shadows (editing notes).</li>
<li><b>Text animation:</b> graphics <b>cut in</b> (no slides or transitions); only the text animates, with words fading in one by one in sync with the voice. Numbers type in.</li><li><b>Captions:</b> on talking-head shots, key phrases only, with one phrase in green.</li><li><b>Teasers:</b> a 'LATER IN THE VIDEO' pill over real footage from later in the video.</li>
<li><b>Proof:</b> Clay's real screenshots, with a headline above and the key number in a green highlight label that types in.</li>
<li><b>Lists:</b> white rounded card with the face-cam in a rounded-square inset overlapping its left edge.</li>
<li><b>Talking head:</b> centred, eyes near the upper third, warm grade. Cuts are hidden with crop-ins (never mid-sentence) or by cutting to a graphic. No light leaks or flashy transitions.</li>
<li><b>Compliance:</b> 'results vary / not guaranteed' stays on screen for every result claim. No invented charts or numbers.</li>
</ul>
"""

def img(name):
    if name.startswith("th_"):
        return f"img/{name}.jpg"
    if name.startswith("rf_"):
        return f"img/{name}.jpg"
    return f"img/ref_{name}.jpg"

rows = []
for i, (t, shot, line, th, ref, vis, mot, snd) in enumerate(BEATS, 1):
    rows.append(f"""
<section class=beat>
 <div class=hd><span class=n>{i:02d}</span><span class=t>{t}</span><span class=s>{shot}</span></div>
 <div class=line>“{html.escape(line)}”</div>
 <img class=frame src="frames/{i:02d}.jpg">
 <div class=d><b>On screen:</b> {vis}</div>
 <div class=d><b>Motion:</b> {mot}</div>
 <div class=d><b>Sound:</b> {snd}</div>
</section>""")

page = f"""<!doctype html><html><head><meta charset=utf-8><title>Storyboard – First Minute</title>
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
figure{{margin:0;flex:1}} figure img{{width:100%;border-radius:8px;display:block}}
figcaption{{font-size:11px;color:#777;margin-top:3px}}
.d{{margin-top:4px}}
</style></head><body>
<h1>Storyboard · First Minute (Hook + Intro)</h1>
<div class=sub>Every frame below is a design mock-up for this edit, built from Clay's own footage and screen recording. “If I Started an AI Marketing Agency In 2026, I'd Do This” · Clay Lawrence · Cut length 1:05.9 · 16 beats · 1920×1080 · 30 fps</div>
<div class=style>{STYLE}</div>
{''.join(rows)}
</body></html>"""
(ROOT / "storyboard.html").write_text(page)
print("ok", len(BEATS), "beats")
