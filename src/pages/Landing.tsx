import { useRef, useState, useEffect, useMemo, Suspense, Component, ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Zap, Loader2 } from "lucide-react";
import * as THREE from "three";

// ============================================
// ERROR BOUNDARY
// ============================================
class ErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("3D Scene Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ============================================
// LOADING COMPONENT
// ============================================
function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f]">
      <Loader2 className="w-12 h-12 text-[#60a5fa] animate-spin mb-4" />
      <p className="text-muted-foreground text-sm tracking-widest uppercase">
        Loading Silicon Prairie...
      </p>
    </div>
  );
}

// ============================================
// FALLBACK FOR WEBGL ERRORS
// ============================================
function WebGLFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f] p-8 text-center">
      <h2 className="text-2xl font-bold text-[#60a5fa] mb-4">Silicon Prairie</h2>
      <p className="text-muted-foreground mb-6">
        3D experience requires WebGL. Please use a modern browser.
      </p>
      <Button onClick={() => window.location.href = "/"}>
        Continue to Main Site
      </Button>
    </div>
  );
}

// Colors from brand
const BLUE_SILICON = "#60a5fa";
const GOLD_PRAIRIE = "#D4AF37";

// ============================================
// WHEAT FIELD COMPONENT
// ============================================
function WheatField({ count = 2000 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Create wheat blade positions
  const [positions, rotations, scales, phases] = useMemo(() => {
    const pos: [number, number, number][] = [];
    const rot: number[] = [];
    const scl: number[] = [];
    const phs: number[] = [];

    for (let i = 0; i < count; i++) {
      // Spread wheat in a field pattern, more dense closer to camera
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 25;
      const x = Math.cos(angle) * radius;
      const z = -Math.abs(Math.sin(angle) * radius) - 2; // All in front

      pos.push([x, 0, z]);
      rot.push(Math.random() * Math.PI * 2);
      scl.push(0.8 + Math.random() * 0.5);
      phs.push(Math.random() * Math.PI * 2);
    }
    return [pos, rot, scl, phs];
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const [x, y, z] = positions[i];
      const phase = phases[i];
      const scale = scales[i];

      // Gentle swaying animation
      const sway = Math.sin(time * 1.5 + phase + x * 0.1) * 0.15;
      const sway2 = Math.cos(time * 1.2 + phase + z * 0.1) * 0.1;

      dummy.position.set(x, y, z);
      dummy.rotation.set(sway, rotations[i], sway2);
      dummy.scale.set(scale * 0.3, scale, scale * 0.3);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.05, 1.2, 4]} />
      <meshStandardMaterial
        color={GOLD_PRAIRIE}
        roughness={0.8}
        emissive={GOLD_PRAIRIE}
        emissiveIntensity={0.1}
      />
    </instancedMesh>
  );
}

// ============================================
// GLOWING ORB COMPONENT
// ============================================
function GlowingOrb({
  onHover,
  onClick,
  isHovered
}: {
  onHover: (hovered: boolean) => void;
  onClick: () => void;
  isHovered: boolean;
}) {
  const orbRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (orbRef.current) {
      orbRef.current.rotation.y = time * 0.2;
      // Gentle pulse
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      orbRef.current.scale.setScalar(pulse);
    }

    if (glowRef.current) {
      const glowPulse = 1 + Math.sin(time * 1.5) * 0.1;
      glowRef.current.scale.setScalar(glowPulse * (isHovered ? 1.5 : 1));
    }

    // Animate rays when hovered
    if (raysRef.current && isHovered) {
      raysRef.current.rotation.z = time * 0.5;
      raysRef.current.children.forEach((ray, i) => {
        const scale = 1 + Math.sin(time * 3 + i) * 0.3;
        ray.scale.y = scale;
      });
    }
  });

  return (
    <group position={[0, 2.5, -30]}>
      {/* Main orb */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh
          ref={orbRef}
          onPointerOver={() => onHover(true)}
          onPointerOut={() => onHover(false)}
          onClick={onClick}
        >
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            color={BLUE_SILICON}
            emissive={BLUE_SILICON}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Outer glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial
            color={isHovered ? GOLD_PRAIRIE : BLUE_SILICON}
            transparent
            opacity={0.3}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Golden rays (visible on hover) */}
      <group ref={raysRef} visible={isHovered}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh
            key={i}
            position={[0, 0, 0]}
            rotation={[0, 0, (i / 12) * Math.PI * 2]}
          >
            <planeGeometry args={[0.1, 8]} />
            <meshBasicMaterial
              color={GOLD_PRAIRIE}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Point light from orb */}
      <pointLight
        color={isHovered ? GOLD_PRAIRIE : BLUE_SILICON}
        intensity={isHovered ? 50 : 20}
        distance={100}
      />
    </group>
  );
}

