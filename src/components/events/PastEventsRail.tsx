import { Link } from "react-router-dom";
import { DragRail, Media, Reveal, Section, Split } from "../../fx";
import { EVENTS_EXPLORER } from "../../content/events";
import { eventDateParts } from "../../lib/events/format";
import { sentenceLabel } from "../../lib/events/groups";
import type { EventItem } from "../../lib/supabase/queries/events";
import { storageUrl } from "../../lib/supabase/storage";

type PastEventsRailProps = {
  events: EventItem[];
};

/** Past gatherings as a throwable rail of dimmed photographs. */
export default function PastEventsRail({ events }: PastEventsRailProps) {
  return (
    <Section theme="purple" className="evp" ariaLabelledby="evp-title">
      <div className="wrap evp-head">
        <Split as="h2" id="evp-title" text={EVENTS_EXPLORER.pastTitle} by="chars" effect="tilt" className="evp-title t-mega" />
        <Reveal className="evp-count">
          <span className="nums">{String(events.length).padStart(2, "0")}</span>
          <span>{events.length === 1 ? EVENTS_EXPLORER.event : EVENTS_EXPLORER.events}</span>
        </Reveal>
      </div>

      <DragRail ariaLabel={EVENTS_EXPLORER.pastTitle} className="evp-rail">
        {events.map((event, i) => {
          const date = eventDateParts(event.start_date, event.end_date);
          return (
            <Link key={event.id} to={`/events/${event.slug}`} className={`evp-card ${i % 2 ? "evp-card--low" : ""}`} data-cursor="View">
              <Media className="evp-media" src={storageUrl("event-media", event.hero_image)} alt={event.title} parallax={0} reveal="iris" />
              <span className="evp-date nums">
                <strong>{date.day}</strong> {date.month} {date.year}
              </span>
              <span className="evp-name">{event.title}</span>
              <span className="evp-meta">
                {[event.location, sentenceLabel(event.event_type)].filter(Boolean).map((m) => <span key={m}>{m}</span>)}
              </span>
            </Link>
          );
        })}
      </DragRail>
    </Section>
  );
}
