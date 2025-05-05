
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CommunityHelp from "./CommunityHelp";
import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  showCommunityHelp?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showCommunityHelp = true }) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className="flex flex-col min-h-screen bg-repeat"
      style={{
        backgroundImage: "url('/lovable-uploads/e90c5a89-271b-4ebb-82f2-12bbc2e388fa.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "300px",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />
      <main className={`flex-grow bg-white/90 backdrop-blur-sm ${isMobile ? 'pb-20' : ''}`}>
        {children}
      </main>
      {showCommunityHelp && <CommunityHelp />}
      <Link 
        to="/mini-game" 
        className={`fixed ${isMobile ? 'bottom-24' : 'bottom-5'} right-5 bg-lemonade-yellow p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-50`}
        aria-label="Play Lemon Catcher Mini Game"
      >
        <Gamepad2 className="h-6 w-6 text-lemonade-dark" />
      </Link>
      <Footer />
    </div>
  );
};

export default Layout;
