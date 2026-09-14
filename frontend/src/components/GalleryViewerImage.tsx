import { useEffect, useState } from "react";
import { getGalleryImage } from "../data/galleryImage";
import type { GalleryPhoto } from "../data/gallery";

const GalleryViewerImage = ({ photo }: { photo: GalleryPhoto }) => {
  const image = getGalleryImage(photo.src);
  const [source, setSource] = useState(image.preview.src);

  useEffect(() => {
    let cancelled = false;
    const large = new Image();
    large.src = image.large.src;
    // Keep the preview visible until the larger image is ready to paint.
    large.decode().then(() => {
      if (!cancelled) setSource(image.large.src);
    }).catch(() => { /* Keep the preview if the larger request fails. */ });
    return () => { cancelled = true; };
  }, [image.large.src]);

  return <img src={source} alt={photo.alt} width={image.large.width} height={image.large.height} />;
};

export default GalleryViewerImage;
