import { useState } from "react";
import type { Player } from "../data/players";
import { getGalleryImage } from "../data/galleryImage";
import "./PlayerCard.css";

type PlayerCardProps = {
  player: Player;
  active: boolean;
  flipped: boolean;
  onFlip: () => void;
};

const PlayerCard = ({ player, active, flipped, onFlip }: PlayerCardProps) => {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  const showPhoto = Boolean(player.photo) && failedPhoto !== player.photo;

  return (
  <article
    className={`player-card${flipped ? " is-flipped" : ""}`}
    role="button"
    tabIndex={active ? 0 : -1}
    aria-pressed={flipped}
    aria-label={`${player.firstName} ${player.lastName}: ${flipped ? "întoarce cardul" : "citește biografia"}`}
    aria-describedby={flipped ? `player-bio-${player.id}` : undefined}
    onClick={() => { if (active) onFlip(); }}
    onKeyDown={(event) => {
      if (active && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopPropagation();
        onFlip();
      }
    }}
  >
    <div className="player-card-inner">
    <div className="player-card-face player-card-front" aria-hidden={flipped}>
    <div className={`player-card-header${showPhoto ? " has-photo" : ""}`}>
      {showPhoto && (
        <img
          key={player.photo}
          className="player-card-photo"
          src={getGalleryImage(player.photo).preview.src}
          alt=""
          draggable={false}
          decoding="async"
          onError={() => setFailedPhoto(player.photo)}
        />
      )}
    <div className="player-card-top">
      <img src="/gallery-optimized/parma-rumena-logo.png" alt="" width="36" height="36" />
      <span>PARMA RUMENA</span>
    </div>
    <div className="player-card-art" aria-hidden="true">
      {!showPhoto && (
      <>
      <span className="player-card-watermark">{String(player.number).padStart(2, "0")}</span>
      <svg className="player-card-shirt" viewBox="0 0 240 240" fill="none">
        <path d="M80 26 38 43 9 103 49 123 66 94 66 218 174 218 174 94 191 123 231 103 202 43 160 26 140 39 100 39Z" fill="#ffd51c" stroke="#e5b60d" strokeWidth="2" />
        <path d="M80 26 66 94 49 123 9 103 38 43Z M160 26 174 94 191 123 231 103 202 43Z" fill="#123466" />
        <path d="M100 39 120 57 140 39 160 26 140 26 120 37 100 26 80 26Z" fill="#123466" />
        <path d="M67 162 174 130V147L67 179Z M67 188 174 156V166L67 198Z" fill="#123466" opacity=".9" />
        <text x="120" y="130" textAnchor="middle" fill="#123466" fontSize="62" fontWeight="900" fontFamily="Inter, sans-serif">{player.number}</text>
      </svg>
      </>
      )}
    </div>
    </div>
    <div className="player-card-identity">
      <span className="player-card-position">{player.position}</span>
      <span className="player-card-first-name">{player.firstName}</span>
      <h3>{player.lastName}</h3>
      <div className="player-card-footer"><span>APASĂ PENTRU POVESTE ↻</span><strong>#{String(player.number).padStart(2, "0")}</strong></div>
    </div>
    </div>
    <div className="player-card-face player-card-back" aria-hidden={!flipped}>
      <div className="player-card-back-header">
        <img src="/gallery-optimized/parma-rumena-logo.png" alt="" width="40" height="40" />
        <span>POVESTEA DIN SPATELE JUCATORULUI</span>
      </div>
      <span className="player-card-position">#{player.number} · {player.position}</span>
      <span className="player-card-first-name">{player.firstName}</span>
      <h3>{player.lastName}</h3>
      <p id={`player-bio-${player.id}`} className="player-card-biography">{player.biography}</p>
      <span className="player-card-back-hint">↻ Apasă pentru a întoarce cardul</span>
    </div>
    </div>
  </article>
);
};

export default PlayerCard;
