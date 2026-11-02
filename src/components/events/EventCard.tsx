import {
  Link,
} from "react-router-dom";

import {
  motion,
} from "motion/react";

import {
  formatEventDay,
  formatEventMonth,
  formatEventTime,
  getEventDisplayStatus,
  isEventRegistrationFull,
  type EventItem,
} from "../../lib/supabase/queries/events";

import {
  storageUrl,
} from "../../lib/supabase/storage";

type EventCardProps = {
  event:
    EventItem;

  index:
    number;
};

export default function EventCard({
  event,
  index,
}: EventCardProps) {
  const image =
    storageUrl(
      "event-media",
      event.hero_image,
    );

  const status =
    getEventDisplayStatus(
      event,
    );

  const registrationFull =
    isEventRegistrationFull(
      event,
    );

  return (
    <motion.article
      className="event-card"
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
        margin: "-5%",
      }}
      transition={{
        duration: 0.55,

        delay:
          Math.min(
            index *
              0.04,
            0.2,
          ),
      }}
    >
      <Link
        to={`/events/${event.slug}`}
        className="event-card__link"
        data-cursor="VIEW"
      >
        <div className="event-card__media">
          {image ? (
            <img
              src={image}
              alt=""
              loading="lazy"
            />
          ) : (
            <div className="event-card__fallback">
              <span>
                {event.title
                  .charAt(0)}
              </span>
            </div>
          )}

          <div className="event-card__overlay" />

          <div className="event-card__date">
            <strong>
              {formatEventDay(
                event.start_date,
              )}
            </strong>

            <span>
              {formatEventMonth(
                event.start_date,
              )}
            </span>
          </div>

          <span
            className={`event-status event-status--${status}`}
          >
            {status}
          </span>

          <div className="event-card__media-footer">
            <span>
              {
                event.event_type
              }
            </span>

            <span>
              ↗
            </span>
          </div>
        </div>

        <div className="event-card__body">
          {event.featured && (
            <p className="event-card__featured">
              Featured
            </p>
          )}

          <h3>
            {event.title}
          </h3>

          {event.description && (
            <p className="event-card__description">
              {
                event.description
              }
            </p>
          )}

          <div className="event-card__meta">
            <div>
              <span>
                Time
              </span>

              <strong>
                {formatEventTime(
                  event.start_date,
                )}
              </strong>
            </div>

            {event.location && (
              <div>
                <span>
                  Location
                </span>

                <strong>
                  {
                    event.location
                  }
                </strong>
              </div>
            )}
          </div>

          <div className="event-card__footer">
            <span>
              {event.registration_enabled
                ? registrationFull
                  ? "Registration full"
                  : "Registration open"
                : event.rsvp_enabled
                  ? "RSVP available"
                  : "View event"}
            </span>

            <span>
              Explore
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}