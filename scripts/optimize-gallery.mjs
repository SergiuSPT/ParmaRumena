import { spawnSync } from 'node:child_process';
import { galleryPhotos, additionalGalleryPhotos } from '../src/data/gallery.ts';

const sources = [...new Set([...galleryPhotos, ...additionalGalleryPhotos].map(photo => photo.src))];
const result = spawnSync('python', ['scripts/optimize-gallery.py'], {
  input: JSON.stringify(sources), encoding: 'utf8', maxBuffer: 1024 * 1024,
});
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
