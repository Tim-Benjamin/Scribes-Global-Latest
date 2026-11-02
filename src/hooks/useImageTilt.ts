import {
  useEffect,
  type RefObject,
} from "react";

export function useImageTilt(
  ref: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const element =
      ref.current;

    if (!element) return;

    const finePointer =
      window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      );

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    if (
      !finePointer.matches ||
      reducedMotion.matches
    ) {
      return;
    }

    const handleMove = (
      event: PointerEvent,
    ) => {
      const rect =
        element.getBoundingClientRect();

      const x =
        (event.clientX -
          rect.left) /
        rect.width;

      const y =
        (event.clientY -
          rect.top) /
        rect.height;

      const rotateY =
        (x - 0.5) * 5;

      const rotateX =
        (0.5 - y) * 5;

      element.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    };

    const reset = () => {
      element.style.transform =
        "";
    };

    element.addEventListener(
      "pointermove",
      handleMove,
    );

    element.addEventListener(
      "pointerleave",
      reset,
    );

    return () => {
      element.removeEventListener(
        "pointermove",
        handleMove,
      );

      element.removeEventListener(
        "pointerleave",
        reset,
      );
    };
  }, [ref]);
}