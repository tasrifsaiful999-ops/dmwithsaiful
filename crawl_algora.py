import urllib.request
import re

req = urllib.request.Request('https://algorabd.com', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        vids = re.findall(r'https?://[^\s"\'<>]+\.(?:mp4|webm)', html)
        print("Videos:", len(vids))
        for v in vids[:6]:
            print(" ", v)
            
        imgs = re.findall(r'https?://[^\s"\'<>]+\.(?:jpg|png|webp)', html)
        print("\nImages:", len(imgs))
        for img in imgs[:8]:
            print(" ", img)
except Exception as e:
    print("Error:", e)
