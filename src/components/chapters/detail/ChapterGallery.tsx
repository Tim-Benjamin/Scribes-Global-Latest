import { useEffect, useMemo, useRef, useState } from "react";
import { DragRail, Section, SectionHead, gsap, prefersReducedMotion } from "../../../fx";
import { useMotionEngine } from "../../motion/motion-context";
import type { ActiveChapterItem } from "../../../lib/supabase/queries/chapters";
import { storageUrl } from "../../../lib/supabase/storage";
import { parseChapterGallery } from "../../../lib/chapters/gallery";
import { CHAPTER_GALLERY } from "../../../content/chapters";

type ChapterGalleryProps = {
  chapter: ActiveChapterItem;
};

type LightboxProps = {
  images: string[];
  index: number;
  name: string;
  onIndex: (i: number) => void;
  onClose: () => void;
};

function Lightbox({ images, index, name, onIndex, onClose }: LightboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const engine = useMotionEngine();
  const count = images.length;

  useEffect(() => {
    const el = ref.current;
    engine.lenis.current?.stop();
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    if (el && !prefersReducedMotion()) {
      gsap.fromTo(el, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 0.9, ease: "sg.inOut" });
    }
    return () => {
      engine.lenis.current?.start();
      previous?.focus?.({ preventScroll: true });
    };
  }, [engine]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % count);
      if (e.key === "ArrowLeft") onIndex((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onClose, onIndex]);

  useEffect(() => {
    const img = ref.current?.querySelector(".chd-lb-img");
    if (img && !prefersReducedMotion()) {
      gsap.fromTo(img, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.8 });
    }
  }, [index]);

  return (
    <div
      ref={ref}
      className="chd-lb theme-night"
      role="dialog"
      aria-modal="true"
      aria-label={CHAPTER_GALLERY.alt(name, index + 1)}
      onClick={onClose}
      data-lenis-prevent
    >
      <button ref={closeRef} type="button" className="chd-lb-close" onClick={onClose} aria-label={CHAPTER_GALLERY.close} data-cursor="Close">
        <span className="roll" data-text="Close">Close</span>
      </button>
      <img
        className="chd-lb-img"
        src={images[index]}
        alt={CHAPTER_GALLERY.alt(name, index + 1)}
        onClick={(e) => e.stopPropagation()}
      />
      {count > 1 ? (
        <div className="chd-lb-nav" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => onIndex((index - 1 + count) % count)} aria-label={CHAPTER_GALLERY.prev}>←</button>
          <span className="nums">{index + 1} / {count}</span>
          <button type="button" onClick={() => onIndex((index + 1) % count)} aria-label={CHAPTER_GALLERY.next}>→</button>
        </div>
      ) : null}
    </div>
  );
}

/** Throwable rail of the chapter's photos; any one opens full-screen. */
export default function ChapterGallery({ chapter }: ChapterGalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  const images = useMemo(
    () => parseChapterGallery(chapter.gallery as string | string[] | null)
      .map((path) => storageUrl("chapter-media", path))
      .filter((url): url is string => Boolean(url)),
    [chapter.gallery],
  );

  if (images.length === 0) return null;

  return (
    <Section theme="night" flush className="chd-gallery" ariaLabelledby="chd-gallery-title">
      <div className="wrap">
        <SectionHead id="chd-gallery-title" kicker={CHAPTER_GALLERY.kicker} title={CHAPTER_GALLERY.title} size="xl" />
      </div>
      <DragRail ariaLabel={CHAPTER_GALLERY.rail} className="chd-rail">
        {images.map((image, i) => (
          <button
            key={image}
            type="button"
            className={`chd-shot chd-shot--${i % 3}`}
            onClick={() => setActive(i)}
            data-cursor="View"
          >
            <img src={image} alt={CHAPTER_GALLERY.alt(chapter.name, i + 1)} loading="lazy" draggable={false} />
          </button>
        ))}
      </DragRail>

      {active !== null ? (
        <Lightbox
          images={images}
          index={active}
          name={chapter.name}
          onIndex={setActive}
          onClose={() => setActive(null)}
        />
      ) : null}
    </Section>
  );
}
