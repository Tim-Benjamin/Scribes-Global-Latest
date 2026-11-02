import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { gsap, prefersReducedMotion } from "./gsap";
import { setPageReady } from "./ready";
import { NAVIGATION_ITEMS } from "../lib/constants";

export const CURTAIN_COVER = 0.75;

function labelFor(pathname: string) {
  const exact = NAVIGATION_ITEMS.find((i) => i.path === pathname);
  if (exact) return exact.label;
  if (pathname.startsWith("/events/")) return "Event";
  if (pathname.startsWith("/chapters/")) return "Chapter";
  if (pathname.startsWith("/blog")) return pathname === "/blog" ? "Stories" : "Story";
  return "Scribes";
}

/**
 * Route change choreography: three sheets (cyan, magenta, night) sweep
 * up over the old page, the destination's name rises in the middle,
 * the new page mounts underneath, then the sheets continue upward.
 */
export default function Curtain() {
  const { pathname } = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) {
      setPageReady(true);
      return undefined;
    }

    setPageReady(false);
    const sheets = root.querySelectorAll<HTMLElement>(".ct-sheet");
    const label = root.querySelector<HTMLElement>(".ct-label-i");
    if (label) label.textContent = labelFor(pathname);

    tlRef.current?.kill();
    let mounted = false;
    let covered = false;
    const tl = gsap.timeline();
    tlRef.current = tl;

    const reveal = () => {
      tl.to(label, { yPercent: -110, duration: 0.5, ease: "power3.in" })
        .add(() => setPageReady(true), "-=0.05")
        .to(sheets, {
          yPercent: -100,
          duration: 0.95,
          ease: "sg.inOut",
          stagger: { each: 0.08, from: "end" },
        }, "-=0.2")
        .set(root, { visibility: "hidden" });
    };

    const onMounted = () => {
      mounted = true;
      if (covered) reveal();
    };
    window.addEventListener("sg:route-mounted", onMounted, { once: true });

    gsap.set(root, { visibility: "visible" });
    tl.fromTo(sheets, { yPercent: 100 }, {
      yPercent: 0,
      duration: CURTAIN_COVER,
      ease: "sg.inOut",
      stagger: 0.07,
    })
      .fromTo(label, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "sg.out" }, "-=0.35")
      .add(() => {
        covered = true;
        if (mounted) reveal();
      });

    // Safety net: never leave the screen covered.
    const failsafe = window.setTimeout(() => {
      if (!mounted) {
        mounted = true;
        if (covered) reveal();
      }
    }, 2500);

    return () => {
      window.clearTimeout(failsafe);
      window.removeEventListener("sg:route-mounted", onMounted);
    };
  }, [pathname]);

  return (
    <div ref={rootRef} className="ct" aria-hidden="true">
      <div className="ct-sheet ct-sheet--cyan" />
      <div className="ct-sheet ct-sheet--magenta" />
      <div className="ct-sheet ct-sheet--night">
        <span className="ct-label"><span className="ct-label-i" /></span>
      </div>
    </div>
  );
}
