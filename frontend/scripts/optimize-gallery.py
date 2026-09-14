"""Generate web-sized derivatives; originals are never modified. Requires Pillow."""
import json
from pathlib import Path
import sys
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
public = root / "public"
output = public / "gallery-optimized"
output.mkdir(exist_ok=True)
manifest = {}
original_bytes = preview_bytes = large_bytes = 0
for source in json.load(sys.stdin):
    original = (public / source.lstrip("/")).resolve()
    if not original.is_relative_to(public) or not original.is_file():
        raise ValueError(f"Invalid gallery source: {source}")
    original_bytes += original.stat().st_size
    with Image.open(original) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        entry = {}
        for label, size, quality in [("small", 640, 78), ("preview", 1200, 80), ("large", 2400, 85)]:
            variant = image.copy()
            variant.thumbnail((size, size), Image.Resampling.LANCZOS)
            destination = output / f"{original.stem}-{label}.webp"
            variant.save(destination, "WEBP", quality=quality, method=4)
            entry[label] = {"src": f"/gallery-optimized/{destination.name}", "width": variant.width, "height": variant.height}
            if label == "preview": preview_bytes += destination.stat().st_size
            if label == "large": large_bytes += destination.stat().st_size
        manifest[source] = entry
(root / "src/data/gallery-images.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(f"Generated {len(manifest)} photos in three sizes.")
print(f"Originals: {original_bytes / 1e6:.1f} MB; 1200px previews: {preview_bytes / 1e6:.1f} MB; 2400px viewer images: {large_bytes / 1e6:.1f} MB.")
