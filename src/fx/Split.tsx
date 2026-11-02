import { Fragment, useRef, type CSSProperties, type Ref } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useGsap } from "./useGsap";
import { onPageReady } from "./ready";

export type SplitEffect = "rise" | "tilt" | "blur" | "drop";

interface SplitProps {
  /** Plain text. Use "\n" to force a line break. */
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "li" | "blockquote" | "strong" | "em";
  by?: "words" | "chars";
  className?: string;
  style?: CSSProperties;
  /** load = after the page is uncovered; scroll = when it enters; none = static */
  trigger?: "load" | "scroll" | "none";
  effect?: SplitEffect;
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  id?: string;
}

/**
 * React-owned text splitter (no DOM mutation, safe across re-renders).
 * Each word sits in its own clipping mask so glyphs rise out of an
 * invisible baseline rather than fading in.
 */
export default function Split({
  text,
  as = "span",
  by = "words",
  className,
  style,
  trigger = "scroll",
  effect = "rise",
  delay = 0,
  stagger,
  duration = 1.2,
  start = "top 88%",
  id,
}: SplitProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as "div";
  const tagRef = ref as Ref<HTMLDivElement>;

  useGsap(({ reduced, scope }) => {
    if (trigger === "none" || reduced) return undefined;
    const targets = scope.querySelectorAll<HTMLElement>(by === "chars" ? ".sc" : ".sw-i");
    if (!targets.length) return undefined;

    const fromVars: gsap.TweenVars = { yPercent: 115 };
    if (effect === "tilt") Object.assign(fromVars, { rotate: 8, transformOrigin: "0% 100%" });
    if (effect === "blur") Object.assign(fromVars, { yPercent: 40, opacity: 0, filter: "blur(10px)" });
    if (effect === "drop") Object.assign(fromVars, { yPercent: -115 });

    gsap.set(targets, fromVars);
    const each = stagger ?? (by === "chars" ? 0.028 : 0.06);
    const play = () => gsap.to(targets, {
      yPercent: 0,
      rotate: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration,
      delay,
      ease: "sg.out",
      stagger: each,
    });

    if (trigger === "load") return onPageReady(() => { play(); });

    const st = ScrollTrigger.create({ trigger: scope, start, once: true, onEnter: play });
    return () => st.kill();
  }, [text, by, trigger, effect, delay, stagger, duration, start], ref);

  const lines = text.split("\n");

  return (
    <Tag ref={tagRef} className={className} style={style} id={id}>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      {lines.map((line, li) => (
        <span className="sl" key={li} aria-hidden="true">
          {line.split(" ").filter(Boolean).map((word, wi, arr) => (
            <Fragment key={wi}>
              <span className="sw">
                <span className="sw-i">
                  {by === "chars"
                    ? Array.from(word).map((ch, ci) => (
                        <span className="sc" key={ci}>{ch}</span>
                      ))
                    : word}
                </span>
              </span>
              {wi < arr.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}
