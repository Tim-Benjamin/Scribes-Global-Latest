import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./gsap";

interface GradientFieldProps {
  className?: string;
  /** "ink" = deep night base; "light" = paper base with brand colour flowing through. */
  tone?: "ink" | "light";
  /** Pointer pushes the fluid around. */
  interactive?: boolean;
  /** Stop rendering while true (e.g. inside a closed overlay that is hidden but still on-screen). */
  paused?: boolean;
}

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uLight;

vec3 hash3(vec2 p){
  vec3 q = vec3(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)), dot(p, vec2(419.2,371.9)));
  return fract(sin(q) * 43758.5453);
}
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  float a = hash3(i).x, b = hash3(i+vec2(1.,0.)).x, c = hash3(i+vec2(0.,1.)).x, d = hash3(i+vec2(1.,1.)).x;
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv; p.x *= uRes.x / uRes.y;
  float t = uTime * 0.06;
  vec2 m = uMouse; m.x *= uRes.x / uRes.y;
  float md = distance(p, m);
  vec2 push = (p - m) * exp(-md * 3.5) * 0.35;

  vec2 q = vec2(fbm(p*1.6 + t + push), fbm(p*1.6 - t*0.8 + 4.0));
  vec2 r = vec2(fbm(p*1.8 + q*2.2 + vec2(1.7,9.2) + t*1.3), fbm(p*1.8 + q*2.2 + vec2(8.3,2.8) - t));
  float f = fbm(p*1.4 + r*2.0);

  vec3 night = vec3(0.071, 0.024, 0.122);
  vec3 purple = vec3(0.306, 0.051, 0.522);
  vec3 magenta = vec3(0.773, 0.220, 0.749);
  vec3 cyan = vec3(0.118, 0.737, 0.976);
  vec3 paper = vec3(0.949, 0.941, 0.957);

  vec3 col = mix(night, purple, smoothstep(0.1, 0.6, f));
  col = mix(col, magenta, smoothstep(0.38, 0.78, r.x) * 0.9);
  col = mix(col, cyan, smoothstep(0.48, 0.85, q.y) * 0.85);
  col = mix(col, night, smoothstep(0.62, 0.95, f) * 0.35);
  col += exp(-md * 6.0) * 0.08;

  vec3 light = mix(paper, col, smoothstep(0.38, 0.85, f + r.y * 0.25) * 0.92);
  col = mix(col, light, uLight);

  float grain = (hash3(gl_FragCoord.xy + fract(uTime)).x - 0.5) * 0.045;
  gl_FragColor = vec4(col + grain, 1.0);
}
`;

/**
 * Full-bleed WebGL ink field in the brand palette. Pauses when
 * offscreen or the tab is hidden; renders one still frame for
 * reduced-motion users; CSS gradient underneath if WebGL fails.
 */
export default function GradientField({ className, tone = "ink", interactive = true, paused = false }: GradientFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) kickRef.current();
  }, [paused]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) return undefined;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uLight = gl.getUniformLocation(prog, "uLight");
    gl.uniform1f(uLight, tone === "light" ? 1 : 0);

    const mouse = { x: 0.7, y: 0.4, tx: 0.7, ty: 0.4 };
    const scale = 0.5; // render at half resolution, upscale with CSS — it's a soft field anyway
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    };
    if (interactive) window.addEventListener("pointermove", onMove, { passive: true });

    const reduced = prefersReducedMotion();
    let visible = true;
    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform1f(uTime, (now - start) / 1000 + 20);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      draw(now);
      if (visible && !pausedRef.current && !document.hidden && !reduced) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf && visible && !pausedRef.current && !document.hidden) raf = requestAnimationFrame(loop);
    };
    kickRef.current = kick;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", kick);
    canvas.classList.add("is-live");
    // Always paint one frame so a paused field still shows its colours.
    raf = requestAnimationFrame(loop);

    return () => {
      kickRef.current = () => {};
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", kick);
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [interactive, tone]);

  return <canvas ref={ref} className={`gfield gfield--${tone} ${className ?? ""}`} aria-hidden="true" />;
}
