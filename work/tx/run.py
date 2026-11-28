import whisper,json,sys
m=whisper.load_model("small.en")
r=m.transcribe(sys.argv[1],word_timestamps=True,language="en",condition_on_previous_text=False,initial_prompt="Um, uh, so, like, you know. HeySegment, MaidMe, Google Business Profile, HighLevel.")
json.dump(r,open(sys.argv[2],"w"))
for s in r["segments"]: print(f'{s["start"]:7.2f}-{s["end"]:7.2f} {s["text"]}')
