import { useRef, type CSSProperties, type ReactNode, type Ref } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useGsap } from "./useGsap";

interface RevealProps {
  children: ReactNode;
  as?: "div" | "section" | "ul" | "ol" | "article" | "p" | "aside" | "header" | "footer" | "figure" | "dl" | "span" | "li" | "nav";
  className?: string;
  style?: CSSProperties;
  /** Animate direct children one after another instead of the block as a whole. */
  stagger?: number;
  y?: number;
  delay?: number;
  id?: string;
}

/**
 * Small-content entrance (paragraphs, meta rows, card grids).
 * Children enter in batches as they scroll in, so a grid that
 * arrives three-at-a-time animates three-at-a-time.
 */
export default function Reveal({
  children,
  as = "div",
  className,
  style,
  stagger,
  y = 48,
  delay = 0,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as "div";
  const tagRef = ref as Ref<HTMLDivElement>;

  useGsap(({ reduced, scope }) => {
    if (reduced) return undefined;
    const targets = stagger !== undefined ? Array.from(scope.children) : [scope];
    if (!targets.length) return undefined;
    gsap.set(targets, { y, opacity: 0 });
    const triggers = ScrollTrigger.batch(targets, {
      start: "top 92%",
      once: true,
      onEnter: (batch) => gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: 1.1,
        delay,
        ease: "sg.out",
        stagger: stagger ?? 0,
        overwrite: true,
      }),
    });
    return () => triggers.forEach((t) => t.kill());
  }, [stagger, y, delay], ref);

  return (
    <Tag ref={tagRef} className={className} style={style} id={id}>
      {children}
    </Tag>
  );
}
