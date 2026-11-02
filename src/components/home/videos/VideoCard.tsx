import { motion } from "motion/react";

import type {
  HomepageVideoItem,
} from "../../../lib/supabase/queries";

import {
  getYouTubeId,
  getYouTubeThumbnail,
} from "../../../lib/supabase/youtube";

interface VideoCardProps {
  video: HomepageVideoItem;
  index: number;
}

export default function VideoCard({
  video,
  index,
}: VideoCardProps) {
  const youtubeId =
    getYouTubeId(
      video.youtube_url,
    );

  const thumbnail =
    getYouTubeThumbnail(
      video.youtube_url,
    );

  if (!youtubeId) {
    return null;
  }

  const watchUrl =
    `https://www.youtube.com/watch?v=${youtubeId}`;

  return (
    <motion.article
      className="home-video-card"
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
        delay: index * 0.06,
        ease: [
          0.16,
          1,
          0.3,
          1,
        ],
      }}
    >
      <a
        href={watchUrl}
        target="_blank"
        rel="noreferrer"
        className="home-video-card__link"
        data-cursor="PLAY"
      >
        <div className="home-video-card__media">
          {thumbnail ? (
            <motion.img
              src={thumbnail}
              alt=""
              loading="lazy"
              whileHover={{
                scale: 1.04,
              }}
              transition={{
                duration: 0.8,
                ease: [
                  0.16,
                  1,
                  0.3,
                  1,
                ],
              }}
            />
          ) : (
            <div className="home-video-card__placeholder" />
          )}

          <div className="home-video-card__shade" />

          <span className="home-video-card__play">
            <span>▶</span>
          </span>

          {video.video_date && (
            <span className="home-video-card__date">
              {new Intl.DateTimeFormat(
                "en",
                {
                  month: "short",
                  year: "numeric",
                },
              ).format(
                new Date(
                  video.video_date,
                ),
              )}
            </span>
          )}
        </div>

        <div className="home-video-card__body">
          <h3>
            {video.title}
          </h3>

          {video.description && (
            <p>
              {video.description}
            </p>
          )}
        </div>
      </a>
    </motion.article>
  );
}