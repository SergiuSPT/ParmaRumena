import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import Football from "../components/Football";
import type { Match } from "../data/matches";
import { useCollection } from "../hooks/useCollection";
import CollectionStatus from "../components/CollectionStatus";
import "./MatchesScene.css";

const dateFormat = new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const weekdayFormat = new Intl.DateTimeFormat("ro-RO", { weekday: "long", timeZone: "UTC" });
const MatchesContent = ({ matches, demo }: { matches: Match[]; demo: boolean }) => {
  const clamp = (value: number) => Math.max(0, Math.min(matches.length - 1, value));
  const firstUpcomingIndex = Math.max(0, matches.findIndex((match) => !match.score));
  const [position, setPosition] = useState(firstUpcomingIndex);
  const [dragging, setDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    let frame = 0;
    let previousTime = performance.now();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const readProgress = () => {
      const viewport = window.innerHeight;
      const top = carousel.getBoundingClientRect().top;
      return Math.max(0, Math.min(1, (viewport * 0.9 - top) / (viewport * 0.5)));
    };
    let progress = readProgress();
    carousel.style.setProperty("--shot-progress", String(progress));
    // Time-based damping smooths wheel steps equally on 60 Hz and 120 Hz screens.
    const updateFlight = (now: number) => {
      const target = readProgress();
      const elapsed = Math.min(64, now - previousTime);
      previousTime = now;
      progress += (target - progress) * (1 - Math.exp(-elapsed / 110));
      const settled = motionQuery.matches || Math.abs(target - progress) < 0.0001;
      if (settled) progress = target;
      carousel.style.setProperty("--shot-progress", String(progress));
      frame = settled ? 0 : requestAnimationFrame(updateFlight);
    };
    const scheduleUpdate = () => {
      if (!frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(updateFlight);
      }
    };
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.documentElement);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
    };
  }, []);
  const animation = useRef(0);
  useEffect(() => () => cancelAnimationFrame(animation.current), []);
  const gesture = useRef<{ id: number; x: number; start: number; width: number } | null>(null);
  const activeIndex = Math.round(position);
  const select = (index: number) => {
    cancelAnimationFrame(animation.current);
    const target = clamp(index);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPosition(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 360);
      setPosition(position + (target - position) * (1 - (1 - progress) ** 3));
      if (progress < 1) animation.current = requestAnimationFrame(tick);
    };
    animation.current = requestAnimationFrame(tick);
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    cancelAnimationFrame(animation.current);
    const card = event.currentTarget.querySelector<HTMLElement>(".match-card");
    gesture.current = { id: event.pointerId, x: event.clientX, start: position, width: (card?.offsetWidth ?? 360) + 24 };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    setPosition(clamp(start.start + (start.x - event.clientX) / start.width));
  };
  const finishDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    gesture.current = null;
    const delta = (start.x - event.clientX) / start.width;
    select(cancelled ? Math.round(start.start) : Math.abs(delta) > 0.16 ? Math.round(start.start) + Math.sign(delta) * Math.max(1, Math.round(Math.abs(delta))) : Math.round(start.start));
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (gesture.current) return;
    select(event.key === "Home" ? 0 : event.key === "End" ? matches.length - 1 : activeIndex + (event.key === "ArrowRight" ? 1 : -1));
  };

  return (
    <section id="matches" className={`matches-scene${dragging ? " is-dragging" : ""}`} aria-labelledby="matches-title">
      <header className="matches-heading">
        <span className="matches-eyebrow">03 / MECIURI</span>
        <h2 id="matches-title">Următorul fluier.<br /><span>Aceeași pasiune.</span></h2>
        <p>Rezultatele de ieri. Emoția următorului meci.</p>
        <span className="matches-demo">{demo ? "Meciuri și rezultate demonstrative · " : ""}Ore locale, România</span>
      </header>

      <div ref={carouselRef} className="matches-carousel" role="region" aria-roledescription="carusel" aria-label="Meciuri și rezultate" onKeyDown={onKeyDown}>
        <div className="matches-ball-backdrop">
          <div className="matches-ball-flight"><Football rotation={(position - firstUpcomingIndex) * -65 + 12} /></div>
        </div>
        <div className="matches-stage" tabIndex={0} aria-label="Trage sau folosește săgețile stânga și dreapta pentru a explora meciurile" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={(event) => finishDrag(event, true)} onLostPointerCapture={(event) => finishDrag(event, true)}>
          <div className="matches-track" style={{ "--position": position } as CSSProperties}>
            {matches.map((match, index) => {
              const date = new Date(`${match.date}T12:00:00Z`);
              const club = <div className="match-team"><img src="/gallery-optimized/parma-rumena-logo.png" alt="" draggable={false} /><strong>Parma Rumena</strong></div>;
              const opponent = <div className="match-team"><span className="match-opponent-crest" aria-hidden="true">{match.initials}</span><strong>{match.opponent}</strong></div>;
              return (
                <article key={match.id} className={`match-card${index === activeIndex ? " is-active" : ""}`} aria-label={`Meci ${index + 1} din ${matches.length}`}>
                  <div className="match-card-top"><span>{match.competition}</span><span>Etapa {String(match.round).padStart(2, "0")}</span></div>
                  <span className={`match-status${match.score ? " is-finished" : ""}`}>{match.score ? "Încheiat" : "Urmează"}</span>
                  <div className="match-date"><span>{weekdayFormat.format(date)}</span><time dateTime={match.date}>{dateFormat.format(date)}</time></div>
                  <div className="match-teams">{match.home ? club : opponent}<span className="match-vs">VS</span>{match.home ? opponent : club}</div>
                  {match.score ? (
                    <div className="match-kickoff match-result">
                      <strong aria-label={`${match.home ? "Parma Rumena" : match.opponent} ${match.score.home}, ${match.home ? match.opponent : "Parma Rumena"} ${match.score.away}`}>{match.score.home} – {match.score.away}</strong>
                    </div>
                  ) : (
                    <div className="match-kickoff"><time>{match.time}</time></div>
                  )}
                  <footer className="match-card-footer"><span>{match.venue}</span><span className="match-location">{match.home ? "Acasă" : "Deplasare"}</span></footer>
                </article>
              );
            })}
          </div>
        </div>
        <div className="matches-controls">
          <button type="button" onClick={() => select(activeIndex - 1)} disabled={activeIndex === 0 || dragging} aria-label="Meciul anterior">←</button>
          <span aria-live={dragging ? "off" : "polite"} aria-atomic="true"><strong>{String(activeIndex + 1).padStart(2, "0")}</strong> / {String(matches.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => select(activeIndex + 1)} disabled={activeIndex === matches.length - 1 || dragging} aria-label="Meciul următor">→</button>
        </div>
        <p className="matches-hint"><span aria-hidden="true">↔</span> Explorează rezultatele și meciurile viitoare</p>
      </div>
    </section>
  );
};

const MatchesScene = () => {
  const { collection, retry } = useCollection<Match>("/api/matches");
  if (collection.status === "ready" && collection.data.length > 0) {
    return <MatchesContent matches={collection.data} demo={collection.demo} />;
  }
  return (
    <section id="matches" className="matches-scene" aria-labelledby="matches-title">
      <header className="matches-heading"><span className="matches-eyebrow">03 / MECIURI</span><h2 id="matches-title">Meciurile noastre.</h2></header>
      <CollectionStatus status={collection.status} retry={retry} emptyMessage="Programul meciurilor va fi anunțat în curând." />
    </section>
  );
};

export default MatchesScene;
