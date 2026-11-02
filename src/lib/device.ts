export function isTouchDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
}

export function supportsVibration() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return "vibrate" in navigator;
}