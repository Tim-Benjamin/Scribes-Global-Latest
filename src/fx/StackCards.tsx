import { Children, useRef, type ReactNode } from "react";
import { gsap } from "./gsap";
import { useGsap } from "./useGsap";

interface StackCardsProps {
  children: ReactNode;
  className?: string;
  /** Sticky offset from the top of the viewport, CSS length. */
  top?: string;
}

/**
 * Cards pin one on top of another. As each new card slides over,
 * the one beneath shrinks, tips back and darkens — a deck being dealt.
 */
export default function StackCards({ children, className, top = "12vh" }: StackCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  useGsap(({ reduced, scope }) => {
    if (reduced) return;
    const cards = Array.from(scope.querySelectorAll<HTMLElement>(".stack-card"));
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      const inner = card.querySelector<HTMLElement>(".stack-card-inner");
      // Explicit start values: tweening `filter` from the implicit "none"
      // reads as brightness(0) and the card would begin pitch black.
      gsap.fromTo(inner, { scale: 1, rotateX: 0, filter: "brightness(1)" }, {
        scale: 0.86,
        rotateX: -8,
        filter: "brightness(0.55)",
        ease: "none",
        scrollTrigger: {
          trigger: next,
          start: "top bottom",
          end: `top ${top}`,
          scrub: true,
        },
      });
    });
  }, [items.length, top], ref);

  return (
    <div ref={ref} className={`stack ${className ?? ""}`} style={{ ["--stack-top" as string]: top }}>
      {items.map((child, i) => (
        <div className="stack-card" key={i} style={{ ["--i" as string]: i }}>
          <div className="stack-card-inner">{child}</div>
        </div>
      ))}
    </div>
  );
}
