import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import heroPrairie from "@/assets/hero-prairie.jpg";
import Grid3D from "@/components/Grid3D";

// ── Time-of-day theme ─────────────────────────────────────────────────────────
type Theme = { orb: string; grid: string; rays: string };

function getTimeTheme(): Theme {
  const h = new Date().getHours();
  if (h >= 5  && h < 10) return { orb: "#FB923C", grid: "#F59E0B", rays: "#FBBF24" }; // dawn
  if (h >= 10 && h < 17) return { orb: "#D4AF37", grid: "#60a5fa", rays: "#93C5FD" }; // day
  if (h >= 17 && h < 20) return { orb: "#C084FC", grid: "#F97316", rays: "#E879F9" }; // dusk
  return { orb: "#22D3EE", grid: "#6366F1", rays: "#67E8F9" };                         // night
}

// ── Wheat stalks (stable across renders) ─────────────────────────────────────
const STALKS = Array.from({ length: 90 }, (_, i) => ({
  left:  (i / 90) * 102 - 1,
  h:     70  + ((i * 137) % 110),
  delay: ((i * 73)  % 200) / 100,
  dur:   2.2 + ((i * 53)  % 160) / 100,
}));

// ── Dust particles (stable across renders) ────────────────────────────────────
const DUST = Array.from({ length: 40 }, (_, i) => ({
  size:  1.5 + ((i * 97)  % 25) / 10,
  left:  ((i * 137) % 100),
  top:   35  + ((i * 73)  % 55),
  dx:    25  + ((i * 53)  % 35),
  dy:    15  + ((i * 41)  % 25),
  dur:   7   + ((i * 31)  % 100) / 10,
  delay: ((i * 67)  % 60)  / 10,
  gold:  i % 4 === 0,
}));

