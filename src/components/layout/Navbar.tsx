import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { gsap, prefersReducedMotion } from "../../fx/gsap";
import { useMotionEngine } from "../motion/motion-context";
import { onPageReady } from "../../fx/ready";
import { NAVIGATION_ITEMS, SITE_NAME } from "../../lib/constants";
import { useHaptics } from "../../hooks/useHaptics";
import GradientField from "../../fx/GradientField";
import Magnetic from "../../fx/Magnetic";

const QUICK = ["/about", "/chapters", "/events", "/media"];
const TAGLINE = ["Faith", "Creativity", "Purpose", "Community"];

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={`brandmark ${className ?? ""}`} aria-hidden="true">
      <i /><i /><i />
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const engine = useMotionEngine();
  const { light } = useHaptics();
  const barRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [lastPath, setLastPath] = useState(location.pathname);

  // Close the menu whenever the route changes (state derived during render).
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    if (open) setOpen(false);
  }

  /* Intro + hide on scroll down / show on scroll up */
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;
    if (!prefersReducedMotion()) {
      gsap.set(bar, { yPercent: -120 });
    }
    const stop = onPageReady(() => {
      gsap.to(bar, { yPercent: 0, duration: 1.1, delay: 0.25, ease: "sg.out" });
    });

    let hidden = false;
    let raised = false;
    const tick = () => {
      const { y, direction } = engine.scroll.current;
      const shouldRaise = y > 40;
      if (shouldRaise !== raised) {
        raised = shouldRaise;
        bar.classList.toggle("is-raised", raised);
      }
      const shouldHide = y > 220 && direction === 1 && !document.documentElement.classList.contains("menu-open");
      if (shouldHide !== hidden) {
        hidden = shouldHide;
        gsap.to(bar, { yPercent: hidden ? -130 : 0, duration: 0.7, ease: "sg.out", overwrite: "auto" });
      }
    };
    const onScroll = () => tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      stop();
      window.removeEventListener("scroll", onScroll);
    };
  }, [engine]);

  /* Menu open / close timeline */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return undefined;
    const reduced = prefersReducedMotion();
    const root = document.documentElement;

    if (open) {
      root.classList.add("menu-open");
      engine.lenis.current?.stop();
      tlRef.current?.kill();
      const tl = gsap.timeline();
      tlRef.current = tl;
      gsap.set(overlay, { visibility: "visible" });
      if (reduced) {
        gsap.set(overlay, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(overlay.querySelectorAll(".menu-link-i, .menu-fade"), { yPercent: 0, opacity: 1 });
      } else {
        tl.fromTo(overlay, { clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }, {
          clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)",
          duration: 1.1,
          ease: "sg.inOut",
        })
          .fromTo(overlay.querySelectorAll(".menu-link-i"), { yPercent: 110, rotate: 4 }, {
            yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.045, ease: "sg.out",
          }, 0.35)
          .fromTo(overlay.querySelectorAll(".menu-fade"), { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.06,
          }, 0.6);
      }
      const first = overlay.querySelector<HTMLElement>(".menu-link");
      window.setTimeout(() => first?.focus({ preventScroll: true }), reduced ? 0 : 500);
    } else if (root.classList.contains("menu-open")) {
      root.classList.remove("menu-open");
      engine.lenis.current?.start();
      tlRef.current?.kill();
      if (reduced) {
        gsap.set(overlay, { visibility: "hidden" });
      } else {
        tlRef.current = gsap.timeline()
          .to(overlay.querySelectorAll(".menu-link-i"), { yPercent: -110, duration: 0.45, stagger: 0.02, ease: "power3.in" })
          .to(overlay, { clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)", duration: 0.8, ease: "sg.inOut" }, 0.2)
          .set(overlay, { visibility: "hidden" });
      }
    }
    return undefined;
  }, [open, engine]);

  /* Escape closes, focus returns to the toggle */
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = () => {
    light();
    setOpen((v) => !v);
  };

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>

      <header ref={barRef} className={`nav ${open ? "is-menu" : ""}`}>
        <Link to="/" className="nav-brand" aria-label={`${SITE_NAME} home`} data-cursor="Home">
          <BrandMark />
          <span className="nav-brand-word">{SITE_NAME}</span>
        </Link>

        <nav className="nav-quick" aria-label="Primary">
          {NAVIGATION_ITEMS.filter((i) => QUICK.includes(i.path)).map((item) => (
            <NavLink key={item.path} to={item.path} className="nav-quick-link">
              <span className="roll" data-text={item.label}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <Link to="/invite-us" className="nav-pill">
            <span className="roll" data-text="Invite us">Invite us</span>
          </Link>
          <Magnetic strength={0.3}>
            <button
              ref={toggleRef}
              type="button"
              className={`nav-toggle ${open ? "is-open" : ""}`}
              onClick={toggle}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="nav-toggle-text">
                <span className="roll" data-text={open ? "Close" : "Menu"}>{open ? "Close" : "Menu"}</span>
              </span>
              <span className="nav-toggle-icon" aria-hidden="true"><i /><i /></span>
            </button>
          </Magnetic>
        </div>
      </header>

      <div
        ref={overlayRef}
        id="site-menu"
        className="menu theme-night"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
      >
        <GradientField className="menu-field" paused={!open} />
        <div className="menu-inner">
          <nav className="menu-nav" aria-label="All pages">
            {NAVIGATION_ITEMS.map((item, i) => {
              const active = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`menu-link ${active ? "is-active" : ""}`}
                  onClick={() => {
                    light();
                    setOpen(false);
                  }}
                  style={{ ["--i" as string]: i }}
                >
                  <span className="menu-link-mask">
                    <span className="menu-link-i">
                      <span className="roll" data-text={item.label}>{item.label}</span>
                    </span>
                  </span>
                </NavLink>
              );
            })}
          </nav>

          <aside className="menu-side">
            <p className="menu-fade menu-side-title">Creative arts ministry</p>
            <p className="menu-fade menu-side-copy">
              A non-profit, non-denominational evangelistic ministry preaching the gospel through creative arts.
            </p>
            <div className="menu-fade menu-side-links">
              <Link to="/volunteer" onClick={() => setOpen(false)} className="u-link">Volunteer with us</Link>
              <Link to="/invite-us" onClick={() => setOpen(false)} className="u-link">Invite us to minister</Link>
              <Link to="/blog" onClick={() => setOpen(false)} className="u-link">Read the stories</Link>
            </div>
            <ul className="menu-fade menu-tagline" aria-label="Our values">
              {TAGLINE.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}
