import { ExpandMedia, RollButton, Section, SectionHead } from "../../fx";
import { EVENTS_FEATURED } from "../../content/events";
import { eventDateParts } from "../../lib/events/format";
import { sentenceLabel } from "../../lib/events/groups";
import {
  formatEventDate,
  formatEventTime,
  getEventDisplayStatus,
  type EventItem,
} from "../../lib/supabase/queries/events";
import { storageUrl } from "../../lib/supabase/storage";

type FeaturedEventProps = {
  event: EventItem;
};

/**
 * The featured gathering as a pinned, expand-to-full-bleed moment;
 * once the picture fills the screen its date lands in mega type.
 */
export default function FeaturedEvent({ event }: FeaturedEventProps) {
  const hero = storageUrl("event-media", event.hero_image);
  const status = getEventDisplayStatus(event);
  const date = eventDateParts(event.start_date, event.end_date);
  const L = EVENTS_FEATURED.labels;

  return (
    <Section theme="night" flush className="evf" ariaLabelledby="evf-title">
      <div className="wrap evf-head">
        <SectionHead id="evf-title" kicker={EVENTS_FEATURED.kicker} title={EVENTS_FEATURED.title} size="xl" />
      </div>

      <ExpandMedia src={hero} alt={event.title} className="evf-xm" length={1.4}>
        <div className="evf-overlay">
          <div className="evf-date" aria-hidden="true">
            <span className="evf-day nums">{date.day}</span>
            <span className="evf-my nums">
              {date.month}
              <span className="t-italic"> {date.year}</span>
            </span>
          </div>

          <div className="evf-body">
            <p className="evf-chips">
              <span className="evf-chip evf-chip--hot">{EVENTS_FEATURED.badge}</span>
              <span className={`evf-chip ev-status ev-status--${status}`}>{sentenceLabel(status)}</span>
            </p>
            <h3 className="evf-title">{event.title}</h3>
            {event.description ? <p className="evf-desc">{event.description}</p> : null}
            <dl className="evf-facts">
              <div>
                <dt>{L.date}</dt>
                <dd className="nums">{formatEventDate(event.start_date)}</dd>
              </div>
              <div>
                <dt>{L.time}</dt>
                <dd className="nums">{formatEventTime(event.start_date)}</dd>
              </div>
              {event.location ? (
                <div>
                  <dt>{L.location}</dt>
                  <dd>{event.location}</dd>
                </div>
              ) : null}
              {event.event_type ? (
                <div>
                  <dt>{L.experience}</dt>
                  <dd>{sentenceLabel(event.event_type)}</dd>
                </div>
              ) : null}
            </dl>
            <RollButton to={`/events/${event.slug}`} variant="light" size="lg" cursor="View">
              {EVENTS_FEATURED.view}
            </RollButton>
          </div>
        </div>
      </ExpandMedia>
    </Section>
  );
}
