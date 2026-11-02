import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap, isTouchDevice, prefersReducedMotion, useGsap } from "../../fx";
import { getChapterSlug, type ActiveChapterItem } from "../../lib/supabase/queries/chapters";
import { CHAPTERS_LIST } from "../../content/chapters";
import { chapterHero, chapterLogo } from "./chapterMedia";

type ChapterIndexProps = {
  chapters: ActiveChapterItem[];
  /** Changing this replays the row entrance (used when the filter changes). */
  playKey: string;
};

function Picture({ chapter }: { chapter: ActiveChapterItem }) {
  const src = chapterHero(chapter);
  const [failed, setFailed] = useState(false);
  if (src && !failed) return <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} />;
  return (
    <span className="chx-pic-fallback media-fallback">
      <span>{chapter.name.charAt(0)}</span>
    </span>
  );
}

/**
 * Editorial index of chapters. Hovering a row opens its details in
 * place and floats the chapter's picture beside the pointer; on touch
 * the details are always open and the picture sits inline.
 */
export default function ChapterIndex({ chapters, playKey }: ChapterIndexProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const float = floatRef.current;
    if (!float || isTouchDevice() || prefersReducedMotion()) return undefined;
    const xTo = gsap.quickTo(float, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(float, "y", { duration: 0.7, ease: "power3.out" });
    const rTo = gsap.quickTo(float, "rotate", { duration: 0.9, ease: "power3.out" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.5));
      lastX = e.clientX;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const float = floatRef.current;
    if (!float || prefersReducedMotion()) return;
    gsap.to(float, {
      scale: active === null ? 0 : 1,
      opacity: active === null ? 0 : 1,
      duration: 0.6,
      ease: active === null ? "power3.in" : "back.out(1.6)",
      overwrite: "auto",
    });
  }, [active]);

  useGsap(({ reduced, scope }) => {
    if (reduced) return;
    const rows = scope.querySelectorAll<HTMLElement>(".chx-row");
    gsap.fromTo(rows, { y: 60, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 1.1,
      stagger: 0.07,
      ease: "sg.out",
      scrollTrigger: { trigger: scope, start: "top 85%", once: true },
    });
    gsap.fromTo(scope.querySelectorAll(".chx-row-rule"), { scaleX: 0 }, {
      scaleX: 1,
      duration: 1.4,
      stagger: 0.07,
      ease: "sg.inOut",
      scrollTrigger: { trigger: scope, start: "top 85%", once: true },
    });
  }, [playKey, chapters.length], rootRef);

  return (
    <div ref={rootRef} className="chx-index" onPointerLeave={() => setActive(null)}>
      <ul className="chx-rows">
        {chapters.map((chapter, i) => {
          const logo = chapterLogo(chapter);
          const campus = Boolean(chapter.is_campus);
          return (
            <li key={chapter.id} className="chx-row-item">
              <span className="chx-row-rule" aria-hidden="true" />
              <Link
                to={`/chapters/${getChapterSlug(chapter)}`}
                className={`chx-row ${active === i ? "is-on" : ""} ${active !== null && active !== i ? "is-dim" : ""}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                data-cursor="View"
              >
                <span className="chx-row-thumb" aria-hidden="true"><Picture chapter={chapter} /></span>
                <span className="chx-row-loc">{chapter.location}</span>
                <span className="chx-row-name">
                  <span className="roll" data-text={chapter.name}>{chapter.name}</span>
                </span>
                <span className="chx-row-tags">
                  <span className={`chx-badge ${campus ? "is-campus" : ""}`}>
                    {campus ? CHAPTERS_LIST.campusBadge : CHAPTERS_LIST.chapterBadge}
                  </span>
                  {chapter.campus_university ? <span className="chx-row-uni">{chapter.campus_university}</span> : null}
                </span>
                <span className="chx-row-go" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
                </span>

                {chapter.description || chapter.meeting_schedule || logo ? (
                  <span className="chx-row-more">
                    <span className="chx-row-more-in">
                      {logo ? (
                        <span className="chx-row-logo"><img src={logo} alt={`${chapter.name} logo`} loading="lazy" /></span>
                      ) : null}
                      {chapter.description ? <span className="chx-row-desc">{chapter.description}</span> : null}
                      {chapter.meeting_schedule ? (
                        <span className="chx-row-meet">
                          <span className="chx-row-meet-l">{CHAPTERS_LIST.meeting}</span>
                          <strong>{chapter.meeting_schedule}</strong>
                        </span>
                      ) : null}
                    </span>
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      <div ref={floatRef} className="chx-float" aria-hidden="true">
        {chapters.map((chapter, i) => (
          <div key={chapter.id} className={`chx-float-img ${active === i ? "is-on" : ""}`}>
            <Picture chapter={chapter} />
          </div>
        ))}
      </div>
    </div>
  );
}
