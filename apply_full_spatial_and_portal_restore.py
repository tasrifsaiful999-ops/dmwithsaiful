import re
from pathlib import Path

ROOT = Path('c:/Users/user/Downloads/dmwithsaiful')

# 1. Ensure three.min.js and spatial-walkthrough.js exist in assets/js
js_dir = ROOT / 'assets/js'
three_js = js_dir / 'three.min.js'
spatial_js = js_dir / 'spatial-walkthrough.js'

print(f"three.min.js exists: {three_js.exists()} ({three_js.stat().st_size if three_js.exists() else 0} bytes)")
print(f"spatial-walkthrough.js exists: {spatial_js.exists()} ({spatial_js.stat().st_size if spatial_js.exists() else 0} bytes)")

# 2. Update all HTML files with Three.js and spatial-walkthrough.js scripts
html_files = list(ROOT.glob('**/*.html'))
print(f"\nScanning {len(html_files)} HTML files for 3D walkthrough scripts...")

script_tag = '''<script src="/assets/js/three.min.js"></script>
<script src="/assets/js/spatial-walkthrough.js"></script>
<script src="/assets/js/main.js"></script>'''

updated_html_count = 0
for hf in html_files:
    content = hf.read_text(encoding='utf-8', errors='ignore')
    modified = False
    
    # Check if spatial-walkthrough.js is missing
    if 'spatial-walkthrough.js' not in content:
        # Replace main.js with all 3
        if '<script src="/assets/js/main.js"></script>' in content:
            content = content.replace('<script src="/assets/js/main.js"></script>', script_tag)
            modified = True
        elif re.search(r'<script src=".*?/assets/js/main\.js"></script>', content):
            content = re.sub(r'<script src=".*?/assets/js/main\.js"></script>', script_tag, content)
            modified = True
            
    if modified:
        hf.write_text(content, encoding='utf-8')
        updated_html_count += 1
        print(f"  Added 3D scripts to: {hf.relative_to(ROOT)}")

print(f"Updated 3D walkthrough scripts in {updated_html_count} HTML files.")

# 3. Update style.css with full 3D walkthrough and hero portal CSS
css_file = ROOT / 'assets/css/style.css'
css_content = css_file.read_text(encoding='utf-8')

recovered_css_file = ROOT / 'recovered_spatial.css'
spatial_css = recovered_css_file.read_text(encoding='utf-8') if recovered_css_file.exists() else ''

master_spatial_and_portal_css = f'''
/* ==========================================================================
   3D ARCHITECTURAL SPATIAL WALKTHROUGH & HERO PORTAL MASTER ENGINE
   ========================================================================== */
{spatial_css}

/* Transparent base layers so 3D spatial viewport is fully visible */
body {{
  background-color: transparent !important;
}}

#app {{
  position: relative !important;
  z-index: 1 !important;
}}

/* Hero section full transparency & white/cyan cyber-teal typography */
.hero {{
  background: transparent !important;
  min-height: 90vh !important;
}}

.hero h1 {{
  color: #e2f8f8 !important;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.7), 0 0 40px rgba(19, 194, 194, 0.25) !important;
}}

.hero h1 .dot {{
  color: #e6a137 !important;
}}

.hero .eyebrow {{
  color: #2dd4bf !important;
  text-transform: uppercase !important;
  letter-spacing: 0.14em !important;
}}

.hero .hsub {{
  color: #c4dbd9 !important;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.8) !important;
}}

/* === ROCK-SOLID INLINE POSITIONING FOR 'O' IN 'BIG MOVE.' === */
.hero h1 .ln:nth-child(3) {{
  display: inline-flex !important;
  align-items: baseline !important;
  white-space: nowrap !important;
  margin: 0 !important;
  padding: 0 !important;
}}

.oimg,
.o-portal {{
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 0.68em !important;
  height: 0.68em !important;
  border-radius: 50% !important;
  vertical-align: -0.05em !important;
  margin: 0 0.02em !important;
  overflow: hidden !important;
  flex-shrink: 0 !important;
  line-height: 1 !important;
  background: #021a1b !important;
  box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.5), 0 0 20px rgba(45, 212, 191, 0.4), 0 6px 24px rgba(0, 0, 0, 0.8) !important;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease !important;
  cursor: pointer !important;
}}

.oimg:hover,
.o-portal:hover {{
  transform: scale(1.12) !important;
  box-shadow: 0 0 0 2px rgba(230, 161, 55, 0.9), 0 0 26px rgba(230, 161, 55, 0.7), 0 8px 32px rgba(0, 0, 0, 0.9) !important;
}}

.o-portal .o-reel {{
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  border-radius: 50% !important;
  overflow: hidden !important;
}}

.o-portal .o-slide {{
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  border-radius: 50% !important;
  opacity: 0 !important;
  transform: scale(1.18) rotate(4deg) !important;
  transition: opacity 0.75s cubic-bezier(0.4, 0, 0.2, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) !important;
  pointer-events: none !important;
}}

.o-portal .o-slide.active {{
  opacity: 1 !important;
  transform: scale(1) rotate(0deg) !important;
}}

.o-portal .o-ring {{
  position: absolute !important;
  inset: 0 !important;
  border-radius: 50% !important;
  border: 2px solid rgba(230, 161, 55, 0.8) !important;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6) !important;
  pointer-events: none !important;
  z-index: 2 !important;
  animation: oRingPulseGlow 3.5s ease-in-out infinite !important;
}}

@keyframes oRingPulseGlow {{
  0%, 100% {{
    border-color: rgba(230, 161, 55, 0.85);
    box-shadow: inset 0 0 10px rgba(0,0,0,0.6), 0 0 14px rgba(230, 161, 55, 0.45);
  }}
  50% {{
    border-color: rgba(45, 212, 191, 0.95);
    box-shadow: inset 0 0 10px rgba(0,0,0,0.6), 0 0 18px rgba(45, 212, 191, 0.55);
  }}
}}
'''

# Replace or append
if '/* ==========================================================================\n   3D ARCHITECTURAL SPATIAL WALKTHROUGH' in css_content:
    idx = css_content.find('/* ==========================================================================\n   3D ARCHITECTURAL SPATIAL WALKTHROUGH')
    css_content = css_content[:idx] + master_spatial_and_portal_css
else:
    css_content += master_spatial_and_portal_css

css_file.write_text(css_content, encoding='utf-8')
print("Updated style.css with Master 3D Spatial Walkthrough & Hero Portal CSS!")

# 4. Verify index.html H1
index_file = ROOT / 'index.html'
index_html = index_file.read_text(encoding='utf-8')

# Ensure script tags are at bottom of index.html
if 'spatial-walkthrough.js' not in index_html:
    index_html = index_html.replace('<script src="/assets/js/main.js"></script>', script_tag)
    index_file.write_text(index_html, encoding='utf-8')
    print("Verified 3D scripts in index.html!")

print("\nVerification complete! All 3D spatial walkthrough engines and hero portal active.")
