import { useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../../fx/gsap";
import { createMotionEngine, MotionEngineContext } from "./motion-context";
import { useMediaPreference } from "./useMediaPreference";
import "lenis/dist/lenis.css";
import "../../styles/motion-system.css";


export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [engine] = useState(createMotionEngine);
  const reduced = useMediaPreference("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (reduced) {
      const update = () => {
        const limit = document.documentElement.scrollHeight - window.innerHeight;
        engine.updateScroll({
          y: window.scrollY,
          progress: limit > 0 ? window.scrollY / limit : 0,
          velocity: 0, direction: 0,
        });
        ScrollTrigger.update();
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    }

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      prevent: (node) => Boolean(node.closest(
        '[role="dialog"], [data-lenis-prevent], .menu',
      )),
    });
    engine.setLenis(lenis);
    const update = () => {
      engine.updateScroll({
        y: lenis.scroll, progress: lenis.progress,
        velocity: lenis.velocity, direction: lenis.direction,
      });
      ScrollTrigger.update();
    };
    const tick = (seconds: number) => lenis.raf(seconds * 1000);
    lenis.on("scroll", update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    update();
    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", update);
      lenis.destroy();
      engine.setLenis(null);
      engine.resetVelocity();
    };
  }, [engine, reduced]);

  return (
    <MotionEngineContext.Provider value={engine}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </MotionEngineContext.Provider>
  );
}
