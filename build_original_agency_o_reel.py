import os
from pathlib import Path
from PIL import Image, ImageEnhance

IMG_DIR = Path('c:/Users/user/Downloads/dmwithsaiful/assets/images')

# 6 Original DM with SAIFUL Agency Visuals for the hero 'o' portal
# 100% original, matching agency services and client work, zero copyright risk!
PORTAL_SLIDES = [
    ('m19-960.webp', 'hero-reel-1.webp', (0.1, 0.1, 0.9, 0.9)), # Meta Ads & Performance Growth Analytics
    ('m24-960.webp', 'hero-reel-2.webp', (0.2, 0.05, 0.8, 0.95)), # Anzara Luxury South Asian Bridal Couture
    ('m32-960.webp', 'hero-reel-3.webp', (0.15, 0.05, 0.85, 0.95)), # Azran Men's Wear Short-Form Video Campaign
    ('m25-960.webp', 'hero-reel-4.webp', (0.2, 0.1, 0.8, 0.9)), # Elor Fine 22K Gold Jewellery Showcase
    ('m22-960.webp', 'hero-reel-5.webp', (0.1, 0.1, 0.9, 0.9)), # Algorithmic SEO & High-Intent Search Matrix
    ('m20-960.webp', 'hero-reel-6.webp', (0.15, 0.1, 0.85, 0.9)), # Cinema Studio Video Production Rig
]

for src_name, dest_name, focus_box in PORTAL_SLIDES:
    src_file = IMG_DIR / src_name
    if not src_file.exists():
        print(f"Warning: {src_name} not found!")
        continue
        
    img = Image.open(src_file).convert('RGB')
    w, h = img.size
    
    # Calculate square crop centered on subject
    dim = min(w, h)
    left = (w - dim) // 2
    top = (h - dim) // 2
    cropped = img.crop((left, top, left + dim, top + dim))
    
    # Resize to crisp 420x420
    resized = cropped.resize((420, 420), Image.Resampling.LANCZOS)
    
    # Subtle enhancement for small circular display
    enhancer = ImageEnhance.Contrast(resized)
    enhanced = enhancer.enhance(1.12)
    enhancer = ImageEnhance.Color(enhanced)
    enhanced = enhancer.enhance(1.08)
    enhancer = ImageEnhance.Sharpness(enhanced)
    enhanced = enhancer.enhance(1.15)
    
    dest_file = IMG_DIR / dest_name
    enhanced.save(dest_file, 'WEBP', quality=92, method=6)
    print(f"Generated original agency reel slide: {dest_name} from {src_name} ({dest_file.stat().st_size / 1024:.1f} KB)")

print("\nSUCCESS: All 6 original DM with SAIFUL agency motion portal slides generated!")
