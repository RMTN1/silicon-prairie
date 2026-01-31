import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Zap } from "lucide-react";

// Colors from brand
const BLUE_SILICON = "#60a5fa";
const GOLD_PRAIRIE = "#D4AF37";

// Simple glowing orb
function GlowingOrb({ onClick, isHovered, onHover }: {
  onClick: () => void;
  isHovered: boolean;
  onHover: (h: boolean) => void;
}) {
  return (
    <mesh
      position={[0, 0, 0]}
      onClick={onClick}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
      scale={isHovered ? 1.2 : 1}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={isHovered ? GOLD_PRAIRIE : BLUE_SILICON}
      />
    </mesh>
  );
}

// Simple wheat stalks
function WheatField() {
  const stalks = [];
  for (let i = 0; i < 200; i++) {
    const x = (Math.random() - 0.5) * 30;
    const z = (Math.random() - 0.5) * 30;
    stalks.push(
      <mesh key={i} position={[x, 0.5, z]}>
        <coneGeometry args={[0.05, 1, 4]} />
        <meshBasicMaterial color={GOLD_PRAIRIE} />
      </mesh>
    );
  }
  return <>{stalks}</>;
}

// Ground
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial color="#1a1510" />
    </mesh>
  );
}

// Main scene
function Scene({ onOrbClick, orbHovered, setOrbHovered }: {
  onOrbClick: () => void;
  orbHovered: boolean;
  setOrbHovered: (h: boolean) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={2000} factor={4} fade />
      <color attach="background" args={["#0a0a0f"]} />

      <Ground />
      <WheatField />
      <GlowingOrb
        onClick={onOrbClick}
        isHovered={orbHovered}
        onHover={setOrbHovered}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
}

export default function Landing() {
  const [screen, setScreen] = useState<1 | 2>(1);
  const [orbHovered, setOrbHovered] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleOrbClick = () => {
    setScreen(2);
    setTimeout(() => setShowUI(true), 1000);
  };

  // Check for WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasError(true);
      }
    } catch (e) {
      setHasError(true);
    }
  }, []);

  if (hasError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0f] p-8 text-center">
        <h2 className="text-2xl font-bold text-[#60a5fa] mb-4">Silicon Prairie</h2>
        <p className="text-gray-400 mb-6">
          3D experience requires WebGL. Please use a modern browser.
        </p>
        <Button onClick={() => window.location.href = "/"}>
          Continue to Main Site
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 3, 10], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Scene
            onOrbClick={handleOrbClick}
            orbHovered={orbHovered}
            setOrbHovered={setOrbHovered}
          />
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
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
              <p className="text-gray-500 text-xs tracking-widest uppercase">Entering Silicon Prairie</p>
            </div>
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
              className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-gray-400 text-sm tracking-widest uppercase">
                {orbHovered ? "Click to enter" : "Click the orb"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screen 2: CTAs */}
        <AnimatePresence>
          {showUI && screen === 2 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 text-center"
              >
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                  <span className="text-[#60a5fa]">Silicon</span>{" "}
                  <span className="text-[#D4AF37]">Prairie</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-md mx-auto">
                  Where Golden Fields Meet Digital Futures
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row gap-4 pointer-events-auto"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-8 py-6 text-lg"
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
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Corner label */}
      <div className="absolute top-4 left-4 text-xs text-gray-600">
        Silicon Prairie
      </div>
    </div>
  );
}
