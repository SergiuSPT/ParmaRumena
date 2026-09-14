import manifest from "./gallery-images.json";

type Variant = { src: string; width: number; height: number };
type GalleryImage = { small: Variant; preview: Variant; large: Variant };

export const getGalleryImage = (source: string): GalleryImage => {
  const image = (manifest as Record<string, GalleryImage>)[source];
  // New photos still work before running npm run gallery:optimize.
  const fallback = { src: source, width: 1200, height: 1200 };
  return image ?? { small: fallback, preview: fallback, large: fallback };
};
