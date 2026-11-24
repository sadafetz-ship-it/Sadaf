import json, sys, subprocess, numpy as np, whisper, warnings
warnings.filterwarnings('ignore')
M=sys.argv[1]; R=json.load(open(f'{M}/ranked.json'))[:60]
m=whisper.load_model('tiny.en')
out=[]
for r in R:
    a=subprocess.run(['ffmpeg','-v','error','-ss','10','-t','60','-i',f"{M}/clips/{r['id']}.mp3",'-f','f32le','-ac','1','-ar','16000','-'],capture_output=True).stdout
    y=np.frombuffer(a,np.float32).copy()
    res=m.transcribe(y,language='en',fp16=False,condition_on_previous_text=False)
    words=sum(len(s['text'].split()) for s in res['segments'] if s['no_speech_prob']<0.5 and s['avg_logprob']>-0.9)
    txt=' '.join(s['text'] for s in res['segments'] if s['no_speech_prob']<0.5 and s['avg_logprob']>-0.9)[:80]
    r['vocal_words']=words; r['vocal_txt']=txt; out.append(r)
    print(r['score'],words,'|',r['title'][:40],'|',txt,flush=True)
json.dump(out,open(f'{M}/ranked_vocal.json','w'),indent=1)
