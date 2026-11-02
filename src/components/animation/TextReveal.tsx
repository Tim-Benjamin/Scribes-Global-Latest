import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  /**
   * "words" (default) masks and staggers whole words — right for body
   * copy and longer phrases. "chars" splits down to individual letters
   * for a tighter, more kinetic reveal on short display headlines —
   * use it sparingly, a long phrase in "chars" mode fans out a lot of
   * nodes and reads as noisy rather than deliberate.
   */
  splitBy?: "words" | "chars";
}

const container: Variants = {
  hidden: {},
  visible: ({ delay, stagger }: { delay: number; stagger: number }) => ({
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  }),
};

const unit: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

/**
 * Word- or character-mask reveal. Uses a single whileInView observer on
 * the whole phrase (a wide, easy-to-intersect target) and fans the
 * reveal out to each unit via variants/staggerChildren, instead of
 * giving every unit its own small IntersectionObserver target — those
 * are easy to miss entirely during fast or smoothed (Lenis) scrolling.
 */
export default function TextReveal({
  children,
  className,
  delay = 0,
  splitBy = "words",
}: TextRevealProps) {
  const reducedMotion = useReducedMotion();

  const words = children.split(" ");
  const stagger = splitBy === "chars" ? 0.018 : 0.045;

  return (
    <motion.span
      className={className}
      aria-label={children}
      style={{
        display: "inline",
      }}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.2,
      }}
      variants={container}
      custom={{ delay: reducedMotion ? 0 : delay, stagger }}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          style={{
            display: "inline-block",
            marginRight: "0.25em",
          }}
        >
          {splitBy === "chars"
            ? word.split("").map((char, charIndex) => (
                <span
                  key={`${char}-${charIndex}`}
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    verticalAlign: "top",
                  }}
                >
                  <motion.span
                    style={{
                      display: "inline-block",
                    }}
                    variants={reducedMotion ? undefined : unit}
                  >
                    {char}
                  </motion.span>
                </span>
              ))
            : (
              <span
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "top",
                }}
              >
                <motion.span
                  style={{
                    display: "inline-block",
                  }}
                  variants={reducedMotion ? undefined : unit}
                >
                  {word}
                </motion.span>
              </span>
            )}
        </span>
      ))}
    </motion.span>
  );
}
