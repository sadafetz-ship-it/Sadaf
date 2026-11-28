import whisper,sys
m=whisper.load_model("small.en")
for a,b in [(294,309),(321,330),(333,352),(373,382)]:
  r=m.transcribe(sys.argv[1],clip_timestamps=[a,b],word_timestamps=True,language="en",condition_on_previous_text=False)
  print(f"== {a}-{b}")
  print(" ".join(f'{w["start"]:.2f}{w["word"]}' for s in r["segments"] for w in s["words"]))
