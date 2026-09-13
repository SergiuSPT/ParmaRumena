import { useRef, useState } from "react";
import IntroScene from "./scenes/IntroScene";
import PlayersScene from "./scenes/PlayersScene";
import MatchesScene from "./scenes/MatchesScene";
import SupportScene from "./scenes/SupportScene";
import Navbar from "./components/Navbar";
import GalleryPage from "./pages/GalleryPage";
import "./App.css";

function App() {
  const navbarRef = useRef<HTMLElement | null>(null);
  const [navbarVisible, setNavbarVisible] = useState(false);
  const isGallery = /^\/galerie(?:\/|\/index\.html)?$/.test(window.location.pathname);

  if (isGallery) return <><Navbar navbarRef={navbarRef} visible gallery /><GalleryPage /></>;

  return (
    <>
      <Navbar navbarRef={navbarRef} visible={navbarVisible} />

      <main>
        <IntroScene navbarRef={navbarRef} onNavbarVisibilityChange={setNavbarVisible} />
        <PlayersScene />
        <MatchesScene />
        <SupportScene />
      </main>
    </>
  );
}

export default App;
