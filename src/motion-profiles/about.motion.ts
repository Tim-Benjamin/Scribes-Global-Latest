import type { MotionProfile } from "./tokens";
export const aboutMotion: MotionProfile = {
  name: "editorial", color: "#4e0d85", accent: "#c538bf",
  cameraZ: 6.4, shape: 0.35, rotation: 0.025,
  // Editorial arc: purple opening -> magenta at the story/mission body -> purple again, grounded, at the close.
  sections: [
    { at: 0, color: "#4e0d85", accent: "#c538bf" },
    { at: 0.5, color: "#c538bf", accent: "#1ebcf9" },
    { at: 1, color: "#4e0d85", accent: "#c538bf" },
  ],
};
