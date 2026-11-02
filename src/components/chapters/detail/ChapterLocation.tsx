import LocationMap from "../../common/LocationMap";
import { Reveal, Section, SectionHead } from "../../../fx";
import type { ActiveChapterItem } from "../../../lib/supabase/queries/chapters";
import { CHAPTER_LOCATION } from "../../../content/chapters";

type ChapterLocationProps = {
  chapter: ActiveChapterItem;
};

export default function ChapterLocation({ chapter }: ChapterLocationProps) {
  return (
    <Section theme="paper" className="chd-location" ariaLabelledby="chd-location-title">
      <div className="wrap">
        <SectionHead id="chd-location-title" kicker={CHAPTER_LOCATION.kicker} title={CHAPTER_LOCATION.title} size="xl" />
        <Reveal>
          <LocationMap
            address={chapter.location}
            latitude={chapter.latitude}
            longitude={chapter.longitude}
            label={chapter.name}
          />
        </Reveal>
      </div>
    </Section>
  );
}
