import type { MotionProfile } from "./tokens";
export const homeMotion: MotionProfile = {
  name: "home", color: "#4e0d85", accent: "#1ebcf9",
  cameraZ: 5.2, shape: 0, rotation: 0.06,
  // Hero (purple/blue) -> videos & social (blue leading) -> newsletter/footer (magenta, grounded by purple).
  sections: [
    { at: 0, color: "#4e0d85", accent: "#1ebcf9" },
    { at: 0.4, color: "#1ebcf9", accent: "#c538bf" },
    { at: 1, color: "#c538bf", accent: "#4e0d85" },
  ],
};
