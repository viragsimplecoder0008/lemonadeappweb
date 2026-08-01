import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingCart, Menu, Home, Package, Truck, Search, FileText, Keyboard, Users, ArrowLeft, EyeOff, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { useCart } from "@/context/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { KeyboardShortcutsHelp } from "@/components/ui/keyboard-shortcuts-help";
import AuthButton from "@/components/auth/AuthButton";
import { useTheme } from "@/context/ThemeContext";
interface NavbarProps {
  hasBanner?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hasBanner = false }) => {
  const {
    totalItems
  } = useCart();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const isQuickMode = searchParams.get("quick") === "true";
  const [showOnlyMenuIcon, setShowOnlyMenuIcon] = useState(false);
  const handleRevertToNormalMode = () => {
    setSearchParams(prev => {
      prev.delete("quick");
      return prev;
    });
    // Navigate to products page without quick mode
    window.location.href = "/products";
  };

  // Quick mode navbar (minimal)
  if (isQuickMode) {
    return <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-lemonade-yellow">Lemonade</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button onClick={handleRevertToNormalMode} variant="outline" className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Quick Mode
              <span className="ml-2 text-xs">(Progress will be lost)</span>
            </Button>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-lemonade-yellow text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>}
            </Link>
          </div>
        </div>
      </header>;
  }

  // Normal mode navbar (full navigation)
  return <>
      {/* Desktop Navigation */}
      <header className={`${isMobile ? 'hidden' : hasBanner ? 'fixed top-12 left-1/2 -translate-x-1/2' : 'fixed top-4 left-1/2 -translate-x-1/2'} z-40 w-[95%] max-w-7xl rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 backdrop-blur-xl shadow-2xl transition-all duration-300`}>
        <div className="flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center space-x-2 hover:scale-105 active:scale-95 transition-transform duration-200">
            <span className="text-xl font-bold text-lemonade-yellow">Lemonade</span>
          </Link>

          <div className="hidden md:flex md:gap-10">
            <NavigationMenu>
              <NavigationMenuList className="space-x-4">
                <NavigationMenuItem>
                  <Link to="/" className="font-medium hover:text-lemonade-yellow transition-all duration-200 hover:scale-105 inline-block px-2">
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="mx-2">
                  <NavigationMenuTrigger className="hover:scale-105 active:scale-95 transition-transform duration-200">Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] grid-cols-2">
                      <li>
                        <Link to="/products?category=classic" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:scale-[1.02] transition-all">
                          <div className="font-medium">Classic</div>
                          <div className="text-sm text-muted-foreground">Our original recipes</div>
                        </Link>
                      </li>
                      <li>
                        <Link to="/products?category=specialty" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:scale-[1.02] transition-all">
                          <div className="font-medium">Specialty</div>
                          <div className="text-sm text-muted-foreground">Unique flavor combinations</div>
                        </Link>
                      </li>
                      <li>
                        <Link to="/products?category=premium" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:scale-[1.02] transition-all">
                          <div className="font-medium">Golden Flavors</div>
                          <div className="text-sm text-muted-foreground">Our most exclusive blends</div>
                        </Link>
                      </li>
                      <li>
                        <Link to="/monsoon-winter" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:scale-[1.02] transition-all">
                          <div className="font-medium text-blue-600">Monsoon / Winter</div>
                          <div className="text-sm text-muted-foreground">Warm & cozy seasonal blends</div>
                        </Link>
                      </li>
                      <li>
                        <Link to="/products" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:scale-[1.02] transition-all">
                          <div className="font-medium">All Products</div>
                          <div className="text-sm text-muted-foreground">Browse our entire collection</div>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className="mx-2">
                  <NavigationMenuTrigger className="hover:scale-105 active:scale-95 transition-transform duration-200">Quick</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 w-[300px]">
                      <li>
                        <Link to="/products?category=specialty&quick=true" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:scale-[1.02] transition-all">
                          <div className="font-medium">Specialty Quick</div>
                          <div className="text-sm text-muted-foreground">Quick access to specialty flavors</div>
                        </Link>
                      </li>
                      <li>
                        <Link to="/products?category=classic&quick=true" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:scale-[1.02] transition-all">
                          <div className="font-medium">Classic Quick</div>
                          <div className="text-sm text-muted-foreground">Quick access to classic recipes</div>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className="mx-2">
                  <Link to="/orders" className="font-medium hover:text-lemonade-yellow transition-all duration-200 hover:scale-105 inline-block px-2">
                    Track Order
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="mx-2">
                  <Link to="/docs" className="font-medium hover:text-lemonade-yellow transition-all duration-200 hover:scale-105 inline-block px-2">
                    Docs
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="mx-2">
                  <Link to="/social" className="font-medium hover:text-lemonade-yellow transition-all duration-200 hover:scale-105 inline-block px-2">Social</Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="mx-2">
                  <Link to="/vip" className="font-medium hover:text-lemonade-yellow transition-all duration-200 hover:scale-105 inline-block px-2">
                    VIP
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <AuthButton />
            <KeyboardShortcutsHelp />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-90 hover:rotate-12 transition-all duration-200 flex items-center justify-center shadow-sm"
              aria-label="Toggle Theme"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400 fill-amber-400/20" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>
            <Link to="/search" className="relative hover:scale-110 active:scale-95 transition-transform duration-200 text-foreground hover:text-lemonade-yellow" aria-label="Search">
              <Search className="h-6 w-6" />
            </Link>
            <Link to="/cart" className="relative hover:scale-110 active:scale-95 transition-transform duration-200 text-foreground hover:text-lemonade-yellow">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-lemonade-yellow text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-bounce">
                  {totalItems}
                </span>}
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
                    Golden Flavors
                  </Link>
                  <Link to="/products?category=specialty&quick=true" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                    Quick - Specialty
                  </Link>
                  <Link to="/products?category=classic&quick=true" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                    Quick - Classic
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
                  <Link to="/social" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                    Social
                  </Link>
                  <Link to="/search" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                    Search
                  </Link>
                  <Link to="/vip" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                    VIP Management
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation (Floating bottom bar - 5 items max) */}
      {isMobile && !showOnlyMenuIcon && <nav className="fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 backdrop-blur-xl z-50 grid grid-cols-6 items-center py-2 rounded-2xl shadow-2xl transition-all duration-300">
          <Link to="/" className="flex flex-col items-center p-2">
            <Home className="h-5 w-5" />
            <span className="text-[10px] mt-1">Home</span>
          </Link>
          <Link to="/products" className="flex flex-col items-center p-2">
            <Package className="h-5 w-5" />
            <span className="text-[10px] mt-1">Products</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center p-2 relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && <span className="absolute top-0 right-3 bg-lemonade-yellow text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>}
            <span className="text-[10px] mt-1">Cart</span>
          </Link>
          <Link to="/orders" className="flex flex-col items-center p-2">
            <Truck className="h-5 w-5" />
            <span className="text-[10px] mt-1">Orders</span>
          </Link>
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center p-2"
            aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            <span className="text-[10px] mt-1">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 flex flex-col items-center">
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
              <nav className="flex flex-col gap-4 mt-8 pb-16">
                <Button 
                  onClick={() => setShowOnlyMenuIcon(true)}
                  variant="outline"
                  className="w-full justify-start gap-2 mb-4"
                >
                  <EyeOff className="h-4 w-4" />
                  Show only menu bar icon
                </Button>
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
                  Golden Flavors
                </Link>
                <Link to="/products?category=specialty&quick=true" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Quick - Specialty
                </Link>
                <Link to="/products?category=classic&quick=true" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Quick - Classic
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
                <Link to="/social" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Social
                </Link>
                <Link to="/search" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Search
                </Link>
                <Link to="/vip" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  VIP Management
                </Link>
                <div className="mt-4">
                  <AuthButton />
                </div>
                <div className="mt-4">
                  <KeyboardShortcutsHelp />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>}

      {/* Floating menu button when in minimal mode */}
      {isMobile && showOnlyMenuIcon && (
        <div className="fixed bottom-4 right-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg bg-primary hover:bg-primary/90">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
              <nav className="flex flex-col gap-4 mt-8 pb-16">
                <Button 
                  onClick={() => setShowOnlyMenuIcon(false)}
                  variant="outline"
                  className="w-full justify-start gap-2 mb-4"
                >
                  <Menu className="h-4 w-4" />
                  Show full menu bar
                </Button>
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
                  Golden Flavors
                </Link>
                <Link to="/products?category=specialty&quick=true" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Quick - Specialty
                </Link>
                <Link to="/products?category=classic&quick=true" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Quick - Classic
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
                <Link to="/social" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Social
                </Link>
                <Link to="/search" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  Search
                </Link>
                <Link to="/vip" className="font-medium text-lg hover:text-lemonade-yellow transition-colors">
                  VIP Management
                </Link>
                <div className="mt-4">
                  <AuthButton />
                </div>
                <div className="mt-4">
                  <KeyboardShortcutsHelp />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>;
};
export default Navbar;