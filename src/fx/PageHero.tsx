import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "./gsap";
import { useGsap } from "./useGsap";
import { onPageReady } from "./ready";
import Split from "./Split";
import Badge from "./Badge";

interface PageHeroProps {
  /** Big title. "\n" splits lines; each line can be offset for rhythm. */
  title: string;
  kicker?: string;
  intro?: ReactNode;
  image?: string | null;
  imageAlt?: string;
  actions?: ReactNode;
  /**
   * type  — giant stacked title, picture slides up under it and widens on scroll
   * split — title left, tall picture right that tilts in
   * mask  — the title is cut out of the picture (text knock-out)
   */
  variant?: "type" | "split" | "mask";
  /** Text for the spinning scroll badge. */
  badge?: string;
  /** Extra bits under the intro (meta, stats). */
  children?: ReactNode;
  className?: string;
}

/**
 * Hero used by every inner page. Characters rise on arrival; on scroll
 * the title drifts up and loosens while the picture keeps moving.
 */
export default function PageHero({
  title,
  kicker,
  intro,
  image,
  imageAlt = "",
  actions,
  variant = "type",
  badge = "Scroll to explore ✦ Scroll to explore ✦ ",
  children,
  className,
}: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);

  useGsap(({ reduced, scope }) => {
    const fades = scope.querySelectorAll<HTMLElement>(".ph-fade");
    const picture = scope.querySelector<HTMLElement>(".ph-picture");
    const img = scope.querySelector<HTMLElement>(".ph-picture img, .ph-picture .media-fallback");
    if (reduced) return undefined;

    gsap.set(fades, { opacity: 0, y: 30 });
    if (picture) {
      gsap.set(picture, variant === "split"
        ? { clipPath: "inset(100% 0% 0% 0% round 0px)" }
        : { clipPath: "inset(30% 12% 0% 12% round 32px)", yPercent: 18 });
    }

    const stop = onPageReady(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(fades, { opacity: 1, y: 0, stagger: 0.08, duration: 1 }, 0.55);
      if (picture) {
        tl.to(picture, {
          clipPath: variant === "split" ? "inset(0% 0% 0% 0% round 0px)" : "inset(0% 4% 0% 4% round 32px)",
          yPercent: 0,
          duration: 1.6,
          ease: "sg.inOut",
        }, 0.25);
        if (img) tl.fromTo(img, { scale: 1.4 }, { scale: 1.1, duration: 2, ease: "sg.out" }, 0.25);
      }
    });

    // Scroll: title rises and spreads, picture widens to full bleed.
    gsap.to(scope.querySelector(".ph-title"), {
      yPercent: -25,
      letterSpacing: "-0.02em",
      ease: "none",
      scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
    });
    if (picture && variant === "type") {
      gsap.to(picture, {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "none",
        scrollTrigger: { trigger: picture, start: "top 85%", end: "top 15%", scrub: true },
      });
    }
    if (img) {
      gsap.to(img, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: picture, start: "top bottom", end: "bottom top", scrub: true },
      });
    }
    return stop;
  }, [variant, image], ref);

  // Longest single word drives the title size so heavy display type never
  // has to break inside a word (e.g. "MINISTRIES" in a half-width column).
  const longest = Math.max(4, ...title.split(/\s+/).map((w) => w.length));
  const fitStyle = { "--ph-longest": longest } as CSSProperties;

  const picture = (
    <div className="ph-picture">
      {image ? <img src={image} alt={imageAlt} loading="eager" /> : <div className="media-fallback" role="img" aria-label={imageAlt} />}
    </div>
  );

  if (variant === "mask") {
    return (
      <section ref={ref} className={`ph ph--mask ${className ?? ""}`} data-theme="paper">
        <div className="ph-maskwrap">
          {image ? <img className="ph-maskimg" src={image} alt={imageAlt} /> : <div className="ph-maskimg media-fallback" />}
          <div className="ph-knock" aria-hidden="true">
            <Split as="span" text={title} by="chars" trigger="load" className="ph-title t-mega" effect="rise" />
          </div>
        </div>
        <h1 className="sr-only">{title.replace(/\n/g, " ")}</h1>
        <div className="ph-under wrap">
          {kicker ? <p className="kicker ph-fade">{kicker}</p> : null}
          {intro ? <div className="ph-intro t-lead ph-fade">{intro}</div> : null}
          {actions ? <div className="ph-actions ph-fade">{actions}</div> : null}
          {children ? <div className="ph-extra ph-fade">{children}</div> : null}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className={`ph ph--${variant} ${className ?? ""}`} data-theme="paper" style={fitStyle}>
      <div className="ph-head wrap">
        <div className="ph-copy">
          {kicker ? <p className="kicker ph-fade">{kicker}</p> : null}
          <Split as="h1" text={title} by="chars" trigger="load" className="ph-title t-mega" effect="rise" />
        </div>
        <div className="ph-aside">
          {intro ? <div className="ph-intro t-lead ph-fade">{intro}</div> : null}
          {actions ? <div className="ph-actions ph-fade">{actions}</div> : null}
          {children ? <div className="ph-extra ph-fade">{children}</div> : null}
          <div className="ph-badge ph-fade"><Badge text={badge}><span className="ph-badge-arrow" aria-hidden="true">↓</span></Badge></div>
        </div>
      </div>
      {variant === "split" ? <div className="ph-split-pic">{picture}</div> : picture}
    </section>
  );
}
