import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Youtube, UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeMessage } from "@/components/admin/EmployeeMessage";
import { AdminMessages } from "@/components/admin/AdminMessages";
import { AdminVerification } from "@/components/admin/AdminVerification";
import { useAdmin } from "@/context/AdminContext";
const Footer: React.FC = () => {
  const {
    isAdmin,
    isEmployee,
    setAdminMode,
    setEmployeeMode
  } = useAdmin();
  const [showEmployeeMessage, setShowEmployeeMessage] = useState(false);
  const [showAdminMessages, setShowAdminMessages] = useState(false);
  const [showAdminVerification, setShowAdminVerification] = useState(false);
  const toggleEmployeeMode = () => {
    if (!isEmployee) {
      setEmployeeMode(true);
    } else {
      setEmployeeMode(false);
    }
  };
  const toggleAdminMode = () => {
    if (!isAdmin) {
      setShowAdminVerification(true);
    } else {
      setAdminMode(false);
    }
  };
  const handleEmployeeAction = () => {
    if (isEmployee) {
      setShowEmployeeMessage(true);
    } else {
      toggleEmployeeMode();
    }
  };
  const handleAdminAction = () => {
    if (isAdmin) {
      setShowAdminMessages(true);
    } else {
      toggleAdminMode();
    }
  };
  return <footer className="bg-lemonade-dark text-white">
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Lemonade</h3>
            <p className="text-sm text-gray-300">
              Premium lemonade crafted with the finest ingredients,
              bringing a refreshing taste to your everyday life.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-lemonade-yellow transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-gray-300 hover:text-lemonade-yellow transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-300 hover:text-lemonade-yellow transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-gray-300 hover:text-lemonade-yellow transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-sm text-gray-300 hover:text-lemonade-yellow transition-colors">
                  Docs
                </Link>
              </li>
              <li>
                <Link to="/vip" className="text-sm text-gray-300 hover:text-lemonade-yellow transition-colors">
                  VIP Management
                </Link>
              </li>
              {isAdmin && <li>
                  <Link to="/admin" className="text-sm text-gray-300 hover:text-lemonade-yellow transition-colors">
                    Admin Dashboard
                  </Link>
                </li>}
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.youtube.com/channel/UCX13lUjUN2Lz9ScObp2XHxg" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-lemonade-yellow transition-colors flex items-center">
                <Youtube className="mr-2" />
                YouTube
              </a>
            </div>
            
            <div className="mt-6 space-y-2">
              <Button variant="outline" size="sm" className={`w-full ${isEmployee ? 'bg-lemonade-yellow text-black' : 'bg-transparent text-gray-300'}`} onClick={handleEmployeeAction}>
                <UserPlus className="mr-2 h-4 w-4" />
                {isEmployee ? "Send Message to Admin" : "Employee Mode"}
              </Button>
              
              <Button variant="outline" size="sm" className={`w-full ${isAdmin ? 'bg-lemonade-yellow text-black' : 'bg-transparent text-gray-300'}`} onClick={handleAdminAction}>
                <User className="mr-2 h-4 w-4" />
                {isAdmin ? "View Employee Messages" : "Admin Mode"}
              </Button>
              
              {isAdmin && <Button variant="outline" size="sm" className="w-full bg-lemonade-yellow text-black" onClick={() => window.location.href = "/admin"}>
                  Admin Dashboard
                </Button>}
            </div>
          </div>
        </div>
      </div>
      
      {/* Dialog components */}
      <EmployeeMessage isOpen={showEmployeeMessage} onClose={() => setShowEmployeeMessage(false)} />
      
      <AdminMessages isOpen={showAdminMessages} onClose={() => setShowAdminMessages(false)} />
      
      <AdminVerification isOpen={showAdminVerification} onClose={() => setShowAdminVerification(false)} />
    </footer>;
};
export default Footer;