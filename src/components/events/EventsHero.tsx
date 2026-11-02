import { useRef } from "react";
import { Badge, CountUp, Marquee, Section, Split, gsap, onPageReady, useGsap } from "../../fx";
import { EVENTS_HERO } from "../../content/events";

type EventsHeroProps = {
  upcomingCount: number;
  totalCount: number;
  loading: boolean;
};

/**
 * Kinetic hero: three stacked words (solid / outline / italic) that
 * shear apart sideways as you scroll, over a velocity marquee of the
 * ministry's three verbs.
 */
export default function EventsHero({ upcomingCount, totalCount, loading }: EventsHeroProps) {
  const ref = useRef<HTMLElement>(null);

  useGsap(({ reduced, scope }) => {
    const fades = scope.querySelectorAll<HTMLElement>(".evh-fade");
    if (reduced) return undefined;
    gsap.set(fades, { opacity: 0, y: 26 });
    const stop = onPageReady(() => {
      gsap.to(fades, { opacity: 1, y: 0, stagger: 0.08, duration: 1, delay: 0.75 });
    });
    const lines = scope.querySelectorAll<HTMLElement>(".evh-line");
    const travel = [-14, 12, -22];
    lines.forEach((line, i) => {
      gsap.to(line, {
        xPercent: travel[i] ?? 0,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
      });
    });
    gsap.to(scope.querySelector(".evh-dot"), {
      scale: 7,
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: scope, start: "top top", end: "60% top", scrub: true },
    });
    return stop;
  }, [], ref);

  return (
    <Section ref={ref} theme="paper" flush className="evh" ariaLabelledby="evh-title">
      <div className="wrap evh-top evh-fade">
        <span className="evh-brand">{EVENTS_HERO.brand}</span>
        <p className="kicker">{EVENTS_HERO.kicker}</p>
      </div>

      <h1 id="evh-title" className="sr-only">{EVENTS_HERO.titleLines.join(" ")}</h1>
      <div className="evh-title" aria-hidden="true">
        {EVENTS_HERO.titleLines.map((line, i) => (
          <div key={line} className={`evh-line evh-line--${i + 1}`}>
            <Split as="span" text={line} by="chars" trigger="load" effect={i === 1 ? "drop" : "rise"} delay={i * 0.12} className="evh-word" />
            {i === 0 ? <span className="evh-dot" /> : null}
          </div>
        ))}
      </div>

      <div className="wrap evh-foot">
        <p className="evh-intro t-lead evh-fade">{EVENTS_HERO.intro}</p>
        <dl className="evh-stats evh-fade">
          <div>
            <dt>{EVENTS_HERO.statUpcoming}</dt>
            <dd className="nums">{loading ? "··" : <CountUp value={upcomingCount} duration={1.4} />}</dd>
          </div>
          <div>
            <dt>{EVENTS_HERO.statTotal}</dt>
            <dd className="nums">{loading ? "··" : <CountUp value={totalCount} duration={1.6} />}</dd>
          </div>
        </dl>
        <a className="evh-cue evh-fade" href="#ev-explorer" data-cursor="Explore">
          <Badge text={`${EVENTS_HERO.scrollCue} ✦ ${EVENTS_HERO.scrollCue} ✦ `}>
            <span className="evh-cue-arrow" aria-hidden="true">↓</span>
          </Badge>
          <span className="sr-only">{EVENTS_HERO.scrollCue}</span>
        </a>
      </div>

      <div className="evh-band">
        <Marquee speed={70}>
          {EVENTS_HERO.values.map((v, i) => (
            <span key={v} className={`evh-band-word evh-band-word--${i + 1}`}>
              {v}
              <svg className="evh-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
            </span>
          ))}
        </Marquee>
      </div>
    </Section>
  );
}
