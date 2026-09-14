import PlayerCarousel from "../components/PlayerCarousel";
import type { Player } from "../data/players";
import { useCollection } from "../hooks/useCollection";
import CollectionStatus from "../components/CollectionStatus";
import "./PlayersScene.css";

const PlayersScene = () => {
  const { collection, retry } = useCollection<Player>("/api/players");
  return (
  <section id="players" className="players-scene" aria-labelledby="players-title">
    <header className="players-heading">
      <span className="players-eyebrow">02 / LOTUL NOSTRU</span>
      <h2 id="players-title">O echipă.<br /><span>Mai multe povești.</span></h2>
      <p>Descoperă oamenii care dau energie jocului nostru.</p>
    </header>
    {collection.status === "ready" && collection.demo && <span className="players-demo">Lot demonstrativ</span>}
    {collection.status === "ready" && collection.data.length > 0
      ? <PlayerCarousel players={collection.data} />
      : <CollectionStatus status={collection.status} retry={retry} emptyMessage="Lotul echipei va fi anunțat în curând." />}
  </section>
);
};

export default PlayersScene;
