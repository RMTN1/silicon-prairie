import { motion } from "framer-motion";

interface Grid3DProps {
  /** 0–1 multiplier for overall opacity. Default 1. */
  opacity?: number;
  /** Grid line color. Default silicon blue. */
  color?: string;
  /** CSS position value for the root element. Default "fixed". */
  position?: "fixed" | "absolute";
}

/**
 * Tron-style 3D perspective grid.
 * Horizon at vertical center, grid recedes into infinite distance.
 * Bright neon lines with dramatic glow.
 */
export default function Grid3D({
  opacity = 1,
  color = "#60a5fa",
  position = "fixed",
}: Grid3DProps) {
  return (
    <div
      className="pointer-events-none"
      style={{ position, top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity }}
    >
      {/* ── Ground plane (bottom half) ─────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          bottom: 0,
          perspective: "500px",
          perspectiveOrigin: "50% 0%",
        }}
      >
        {/* Base grid — bright neon lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(80deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `
              linear-gradient(${color} 2px, transparent 2px),
              linear-gradient(90deg, ${color} 2px, transparent 2px)
            `,
            backgroundSize: "60px 60px",
            filter: `drop-shadow(0 0 2px ${color}) drop-shadow(0 0 6px ${color})`,
            maskImage:
              "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          }}
        />

        {/* Glow pulse layer */}
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(80deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `
              linear-gradient(${color}cc 2px, transparent 2px),
              linear-gradient(90deg, ${color}cc 2px, transparent 2px)
            `,
            backgroundSize: "60px 60px",
            filter: `blur(3px) drop-shadow(0 0 8px ${color})`,
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 10%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 10%, black, transparent)",
          }}
        />

        {/* Moving lines — rushing toward viewer */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(80deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `linear-gradient(${color}88 2px, transparent 2px)`,
            backgroundSize: "60px 60px",
            filter: `drop-shadow(0 0 4px ${color})`,
            maskImage:
              "linear-gradient(to bottom, black 0%, transparent 40%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, transparent 40%)",
          }}
          animate={{ backgroundPositionY: ["0px", "60px"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* ── Sky plane (top half, subtle) ───────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          perspective: "500px",
          perspectiveOrigin: "50% 100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(-80deg)",
            transformOrigin: "50% 100%",
            backgroundImage: `
              linear-gradient(${color}33 1px, transparent 1px),
              linear-gradient(90deg, ${color}33 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage:
              "linear-gradient(to top, black 0%, transparent 50%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 0%, transparent 50%)",
          }}
        />
      </div>

      {/* ── Horizon glow line ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "2px",
          background: color,
          boxShadow: `
            0 0 20px 4px ${color},
            0 0 60px 10px ${color}88,
            0 0 120px 20px ${color}44
          `,
        }}
      />

      {/* ── Ambient horizon glow ───────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "200px",
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, ${color}15 0%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}
