import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ScrollTrigger, gsap, isTouchDevice, prefersReducedMotion, useGsap } from "../../fx";
import { EVENTS_EXPLORER } from "../../content/events";
import { availabilityLabel, eventDateParts } from "../../lib/events/format";
import { cardActionLabel, sentenceLabel } from "../../lib/events/groups";
import {
  formatEventTime,
  getEventDisplayStatus,
  type EventItem,
} from "../../lib/supabase/queries/events";
import { storageUrl } from "../../lib/supabase/storage";

type EventIndexListProps = {
  events: EventItem[];
};

const C = EVENTS_EXPLORER.card;

/**
 * Editorial index of gatherings. Each row opens on hover/focus to show
 * its description and timing, a colour wash rises behind it, and the
 * event picture floats beside the pointer, leaning into the motion.
 * On touch the rows are always open and carry an inline thumbnail.
 */
export default function EventIndexList({ events }: EventIndexListProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const listKey = events.map((e) => e.id).join(",");

  // Rows rise in, batched as they enter (also replays after a filter change).
  useGsap(({ reduced, scope }) => {
    if (reduced) return undefined;
    const rows = scope.querySelectorAll<HTMLElement>(".evl-row");
    gsap.set(rows, { opacity: 0, y: 60, clipPath: "inset(0% 0% 100% 0%)" });
    const triggers = ScrollTrigger.batch(rows, {
      start: "top 94%",
      once: true,
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", stagger: 0.08, duration: 1.1, clearProps: "clipPath",
      }),
    });
    return () => triggers.forEach((t) => t.kill());
  }, [listKey], rootRef);

  // Floating preview follows the pointer.
  useEffect(() => {
    const float = floatRef.current;
    if (!float || isTouchDevice() || prefersReducedMotion()) return undefined;
    const xTo = gsap.quickTo(float, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(float, "y", { duration: 0.7, ease: "power3.out" });
    const rTo = gsap.quickTo(float, "rotate", { duration: 0.9, ease: "power3.out" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.5));
      lastX = e.clientX;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const float = floatRef.current;
    if (!float || prefersReducedMotion()) return;
    gsap.to(float, {
      scale: active === null ? 0 : 1,
      opacity: active === null ? 0 : 1,
      duration: 0.6,
      ease: active === null ? "power3.in" : "back.out(1.5)",
      overwrite: "auto",
    });
  }, [active]);

  return (
    <div ref={rootRef} className="evl" onPointerLeave={() => setActive(null)}>
      <ul className="evl-list">
        {events.map((event, i) => {
          const date = eventDateParts(event.start_date, event.end_date);
          const status = getEventDisplayStatus(event);
          const image = storageUrl("event-media", event.hero_image);
          const action = availabilityLabel(event) ?? cardActionLabel(event, C);
          return (
            <li key={event.id} className={`evl-item evl-item--${status}`}>
              <Link
                to={`/events/${event.slug}`}
                className={`evl-row ${active === i ? "is-open" : ""} ${active !== null && active !== i ? "is-dim" : ""}`}
                data-cursor="View"
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <span className="evl-wash" aria-hidden="true" />
                <span className="evl-date">
                  <span className="evl-day nums">{date.day}</span>
                  <span className="evl-my nums">{date.month} {date.year}</span>
                </span>

                <span className="evl-thumb" aria-hidden="true">
                  {image ? <img src={image} alt="" loading="lazy" /> : <span className="media-fallback evl-thumb-fb">{event.title.charAt(0)}</span>}
                </span>

                <span className="evl-main">
                  <span className="evl-tags">
                    <span className={`ev-status ev-status--${status}`}>{sentenceLabel(status)}</span>
                    {event.featured ? <span className="evl-tag">{C.featured}</span> : null}
                    {event.event_type ? <span className="evl-tag">{sentenceLabel(event.event_type)}</span> : null}
                  </span>
                  <span className="evl-title">{event.title}</span>
                  <span className="evl-more">
                    <span className="evl-more-in">
                      {event.description ? <span className="evl-desc">{event.description}</span> : null}
                      <span className="evl-facts">
                        <span><em>{C.time}</em> <span className="nums">{formatEventTime(event.start_date)}</span></span>
                        {event.location ? <span><em>{C.location}</em> {event.location}</span> : null}
                      </span>
                    </span>
                  </span>
                </span>

                <span className="evl-side">
                  {event.location ? <span className="evl-loc">{event.location}</span> : null}
                  <span className="evl-avail">{action}</span>
                </span>

                <span className="evl-go" aria-hidden="true">
                  <span className="evl-go-label">{C.explore}</span>
                  <svg viewBox="0 0 24 24"><path d="M6 18L18 6M9 6h9v9" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div ref={floatRef} className="evl-float" aria-hidden="true">
        {events.map((event, i) => {
          const image = storageUrl("event-media", event.hero_image);
          const date = eventDateParts(event.start_date, event.end_date);
          return (
            <div key={event.id} className={`evl-float-img ${active === i ? "is-on" : ""}`}>
              {image ? <img src={image} alt="" /> : <div className="media-fallback" />}
              <span className="evl-float-date nums">{date.day} {date.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
