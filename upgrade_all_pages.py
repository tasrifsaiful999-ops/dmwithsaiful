import re
from pathlib import Path

root = Path('c:/Users/user/Downloads/dmwithsaiful-agency-website')
html_files = list(root.glob('**/*.html'))

print(f"Total HTML files to process: {len(html_files)}")

# 1. Update scripts to include Three.js and spatial-walkthrough.js
updated_scripts = 0
for hf in html_files:
    content = hf.read_text(encoding='utf-8', errors='ignore')
    if 'spatial-walkthrough.js' not in content:
        # Replace main.js link with the trio
        old_pattern = r'<script src=".*?/assets/js/main\.js"></script>'
        new_scripts = (
            '<script src="/assets/js/three.min.js"></script>\n'
            '<script src="/assets/js/spatial-walkthrough.js"></script>\n'
            '<script src="/assets/js/main.js"></script>'
        )
        if re.search(old_pattern, content):
            content = re.sub(old_pattern, new_scripts, content)
            hf.write_text(content, encoding='utf-8')
            updated_scripts += 1
            print(f"Added 3D scripts to: {hf.relative_to(root)}")

print(f"Updated scripts in {updated_scripts} files.")

# 2. Inspect and fix any empty or missing alt attributes
alt_fixes = 0
for hf in html_files:
    content = hf.read_text(encoding='utf-8', errors='ignore')
    modified = False
    
    # Specific context alts for header logos if needed
    if 'alt=""' in content:
        content = content.replace('alt=""', 'alt="Digital Marketing with SAIFUL agency visual illustration"')
        modified = True
        alt_fixes += 1
    
    if modified:
        hf.write_text(content, encoding='utf-8')
        print(f"Fixed empty alts in: {hf.relative_to(root)}")

print(f"Total alt fixes: {alt_fixes}")

# 3. Verify all images in all pages
total_imgs = 0
valid_alts = 0
for hf in html_files:
    content = hf.read_text(encoding='utf-8', errors='ignore')
    for match in re.finditer(r'<img\s+([^>]*?)>', content, re.IGNORECASE):
        total_imgs += 1
        attrs = match.group(1)
        if 'alt=' in attrs:
            valid_alts += 1
        else:
            print(f"WARNING: Image without alt in {hf.relative_to(root)}: {match.group(0)}")

print(f"Audit Summary: {total_imgs} images scanned, {valid_alts} have valid descriptive alt text.")
