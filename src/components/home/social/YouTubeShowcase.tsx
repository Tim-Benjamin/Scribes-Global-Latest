import { motion } from "motion/react";

import type {
  YouTubeVideoItem,
} from "../../../lib/supabase/queries";

import HomeSectionSkeleton from "../shared/HomeSectionSkeleton";
import HomeSectionError from "../shared/HomeSectionError";

interface YouTubeShowcaseProps {
  videos?: YouTubeVideoItem[] | null;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

function formatViews(
  value?: number | null,
) {
  const count = Number(value ?? 0);

  if (count >= 1_000_000) {
    return `${(count / 1_000_000)
      .toFixed(1)
      .replace(".0", "")}M views`;
  }

  if (count >= 1_000) {
    return `${(count / 1_000)
      .toFixed(1)
      .replace(".0", "")}K views`;
  }

  if (count > 0) {
    return `${count.toLocaleString()} views`;
  }

  return null;
}

export default function YouTubeShowcase({
  videos = [],
  loading = false,
  error = null,
  onRetry,
}: YouTubeShowcaseProps) {
  const safeVideos = Array.isArray(videos)
    ? videos.filter((video) =>
        Boolean(video.video_id?.trim()),
      )
    : [];

  if (
    !loading &&
    !error &&
    safeVideos.length === 0
  ) {
    return null;
  }

  return (
    <section className="youtube-showcase">
      <div className="youtube-showcase__container">
        <motion.div
          className="youtube-showcase__header"
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
            margin: "-10%",
          }}
          transition={{
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <p>YouTube</p>

          <h2>
            Watch the latest
            <span> from Scribes.</span>
          </h2>
        </motion.div>

        {loading ? (
          <HomeSectionSkeleton cards={3} />
        ) : error ? (
          <HomeSectionError
            title="YouTube couldn't be loaded"
            message="We couldn't retrieve the latest videos."
            onRetry={onRetry}
          />
        ) : (
          <div className="youtube-showcase__grid">
            {safeVideos.map(
              (video, index) => {
                const href =
                  `https://www.youtube.com/watch?v=${video.video_id}`;

                const views =
                  formatViews(
                    video.view_count,
                  );

                return (
                  <motion.article
                    key={
                      video.video_id ??
                      `youtube-${index}`
                    }
                    className="youtube-showcase__card"
                    initial={{
                      opacity: 0,
                      y: 35,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      margin: "-10%",
                    }}
                    transition={{
                      duration: 0.7,
                      delay:
                        index * 0.06,
                      ease: [
                        0.16,
                        1,
                        0.3,
                        1,
                      ],
                    }}
                  >
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="PLAY"
                    >
                      <div className="youtube-showcase__media">
                        {video.thumbnail_url ? (
                          <img
                            src={
                              video.thumbnail_url
                            }
                            alt={
                              video.title ??
                              "Scribes Global video"
                            }
                            loading="lazy"
                          />
                        ) : (
                          <div className="youtube-showcase__placeholder" />
                        )}

                        <div className="youtube-showcase__overlay" />

                        <span
                          className="youtube-showcase__play"
                          aria-hidden="true"
                        >
                          ▶
                        </span>

                        {video.duration && (
                          <span className="youtube-showcase__duration">
                            {
                              video.duration
                            }
                          </span>
                        )}
                      </div>

                      <div className="youtube-showcase__body">
                        <h3>
                          {video.title ??
                            "Scribes Global"}
                        </h3>

                        <div className="youtube-showcase__meta">
                          {views && (
                            <span>
                              {views}
                            </span>
                          )}

                          {video.published_at && (
                            <span>
                              {new Intl.DateTimeFormat(
                                "en",
                                {
                                  month:
                                    "short",
                                  year:
                                    "numeric",
                                },
                              ).format(
                                new Date(
                                  video.published_at,
                                ),
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  </motion.article>
                );
              },
            )}
          </div>
        )}
      </div>
    </section>
  );
}