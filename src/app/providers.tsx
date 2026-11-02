import type { ReactNode } from "react";
import SmoothScroll from "../components/motion/SmoothScroll";

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmoothScroll>{children}</SmoothScroll>;
}
