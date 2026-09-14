import "./TeamScene.css";

const TeamScene = () => {
  return (
    <section className="team-scene" aria-labelledby="team-title">
      <div className="team-layout">
        <div className="team-copy">
          <span className="team-eyebrow">01 / ECHIPA NOASTRĂ</span>
          <h2 id="team-title">
            Mai mult decât <span>o echipă.</span>
          </h2>
          <p className="team-lead">
            Ne aduce împreună minifotbalul. Ne ține împreună pasiunea.
          </p>
          <p className="team-description">
            Suntem Parma Rumena. Intrăm pe teren cu bucuria jocului și cu
            încrederea în omul de lângă noi. Fiecare pasă, fiecare efort și
            fiecare gol sunt parte din aceeași poveste: una pe care o scriem
            împreună.
          </p>
          <p className="team-description">
            Pentru noi, echipa înseamnă mai mult decât minutele de meci.
            Înseamnă prietenie, respect și o comunitate care ne dă energie
            să mergem mai departe, indiferent de scor.
          </p>
          <ul className="team-values" aria-label="Valorile echipei">
            <li>Pasiune</li>
            <li>Comunitate</li>
            <li>Spirit de echipă</li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default TeamScene;
