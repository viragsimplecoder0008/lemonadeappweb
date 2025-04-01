
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, LogOut, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (data && data.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };

    checkAdminStatus();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-lemonade-yellow">Lemonade</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-10">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="font-medium hover:text-lemonade-yellow transition-colors">
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] grid-cols-2">
                    <li>
                      <Link to="/products?category=classic" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent">
                        <div className="font-medium">Classic</div>
                        <div className="text-sm text-muted-foreground">Our original recipes</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/products?category=specialty" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent">
                        <div className="font-medium">Specialty</div>
                        <div className="text-sm text-muted-foreground">Unique flavor combinations</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/products?category=premium" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent">
                        <div className="font-medium">Premium</div>
                        <div className="text-sm text-muted-foreground">Our most exclusive blends</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/products" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent">
                        <div className="font-medium">All Products</div>
                        <div className="text-sm text-muted-foreground">Browse our entire collection</div>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/orders" className="font-medium hover:text-lemonade-yellow transition-colors">
                  Track Order
                </Link>
              </NavigationMenuItem>
              {isAdmin && (
                <NavigationMenuItem>
                  <Link 
                    to="/add-product" 
                    className="font-medium hover:text-lemonade-yellow transition-colors flex items-center"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-lemonade-yellow text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-6 w-6" />
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Home
                </Link>
                <Link to="/products" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  All Products
                </Link>
                <Link to="/orders" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Track Order
                </Link>
                {isAdmin && (
                  <Link 
                    to="/add-product" 
                    className="font-medium text-lg hover:text-lemonade-yellow transition-colors"
                  >
                    Add Product
                  </Link>
                )}
                <Button 
                  onClick={handleLogout} 
                  variant="ghost" 
                  className="justify-start text-lg font-medium hover:text-lemonade-yellow transition-colors"
                >
                  <LogOut className="mr-2 h-5 w-5" /> Logout
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
