import {
  useRef,
} from "react";

import type {
  HomepageVideoItem,
} from "../../../lib/supabase/queries";

import VideoCard from "./VideoCard";

interface VideoRowProps {
  title: string;
  videos: HomepageVideoItem[];
}

export default function VideoRow({
  title,
  videos,
}: VideoRowProps) {
  const trackRef =
    useRef<HTMLDivElement>(null);

  const scroll = (
    direction: "left" | "right",
  ) => {
    const track =
      trackRef.current;

    if (!track) return;

    const amount = Math.min(
      track.clientWidth * 0.8,
      700,
    );

    track.scrollBy({
      left:
        direction === "right"
          ? amount
          : -amount,

      behavior: "smooth",
    });
  };

  return (
    <div className="home-video-row">
      <div className="home-video-row__top">
        <h3>{title}</h3>

        <div className="home-video-row__controls">
          <button
            type="button"
            onClick={() =>
              scroll("left")
            }
            aria-label={`Scroll ${title} videos left`}
          >
            ←
          </button>

          <button
            type="button"
            onClick={() =>
              scroll("right")
            }
            aria-label={`Scroll ${title} videos right`}
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="home-video-row__track"
      >
        {videos.map(
          (video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
            />
          ),
        )}
      </div>
    </div>
  );
}