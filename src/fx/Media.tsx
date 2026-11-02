import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { gsap } from "./gsap";
import { useGsap } from "./useGsap";

interface MediaProps {
  src?: string | null;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** Parallax travel in percent of the frame height. 0 disables. */
  parallax?: number;
  /** Clip-path wipe in when it enters. */
  reveal?: "up" | "left" | "iris" | "none";
  /** Aspect ratio like "4 / 5". Omit to size from CSS. */
  ratio?: string;
  children?: ReactNode;
  eager?: boolean;
  cursor?: string;
}

/**
 * An image inside a clipping frame: wipes open on enter, then drifts
 * against the scroll. Falls back to a brand-gradient field when the
 * image is missing or fails to load, so layouts never collapse.
 */
export default function Media({
  src,
  alt,
  className,
  style,
  parallax = 12,
  reveal = "up",
  ratio,
  children,
  eager = false,
  cursor,
}: MediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  useGsap(({ reduced, scope }) => {
    if (reduced) return;
    const img = scope.querySelector<HTMLElement>(".media-img");

    if (reveal !== "none") {
      const from = {
        up: "inset(100% 0% 0% 0%)",
        left: "inset(0% 100% 0% 0%)",
        iris: "inset(18% 18% 18% 18% round 40px)",
      }[reveal];
      gsap.fromTo(
        scope,
        { clipPath: from },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          duration: 1.5,
          ease: "sg.inOut",
          scrollTrigger: { trigger: scope, start: "top 90%", once: true },
          clearProps: "clipPath",
        },
      );
      if (img) {
        gsap.fromTo(img, { scale: 1.35 }, {
          scale: 1.12,
          duration: 1.8,
          ease: "sg.out",
          scrollTrigger: { trigger: scope, start: "top 90%", once: true },
        });
      }
    }

    if (parallax && img) {
      if (reveal === "none") gsap.set(img, { scale: 1.12 });
      gsap.fromTo(
        img,
        { yPercent: -parallax / 2 },
        {
          yPercent: parallax / 2,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }
  }, [src, showImage, parallax, reveal], ref);

  return (
    <div
      ref={ref}
      className={`media ${className ?? ""}`}
      style={{ ...(ratio ? { aspectRatio: ratio } : null), ...style }}
      data-cursor={cursor}
    >
      {showImage ? (
        <img
          className="media-img"
          src={src ?? undefined}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : (
        <div className="media-img media-fallback" role="img" aria-label={alt} />
      )}
      {children}
    </div>
  );
}
