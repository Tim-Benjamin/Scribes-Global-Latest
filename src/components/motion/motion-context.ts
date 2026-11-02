import { createContext, useContext } from "react";
import type Lenis from "lenis";

type ScrollSignal = { y: number; progress: number; velocity: number; direction: number };
type RouteSignal = { pathname: string; phase: "idle" | "exit" | "enter" };

/** Mutable animation signals live outside React's render state. */
export function createMotionEngine() {
  const lenis = { current: null as Lenis | null };
  const scroll = { current: { y: 0, progress: 0, velocity: 0, direction: 0 } };
  const route = { current: { pathname: "", phase: "idle" } as RouteSignal };
  return {
    lenis,
    scroll,
    route,
    positions: new Map<string, number>(),
    setLenis(value: Lenis | null) { lenis.current = value; },
    updateScroll(value: ScrollSignal) { scroll.current = value; },
    setRoute(value: RouteSignal) { route.current = value; },
    setPhase(value: RouteSignal["phase"]) { route.current.phase = value; },
    resetVelocity() { scroll.current.velocity = 0; },
  };
}
export type MotionEngine = ReturnType<typeof createMotionEngine>;
export const MotionEngineContext = createContext<MotionEngine | null>(null);
/** Read .current in animation callbacks; scroll does not trigger React renders. */
export function useMotionEngine() {
  const engine = useContext(MotionEngineContext);
  if (!engine) throw new Error("Motion components require <SmoothScroll>.");
  return engine;
}
