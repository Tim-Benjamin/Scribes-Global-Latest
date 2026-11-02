import { Reveal, RollButton, Section, Split } from "../../../fx";
import { CHAPTER_NOT_FOUND } from "../../../content/chapters";

type ChapterNotFoundProps = {
  error?: string | null;
  onRetry?: () => void;
};

/** Missing chapter: an outlined, oversized apology with a way back. */
export default function ChapterNotFound({ error, onRetry }: ChapterNotFoundProps) {
  return (
    <Section theme="paper" className="chd-nf" ariaLabelledby="chd-nf-title">
      <div className="wrap chd-nf-inner">
        <span className="chd-nf-glyph" aria-hidden="true">?</span>
        <div className="chd-nf-copy">
          <Reveal><p className="kicker">{CHAPTER_NOT_FOUND.kicker}</p></Reveal>
          <Split as="h1" id="chd-nf-title" text={CHAPTER_NOT_FOUND.title} trigger="load" by="chars" stagger={0.018} className="t-display chd-nf-title" />
          {error ? <Reveal><p className="t-lead chd-nf-error" role="alert">{error}</p></Reveal> : null}
          <Reveal className="chd-nf-actions" stagger={0.08}>
            <RollButton to="/chapters" size="lg" cursor="Back">{CHAPTER_NOT_FOUND.back}</RollButton>
            {onRetry ? <RollButton onClick={onRetry} variant="outline" size="lg">{CHAPTER_NOT_FOUND.retry}</RollButton> : null}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
