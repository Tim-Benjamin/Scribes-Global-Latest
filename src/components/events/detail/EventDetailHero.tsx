import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Section, Split, gsap, onPageReady, useGsap } from "../../../fx";
import { EVENT_DETAIL_HERO, EVENT_OVERVIEW } from "../../../content/events";
import { formatEventRange } from "../../../lib/events/format";
import { sentenceLabel } from "../../../lib/events/groups";
import {
  formatEventTime,
  getEventDisplayStatus,
  type EventItem,
} from "../../../lib/supabase/queries/events";
import { storageUrl } from "../../../lib/supabase/storage";

type EventDetailHeroProps = {
  event: EventItem;
};

/** Long titles step down so the longest word still fits one line. */
function titleSize(title: string) {
  const longestWord = Math.max(...title.split(/\s+/).map((w) => w.length));
  const total = title.length;
  if (total <= 12 && longestWord <= 8) return "evd-title--xl";
  if (total <= 28 && longestWord <= 10) return "evd-title--lg";
  if (total <= 48 && longestWord <= 13) return "evd-title--md";
  return "evd-title--sm";
}

/**
 * Event hero: the title in giant type, a ruled meta strip, then the
 * event picture opening from a narrow slot to full bleed on scroll.
 */
export default function EventDetailHero({ event }: EventDetailHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const image = storageUrl("event-media", event.hero_image);
  const [failed, setFailed] = useState<string | null>(null);
  const showImage = Boolean(image) && failed !== image;
  const status = getEventDisplayStatus(event);
  const F = EVENT_OVERVIEW.facts;

  useGsap(({ reduced, scope }) => {
    const fades = scope.querySelectorAll<HTMLElement>(".evd-fade");
    const strip = scope.querySelectorAll<HTMLElement>(".evd-strip > div");
    const pic = scope.querySelector<HTMLElement>(".evd-pic");
    const img = scope.querySelector<HTMLElement>(".evd-pic-img");
    if (reduced) return undefined;

    gsap.set(fades, { opacity: 0, y: 24 });
    gsap.set(strip, { opacity: 0, y: 30 });
    if (pic) gsap.set(pic, { clipPath: "inset(18% 30% 0% 30% round 400px)" });

    const stop = onPageReady(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(fades, { opacity: 1, y: 0, stagger: 0.07, duration: 0.9 }, 0.2)
        .to(strip, { opacity: 1, y: 0, stagger: 0.08, duration: 1 }, 0.55);
      if (pic) tl.to(pic, { clipPath: "inset(0% 12% 0% 12% round 400px)", duration: 1.6, ease: "sg.inOut" }, 0.4);
      if (img) tl.fromTo(img, { scale: 1.5 }, { scale: 1.15, duration: 2.2, ease: "sg.out" }, 0.4);
    });

    if (pic) {
      gsap.fromTo(pic, { clipPath: "inset(0% 12% 0% 12% round 400px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: pic, start: "top 80%", end: "top 10%", scrub: true },
      });
    }
    if (img) {
      gsap.to(img, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: pic, start: "top bottom", end: "bottom top", scrub: true },
      });
    }
    gsap.to(scope.querySelector(".evd-title"), {
      yPercent: -18,
      ease: "none",
      scrollTrigger: { trigger: scope, start: "top top", end: "45% top", scrub: true },
    });
    return stop;
  }, [event.id], ref);

  const endTime = event.end_date ? formatEventTime(event.end_date) : null;

  return (
    <Section ref={ref} theme="paper" flush className="evd-hero" ariaLabelledby="evd-title">
      <div className="wrap evd-top evd-fade">
        <Link to="/events" className="evd-back" data-cursor="Back">
          <span aria-hidden="true">←</span>
          <span className="roll" data-text={EVENT_DETAIL_HERO.back}>{EVENT_DETAIL_HERO.back}</span>
        </Link>
        <span className="evd-brand">{EVENT_DETAIL_HERO.brand}</span>
        <span className={`ev-status ev-status--${status}`}>{sentenceLabel(status)}</span>
      </div>

      <div className="wrap evd-head">
        {event.event_type ? <p className="kicker evd-fade">{sentenceLabel(event.event_type)}</p> : null}
        <Split as="h1" id="evd-title" text={event.title} by="chars" trigger="load" effect="rise" stagger={0.02} className={`evd-title ${titleSize(event.title)}`} />
      </div>

      <dl className="wrap evd-strip">
        <div>
          <dt>{F.date}</dt>
          <dd className="nums">{formatEventRange(event.start_date, event.end_date)}</dd>
        </div>
        <div>
          <dt>{F.start}</dt>
          <dd className="nums">
            {formatEventTime(event.start_date)}
            {endTime ? <span className="evd-strip-soft"> – {endTime}</span> : null}
          </dd>
        </div>
        {event.location ? (
          <div className="evd-strip-wide">
            <dt>{F.location}</dt>
            <dd>{event.location}</dd>
          </div>
        ) : null}
        <div>
          <dt>{F.status}</dt>
          <dd>{sentenceLabel(status)}</dd>
        </div>
      </dl>

      <div className="evd-pic">
        {showImage ? (
          <img className="evd-pic-img" src={image ?? undefined} alt={event.title} onError={() => setFailed(image)} />
        ) : (
          <div className="evd-pic-img media-fallback" role="img" aria-label={event.title}>
            <span className="evd-pic-letter" aria-hidden="true">{event.title.charAt(0)}</span>
          </div>
        )}
        <span className="evd-pic-cue">{EVENT_DETAIL_HERO.scrollCue}</span>
      </div>
    </Section>
  );
}
