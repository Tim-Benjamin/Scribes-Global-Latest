import type {
  ActiveChapterItem,
} from "../../lib/supabase/queries/chapters";

import ChapterCard from "./ChapterCard";

type ChaptersGridProps = {
  chapters:
    ActiveChapterItem[];

  selectedId:
    ActiveChapterItem["id"] |
    null;

  onSelect:
    (
      chapter:
        ActiveChapterItem,
    ) => void;
};

export default function ChaptersGrid({
  chapters,
  selectedId,
  onSelect,
}: ChaptersGridProps) {
  return (
    <section className="chapters-list" id="chapters-list">
      <div className="chapters-container">
        <div className="chapters-section-heading">
          <div>
            <span>
              02
            </span>

            <p>
              Active Chapters
            </p>
          </div>

          <h2>
            WHERE WE
            <span>
              GATHER.
            </span>
          </h2>
        </div>

        <div className="chapters-list__grid">
          {chapters.map(
            (
              chapter,
              index,
            ) => (
              <ChapterCard
                key={
                  chapter.id
                }
                chapter={
                  chapter
                }
                index={
                  index
                }
                active={
                  selectedId ===
                  chapter.id
                }
                onSelect={() =>
                  onSelect(
                    chapter,
                  )
                }
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}