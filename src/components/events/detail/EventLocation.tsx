import LocationMap from "../../common/LocationMap";
import { Reveal, Section, SectionHead } from "../../../fx";
import { EVENT_VENUE } from "../../../content/events";
import type { EventItem } from "../../../lib/supabase/queries/events";

type EventLocationProps = {
  event: EventItem;
};

export default function EventLocation({ event }: EventLocationProps) {
  // Virtual-only events have nothing to put on a map.
  if (event.event_type === "virtual" || !event.location) {
    return null;
  }

  return (
    <Section theme="paper" className="evloc" ariaLabelledby="evloc-title">
      <div className="wrap">
        <SectionHead
          id="evloc-title"
          kicker={EVENT_VENUE.kicker}
          title={EVENT_VENUE.title}
          size="xl"
          intro={<span className="evloc-addr">{event.location}</span>}
        />
        <Reveal className="evloc-map" y={80}>
          <LocationMap
            address={event.location}
            latitude={event.latitude}
            longitude={event.longitude}
            label={event.title}
          />
        </Reveal>
      </div>
    </Section>
  );
}
