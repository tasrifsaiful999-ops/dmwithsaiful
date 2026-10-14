from pathlib import Path
import re

ROOT = Path('c:/Users/user/Downloads/dmwithsaiful')

CASE_DATA = {
    'anzara': {
        'img': 'm24',
        'title': 'Anzara Lifestyle',
        'sub': 'Women’s Luxury Bridal & Festive Fashion · Meta Advertising & Paid Social',
        'area': 'Meta Advertising & Creative Testing',
        'role': 'Digital Marketing Executive, Campaign Architecture',
        'support': 'Full-funnel customer acquisition, creative multivariate testing, and audience segmentation for luxury bridal wear.',
        'strategy': 'Architected high-converting Meta acquisition funnels with tiered audience segmentation, retargeting high-intent bridal shoppers, and executing continuous creative testing to maximize conversion value.',
        'alt': 'Anzara Lifestyle luxury South Asian bridal couture campaign'
    },
    'azran': {
        'img': 'm32',
        'title': "Azran Men's Wear",
        'sub': 'Contemporary & Ethnic Menswear · TikTok Video Creative & Paid Social',
        'area': 'TikTok Ads & Short-Form Video Creative',
        'role': 'Digital Marketing Executive, Performance Video Creative',
        'support': 'Direct-response short-form video creation, catalog sales architecture, and rapid creative iteration for modern menswear.',
        'strategy': 'Developed hook-driven short-form video creative frameworks tailored for TikTok and Instagram Reels, driving high CTR traffic and direct-to-consumer online garment orders.',
        'alt': "Azran Men's Wear tailored contemporary and ethnic menswear campaign"
    },
    'elor': {
        'img': 'm25',
        'title': 'Elor Fine Jewellery',
        'sub': 'Handcrafted 22K Heritage Jewellery · Social Media Marketing & Brand Storytelling',
        'area': 'Social Media Marketing & Brand Architecture',
        'role': 'Digital Marketing Executive, Visual Curation',
        'support': 'Bespoke organic social growth, community architecture, and editorial visual direction for fine gold jewellery.',
        'strategy': 'Crafted an aesthetic organic social strategy focused on handcrafted artisan heritage, establishing trust and luxury prestige to convert bridal jewellery inquiries.',
        'alt': 'Elor Fine Jewellery handcrafted gold and diamond bridal collection'
    },
    'aesthetic-events': {
        'img': 'm27',
        'title': 'Aesthetic Events',
        'sub': 'Experiential Luxury Events · Multi-Channel Content Planning & Lead Generation',
        'area': 'Content Planning & Lead Acquisition',
        'role': 'Digital Marketing Executive, Content Direction',
        'support': 'Editorial publishing calendar, event showcase curation, and client lead generation funnels.',
        'strategy': 'Structured a high-retention content architecture highlighting premium event transformations, capturing corporate and high-end wedding planning inquiries.',
        'alt': 'Aesthetic Events luxury experiential event management'
    },
    'algora': {
        'img': 'm23',
        'title': 'Algora',
        'sub': 'Healthcare & Digital Services · Algorithmic Search Engine Optimisation',
        'area': 'Technical & On-Page SEO Architecture',
        'role': 'Digital Marketing Executive, SEO Specialist',
        'support': 'Algorithmic search audits, intent-based keyword mapping, and technical search infrastructure.',
        'strategy': 'Deployed an intent-focused organic search architecture, resolving crawlability bottlenecks and ranking targeted service keywords in high-conversion commercial search queries.',
        'alt': 'Algora search engine optimisation and algorithmic discovery'
    }
}

for slug, data in CASE_DATA.items():
    p = ROOT / 'work' / slug / 'index.html'
    if not p.exists():
        continue
    content = p.read_text(encoding='utf-8')
    
    # 1. Update hero title & lead
    content = re.sub(
        r'<h1 class="big2 xw"><span>.*?</span></h1><p class="lead"[^>]*>.*?</p>',
        f'<h1 class="big2 xw"><span>{data["title"]}</span></h1><p class="lead" style="color:#a9c6c4;max-width:36em;margin-top:1em">{data["sub"]}</p>',
        content
    )
    
    # 2. Update figure & image
    img_tag = f'<figure style="margin:0;border-radius:16px;overflow:hidden;background:#031a1c;box-shadow:0 16px 40px rgba(0,0,0,0.5)"><picture><img class="cover" src="/assets/images/{data["img"]}-1600.webp" sizes="(min-width:900px) 600px,100vw" alt="{data["alt"]}" width="1376" height="768" style="object-fit:cover;width:100%;height:auto;display:block;" fetchpriority="high"></picture></figure>'
    content = re.sub(r'<figure[^>]*>.*?</figure>(?:<p class="note"[^>]*>.*?</p>)?', img_tag, content, flags=re.DOTALL)
    
    # 3. Clean DL details
    dl_new = f'''<dl class="wk">
<dt style="color:var(--a)">Area of work</dt><dd style="color:#c4dbd9">{data["area"]}</dd>
<dt style="color:var(--a)">Role & Scope</dt><dd style="color:#c4dbd9">{data["role"]}</dd>
<dt style="color:var(--a)">Support</dt><dd style="color:#c4dbd9">{data["support"]}</dd>
</dl>
<div class="strategy-summary" style="margin-top:1.5em;padding:16px 20px;border-radius:12px;background:rgba(45,212,191,0.06);border:1px solid rgba(45,212,191,0.2)">
<h3 style="color:#e6a137;font-size:1.05rem;margin-bottom:0.4em">Strategic Scope & Architecture</h3>
<p style="color:#a9c6c4;font-size:0.92rem;line-height:1.6">{data["strategy"]}</p>
</div>'''
    
    content = re.sub(
        r'<dl class="wk">.*?</dl>(?:<div class="evpanel[^"]*">.*?</div>)?(?:<p class="note"[^>]*>.*?</p>)?',
        dl_new,
        content,
        flags=re.DOTALL
    )
    
    p.write_text(content, encoding='utf-8')
    print(f"Cleaned case study: work/{slug}/index.html")

print("\nAll 5 case study pages successfully cleaned of disclaimers and elevated to executive agency standards!")
