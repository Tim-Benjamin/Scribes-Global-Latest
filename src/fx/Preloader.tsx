import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "./gsap";
import { setPageReady } from "./ready";

const WORDS = ["Poetry", "Worship", "Spoken word", "Music", "Dance", "Khoros"];

/**
 * First-visit intro: a counter runs to 100 while the crafts of the
 * ministry flash past, then three brand-coloured sheets peel away
 * upward to uncover the page. Runs once per session.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(() => {
    if (typeof window === "undefined") return true;
    if (prefersReducedMotion()) return true;
    try {
      return sessionStorage.getItem("sg-intro") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (done) {
      setPageReady(true);
      return undefined;
    }
    const root = rootRef.current;
    if (!root) {
      setPageReady(true);
      return undefined;
    }

    document.documentElement.classList.add("is-loading");
    const count = root.querySelector<HTMLElement>(".pl-count");
    const words = root.querySelectorAll<HTMLElement>(".pl-word");
    const state = { n: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem("sg-intro", "1");
        } catch {
          /* private mode — intro will simply replay */
        }
        document.documentElement.classList.remove("is-loading");
        setDone(true);
      },
    });

    tl.from(root.querySelectorAll(".pl-mark .sc"), { yPercent: 120, stagger: 0.05, duration: 1, ease: "sg.out" })
      .to(state, {
        n: 100,
        duration: 2.1,
        ease: "power2.inOut",
        onUpdate: () => {
          if (count) count.textContent = String(Math.round(state.n)).padStart(3, "0");
        },
      }, 0.2)
      .to(root.querySelector(".pl-bar-fill"), { scaleX: 1, duration: 2.1, ease: "power2.inOut" }, 0.2);

    words.forEach((w, i) => {
      tl.fromTo(w, { yPercent: 110 }, { yPercent: 0, duration: 0.32, ease: "sg.out" }, 0.25 + i * 0.33)
        .to(w, { yPercent: -110, duration: 0.28, ease: "power2.in" }, 0.25 + i * 0.33 + 0.26);
    });

    tl.to(root.querySelector(".pl-content"), { yPercent: -30, opacity: 0, duration: 0.6, ease: "power3.in" }, "+=0.05")
      .add(() => setPageReady(true), "-=0.1")
      .to(root.querySelectorAll(".pl-sheet"), {
        yPercent: -100,
        duration: 1.1,
        ease: "sg.inOut",
        stagger: { each: 0.1, from: "end" },
      }, "-=0.25");

    return () => {
      tl.kill();
      document.documentElement.classList.remove("is-loading");
    };
  }, [done]);

  if (done) return null;

  return (
    <div ref={rootRef} className="pl" role="status" aria-label="Loading Scribes Global">
      <div className="pl-sheet pl-sheet--cyan" />
      <div className="pl-sheet pl-sheet--magenta" />
      <div className="pl-sheet pl-sheet--night">
        <div className="pl-content">
          <div className="pl-mark" aria-hidden="true">
            {Array.from("SCRIBES").map((c, i) => (
              <span className="sw" key={i}><span className="sc">{c}</span></span>
            ))}
          </div>
          <div className="pl-words" aria-hidden="true">
            {WORDS.map((w) => <span className="pl-word" key={w}>{w}</span>)}
          </div>
          <div className="pl-foot">
            <span className="pl-bar"><span className="pl-bar-fill" /></span>
            <span className="pl-count nums">000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
