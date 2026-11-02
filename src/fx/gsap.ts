import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(
  ScrollTrigger,
  CustomEase,
  ScrambleTextPlugin,
  Draggable,
  InertiaPlugin,
  Flip,
);

/* House eases — one family so every movement feels related. */
CustomEase.create("sg.out", "0.16, 1, 0.3, 1");
CustomEase.create("sg.inOut", "0.76, 0, 0.24, 1");
CustomEase.create("sg.snap", "0.25, 1, 0.5, 1");
CustomEase.create("sg.punch", "M0,0 C0.12,0.6 0.2,1.08 0.42,1.04 0.62,1 0.8,1 1,1");

gsap.defaults({ ease: "sg.out", duration: 1 });

ScrollTrigger.config({ ignoreMobileResize: true });

export function prefersReducedMotion() {
  return typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isTouchDevice() {
  return typeof window !== "undefined"
    && window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

export { gsap, ScrollTrigger, Draggable, Flip };
