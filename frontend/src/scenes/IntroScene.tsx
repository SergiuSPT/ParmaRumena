import {
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import type { RefObject } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TeamScene from "./TeamScene";
import "./IntroScene.css";

gsap.registerPlugin(ScrollTrigger);

type IntroSceneProps = {
  navbarRef: RefObject<HTMLElement | null>;
  onNavbarVisibilityChange: (visible: boolean) => void;
};

const IntroScene = ({ navbarRef, onNavbarVisibilityChange }: IntroSceneProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const mottoRef = useRef<HTMLParagraphElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const teamImageRef = useRef<HTMLDivElement | null>(null);
  const teamTextRef = useRef<HTMLDivElement | null>(null);
  const teamPanelRef = useRef<HTMLDivElement | null>(null);

  /*
   * Mouse 3D effect
   */
  useEffect(() => {
    const logo = logoRef.current;

    if (!logo || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rotateX = gsap.quickTo(logo, "rotationX", {
      duration: 0.6,
      ease: "power3.out",
    });

    const rotateY = gsap.quickTo(logo, "rotationY", {
      duration: 0.6,
      ease: "power3.out",
    });

    const handleMouseMove = (event: MouseEvent) => {
      const mouseX =
        event.clientX / window.innerWidth - 0.5;

      const mouseY =
        event.clientY / window.innerHeight - 0.5;

      rotateY(mouseX * 14);
      rotateX(mouseY * -14);
    };

    const handleMouseLeave = () => {
      rotateX(0);
      rotateY(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, []);

  /*
   * Scroll animation
   */
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const logo = logoRef.current;

      if (!logo) return;

      gsap.set(logo, {
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        transformPerspective: 1200,
      });

      const timeline = gsap.timeline({
        onUpdate: () => onNavbarVisibilityChange(timeline.time() >= 0.72),
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,

          // useful while developing:
          // markers: true,
        },
      });

      /*
       * 0% -> 25%
       *
       * Hero stays mostly still.
       * Small cinematic entrance.
       */
      timeline.fromTo(
        logo,
        {
          scale: 0.85,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.2,
        }
      );

      timeline.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.15,
        },
        "<"
      );

      timeline.fromTo(
        mottoRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.15,
        }
      );

      /*
       * 25% -> 50%
       *
       * Motto disappears.
       */
      timeline.to(
        mottoRef.current,
        {
          opacity: 0,
          y: -25,
          duration: 0.15,
        },
        0.35
      );

      timeline.to(
        scrollRef.current,
        {
          opacity: 0,
          duration: 0.1,
        },
        0.35
      );

      /*
       * Title disappears slightly later.
       */
      timeline.to(
        titleRef.current,
        {
          opacity: 0,
          y: -35,
          scale: 0.9,
          duration: 0.18,
        },
        0.42
      );

      timeline.addLabel("teamEntrance", 0.48);
      timeline.set(teamPanelRef.current, { autoAlpha: 1 }, "teamEntrance");

      /*
       * 50% -> 85%
       *
       * Logo moves to navbar.
       */
      timeline.to(
        logo,
        {
          scale: () => window.innerWidth <= 768
            ? 44 / parseFloat(window.getComputedStyle(logo).width)
            : 0.18,

          left: () => window.innerWidth <= 768 ? 42 : 65,

          top: () => {
            const navbarBounds = navbarRef.current?.getBoundingClientRect();
            return navbarBounds
              ? navbarBounds.top + navbarBounds.height / 2
              : window.innerWidth <= 768 ? 39 : 44;
          },

          duration: 0.38,

          ease: "power2.inOut",
        },
        "teamEntrance"
      );

      // Reveal the team in the same viewport while the logo moves away.
      timeline.fromTo(
        teamImageRef.current,
        { autoAlpha: 0, xPercent: -100 },
        {
          autoAlpha: 1,
          xPercent: 0,
          duration: 0.38,
          ease: "power2.inOut",
        },
        "teamEntrance"
      );

      timeline.fromTo(
        teamTextRef.current,
        { autoAlpha: 0, xPercent: 100 },
        {
          autoAlpha: 1,
          xPercent: 0,
          duration: 0.38,
          ease: "power2.inOut",
        },
        "teamEntrance"
      );

      // Let the page finish the reveal before the team panel accepts scrolling.
      timeline.set(teamPanelRef.current, { pointerEvents: "auto" }, 0.86);

      /*
       * Background transitions into Scene 2.
       */
      timeline.to(
        ".intro-background",
        {
          opacity: 0.55,
          duration: 0.2,
        },
        0.78
      );

      // Recede the team image and text together, leaving the background in place.
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.fromTo(
        teamPanelRef.current,
        { opacity: 1, scale: 1, yPercent: 0 },
        {
          opacity: 0,
          scale: reduceMotion ? 1 : 0.86,
          yPercent: reduceMotion ? 0 : 12,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, [navbarRef, onNavbarVisibilityChange]);

  return (
    <section
      ref={sectionRef}
      className="intro-scene"
    >
      <span id="team" className="intro-team-anchor" aria-hidden="true" />
      <div className="intro-sticky">
        <div className="intro-background">
          <div className="blue-glow" />
          <div className="yellow-glow" />
          <div className="grain" />
        </div>

        <div className="hero-content">
          <h1 ref={titleRef}>
            PARMA RUMENA
          </h1>

          <p ref={mottoRef}>
            Echipă născută din pasiune si prietenie.
          </p>
        </div>

        <div
          ref={teamPanelRef}
          className="intro-team-panel"
          tabIndex={0}
          role="region"
          aria-labelledby="team-title"
        >
          <div ref={teamImageRef} className="intro-team-image">
            <img
              src="/gallery-optimized/parma-demo4-large.webp"
              alt="Jucătorii Parma Rumena împreună, în echipamentul alb si negru"
              decoding="async"
            />
          </div>

          <div
            ref={teamTextRef}
            className="intro-team-text"
          >
            <TeamScene />
          </div>
        </div>

        <div
          ref={scrollRef}
          className="scroll-indicator"
        >
          <span>SCROLL</span>

          <div className="scroll-line" />
        </div>
      </div>

      <img
        ref={logoRef}
        className="floating-logo"
        src="/gallery-optimized/parma-rumena-logo.png"
        alt="Parma Rumena"
      />
    </section>
  );
};

export default IntroScene;
