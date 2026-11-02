import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../fx";

export type FilterOption<T extends string> = {
  value: T;
  label: string;
  count: number;
};

type EventsFilterProps<T extends string> = {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
};

/** Pill tabs; a solid lozenge slides (and stretches) to the active one. */
export default function EventsFilter<T extends string>({ options, value, onChange, label }: EventsFilterProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const firstRef = useRef(true);

  const key = options.map((o) => `${o.value}:${o.count}`).join("|");

  useLayoutEffect(() => {
    const root = rootRef.current;
    const pill = pillRef.current;
    if (!root || !pill) return undefined;
    const place = (animate: boolean) => {
      const active = root.querySelector<HTMLElement>(`[data-value="${value}"]`);
      if (!active) return;
      const vars = { x: active.offsetLeft, width: active.offsetWidth, height: active.offsetHeight, y: active.offsetTop };
      if (!animate || prefersReducedMotion()) {
        gsap.set(pill, vars);
        return;
      }
      gsap.timeline()
        .to(pill, { ...vars, duration: 0.7, ease: "sg.out" })
        .fromTo(pill, { scaleY: 0.82 }, { scaleY: 1, duration: 0.6, ease: "back.out(2)" }, 0.05);
      const scroller = root.parentElement;
      if (scroller && scroller.scrollWidth > scroller.clientWidth) {
        scroller.scrollTo({ left: active.offsetLeft - scroller.clientWidth / 2 + active.offsetWidth / 2, behavior: "smooth" });
      }
    };
    place(!firstRef.current);
    firstRef.current = false;
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    // Fonts can shift widths after first paint.
    void document.fonts?.ready.then(() => place(false));
    return () => window.removeEventListener("resize", onResize);
  }, [value, key]);

  return (
    <div className="evx-tabs" role="group" aria-label={label} data-lenis-prevent-touch>
      <div ref={rootRef} className="evx-tabs-track">
        <span ref={pillRef} className="evx-tabs-pill" aria-hidden="true" />
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            data-value={option.value}
            className={`evx-tab ${option.value === value ? "is-active" : ""}`}
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            <span className="evx-tab-label">{option.label}</span>
            <span className="evx-tab-count nums">{option.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
