import { useRef } from "react";
import { Link } from "react-router-dom";
import { SITE_NAME } from "../../lib/constants";
import { gsap } from "../../fx/gsap";
import { useGsap } from "../../fx/useGsap";
import GradientField from "../../fx/GradientField";
import Badge from "../../fx/Badge";
import { useMotionEngine } from "../motion/motion-context";
import { BrandMark } from "./Navbar";

const COLUMNS = [
  {
    title: "Who we are",
    links: [
      { label: "About", to: "/about" },
      { label: "Ministries", to: "/ministries" },
      { label: "Project Heal", to: "/project-heal" },
      { label: "Project Move", to: "/project-move" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { label: "Chapters", to: "/chapters" },
      { label: "Events", to: "/events" },
      { label: "Volunteer", to: "/volunteer" },
      { label: "Invite Us", to: "/invite-us" },
    ],
  },
  {
    title: "Watch and read",
    links: [
      { label: "Media", to: "/media" },
      { label: "Stories", to: "/blog" },
    ],
  },
];

const WORDS = ["Create.", "Connect.", "Impact."];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const engine = useMotionEngine();

  useGsap(({ reduced, scope }) => {
    if (reduced) return;
    gsap.fromTo(scope.querySelector(".ft-inner"), { yPercent: -28 }, {
      yPercent: 0,
      ease: "none",
      scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom bottom", scrub: true },
    });
    gsap.fromTo(scope.querySelectorAll(".ft-word .sc"), { yPercent: 110 }, {
      yPercent: 0,
      stagger: 0.025,
      duration: 1.2,
      ease: "sg.out",
      scrollTrigger: { trigger: scope.querySelector(".ft-words"), start: "top 85%", once: true },
    });
  }, [], ref);

  const toTop = () => {
    if (engine.lenis.current) engine.lenis.current.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={ref} className="ft theme-night">
      <GradientField className="ft-field" />
      <div className="ft-inner wrap">
        <div className="ft-top">
          <div className="ft-words">
            <span className="sr-only">Create. Connect. Impact.</span>
            {WORDS.map((w, wi) => (
              <span className={`ft-word ft-word--${wi + 1}`} key={w} aria-hidden="true">
                <span className="sw">
                  <span className="sw-i">
                    {Array.from(w).map((c, i) => <span className="sc" key={i}>{c}</span>)}
                  </span>
                </span>
              </span>
            ))}
          </div>
          <button type="button" className="ft-top-btn" onClick={toTop} data-cursor="Up">
            <Badge text="Back to the top ✦ Back to the top ✦ ">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Badge>
            <span className="sr-only">Back to the top</span>
          </button>
        </div>

        <div className="ft-grid">
          <div className="ft-about">
            <Link to="/" className="ft-brand">
              <BrandMark />
              <span>{SITE_NAME}</span>
            </Link>
            <p>Creative Arts Ministry</p>
          </div>
          {COLUMNS.map((col) => (
            <nav className="ft-col" key={col.title} aria-label={col.title}>
              <p className="ft-col-title">{col.title}</p>
              <ul>
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="ft-link">
                      <span className="roll" data-text={l.label}>{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="ft-bottom">
          <span className="nums">© {new Date().getFullYear()} {SITE_NAME}</span>
          <ul className="ft-values" aria-label="Our values">
            <li>Faith</li>
            <li>Creativity</li>
            <li>Purpose</li>
            <li>Community</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
