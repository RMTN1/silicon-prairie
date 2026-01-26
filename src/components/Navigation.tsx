import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Navigation = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="mx-auto max-w-7xl">
        <div className="glass-card rounded-full px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="h-10 w-10 rounded-lg gradient-neon flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-lg">SP</span>
              </div>
              <div className="absolute inset-0 rounded-lg gradient-neon opacity-50 blur-md -z-10" />
            </div>
            <span className="font-display font-semibold text-xl text-foreground">
              Silicon<span className="text-gradient-neon">Prairie</span>
            </span>
          </motion.div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#hero" className="text-foreground/80 hover:text-primary transition-colors link-glow">
              Network
            </a>
            <a href="#about" className="text-foreground/80 hover:text-primary transition-colors link-glow">
              Mission
            </a>
            <a href="#join" className="text-foreground/80 hover:text-primary transition-colors link-glow">
              Join
            </a>
          </div>

          {/* Client Portal */}
          <Button 
            variant="outline" 
            className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
          >
            <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Client Portal
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
