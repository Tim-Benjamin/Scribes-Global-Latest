import { Reveal, RollButton, Split } from "../../fx";
import { CHAPTERS_EMPTY } from "../../content/chapters";

/** No active chapters yet — said big, with a way to connect. */
export default function ChaptersEmptyState() {
  return (
    <div className="chx-state">
      <span className="chx-state-n nums" aria-hidden="true">00</span>
      <div className="chx-state-copy">
        <Reveal><p className="kicker">{CHAPTERS_EMPTY.kicker}</p></Reveal>
        <Split as="h3" text={CHAPTERS_EMPTY.title} className="t-h1" effect="tilt" />
        <Reveal><p className="t-lead chx-state-text">{CHAPTERS_EMPTY.copy}</p></Reveal>
        <Reveal><RollButton to={CHAPTERS_EMPTY.ctaTo} cursor="Join">{CHAPTERS_EMPTY.cta}</RollButton></Reveal>
      </div>
    </div>
  );
}
