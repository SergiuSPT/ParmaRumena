import { useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import type { Player } from "../data/players";
import PlayerCard from "./PlayerCard";
import "./PlayerCarousel.css";

const PlayerCarousel = ({ players }: { players: Player[] }) => {
  const [selectedId, setSelectedId] = useState(players[0]?.id);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const suppressClick = useRef(false);
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const activeIndex = Math.max(0, players.findIndex((player) => player.id === selectedId));
  const activePlayer = players[activeIndex];

  if (!activePlayer) return <p className="player-carousel-empty">Lotul echipei va fi anunțat în curând.</p>;

  const select = (index: number) => {
    setFlippedId(null);
    setSelectedId(players[(index + players.length) % players.length].id);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") select(0);
    else if (event.key === "End") select(players.length - 1);
    else select(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick.current = false;
    gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    // Capture on the pressed element so a tap still clicks the card.
    if (event.target instanceof Element) event.target.setPointerCapture(event.pointerId);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    suppressClick.current = Math.abs(dx) > 10 || Math.abs(dy) > 10;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) select(activeIndex + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="player-carousel" role="region" aria-roledescription="carusel" aria-label="Jucătorii Parma Rumena" onKeyDown={onKeyDown} onClickCapture={(event) => {
      if (event.detail > 0 && suppressClick.current && event.target instanceof Element && event.target.closest('.player-carousel-stage')) {
        event.stopPropagation();
        suppressClick.current = false;
      }
    }}>
      <div className="player-carousel-stage" tabIndex={0} aria-label="Folosește săgețile stânga și dreapta pentru a schimba jucătorul" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { gesture.current = null; }}>
        {players.map((player, index) => {
          let offset = (index - activeIndex + players.length) % players.length;
          if (offset > players.length / 2) offset -= players.length;
          const distance = Math.abs(offset);
          return (
            <div key={player.id} className="player-carousel-slide" aria-hidden={offset !== 0} style={{ "--offset": offset, "--distance": distance, "--direction": Math.sign(offset), opacity: distance > 2 ? 0 : 1 - distance * 0.27, zIndex: players.length - distance } as CSSProperties}>
              <PlayerCard player={player} active={offset === 0} flipped={offset === 0 && flippedId === player.id} onFlip={() => setFlippedId((current) => current === player.id ? null : player.id)} />
            </div>
          );
        })}
      </div>
      <div className="player-carousel-controls">
        <button type="button" className="player-carousel-arrow" aria-label="Jucătorul anterior" onClick={() => select(activeIndex - 1)} disabled={players.length < 2}>←</button>
        <span className="player-carousel-count"><strong>{String(activeIndex + 1).padStart(2, "0")}</strong> / {String(players.length).padStart(2, "0")}</span>
        <button type="button" className="player-carousel-arrow" aria-label="Jucătorul următor" onClick={() => select(activeIndex + 1)} disabled={players.length < 2}>→</button>
      </div>
      {/*<div className="player-carousel-caption" aria-live="polite" aria-atomic="true">
        <p className="player-carousel-name">{activePlayer.firstName} {activePlayer.lastName} <span>· {activePlayer.position}</span></p>
        <p>{activePlayer.biography}</p>
      </div>*/}
      <div className="player-carousel-dots" aria-label="Alege un jucător">
        {players.map((player, index) => <button key={player.id} type="button" aria-label={`${player.firstName} ${player.lastName}`} aria-pressed={index === activeIndex} onClick={() => select(index)}><span /></button>)}
      </div>
    </div>
  );
};

export default PlayerCarousel;
