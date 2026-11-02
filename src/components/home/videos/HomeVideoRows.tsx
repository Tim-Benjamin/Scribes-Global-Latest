import { motion } from "motion/react";

import type {
  HomepageVideoItem,
} from "../../../lib/supabase/queries";

import {
  groupHomepageVideos,
} from "../../../lib/supabase/home";

import HomeSectionSkeleton from "../shared/HomeSectionSkeleton";
import HomeSectionError from "../shared/HomeSectionError";

import VideoRow from "./VideoRow";

import "./videos.css";

interface HomeVideoRowsProps {
  videos?: HomepageVideoItem[] | null;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export default function HomeVideoRows({
  videos = [],
  loading = false,
  error = null,
  onRetry,
}: HomeVideoRowsProps) {
  const safeVideos =
    Array.isArray(videos)
      ? videos
      : [];

  const validVideos =
    safeVideos.filter((video) =>
      Boolean(
        video.youtube_url?.trim(),
      ),
    );

  const groups =
    groupHomepageVideos(
      validVideos,
    );

  if (
    !loading &&
    !error &&
    groups.length === 0
  ) {
    return null;
  }

  return (
    <section className="home-videos">
      <div className="home-videos__inner">
        <motion.div
          className="home-videos__heading"
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
            margin: "-15%",
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <p>
            Watch · Listen · Experience
          </p>

          <h2>
            Stories in
            <span> motion.</span>
          </h2>
        </motion.div>

        {loading ? (
          <HomeSectionSkeleton
            cards={3}
          />
        ) : error ? (
          <HomeSectionError
            title="Videos couldn't be loaded"
            message="We couldn't retrieve the latest videos right now."
            onRetry={onRetry}
          />
        ) : (
          <div className="home-videos__rows">
            {groups.map((group) => (
              <VideoRow
                key={group.title}
                title={group.title}
                videos={group.videos}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}