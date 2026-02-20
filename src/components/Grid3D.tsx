import { motion } from "framer-motion";

interface Grid3DProps {
  /** 0–1 multiplier for overall opacity. Default 1. */
  opacity?: number;
  /** CSS position value for the root element. Default "fixed". */
  position?: "fixed" | "absolute";
}

/**
 * 3D corridor grid — white lines on muted cyan background.
 * Floor, ceiling, and side walls create an infinite room feel.
 */
export default function Grid3D({
  opacity = 1,
  position = "fixed",
}: Grid3DProps) {
  const lineColor = "rgba(255, 255, 255, 0.7)";
  const lineColorBright = "rgba(255, 255, 255, 0.9)";

  return (
    <div
      className="pointer-events-none"
      style={{ position, top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity }}
    >
      {/* ── Floor (bottom half) ────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          bottom: 0,
          perspective: "800px",
          perspectiveOrigin: "50% 0%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(85deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `
              linear-gradient(${lineColor} 1px, transparent 1px),
              linear-gradient(90deg, ${lineColor} 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        {/* Floor glow pulse */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(85deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `
              linear-gradient(${lineColorBright} 1px, transparent 1px),
              linear-gradient(90deg, ${lineColorBright} 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            filter: "blur(1px)",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 20%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 20%, black, transparent)",
          }}
        />
      </div>

      {/* ── Ceiling (top half) ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          perspective: "800px",
          perspectiveOrigin: "50% 100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(-85deg)",
            transformOrigin: "50% 100%",
            backgroundImage: `
              linear-gradient(${lineColor} 1px, transparent 1px),
              linear-gradient(90deg, ${lineColor} 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            maskImage: "linear-gradient(to top, black 0%, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Left wall ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          perspective: "800px",
          perspectiveOrigin: "100% 50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateY(85deg)",
            transformOrigin: "100% 50%",
            backgroundImage: `
              linear-gradient(${lineColor} 1px, transparent 1px),
              linear-gradient(90deg, ${lineColor} 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            maskImage: "linear-gradient(to right, black 0%, transparent 60%)",
            WebkitMaskImage: "linear-gradient(to right, black 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ── Right wall ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          perspective: "800px",
          perspectiveOrigin: "0% 50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateY(-85deg)",
            transformOrigin: "0% 50%",
            backgroundImage: `
              linear-gradient(${lineColor} 1px, transparent 1px),
              linear-gradient(90deg, ${lineColor} 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            maskImage: "linear-gradient(to left, black 0%, transparent 60%)",
            WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ── Horizon line ───────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "1px",
          background: "rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 20px 2px rgba(255, 255, 255, 0.3)",
        }}
      />

      {/* ── Center ambient glow ────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "60%",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
