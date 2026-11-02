import { useRef } from "react";
import { Reveal, ScrubWords, Section, Split, gsap, useGsap } from "../../../fx";
import EventActionPanel from "./EventActionPanel";
import { EVENT_OVERVIEW } from "../../../content/events";
import { sentenceLabel } from "../../../lib/events/groups";
import {
  formatEventDate,
  formatEventTime,
  getEventCapacityLeft,
  getEventDisplayStatus,
  isEventRegistrationFull,
  type EventItem,
} from "../../../lib/supabase/queries/events";

type EventOverviewProps = {
  event: EventItem;
  onRegister: () => void;
  onRsvp: () => void;
};

/**
 * Description + facts on the left; on the right a sticky panel with the
 * date and the Register / RSVP / Join actions follows the reader down.
 * On phones the actions ride along as a sticky bottom dock instead.
 */
export default function EventOverview({ event, onRegister, onRsvp }: EventOverviewProps) {
  const ref = useRef<HTMLElement>(null);
  const status = getEventDisplayStatus(event);
  const capacity = getEventCapacityLeft(event);
  const full = isEventRegistrationFull(event);
  const F = EVENT_OVERVIEW.facts;

  const paragraphs = (event.description ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const [lead, ...rest] = paragraphs;
  const scrubLead = Boolean(lead) && lead.length <= 260 && !lead.includes("\n");

  const showCapacity = Boolean(event.registration_enabled) && event.registration_limit !== null;
  const fill = showCapacity && event.registration_limit && event.registration_limit > 0
    ? Math.min(100, ((event.registration_count ?? 0) / event.registration_limit) * 100)
    : 0;

  useGsap(({ reduced, scope }) => {
    const bar = scope.querySelector<HTMLElement>(".evo-cap-fill");
    if (!bar || reduced) return;
    gsap.fromTo(bar, { scaleX: 0 }, {
      scaleX: 1,
      duration: 1.8,
      ease: "sg.inOut",
      scrollTrigger: { trigger: bar, start: "top 90%", once: true },
    });
  }, [fill], ref);

  return (
    <Section ref={ref} theme="night" className="evo" ariaLabelledby="evo-title">
      <div className="wrap evo-grid">
        <div className="evo-main">
          <p className="kicker">{EVENT_OVERVIEW.kicker}</p>
          <Split as="h2" id="evo-title" text={EVENT_OVERVIEW.title} className="t-display evo-title" effect="tilt" />

          <div className="evo-desc">
            {!lead ? (
              <p className="evo-lead evo-lead--muted">{EVENT_OVERVIEW.emptyDescription}</p>
            ) : scrubLead ? (
              <ScrubWords text={lead} className="evo-lead" />
            ) : (
              <Reveal as="p" className="evo-lead evo-pre">{lead}</Reveal>
            )}
            {rest.length ? (
              <Reveal className="evo-rest" stagger={0.08}>
                {rest.map((p, i) => <p key={i} className="evo-pre">{p}</p>)}
              </Reveal>
            ) : null}
          </div>

          <Reveal as="dl" className="evo-facts" stagger={0.06}>
            <div>
              <dt>{F.date}</dt>
              <dd className="nums">{formatEventDate(event.start_date)}</dd>
            </div>
            <div>
              <dt>{F.start}</dt>
              <dd className="nums">{formatEventTime(event.start_date)}</dd>
            </div>
            {event.end_date ? (
              <div>
                <dt>{F.end}</dt>
                <dd className="nums">{formatEventTime(event.end_date)}</dd>
              </div>
            ) : null}
            {event.event_type ? (
              <div>
                <dt>{F.type}</dt>
                <dd>{sentenceLabel(event.event_type)}</dd>
              </div>
            ) : null}
            {event.location ? (
              <div className="evo-facts-wide">
                <dt>{F.location}</dt>
                <dd>{event.location}</dd>
              </div>
            ) : null}
            <div>
              <dt>{F.status}</dt>
              <dd><span className={`ev-status ev-status--${status}`}>{sentenceLabel(status)}</span></dd>
            </div>
          </Reveal>

          {showCapacity ? (
            <Reveal className="evo-cap">
              <div className="evo-cap-head">
                <span>{EVENT_OVERVIEW.registration}</span>
                <strong className="nums">{full ? EVENT_OVERVIEW.full : EVENT_OVERVIEW.spacesRemaining(capacity ?? 0)}</strong>
              </div>
              <div className="evo-cap-track" role="presentation">
                <span className="evo-cap-fill" style={{ width: `${fill}%` }} />
              </div>
            </Reveal>
          ) : null}
        </div>

        <aside className="evo-aside">
          <div className="evo-sticky">
            <EventActionPanel event={event} onRegister={onRegister} onRsvp={onRsvp} />
          </div>
        </aside>

        <div className="evo-dock">
          <EventActionPanel event={event} onRegister={onRegister} onRsvp={onRsvp} layout="dock" />
        </div>
      </div>
    </Section>
  );
}
