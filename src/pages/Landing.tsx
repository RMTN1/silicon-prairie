import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Zap, Sparkles } from "lucide-react";
import heroPrairie from "@/assets/hero-prairie.jpg";

// Colors from brand
const BLUE_SILICON = "#60a5fa";
const GOLD_PRAIRIE = "#D4AF37";

export default function Landing() {
  const [screen, setScreen] = useState<1 | 2>(1);
  const [orbHovered, setOrbHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleOrbClick = () => {
    setScreen(2);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Background Image with Parallax & Breathing Effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          x: (mousePos.x - 0.5) * -20,
          y: (mousePos.y - 0.5) * -20,
        }}
      >
        <img
          src={heroPrairie}
          alt="Prairie landscape"
          className="w-full h-full object-cover object-center scale-110"
        />
      </motion.div>

      {/* Animated Light Rays from horizon */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute bottom-[40%] left-1/2 w-[2px] origin-bottom"
            style={{
              height: "60vh",
              background: `linear-gradient(to top, ${GOLD_PRAIRIE}00, ${GOLD_PRAIRIE}22, ${GOLD_PRAIRIE}00)`,
              transform: `translateX(-50%) rotate(${-20 + i * 5}deg)`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scaleY: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Animated Cloud/Mist Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30"
        animate={{
          x: [0, 100, 0],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: `
            radial-gradient(ellipse 100% 50% at 20% 20%, rgba(255,255,255,0.1), transparent),
            radial-gradient(ellipse 80% 40% at 70% 30%, rgba(255,255,255,0.08), transparent)
          `,
        }}
      />

      {/* Foreground Wheat Stalks - Swaying Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%] overflow-hidden pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => {
          const height = 80 + Math.random() * 120;
          const left = (i / 80) * 100 + (Math.random() - 0.5) * 2;
          const delay = Math.random() * 2;
          const duration = 2.5 + Math.random() * 1.5;
          return (
            <motion.div
              key={`wheat-${i}`}
              className="absolute bottom-0 origin-bottom"
              style={{
                left: `${left}%`,
                width: "3px",
                height: `${height}px`,
                background: `linear-gradient(to top, ${GOLD_PRAIRIE}dd, ${GOLD_PRAIRIE}88, ${GOLD_PRAIRIE}44)`,
                borderRadius: "2px 2px 0 0",
              }}
              animate={{
                rotate: [-3, 3, -3],
                scaleY: [1, 1.02, 1],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
              }}
            >
              {/* Wheat head */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-4 rounded-full"
                style={{
                  background: `radial-gradient(ellipse, ${GOLD_PRAIRIE}, ${GOLD_PRAIRIE}88)`,
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Floating Pollen/Dust Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => {
          const size = 2 + Math.random() * 3;
          const startX = Math.random() * 100;
          const startY = 30 + Math.random() * 60;
          const duration = 8 + Math.random() * 12;
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                left: `${startX}%`,
                top: `${startY}%`,
                backgroundColor: i % 3 === 0 ? GOLD_PRAIRIE : "rgba(255,255,255,0.6)",
                boxShadow: `0 0 ${size * 2}px ${i % 3 === 0 ? GOLD_PRAIRIE : "rgba(255,255,255,0.3)"}`,
              }}
              animate={{
                x: [0, 30 + Math.random() * 40, 0],
                y: [0, -20 - Math.random() * 30, 0],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Gradient Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/50 via-transparent to-transparent" />

      {/* Digital Grid Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[50%]"
          style={{
            perspective: "500px",
            perspectiveOrigin: "50% 0%",
          }}
        >
          <motion.div
            className="w-full h-full"
            animate={{
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            style={{
              transform: "rotateX(60deg)",
              backgroundImage: `
                linear-gradient(${BLUE_SILICON}44 1px, transparent 1px),
                linear-gradient(90deg, ${BLUE_SILICON}44 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              maskImage: "radial-gradient(ellipse 80% 100% at 50% 0%, black, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 100% at 50% 0%, black, transparent)",
            }}
          />
        </div>

        {/* Animated scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${BLUE_SILICON}66, transparent)`,
            boxShadow: `0 0 20px ${BLUE_SILICON}`,
          }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Screen 1: Glowing Orb */}
      <AnimatePresence mode="wait">
        {screen === 1 && (
          <motion.div
            key="screen1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {/* Orb */}
            <motion.button
              onClick={handleOrbClick}
              onHoverStart={() => setOrbHovered(true)}
              onHoverEnd={() => setOrbHovered(false)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-40 h-40 md:w-52 md:h-52 rounded-full cursor-pointer focus:outline-none mt-[-10vh]"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}, ${orbHovered ? "#8B6914" : "#1e40af"})`,
                boxShadow: `
                  0 0 80px ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}88,
                  0 0 160px ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}44,
                  inset 0 0 60px ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}44
                `,
              }}
            >
              {/* Inner glow */}
              <div
                className="absolute inset-4 rounded-full"
                style={{
                  background: `radial-gradient(circle at 40% 40%, white, transparent 60%)`,
                  opacity: 0.4,
                }}
              />

              <Sparkles className="absolute inset-0 m-auto w-12 h-12 md:w-16 md:h-16 text-white/70" />

              {/* Pulse rings */}
              <motion.span
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: orbHovered ? GOLD_PRAIRIE : BLUE_SILICON }}
                animate={{ scale: [1, 1.5, 1.5], opacity: [0.6, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: orbHovered ? GOLD_PRAIRIE : BLUE_SILICON }}
                animate={{ scale: [1, 1.8, 1.8], opacity: [0.4, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </motion.button>

            {/* Golden rays on hover */}
            <AnimatePresence>
              {orbHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none mt-[-10vh]"
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-48 md:h-64 origin-bottom"
                      style={{
                        background: `linear-gradient(to top, ${GOLD_PRAIRIE}00, ${GOLD_PRAIRIE}66, ${GOLD_PRAIRIE}00)`,
                        transform: `rotate(${i * 30}deg)`,
                      }}
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 0.6 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.02 }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-20 text-white/70 text-sm md:text-base tracking-widest uppercase"
            >
              {orbHovered ? "Click to enter" : "Approach the light"}
            </motion.p>
          </motion.div>
        )}

        {/* Screen 2: Welcome & CTAs */}
        {screen === 2 && (
          <motion.div
            key="screen2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative p-8 md:p-12 rounded-2xl max-w-2xl text-center"
              style={{
                background: "rgba(10, 10, 15, 0.8)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${BLUE_SILICON}33`,
                boxShadow: `0 0 60px ${BLUE_SILICON}22`,
              }}
            >
              <div
                className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 rounded-tl-2xl"
                style={{ borderColor: BLUE_SILICON }}
              />
              <div
                className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 rounded-br-2xl"
                style={{ borderColor: GOLD_PRAIRIE }}
              />

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6"
              >
                <span style={{ color: BLUE_SILICON }}>Silicon</span>{" "}
                <span style={{ color: GOLD_PRAIRIE }}>Prairie</span>
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
                    background: `linear-gradient(135deg, ${BLUE_SILICON}, #2563eb)`,
                    boxShadow: `0 0 30px ${BLUE_SILICON}44`,
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
                    borderColor: `${GOLD_PRAIRIE}88`,
                    color: GOLD_PRAIRIE,
                    background: `${GOLD_PRAIRIE}11`,
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

      {/* Corner branding */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-white/60 text-sm">
        <img src="/favicon.svg" alt="Logo" className="w-6 h-6" />
        <span>Silicon Prairie</span>
      </div>
    </div>
  );
}
