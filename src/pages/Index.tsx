import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";
import Grid3D from "@/components/Grid3D";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Grid3D opacity={0.45} />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <JoinSection />
      <Footer />
    </div>
  );
};

export default Index;
