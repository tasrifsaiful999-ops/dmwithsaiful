import urllib.request
import io
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

TARGET_DIR = Path('c:/Users/user/Downloads/dmwithsaiful/assets/images')
TARGET_DIR.mkdir(parents=True, exist_ok=True)

# Image mapping configuration
IMAGE_CONFIGS = [
    {
        'id': 'm19',
        'pid': 'photo-1460925895917-afdab827c52f', # digital growth analytics
        'title': 'META & PERFORMANCE ADS',
        'subtitle': 'Full-Funnel Paid Acquisition Architecture',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm22',
        'pid': 'photo-1551288049-bebda4e38f71', # analytics dashboard dark
        'title': 'ALGORITHMIC SEARCH ENGINE OPTIMISATION',
        'subtitle': 'Organic Revenue & High-Intent Indexing',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.15
    },
    {
        'id': 'm20',
        'pid': 'photo-1574717024653-61fd2cf4d44d', # cinema camera rig
        'title': 'SOCIAL MEDIA MARKETING',
        'subtitle': 'Studio-Grade Video & Creator Production',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm21',
        'pid': 'photo-1542744094-24638eff58bb', # creative strategy team
        'title': 'CONTENT STRATEGY & DIRECTION',
        'subtitle': 'Multi-Platform Editorial Blueprint',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm34',
        'pid': 'photo-1551288049-bebda4e38f71', # performance analytics
        'title': 'META ADS BLUEPRINT',
        'subtitle': 'Full-Funnel Testing & Attribution Framework',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm35',
        'pid': 'photo-1506784365847-bbad939e9335', # calendar & strategy desk
        'title': 'CONTENT ARCHITECTURE',
        'subtitle': 'Cross-Platform Editorial Calendar & Workflow',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.15
    },
    {
        'id': 'm36',
        'pid': 'photo-1526374965328-7f61d4dc18c5', # tech infra
        'title': 'TECHNICAL SEO INFRASTRUCTURE',
        'subtitle': 'Core Web Vitals & Algorithmic Discovery',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm2',
        'pid': 'photo-1497366216548-37526070297c', # modern agency studio
        'has_text': False,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm5',
        'pid': 'photo-1551836022-deb4988cc6c0', # laptop analytics
        'has_text': False,
        'aspect': 16/9,
        'crop_top': 0.15
    },
    {
        'id': 'm14',
        'pid': 'photo-1497366811353-6870744d04b2', # executive office studio
        'has_text': False,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm15',
        'pid': 'photo-1490481651871-ab68de25d43d', # luxury fashion editorial
        'has_text': False,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm17',
        'pid': 'photo-1497215728101-856f4ea42174', # executive boardroom
        'has_text': False,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm18',
        'pid': 'photo-1513519245088-0e12902e5a38', # art gallery dark light
        'title': 'MAKE IT MATTER.',
        'subtitle': 'IDEAS INTO MEASURABLE ACTION.',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm23',
        'pid': 'photo-1504639725590-34d0984388bd', # abstract search matrix
        'title': 'ALGORA HEALTHCARE',
        'subtitle': 'Turn Search into Organic Discovery',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm26',
        'pid': 'photo-1522071820081-009f0129c71c', # creative team
        'has_text': False,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm27',
        'pid': 'photo-1519741497674-611481863552', # luxury events
        'title': 'AESTHETIC EVENTS',
        'subtitle': 'Good Content Starts with an Artful Plan',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.15
    },
    {
        'id': 'm28',
        'pid': 'photo-1455390582262-044cdead277a', # typewriter editorial
        'title': 'SAY LESS. MEAN MORE.',
        'subtitle': 'High-Converting Brand Messaging & Copywriting',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm29',
        'pid': 'photo-1611162617213-7d7a39e9b1d7', # phone studio
        'title': 'TIKTOK ORGANIC GROWTH',
        'subtitle': 'Find Your Brand Content Rhythm',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm30',
        'pid': 'photo-1598488035139-bdbb2231ce04', # studio console
        'title': 'YOUTUBE CHANNEL STRATEGY',
        'subtitle': 'Build a Channel Worth Watching',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm31',
        'pid': 'photo-1618221195710-dd6b41faaea6', # aesthetic design
        'title': 'PINTEREST DISCOVERY',
        'subtitle': 'Turn Visual Inspiration into Organic Customers',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.1
    },
    {
        'id': 'm33',
        'pid': 'photo-1521587760476-6c12a4b040da', # modern architectural library
        'title': 'DM WITH SAIFUL  •  ACADEMY',
        'subtitle': 'Strategic Playbooks & Performance Masterclasses',
        'has_text': True,
        'aspect': 16/9,
        'crop_top': 0.1
    },
]

