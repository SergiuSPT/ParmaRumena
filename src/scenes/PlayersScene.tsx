import PlayerCarousel from "../components/PlayerCarousel";
import { mockPlayers } from "../data/players";
import "./PlayersScene.css";

const PlayersScene = () => (
  <section id="players" className="players-scene" aria-labelledby="players-title">
    <header className="players-heading">
      <span className="players-eyebrow">02 / LOTUL NOSTRU</span>
      <h2 id="players-title">O echipă.<br /><span>Mai multe povești.</span></h2>
      <p>Descoperă oamenii care dau energie jocului nostru.</p>
    </header>
    <PlayerCarousel players={mockPlayers} />
  </section>
);

export default PlayersScene;
