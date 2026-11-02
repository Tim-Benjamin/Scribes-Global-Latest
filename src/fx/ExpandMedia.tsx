import { useRef, type ReactNode } from "react";
import { gsap } from "./gsap";
import { useGsap } from "./useGsap";

interface ExpandMediaProps {
  src?: string | null;
  videoSrc?: string | null;
  alt: string;
  /** Overlay content that fades in once the media is full-bleed. */
  children?: ReactNode;
  className?: string;
  /** Scroll distance of the pin, in viewport heights. */
  length?: number;
}

/**
 * Pinned moment: a small framed picture grows until it fills the
 * screen, its corners straightening as it goes; the overlay copy
 * arrives once it's full-bleed.
 */
export default function ExpandMedia({
  src, videoSrc, alt, children, className, length = 1.2,
}: ExpandMediaProps) {
  const ref = useRef<HTMLElement>(null);

  useGsap(({ reduced, scope }) => {
    if (reduced) return;
    const frame = scope.querySelector<HTMLElement>(".xm-frame");
    const media = scope.querySelector<HTMLElement>(".xm-media");
    const overlay = scope.querySelector<HTMLElement>(".xm-overlay");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scope,
        start: "top top",
        end: () => `+=${window.innerHeight * length}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
    });
    tl.fromTo(frame, { clipPath: "inset(22% 26% 22% 26% round 48px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 0px)",
      ease: "power2.inOut",
      duration: 1,
    })
      .fromTo(media, { scale: 1.45 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
      .fromTo(overlay, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.45 }, 0.62);
  }, [length], ref);

  return (
    <section ref={ref} className={`xm ${className ?? ""}`}>
      <div className="xm-frame">
        {videoSrc ? (
          <video className="xm-media" src={videoSrc} poster={src ?? undefined} autoPlay muted loop playsInline aria-label={alt} />
        ) : src ? (
          <img className="xm-media" src={src} alt={alt} loading="lazy" />
        ) : (
          <div className="xm-media media-fallback" role="img" aria-label={alt} />
        )}
        <div className="xm-shade" aria-hidden="true" />
        {children ? <div className="xm-overlay">{children}</div> : null}
      </div>
    </section>
  );
}
