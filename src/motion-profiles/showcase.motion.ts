import type { MotionProfile } from "./tokens";
export const showcaseMotion: MotionProfile = {
  name: "showcase", color: "#1ebcf9", accent: "#c538bf",
  cameraZ: 4.8, shape: 0.9, rotation: 0.09,
  // Ministries/Media/Project pages get the most energetic swing across all three brand hues.
  sections: [
    { at: 0, color: "#1ebcf9", accent: "#c538bf" },
    { at: 0.5, color: "#c538bf", accent: "#4e0d85" },
    { at: 1, color: "#4e0d85", accent: "#1ebcf9" },
  ],
};