export default function Landing() {
  const theme = useMemo(getTimeTheme, []);

  const [orbHovered, setOrbHovered] = useState(false);
  const [mousePos,   setMousePos]   = useState({ x: 0.5, y: 0.5 });
  const [stage,      setStage]      = useState(0);  // cinematic entry
  const [exiting,    setExiting]    = useState(false);

  // Mouse parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Cinematic entry — each stage reveals the next layer
  useEffect(() => {
    const t = [
      setTimeout(() => setStage(1),  100),  // grid materialises
      setTimeout(() => setStage(2),  600),  // background fades in
      setTimeout(() => setStage(3), 1200),  // wheat + particles rise
      setTimeout(() => setStage(4), 1800),  // orb pulses in
      setTimeout(() => setStage(5), 2500),  // hint text appears
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  // Fly-through transition: zoom grid + flash, then navigate
  const handleOrbClick = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => { window.location.href = "/home"; }, 950);
  };

  const orbColor = orbHovered ? theme.orb : theme.grid;

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0f]">

      {/* ── Background image + parallax + breathing ────────────────────────── */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: stage >= 2 ? 1 : 0,
          scale:   exiting ? 1.35 : [1, 1.03, 1],
        }}
        transition={{
          opacity: { duration: 1.5 },
          scale:   exiting
            ? { duration: 0.95, ease: "easeIn" }
            : { duration: 20, repeat: Infinity, ease: "easeInOut" },
        }}
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

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-[#0a0a0f]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/40 via-transparent to-[#0a0a0f]/40 pointer-events-none" />

      {/* ── 3D Grid — animated in, zooms forward on exit ────────────────────── */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: stage >= 1 ? 1 : 0,
          scale:   exiting ? 5 : 1,
        }}
        transition={{
          opacity: { duration: 1.4 },
          scale:   { duration: 0.95, ease: "easeIn" },
        }}
      >
        <Grid3D color={theme.grid} position="absolute" />
      </motion.div>

      {/* ── Horizon glow ────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 2 ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        style={{
          top: "38%",
          width: "600px",
          height: "200px",
          background: `radial-gradient(ellipse, ${orbColor}33 0%, transparent 70%)`,
          filter: "blur(20px)",
          transition: "background 0.4s ease",
        }}
      />

      {/* ── Light rays ──────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 2 ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 w-[1px] origin-bottom"
            style={{
              bottom: "44%",
              height: "55vh",
              background: `linear-gradient(to top, ${orbColor}00, ${orbColor}18, ${orbColor}00)`,
              transform: `translateX(-50%) rotate(${-18 + i * 5}deg)`,
              transition: "background 0.4s ease",
            }}
            animate={{ opacity: [0.3, 0.7, 0.3], scaleY: [0.85, 1, 0.85] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}
      </motion.div>

      {/* ── Wheat stalks ────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[28%] overflow-hidden pointer-events-none"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 30 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {STALKS.map((s, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 origin-bottom"
            style={{
              left: `${s.left}%`,
              width: "2.5px",
              height: `${s.h}px`,
              background: `linear-gradient(to top, ${theme.orb}cc, ${theme.orb}66, ${theme.orb}22)`,
              borderRadius: "2px 2px 0 0",
            }}
            animate={{ rotate: [-4, 4, -4], scaleY: [1, 1.03, 1] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          >
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-4 rounded-full opacity-80"
              style={{ background: theme.orb }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Dust particles ──────────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 3 ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      >
        {DUST.map((d, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: d.size,
              height: d.size,
              left: `${d.left}%`,
              top: `${d.top}%`,
              backgroundColor: d.gold ? theme.orb : "rgba(255,255,255,0.5)",
              boxShadow: `0 0 ${d.size * 3}px ${d.gold ? theme.orb : "rgba(255,255,255,0.2)"}`,
            }}
            animate={{ x: [0, d.dx, 0], y: [0, -d.dy, 0], opacity: [0, 0.7, 0] }}
            transition={{ duration: d.dur, repeat: Infinity, delay: d.delay, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      {/* ── Scan line ───────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.grid}55, transparent)`,
          boxShadow: `0 0 12px ${theme.grid}`,
        }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      />

      {/* ── Central Orb ─────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingBottom: "8vh" }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: stage >= 4 ? 1 : 0, scale: stage >= 4 ? 1 : 0.6 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.button
          onClick={handleOrbClick}
          onHoverStart={() => setOrbHovered(true)}
          onHoverEnd={() => setOrbHovered(false)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          disabled={exiting}
          className="relative w-36 h-36 md:w-48 md:h-48 rounded-full cursor-pointer focus:outline-none"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${orbHovered ? theme.orb : theme.grid}, ${orbHovered ? "#7a3a10" : "#1a3070"})`,
            boxShadow: `
              0 0 60px ${orbColor}88,
              0 0 120px ${orbColor}44,
              inset 0 0 40px rgba(255,255,255,0.15)
            `,
            transition: "background 0.4s ease, box-shadow 0.4s ease",
          }}
        >
          <div
            className="absolute inset-4 rounded-full"
            style={{ background: "radial-gradient(circle at 38% 35%, rgba(255,255,255,0.45), transparent 55%)" }}
          />
          <Sparkles className="absolute inset-0 m-auto w-10 h-10 md:w-14 md:h-14 text-white/70" />

          <motion.span
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: orbColor }}
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: orbColor }}
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
                    background: `linear-gradient(to top, transparent, ${theme.orb}55, transparent)`,
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
      </motion.div>

      {/* ── Hint text ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {stage >= 5 && !exiting && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/60 text-xs md:text-sm tracking-widest uppercase pointer-events-none"
          >
            {orbHovered ? "Enter Silicon Prairie" : "Approach the light"}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Corner branding ─────────────────────────────────────────────────── */}
      <motion.div
        className="absolute top-4 left-4 flex items-center gap-2 text-white/50 text-sm pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 5 ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <img src="/favicon.svg" alt="Logo" className="w-6 h-6 opacity-60" />
        <span>Silicon Prairie</span>
      </motion.div>

      {/* ── Flash overlay — covers everything on exit ────────────────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "white", zIndex: 50 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 1 : 0 }}
        transition={{ duration: 0.95, ease: "easeIn", delay: 0.2 }}
      />
    </div>
  );
}
