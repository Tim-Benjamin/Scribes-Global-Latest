import { useEffect, useRef } from "react";
import { gsap, isTouchDevice, prefersReducedMotion } from "./gsap";

/**
 * Two-part cursor: a precise dot plus a lagging disc that swells
 * into a labelled bubble over anything carrying data-cursor="Label",
 * and tightens over plain links and buttons. Movement never touches
 * React state.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const disc = discRef.current;
    const label = labelRef.current;
    if (!dot || !disc || !label || isTouchDevice() || prefersReducedMotion()) return undefined;

    document.documentElement.classList.add("has-cursor");
    gsap.set([dot, disc], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });
    const cx = gsap.quickTo(disc, "x", { duration: 0.55, ease: "power3.out" });
    const cy = gsap.quickTo(disc, "y", { duration: 0.55, ease: "power3.out" });

    let mode = "";
    const setMode = (next: string, text = "") => {
      if (next === mode && label.textContent === text) return;
      mode = next;
      label.textContent = text;
      disc.dataset.mode = next;
      dot.dataset.mode = next;
    };

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      cx(e.clientX);
      cy(e.clientY);
    };

    const over = (e: Event) => {
      const t = e.target instanceof Element ? e.target : null;
      if (!t) return;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled && labelled.dataset.cursor) {
        setMode("label", labelled.dataset.cursor);
        return;
      }
      if (t.closest("a, button, [role='button'], label, select, summary")) {
        setMode("link");
        return;
      }
      if (t.closest("input, textarea")) {
        setMode("text");
        return;
      }
      setMode("");
    };

    const down = () => gsap.to(disc, { scale: 0.8, duration: 0.2 });
    const up = () => gsap.to(disc, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    const leave = () => gsap.to([dot, disc], { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to([dot, disc], { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={discRef} className="cursor-disc">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
