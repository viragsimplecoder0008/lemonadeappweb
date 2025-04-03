import React from "react";
import { Link } from "react-router-dom";
import { Youtube } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-lemonade-dark text-white">
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Lemonade Luxury</h3>
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
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-lemonade-yellow transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-lemonade-yellow transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-lemonade-yellow transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-lemonade-yellow transition-colors">
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://www.youtube.com/channel/UCX13lUjUN2Lz9ScObp2XHxg" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-lemonade-yellow transition-colors flex items-center"
              >
                <Youtube className="mr-2" />
                YouTube
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Lemonade Luxury. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
