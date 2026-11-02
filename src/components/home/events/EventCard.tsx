import { Link } from "react-router-dom";
import { motion } from "motion/react";

import type { Database } from "../../../lib/supabase/database.types";
import { storageUrl } from "../../../lib/supabase/storage";

type EventRow =
  Database["public"]["Tables"]["events"]["Row"];

type FeaturedEvent = Pick<
  EventRow,
  | "id"
  | "title"
  | "slug"
  | "start_date"
  | "end_date"
  | "location"
  | "event_type"
  | "hero_image"
  | "registration_enabled"
  | "rsvp_enabled"
  | "registration_limit"
  | "registration_count"
>;

interface EventCardProps {
  event: FeaturedEvent;
  index: number;
}

function formatEventDate(
  startDate: string,
  endDate?: string | null,
) {
  const start = new Date(startDate);

  const startMonth = new Intl.DateTimeFormat(
    "en",
    {
      month: "short",
    },
  ).format(start);

  const startDay = new Intl.DateTimeFormat(
    "en",
    {
      day: "2-digit",
    },
  ).format(start);

  const startYear = new Intl.DateTimeFormat(
    "en",
    {
      year: "numeric",
    },
  ).format(start);

  if (!endDate) {
    return {
      month: startMonth,
      day: startDay,
      year: startYear,
    };
  }

  const end = new Date(endDate);

  const sameDay =
    start.toDateString() === end.toDateString();

  if (sameDay) {
    return {
      month: startMonth,
      day: startDay,
      year: startYear,
    };
  }

  const endDay = new Intl.DateTimeFormat(
    "en",
    {
      day: "2-digit",
    },
  ).format(end);

  return {
    month: startMonth,
    day: `${startDay}–${endDay}`,
    year: startYear,
  };
}

function getAvailabilityLabel(
  event: FeaturedEvent,
) {
  if (
    !event.registration_enabled &&
    !event.rsvp_enabled
  ) {
    return null;
  }

  if (
    event.registration_enabled &&
    event.registration_limit
  ) {
    const count =
      event.registration_count ?? 0;

    const remaining =
      event.registration_limit - count;

    if (remaining <= 0) {
      return "Registration full";
    }

    if (remaining <= 5) {
      return `${remaining} place${
        remaining === 1 ? "" : "s"
      } remaining`;
    }
  }

  if (event.registration_enabled) {
    return "Registration open";
  }

  if (event.rsvp_enabled) {
    return "RSVP available";
  }

  return null;
}

export default function EventCard({
  event,
  index,
}: EventCardProps) {
  const imageUrl = storageUrl(
    "event-media",
    event.hero_image,
  );

  const date = formatEventDate(
    event.start_date,
    event.end_date,
  );

  const availability =
    getAvailabilityLabel(event);

  const href = event.slug
    ? `/events/${event.slug}`
    : "/events";

  return (
    <motion.article
      className="featured-event-card"
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-10% 0px",
      }}
      transition={{
        duration: 0.75,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        to={href}
        className="featured-event-card__link"
        data-cursor="VIEW"
      >
        <div className="featured-event-card__media">
          {imageUrl ? (
            <motion.img
              src={imageUrl}
              alt=""
              loading="lazy"
              whileHover={{
                scale: 1.035,
              }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ) : (
            <div className="featured-event-card__placeholder">
              <span>Scribes Global</span>
            </div>
          )}

          <div className="featured-event-card__overlay" />

          <div className="featured-event-card__date">
            <span>{date.month}</span>
            <strong>{date.day}</strong>
            <small>{date.year}</small>
          </div>

          {event.event_type && (
            <div className="featured-event-card__type">
              {event.event_type}
            </div>
          )}
        </div>

        <div className="featured-event-card__body">
          <div>
            <h3>{event.title}</h3>

            {event.location && (
              <p className="featured-event-card__location">
                {event.location}
              </p>
            )}
          </div>

          <div className="featured-event-card__bottom">
            {availability ? (
              <span className="featured-event-card__status">
                {availability}
              </span>
            ) : (
              <span />
            )}

            <span
              className="featured-event-card__arrow"
              aria-hidden="true"
            >
              ↗
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}