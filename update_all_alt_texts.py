import re
from pathlib import Path

ROOT_DIR = Path('c:/Users/user/Downloads/dmwithsaiful')

ALT_MAPPINGS = {
    'm24': "Anzara Lifestyle luxury South Asian bridal couture campaign portrait",
    'm32': "Azran Men's Wear tailored campaign visual with premium ethnic menswear",
    'm25': "Elor Fine Jewellery handcrafted 22k gold and ruby bridal necklace editorial",
    'm19': "Performance marketing and Meta Ads multi-channel acquisition analytics command center",
    'm20': "Cinema camera video production studio rig for high-engagement social media campaigns",
    'm21': "Creative direction and multi-platform content strategy planning board",
    'm22': "Algorithmic search engine optimization and organic keyword ranking analytics matrix",
    'm34': "Meta Ads Blueprint: Full-funnel testing framework and paid acquisition architecture",
    'm35': "Content Architecture Guide: Cross-platform editorial calendar and publishing workflow",
    'm36': "Technical SEO Infrastructure Guide: Core web vitals and algorithmic search discovery",
    'm2': "DM with SAIFUL creative agency strategy studio and digital marketing workstation",
    'm5': "High-intent Google Ads performance search console and conversion tracking dashboard",
    'm14': "DM with SAIFUL executive creative studio and modern agency strategy office",
    'm15': "Luxury brand campaign showcase and editorial fashion marketing spreads",
    'm17': "Executive consultation suite and client strategy conference lounge",
    'm18': "Agency Manifesto: 'Make it matter. Ideas into measurable action.'",
    'm23': "Algora Healthcare SEO Case Study: 'Turn search into organic discovery.'",
    'm26': "Digital marketing team managing real-time community engagement and social channels",
    'm27': "Aesthetic Events Case Study: 'Good content starts with an artful plan.'",
    'm28': "Conversion Copywriting & Messaging: 'Say less. Mean more.'",
    'm29': "TikTok Organic Growth Studio: 'Find your brand content rhythm.'",
    'm30': "YouTube Channel Management & Strategy: 'Build a channel worth watching.'",
    'm31': "Pinterest Visual Discovery & Aesthetic Architecture: 'Turn visual inspiration into customers.'",
    'm33': "DM with SAIFUL Academy & Masterclass Library: Strategic playbooks and performance training",
}

def update_file_alts(file_path):
    content = file_path.read_text(encoding='utf-8')
    modified = False
    
    def replace_alt(match):
        nonlocal modified
        tag = match.group(0)
        img_id_match = re.search(r'/assets/images/(m\d+)-(?:960|1600)\.webp', tag)
        if not img_id_match:
            return tag
            
        m_id = img_id_match.group(1)
        if m_id in ALT_MAPPINGS:
            new_alt = ALT_MAPPINGS[m_id]
            new_tag = re.sub(r'alt="[^"]*"', f'alt="{new_alt}"', tag)
            if new_tag != tag:
                modified = True
                return new_tag
        return tag
        
    new_content = re.sub(r'<img[^>]+>', replace_alt, content)
    if modified:
        file_path.write_text(new_content, encoding='utf-8')
        return True
    return False

if __name__ == '__main__':
    updated_files = 0
    for html_file in ROOT_DIR.glob('**/*.html'):
        if update_file_alts(html_file):
            updated_files += 1
            print(f"Updated alt texts in: {html_file.relative_to(ROOT_DIR)}")
            
    print(f"\nCompleted! Updated alt texts in {updated_files} HTML files.")
