import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Zap } from "lucide-react";
import InteractiveNode from "./InteractiveNode";
import heroPrairie from "@/assets/hero-prairie.jpg";

const nodes = [
  { type: "funder" as const, x: 20, y: 35, label: "AgriVenture Capital", delay: 0.8 },
  { type: "developer" as const, x: 45, y: 25, label: "NeuralHarvest Labs", delay: 1.0 },
  { type: "business" as const, x: 70, y: 40, label: "Prairie Analytics Co", delay: 1.2 },
  { type: "developer" as const, x: 30, y: 55, label: "Midwest AI Studio", delay: 1.4 },
  { type: "funder" as const, x: 55, y: 60, label: "Heartland Ventures", delay: 1.6 },
  { type: "business" as const, x: 80, y: 55, label: "Lincoln TechHub", delay: 1.8 },
  { type: "business" as const, x: 15, y: 65, label: "CropIntel Systems", delay: 2.0 },
  { type: "developer" as const, x: 65, y: 70, label: "DataPrairie", delay: 2.2 },
];

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroPrairie}
          alt="Digital Prairie"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 gradient-hero-overlay" />
        <div className="absolute inset-0 grid-overlay opacity-50" />
        
        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            animate={{ y: ["0vh", "100vh"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      {/* Interactive Nodes */}
      <div className="absolute inset-0 top-32">
        {nodes.map((node, index) => (
          <InteractiveNode key={index} {...node} />
        ))}
        
        {/* Connection lines between nodes */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(185 100% 50% / 0.1)" />
              <stop offset="50%" stopColor="hsl(185 100% 50% / 0.3)" />
              <stop offset="100%" stopColor="hsl(185 100% 50% / 0.1)" />
            </linearGradient>
          </defs>
          <motion.line
            x1="22%" y1="37%" x2="44%" y2="28%"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          />
          <motion.line
            x1="47%" y1="28%" x2="68%" y2="42%"
            stroke="url(#lineGradient)"
