import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Zap, Sparkles } from "lucide-react";

// Colors from brand
const BLUE_SILICON = "#60a5fa";
const GOLD_PRAIRIE = "#D4AF37";

export default function Landing() {
  const [screen, setScreen] = useState<1 | 2>(1);
  const [orbHovered, setOrbHovered] = useState(false);

  const handleOrbClick = () => {
    setScreen(2);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Wheat field gradient at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: `linear-gradient(to top, ${GOLD_PRAIRIE}22, transparent)`,
        }}
      />

      {/* Animated wheat stalks */}
      <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-1 origin-bottom"
            style={{
              left: `${i * 2 + Math.random()}%`,
              height: `${60 + Math.random() * 80}px`,
              background: `linear-gradient(to top, ${GOLD_PRAIRIE}, ${GOLD_PRAIRIE}88)`,
              animation: `sway ${2 + Math.random()}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* City silhouette */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center items-end gap-1 opacity-30">
        {[40, 70, 50, 90, 60, 80, 45, 100, 55, 75, 40, 85, 50].map((h, i) => (
          <div
            key={i}
            className="bg-gray-800"
            style={{
              width: `${20 + Math.random() * 30}px`,
              height: `${h}px`,
            }}
          />
        ))}
      </div>

      {/* Screen 1: Orb */}
      <AnimatePresence mode="wait">
        {screen === 1 && (
          <motion.div
            key="screen1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {/* Glowing Orb */}
            <motion.button
              onClick={handleOrbClick}
              onHoverStart={() => setOrbHovered(true)}
              onHoverEnd={() => setOrbHovered(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-32 h-32 rounded-full cursor-pointer focus:outline-none"
              style={{
                background: `radial-gradient(circle, ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}, ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}44)`,
                boxShadow: `0 0 60px ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}, 0 0 120px ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}66`,
              }}
            >
              <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-white/80" />

              {/* Pulse rings */}
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: orbHovered ? GOLD_PRAIRIE : BLUE_SILICON }}
              />
            </motion.button>

            {/* Hint text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-12 text-gray-400 text-sm tracking-widest uppercase"
            >
              {orbHovered ? "Click to enter" : "Approach the light"}
            </motion.p>
          </motion.div>
        )}

        {/* Screen 2: Welcome */}
        {screen === 2 && (
          <motion.div
            key="screen2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-center"
            >
              <span style={{ color: BLUE_SILICON }}>Silicon</span>{" "}
              <span style={{ color: GOLD_PRAIRIE }}>Prairie</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-lg md:text-xl mb-12 text-center max-w-md"
            >
              Where Golden Fields Meet Digital Futures
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="text-white font-semibold px-8 py-6 text-lg"
                style={{
                  background: `linear-gradient(135deg, ${BLUE_SILICON}, #3b82f6)`,
                }}
                onClick={() => window.location.href = "/"}
              >
                <Zap className="w-5 h-5 mr-2" />
                Enter Nexus
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
                style={{
                  borderColor: `${GOLD_PRAIRIE}66`,
                  color: GOLD_PRAIRIE,
                }}
                onClick={() => window.location.href = "/#about"}
              >
                <Compass className="w-5 h-5 mr-2" />
                Explore Prairie
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner label */}
      <div className="absolute top-4 left-4 text-xs text-gray-600">
        Silicon Prairie
      </div>

      {/* CSS for sway animation */}
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
