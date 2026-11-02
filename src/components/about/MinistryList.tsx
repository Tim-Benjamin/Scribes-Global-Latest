import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useReducedMotion } from "../../hooks/useReducedMotion";

import "./ministry-list.css";

interface MinistryListItem {
  title: string;
  image: string;
  description: string;
  symbol: string;
  tone: string;
}

interface MinistryListProps {
  items: readonly MinistryListItem[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Editorial numbered hover list. Each row morphs open on hover via
 * Framer's `layout` prop (the row itself grows, its neighbours shift
 * down/up smoothly) and reveals a floating preview image pinned to
 * that row. Touch devices get every description shown at once
 * instead, since there is no hover to drive the reveal.
 */
export default function MinistryList({
  items,
}: MinistryListProps) {
  const [activeIndex, setActiveIndex] = useState<
    number | null
  >(null);

  const reducedMotion = useReducedMotion();
  const isTouch = useMediaQuery(
    "(hover: none), (pointer: coarse)",
  );

  return (
    <div
      className="ministry-list"
      onMouseLeave={() => setActiveIndex(null)}
    >
      {items.map((item, index) => {
        const expanded =
          isTouch || activeIndex === index;

        return (
          <motion.article
            key={item.title}
            className={`ministry-row ministry-row--${item.tone} ${
              expanded ? "is-active" : ""
            }`}
            layout={!reducedMotion}
            transition={{
              layout: {
                duration: 0.5,
                ease: EASE,
              },
            }}
            onMouseEnter={() =>
              !isTouch && setActiveIndex(index)
            }
          >
            <motion.span
              layout="position"
              className="ministry-row__index"
            >
              {String(index + 1).padStart(3, "0")}
            </motion.span>

            <div className="ministry-row__main">
              <motion.h3
                layout="position"
                className="ministry-row__title"
              >
                {item.title}
              </motion.h3>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.p
                    key="description"
                    className="ministry-row__description"
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    transition={{
                      duration: 0.45,
                      ease: EASE,
                    }}
                  >
                    {item.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/ministries"
              className="ministry-row__link"
              data-cursor="VIEW"
            >
              <span>{item.symbol}</span>

              <span aria-hidden="true">↗</span>
            </Link>

            {!isTouch && (
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    key="preview"
                    className="ministry-row__preview"
                    initial={{
                      opacity: 0,
                      scale: 0.82,
                      rotate: -4,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: -2,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.86,
                      rotate: -4,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: EASE,
                    }}
                    aria-hidden="true"
                  >
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.article>
        );
      })}
    </div>
  );
}
