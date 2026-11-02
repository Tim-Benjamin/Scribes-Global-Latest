import { useMotionEngine } from "../components/motion/motion-context";
/** Consumes the shared instance instead of creating another scroll loop. */
export function useLenis() {
  return useMotionEngine().lenis;
}
