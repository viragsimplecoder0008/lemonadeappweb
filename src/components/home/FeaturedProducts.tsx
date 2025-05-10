import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";
const FeaturedProducts: React.FC = () => {
  // Get featured products (first 4 products)
  const featuredProducts = products.slice(0, 4);
  return <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Lemonade we think you would LOVE!</h2>
          <p className="mt-2 text-gray-600">We hope you do lve these</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
        <div className="mt-12 text-center">
          <Button asChild className="bg-lemonade-yellow hover:bg-lemonade-green text-black px-8">
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>;
};
export default FeaturedProducts;