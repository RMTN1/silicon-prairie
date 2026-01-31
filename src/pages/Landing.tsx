import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Zap } from "lucide-react";
import * as THREE from "three";

// Brand colors
const BLUE_SILICON = "#60a5fa";
const GOLD_PRAIRIE = "#D4AF37";
const BLUE_VEC = new THREE.Color(BLUE_SILICON);
const GOLD_VEC = new THREE.Color(GOLD_PRAIRIE);

// ============================================
// WHEAT FIELD - Instanced with Wind Animation
// ============================================
function WheatField({ count = 15000 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-calculate positions, rotations, phases for each stalk
  const { positions, rotations, scales, phases, windOffsets } = useMemo(() => {
    const pos: [number, number, number][] = [];
    const rot: number[] = [];
    const scl: number[] = [];
    const phs: number[] = [];
    const wnd: number[] = [];

    for (let i = 0; i < count; i++) {
      // Distribute in a field pattern - denser near camera, spreading out
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.pow(Math.random(), 0.7) * 40;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 5;
      const z = -Math.abs(Math.sin(angle) * radius) - 1; // All in front of camera

      pos.push([x, 0, z]);
      rot.push(Math.random() * 0.3 - 0.15);
      scl.push(0.6 + Math.random() * 0.6);
      phs.push(Math.random() * Math.PI * 2);
      wnd.push(Math.random() * 2);
    }
    return { positions: pos, rotations: rot, scales: scl, phases: phs, windOffsets: wnd };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const [x, y, z] = positions[i];
      const baseRot = rotations[i];
      const scale = scales[i];
      const phase = phases[i];
      const windOffset = windOffsets[i];

      // Organic wind wave pattern - ripples through the field
      const windWave = Math.sin(time * 1.2 + x * 0.15 + z * 0.1 + phase) * 0.12;
      const windWave2 = Math.cos(time * 0.8 + x * 0.08 + phase * 0.5) * 0.08;
      const gustWave = Math.sin(time * 0.3 + windOffset) * 0.05;

      const swayX = windWave + windWave2 + gustWave;
      const swayZ = Math.cos(time * 1.5 + phase + z * 0.12) * 0.06;

      dummy.position.set(x, y, z);
      dummy.rotation.set(swayX, baseRot, swayZ);
      dummy.scale.set(0.15 * scale, scale * 1.2, 0.15 * scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <coneGeometry args={[0.04, 1, 4]} />
      <meshStandardMaterial
        color={GOLD_PRAIRIE}
        roughness={0.9}
        metalness={0.1}
        emissive={GOLD_PRAIRIE}
        emissiveIntensity={0.05}
      />
    </instancedMesh>
  );
}

// ============================================
// GLOWING ORB
// ============================================
function GlowingOrb({
  isHovered,
  onHover,
  onClick,
}: {
  isHovered: boolean;
  onHover: (h: boolean) => void;
  onClick: () => void;
}) {
  const orbRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Particle system for golden rays
  const particleCount = 200;
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1 + Math.random() * 3;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (orbRef.current) {
      orbRef.current.rotation.y = time * 0.1;
    }

    // Animate particles outward when hovered
    if (particlesRef.current && isHovered) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        const len = Math.sqrt(x * x + y * y + z * z);
        const expansion = 1 + Math.sin(time * 2 + i * 0.1) * 0.3;
        positions[i3] = (x / len) * (1.5 + expansion);
        positions[i3 + 1] = (y / len) * (1.5 + expansion);
        positions[i3 + 2] = (z / len) * (1.5 + expansion);
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 3, -35]} ref={orbRef}>
      {/* Main orb */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh
          onPointerOver={() => onHover(true)}
          onPointerOut={() => onHover(false)}
          onClick={onClick}
        >
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial
            color={isHovered ? GOLD_PRAIRIE : BLUE_SILICON}
            emissive={isHovered ? GOLD_PRAIRIE : BLUE_SILICON}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Glow layer */}
        <mesh scale={1.3}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial
            color={isHovered ? GOLD_PRAIRIE : BLUE_SILICON}
            transparent
            opacity={0.15}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Golden particle rays (visible on hover) */}
      {isHovered && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color={GOLD_PRAIRIE}
            size={0.08}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </points>
      )}

      {/* Point light */}
      <pointLight
        color={isHovered ? GOLD_PRAIRIE : BLUE_SILICON}
        intensity={isHovered ? 100 : 50}
        distance={80}
      />
    </group>
  );
}

// ============================================
// CITY SKYLINE SILHOUETTE
// ============================================
function CitySkyline() {
  const buildings = useMemo(() => {
    const b = [];
    for (let i = 0; i < 25; i++) {
      const x = (i - 12) * 4 + (Math.random() - 0.5) * 2;
      const height = 3 + Math.random() * 8;
      const width = 1 + Math.random() * 2;
      const depth = 1 + Math.random() * 2;
      b.push({ x, height, width, depth });
    }
    return b;
  }, []);

  return (
    <group position={[0, 0, -50]}>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.height / 2, 0]}>
          <boxGeometry args={[b.width, b.height, b.depth]} />
          <meshStandardMaterial color="#0a0a12" emissive="#0a0a12" />
        </mesh>
      ))}
    </group>
  );
}

