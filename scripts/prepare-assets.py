"""Reproducible temporary crops from user-approved mockups; no invented photography."""
from pathlib import Path
from PIL import Image
import json

root = Path(__file__).resolve().parents[1]
source = root / 'design-references'
target = root / 'apps/web/public/images'
target.mkdir(parents=True, exist_ok=True)
home = 'Timeless Stone_ Taza Marble Landing Page.png'
about = 'Carved in Stone_ Our Story.png'
apps = 'TIMES STONE Applications Showcase.png'
crops = {
    'applications-hero': (apps, (600, 82, 1536, 365)),
    'about-hero': (about, (640, 80, 1536, 278)),
    'application-facade': (apps, (48, 389, 284, 502)),
    'application-interior': (apps, (303, 389, 525, 502)),
    'application-cladding': (apps, (541, 389, 762, 502)),
    'application-stairs': (apps, (780, 389, 1000, 502)),
    'application-landscape': (apps, (1016, 389, 1252, 502)),
    'application-custom': (apps, (1269, 389, 1490, 502)),
    'project-facade': (apps, (49, 648, 396, 834)),
    'project-interior': (apps, (412, 648, 762, 834)),
    'project-stairs': (apps, (780, 648, 1128, 834)),
    'project-landscape': (apps, (1145, 648, 1490, 834)),
    'process-quarry': (about, (523, 696, 712, 798)),
    'process-block': (about, (770, 696, 960, 798)),
    'process-cutting': (about, (1017, 696, 1207, 798)),
    'process-finish': (about, (1264, 696, 1454, 798)),
    'product-studio': ('Taza Beige Limestone Product Showcase.png', (234, 135, 721, 517)),
    'product-beige-texture': ('Taza Beige Limestone Product Showcase.png', (300, 260, 560, 390)),
    'catalogue-hero': ('Time Stone Natural Stone Collection.png', (405, 80, 758, 328)),
    'catalogue-beige': ('Time Stone Natural Stone Collection.png', (200, 476, 332, 584)),
    'catalogue-grey': ('Time Stone Natural Stone Collection.png', (384, 476, 516, 584)),
    'catalogue-tiles': ('Time Stone Natural Stone Collection.png', (569, 476, 701, 584)),
    'catalogue-yellow': ('Time Stone Natural Stone Collection.png', (200, 717, 332, 821)),
    'catalogue-blocks': ('Time Stone Natural Stone Collection.png', (384, 960, 516, 1060)),
    'catalogue-custom': ('Time Stone Natural Stone Collection.png', (569, 960, 701, 1060)),
    'hero-stone': (home, (542, 87, 1081, 475)),
    'quarry': (home, (300, 829, 873, 1024)),
    'limestone': (home, (125, 670, 369, 762)),
    'marble': (home, (387, 670, 629, 762)),
    'tiles': (home, (648, 670, 890, 762)),
    'blocks': (home, (908, 670, 1149, 762)),
    'custom': (home, (1168, 670, 1411, 762)),
    'facade': (apps, (48, 390, 284, 504)),
    'interior': (apps, (303, 390, 525, 504)),
    'cladding': (apps, (540, 390, 762, 504)),
    'stairs': (apps, (780, 390, 1000, 504)),
    'architecture': (about, (668, 305, 1082, 565)),
}
manifest = []
for name, (filename, box) in crops.items():
    with Image.open(source / filename) as original:
        image = original.crop(box).convert('RGB')
        image.save(target / f'{name}.webp', 'WEBP', quality=88, method=6)
        manifest.append({'file': f'{name}.webp', 'source': filename, 'crop': box,
                         'width': image.width, 'height': image.height,
                         'temporary': True})
(target / 'provenance.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
with Image.open(root / 'prototype/public/textures/marble_rock_01.jpg') as original:
    original.convert('RGB').save(target / 'product-marble-texture.webp', 'WEBP', quality=88, method=6)
manifest.append({'file': 'product-marble-texture.webp', 'source': 'prototype/public/textures/marble_rock_01.jpg', 'license': 'CC0', 'credit': 'Poly Haven https://polyhaven.com/a/marble_rock_01', 'temporary': True})
(target / 'provenance.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(f'Prepared {len(manifest)} labeled temporary image assets.')
