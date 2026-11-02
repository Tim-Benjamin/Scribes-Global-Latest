import {
  Component, useEffect, useMemo, useRef, useState, type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Color, MathUtils, type Mesh, type ShaderMaterial } from "three";
import { useMotionEngine, type MotionEngine } from "../motion/motion-context";
import { useMediaPreference } from "../motion/useMediaPreference";
import type { MotionProfile, MotionStop } from "../../../motion-profiles";

/** Sorted color stops, falling back to a flat pair when the profile has none. */
function useStops(profile: MotionProfile) {
  return useMemo(() => {
    const raw: MotionStop[] = profile.sections?.length
      ? [...profile.sections].sort((a, b) => a.at - b.at)
      : [{ at: 0, color: profile.color, accent: profile.accent }];
    return raw.map((s) => ({ at: s.at, color: new Color(s.color), accent: new Color(s.accent) }));
  }, [profile]);
}

/** Interpolates target color/accent for a scroll progress (0-1) into the given scratch Colors. */
function sampleStops(
  stops: ReturnType<typeof useStops>,
  progress: number,
  outColor: Color,
  outAccent: Color,
) {
  if (stops.length === 1) {
    outColor.copy(stops[0].color);
    outAccent.copy(stops[0].accent);
    return;
  }
  let i = 0;
  while (i < stops.length - 2 && progress > stops[i + 1].at) i += 1;
  const a = stops[i];
  const b = stops[i + 1];
  const span = b.at - a.at;
  const t = span > 0 ? MathUtils.clamp((progress - a.at) / span, 0, 1) : 0;
  outColor.copy(a.color).lerp(b.color, t);
  outAccent.copy(a.accent).lerp(b.accent, t);
}

const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  varying vec3 vNormal;
  varying float vWave;
  void main() {
    float wave = sin(position.x * 3.0 + uTime)
      * sin(position.y * 3.0 - uTime * 0.7)
      * sin(position.z * 3.0 + uTime * 0.4);
    vec3 p = position + normal * wave * (0.08 + uProgress * 0.22);
    vWave = wave;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uTransition;
  varying vec3 vNormal;
  varying float vWave;
  void main() {
    float rim = pow(1.0 - abs(normalize(vNormal).z), 2.0);
    vec3 color = mix(uColor, uAccent, clamp(vWave * 0.3 + rim, 0.0, 1.0));
    color += rim * uTransition * 0.12;
    gl_FragColor = vec4(color, 0.2 + rim * 0.25);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

class CanvasBoundary extends Component<
  { children: ReactNode }, { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function RouteSculpture({ profile, engine }: {
  profile: MotionProfile;
  engine: MotionEngine;
}) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const stops = useStops(profile);
  // Reused every frame so sampling never allocates.
  const target = useMemo(() => ({ base: new Color(), accent: new Color() }), []);
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uProgress: { value: profile.shape },
    uTransition: { value: 0 },
    uColor: { value: new Color(profile.color) },
    uAccent: { value: new Color(profile.accent) },
  }));

  useFrame(({ camera }, rawDelta) => {
    if (!mesh.current || !material.current) return;
    const delta = Math.min(rawDelta, 0.05);
    const blend = 1 - Math.exp(-4 * delta);
    const exiting = engine.route.current.phase === "exit" ? 1 : 0;
    const scroll = engine.scroll.current;
    const u = material.current.uniforms;
    u.uTime.value += delta;
    u.uProgress.value = MathUtils.damp(u.uProgress.value, profile.shape, 4, delta);
    u.uTransition.value = MathUtils.damp(u.uTransition.value, exiting, 6, delta);
    sampleStops(stops, scroll.progress, target.base, target.accent);
    u.uColor.value.lerp(target.base, blend);
    u.uAccent.value.lerp(target.accent, blend);
    mesh.current.rotation.y += delta * profile.rotation;
    mesh.current.rotation.x = MathUtils.damp(
      mesh.current.rotation.x, scroll.progress * 0.4, 4, delta,
    );
    camera.position.z = MathUtils.damp(
      camera.position.z, profile.cameraZ + exiting * 0.8, 5, delta,
    );
  });

  return (
    <mesh ref={mesh} position={[1.3, 0, 0]}>
      <icosahedronGeometry args={[1.8, 4]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Scene({ profile }: { profile: MotionProfile }) {
  const engine = useMotionEngine();
  const reduced = useMediaPreference("(prefers-reduced-motion: reduce)");
  const compact = useMediaPreference("(max-width: 768px), (pointer: coarse)");
  const [visible, setVisible] = useState(() => !document.hidden);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return (
    <div className="motion-scene" aria-hidden="true">
      <div className="motion-scene-fallback" />
      {!reduced && !contextLost && (
        <CanvasBoundary>
          <Canvas
            dpr={compact ? 1 : [1, 1.5]}
            camera={{ position: [0, 0, 5.2], fov: 45 }}
            gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
            frameloop={visible ? "always" : "never"}
            fallback={null}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", () => {
                setContextLost(true);
              }, { once: true });
            }}
          >
            <RouteSculpture profile={profile} engine={engine} />
          </Canvas>
        </CanvasBoundary>
      )}
    </div>
  );
}
