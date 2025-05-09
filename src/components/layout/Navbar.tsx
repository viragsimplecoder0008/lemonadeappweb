
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, Home, Package, Truck, Search, FileText, Star, Keyboard } from "lucide-react";
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
import { useCart } from "@/context/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { KeyboardShortcutsHelp } from "@/components/ui/keyboard-shortcuts-help";

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const isMobile = useIsMobile();

  return (
    <>
      {/* Desktop Navigation */}
      <header className={`${isMobile ? 'hidden' : 'sticky top-0'} z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}>
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-lemonade-yellow">Lemonade</span>
          </Link>

          <div className="hidden md:flex md:gap-10">
            <NavigationMenu>
              <NavigationMenuList className="space-x-4">
                <NavigationMenuItem>
                  <Link to="/" className="font-medium hover:text-lemonade-yellow transition-colors px-2">
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="mx-2">
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
                <NavigationMenuItem className="mx-2">
                  <Link to="/orders" className="font-medium hover:text-lemonade-yellow transition-colors px-2">
                    Track Order
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="mx-2">
                  <Link to="/docs" className="font-medium hover:text-lemonade-yellow transition-colors px-2">
                    Docs
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="mx-2">
                  <Link to="/vip" className="font-medium hover:text-lemonade-yellow transition-colors flex items-center px-2">
                    <Star className="mr-1 h-4 w-4 text-lemonade-yellow" />
                    VIP
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <KeyboardShortcutsHelp />
            <Link to="/search" className="relative" aria-label="Search">
              <Search className="h-6 w-6" />
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-lemonade-yellow text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Desktop menu */}
            <Sheet>
              <SheetTrigger asChild className="md:block hidden">
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
                  <Link to="/docs" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                    Docs
                  </Link>
                  <Link to="/search" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                    Search
                  </Link>
                  <Link to="/vip" className="font-medium text-lg hover:text-lemonade-yellow transition-colors flex items-center">
                    <Star className="mr-2 h-5 w-5 text-lemonade-yellow" />
                    VIP Management
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation (Bottom bar) */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex items-center justify-around py-2">
          <Link to="/" className="flex flex-col items-center p-2">
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/products" className="flex flex-col items-center p-2">
            <Package className="h-5 w-5" />
            <span className="text-xs mt-1">Products</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center p-2">
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </Link>
          <Link to="/orders" className="flex flex-col items-center p-2">
            <Truck className="h-5 w-5" />
            <span className="text-xs mt-1">Orders</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center p-2 relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-lemonade-yellow text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="text-xs mt-1">Cart</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 flex flex-col items-center">
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <nav className="flex flex-col gap-4 mt-8 pb-16">
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
                <Link to="/docs" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Docs
                </Link>
                <Link to="/search" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Search
                </Link>
                <Link to="/vip" className="font-medium text-lg hover:text-lemonade-yellow transition-colors flex items-center">
                  <Star className="mr-2 h-5 w-5 text-lemonade-yellow" />
                  VIP Management
                </Link>
                <div className="mt-4">
                  <KeyboardShortcutsHelp />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      )}
    </>
  );
};

export default Navbar;
