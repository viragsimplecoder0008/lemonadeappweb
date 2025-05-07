import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { ModeToggle } from "@/components/ModeToggle";

const Navbar = () => {
  const { cartItems } = useCart();
  const { isAdmin, isEmployee } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Lemonade Stand</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium hover:text-primary">
              Products
            </Link>
            <Link to="/mini-game" className="text-sm font-medium hover:text-primary">
              Mini Game
            </Link>
            <Link to="/vip" className="text-sm font-medium hover:text-primary">
              VIP
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium text-[#9b87f5] hover:text-[#8975e8]">
                Admin Dashboard
              </Link>
            )}
            {isEmployee && (
              <Link to="/employee" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                Employee
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 hover:text-primary" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1 py-0.5">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:w-64">
                <div className="grid gap-4 py-4">
                  <Link to="/" className="text-sm font-medium hover:text-primary block">
                    Home
                  </Link>
                  <Link to="/products" className="text-sm font-medium hover:text-primary block">
                    Products
                  </Link>
                   <Link to="/mini-game" className="text-sm font-medium hover:text-primary block">
                    Mini Game
                  </Link>
                  <Link to="/vip" className="text-sm font-medium hover:text-primary block">
                    VIP
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="text-sm font-medium text-[#9b87f5] hover:text-[#8975e8] block">
                      Admin Dashboard
                    </Link>
                  )}
                  {isEmployee && (
                    <Link to="/employee" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 block">
                      Employee
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
    </header>
  );
};

export default Navbar;
