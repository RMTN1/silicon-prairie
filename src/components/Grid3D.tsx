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
 * Full-viewport 3D perspective grid.
 * The horizon sits at the vertical center of the viewport and the grid
 * recedes away from the viewer into the distance.
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
      {/*
        The perspective container sits in the bottom half of the viewport.
        perspectiveOrigin "50% 0%" places the vanishing point at the
        top edge of this container — the vertical center of the screen.
      */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          bottom: 0,
          perspective: "600px",
          perspectiveOrigin: "50% 0%",
        }}
      >
        {/* ── Base grid ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(75deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `
              linear-gradient(${color}55 1.5px, transparent 1.5px),
              linear-gradient(90deg, ${color}55 1.5px, transparent 1.5px)
            `,
            backgroundSize: "80px 80px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 20%, black 75%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 20%, black 75%, transparent 100%)",
          }}
        />

        {/* ── Glowing pulse layer ── */}
        <motion.div
          animate={{ opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(75deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `
              linear-gradient(${color}99 1.5px, transparent 1.5px),
              linear-gradient(90deg, ${color}99 1.5px, transparent 1.5px)
            `,
            backgroundSize: "80px 80px",
            filter: "blur(1px)",
            maskImage:
              "radial-gradient(ellipse 70% 80% at 50% 20%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 80% at 50% 20%, black, transparent)",
          }}
        />

        {/* ── Moving lines — grid rushing toward viewer ── */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(75deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `linear-gradient(${color}44 1.5px, transparent 1.5px)`,
            backgroundSize: "80px 80px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 20%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 20%, transparent 100%)",
          }}
          animate={{ backgroundPositionY: ["0px", "80px"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* ── Horizon glow at the center line ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          height: "120px",
          background: `radial-gradient(ellipse, ${color}22 0%, transparent 70%)`,
          filter: "blur(18px)",
        }}
      />
    </div>
  );
}
