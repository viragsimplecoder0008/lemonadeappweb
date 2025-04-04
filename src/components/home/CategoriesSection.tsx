
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CategoriesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <p className="mt-2 text-gray-600">Find the perfect lemonade for any occasion</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="w-20 h-20 bg-lemonade-yellow/20 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-lemonade-yellow font-bold">Classic</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Classic Varieties</h3>
            <p className="text-gray-600 mb-4">Our timeless recipes that never go out of style.</p>
            <Button 
              asChild
              variant="outline" 
              className="border-lemonade-yellow text-lemonade-dark hover:bg-lemonade-light"
            >
              <Link to="/products?category=classic">Shop Classic</Link>
            </Button>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="w-20 h-20 bg-lemonade-green/20 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-lemonade-green font-bold">Specialty</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Specialty Blends</h3>
            <p className="text-gray-600 mb-4">Unique flavor combinations for the adventurous palette.</p>
            <Button 
              asChild
              variant="outline" 
              className="border-lemonade-green text-lemonade-dark hover:bg-lemonade-light"
            >
              <Link to="/products?category=specialty">Shop Specialty</Link>
            </Button>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="w-20 h-20 bg-lemonade-pink/20 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-lemonade-pink font-bold">Premium</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Collection</h3>
            <p className="text-gray-600 mb-4">Luxury lemonade for the most discerning customers.</p>
            <Button 
              asChild
              variant="outline" 
              className="border-lemonade-pink text-lemonade-dark hover:bg-lemonade-light"
            >
              <Link to="/products?category=premium">Shop Premium</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
