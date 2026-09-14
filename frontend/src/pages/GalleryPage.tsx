import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { galleryPhotos, additionalGalleryPhotos } from "../data/gallery";
import GalleryAlbum from "../components/GalleryAlbum";
import SocialLinks from "../components/SocialLinks";
import "./GalleryPage.css";

gsap.registerPlugin(ScrollTrigger, Flip);

const GalleryPage = () => {
  const pageRef = useRef<HTMLElement>(null);
  const albumsRef = useRef<HTMLDivElement>(null);
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const albumAnimation = useRef<gsap.core.Timeline | null>(null);
  const scrollAnchor = useRef<{ element: HTMLElement; top: number } | null>(null);

  const openAlbum = (id: string, element: HTMLElement) => {
    if (id === activeAlbum) return;
    albumAnimation.current?.progress(1).kill();
    scrollAnchor.current = { element, top: element.getBoundingClientRect().top };
    if (albumsRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const visiblePhotos = Array.from(albumsRef.current.querySelectorAll<HTMLElement>(".gallery-photo")).filter((photo) => {
        const bounds = photo.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < window.innerHeight && getComputedStyle(photo).visibility !== "hidden";
      });
      flipState.current = visiblePhotos.length ? Flip.getState(visiblePhotos) : null;
    }
    setActiveAlbum(id);
  };

  useLayoutEffect(() => {
    const anchor = scrollAnchor.current;
    if (anchor) {
      // Keep the clicked stack in view when a tall album above it closes.
      const offset = anchor.element.getBoundingClientRect().top - anchor.top;
      if (Math.abs(offset) > 1) window.scrollBy({ top: offset, behavior: "instant" });
      scrollAnchor.current = null;
    }
    if (flipState.current) {
      albumAnimation.current = Flip.from(flipState.current, {
        duration: 0.7, ease: "power3.inOut", absolute: true,
        scale: true, fade: true, stagger: { amount: 0.2 },
        onComplete: () => { ScrollTrigger.refresh(); },
      });
      flipState.current = null;
    }
    ScrollTrigger.refresh();
    return () => { albumAnimation.current?.kill(); };
  }, [activeAlbum]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Galerie | Parma Rumena";
    return () => { document.title = previousTitle; };
  }, []);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      // The opaque logo stage occupies the initial viewport; photos start below it.
      gsap.to(page.querySelector(".gallery-intro-content"), {
        opacity: 0, scale: 0.78, y: -50, ease: "none",
        scrollTrigger: { trigger: page.querySelector(".gallery-intro"), start: "top top", end: "55% top", scrub: 0.5 },
      });
    }, page);
    return () => media.revert();
  }, []);


  return (
    <main ref={pageRef} className="gallery-page">
      <section className="gallery-intro" aria-label="Bine ai venit în galeria Parma Rumena">
        <div className="gallery-intro-content">
          <div className="gallery-logo-orbit" aria-hidden="true" />
          <span className="gallery-eyebrow">PARMA RUMENA / GALERIE</span>
          <img className="gallery-intro-logo" src="/parma-rumena-logo.png" alt="Parma Rumena" fetchPriority="high" />
          <p>Fiecare meci lasă o poveste.</p>
          <a className="gallery-scroll" href="#gallery-photos">Derulează pentru a o descoperi <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section id="gallery-photos" className="gallery-collection" aria-labelledby="gallery-title">
        <header className="gallery-heading">
          <div><span className="gallery-eyebrow">DIN ALBUMUL NOSTRU</span><h1 id="gallery-title">Jocul trece.<br /><span>Momentele rămân.</span></h1></div>
          <p>Pe teren, în vestiar și împreună.<br />Povestea Parma Rumena, în imagini.</p>
        </header>
        <div ref={albumsRef} className="gallery-albums">
          <GalleryAlbum photos={galleryPhotos} label="Albumul echipei" expanded={activeAlbum === "team"} onExpand={(element) => openAlbum("team", element)} />
          <GalleryAlbum photos={additionalGalleryPhotos} label="Mai multe momente de la meciuri" expanded={activeAlbum === "matches"} onExpand={(element) => openAlbum("matches", element)} />
        </div>
        <footer className="gallery-footer">
          <p>Mai mult decât un meci.<br /><strong>O echipă. O poveste.</strong></p>
          <SocialLinks />
          <a href="/">← Înapoi la Parma Rumena</a>
        </footer>
      </section>


    </main>
  );
};

export default GalleryPage;
