import { useRef } from "react";
import { RollButton, Section, Split, gsap, isTouchDevice, onPageReady, useGsap } from "../fx";
import "./NotFound.css";

const CODE = ["4", "0", "4"];

/**
 * 404: the digits drop in and bounce, then shy away from the pointer
 * (each one leans and spins off the cursor's path). A click or tap
 * scatters them across the screen before they spring back home.
 */
export default function NotFound() {
  const ref = useRef<HTMLElement>(null);

  useGsap(({ reduced, scope }) => {
    const glyphs = Array.from(scope.querySelectorAll<HTMLElement>(".nf-glyph"));
    const fades = scope.querySelectorAll<HTMLElement>(".nf-fade");
    if (reduced || !glyphs.length) return undefined;

    gsap.set(glyphs, { yPercent: -160, rotate: (i) => (i - 1) * 25, opacity: 0 });
    gsap.set(fades, { opacity: 0, y: 24 });
    let ready = false;

    const stop = onPageReady(() => {
      gsap.timeline({ onComplete: () => { ready = true; } })
        .to(glyphs, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.4, stagger: 0.12, ease: "bounce.out" })
        .to(fades, { opacity: 1, y: 0, stagger: 0.1, duration: 1 }, 0.6);
    });

    // Idle float on the inner wrappers so it never fights the pointer push.
    const floats = scope.querySelectorAll<HTMLElement>(".nf-float");
    gsap.to(floats, {
      y: (i) => (i % 2 ? 18 : -18),
      rotate: (i) => (i - 1) * 3,
      duration: 2.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.3,
    });

    const xs = glyphs.map((g) => gsap.quickTo(g, "x", { duration: 0.9, ease: "power3.out" }));
    const ys = glyphs.map((g) => gsap.quickTo(g, "y", { duration: 0.9, ease: "power3.out" }));
    const rs = glyphs.map((g) => gsap.quickTo(g, "rotate", { duration: 1.1, ease: "power3.out" }));

    const push = (cx: number, cy: number) => {
      if (!ready) return;
      glyphs.forEach((g, i) => {
        const r = g.parentElement?.getBoundingClientRect();
        if (!r) return;
        const gx = r.left + r.width / 2;
        const gy = r.top + r.height / 2;
        const dx = gx - cx;
        const dy = gy - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.max(r.width, r.height) * 1.1;
        const force = Math.max(0, 1 - dist / reach);
        xs[i]((dx / dist) * force * r.width * 0.55);
        ys[i]((dy / dist) * force * r.height * 0.35);
        rs[i]((dx > 0 ? 1 : -1) * force * 28);
      });
    };

    const onMove = (e: PointerEvent) => push(e.clientX, e.clientY);
    const onLeave = () => {
      xs.forEach((to) => to(0));
      ys.forEach((to) => to(0));
      rs.forEach((to) => to(0));
    };
    const onScatter = (e: PointerEvent) => {
      if (!ready || (e.target as HTMLElement).closest("a, button")) return;
      ready = false;
      gsap.timeline({ onComplete: () => { ready = true; } })
        .to(glyphs, {
          x: () => gsap.utils.random(-window.innerWidth * 0.35, window.innerWidth * 0.35),
          y: () => gsap.utils.random(-window.innerHeight * 0.3, window.innerHeight * 0.3),
          rotate: () => gsap.utils.random(-180, 180),
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.04,
        })
        .to(glyphs, { x: 0, y: 0, rotate: 0, duration: 1.4, ease: "elastic.out(1, 0.45)", stagger: 0.06 }, "+=0.15");
    };

    if (!isTouchDevice()) {
      scope.addEventListener("pointermove", onMove);
      scope.addEventListener("pointerleave", onLeave);
    }
    scope.addEventListener("pointerdown", onScatter);

    return () => {
      stop();
      scope.removeEventListener("pointermove", onMove);
      scope.removeEventListener("pointerleave", onLeave);
      scope.removeEventListener("pointerdown", onScatter);
    };
  }, [], ref);

  return (
    <div className="page-404">
      <Section ref={ref} theme="paper" flush className="nf" ariaLabelledby="nf-title">
        <div className="nf-inner wrap">
          <p className="nf-code" aria-label="404">
            {CODE.map((c, i) => (
              <span key={i} className={`nf-slot nf-slot--${i}`} aria-hidden="true">
                <span className="nf-float">
                  <span className="nf-glyph">{c}</span>
                </span>
              </span>
            ))}
          </p>
          <div className="nf-foot">
            <Split as="h1" id="nf-title" text="This page doesn't exist." by="chars" trigger="load" delay={0.5} className="nf-title" />
            <div className="nf-fade">
              <RollButton to="/" size="lg" cursor="Home">Return home</RollButton>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
