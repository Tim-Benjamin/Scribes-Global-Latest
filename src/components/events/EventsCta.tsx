import { useRef } from "react";
import { Reveal, Section, gsap, useGsap } from "../../fx";
import { EVENTS_CTA } from "../../content/events";

/**
 * Closing statement. Four lines that start scattered left and right
 * and lock into a single column as the section scrolls to centre.
 */
export default function EventsCta() {
  const ref = useRef<HTMLElement>(null);

  useGsap(({ reduced, scope }) => {
    if (reduced) return;
    const lines = scope.querySelectorAll<HTMLElement>(".evc-line");
    lines.forEach((line, i) => {
      gsap.fromTo(line, { xPercent: i % 2 ? 30 : -30, opacity: 0.15 }, {
        xPercent: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top 90%", end: "center 55%", scrub: 0.6 },
      });
    });
  }, [], ref);

  const [a, b, c, d] = EVENTS_CTA.lines;

  return (
    <Section ref={ref} theme="cyan" className="evc" ariaLabelledby="evc-title">
      <div className="wrap">
        <p className="kicker">{EVENTS_CTA.kicker}</p>
        <h2 id="evc-title" className="evc-title">
          <span className="evc-line">{a}</span>
          <span className="evc-line evc-line--strong">{b}</span>
          <span className="evc-line evc-line--small">{c}</span>
          <span className="evc-line evc-line--italic">{d}</span>
        </h2>
        <Reveal className="evc-foot">
          <p className="t-lead">{EVENTS_CTA.copy}</p>
        </Reveal>
      </div>
    </Section>
  );
}
