import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "./gsap";
import { useMotionEngine } from "../components/motion/motion-context";

interface VideoModalProps {
  /** YouTube embed URL (already built), or null when closed. */
  embedUrl: string | null;
  title?: string;
  onClose: () => void;
}

/** Full-screen player that irises open from the centre. */
export default function VideoModal({ embedUrl, title = "Video", onClose }: VideoModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const engine = useMotionEngine();

  useEffect(() => {
    if (!embedUrl) return undefined;
    const el = ref.current;
    engine.lenis.current?.stop();
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    if (el && !prefersReducedMotion()) {
      gsap.fromTo(el, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 0.9, ease: "sg.inOut" });
      gsap.fromTo(el.querySelector(".vm-frame"), { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, delay: 0.25 });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      engine.lenis.current?.start();
      previous?.focus?.({ preventScroll: true });
    };
  }, [embedUrl, engine, onClose]);

  if (!embedUrl) return null;

  const src = `${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`;

  return (
    <div ref={ref} className="vm theme-night" role="dialog" aria-modal="true" aria-label={title} onClick={onClose} data-lenis-prevent>
      <button ref={closeRef} type="button" className="vm-close" onClick={onClose} data-cursor="Close">
        <span className="roll" data-text="Close">Close</span>
      </button>
      <div className="vm-frame" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
