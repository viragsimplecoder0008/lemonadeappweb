
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CommunityHelp from "./CommunityHelp";
import { AdminProvider } from "@/context/AdminContext";

interface LayoutProps {
  children: React.ReactNode;
  showCommunityHelp?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showCommunityHelp = true }) => {
  return (
    <AdminProvider>
      <div 
        className="flex flex-col min-h-screen"
        style={{
          backgroundImage: "url('/lovable-uploads/82dc5008-e07d-4ac3-99d0-6b35bc072ebc.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          backgroundAttachment: "fixed",
        }}
      >
        <Navbar />
        <main className="flex-grow bg-white/90 backdrop-blur-sm">{children}</main>
        {showCommunityHelp && <CommunityHelp />}
        <Footer />
      </div>
    </AdminProvider>
  );
};

export default Layout;
