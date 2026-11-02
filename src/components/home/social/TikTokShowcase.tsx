import { motion } from "motion/react";

import type {
  TikTokVideoItem,
} from "../../../lib/supabase/queries";

import HomeSectionError from "../shared/HomeSectionError";

interface TikTokShowcaseProps {
  videos?: TikTokVideoItem[] | null;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export default function TikTokShowcase({
  videos = [],
  loading = false,
  error = null,
  onRetry,
}: TikTokShowcaseProps) {
  const safeVideos = Array.isArray(videos)
    ? videos.filter((video) =>
        Boolean(video.video_url?.trim()),
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
    <section className="social-feed social-feed--tiktok">
      <div className="social-feed__container">
        <div className="social-feed__header">
          <div>
            <p>TikTok</p>

            <h2>
              Creativity in
              <span> motion.</span>
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="social-feed__loading">
            Loading TikTok...
          </div>
        ) : error ? (
          <HomeSectionError
            title="TikTok couldn't be loaded"
            message="We couldn't retrieve TikTok videos right now."
            onRetry={onRetry}
          />
        ) : (
          <div className="social-feed__grid">
            {safeVideos.map((video, index) => (
              <motion.a
                key={`tiktok-${video.slot ?? index}`}
                href={video.video_url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="social-feed__card"
                data-cursor="PLAY"
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
                  duration: 0.65,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="social-feed__number">
                  {String(index + 1).padStart(
                    2,
                    "0",
                  )}
                </div>

                <div className="social-feed__card-body">
                  <span>
                    Featured video
                  </span>

                  <p>
                    Watch on TikTok
                  </p>
                </div>

                <span
                  className="social-feed__arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}