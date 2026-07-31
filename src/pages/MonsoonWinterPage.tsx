import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import { monsoonWinterProducts } from "@/data/monsoonWinterProducts";
import { Button } from "@/components/ui/button";
import CustomOrderDialog from "@/components/products/CustomOrderDialog";
import { CloudRain, Snowflake, Plus } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types";

const MonsoonWinterPage: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const quickModeParam = searchParams.get("quick");
  const [filteredProducts, setFilteredProducts] = useState(monsoonWinterProducts);
  const [activeCategory, setActiveCategory] = useState(categoryParam || "all");
  const [isQuickMode, setIsQuickMode] = useState(quickModeParam === "true");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    id: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "classic",
    inStock: true,
  });

  useEffect(() => {
    let currentProducts = monsoonWinterProducts;
    try {
      const stored = localStorage.getItem("monsoon_winter_products");
      if (stored) currentProducts = JSON.parse(stored);
    } catch {
      currentProducts = monsoonWinterProducts;
    }

    if (categoryParam) {
      setActiveCategory(categoryParam);
      setFilteredProducts(currentProducts.filter((product) => product.category === categoryParam));
    } else {
      setActiveCategory("all");
      setFilteredProducts(currentProducts);
    }
    setIsQuickMode(quickModeParam === "true");
  }, [categoryParam, quickModeParam]);

  const handleFilterChange = (category: string) => {
    setActiveCategory(category);
    let currentProducts = monsoonWinterProducts;
    try {
      const stored = localStorage.getItem("monsoon_winter_products");
      if (stored) currentProducts = JSON.parse(stored);
    } catch {
      currentProducts = monsoonWinterProducts;
    }

    if (category === "all") {
      setFilteredProducts(currentProducts);
    } else {
      setFilteredProducts(currentProducts.filter((product) => product.category === category));
    }
  };

  const handleRevertToNormalMode = () => {
    setIsQuickMode(false);
    setSearchParams((prev) => {
      prev.delete("quick");
      return prev;
    });
  };

  const handleAddClick = () => {
    if (isAdmin) {
      setNewProduct({
        id: "",
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        category: "classic",
        inStock: true,
      });
      setIsAddDialogOpen(true);
    } else {
      setIsPasswordDialogOpen(true);
    }
  };

  const handlePasswordSubmit = () => {
    setIsPasswordDialogOpen(false);
    setPassword("");
    toast.error("Admin access required. Please sign in with an admin account.");
  };

  const handleAddSubmit = () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Product name and price are required!");
      return;
    }

    const formattedId = newProduct.name.trim().replace(/\s+/g, "-");

    const productToAdd: Product = {
      id: formattedId,
      name: newProduct.name.trim(),
      description: newProduct.description || "",
      price: Number(newProduct.price),
      imageUrl: newProduct.imageUrl || "",
      category: newProduct.category || "classic",
      inStock: true,
    };

    try {
      const stored: Product[] = JSON.parse(localStorage.getItem("monsoon_winter_products") || "[]");
      const updated = [...stored, productToAdd];
      localStorage.setItem("monsoon_winter_products", JSON.stringify(updated));
      setFilteredProducts(updated);
      toast.success(`${productToAdd.name} added to Monsoon / Winter collection!`);
      setIsAddDialogOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      toast.error("Failed to save product.");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Banner Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-10 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <CloudRain className="h-7 w-7 text-blue-400" />
            <Snowflake className="h-7 w-7 text-cyan-300" />
            <span className="text-xs uppercase tracking-widest text-blue-300 font-semibold">Seasonal Collection</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Monsoon & Winter Edition</h1>
          <p className="text-blue-100/90 text-sm md:text-base max-w-2xl">
            Warm, cozy, and spiced handcrafted lemonades crafted specifically for cozy rainy afternoons and chilly winter evenings.
          </p>
        </div>

        {/* Quick mode revert button */}
        {isQuickMode && (
          <div className="mb-6">
            <Button onClick={handleRevertToNormalMode} variant="outline" className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100">
              Revert Back to Normal Mode
            </Button>
          </div>
        )}

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          {!isQuickMode && (
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              onClick={() => handleFilterChange("all")}
              className={activeCategory === "all" ? "bg-lemonade-yellow text-black hover:bg-lemonade-green" : ""}
            >
              All
            </Button>
          )}
          <Button
            variant={activeCategory === "classic" ? "default" : "outline"}
            onClick={() => handleFilterChange("classic")}
            className={activeCategory === "classic" ? "bg-lemonade-yellow text-black hover:bg-lemonade-green" : ""}
          >
            Classic
          </Button>
          <Button
            variant={activeCategory === "specialty" ? "default" : "outline"}
            onClick={() => handleFilterChange("specialty")}
            className={activeCategory === "specialty" ? "bg-lemonade-yellow text-black hover:bg-lemonade-green" : ""}
          >
            Specialty
          </Button>
          {!isQuickMode && (
            <Button
              variant={activeCategory === "premium" ? "default" : "outline"}
              onClick={() => handleFilterChange("premium")}
              className={activeCategory === "premium" ? "bg-lemonade-yellow text-black hover:bg-lemonade-green" : ""}
            >
              Golden Flavors
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button onClick={handleAddClick} variant="outline" className="border-lemonade-yellow text-lemonade-dark hover:bg-lemonade-light">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <CustomOrderDialog />
          </div>
        </div>

        {/* Products grid wrapped in ContextMenu for empty-state right-click support */}
        <ContextMenu>
          <ContextMenuTrigger>
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} storageKey="monsoon_winter_products" />
            ) : (
              <div className="text-center py-20 bg-slate-50/70 rounded-2xl border-2 border-dashed border-gray-300 my-4 cursor-context-menu hover:bg-slate-100/50 transition-colors p-6">
                <CloudRain className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <p className="text-xl font-bold text-gray-800 mb-1">Monsoon & Winter Collection is Empty</p>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-5">
                  Right-click anywhere in this box (or click the button below) to open the menu and add your Monsoon / Winter products.
                </p>
                <Button onClick={handleAddClick} className="bg-lemonade-yellow hover:bg-lemonade-green text-black font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </div>
            )}
          </ContextMenuTrigger>

          <ContextMenuContent className="w-56">
            <ContextMenuItem onClick={handleAddClick} className="flex items-center cursor-pointer text-green-600 font-medium">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {/* Password dialog for non-admins */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Admin Authentication</DialogTitle>
              <DialogDescription>Please enter the admin password to add a new Monsoon / Winter product.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePasswordSubmit();
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasswordSubmit}>Verify</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Monsoon / Winter Product</DialogTitle>
              <DialogDescription>Enter the product details to add it to the Monsoon & Winter collection.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={newProduct.name || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Spiced Cinnamon Lemonade"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Warm honey and cinnamon infused drink for chilly weather..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                  placeholder="5.99"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newProduct.category || "classic"}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full mt-1 border rounded-md p-2 text-sm bg-background"
                >
                  <option value="classic">Classic</option>
                  <option value="specialty">Specialty</option>
                  <option value="premium">Golden Flavors</option>
                </select>
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={newProduct.imageUrl || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubmit} className="bg-lemonade-yellow text-black hover:bg-lemonade-green">
                Save Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MonsoonWinterPage;
