import type { Ref } from "react";

interface HeroVisualProps {
  videoUrl?: string | null;
  posterUrl?: string | null;
  frameRef?: Ref<HTMLDivElement>;
}

/**
 * Clean hero background. A configured video (site_settings.hero_video_url)
 * is the primary treatment; with none set yet, it falls back to a simple
 * brand gradient instead of the old orb/grid/halo visual.
 */
export default function HeroVisual({
  videoUrl,
  posterUrl,
  frameRef,
}: HeroVisualProps) {
  if (videoUrl) {
    return (
      <div
        ref={frameRef}
        className="home-hero__video-frame"
        aria-hidden="true"
      >
        <video
          className="home-hero__video"
          src={videoUrl}
          poster={posterUrl ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />

        <div className="home-hero__video-scrim" />
      </div>
    );
  }

  return (
    <div
      ref={frameRef}
      className="home-hero__video-frame home-hero__video-frame--fallback"
      aria-hidden="true"
    />
  );
}
