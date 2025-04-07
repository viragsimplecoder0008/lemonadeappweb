
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);

  // Load admin status from localStorage on component mount
  useEffect(() => {
    const adminStatus = localStorage.getItem("adminMode") === "true";
    setIsAdmin(adminStatus);
  }, []);

  const toggleAdminMode = () => {
    const newAdminStatus = !isAdmin;
    setIsAdmin(newAdminStatus);
    localStorage.setItem("adminMode", newAdminStatus.toString());
  };

  return (
    <header className={`sticky top-0 z-40 w-full border-b ${isAdmin ? 'bg-amber-50/95' : 'bg-background/95'} backdrop-blur supports-[backdrop-filter]:bg-background/60`}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-lemonade-yellow">Lemonade</span>
          {isAdmin && (
            <Badge variant="outline" className="ml-2 bg-amber-200 text-amber-800 border-amber-300">
              Admin Mode
            </Badge>
          )}
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

          {/* Admin Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={isAdmin ? "text-amber-700" : ""}>
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleAdminMode}>
                {isAdmin ? "Exit Admin Mode" : "Admin Mode"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                <Link to="/products?category=classic" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Classic
                </Link>
                <Link to="/products?category=specialty" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Specialty
                </Link>
                <Link to="/products?category=premium" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Premium
                </Link>
                <Link to="/orders" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Track Order
                </Link>
                <Link to="/cart" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Cart ({totalItems})
                </Link>
                <Button 
                  variant={isAdmin ? "outline" : "ghost"}
                  className={`mt-4 justify-start ${isAdmin ? "bg-amber-100 text-amber-800 border-amber-300" : ""}`}
                  onClick={toggleAdminMode}
                >
                  {isAdmin ? "Exit Admin Mode" : "Admin Mode"}
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
