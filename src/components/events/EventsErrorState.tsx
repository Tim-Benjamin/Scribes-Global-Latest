import { RollButton, Reveal, Section, Split } from "../../fx";
import { EVENTS_ERROR } from "../../content/events";

type EventsErrorStateProps = {
  message?: string | null;
  onRetry: () => void;
};

/** The request failed: say so plainly and offer a retry. */
export default function EventsErrorState({ message, onRetry }: EventsErrorStateProps) {
  return (
    <Section theme="magenta" className="evs-state evs-state--error" ariaLabelledby="evs-error-title">
      <div className="wrap evs-state-grid" role="alert">
        <div className="evs-state-mark" aria-hidden="true">
          <span className="evs-state-n evs-state-n--err">!</span>
        </div>
        <div className="evs-state-copy">
          <p className="kicker">{EVENTS_ERROR.kicker}</p>
          <Split as="h2" id="evs-error-title" text={EVENTS_ERROR.title} className="t-display" effect="tilt" />
          <Reveal stagger={0.1} className="evs-state-foot">
            <p className="t-lead">{message || EVENTS_ERROR.fallback}</p>
            <div><RollButton variant="light" onClick={onRetry} cursor="Retry">{EVENTS_ERROR.action}</RollButton></div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
