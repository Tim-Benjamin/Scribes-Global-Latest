import { forwardRef, type CSSProperties, type ReactNode } from "react";

export type Theme = "paper" | "night" | "purple" | "magenta" | "cyan";

interface SectionProps {
  theme?: Theme;
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Remove default vertical padding. */
  flush?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
}

/**
 * Page section. Its theme is applied to the WHOLE page (background
 * and text colour tween together) while it holds the viewport centre.
 */
const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { theme = "paper", id, className, style, children, flush = false, ariaLabel, ariaLabelledby },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      data-theme={theme}
      className={`${flush ? "" : "section"} ${className ?? ""}`}
      style={style}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      {children}
    </section>
  );
});

export default Section;
