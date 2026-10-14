import os
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance

SRC_DIR = Path('C:/Users/user/.gemini/antigravity/brain/1cf3e02f-f0d5-46e5-b186-ba58f449fd72/.user_uploaded')
DEST_DIR = Path('c:/Users/user/Downloads/dmwithsaiful/assets/images')
DEST_DIR.mkdir(parents=True, exist_ok=True)

# Process the 3 images from user
user_images = [
    ('media_1791977311474_4f5a0861.png', 'hero-reel-1.webp'), # green wireframe 3d
    ('media_1791977313670_cfd0c183.png', 'hero-reel-2.webp'), # iridescent chrome 3d head
    ('media_1791977358140_a06ba875.png', 'hero-reel-3.webp'), # digital UI smartwatch
]

for src_name, dest_name in user_images:
    src_path = SRC_DIR / src_name
    im = Image.open(src_path).convert('RGB')
    w, h = im.size
    # crop square
    dim = min(w, h)
    left = (w - dim) // 2
    top = (h - dim) // 2
    cropped = im.crop((left, top, left + dim, top + dim))
    # resize to 400x400
    resized = cropped.resize((400, 400), Image.Resampling.LANCZOS)
    
    # Slight contrast enhance
    enhancer = ImageEnhance.Contrast(resized)
    enhanced = enhancer.enhance(1.08)
    
    out_path = DEST_DIR / dest_name
    enhanced.save(out_path, 'WEBP', quality=92)
    print(f"Saved: {dest_name} ({out_path.stat().st_size / 1024:.1f} KB)")

# Also create square crops of Anzara, Azran, and Elor for the reel
for img_id, dest_name in [('m24', 'hero-reel-4.webp'), ('m32', 'hero-reel-5.webp'), ('m25', 'hero-reel-6.webp')]:
    src_file = DEST_DIR / f"{img_id}-960.webp"
    if src_file.exists():
        im = Image.open(src_file).convert('RGB')
        w, h = im.size
        dim = min(w, h)
        left = (w - dim) // 2
        top = (h - dim) // 2
        cropped = im.crop((left, top, left + dim, top + dim))
        resized = cropped.resize((400, 400), Image.Resampling.LANCZOS)
        out_path = DEST_DIR / dest_name
        resized.save(out_path, 'WEBP', quality=90)
        print(f"Saved: {dest_name} ({out_path.stat().st_size / 1024:.1f} KB)")

print("\nAll 6 hero motion reel slides created successfully!")
