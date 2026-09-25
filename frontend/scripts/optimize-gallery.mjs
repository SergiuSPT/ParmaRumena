import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { galleryPhotos, additionalGalleryPhotos, recentGalleryPhotos } from '../src/data/gallery.ts';

const publicPhotos = readdirSync(new URL('../public/', import.meta.url))
  .filter(name => /\.(jpe?g|webp)$/i.test(name)).map(name => `/${name}`);
const sources = [...new Set([...galleryPhotos, ...additionalGalleryPhotos, ...recentGalleryPhotos].map(photo => photo.src).concat(publicPhotos))];
const result = spawnSync('python', ['scripts/optimize-gallery.py'], {
  input: JSON.stringify(sources), encoding: 'utf8', maxBuffer: 1024 * 1024,
});
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
