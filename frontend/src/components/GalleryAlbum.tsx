import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { GalleryPhoto } from "../data/gallery";
import { getGalleryImage } from "../data/galleryImage";
import GalleryViewerImage from "./GalleryViewerImage";

type GalleryAlbumProps = {
  photos: GalleryPhoto[];
  label: string;
  expanded: boolean;
  onExpand: (album: HTMLElement) => void;
};

const GalleryAlbum = ({ photos: galleryPhotos, label, expanded, onExpand }: GalleryAlbumProps) => {
  const albumId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const selected = galleryPhotos[selectedIndex];

  useEffect(() => {
    // Decode the small stack previews while the user is viewing the logo.
    gridRef.current?.querySelectorAll<HTMLImageElement>("img").forEach((image, index) => {
      if (index < 5) void image.decode().catch(() => {});
    });
  }, [galleryPhotos]);

  const expandAlbum = () => {
    const album = gridRef.current?.closest<HTMLElement>(".gallery-album");
    if (album) onExpand(album);
  };

  const openPhoto = (index: number, opener: HTMLButtonElement) => {
    setSelectedIndex(index);
    setViewerOpen(true);
    openerRef.current = opener;
    dialogRef.current?.showModal();
  };
  const closePhoto = () => dialogRef.current?.close();
  const changePhoto = (direction: number) => setSelectedIndex((index) => (index + direction + galleryPhotos.length) % galleryPhotos.length);

  if (!selected) return null;

  return (
    <section className={`gallery-album${expanded ? " is-expanded" : ""}`} aria-label={label}>
        <div ref={gridRef} id={albumId} className={`gallery-grid${expanded ? "" : " is-stacked"}`}>
          {galleryPhotos.map((photo, index) => {
            const image = getGalleryImage(photo.src);
            const loadPreview = expanded || index < 5;
            const srcSet = image.small.width < image.preview.width
              ? `${image.small.src} ${image.small.width}w, ${image.preview.src} ${image.preview.width}w`
              : undefined;
            return (
            <figure key={photo.id} className={`gallery-photo gallery-photo--${photo.layout}`} aria-hidden={!expanded && index > 0 ? true : undefined} style={{ "--stack-layer": Math.min(index, 4), "--stack-angle": `${[0, -5, 5, -9, 9][Math.min(index, 4)]}deg`, zIndex: expanded ? undefined : galleryPhotos.length - index } as CSSProperties}>
              <button type="button" className="gallery-photo-button" onClick={(event) => expanded ? openPhoto(index, event.currentTarget) : expandAlbum()} tabIndex={!expanded && index > 0 ? -1 : 0} aria-label={expanded ? `Deschide fotografia: ${photo.title}` : `${label}: deschide albumul cu ${galleryPhotos.length} fotografii`} aria-haspopup={expanded ? "dialog" : undefined} aria-expanded={!expanded ? false : undefined} aria-controls={!expanded ? albumId : undefined}>
                <img src={loadPreview ? image.preview.src : undefined} srcSet={loadPreview ? srcSet : undefined} sizes="(max-width: 768px) 80vw, 500px" width={image.preview.width} height={image.preview.height} alt={photo.alt} loading={index < 5 ? "eager" : "lazy"} decoding="async" />
                <span className="gallery-photo-open" aria-hidden="true">{expanded ? "↗" : "+"}</span>
              </button>
            </figure>
          ); })}
        </div>
        {!expanded && <p className="gallery-stack-hint">{galleryPhotos.length} fotografii <span aria-hidden="true">·</span> Apasă pe teanc pentru a deschide albumul</p>}
      <dialog ref={dialogRef} className="gallery-lightbox" aria-label="Fotografie mărită" onClose={() => { setViewerOpen(false); openerRef.current?.focus({ preventScroll: true }); }} onClick={(event) => { if (event.target === event.currentTarget) closePhoto(); }} onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          changePhoto(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
        <button type="button" className="gallery-lightbox-close" onClick={closePhoto} autoFocus aria-label="Închide fotografia">✕</button>
        <figure>{viewerOpen && <GalleryViewerImage key={selected.id} photo={selected} />}<figcaption aria-live="polite"><span>{selectedIndex + 1} / {galleryPhotos.length}</span></figcaption></figure>
        <div className="gallery-lightbox-controls"><button type="button" onClick={() => changePhoto(-1)} aria-label="Fotografia anterioară">←</button><button type="button" onClick={() => changePhoto(1)} aria-label="Fotografia următoare">→</button></div>
      </dialog>
    </section>
  );
};

export default GalleryAlbum;
