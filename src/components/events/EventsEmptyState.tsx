import { RollButton, Reveal, Section, Split } from "../../fx";
import { EVENTS_EMPTY } from "../../content/events";

/** No public events: an empty calendar page, waiting. */
export default function EventsEmptyState() {
  return (
    <Section theme="night" className="evs-state" ariaLabelledby="evs-empty-title">
      <div className="wrap evs-state-grid">
        <div className="evs-state-mark" aria-hidden="true">
          <span className="evs-state-n nums">00</span>
          <span className="evs-pulse"><i /><i /><i /></span>
        </div>
        <div className="evs-state-copy">
          <p className="kicker">{EVENTS_EMPTY.kicker}</p>
          <Split as="h2" id="evs-empty-title" text={EVENTS_EMPTY.title} className="t-display" effect="tilt" />
          <Reveal stagger={0.1} className="evs-state-foot">
            <p className="t-lead">{EVENTS_EMPTY.copy}</p>
            <div><RollButton to="/" variant="light" cursor="Home">{EVENTS_EMPTY.action}</RollButton></div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
