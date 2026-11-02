import { Reveal, Section, SectionHead } from "../../../fx";
import type { ActiveChapterItem } from "../../../lib/supabase/queries/chapters";
import { CHAPTER_CONTACT } from "../../../content/chapters";

type ChapterContactProps = {
  chapter: ActiveChapterItem;
};

/** Contact lines set as huge, rolling links. */
export default function ChapterContact({ chapter }: ChapterContactProps) {
  const hasContact = Boolean(chapter.contact_email || chapter.contact_phone || chapter.contact_person);
  if (!hasContact) return null;

  return (
    <Section theme="night" className="chd-contact" ariaLabelledby="chd-contact-title">
      <div className="wrap">
        <SectionHead id="chd-contact-title" kicker={CHAPTER_CONTACT.kicker} title={CHAPTER_CONTACT.title} size="xl" />
        <Reveal as="ul" className="chd-lines" stagger={0.1}>
          {chapter.contact_person ? (
            <li className="chd-line">
              <span className="chd-line-label">{CHAPTER_CONTACT.person}</span>
              <span className="chd-line-value">{chapter.contact_person}</span>
            </li>
          ) : null}
          {chapter.contact_email ? (
            <li className="chd-line">
              <span className="chd-line-label">{CHAPTER_CONTACT.email}</span>
              <a className="chd-line-value chd-line-link" href={`mailto:${chapter.contact_email}`} data-cursor="Email">
                <span className="roll" data-text={chapter.contact_email}>{chapter.contact_email}</span>
                <span className="chd-line-go" aria-hidden="true">↗</span>
              </a>
            </li>
          ) : null}
          {chapter.contact_phone ? (
            <li className="chd-line">
              <span className="chd-line-label">{CHAPTER_CONTACT.phone}</span>
              <a className="chd-line-value chd-line-link nums" href={`tel:${chapter.contact_phone.replace(/\s+/g, "")}`} data-cursor="Call">
                <span className="roll" data-text={chapter.contact_phone}>{chapter.contact_phone}</span>
                <span className="chd-line-go" aria-hidden="true">↗</span>
              </a>
            </li>
          ) : null}
        </Reveal>
      </div>
    </Section>
  );
}
