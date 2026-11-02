import { useEffect } from "react";
import { ScrollTrigger } from "./gsap";
import type { Theme } from "./Section";
import { applyTheme } from "./theme";

const SELECTOR = ".motion-route:not([inert]) [data-theme]";

/**
 * Watches every [data-theme] section on the live route and tweens the
 * page palette to whichever section owns the viewport's middle. Rebuilds
 * whenever the set of sections changes (route swap, async content).
 */
export default function ThemeController() {
  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    let known: HTMLElement[] = [];
    let timer: ReturnType<typeof setTimeout> | undefined;

    const build = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
      const same = sections.length === known.length && sections.every((s, i) => s === known[i]);
      if (same) return;
      known = sections;
      triggers.forEach((t) => t.kill());
      triggers = sections.map((section) => {
        const theme = (section.dataset.theme as Theme) ?? "paper";
        return ScrollTrigger.create({
          trigger: section,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) applyTheme(theme);
          },
        });
      });
      // Settle immediately on whatever is under the centre right now.
      const mid = window.innerHeight / 2;
      const owner = sections.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      }) ?? sections[0];
      if (owner) applyTheme((owner.dataset.theme as Theme) ?? "paper", true);
    };

    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(build, 60);
    };

    ScrollTrigger.addEventListener("refresh", schedule);
    window.addEventListener("sg:route-mounted", schedule);
    schedule();

    return () => {
      clearTimeout(timer);
      ScrollTrigger.removeEventListener("refresh", schedule);
      window.removeEventListener("sg:route-mounted", schedule);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
