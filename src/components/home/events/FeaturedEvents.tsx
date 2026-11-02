import { Link } from "react-router-dom";
import { motion } from "motion/react";

import type { Database } from "../../../lib/supabase/database.types";

import EventCard from "./EventCard";
import EventsEmptyState from "./EventsEmptyState";

import HomeSectionSkeleton from "../shared/HomeSectionSkeleton";
import HomeSectionError from "../shared/HomeSectionError";
import Parallax from "../../animation/Parallax";

import "./events.css";

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

interface FeaturedEventsProps {
  events?: FeaturedEvent[] | null;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export default function FeaturedEvents({
  events = [],
  loading = false,
  error = null,
  onRetry,
}: FeaturedEventsProps) {
  /*
   * Never trust external/query data blindly.
   * Even if Supabase or a parent component gives us undefined/null,
   * this section must continue rendering safely.
   */
  const safeEvents = Array.isArray(events)
    ? events
    : [];

  return (
    <section
      className="featured-events"
      id="featured-events"
    >
      <div className="featured-events__container">
        <motion.div
          className="featured-events__header"
          initial={{
            opacity: 0,
            x: -60,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            margin: "-15%",
          }}
          transition={{
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div>
            <p className="featured-events__eyebrow">
              Gather · Create · Experience
            </p>

            <h2>
              What's
              <span> happening.</span>
            </h2>
          </div>

          <Link
            to="/events"
            className="featured-events__all"
            data-cursor="VIEW"
          >
            <span>All events</span>

            <span aria-hidden="true">
              ↗
            </span>
          </Link>
        </motion.div>

        {loading ? (
          <HomeSectionSkeleton cards={3} />
        ) : error ? (
          <HomeSectionError
            title="Events couldn't be loaded"
            message="We couldn't retrieve upcoming events at the moment."
            onRetry={onRetry}
          />
        ) : safeEvents.length === 0 ? (
          <EventsEmptyState />
        ) : (
          <Parallax
            className="featured-events__grid"
            distance={28}
          >
            {safeEvents.map(
              (event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                />
              ),
            )}
          </Parallax>
        )}
      </div>
    </section>
  );
}