def apply_cinematic_overlay(img, has_text=False):
    w, h = img.size
    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Subtle dark teal / slate ambient grading
    top_opacity = 0.40 if has_text else 0.20
    bottom_opacity = 0.80 if has_text else 0.35
    
    top_h = int(h * 0.35)
    for y in range(top_h):
        alpha = int(255 * top_opacity * (1.0 - (y / top_h))**1.4)
        draw.line([(0, y), (w, y)], fill=(8, 16, 24, alpha))
        
    bottom_h = int(h * 0.45)
    for y in range(bottom_h):
        progress = y / bottom_h
        alpha = int(255 * bottom_opacity * (progress ** 1.3))
        actual_y = h - bottom_h + y
        draw.line([(0, actual_y), (w, actual_y)], fill=(6, 12, 18, alpha))
        
    combined = Image.alpha_composite(img.convert('RGBA'), overlay)
    return combined.convert('RGB')

def process_image(cfg):
    img_id = cfg['id']
    pid = cfg['pid']
    print(f"Processing {img_id} (Unsplash: {pid})...")
    
    url = f"https://images.unsplash.com/{pid}?auto=format&fit=crop&w=1600&q=88"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = resp.read()
            raw_img = Image.open(io.BytesIO(data)).convert('RGB')
    except Exception as e:
        print(f"Error fetching {img_id}: {e}")
        return False
        
    w, h = raw_img.size
    aspect = cfg.get('aspect', 16/9)
    target_h = int(w / aspect)
    crop_top = int(h * cfg.get('crop_top', 0.1))
    cropped = raw_img.crop((0, max(0, crop_top), w, min(h, crop_top + target_h)))
    
    # Resize to standard high-res 1376 x 768
    resized = cropped.resize((1376, 768), Image.Resampling.LANCZOS)
    
    # Contrast and color balance
    enhancer = ImageEnhance.Contrast(resized)
    graded = enhancer.enhance(1.12)
    enhancer = ImageEnhance.Color(graded)
    graded = enhancer.enhance(1.05)
    
    has_text = cfg.get('has_text', False)
    final_img = apply_cinematic_overlay(graded, has_text=has_text)
    
    if has_text:
        draw = ImageDraw.Draw(final_img)
        font_title = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 38)
        font_sub = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 20)
        font_brand = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 20)
        
        title = cfg.get('title', '')
        subtitle = cfg.get('subtitle', '')
        
        draw.text((64, 608), title, fill=(255, 255, 255), font=font_title)
        draw.text((64, 664), subtitle, fill=(45, 212, 191), font=font_sub)
        draw.text((1120, 664), "DM WITH SAIFUL", fill=(148, 163, 184), font=font_brand)
        
    # Save 1600px version
    target1600 = TARGET_DIR / f"{img_id}-1600.webp"
    final_img.save(target1600, 'WEBP', quality=88, method=6)
    
    # Save 960px version
    img960 = final_img.resize((960, 535), Image.Resampling.LANCZOS)
    target960 = TARGET_DIR / f"{img_id}-960.webp"
    img960.save(target960, 'WEBP', quality=88, method=6)
    
    print(f"Saved {img_id}: 1600 ({target1600.stat().st_size/1024:.1f} KB), 960 ({target960.stat().st_size/1024:.1f} KB)")
    return True

if __name__ == '__main__':
    success_count = 0
    for cfg in IMAGE_CONFIGS:
        if process_image(cfg):
            success_count += 1
    print(f"\nAll complete! Successfully regenerated {success_count} / {len(IMAGE_CONFIGS)} images.")
