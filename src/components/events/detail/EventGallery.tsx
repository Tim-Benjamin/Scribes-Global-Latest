import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DragRail, Media, Section, SectionHead, gsap, prefersReducedMotion } from "../../../fx";
import { useMotionEngine } from "../../motion/motion-context";
import { EVENT_GALLERY } from "../../../content/events";
import { parseEventGallery } from "../../../lib/events/gallery";
import { storageUrl } from "../../../lib/supabase/storage";
import type { EventItem } from "../../../lib/supabase/queries/events";

type EventGalleryProps = {
  event: EventItem;
};

const SHAPES = ["evg-item--tall", "evg-item--wide", "evg-item--sq", "evg-item--tall", "evg-item--sq"];

/** Throwable rail of photos; tap one for a full-screen lightbox. */
export default function EventGallery({ event }: EventGalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  const images = useMemo(
    () =>
      parseEventGallery(event.gallery)
        .map((path) => storageUrl("event-media", path))
        .filter((url): url is string => Boolean(url)),
    [event.gallery],
  );

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <Section theme="purple" className="evg" ariaLabelledby="evg-title">
        <div className="wrap">
          <SectionHead
            id="evg-title"
            kicker={EVENT_GALLERY.kicker}
            title={EVENT_GALLERY.title}
            size="xl"
            intro={<span className="evg-count nums">{String(images.length).padStart(2, "0")}</span>}
          />
        </div>
        <DragRail ariaLabel={EVENT_GALLERY.railLabel} className="evg-rail">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={`evg-item ${SHAPES[index % SHAPES.length]}`}
              onClick={() => setActive(index)}
              data-cursor="Open"
            >
              <Media src={image} alt={`${event.title} ${index + 1}`} className="evg-media" parallax={0} reveal="iris" />
            </button>
          ))}
        </DragRail>
      </Section>

      {active !== null ? (
        <Lightbox images={images} index={active} title={event.title} onIndex={setActive} onClose={() => setActive(null)} />
      ) : null}
    </>
  );
}

type LightboxProps = {
  images: string[];
  index: number;
  title: string;
  onIndex: (i: number) => void;
  onClose: () => void;
};

function Lightbox({ images, index, title, onIndex, onClose }: LightboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const engine = useMotionEngine();
  const count = images.length;

  const go = useCallback((dir: number) => onIndex((index + dir + count) % count), [index, count, onIndex]);

  useEffect(() => {
    const el = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    engine.lenis.current?.stop();
    closeRef.current?.focus();
    if (el && !prefersReducedMotion()) {
      gsap.fromTo(el, { clipPath: "inset(50% 0% 50% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "sg.inOut" });
    }
    return () => {
      engine.lenis.current?.start();
      previous?.focus?.({ preventScroll: true });
    };
  }, [engine]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  useEffect(() => {
    const img = ref.current?.querySelector(".evlb-img");
    if (!img || prefersReducedMotion()) return;
    gsap.fromTo(img, { opacity: 0, scale: 0.94, clipPath: "inset(8% 8% 8% 8% round 24px)" }, {
      opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 0.8,
    });
  }, [index]);

  return (
    <div ref={ref} className="evlb theme-night" role="dialog" aria-modal="true" aria-label={title} onClick={onClose} data-lenis-prevent>
      <div className="evlb-bar" onClick={(e) => e.stopPropagation()}>
        <span className="evlb-count nums">{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
        <button ref={closeRef} type="button" className="evlb-close" onClick={onClose} aria-label={EVENT_GALLERY.close} data-cursor="Close">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
        </button>
      </div>
      <figure className="evlb-stage" onClick={(e) => e.stopPropagation()}>
        <img key={images[index]} className="evlb-img" src={images[index]} alt={`${title} ${index + 1}`} />
      </figure>
      {count > 1 ? (
        <div className="evlb-nav" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => go(-1)} aria-label={EVENT_GALLERY.prev} data-cursor="Prev">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
          </button>
          <button type="button" onClick={() => go(1)} aria-label={EVENT_GALLERY.next} data-cursor="Next">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
