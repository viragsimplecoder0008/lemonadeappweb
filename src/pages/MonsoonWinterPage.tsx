import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import { monsoonWinterProducts } from "@/data/monsoonWinterProducts";
import { Button } from "@/components/ui/button";
import CustomOrderDialog from "@/components/products/CustomOrderDialog";
import { CloudRain, Snowflake } from "lucide-react";

const MonsoonWinterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const quickModeParam = searchParams.get("quick");
  const [filteredProducts, setFilteredProducts] = useState(monsoonWinterProducts);
  const [activeCategory, setActiveCategory] = useState(categoryParam || "all");
  const [isQuickMode, setIsQuickMode] = useState(quickModeParam === "true");

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
      setFilteredProducts(monsoonWinterProducts.filter((product) => product.category === categoryParam));
    } else {
      setActiveCategory("all");
      setFilteredProducts(monsoonWinterProducts);
    }
    setIsQuickMode(quickModeParam === "true");
  }, [categoryParam, quickModeParam]);

  const handleFilterChange = (category: string) => {
    setActiveCategory(category);
    if (category === "all") {
      setFilteredProducts(monsoonWinterProducts);
    } else {
      setFilteredProducts(monsoonWinterProducts.filter((product) => product.category === category));
    }
  };

  const handleRevertToNormalMode = () => {
    setIsQuickMode(false);
    setSearchParams((prev) => {
      prev.delete("quick");
      return prev;
    });
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
          <div className="ml-auto">
            <CustomOrderDialog />
          </div>
        </div>

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} storageKey="monsoon_winter_products" />
        ) : (
          <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-gray-300 my-4">
            <p className="text-lg font-medium text-gray-700 mb-1">Monsoon / Winter Products</p>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
              Right-click any product card to Edit, Mark Out of Stock, Delete, or Add New products to the Monsoon / Winter collection.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MonsoonWinterPage;
