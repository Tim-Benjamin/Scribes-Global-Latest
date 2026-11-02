import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import Magnetic from "./Magnetic";

type Variant = "solid" | "outline" | "light" | "ghost";

interface BaseProps {
  children: string;
  variant?: Variant;
  size?: "md" | "lg";
  className?: string;
  cursor?: string;
  magnetic?: boolean;
  icon?: ReactNode;
}

type RollButtonProps = BaseProps & (
  | { to: string; href?: never; onClick?: (e: ReactMouseEvent) => void; type?: never; disabled?: never }
  | { href: string; to?: never; onClick?: (e: ReactMouseEvent) => void; type?: never; disabled?: never; external?: boolean }
  | { to?: never; href?: never; onClick?: (e: ReactMouseEvent) => void; type?: "button" | "submit"; disabled?: boolean }
);

/** Fill circle grows from wherever the pointer entered. */
function trackEntry(e: ReactPointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--fx", `${e.clientX - r.left}px`);
  el.style.setProperty("--fy", `${e.clientY - r.top}px`);
}

/**
 * The site's one button. Label rolls up to a twin on hover while a
 * colour fill blooms from the pointer's entry point.
 */
export default function RollButton(props: RollButtonProps) {
  const {
    children, variant = "solid", size = "md", className, cursor, magnetic = true, icon,
  } = props;
  const cls = `rb rb--${variant} rb--${size} ${className ?? ""}`;
  const inner = (
    <>
      <span className="rb-fill" aria-hidden="true" />
      <span className="rb-label">
        <span className="rb-roll" data-text={children}>{children}</span>
      </span>
      {icon ? <span className="rb-icon" aria-hidden="true">{icon}</span> : null}
    </>
  );

  let node: ReactNode;
  if ("to" in props && props.to) {
    node = (
      <Link to={props.to} className={cls} data-cursor={cursor} onPointerEnter={trackEntry} onPointerLeave={trackEntry} onClick={props.onClick}>
        {inner}
      </Link>
    );
  } else if ("href" in props && props.href) {
    const external = "external" in props ? props.external ?? true : true;
    node = (
      <a
        href={props.href}
        className={cls}
        data-cursor={cursor}
        onPointerEnter={trackEntry}
        onPointerLeave={trackEntry}
        onClick={props.onClick}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {inner}
      </a>
    );
  } else {
    const p = props as BaseProps & { type?: "button" | "submit"; disabled?: boolean; onClick?: (e: ReactMouseEvent) => void };
    node = (
      <button
        type={p.type ?? "button"}
        disabled={p.disabled}
        className={cls}
        data-cursor={cursor}
        onPointerEnter={trackEntry}
        onPointerLeave={trackEntry}
        onClick={p.onClick}
      >
        {inner}
      </button>
    );
  }

  return magnetic ? <Magnetic strength={0.25}>{node}</Magnetic> : node;
}
