import { motion } from "motion/react";
import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
}

export default function Marquee({
  children,
  reverse = false,
}: MarqueeProps) {
  return (
    <div className="marquee">
      <motion.div
        className="marquee-track"
        animate={{
          x: reverse
            ? ["-50%", "0%"]
            : ["0%", "-50%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="marquee-content">
          {children}
        </div>

        <div className="marquee-content">
          {children}
        </div>
      </motion.div>
    </div>
  );
}