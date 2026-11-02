import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

interface RevealTiming {
  delay: number;
  duration: number;
}

const outer: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: ({ delay, duration }: RevealTiming) => ({
    opacity: 1,
    y: 0,
    transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const clip: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: ({ delay, duration }: RevealTiming) => ({
    clipPath: "inset(0 0 0% 0)",
    transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/**
 * Fade/rise + clip-path wipe reveal. The clip-path animates on an INNER
 * wrapper rather than the element whileInView observes directly — a
 * fully clip-path-clipped target (its initial state here) can report
 * zero intersection area and never trigger in some engines, which
 * silently breaks the whole reveal. Observing a plain opacity/y target
 * instead keeps detection reliable while the wipe still reads the same.
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 1,
  className,
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const timing: RevealTiming = {
    delay: reducedMotion ? 0 : delay,
    duration: reducedMotion ? 0 : duration,
  };

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      variants={outer}
      custom={timing}
    >
      <motion.div
        variants={reducedMotion ? undefined : clip}
        custom={timing}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
