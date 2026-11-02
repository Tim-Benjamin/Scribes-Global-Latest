import { useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useGsap } from "./useGsap";

interface CountUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
  /** Compact large numbers: 12500 → 12.5K */
  compact?: boolean;
  /** Group thousands (12,500). Turn off for years. */
  separator?: boolean;
}

function format(n: number, compact: boolean, separator = true) {
  if (!compact) return separator ? Math.round(n).toLocaleString("en-US") : String(Math.round(n));
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return Math.round(n).toString();
}

export default function CountUp({
  value, suffix = "", prefix = "", className, duration = 2.2, compact = false, separator = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGsap(({ reduced, scope }) => {
    const out = scope.querySelector<HTMLElement>(".cu-n");
    if (!out || reduced) return undefined;
    const state = { n: 0 };
    out.textContent = format(0, compact, separator);
    const st = ScrollTrigger.create({
      trigger: scope,
      start: "top 90%",
      once: true,
      onEnter: () => gsap.to(state, {
        n: value,
        duration,
        ease: "power3.out",
        onUpdate: () => { out.textContent = format(state.n, compact, separator); },
      }),
    });
    return () => st.kill();
  }, [value, compact, duration, separator], ref);

  return (
    <span ref={ref} className={`nums ${className ?? ""}`} aria-label={`${prefix}${format(value, compact, separator)}${suffix}`}>
      <span aria-hidden="true">{prefix}<span className="cu-n">{format(value, compact, separator)}</span>{suffix}</span>
    </span>
  );
}
