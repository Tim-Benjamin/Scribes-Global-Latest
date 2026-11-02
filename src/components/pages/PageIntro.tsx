import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import "./page-intro.css";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  children?: ReactNode;
}

export default function PageIntro({
  eyebrow,
  title,
  accent,
  description,
  children,
}: PageIntroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <header className="page-intro">
      <motion.div
        className="page-intro__container"
        initial={
          reducedMotion
            ? false
            : {
                opacity: 0,
                y: 20,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <p className="page-intro__eyebrow">
          {eyebrow}
        </p>

        <h1 className="page-intro__title">
          {title}

          {accent && (
            <span className="page-intro__accent">
              {accent}
            </span>
          )}
        </h1>

        {description && (
          <p className="page-intro__description">
            {description}
          </p>
        )}

        {children && (
          <div className="page-intro__actions">
            {children}
          </div>
        )}
      </motion.div>
    </header>
  );
}