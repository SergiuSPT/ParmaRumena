import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supportDetails } from "../data/support";
import SocialLinks from "../components/SocialLinks";
import "./SupportScene.css";

gsap.registerPlugin(ScrollTrigger);

const SupportScene = () => {
  const sceneRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(scene, { backgroundColor: "#07090e" }, {
        backgroundColor: "#ffd51c",
        ease: "none",
        scrollTrigger: { trigger: scene, start: "top 90%", end: "top 25%", scrub: 0.6 },
      });
      gsap.fromTo(scene.querySelector(".support-content"), { y: 55, opacity: 0 }, {
        y: 0, opacity: 1, ease: "power2.out",
        scrollTrigger: { trigger: scene, start: "top 65%", end: "top 20%", scrub: 0.5 },
      });
    });
    const navTrigger = ScrollTrigger.create({
      trigger: scene,
      start: "top 88px",
      end: "bottom 88px",
      toggleClass: { targets: ".navbar", className: "is-on-support" },
    });
    return () => {
      media.revert();
      navTrigger.kill();
      document.querySelector(".navbar")?.classList.remove("is-on-support");
    };
  }, []);

  return (
    <section ref={sceneRef} id="support" className="support-scene" aria-labelledby="support-title">
      <div className="support-pitch" aria-hidden="true"><span /></div>
      <div className="support-content">
        <span className="support-eyebrow">04 / SUSȚINE PARMA RUMENA</span>
        <div className="support-percent" aria-hidden="true">3,5<span>%</span></div>
        <p className="support-manifesto">Un gest mic.<br />Un impact real.</p>
        <h2 id="support-title">Transformă 3,5%<br />în încă un meci.</h2>
        <p className="support-lead">Susține Parma Rumena fără să plătești nimic în plus.</p>
        <p className="support-description">Redirecționează până la 3,5% din impozitul pe venit și ajută-ne să investim în echipament, participarea la competiții și dezvoltarea echipei.</p>
        <a className="support-cta" href={supportDetails.formUrl} target="_blank" rel="noopener noreferrer" aria-describedby="support-form-note">
          REDIRECȚIONEAZĂ 3,5% <span aria-hidden="true">↗</span>
        </a>

        <dl className="support-details" aria-label="Datele asociației beneficiare">
          <div className="support-beneficiary"><dt>Beneficiar:</dt><dd>{supportDetails.beneficiary}</dd></div>
          <div><dt>CIF:</dt><dd>{supportDetails.cif}</dd></div>
          <div><dt>IBAN:</dt><dd>{supportDetails.iban}</dd></div>
          <div><dt>Procent:</dt><dd>{supportDetails.percentage}</dd></div>
        </dl>
        {supportDetails.provisional && <p className="support-provisional">CIF-ul și IBAN-ul sunt provizorii. Datele finale ale asociației vor fi publicate aici înainte de completarea formularului.</p>}
        <p id="support-form-note" className="support-form-note">Butonul deschide formularul 230 într-o filă nouă. Completează datele reale ale beneficiarului. Poți opta pentru distribuirea către același beneficiar pentru o perioadă de <strong>2 ani</strong>.</p>
        <footer className="support-footer">
          <span>PARMA RUMENA</span>
          <span>Împreună, meci după meci.</span>
          <SocialLinks />
        </footer>
      </div>
    </section>
  );
};

export default SupportScene;
