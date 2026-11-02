import { useRef } from "react";
import { CountUp, Split, gsap, onPageReady, useGsap } from "../../fx";
import { CHAPTERS_HERO } from "../../content/chapters";

type ChaptersHeroProps = {
  count: number;
  loading: boolean;
};

/**
 * Kinetic opener: the two halves of the title rise in, then pull apart
 * sideways as you scroll — one movement spreading to many places — while
 * a small orbit of chapter dots turns beside the count.
 */
export default function ChaptersHero({ count, loading }: ChaptersHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const dots = Math.max(count, 3);

  useGsap(({ reduced, scope }) => {
    if (reduced) return undefined;
    const fades = scope.querySelectorAll<HTMLElement>(".chx-hero-fade");
    const orbit = scope.querySelector<HTMLElement>(".chx-orbit");
    gsap.set(fades, { opacity: 0, y: 28 });
    if (orbit) gsap.set(orbit, { scale: 0.6, opacity: 0, rotate: -40 });

    const stop = onPageReady(() => {
      gsap.to(fades, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09, delay: 0.7 });
      if (orbit) gsap.to(orbit, { scale: 1, opacity: 1, rotate: 0, duration: 2, ease: "sg.out", delay: 0.4 });
    });

    const st = { trigger: scope, start: "top top", end: "bottom top", scrub: true };
    gsap.to(".chx-title-top", { xPercent: -14, ease: "none", scrollTrigger: st });
    gsap.to(".chx-title-bottom", { xPercent: 12, ease: "none", scrollTrigger: st });
    if (orbit) gsap.to(orbit, { rotate: 120, scale: 1.25, ease: "none", scrollTrigger: st });
    return stop;
  }, [], ref);

  return (
    <section ref={ref} className="chx-hero" data-theme="paper" aria-labelledby="chx-title">
      <div className="wrap chx-hero-inner">
        <p className="kicker chx-hero-fade">{CHAPTERS_HERO.kicker}</p>

        <h1 id="chx-title" className="chx-title">
          <span className="sr-only">{`${CHAPTERS_HERO.titleTop} ${CHAPTERS_HERO.titleBottom}`}</span>
          <span className="chx-title-top" aria-hidden="true">
            <Split as="span" text={CHAPTERS_HERO.titleTop} by="chars" trigger="load" className="t-mega" />
          </span>
          <span className="chx-title-bottom" aria-hidden="true">
            <Split as="span" text={CHAPTERS_HERO.titleBottom} by="chars" trigger="load" delay={0.25} className="chx-title-alt" />
          </span>
        </h1>

        <div className="chx-hero-foot">
          <p className="t-lead chx-hero-intro chx-hero-fade">{CHAPTERS_HERO.intro}</p>

          <div className="chx-count chx-hero-fade" aria-live="polite">
            {loading ? (
              <span className="chx-count-n chx-count-wait skeleton" aria-label="Loading" />
            ) : (
              <CountUp className="chx-count-n" value={count} prefix={count < 10 ? "0" : ""} duration={2.4} />
            )}
            <span className="chx-count-label">{CHAPTERS_HERO.countLabel}</span>
          </div>

          <div className="chx-orbit" aria-hidden="true">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="96" />
              <circle cx="100" cy="100" r="68" />
              <circle cx="100" cy="100" r="40" />
            </svg>
            {Array.from({ length: dots }, (_, i) => (
              <span
                key={i}
                className="chx-orbit-dot"
                style={{
                  ["--a" as string]: `${(360 / dots) * i}deg`,
                  ["--r" as string]: `${[48, 34, 20][i % 3]}%`,
                  ["--d" as string]: `${18 + (i % 3) * 7}s`,
                }}
              />
            ))}
            <span className="chx-orbit-core" />
          </div>
        </div>

        <div className="chx-cue chx-hero-fade">
          <span>{CHAPTERS_HERO.scrollCue}</span>
          <span className="chx-cue-arrow" aria-hidden="true">↓</span>
        </div>
      </div>
    </section>
  );
}
