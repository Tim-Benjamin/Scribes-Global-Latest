import { useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Marquee, gsap, onPageReady, useGsap } from "../../../fx";
import type { ActiveChapterItem } from "../../../lib/supabase/queries/chapters";
import { CHAPTER_HERO } from "../../../content/chapters";
import { chapterHero, chapterLogo } from "../chapterMedia";

type ChapterHeroProps = {
  chapter: ActiveChapterItem;
};

/**
 * The chapter's name is cut out of its own photograph. Scrolling opens
 * the cut-out: the paper falls away, the letters swell, and the full
 * picture is left standing edge to edge.
 */
export default function ChapterHero({ chapter }: ChapterHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const hero = chapterHero(chapter);
  const logo = chapterLogo(chapter);
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(hero) && !failed;
  const words = chapter.name.trim().split(/\s+/);
  const longest = Math.max(...words.map((w) => w.length), 3);

  useGsap(({ reduced, scope }) => {
    const chars = scope.querySelectorAll<HTMLElement>(".chd-knock .sc");
    const fades = scope.querySelectorAll<HTMLElement>(".chd-fade");
    const frame = scope.querySelector<HTMLElement>(".chd-mask");
    const knock = scope.querySelector<HTMLElement>(".chd-knock");
    const word = scope.querySelector<HTMLElement>(".chd-knock-word");
    const img = scope.querySelector<HTMLElement>(".chd-mask-img");
    if (reduced || !frame || !knock || !word) return undefined;

    gsap.set(chars, { yPercent: 110 });
    gsap.set(fades, { opacity: 0, y: 24 });
    const stop = onPageReady(() => {
      gsap.timeline()
        .to(chars, { yPercent: 0, duration: 1.3, stagger: 0.05, ease: "sg.out" })
        .to(fades, { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.5)
        .fromTo(img, { scale: 1.35 }, { scale: 1.08, duration: 2.2, ease: "sg.out" }, 0);
    });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: frame,
          start: "top 14%",
          end: () => `+=${window.innerHeight * 0.9}`,
          pin: scope.querySelector(".chd-pinwrap"),
          scrub: 0.8,
          anticipatePin: 1,
        },
      });
      tl.to(word, { scale: 1.35, ease: "power2.in", duration: 1 }, 0)
        .to(knock, { backgroundColor: "rgba(242, 240, 244, 0)", ease: "power1.in", duration: 0.8 }, 0.15)
        .to(frame, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 }, 0)
        .to(img, { scale: 1, duration: 1 }, 0);
    });
    mm.add("(max-width: 899px)", () => {
      gsap.to(knock, {
        backgroundColor: "rgba(242, 240, 244, 0.25)",
        ease: "none",
        scrollTrigger: { trigger: frame, start: "top 20%", end: "bottom 20%", scrub: true },
      });
    });

    return () => {
      stop();
      mm.revert();
    };
  }, [chapter.id, showImage], ref);

  return (
    <section ref={ref} className="chd-hero" data-theme="paper" aria-labelledby="chd-title">
      <div className="chd-hero-top wrap">
        <Link to="/chapters" className="chd-back chd-fade" data-cursor="Back">
          <span aria-hidden="true">←</span>
          <span className="roll" data-text={CHAPTER_HERO.back}>{CHAPTER_HERO.back}</span>
        </Link>
        <span className={`chd-badge chd-fade ${chapter.is_campus ? "is-campus" : ""}`}>
          {chapter.is_campus ? CHAPTER_HERO.campusBadge : CHAPTER_HERO.chapterBadge}
        </span>
      </div>

      <div className="chd-pinwrap">
        <div className="chd-mask">
          {showImage ? (
            <img className="chd-mask-img" src={hero ?? undefined} alt="" onError={() => setFailed(true)} />
          ) : (
            <div className="chd-mask-img media-fallback" />
          )}
          <div className="chd-knock" aria-hidden="true">
            <span className="chd-knock-word" style={{ "--n": longest } as CSSProperties}>
              {words.map((w, wi) => (
                <span className="sw" key={wi}>
                  <span className="sw-i">
                    {Array.from(w).map((c, ci) => <span className="sc" key={ci}>{c}</span>)}
                  </span>
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className="chd-hero-under wrap">
        <div className="chd-hero-id">
          {logo ? (
            <span className="chd-logo chd-fade"><img src={logo} alt={`${chapter.name} logo`} /></span>
          ) : null}
          <div>
            <p className="chd-loc chd-fade">{chapter.location}</p>
            <h1 id="chd-title" className="chd-name chd-fade">{chapter.name}</h1>
            {chapter.campus_university ? <p className="chd-uni chd-fade">{chapter.campus_university}</p> : null}
          </div>
        </div>
        <span className="chd-scroll chd-fade" aria-hidden="true">
          {CHAPTER_HERO.scroll} <span className="chd-scroll-arrow">↓</span>
        </span>
      </div>

      <div className="chd-values">
        <Marquee speed={60} repeat={4} ariaLabel={CHAPTER_HERO.values.join(", ")}>
          {CHAPTER_HERO.values.map((v) => (
            <span className="chd-value" key={v}>
              {v}
              <span className="chd-value-star" aria-hidden="true">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
