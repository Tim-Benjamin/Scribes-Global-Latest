import {
  type MouseEvent,
  type ReactNode,
  useRef,
} from "react";

import { motion, useMotionValue, useSpring } from "motion/react";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export default function Magnetic({
  children,
  strength = 0.25,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  const isTouch = useMediaQuery(
    "(hover: none), (pointer: coarse)"
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 300,
    damping: 20,
    mass: 0.5,
  });

  const springY = useSpring(y, {
    stiffness: 300,
    damping: 20,
    mass: 0.5,
  });

  const handleMouseMove = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (
      reducedMotion ||
      isTouch ||
      !ref.current
    ) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(
      (event.clientX - centerX) * strength
    );

    y.set(
      (event.clientY - centerY) * strength
    );
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x: springX,
        y: springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}