import { useEffect, useRef, type ReactNode } from "react";
import { gsap, isTouchDevice, prefersReducedMotion } from "./gsap";

interface ImageTrailProps {
  images: string[];
  children?: ReactNode;
  className?: string;
  /** Pixels the pointer must travel before the next image drops. */
  threshold?: number;
}

/**
 * Move the pointer across the area and photographs drop in its wake,
 * each one popping up, tilting, then sinking away.
 */
export default function ImageTrail({ images, children, className, threshold = 90 }: ImageTrailProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const area = ref.current;
    if (!area || !images.length || isTouchDevice() || prefersReducedMotion()) return undefined;
    const pool = Array.from(area.querySelectorAll<HTMLElement>(".it-img"));
    let index = 0;
    let last = { x: 0, y: 0 };
    let z = 1;

    const move = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (Math.hypot(x - last.x, y - last.y) < threshold) return;
      const dx = x - last.x;
      last = { x, y };
      const el = pool[index % pool.length];
      index += 1;
      z += 1;
      gsap.killTweensOf(el);
      gsap.set(el, { x, y, xPercent: -50, yPercent: -50, zIndex: z, opacity: 1, scale: 0.3, rotate: gsap.utils.clamp(-18, 18, dx * 0.2) });
      gsap.timeline()
        .to(el, { scale: 1, duration: 0.5, ease: "back.out(1.7)" })
        .to(el, { y: y + 90, scale: 0.6, opacity: 0, duration: 0.9, ease: "power3.in" }, 0.55);
    };
    area.addEventListener("pointermove", move);
    return () => area.removeEventListener("pointermove", move);
  }, [images, threshold]);

  return (
    <div ref={ref} className={`it ${className ?? ""}`}>
      <div className="it-layer" aria-hidden="true">
        {images.slice(0, 12).map((src, i) => (
          <div className="it-img" key={`${src}-${i}`}>
            <img src={src} alt="" loading="lazy" />
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
