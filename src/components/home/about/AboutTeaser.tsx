import { Link } from "react-router-dom";

import Reveal from "../../animation/Reveal";
import TextReveal from "../../animation/TextReveal";
import Magnetic from "../../animation/Magnetic";

import "./about-teaser.css";

/*
 * Source content note:
 * The description and stat line below are condensed, verbatim figures
 * and phrasing pulled from the full About page (src/pages/About/About.tsx)
 * — nothing here is new or invented copy.
 */
export default function AboutTeaser() {
  return (
    <section className="about-teaser" id="about-teaser">
      <div className="about-teaser__container">
        <Reveal>
          <p className="about-teaser__eyebrow">
            Who we are
          </p>
        </Reveal>

        <h2 className="about-teaser__title">
          <TextReveal delay={0.05}>
            A community of creatives,
          </TextReveal>{" "}
          <TextReveal
            delay={0.2}
            className="about-teaser__title-accent"
          >
            since 2017.
          </TextReveal>
        </h2>

        <Reveal delay={0.3}>
          <p className="about-teaser__description">
            A non-profit, non-denominational evangelistic
            ministry preaching the gospel through creative
            arts — poetry, music, and spoken word.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="about-teaser__meta">
            100+ members worldwide · Founded 2017 · 3 ministries
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <Magnetic
            strength={0.22}
            className="about-teaser__cta-wrap"
          >
            <Link
              to="/about"
              className="about-teaser__cta"
              data-cursor="VIEW"
            >
              <span>Discover our full story</span>
              <span
                className="about-teaser__cta-arrow"
                aria-hidden="true"
              >
                ↗
              </span>
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
