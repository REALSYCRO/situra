"""Regenerates og-image.png from scratch (diagonal gradient + logo mark + copy).

Run from the repo root: python3 scripts/generate_og_image.py
Requires: pillow, numpy
"""

import os

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
c1 = np.array([0x4F, 0x46, 0xE5], dtype=float)
c2 = np.array([0x7C, 0x74, 0xF0], dtype=float)

# Diagonal gradient (top-left -> bottom-right), matching the SVG's x1=0,y1=0 -> x2=1,y2=1
xs = np.linspace(0, 1, W)
ys = np.linspace(0, 1, H)
xv, yv = np.meshgrid(xs, ys)
t = ((xv + yv) / 2)[:, :, None]
grad = (c1 * (1 - t) + c2 * t).astype(np.uint8)
img = Image.fromarray(grad, mode="RGB").convert("RGBA")

FONT_CANDIDATES = [
    "/System/Library/Fonts/HelveticaNeue.ttc",  # macOS
    "C:/Windows/Fonts/arialbd.ttf",  # Windows (bold)
]


def load_font(size, bold=True):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size, index=0)
            except OSError:
                continue
    return ImageFont.load_default()


f_mark = load_font(56)
f_title = load_font(72)
f_sub = load_font(34)
f_tag = load_font(26)

# Rounded square badge, alpha-blended onto the gradient
overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
odraw = ImageDraw.Draw(overlay)
odraw.rounded_rectangle([90, 90, 186, 186], radius=22, fill=(255, 255, 255, 38))
img = Image.alpha_composite(img, overlay)

draw = ImageDraw.Draw(img, "RGBA")
bbox = draw.textbbox((0, 0), "S", font=f_mark)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
draw.text((138 - tw / 2 - bbox[0], 138 - th / 2 - bbox[1]), "S", font=f_mark, fill=(255, 255, 255, 255))

draw.text((90, 330 - 72), "Situra", font=f_title, fill=(255, 255, 255, 255))
draw.text((90, 400 - 34), "Websites für kleine Unternehmen", font=f_sub, fill=(255, 255, 255, 235))
draw.text((90, 470 - 26), "Festpreis · Persönlicher Ansprechpartner · Laufende Betreuung", font=f_tag, fill=(255, 255, 255, 191))

out_path = os.path.join(os.path.dirname(__file__), "..", "og-image.png")
img.convert("RGB").save(out_path, "PNG")
print(f"saved {out_path}")
