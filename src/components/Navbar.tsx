import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import "./Navbar.css";

type NavbarProps = {
  navbarRef: RefObject<HTMLElement | null>;
  visible: boolean;
  gallery?: boolean;
};

const Navbar = ({ navbarRef, visible, gallery = false }: NavbarProps) => {
  const home = gallery ? "/" : "";
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !navbarRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const breakpoint = window.matchMedia("(max-width: 768px)");
    const closeOnResize = () => setMenuOpen(false);

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    breakpoint.addEventListener("change", closeOnResize);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
      breakpoint.removeEventListener("change", closeOnResize);
    };
  }, [menuOpen, navbarRef]);

  return (
    <nav ref={navbarRef} className={`navbar${visible ? " is-visible" : ""}${gallery ? " is-gallery" : ""}`} aria-label="Navigație principală">
      <div className="navbar-space" />

      <button
        ref={toggleRef}
        type="button"
        className="navbar-toggle"
        aria-expanded={menuOpen}
        aria-controls="navbar-links"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span>{menuOpen ? "Închide" : "Meniu"}</span>
        <span className="navbar-toggle-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <ul id="navbar-links" className={`navbar-links${menuOpen ? " is-open" : ""}`}>
        <li><a href={`${home}#team`} onClick={() => setMenuOpen(false)}>Echipa</a></li>
        <li><a href={`${home}#players`} onClick={() => setMenuOpen(false)}>Jucători</a></li>
        <li><a href={`${home}#matches`} onClick={() => setMenuOpen(false)}>Meciuri</a></li>
        <li><a href="/galerie/" aria-current={gallery ? "page" : undefined} onClick={() => setMenuOpen(false)}>Galerie</a></li>
        <li>
          <a href={`${home}#support`} className="support-link" onClick={() => setMenuOpen(false)}>
            3,5%
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
