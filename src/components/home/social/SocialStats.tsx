import { motion } from "motion/react";

import type {
  SocialStatItem,
} from "../../../lib/supabase/queries";

import {
  formatSocialCount,
} from "../../../lib/supabase/social";

import HomeSectionSkeleton from "../shared/HomeSectionSkeleton";
import HomeSectionError from "../shared/HomeSectionError";

import "./social.css";

interface SocialStatsProps {
  stats?: SocialStatItem[] | null;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

function normalizePlatform(
  platform?: string | null,
) {
  return (
    platform
      ?.trim()
      .replace(
        /[_-]+/g,
        " ",
      )
      .replace(
        /\b\w/g,
        (character) =>
          character.toUpperCase(),
      ) || "Community"
  );
}

export default function SocialStats({
  stats = [],
  loading = false,
  error = null,
  onRetry,
}: SocialStatsProps) {
  const safeStats =
    Array.isArray(stats)
      ? stats
      : [];

  const visibleStats =
    safeStats.filter(
      (stat) =>
        Number(
          stat.follower_count ??
            0,
        ) > 0,
    );

  if (
    !loading &&
    !error &&
    visibleStats.length === 0
  ) {
    return null;
  }

  return (
    <section className="social-stats">
      <div className="social-stats__container">
        <motion.div
          className="social-stats__intro"
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-15%",
          }}
          transition={{
            duration: 0.75,
            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
        >
          <p>
            Across the world
          </p>

          <h2>
            One community.
            <span>
              {" "}
              Many expressions.
            </span>
          </h2>
        </motion.div>

        {loading ? (
          <HomeSectionSkeleton
            cards={3}
          />
        ) : error ? (
          <HomeSectionError
            title="Community numbers couldn't be loaded"
            message="We couldn't retrieve the latest social statistics."
            onRetry={onRetry}
          />
        ) : (
          <div className="social-stats__grid">
            {visibleStats.map(
              (stat, index) => (
                <motion.article
                  key={`${stat.platform}-${index}`}
                  className="social-stats__item"
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.65,
                    delay:
                      index * 0.08,
                  }}
                >
                  <strong>
                    {formatSocialCount(
                      stat.follower_count,
                    )}
                  </strong>

                  <span>
                    {normalizePlatform(
                      stat.platform,
                    )}
                  </span>
                </motion.article>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}