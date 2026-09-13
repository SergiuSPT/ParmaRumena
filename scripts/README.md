Gallery image optimization
==========================

After adding photos to `public/` and listing them in `src/data/gallery.ts`, run:

    npm run gallery:optimize

Requires Node.js 24+ and Python with Pillow (`python -m pip install Pillow`).
The script creates 640px, 1200px, and 2400px WebP derivatives (maximum edge)
in `public/gallery-optimized/` and updates `src/data/gallery-images.json`.
Keep these generated files with the site. The production build uses them
without needing Python. Original photos are never overwritten.

The gallery uses responsive previews. Only the first five photos per stack
load immediately; remaining previews load after expansion as they approach
the viewport. The viewer displays a preview until its 2400px image is decoded.
