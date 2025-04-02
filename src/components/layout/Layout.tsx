
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CommunityHelp from "./CommunityHelp";

interface LayoutProps {
  children: React.ReactNode;
  showCommunityHelp?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showCommunityHelp = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      {showCommunityHelp && <CommunityHelp />}
      <Footer />
    </div>
  );
};

export default Layout;
