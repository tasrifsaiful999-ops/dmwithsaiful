from pathlib import Path
import re

ROOT = Path('c:/Users/user/Downloads/dmwithsaiful')

# 1. Update index.html
index_file = ROOT / 'index.html'
index_html = index_file.read_text(encoding='utf-8')

# Replace the H1 line containing oimg
old_h1_pattern = r'big m<span class="oimg[^"]*">.*?</span>ve<span class="dot">\.</span>'
new_h1_replacement = '''big m<span class="oimg o-portal" aria-label="o">
<span class="o-reel" aria-hidden="true">
<img src="/assets/images/hero-reel-1.webp" alt="3D Holographic Wireframe" class="o-slide active">
<img src="/assets/images/hero-reel-2.webp" alt="Iridescent Digital Sculpture" class="o-slide">
<img src="/assets/images/hero-reel-3.webp" alt="Interactive Digital Interface" class="o-slide">
<img src="/assets/images/hero-reel-4.webp" alt="Anzara Bridal Campaign" class="o-slide">
<img src="/assets/images/hero-reel-5.webp" alt="Azran Menswear Campaign" class="o-slide">
<img src="/assets/images/hero-reel-6.webp" alt="Elor Fine Jewellery Showcase" class="o-slide">
</span>
<span class="o-ring" aria-hidden="true"></span>
<span class="vh">o</span>
</span>ve<span class="dot">.</span>'''

if re.search(old_h1_pattern, index_html):
    index_html = re.sub(old_h1_pattern, new_h1_replacement, index_html)
    index_file.write_text(index_html, encoding='utf-8')
    print("Updated index.html with Algora-style motion portal inside 'big move.'!")
else:
    print("Could not find exact old H1 pattern in index.html, searching alternatives...")
    # Try more general match
    pattern2 = r'big m.*?ve<span class="dot">\.</span>'
    index_html = re.sub(pattern2, new_h1_replacement, index_html)
    index_file.write_text(index_html, encoding='utf-8')
    print("Updated index.html using alternative pattern!")

# 2. Update CSS in assets/css/style.css
css_file = ROOT / 'assets/css/style.css'
css_content = css_file.read_text(encoding='utf-8')

portal_css = '''
/* === ALGORA-STYLE HERO 'O' MOTION PORTAL & ALIGNMENT FIX === */
.hero h1 .ln:nth-child(3) {
  display: inline-flex !important;
  align-items: baseline !important;
  white-space: nowrap !important;
}

.oimg,
.o-portal {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 0.70em !important;
  height: 0.70em !important;
  border-radius: 50% !important;
  vertical-align: -0.05em !important;
  margin: 0 0.02em !important;
  overflow: hidden !important;
  line-height: 1 !important;
  background: #021a1b !important;
  box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.45), 0 0 16px rgba(45, 212, 191, 0.35), 0 4px 20px rgba(0, 0, 0, 0.7) !important;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease !important;
  cursor: pointer !important;
}

.oimg:hover,
.o-portal:hover {
  transform: scale(1.12) !important;
  box-shadow: 0 0 0 2px rgba(230, 161, 55, 0.85), 0 0 24px rgba(230, 161, 55, 0.65), 0 8px 30px rgba(0, 0, 0, 0.8) !important;
}

.o-portal .o-reel {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  border-radius: 50% !important;
  overflow: hidden !important;
}

.o-portal .o-slide {
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
}

.o-portal .o-slide.active {
  opacity: 1 !important;
  transform: scale(1) rotate(0deg) !important;
}

.o-portal .o-ring {
  position: absolute !important;
  inset: 0 !important;
  border-radius: 50% !important;
  border: 2px solid rgba(230, 161, 55, 0.75) !important;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5) !important;
  pointer-events: none !important;
  z-index: 2 !important;
  animation: oRingGlow 3.5s ease-in-out infinite !important;
}

@keyframes oRingGlow {
  0%, 100% {
    border-color: rgba(230, 161, 55, 0.85);
    box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 0 12px rgba(230, 161, 55, 0.4);
  }
  50% {
    border-color: rgba(45, 212, 191, 0.95);
    box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 0 16px rgba(45, 212, 191, 0.5);
  }
}
'''

if '/* === ALGORA-STYLE HERO \'O\' MOTION PORTAL' not in css_content:
    css_content += portal_css
    css_file.write_text(css_content, encoding='utf-8')
    print("Appended portal CSS to style.css!")

# 3. Update JS in assets/js/main.js
js_file = ROOT / 'assets/js/main.js'
js_content = js_file.read_text(encoding='utf-8')

js_func = '''
function initHeroPortal() {
  const portal = document.querySelector('.o-portal');
  if (!portal || portal.__portalInit) return;
  portal.__portalInit = true;
  
  const slides = portal.querySelectorAll('.o-slide');
  if (!slides || slides.length === 0) return;
  
  let current = 0;
  let timer = null;
  
  function showNext() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }
  
  function start() {
    if (timer) clearInterval(timer);
    timer = setInterval(showNext, 2000);
  }
  
  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  
  start();
  portal.addEventListener('mouseenter', stop);
  portal.addEventListener('mouseleave', start);
  portal.addEventListener('click', () => {
    showNext();
    start();
  });
}
'''

if 'initHeroPortal' not in js_content:
    # Append function and call it in init()
    js_content = js_content.replace(
        'function init(){',
        js_func + '\nfunction init(){initHeroPortal();'
    )
    js_file.write_text(js_content, encoding='utf-8')
    print("Integrated initHeroPortal into assets/js/main.js!")