// ============================================
// CITY SKYLINE COMPONENT
// ============================================
function CitySkyline({ digitized = false }: { digitized: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate building data
  const buildings = useMemo(() => {
    const b = [];
    for (let i = 0; i < 20; i++) {
      const x = (i - 10) * 3 + (Math.random() - 0.5) * 2;
      const height = 2 + Math.random() * 6;
      const width = 0.8 + Math.random() * 1.2;
      const depth = 0.8 + Math.random() * 1.2;
      b.push({ x, height, width, depth, delay: i * 0.1 });
    }
    return b;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !digitized) return;
    const time = state.clock.elapsedTime;

    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        // Circuit pattern animation through emissive
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.3 + Math.sin(time * 2 + i * 0.5) * 0.2;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -35]}>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.height / 2, 0]}>
          <boxGeometry args={[b.width, b.height, b.depth]} />
          <meshStandardMaterial
            color={digitized ? "#1a1a2e" : "#1a1a1a"}
            emissive={digitized ? BLUE_SILICON : "#000000"}
            emissiveIntensity={digitized ? 0.3 : 0}
            wireframe={digitized}
          />
        </mesh>
      ))}

      {/* Ground plane for city */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 20]} />
        <meshStandardMaterial
          color={digitized ? "#0a0a1a" : "#1a1a1a"}
          emissive={digitized ? BLUE_SILICON : "#000000"}
          emissiveIntensity={digitized ? 0.1 : 0}
        />
      </mesh>
    </group>
  );
}

// ============================================
// DIGITAL AVATAR COMPONENT
// ============================================
function DigitalAvatar({ visible, approaching }: { visible: boolean; approaching: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [targetZ, setTargetZ] = useState(-25);

  useEffect(() => {
    if (approaching) {
      setTargetZ(-8);
    }
  }, [approaching]);

  useFrame((state, delta) => {
    if (!groupRef.current || !visible) return;
    const time = state.clock.elapsedTime;

    // Smooth approach animation
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      delta * 0.5
    );

    // Floating animation
    groupRef.current.position.y = 2 + Math.sin(time * 1.5) * 0.3;

    // Gentle rotation to face camera
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 2, -25]}>
      {/* Avatar core - geometric humanoid shape */}
      <Float speed={3} rotationIntensity={0.1} floatIntensity={0.3}>
        {/* Head */}
        <mesh position={[0, 1.2, 0]}>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial
            color={BLUE_SILICON}
            emissive={BLUE_SILICON}
            emissiveIntensity={1}
            wireframe
          />
        </mesh>

        {/* Body */}
        <mesh position={[0, 0.3, 0]}>
          <octahedronGeometry args={[0.6]} />
          <meshStandardMaterial
            color={BLUE_SILICON}
            emissive={BLUE_SILICON}
            emissiveIntensity={0.8}
            wireframe
          />
        </mesh>

        {/* Arms gesture indicators */}
        <mesh position={[0.8, 0.5, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial
            color={GOLD_PRAIRIE}
            emissive={GOLD_PRAIRIE}
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[-0.8, 0.5, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial
            color={GOLD_PRAIRIE}
            emissive={GOLD_PRAIRIE}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Core glow */}
        <pointLight color={BLUE_SILICON} intensity={10} distance={15} />
      </Float>
    </group>
  );
}

// ============================================
// GROUND PLANE
// ============================================
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -10]}>
      <planeGeometry args={[100, 60]} />
      <meshStandardMaterial color="#2a1f0f" roughness={1} />
    </mesh>
  );
}

