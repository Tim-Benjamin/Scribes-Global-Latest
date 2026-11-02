import { RollButton, Section, Split } from "../../../fx";
import { EVENT_NOT_FOUND } from "../../../content/events";

type EventNotFoundProps = {
  error?: string | null;
  onRetry?: () => void;
};

/** Missing or failed event: a huge outlined 404-style mark and a way back. */
export default function EventNotFound({ error, onRetry }: EventNotFoundProps) {
  return (
    <Section theme="paper" className="evnf" ariaLabelledby="evnf-title">
      <div className="wrap evnf-grid">
        <span className="evnf-mark" aria-hidden="true">?</span>
        <div className="evnf-copy">
          <p className="kicker">{EVENT_NOT_FOUND.kicker}</p>
          <Split as="h1" id="evnf-title" text={EVENT_NOT_FOUND.title} trigger="load" effect="rise" className="t-display" />
          {error ? <p className="t-lead evnf-error" role="alert">{error}</p> : null}
          <div className="evnf-actions">
            <RollButton to="/events" cursor="Events">{EVENT_NOT_FOUND.back}</RollButton>
            {onRetry ? <RollButton variant="outline" onClick={onRetry} cursor="Retry">{EVENT_NOT_FOUND.retry}</RollButton> : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
