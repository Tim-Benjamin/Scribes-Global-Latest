import { useEffect, useId, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "./gsap";
import { useMotionEngine } from "../components/motion/motion-context";

interface BadgeProps {
  text: string;
  className?: string;
  children?: ReactNode;
}

/** Circular type that turns slowly and whips round when you scroll fast. */
export default function Badge({ text, className, children }: BadgeProps) {
  const engine = useMotionEngine();
  const ringRef = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || prefersReducedMotion()) return undefined;
    let angle = 0;
    const tick = (_t: number, dt: number) => {
      const v = engine.scroll.current.velocity;
      angle += (12 + Math.min(Math.abs(v) * 6, 260)) * (dt / 1000) * (v < 0 ? -1 : 1);
      ring.style.transform = `rotate(${angle}deg)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [engine]);

  return (
    <div className={`badge ${className ?? ""}`} aria-hidden="true">
      <svg ref={ringRef} viewBox="0 0 200 200" className="badge-ring">
        <defs>
          <path id={`bp-${id}`} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          <textPath href={`#bp-${id}`} textLength="488" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <div className="badge-core">{children}</div>
    </div>
  );
}
