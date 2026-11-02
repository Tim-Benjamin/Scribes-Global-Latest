import { Link } from "react-router-dom";

export default function EventsEmptyState() {
  return (
    <div className="events-empty">
      <div
        className="events-empty__number"
        aria-hidden="true"
      >
        00
      </div>

      <div className="events-empty__content">
        <p className="events-empty__eyebrow">
          Gather · Create · Experience
        </p>

        <h3>No featured events right now.</h3>

        <p>
          Check back for upcoming gatherings, or visit our
          events page to explore more.
        </p>

        <Link
          to="/events"
          className="events-empty__link"
          data-cursor="VIEW"
        >
          <span>Explore events</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}