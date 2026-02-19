import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import heroPrairie from "@/assets/hero-prairie.jpg";

const BLUE_SILICON = "#60a5fa";
const GOLD_PRAIRIE = "#D4AF37";

export default function Landing() {
  const [orbHovered, setOrbHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [clicked, setClicked] = useState(false);

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
    setClicked(true);
    setTimeout(() => {
      window.location.href = "/home";
    }, 600);
  };

  return (
    <motion.div
      className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0f]"
      animate={clicked ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* ── Background Image with parallax ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          x: (mousePos.x - 0.5) * -18,
          y: (mousePos.y - 0.5) * -18,
        }}
      >
        <img
          src={heroPrairie}
          alt="Prairie"
          className="w-full h-full object-cover object-center scale-110"
        />
      </motion.div>

      {/* ── Dark gradient vignette ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-[#0a0a0f]/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/40 via-transparent to-[#0a0a0f]/40" />

      {/* ── 3D PERSPECTIVE GRID ── */}
      {/*
        The grid sits on the bottom half of the screen.
        perspective + rotateX makes it look like it's lying flat,
        receding away from the viewer into the horizon.
        Two layers: a solid line grid + a glowing pulse layer.
      */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "65%", perspective: "600px", perspectiveOrigin: "50% 0%" }}
      >
        {/* Base grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            transform: "rotateX(75deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `
              linear-gradient(${BLUE_SILICON}55 1.5px, transparent 1.5px),
              linear-gradient(90deg, ${BLUE_SILICON}55 1.5px, transparent 1.5px)
            `,
            backgroundSize: "80px 80px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 25%, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 25%, black 70%, transparent 100%)",
          }}
        />

        {/* Glowing pulse layer – same grid, animating opacity */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            transform: "rotateX(75deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `
              linear-gradient(${BLUE_SILICON}99 1.5px, transparent 1.5px),
              linear-gradient(90deg, ${BLUE_SILICON}99 1.5px, transparent 1.5px)
            `,
            backgroundSize: "80px 80px",
            filter: "blur(1px)",
            maskImage:
              "radial-gradient(ellipse 70% 80% at 50% 30%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 80% at 50% 30%, black, transparent)",
          }}
        />

        {/* Moving grid lines – simulates the grid rushing toward viewer */}
        <motion.div
          className="absolute inset-0"
          style={{
            transform: "rotateX(75deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `linear-gradient(${BLUE_SILICON}44 1.5px, transparent 1.5px)`,
            backgroundSize: "80px 80px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 25%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 25%, transparent 100%)",
          }}
          animate={{ backgroundPositionY: ["0px", "80px"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* ── Horizon glow behind orb ── */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          top: "38%",
          width: "600px",
          height: "200px",
          background: `radial-gradient(ellipse, ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}33 0%, transparent 70%)`,
          filter: "blur(20px)",
          transition: "background 0.4s ease",
        }}
      />

      {/* ── Animated light rays ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 w-[1px] origin-bottom"
            style={{
              bottom: "44%",
              height: "55vh",
              background: `linear-gradient(to top, ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}00, ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}18, ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}00)`,
              transform: `translateX(-50%) rotate(${-18 + i * 5}deg)`,
              transition: "background 0.4s ease",
            }}
            animate={{ opacity: [0.3, 0.7, 0.3], scaleY: [0.85, 1, 0.85] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}
      </div>

      {/* ── Foreground wheat stalks ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[28%] overflow-hidden pointer-events-none">
        {Array.from({ length: 90 }).map((_, i) => {
          const h = 70 + Math.random() * 110;
          const left = (i / 90) * 102 - 1;
          const delay = Math.random() * 2;
          const dur = 2.2 + Math.random() * 1.6;
          return (
            <motion.div
              key={i}
              className="absolute bottom-0 origin-bottom"
              style={{
                left: `${left}%`,
                width: "2.5px",
                height: `${h}px`,
                background: `linear-gradient(to top, ${GOLD_PRAIRIE}cc, ${GOLD_PRAIRIE}66, ${GOLD_PRAIRIE}22)`,
                borderRadius: "2px 2px 0 0",
              }}
              animate={{ rotate: [-4, 4, -4], scaleY: [1, 1.03, 1] }}
              transition={{ duration: dur, repeat: Infinity, delay, ease: "easeInOut" }}
            >
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-4 rounded-full opacity-80"
                style={{ background: GOLD_PRAIRIE }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ── Floating dust particles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => {
          const size = 1.5 + Math.random() * 2.5;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                left: `${Math.random() * 100}%`,
                top: `${35 + Math.random() * 55}%`,
                backgroundColor: i % 4 === 0 ? GOLD_PRAIRIE : "rgba(255,255,255,0.5)",
                boxShadow: `0 0 ${size * 3}px ${i % 4 === 0 ? GOLD_PRAIRIE : "rgba(255,255,255,0.2)"}`,
              }}
              animate={{
                x: [0, 25 + Math.random() * 35, 0],
                y: [0, -(15 + Math.random() * 25), 0],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 7 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 6,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* ── Scan line ── */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${BLUE_SILICON}55, transparent)`,
          boxShadow: `0 0 12px ${BLUE_SILICON}`,
        }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      />

      {/* ── Central Orb ── */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: "8vh" }}>
        <motion.button
          onClick={handleOrbClick}
          onHoverStart={() => setOrbHovered(true)}
          onHoverEnd={() => setOrbHovered(false)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          disabled={clicked}
          className="relative w-36 h-36 md:w-48 md:h-48 rounded-full cursor-pointer focus:outline-none"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}, ${orbHovered ? "#7a5a10" : "#1a3070"})`,
            boxShadow: `
              0 0 60px ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}88,
              0 0 120px ${orbHovered ? GOLD_PRAIRIE : BLUE_SILICON}44,
              inset 0 0 40px rgba(255,255,255,0.15)
            `,
            transition: "background 0.4s ease, box-shadow 0.4s ease",
          }}
        >
          {/* Specular highlight */}
          <div
            className="absolute inset-4 rounded-full"
            style={{ background: "radial-gradient(circle at 38% 35%, rgba(255,255,255,0.45), transparent 55%)" }}
          />

          <Sparkles className="absolute inset-0 m-auto w-10 h-10 md:w-14 md:h-14 text-white/70" />

          {/* Pulse ring 1 */}
          <motion.span
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: orbHovered ? GOLD_PRAIRIE : BLUE_SILICON }}
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Pulse ring 2 */}
          <motion.span
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: orbHovered ? GOLD_PRAIRIE : BLUE_SILICON }}
            animate={{ scale: [1, 2], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          />
        </motion.button>

        {/* Golden rays on hover */}
        <AnimatePresence>
          {orbHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ paddingBottom: "8vh" }}
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute origin-center"
                  style={{
                    width: "2px",
                    height: "220px",
                    background: `linear-gradient(to top, transparent, ${GOLD_PRAIRIE}55, transparent)`,
                    transform: `rotate(${i * (360 / 14)}deg)`,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 0.7 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.02 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Hint text ── */}
      <AnimatePresence>
        {!clicked && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/60 text-xs md:text-sm tracking-widest uppercase pointer-events-none"
          >
            {orbHovered ? "Enter Silicon Prairie" : "Approach the light"}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Corner branding ── */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-white/50 text-sm pointer-events-none">
        <img src="/favicon.svg" alt="Logo" className="w-6 h-6 opacity-60" />
        <span>Silicon Prairie</span>
      </div>
    </motion.div>
  );
}
