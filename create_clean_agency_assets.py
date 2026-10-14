import urllib.request
import io
from pathlib import Path
from PIL import Image, ImageEnhance

TARGET_DIR = Path('c:/Users/user/Downloads/dmwithsaiful/assets/images')
TARGET_DIR.mkdir(parents=True, exist_ok=True)

PHOTOS = [
    {
        'id': 'm24',
        'pid': 'photo-1583391733956-3750e0ff4e8b', # Real South Asian bridal couture
        'crop_focus': 0.15 # focus on face and intricate zardozi embroidery
    },
    {
        'id': 'm32',
        'pid': 'photo-1781106699888-8f59750f830e', # Real embroidered royal sherwani menswear
        'crop_focus': 0.12 # focus on upper torso and royal sherwani collar
    },
    {
        'id': 'm25',
        'pid': 'photo-1515562141207-7a88fb7ce338', # Real diamond & gold handcrafted necklace
        'crop_focus': 0.25 # center macro necklace
    }
]

def make_clean_visual(cfg):
    img_id = cfg['id']
    pid = cfg['pid']
    print(f"Fetching authentic photography for {img_id} ({pid})...")
    url = f"https://images.unsplash.com/{pid}?auto=format&fit=crop&w=1600&q=90"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    with urllib.request.urlopen(req, timeout=15) as resp:
        raw_data = resp.read()
        img = Image.open(io.BytesIO(raw_data)).convert('RGB')
        
    w, h = img.size
    target_aspect = 16 / 9
    target_h = int(w / target_aspect)
    
    if target_h <= h:
        top_offset = int((h - target_h) * cfg.get('crop_focus', 0.2))
        cropped = img.crop((0, max(0, top_offset), w, min(h, top_offset + target_h)))
    else:
        target_w = int(h * target_aspect)
        left_offset = int((w - target_w) * 0.5)
        cropped = img.crop((max(0, left_offset), 0, min(w, left_offset + target_w), h))
        
    # Standard 1376 x 768
    resized = cropped.resize((1376, 768), Image.Resampling.LANCZOS)
    
    # Professional subtle grading (clean, rich contrast, natural tones, NO baked-in text, NO logos)
    enhancer = ImageEnhance.Contrast(resized)
    graded = enhancer.enhance(1.08)
    enhancer = ImageEnhance.Color(graded)
    graded = enhancer.enhance(1.04)
    enhancer = ImageEnhance.Sharpness(graded)
    graded = enhancer.enhance(1.10)
    
    # Save 1600 WebP
    out1600 = TARGET_DIR / f"{img_id}-1600.webp"
    graded.save(out1600, 'WEBP', quality=90, method=6)
    
    # Save 960 WebP
    img960 = graded.resize((960, 535), Image.Resampling.LANCZOS)
    out960 = TARGET_DIR / f"{img_id}-960.webp"
    img960.save(out960, 'WEBP', quality=90, method=6)
    
    print(f"Saved clean {img_id}: 1600 ({out1600.stat().st_size/1024:.1f} KB), 960 ({out960.stat().st_size/1024:.1f} KB)")

if __name__ == '__main__':
    for p in PHOTOS:
        make_clean_visual(p)
    print("\nSUCCESS: All 3 selected work images generated as pure, clean, authentic photography!")
