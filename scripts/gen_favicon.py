"""Generate favicon.ico for jojo chess — yellow lab head wearing a chess king's crown.

Run from repo root: `python3 scripts/gen_favicon.py`
"""

from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path

# Design canvas — large for crisp downsampling into the ICO sizes.
CANVAS = 256


def draw(canvas: int) -> Image.Image:
    img = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    d = ImageDraw.Draw(img, "RGBA")
    s = canvas / 32.0  # design grid is 32 units

    fur_light = (240, 210, 150, 255)
    fur = (224, 188, 120, 255)
    fur_dark = (180, 140, 80, 255)
    nose = (40, 28, 20, 255)
    eye = (30, 22, 16, 255)
    eye_hl = (255, 255, 255, 255)
    crown_gold = (245, 200, 50, 255)
    crown_shade = (200, 150, 20, 255)
    crown_outline = (120, 85, 10, 255)
    jewel = (210, 50, 70, 255)
    outline = (60, 40, 20, 255)

    # ---- Crown (chess king vibe, with cross on top center) ----
    # Base band
    d.rectangle((7 * s, 6 * s, 25 * s, 9 * s), fill=crown_shade, outline=crown_outline, width=max(1, int(s * 0.25)))
    # Three points + middle spike
    d.polygon([(7 * s, 6 * s), (10 * s, 6 * s), (8.5 * s, 2 * s)], fill=crown_gold, outline=crown_outline)
    d.polygon([(13 * s, 6 * s), (19 * s, 6 * s), (16 * s, 1 * s)], fill=crown_gold, outline=crown_outline)
    d.polygon([(22 * s, 6 * s), (25 * s, 6 * s), (23.5 * s, 2 * s)], fill=crown_gold, outline=crown_outline)
    # Cross atop the middle point (king piece)
    d.rectangle((15.5 * s, -1 * s, 16.5 * s, 3 * s), fill=crown_gold, outline=crown_outline)
    d.rectangle((14.5 * s, 0.5 * s, 17.5 * s, 1.5 * s), fill=crown_gold, outline=crown_outline)
    # Jewel on the band
    d.ellipse((15 * s, 7 * s, 17 * s, 9 * s), fill=jewel, outline=crown_outline)

    # ---- Ears (floppy, behind head) ----
    d.ellipse((2 * s, 11 * s, 11 * s, 24 * s), fill=fur_dark, outline=outline, width=max(1, int(s * 0.2)))
    d.ellipse((21 * s, 11 * s, 30 * s, 24 * s), fill=fur_dark, outline=outline, width=max(1, int(s * 0.2)))

    # ---- Head ----
    d.ellipse((6 * s, 9 * s, 26 * s, 28 * s), fill=fur, outline=outline, width=max(1, int(s * 0.25)))
    # subtle lighter highlight on forehead
    d.ellipse((11 * s, 11 * s, 21 * s, 17 * s), fill=fur_light)

    # ---- Snout ----
    d.ellipse((11 * s, 19 * s, 21 * s, 27 * s), fill=fur_light, outline=outline, width=max(1, int(s * 0.2)))

    # ---- Nose ----
    d.ellipse((14 * s, 20 * s, 18 * s, 23 * s), fill=nose)

    # ---- Mouth ----
    lw = max(1, int(s * 0.35))
    d.line([(16 * s, 23 * s), (16 * s, 25 * s)], fill=nose, width=lw)
    d.arc((13 * s, 23 * s, 16 * s, 26 * s), start=0, end=90, fill=nose, width=lw)
    d.arc((16 * s, 23 * s, 19 * s, 26 * s), start=90, end=180, fill=nose, width=lw)

    # ---- Eyes ----
    d.ellipse((10.5 * s, 15 * s, 13.5 * s, 18.5 * s), fill=eye)
    d.ellipse((18.5 * s, 15 * s, 21.5 * s, 18.5 * s), fill=eye)
    # tiny highlights
    d.ellipse((11.5 * s, 15.5 * s, 12.5 * s, 16.5 * s), fill=eye_hl)
    d.ellipse((19.5 * s, 15.5 * s, 20.5 * s, 16.5 * s), fill=eye_hl)

    return img


def main():
    root = Path(__file__).resolve().parent.parent
    out = root / "favicon.ico"

    base = draw(CANVAS)
    # PIL will downsample the base image to each requested size.
    sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128)]
    base.save(out, format="ICO", sizes=sizes)
    print(f"wrote {out} ({out.stat().st_size} bytes)")

    # Also export a PNG preview for sanity-checking the design.
    preview = root / "scripts" / "favicon_preview.png"
    base.save(preview, format="PNG")
    print(f"wrote {preview}")


if __name__ == "__main__":
    main()
