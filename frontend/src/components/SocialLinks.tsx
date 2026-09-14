import InstagramLink from "./InstagramLink";
import "./SocialLinks.css";

const SocialLinks = () => (
  <div className="social-links">
    <InstagramLink />
    <a className="youtube-link" href="https://www.youtube.com/@ParmaRumena" target="_blank" rel="noopener noreferrer" aria-label="Parma Rumena pe YouTube (se deschide într-o filă nouă)" title="YouTube">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" focusable="false">
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="M10 9l5 3-5 3V9Z" fill="currentColor" stroke="none" />
      </svg>
    </a>
  </div>
);

export default SocialLinks;
