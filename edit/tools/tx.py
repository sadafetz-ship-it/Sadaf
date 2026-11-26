import whisper, json, sys
m = whisper.load_model("small.en")
r = m.transcribe(sys.argv[1], word_timestamps=True, language="en")
words = [{"w": w["word"].strip(), "s": round(w["start"],2), "e": round(w["end"],2)} for seg in r["segments"] for w in seg["words"]]
json.dump(words, open("words.json","w"), indent=0)
print(r["text"])
for w in words: print(f'{w["s"]:6.2f} {w["e"]:6.2f} {w["w"]}')
