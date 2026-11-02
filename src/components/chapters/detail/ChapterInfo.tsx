import { Reveal, RollButton, ScrubWords, Section, Split } from "../../../fx";
import type { ActiveChapterItem } from "../../../lib/supabase/queries/chapters";
import { CHAPTER_ABOUT } from "../../../content/chapters";

type ChapterInfoProps = {
  chapter: ActiveChapterItem;
  onJoin: () => void;
};

/** Editorial about: sticky title, a paragraph that inks in, then the facts set large. */
export default function ChapterInfo({ chapter, onJoin }: ChapterInfoProps) {
  const about = chapter.about_text ?? chapter.description;

  const facts = [
    chapter.location ? { label: CHAPTER_ABOUT.facts.location, value: chapter.location } : null,
    chapter.meeting_schedule ? { label: CHAPTER_ABOUT.facts.meeting, value: chapter.meeting_schedule } : null,
    chapter.campus_university ? { label: CHAPTER_ABOUT.facts.campus, value: chapter.campus_university } : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <Section theme="paper" className="chd-about" ariaLabelledby="chd-about-title">
      <div className="wrap chd-about-grid">
        <div className="chd-about-side">
          <Reveal><p className="kicker">{CHAPTER_ABOUT.kicker}</p></Reveal>
          <Split as="h2" id="chd-about-title" text={CHAPTER_ABOUT.title(chapter.name)} className="t-display chd-about-title" effect="tilt" />
        </div>

        <div className="chd-about-main">
          {about ? (
            <ScrubWords text={about} className="chd-about-text" />
          ) : (
            <Reveal><p className="chd-about-text chd-about-text--muted">{CHAPTER_ABOUT.fallback}</p></Reveal>
          )}

          <Reveal as="dl" className="chd-facts" stagger={0.08}>
            {facts.map((f) => (
              <div className="chd-fact" key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
            <div className="chd-fact">
              <dt>{CHAPTER_ABOUT.facts.status}</dt>
              <dd className="chd-active"><span className="chd-active-dot" aria-hidden="true" />{CHAPTER_ABOUT.active}</dd>
            </div>
          </Reveal>

          <Reveal>
            <RollButton onClick={onJoin} size="lg" cursor="Join">{CHAPTER_ABOUT.join}</RollButton>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
