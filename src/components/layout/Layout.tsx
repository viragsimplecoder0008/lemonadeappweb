
import React, { useState } from "react";
import Navbar from "./Navbar";
import NewsBanner from "./NewsBanner";
import Footer from "./Footer";
import CommunityHelp from "./CommunityHelp";
import BackButton from "./BackButton";
import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { AdminVerification } from "@/components/admin/AdminVerification";
import HelpChat from "@/components/help/HelpChat";

interface LayoutProps {
  children: React.ReactNode;
  showCommunityHelp?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showCommunityHelp = true }) => {
  const isMobile = useIsMobile();
  const [showNewsBanner, setShowNewsBanner] = useState(true);
  // Initialize keyboard shortcuts and get admin verification state
  const { showAdminVerification, setShowAdminVerification } = useKeyboardShortcuts();
  
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
      {showNewsBanner && <NewsBanner onClose={() => setShowNewsBanner(false)} />}
      <Navbar hasBanner={showNewsBanner} />
      <main className={`flex-grow bg-white/90 backdrop-blur-sm ${isMobile ? (showNewsBanner ? 'pb-20 pt-10' : 'pb-20') : (showNewsBanner ? 'pt-32' : 'pt-24')} transition-all duration-300`}>
        <BackButton />
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
      <HelpChat />
      <Footer />
      
      {/* Admin Verification Dialog */}
      <AdminVerification 
        isOpen={showAdminVerification}
        onClose={() => setShowAdminVerification(false)}
      />
    </div>
  );
};

export default Layout;
