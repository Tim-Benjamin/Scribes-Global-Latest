import { useRef, type Ref } from "react";
import { gsap } from "./gsap";
import { useGsap } from "./useGsap";

interface ScrubWordsProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "blockquote";
  className?: string;
  /** Words (case-insensitive, punctuation ignored) to paint in the accent gradient. */
  highlight?: string[];
  start?: string;
  end?: string;
}

const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/**
 * A statement paragraph that "inks in" word by word as you scroll —
 * reading pace is tied to scroll position, not a timer.
 */
export default function ScrubWords({
  text,
  as = "p",
  className,
  highlight = [],
  start = "top 82%",
  end = "bottom 48%",
}: ScrubWordsProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as "div";
  const tagRef = ref as Ref<HTMLDivElement>;
  const marks = new Set(highlight.map(clean));

  useGsap(({ reduced, scope }) => {
    if (reduced) return;
    const words = scope.querySelectorAll(".scrub-w");
    gsap.fromTo(
      words,
      { opacity: 0.13 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.08,
        scrollTrigger: { trigger: scope, start, end, scrub: 0.6 },
      },
    );
  }, [text, start, end], ref);

  return (
    <Tag ref={tagRef} className={className}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={marks.has(clean(word)) ? "scrub-w scrub-w--mark" : "scrub-w"}
        >
          {word}{" "}
        </span>
      ))}
    </Tag>
  );
}
