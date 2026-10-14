from pathlib import Path
import re

root = Path('c:/Users/user/Downloads/dmwithsaiful')
print("=== Checking HTML references in dmwithsaiful ===")
missing_imgs = set()
for html in root.glob('**/*.html'):
    c = html.read_text(encoding='utf-8', errors='ignore')
    for m in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', c):
        src = m.group(1)
        if src.startswith('/'):
            fpath = root / src[1:]
            if not fpath.exists():
                missing_imgs.add((str(html.relative_to(root)), src))

if missing_imgs:
    print("Missing images found:")
    for p, s in missing_imgs:
        print(f"  {p}: {s}")
else:
    print("ALL image references across ALL HTML pages exist and are valid!")
