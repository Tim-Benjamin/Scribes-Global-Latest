import { homeMotion } from "./home.motion";
import { aboutMotion } from "./about.motion";
import { showcaseMotion } from "./showcase.motion";
export { EASE, SPRING, TIMING } from "./tokens";
export type { MotionProfile, MotionStop } from "./tokens";
export function getMotionProfile(pathname: string) {
  if (pathname === "/") return homeMotion;
  if (/^\/(ministries|media|project-heal|project-move)(\/|$)/.test(pathname)) {
    return showcaseMotion;
  }
  return aboutMotion;
}
