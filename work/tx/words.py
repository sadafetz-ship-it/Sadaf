import json,sys
r=json.load(open(sys.argv[1]));off=float(sys.argv[2]);a=float(sys.argv[3]);b=float(sys.argv[4])
out=[]
for s in r["segments"]:
  for w in s["words"]:
    st=w["start"]+off
    if a<=st<=b: out.append(f'{st:.2f}-{w["end"]+off:.2f}{w["word"]}')
print("\n".join(out))