// ============================================
// SCENE COMPONENT
// ============================================
function Scene({
  screen,
  onOrbClick,
  orbHovered,
  setOrbHovered
}: {
  screen: 1 | 2;
  onOrbClick: () => void;
  orbHovered: boolean;
  setOrbHovered: (h: boolean) => void;
}) {
  const { camera } = useThree();

  useEffect(() => {
    // Position camera for first-person POV in wheat field
    camera.position.set(0, 1.6, 0);
    camera.lookAt(0, 2, -30);
  }, [camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />

      {/* Sky/Stars */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <color attach="background" args={["#0a0a0f"]} />
      <fog attach="fog" args={["#0a0a0f", 20, 60]} />

      {/* Environment */}
      <Ground />
      <WheatField count={3000} />
      <CitySkyline digitized={screen === 2} />

      {/* Screen 1: Orb */}
      {screen === 1 && (
        <GlowingOrb
          onHover={setOrbHovered}
          onClick={onOrbClick}
          isHovered={orbHovered}
        />
      )}

      {/* Screen 2: Avatar */}
      <DigitalAvatar visible={screen === 2} approaching={screen === 2} />
    </>
  );
}

// ============================================
// WIND AUDIO COMPONENT
// ============================================
function WindAudio({ playing }: { playing: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for wind ambience (using Web Audio API oscillators)
    if (!playing) return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // White noise for wind
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for wind-like sound
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;

    const gain = ctx.createGain();
    gain.gain.value = 0.05;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    whiteNoise.start();

    // Modulate filter for wind gusts
    const modulateWind = () => {
      const freq = 200 + Math.random() * 400;
      filter.frequency.setTargetAtTime(freq, ctx.currentTime, 2);
    };
    const interval = setInterval(modulateWind, 3000);

    return () => {
      clearInterval(interval);
      whiteNoise.stop();
      ctx.close();
    };
  }, [playing]);

  return null;
}

// ============================================
// MAIN LANDING COMPONENT
// ============================================
export default function Landing() {
  const [screen, setScreen] = useState<1 | 2>(1);
  const [orbHovered, setOrbHovered] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Hide loading screen after scene initializes
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleOrbClick = () => {
    setScreen(2);
    setTimeout(() => setShowUI(true), 2000);
  };

  const handleEnableAudio = () => {
    setAudioEnabled(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Three.js Canvas with Error Boundary */}
      <ErrorBoundary fallback={<WebGLFallback />}>
        <Canvas
          camera={{ fov: 60, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: false }}
          className="absolute inset-0"
          onCreated={() => console.log("Canvas created")}
        >
          <Suspense fallback={null}>
            <Scene
              screen={screen}
              onOrbClick={handleOrbClick}
              orbHovered={orbHovered}
              setOrbHovered={setOrbHovered}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* Loading overlay - shows briefly while 3D initializes */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f] z-50"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-[#60a5fa]/30 border-t-[#60a5fa] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground text-xs tracking-widest uppercase">Entering Silicon Prairie</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wind Audio */}
      <WindAudio playing={audioEnabled} />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Screen 1: Hint text */}
        <AnimatePresence>
          {screen === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-muted-foreground text-sm tracking-widest uppercase">
                {orbHovered ? "Click to enter" : "Approach the light"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screen 2: CTAs */}
        <AnimatePresence>
          {showUI && screen === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row gap-4 pointer-events-auto"
            >
              <Button
                size="lg"
                className="gradient-neon text-primary-foreground font-semibold px-8 py-6 text-lg hover:opacity-90 transition-opacity shadow-glow-cyan"
                onClick={() => window.location.href = "/"}
              >
                <Zap className="w-5 h-5 mr-2" />
                Enter Nexus
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 px-8 py-6 text-lg"
                onClick={() => window.location.href = "/#about"}
              >
                <Compass className="w-5 h-5 mr-2" />
                Explore Prairie
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screen 2: Welcome text */}
        <AnimatePresence>
          {showUI && screen === 2 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 text-center"
            >
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                <span className="text-[#60a5fa]">Silicon</span>{" "}
                <span className="text-[#D4AF37]">Prairie</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Where Golden Fields Meet Digital Futures
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Audio enable button (browsers require user interaction) */}
      {!audioEnabled && (
        <button
          onClick={handleEnableAudio}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white text-xs"
        >
          Enable Sound
        </button>
      )}

      {/* Loading indicator */}
      <div className="absolute top-4 left-4 text-xs text-muted-foreground/50">
        Silicon Prairie
      </div>
    </div>
  );
}
