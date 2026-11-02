import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
}

const clip: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const image: Variants = {
  hidden: { scale: 1.2 },
  visible: {
    scale: 1,
    transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * The clip-path wipe used to animate on the same element whileInView
 * observed directly — a target that starts fully clip-path-clipped can
 * report zero intersection area and never trigger in some engines. The
 * outer div here only sets up the observer; the clip-path (and the
 * image's scale-settle) live on inner elements driven by variants.
 */
export default function ImageReveal({
  src,
  alt,
  className,
}: ImageRevealProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`image-reveal ${className ?? ""}`}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
    >
      <motion.div variants={reducedMotion ? undefined : clip}>
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          variants={reducedMotion ? undefined : image}
        />
      </motion.div>
    </motion.div>
  );
}
