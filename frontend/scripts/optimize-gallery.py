"""Generate web-sized derivatives; originals are never modified. Requires Pillow."""
import json
from pathlib import Path
import sys
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
public = root / "public"
output = public / "gallery-optimized"
output.mkdir(exist_ok=True)
manifest_path = root / "src/data/gallery-images.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {}
original_bytes = preview_bytes = large_bytes = 0
for source in json.load(sys.stdin):
    original = (public / source.lstrip("/")).resolve()
    if not original.is_relative_to(public):
        raise ValueError(f"Invalid gallery source: {source}")
    existing = manifest.get(source, {})
    variants = [(public / item["src"].lstrip("/")).resolve() for item in existing.values()]
    complete = set(existing) == {"small", "preview", "large"} and all(
        path.is_relative_to(output) and path.is_file() for path in variants
    )
    if complete and (not original.is_file() or all(path.stat().st_mtime >= original.stat().st_mtime for path in variants)):
        continue
    if not original.is_file():
        raise ValueError(f"Missing original and optimized images: {source}")
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
manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(f"Available: {len(manifest)} photos in three sizes (existing optimized photos retained).")
print(f"Originals: {original_bytes / 1e6:.1f} MB; 1200px previews: {preview_bytes / 1e6:.1f} MB; 2400px viewer images: {large_bytes / 1e6:.1f} MB.")
