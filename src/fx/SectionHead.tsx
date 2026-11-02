import type { ReactNode } from "react";
import Split from "./Split";
import Reveal from "./Reveal";

interface SectionHeadProps {
  /** Short section name. Skip it when the heading already says enough. */
  kicker?: string;
  title: string;
  intro?: ReactNode;
  /** Right-aligned slot, e.g. a "see all" button. */
  action?: ReactNode;
  className?: string;
  size?: "lg" | "xl";
  as?: "h1" | "h2" | "h3";
  id?: string;
}

export default function SectionHead({
  kicker, title, intro, action, className, size = "lg", as = "h2", id,
}: SectionHeadProps) {
  return (
    <header className={`shead shead--${size} ${className ?? ""}`}>
      <div className="shead-main">
        {kicker ? <Reveal><p className="kicker">{kicker}</p></Reveal> : null}
        <Split as={as} id={id} text={title} className={size === "xl" ? "t-display" : "t-h1"} effect="tilt" />
      </div>
      {intro || action ? (
        <Reveal className="shead-side" stagger={0.1}>
          {intro ? <div className="shead-intro t-lead">{intro}</div> : null}
          {action ? <div className="shead-action">{action}</div> : null}
        </Reveal>
      ) : null}
    </header>
  );
}
