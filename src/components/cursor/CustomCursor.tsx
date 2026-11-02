import {
  useEffect,
} from "react";

import { motion, useSpring } from "motion/react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useCursor } from "./CursorProvider";

export default function CustomCursor() {
  const { label, setLabel } = useCursor();

  const reducedMotion = useReducedMotion();

  const isTouch = useMediaQuery(
    "(hover: none), (pointer: coarse)"
  );

  const cursorX = useSpring(0, {
    stiffness: 500,
    damping: 35,
    mass: 0.4,
  });

  const cursorY = useSpring(0, {
    stiffness: 500,
    damping: 35,
    mass: 0.4,
  });

  useEffect(() => {
    if (isTouch || reducedMotion) {
      return;
    }

    const move = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, [
    cursorX,
    cursorY,
    isTouch,
    reducedMotion,
  ]);

  // Delegated hover watcher for every [data-cursor] target in the app.
  // A single pair of listeners on the document (rather than one per
  // element) survives route changes and dynamically rendered content
  // without needing to be re-wired by each component.
  useEffect(() => {
    if (isTouch || reducedMotion) {
      return;
    }

    const resolveTarget = (event: Event) => {
      const node = event.target;
      if (!(node instanceof Element)) {
        return null;
      }
      return node.closest<HTMLElement>("[data-cursor]");
    };

    const handleOver = (event: Event) => {
      const target = resolveTarget(event);
      if (target) {
        setLabel(target.dataset.cursor ?? "");
      }
    };

    const handleOut = (event: Event) => {
      const target = resolveTarget(event);
      if (!target) {
        return;
      }
      const related = (event as MouseEvent).relatedTarget;
      if (related instanceof Node && target.contains(related)) {
        return;
      }
      setLabel("");
    };

    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [isTouch, reducedMotion, setLabel]);

  if (isTouch || reducedMotion) {
    return null;
  }

  return (
    <motion.div
      className={`custom-cursor ${
        label ? "custom-cursor-active" : ""
      }`}
      style={{
        x: cursorX,
        y: cursorY,
      }}
      // The dot-to-pill morph is a real Framer layout animation (FLIP
      // under the hood), not a CSS transition on width/height — the
      // size change driven by the className toggle above gets picked
      // up and animated with spring physics automatically.
      layout
      transition={{
        layout: {
          type: "spring",
          stiffness: 420,
          damping: 32,
        },
      }}
    >
      {label && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}