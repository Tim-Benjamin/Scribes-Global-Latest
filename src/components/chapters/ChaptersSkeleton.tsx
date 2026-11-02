import { CHAPTERS_LIST } from "../../content/chapters";

/** Placeholder rows shaped like the chapter index. */
export default function ChaptersSkeleton() {
  return (
    <div className="chx-skel" aria-busy="true" aria-label={CHAPTERS_LIST.loadingAria}>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="chx-skel-row">
          <span className="skeleton chx-skel-a" />
          <span className="skeleton chx-skel-b" style={{ width: `${62 - (i % 3) * 12}%` }} />
          <span className="skeleton chx-skel-c" />
        </div>
      ))}
    </div>
  );
}
