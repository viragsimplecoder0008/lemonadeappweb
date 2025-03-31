
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState(categoryParam || "all");
  
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
      setFilteredProducts(
        products.filter(product => product.category === categoryParam)
      );
    } else {
      setActiveCategory("all");
      setFilteredProducts(products);
    }
  }, [categoryParam]);
  
  const handleFilterChange = (category: string) => {
    setActiveCategory(category);
    
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(product => product.category === category)
      );
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Our Lemonade Collection</h1>
          <p className="text-gray-600 mt-2">
            Discover our handcrafted lemonade varieties for every taste
          </p>
        </div>
        
        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            onClick={() => handleFilterChange("all")}
            className={activeCategory === "all" ? "bg-lemonade-yellow text-black hover:bg-lemonade-green" : ""}
          >
            All
          </Button>
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
          <Button
            variant={activeCategory === "premium" ? "default" : "outline"}
            onClick={() => handleFilterChange("premium")}
            className={activeCategory === "premium" ? "bg-lemonade-yellow text-black hover:bg-lemonade-green" : ""}
          >
            Premium
          </Button>
        </div>
        
        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductsPage;
