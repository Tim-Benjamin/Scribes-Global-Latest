import { useCallback, useMemo, useState } from "react";
import { Media, Reveal, Section, SectionHead, VideoModal } from "../../../fx";
import { EVENT_VIDEOS } from "../../../content/events";
import { parseYouTubeList } from "../../../lib/supabase/youtube";
import type { EventItem } from "../../../lib/supabase/queries/events";

type EventVideosProps = {
  event: EventItem;
};

/** First video as a wide cinema card, the rest in a two-up grid. */
export default function EventVideos({ event }: EventVideosProps) {
  const videos = useMemo(() => parseYouTubeList(event.videos), [event.videos]);
  const [activeEmbed, setActiveEmbed] = useState<string | null>(null);
  const close = useCallback(() => setActiveEmbed(null), []);

  if (videos.length === 0) {
    return null;
  }

  return (
    <>
      <Section theme="night" className="evv" ariaLabelledby="evv-title">
        <div className="wrap">
          <SectionHead id="evv-title" kicker={EVENT_VIDEOS.kicker} title={EVENT_VIDEOS.title} size="xl" />
          <Reveal className={`evv-grid ${videos.length === 1 ? "evv-grid--one" : ""}`} stagger={0.1}>
            {videos.map((video, index) => (
              <button
                key={`${video.id}-${index}`}
                type="button"
                className={`evv-card ${index === 0 ? "evv-card--hero" : ""}`}
                onClick={() => setActiveEmbed(video.embed)}
                data-cursor="Play"
                aria-label={`${EVENT_VIDEOS.frameTitle} ${index + 1}`}
              >
                <Media src={video.thumbnail} alt="" className="evv-media" parallax={index === 0 ? 10 : 0} reveal={index === 0 ? "up" : "none"} />
                <span className="evv-shade" aria-hidden="true" />
                <span className="evv-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
                </span>
              </button>
            ))}
          </Reveal>
        </div>
      </Section>

      <VideoModal embedUrl={activeEmbed} title={EVENT_VIDEOS.frameTitle} onClose={close} />
    </>
  );
}
