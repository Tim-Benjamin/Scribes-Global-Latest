import { useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "./gsap";

type Setup = (ctx: { reduced: boolean; scope: HTMLElement }) => void | (() => void);

/**
 * Runs GSAP setup scoped to an element and reverts everything
 * (tweens, ScrollTriggers, inline styles) on unmount or when deps
 * change. Selector strings inside the setup resolve within `scope`.
 */
export function useGsap<T extends HTMLElement>(
  setup: Setup,
  deps: DependencyList = [],
  externalRef?: RefObject<T | null>,
) {
  const innerRef = useRef<T>(null);
  const ref = externalRef ?? innerRef;

  useLayoutEffect(() => {
    const scope = ref.current;
    if (!scope) return undefined;
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setup({ reduced: prefersReducedMotion(), scope });
    }, scope);
    return () => {
      if (typeof cleanup === "function") cleanup();
      ctx.revert();
    };
    // Callers list the values their setup depends on explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
