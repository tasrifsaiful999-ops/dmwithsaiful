from pathlib import Path
import re

ROOT = Path('c:/Users/user/Downloads/dmwithsaiful')

# 1. Update index.html Selected Work section
index_file = ROOT / 'index.html'
index_content = index_file.read_text(encoding='utf-8')

# Clean Selected Work section for index.html
new_index_wk = '''<section class="wk-sec"><div class="w"><div class="wk-top"><h2 class="big2 xw"><span>Selected</span><span>Work</span></h2><div><h3>Strategic Campaign Execution.</h3><p>Selected high-impact client campaigns spanning full-funnel paid advertising, short-form video creative, and luxury brand storytelling.</p></div></div>
<div class="wk-grid stg">
<a class="wcard" href="/work/anzara/">
<div class="wc-bar"><span><b aria-hidden="true">↗</b>Anzara Lifestyle</span><small>Luxury Bridal & Festive Couture</small></div>
<div class="wc-media">
<picture><img class="cover" src="/assets/images/m24-960.webp" sizes="(min-width:900px) 60vw,100vw" alt="Anzara Lifestyle luxury South Asian bridal couture campaign" width="1376" height="768" style="object-fit:cover;width:100%;height:100%;display:block;" loading="lazy" decoding="async"></picture>
</div>
<div class="wc-info"><b>Meta Advertising & Full-Funnel Acquisition</b> · Full-funnel creative testing frameworks, audience segmentation, and scaled conversion campaigns.</div>
</a>

<a class="wcard" href="/work/azran/">
<div class="wc-bar"><span><b aria-hidden="true">↗</b>Azran Men's Wear</span><small>Tailored Contemporary & Ethnic Menswear</small></div>
<div class="wc-media">
<picture><img class="cover" src="/assets/images/m32-960.webp" sizes="(min-width:900px) 60vw,100vw" alt="Azran Men's Wear premium ethnic menswear campaign" width="1376" height="768" style="object-fit:cover;width:100%;height:100%;display:block;" loading="lazy" decoding="async"></picture>
</div>
<div class="wc-info"><b>TikTok Growth & Video Creative Architecture</b> · High-retention direct-response video creative, dynamic catalog ads, and targeted social growth.</div>
</a>

<a class="wcard" href="/work/elor/">
<div class="wc-bar"><span><b aria-hidden="true">↗</b>Elor Fine Jewellery</span><small>Handcrafted 22K Heritage Jewellery</small></div>
<div class="wc-media">
<picture><img class="cover" src="/assets/images/m25-960.webp" sizes="(min-width:900px) 60vw,100vw" alt="Elor Fine Jewellery handcrafted gold and diamond bridal collection" width="1376" height="768" style="object-fit:cover;width:100%;height:100%;display:block;" loading="lazy" decoding="async"></picture>
</div>
<div class="wc-info"><b>Social Media Marketing & Brand Storytelling</b> · Organic community architecture, luxury visual curation, and bespoke bridal narrative direction.</div>
</a>
</div>
<div class="more-wrap" style="margin-top:24px"><a class="btn wh" href="/work/">View all work <span class="arw" aria-hidden="true">→</span></a></div></div></section>'''

# Replace section in index.html
index_content_updated = re.sub(
    r'<section class="wk-sec">.*?</section>',
    new_index_wk,
    index_content,
    flags=re.DOTALL
)
index_file.write_text(index_content_updated, encoding='utf-8')
print("Updated index.html Selected Work section successfully!")

# 2. Update work/index.html
work_file = ROOT / 'work/index.html'
work_content = work_file.read_text(encoding='utf-8')

