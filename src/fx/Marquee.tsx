import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "./gsap";
import { useMotionEngine } from "../components/motion/motion-context";

interface MarqueeProps {
  children: ReactNode;
  /** Pixels per second at rest. */
  speed?: number;
  reverse?: boolean;
  /** Skew the band with scroll velocity. */
  skew?: boolean;
  className?: string;
  /** Repeat count of the children inside one half of the loop. */
  repeat?: number;
  ariaLabel?: string;
}

/**
 * Infinite band that speeds up, and flips direction, with scroll
 * velocity — the page's momentum visibly drags the type.
 */
export default function Marquee({
  children,
  speed = 80,
  reverse = false,
  skew = true,
  className,
  repeat = 4,
  ariaLabel,
}: MarqueeProps) {
  const engine = useMotionEngine();
  const trackRef = useRef<HTMLDivElement>(null);
  const skewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return undefined;

    let x = 0;
    let dir = reverse ? 1 : -1;
    let currentSkew = 0;
    const setX = gsap.quickSetter(track, "x", "px");

    const tick = (_time: number, delta: number) => {
      const half = track.scrollWidth / 2;
      if (!half) return;
      const v = engine.scroll.current.velocity;
      if (Math.abs(v) > 0.5) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
      const boost = 1 + Math.min(Math.abs(v) * 0.22, 6);
      x += dir * speed * boost * (delta / 1000);
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      setX(x);
      if (skew && skewRef.current) {
        const target = gsap.utils.clamp(-12, 12, v * -0.55);
        currentSkew += (target - currentSkew) * 0.12;
        skewRef.current.style.transform = `skewX(${currentSkew.toFixed(2)}deg)`;
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [engine, reverse, skew, speed]);

  const items = Array.from({ length: repeat }, (_, i) => (
    <div className="mq-item" key={i}>{children}</div>
  ));

  return (
    <div className={`mq ${className ?? ""}`} role={ariaLabel ? "img" : undefined} aria-label={ariaLabel} aria-hidden={ariaLabel ? undefined : true}>
      <div ref={skewRef} className="mq-skew">
        <div ref={trackRef} className="mq-track">
          <div className="mq-half">{items}</div>
          <div className="mq-half" aria-hidden="true">{items}</div>
        </div>
      </div>
    </div>
  );
}
