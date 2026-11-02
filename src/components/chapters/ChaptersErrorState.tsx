import { Reveal, RollButton, Split } from "../../fx";
import { CHAPTERS_ERROR } from "../../content/chapters";

type ChaptersErrorStateProps = {
  message?: string | null;
  onRetry: () => void;
};

export default function ChaptersErrorState({ message, onRetry }: ChaptersErrorStateProps) {
  return (
    <div className="chx-state chx-state--error" role="alert">
      <span className="chx-state-n" aria-hidden="true">!</span>
      <div className="chx-state-copy">
        <Reveal><p className="kicker">{CHAPTERS_ERROR.kicker}</p></Reveal>
        <Split as="h3" text={CHAPTERS_ERROR.title} className="t-h1" effect="tilt" />
        <Reveal><p className="t-lead chx-state-text">{message || CHAPTERS_ERROR.fallback}</p></Reveal>
        <Reveal><RollButton onClick={onRetry} variant="outline">{CHAPTERS_ERROR.retry}</RollButton></Reveal>
      </div>
    </div>
  );
}
