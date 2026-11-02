import { gsap, prefersReducedMotion } from "./gsap";
import type { Theme } from "./Section";

const THEMES: Record<Theme, Record<string, string>> = {
  paper: {
    "--bg": "#f2f0f4", "--fg": "#160c22", "--fg-soft": "rgba(22,12,34,0.68)",
    "--fg-faint": "rgba(22,12,34,0.38)", "--line": "rgba(22,12,34,0.14)", "--accent": "#4e0d85",
  },
  night: {
    "--bg": "#12061f", "--fg": "#f2f0f4", "--fg-soft": "rgba(242,240,244,0.7)",
    "--fg-faint": "rgba(242,240,244,0.4)", "--line": "rgba(242,240,244,0.16)", "--accent": "#1ebcf9",
  },
  purple: {
    "--bg": "#4e0d85", "--fg": "#f2f0f4", "--fg-soft": "rgba(242,240,244,0.76)",
    "--fg-faint": "rgba(242,240,244,0.45)", "--line": "rgba(242,240,244,0.22)", "--accent": "#1ebcf9",
  },
  magenta: {
    "--bg": "#c538bf", "--fg": "#ffffff", "--fg-soft": "rgba(255,255,255,0.82)",
    "--fg-faint": "rgba(255,255,255,0.5)", "--line": "rgba(255,255,255,0.28)", "--accent": "#12061f",
  },
  cyan: {
    "--bg": "#1ebcf9", "--fg": "#12061f", "--fg-soft": "rgba(18,6,31,0.74)",
    "--fg-faint": "rgba(18,6,31,0.45)", "--line": "rgba(18,6,31,0.2)", "--accent": "#4e0d85",
  },
};

let currentTheme: Theme | null = null;

export function applyTheme(theme: Theme, immediate = false) {
  const root = document.documentElement;
  const vars = THEMES[theme] ?? THEMES.paper;
  if (currentTheme === theme && !immediate) return;
  currentTheme = theme;
  root.dataset.pageTheme = theme;
  if (immediate || prefersReducedMotion()) {
    gsap.killTweensOf(root);
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    return;
  }
  gsap.to(root, { ...vars, duration: 0.9, ease: "sg.inOut", overwrite: "auto" });
}
