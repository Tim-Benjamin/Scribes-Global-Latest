import { useRef, type ReactNode } from "react";
import { gsap } from "./gsap";
import { useGsap } from "./useGsap";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  /** Content shown in the pinned frame above the moving track. */
  header?: ReactNode;
  /** Optional progress label renderer. */
  showProgress?: boolean;
  id?: string;
}

/**
 * Pins the section and converts vertical scroll into sideways travel
 * on desktop. On touch / narrow screens it becomes a native swipe
 * rail with snap — no hijacked scrolling on phones.
 */
export default function HorizontalScroll({
  children, className, header, showProgress = true, id,
}: HorizontalScrollProps) {
  const ref = useRef<HTMLElement>(null);

  useGsap(({ scope }) => {
    const track = scope.querySelector<HTMLElement>(".hs-track");
    const bar = scope.querySelector<HTMLElement>(".hs-bar-fill");
    if (!track) return undefined;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.9,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      // Cards inside the track can tilt/scale against travel speed.
      const cards = track.querySelectorAll<HTMLElement>("[data-hs-card]");
      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>("img, .media-fallback");
        if (!img) return;
        gsap.fromTo(img, { xPercent: 12 }, {
          xPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: true,
          },
        });
      });
    });
    return () => mm.revert();
  }, [], ref);

  return (
    <section ref={ref} className={`hs ${className ?? ""}`} id={id}>
      {header ? <div className="hs-header">{header}</div> : null}
      <div className="hs-viewport" data-lenis-prevent-touch>
        <div className="hs-track">{children}</div>
      </div>
      {showProgress ? (
        <div className="hs-bar" aria-hidden="true"><span className="hs-bar-fill" /></div>
      ) : null}
    </section>
  );
}
