import { EVENTS_LOADING_LABEL } from "../../content/events";

/** Placeholder rows shaped like the editorial index. */
export default function EventsSkeleton() {
  return (
    <div className="evs-loading wrap" aria-busy="true" aria-label={EVENTS_LOADING_LABEL} role="status">
      <div className="evs-loading-feature skeleton" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="evs-loading-row">
          <span className="skeleton evs-sk-date" />
          <span className="evs-sk-lines">
            <span className="skeleton" style={{ width: `${70 - i * 9}%` }} />
            <span className="skeleton" style={{ width: `${38 + i * 6}%` }} />
          </span>
          <span className="skeleton evs-sk-dot" />
        </div>
      ))}
    </div>
  );
}
