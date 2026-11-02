import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { gsap, isTouchDevice, prefersReducedMotion } from "./gsap";

export interface HoverListItem {
  key: string;
  title: string;
  to?: string;
  href?: string;
  image?: string | null;
  /** Left-hand small text (e.g. category, date). */
  meta?: ReactNode;
  /** Right-hand small text. */
  aside?: ReactNode;
}

interface HoverListProps {
  items: HoverListItem[];
  className?: string;
  cursor?: string;
}

/**
 * Editorial index list. Hovering a row floats its image beside the
 * pointer; the image leans into the direction of travel. On touch
 * devices the image shows inline as a thumbnail instead.
 */
export default function HoverList({ items, className, cursor = "Read" }: HoverListProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const float = floatRef.current;
    if (!root || !float || isTouchDevice() || prefersReducedMotion()) return undefined;
    const xTo = gsap.quickTo(float, "x", { duration: 0.65, ease: "power3.out" });
    const yTo = gsap.quickTo(float, "y", { duration: 0.65, ease: "power3.out" });
    const rTo = gsap.quickTo(float, "rotate", { duration: 0.9, ease: "power3.out" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const float = floatRef.current;
    if (!float || prefersReducedMotion()) return;
    gsap.to(float, {
      scale: active === null ? 0 : 1,
      opacity: active === null ? 0 : 1,
      duration: 0.6,
      ease: active === null ? "power3.in" : "back.out(1.6)",
      overwrite: "auto",
    });
  }, [active]);

  return (
    <div ref={rootRef} className={`hl ${className ?? ""}`} onPointerLeave={() => setActive(null)}>
      <ul className="hl-list">
        {items.map((item, i) => {
          const content = (
            <>
              {item.image ? (
                <span className="hl-thumb" aria-hidden="true">
                  <img src={item.image} alt="" loading="lazy" />
                </span>
              ) : null}
              <span className="hl-meta">{item.meta}</span>
              <span className="hl-title">
                <span className="hl-roll" data-text={item.title}>{item.title}</span>
              </span>
              <span className="hl-aside">{item.aside}</span>
            </>
          );
          const common = {
            className: `hl-row ${active !== null && active !== i ? "is-dim" : ""}`,
            onPointerEnter: () => setActive(i),
            onFocus: () => setActive(i),
            onBlur: () => setActive(null),
            "data-cursor": cursor,
          };
          return (
            <li key={item.key}>
              {item.to ? (
                <Link to={item.to} {...common}>{content}</Link>
              ) : (
                <a href={item.href} target="_blank" rel="noreferrer noopener" {...common}>{content}</a>
              )}
            </li>
          );
        })}
      </ul>
      <div ref={floatRef} className="hl-float" aria-hidden="true">
        {items.map((item, i) => (
          <div key={item.key} className={`hl-float-img ${active === i ? "is-on" : ""}`}>
            {item.image ? <img src={item.image} alt="" /> : <div className="media-fallback" />}
          </div>
        ))}
      </div>
    </div>
  );
}
