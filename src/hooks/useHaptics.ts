type HapticPattern =
  | "light"
  | "medium"
  | "success";

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  success: [10, 30, 20],
};

export function useHaptics() {
  const vibrate = (pattern: HapticPattern = "light") => {
    if (typeof navigator === "undefined") {
      return;
    }

    if (!("vibrate" in navigator)) {
      return;
    }

    try {
      navigator.vibrate(patterns[pattern]);
    } catch {
      // Vibration is optional and may be unavailable.
    }
  };

  return {
    vibrate,
    light: () => vibrate("light"),
    medium: () => vibrate("medium"),
    success: () => vibrate("success"),
  };
}