new_work_sec = '''<section class="wdark"><div class="w">
<div class="wk-grid stg">
<a class="wcard" id="anzara" href="/work/anzara/">
<div class="wc-bar"><span><b aria-hidden="true">↗</b>Anzara Lifestyle</span><small>Luxury Bridal & Festive Couture</small></div>
<div class="wc-media">
<picture><img class="cover" src="/assets/images/m24-960.webp" sizes="(min-width:900px) 60vw,100vw" alt="Anzara Lifestyle luxury South Asian bridal couture campaign" width="1376" height="768" style="object-fit:cover;width:100%;height:100%;display:block;" loading="lazy" decoding="async"></picture>
</div>
<div class="wc-info"><b>Meta Advertising & Full-Funnel Acquisition</b> · Creative testing, audience segmentation, and scaled seasonal conversion campaigns.</div>
</a>

<a class="wcard" id="azran" href="/work/azran/">
<div class="wc-bar"><span><b aria-hidden="true">↗</b>Azran Men's Wear</span><small>Tailored Contemporary & Ethnic Menswear</small></div>
<div class="wc-media">
<picture><img class="cover" src="/assets/images/m32-960.webp" sizes="(min-width:900px) 60vw,100vw" alt="Azran Men's Wear premium ethnic menswear campaign" width="1376" height="768" style="object-fit:cover;width:100%;height:100%;display:block;" loading="lazy" decoding="async"></picture>
</div>
<div class="wc-info"><b>TikTok Growth & Video Creative Architecture</b> · High-retention direct-response video creative, catalog ads, and targeted social growth.</div>
</a>

<a class="wcard" id="elor" href="/work/elor/">
<div class="wc-bar"><span><b aria-hidden="true">↗</b>Elor Fine Jewellery</span><small>Handcrafted 22K Heritage Jewellery</small></div>
<div class="wc-media">
<picture><img class="cover" src="/assets/images/m25-960.webp" sizes="(min-width:900px) 60vw,100vw" alt="Elor Fine Jewellery handcrafted gold and diamond bridal collection" width="1376" height="768" style="object-fit:cover;width:100%;height:100%;display:block;" loading="lazy" decoding="async"></picture>
</div>
<div class="wc-info"><b>Social Media Marketing & Brand Storytelling</b> · Organic community architecture, luxury visual curation, and bespoke bridal narrative direction.</div>
</a>

<a class="wcard" id="aesthetic-events" href="/work/aesthetic-events/">
<div class="wc-bar"><span><b aria-hidden="true">↗</b>Aesthetic Events</span><small>Experiential Event Architecture</small></div>
<div class="wc-media">
<picture><img class="cover" src="/assets/images/m27-960.webp" sizes="(min-width:900px) 60vw,100vw" alt="Aesthetic Events luxury experiential event management" width="1376" height="768" style="object-fit:cover;width:100%;height:100%;display:block;" loading="lazy" decoding="async"></picture>
</div>
<div class="wc-info"><b>Lead Generation & Multi-Channel Content Planning</b> · Editorial content calendars and client acquisition funnels.</div>
</a>

<a class="wcard" id="algora" href="/work/algora/">
<div class="wc-bar"><span><b aria-hidden="true">↗</b>Algora</span><small>Healthcare & Digital Services</small></div>
<div class="wc-media">
<picture><img class="cover" src="/assets/images/m23-960.webp" sizes="(min-width:900px) 60vw,100vw" alt="Algora search engine optimisation and algorithmic discovery" width="1376" height="768" style="object-fit:cover;width:100%;height:100%;display:block;" loading="lazy" decoding="async"></picture>
</div>
<div class="wc-info"><b>SEO Architecture & Digital Discovery</b> · High-intent keyword indexing, technical audits, and organic search growth.</div>
</a>

<a class="wcard" id="rotopy-digital" href="/work/rotopy-digital/">
<div class="wc-bar"><span><b aria-hidden="true">↗</b>Rotopy Digital</span><small>Creative & Digital Strategy</small></div>
<div class="wc-media" style="background:#031d20;display:grid;place-items:center;min-height:200px">
<span style="font-family:var(--fd, serif);font-weight:700;font-size:2.2rem;color:var(--a,#e6a137);letter-spacing:0.04em">Rotopy Digital</span>
</div>
<div class="wc-info"><b>Agency Digital Strategy & Campaign Management</b> · Cross-platform digital marketing leadership and performance optimization.</div>
</a>
</div></div></section>'''

work_content_updated = re.sub(
    r'<section class="wdark">.*?</section>',
    new_work_sec,
    work_content,
    flags=re.DOTALL
)
# Also clean the lead text
work_content_updated = work_content_updated.replace(
    'Selected work from the founder’s professional experience.',
    'A showcase of client campaigns, digital strategy, and performance growth.'
)
work_file.write_text(work_content_updated, encoding='utf-8')
print("Updated work/index.html successfully!")

# 3. Clean CSS in assets/css/style.css
css_file = ROOT / 'assets/css/style.css'
css_content = css_file.read_text(encoding='utf-8')

clean_css_append = '''
/* === ULTRA-CLEAN SELECTED WORK SHOWCASE OVERRIDES === */
.wc-media {
  position: relative !important;
  overflow: hidden !important;
  background: #021a1b !important;
  aspect-ratio: 16/9 !important;
  border-bottom: 1px solid rgba(45, 212, 191, 0.12) !important;
}
.wc-media picture,
.wc-media img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
  background-color: transparent !important;
  transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.wcard:hover .wc-media img {
  transform: scale(1.04) !important;
}
.wcard {
  display: flex !important;
  flex-direction: column !important;
  border: 1px solid rgba(45, 212, 191, 0.22) !important;
  border-radius: 16px !important;
  background: rgba(3, 22, 25, 0.88) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  overflow: hidden !important;
  text-decoration: none !important;
  color: inherit !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45) !important;
  transition: border-color 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease !important;
}
.wcard:hover {
  border-color: #e6a137 !important;
  transform: translateY(-5px) !important;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(230, 161, 55, 0.2) !important;
}
.wc-bar {
  padding: 14px 18px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  background: rgba(4, 30, 34, 0.6) !important;
}
.wc-bar span {
  font-family: var(--fb, sans-serif) !important;
  font-weight: 700 !important;
  font-size: 1.05rem !important;
  color: #ffffff !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}
.wc-bar span b {
  color: #e6a137 !important;
  transition: transform 0.3s ease !important;
}
.wcard:hover .wc-bar span b {
  transform: translate(2px, -2px) !important;
}
.wc-bar small {
  font-family: var(--fm, monospace) !important;
  font-size: 0.72rem !important;
  color: #2dd4bf !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
}
.wc-info {
  padding: 16px 18px !important;
  font-size: 0.88rem !important;
  line-height: 1.5 !important;
  color: #9cb8b6 !important;
  background: rgba(3, 20, 23, 0.95) !important;
}
.wc-info b {
  color: #ffffff !important;
  font-weight: 600 !important;
}
/* Eliminate any scanner line or tag overlays */
.scan-laser,
.wc-tag,
.wc-slogan-ribbon,
.ev,
.legend,
.split-note {
  display: none !important;
}
'''

if '/* === ULTRA-CLEAN SELECTED WORK SHOWCASE OVERRIDES === */' not in css_content:
    css_content += clean_css_append
    css_file.write_text(css_content, encoding='utf-8')
    print("Added clean card CSS overrides to style.css!")
