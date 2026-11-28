"""Builds the first-minute storyboard (HTML -> PDF) from the beat list below."""
import html, pathlib, sys

ROOT = pathlib.Path(__file__).parent
IMG = ROOT / "img"

# (time range, shot type, script line, footage thumb, style ref, on-screen visual, motion, sound)
BEATS = [
 ("00:00.0 – 00:04.3", "TALKING HEAD · WIDE (100%)",
  "If I started an AI marketing agency from zero in 2026,",
  "th_001.5", "9bb62902",
  "Clay centred full screen, eyes on the upper third. Graded: shadows lifted, warm skin. Lower-centre headline reveals word by word: <b>AI MARKETING AGENCY</b> / <b class=g>FROM ZERO · 2026</b> (white Poppins, soft shadow, no stroke).",
  "Each word fades up from a 12 px blur over 8 frames, in sync with the voice. No camera move.",
  "Music starts under the voice (grounded, motivational build). Soft 'tick' per word."),
 ("00:04.3 – 00:07.9", "FULL-SCREEN GRAPHIC · DARK CARD",
  "I wouldn't start by building some AI tool or some custom software.",
  "th_006.0", "a1e6b89b",
  "Cut is masked by the graphic. Black background with a soft green (#0F782B) edge glow. Two clean mock windows slide in: an <b>AI tool</b> chat window (on 'AI tool') and a <b>custom software</b> code editor (on 'custom software'). On 'software' both dim to 40% and a line strikes through: <b>Not where I'd start</b>.",
  "Windows rise 40 px with ease-out over 10 frames. The strike line draws left to right over 6 frames.",
  "Light whoosh on the graphic entry, two soft pops for the windows, a subtle 'scratch' on the strike."),
 ("00:07.9 – 00:11.0", "TALKING HEAD · CROP-IN (112%)",
  "I'd sell local business owners something they already pay for,",
  "th_009.5", "9bb62902",
  "A crop-in (not a zoom) on the join hides the jump cut. Face stays centred and the head is never cut off. Clean frame, no text: let the line land.",
  "Instant crop-in at the cut point only, never mid-sentence (per the editing notes).",
  "Music continues."),
 ("00:11.0 – 00:13.0", "FULL-SCREEN GRAPHIC · LIGHT",
  "which is more customers from Google.",
  "th_012.0", "c96d62f2",
  "White background with a soft green vignette. Headline: <b>More customers from <span class=g>Google</span></b>. Below it, a clean Google local search mock ('house cleaner near me'): 3 map-pack listings with stars and a <b>Call</b> button, the top one highlighted green.",
  "Headline word-blur reveal, then the search card scales 96→100% and fades in. A green highlight box draws around listing #1.",
  "Whoosh in, soft click on the highlight."),
 ("00:13.0 – 00:15.0", "TALKING HEAD · WIDE (100%)",
  "AI would help me do the work faster,",
  "th_014.5", "9bb62902",
  "Back to the wide shot (the framing change covers the cut). Clean.",
  "None.",
  "—"),
 ("00:15.0 – 00:18.9", "BULLET CARD + FACE-CAM INSET",
  "but the additional customers they're getting from Google is what I would sell.",
  "th_017.0", "61ec4872",
  "Dark background, white rounded card. Face-cam in a rounded square on the left, overlapping the card edge with an even white border, never touching the frame edge. Italic title: <i>What I'd actually sell</i>. Bullets: <b>AI → does the work faster</b> (grey) · <b class=g>More customers → what the owner pays for</b>.",
  "Card slides up 30 px and fades in over 10 frames. Bullets reveal word by word, timed to the voice.",
  "Whoosh in, soft tick per bullet."),
 ("00:18.9 – 00:21.3", "TALKING HEAD · CROP-IN (112%)",
  "That's what my agency sells right now.",
  "th_020.0", "9bb62902",
  "Crop-in on the cut. Small clean label at lower left: <b>Review Harvest</b> · <i>my agency</i>.",
  "The label fades in on 'my agency' and holds.",
  "—"),
 ("00:21.3 – 00:32.6", "PROOF CARD · RESULT DASHBOARD",
  "For one of our clients, MaidMe, it brought in 50 more organic calls plus 74 high-intent form submissions from their site in the first 90 days without any paid ads.",
  "th_024.0", "ace00a38",
  "Light dashboard card. Header: <b>Client result · MaidMe</b>. Stat tiles appear as he says each one: <b>50+</b> organic calls · <b>74</b> high-intent form submissions · <b>90</b> days · <b class=g>$0</b> paid ads. Face-cam inset bottom left. Required compliance line at the bottom: <i>One client's result. Results vary and are not guaranteed.</i> No invented charts or numbers.",
  "The card eases in. Each number counts up over 12 frames as it is spoken, and the tile gets a green underline. The second take join (00:25.9) is hidden under the card.",
  "Whoosh in, a soft counter tick on each number, a light 'ding' on $0 paid ads."),
 ("00:32.6 – 00:45.6", "ROADMAP CARD + FACE-CAM INSET",
  "In this video, I'll show you the exact offer I'd start with, what I'd charge, how I'd find my first clients, and how I do the work. Then I'll show you how I turn those first results into a system that brings you new clients.",
  "th_034.5", "61ec4872",
  "Same bullet-card layout as above. Title: <i>In this video</i>. Numbered items revealed as spoken: <b>1 The exact offer</b> · <b>2 What to charge</b> · <b>3 Finding your first clients</b> · <b>4 Doing the work</b> · <b class=g>5 Turning results into a client system</b>.",
  "Each item does a word-blur reveal. The active item is black, earlier ones turn grey. Three cut joins (37.1, 39.8, 40.5) are all hidden under the card.",
  "Soft tick per item; music keeps building."),
 ("00:45.6 – 00:48.4", "TALKING HEAD · CROP-IN (112%)",
  "and throughout the process, I'll be honest about the timeline",
  "th_047.0", "9bb62902",
  "Crop-in on the cut. Clean, direct to camera (the honest moment).",
  "None.",
  "Music dips slightly."),
 ("00:48.4 – 00:50.9", "FULL-SCREEN TEXT CARD · DARK",
  "because you can build this, it's just not going to be easy.",
  "th_049.8", "a1e6b89b",
  "Black background with a green edge glow. Centred white Poppins: <b>You can absolutely build this.</b> / <b class=g>It's just not easy.</b>",
  "Line one does a word-blur reveal; line two reveals on 'not going to be easy'.",
  "Low whoosh."),
 ("00:50.9 – 00:54.3", "TALKING HEAD · WIDE + LOWER THIRD",
  "If you don't know who I am, my name is Clay Lawrence, founder of Review Harvest here.",
  "th_052.5", "f34ab71a",
  "Wide shot. Lower third on 'Clay Lawrence': white card with a green bar: <b>Clay Lawrence</b> / Founder, Review Harvest.",
  "The bar wipes in, then the text reveals; it holds 2.5 s and fades out.",
  "Soft swipe."),
 ("00:54.3 – 01:00.0", "REAL PROOF · STRIPE SCREENSHOT (AUG)",
  "You can see last month we did over $60,000 just helping local business owners get more customers from Google.",
  "rf_stripe_aug", "b9a9622c",
  "Real screenshot from his own screen recording: the Stripe overview for Aug 1–31, 2026. Cropped to the dashboard cards so no URL, account ID, tabs or bookmarks show. Label: <b>Last month · August 2026</b>.",
  "Slow push-in onto <b>Gross volume $60,498.87</b>, with the rest of the dashboard defocused (depth-of-field blur). A green highlight box draws around the number on '$60,000'.",
  "Soft whoosh, highlight click."),
 ("01:00.0 – 01:05.9", "REAL PROOF · STRIPE SCREENSHOT (OCT MTD)",
  "And this month, not even two weeks in, we're already on pace to do over $75,000.",
  "rf_stripe_oct", "c96d62f2",
  "Headline above the screenshot: <b>Not even 2 weeks in</b>. Stripe month-to-date (Oct 1–13): <b>Gross volume $40,184.90</b> (+56.15%). On '$75,000' a pill appears: <b class=g>On pace for $75K+</b> (his words, not a stronger claim). Small line: <i>Results not typical or guaranteed.</i>",
  "Headline word-blur reveal, then a push-in and highlight on $40,184.90. The pill pops in on '$75,000'. The internal cut join (61.1) is hidden under the graphic.",
  "Whoosh, a counter tick, a light 'ding' on the pill. Music resolves into Section 1."),
]

STYLE = """
<b>Style (matched to the reference videos)</b>
<ul>
<li><b>Graphics:</b> full-frame light panels (white with a soft coloured vignette at the edges) and dark panels (black with a coloured edge glow). One accent colour, used only on the key words. Accent = Clay's brand green <b class=g>#0F782B</b>.</li>
<li><b>Type:</b> one clean rounded sans (Poppins) everywhere, with consistent sizes. Titles are italic. No text strokes, only soft shadows (editing notes).</li>
<li><b>Text animation:</b> word-by-word blur and fade-up reveal, timed to the voice.</li>
<li><b>Proof:</b> real screenshots and dashboards, pushed in with depth-of-field blur and vignette on the key number. Headlines sit above screenshots.</li>
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
<div class=sub>Every frame below is a design mock-up for this edit, built from Clay's own footage and screen recording. “If I Started an AI Marketing Agency In 2026, I'd Do This” · Clay Lawrence · Cut length 1:05.9 · 1920×1080 · 30 fps</div>
<div class=style>{STYLE}</div>
{''.join(rows)}
</body></html>"""
(ROOT / "storyboard.html").write_text(page)
print("ok", len(BEATS), "beats")