// ============================================
// GROUND PLANE
// ============================================
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -20]} receiveShadow>
      <planeGeometry args={[200, 100]} />
      <meshStandardMaterial color="#1a150a" roughness={1} />
    </mesh>
  );
}

// ============================================
// CAMERA CONTROLLER
// ============================================
function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 1.6, 0);
    camera.lookAt(0, 2, -30);
  }, [camera]);

  // Subtle camera sway
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    camera.position.x = Math.sin(time * 0.1) * 0.1;
    camera.position.y = 1.6 + Math.sin(time * 0.15) * 0.05;
  });

  return null;
}

// ============================================
// POST-PROCESSING
// ============================================
function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.05}
        bokehScale={3}
      />
      <Vignette darkness={0.5} offset={0.3} />
    </EffectComposer>
  );
}

// ============================================
// MAIN 3D SCENE
// ============================================
function Scene({
  orbHovered,
  setOrbHovered,
  onOrbClick,
}: {
  orbHovered: boolean;
  setOrbHovered: (h: boolean) => void;
  onOrbClick: () => void;
}) {
  return (
    <>
      <CameraController />

      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.3}
        color="#ffeedd"
      />

      {/* Sky gradient */}
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 30, 80]} />
      <Stars radius={150} depth={60} count={4000} factor={4} saturation={0} fade speed={0.5} />

      {/* Environment */}
      <Ground />
      <WheatField count={12000} />
      <CitySkyline />
      <GlowingOrb isHovered={orbHovered} onHover={setOrbHovered} onClick={onOrbClick} />

      {/* Post-processing */}
      <PostProcessing />
    </>
  );
}

// ============================================
// WIND AUDIO
// ============================================
function useWindAudio(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 300;

    const gain = ctx.createGain();
    gain.gain.value = 0.04;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    whiteNoise.start();

    // Wind gusts
    const modulateWind = () => {
      const freq = 150 + Math.random() * 300;
      filter.frequency.setTargetAtTime(freq, ctx.currentTime, 2);
    };
    const interval = setInterval(modulateWind, 3000);

    return () => {
      clearInterval(interval);
      whiteNoise.stop();
      ctx.close();
    };
  }, [enabled]);
}

// ============================================
// LOADING SCREEN
// ============================================
function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508] z-50">
      <div className="w-16 h-16 border-2 border-[#60a5fa]/30 border-t-[#60a5fa] rounded-full animate-spin mb-4" />
      <p className="text-white/50 text-sm tracking-widest uppercase">Entering the Prairie</p>
    </div>
  );
}

// ============================================
// MAIN LANDING COMPONENT
// ============================================
export default function Landing() {
  const [screen, setScreen] = useState<1 | 2>(1);
  const [orbHovered, setOrbHovered] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useWindAudio(audioEnabled);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleOrbClick = () => {
    setScreen(2);
    setTimeout(() => setShowUI(true), 1500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050508]">
      {/* Three.js Canvas */}
      <Canvas
        camera={{ fov: 55, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <Scene
            orbHovered={orbHovered}
            setOrbHovered={setOrbHovered}
            onOrbClick={handleOrbClick}
          />
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Screen 1: Hint */}
        <AnimatePresence>
          {screen === 1 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-white/60 text-sm md:text-base tracking-widest uppercase">
                {orbHovered ? "Click to enter" : "Approach the light"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screen 2: Welcome & CTAs */}
        <AnimatePresence>
          {showUI && screen === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative p-8 md:p-12 rounded-2xl max-w-2xl text-center pointer-events-auto"
                style={{
                  background: "rgba(5, 5, 8, 0.85)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(96, 165, 250, 0.2)",
                  boxShadow: "0 0 80px rgba(96, 165, 250, 0.15)",
                }}
              >
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 rounded-tl-2xl border-[#60a5fa]" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 rounded-br-2xl border-[#D4AF37]" />

                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6"
                >
                  <span className="text-[#60a5fa]">Silicon</span>{" "}
                  <span className="text-[#D4AF37]">Prairie</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/70 text-lg md:text-xl mb-8 md:mb-10"
                >
                  Where Golden Fields Meet Digital Futures
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    size="lg"
                    className="text-white font-semibold px-8 py-6 text-lg transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #60a5fa, #2563eb)",
                      boxShadow: "0 0 30px rgba(96, 165, 250, 0.4)",
                    }}
                    onClick={() => (window.location.href = "/home")}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Enter Nexus
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg transition-all hover:scale-105"
                    style={{
                      borderColor: "rgba(212, 175, 55, 0.6)",
                      color: "#D4AF37",
                      background: "rgba(212, 175, 55, 0.1)",
                    }}
                    onClick={() => (window.location.href = "/home#about")}
                  >
                    <Compass className="w-5 h-5 mr-2" />
                    Explore Prairie
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Audio toggle */}
      <button
        onClick={() => setAudioEnabled(!audioEnabled)}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white/70 text-xs z-10"
      >
        {audioEnabled ? "🔊" : "🔇"} Sound
      </button>

      {/* Corner branding */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-white/40 text-sm z-10">
        <img src="/favicon.svg" alt="Logo" className="w-6 h-6 opacity-60" />
        <span>Silicon Prairie</span>
      </div>
    </div>
  );
}
