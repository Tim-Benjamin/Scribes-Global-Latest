import { useEffect, useRef, type ReactNode } from "react";
import { Draggable, gsap, prefersReducedMotion } from "./gsap";

interface DragRailProps {
  children: ReactNode;
  className?: string;
  ariaLabel: string;
}

/**
 * A row you throw sideways. Desktop: drag with inertia and the cards
 * skew with throw speed. Touch: plain native overflow scroll.
 */
export default function DragRail({ children, className, ariaLabel }: DragRailProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return undefined;
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine)", () => {
      if (prefersReducedMotion()) return undefined;
      viewport.classList.add("is-draggable");
      const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3.out" });
      let lastX = 0;
      const [drag] = Draggable.create(track, {
        type: "x",
        inertia: true,
        bounds: viewport,
        edgeResistance: 0.85,
        dragClickables: true,
        minimumMovement: 6,
        onPress() { lastX = this.x; },
        onDrag() {
          skewTo(gsap.utils.clamp(-8, 8, (this.x - lastX) * 0.4));
          lastX = this.x;
        },
        onThrowUpdate() {
          skewTo(gsap.utils.clamp(-8, 8, (this.x - lastX) * 0.4));
          lastX = this.x;
        },
        onRelease() { skewTo(0); },
        onThrowComplete() { skewTo(0); },
      });
      // Clicking a card after a drag should not open it.
      const stopIfDragged = (e: MouseEvent) => {
        if (drag.isDragging || Math.abs(drag.x - drag.startX) > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      track.addEventListener("click", stopIfDragged, true);
      return () => {
        track.removeEventListener("click", stopIfDragged, true);
        drag.kill();
        gsap.set(track, { clearProps: "transform" });
        viewport.classList.remove("is-draggable");
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={viewportRef} className={`rail ${className ?? ""}`} data-cursor="Drag" role="region" aria-label={ariaLabel} data-lenis-prevent-touch>
      <div ref={trackRef} className="rail-track">{children}</div>
    </div>
  );
}
