import { useEffect, useRef } from "react";

import { useMotionEngine } from "../motion/motion-context";
import { useReducedMotion } from "../../hooks/useReducedMotion";

import "./home-marquee.css";

const ITEMS = [
  "Faith",
  "Creativity",
  "Purpose",
  "Community",
];

function MarqueeGroup() {
  return (
    <span className="home-marquee__group">
      {ITEMS.map((item) => (
        <span key={item} className="home-marquee__item">
          {item}
          <span
            className="home-marquee__dot"
            aria-hidden="true"
          >
            ✦
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * Brand marquee strip between the hero and the About teaser. The
 * continuous scroll is pure CSS (cheap, runs even if JS stutters);
 * a thin RAF loop reads the shared scroll velocity straight off the
 * motion engine (no React state) and skews the track — faster
 * scrolling visibly "drags" the text, the velocity-reactive detail
 * from the original motion brief that nothing on the homepage used yet.
 */
export default function HomeMarquee() {
  const engine = useMotionEngine();
  const reducedMotion = useReducedMotion();
  const skewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return undefined;

    let frame = 0;
    let current = 0;

    const animate = () => {
      const velocity = engine.scroll.current.velocity;
      const target = Math.max(-14, Math.min(14, velocity * -0.6));

      current += (target - current) * 0.15;

      if (skewRef.current) {
        skewRef.current.style.transform = `skewX(${current.toFixed(2)}deg)`;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [engine, reducedMotion]);

  return (
    <div className="home-marquee" aria-hidden="true">
      <div ref={skewRef} className="home-marquee__skew">
        <div className="home-marquee__track">
          <MarqueeGroup />
          <MarqueeGroup />
          <MarqueeGroup />
          <MarqueeGroup />
        </div>
      </div>
    </div>
  );
}
