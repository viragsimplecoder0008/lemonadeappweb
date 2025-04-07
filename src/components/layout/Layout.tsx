
import React, { createContext, useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CommunityHelp from "./CommunityHelp";

interface LayoutProps {
  children: React.ReactNode;
  showCommunityHelp?: boolean;
}

export const AdminModeContext = createContext<{
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isAdmin: false,
  setIsAdmin: () => {},
});

export const useAdminMode = () => useContext(AdminModeContext);

const Layout: React.FC<LayoutProps> = ({ children, showCommunityHelp = true }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem("adminMode") === "true";
    setIsAdmin(adminStatus);
  }, []);

  return (
    <AdminModeContext.Provider value={{ isAdmin, setIsAdmin }}>
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
    </AdminModeContext.Provider>
  );
};

export default Layout;
