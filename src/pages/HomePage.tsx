
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";

const HomePage: React.FC = () => {
  // Get featured products (first 4 products)
  const featuredProducts = products.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        {/* Hero Image */}
        <div className="bg-lemonade-light h-[500px] flex items-center">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-lemonade-dark leading-tight">
                Lemonade <br />
                <span className="text-lemonade-yellow">For Every Taste</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-md">
                Experience the perfect blend of sweet and tart with our handcrafted lemonade varieties.
              </p>
              <div className="flex space-x-4">
                <Button 
                  asChild
                  className="bg-lemonade-yellow hover:bg-lemonade-green text-black px-8 py-6"
                >
                  <Link to="/products">Shop Now</Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  className="border-lemonade-yellow text-lemonade-dark hover:bg-lemonade-light px-8 py-6"
                >
                  <Link to="/products">Our Flavors</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              {/* Replace placeholder with the real image */}
              <div className="w-full h-80 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/lovable-uploads/34afd845-7e6b-498a-bb33-2e14782750c6.png" 
                  alt="Lemonade with yellow umbrella" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Customer Favorites</h2>
            <p className="mt-2 text-gray-600">Our most popular lemonade varieties</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button 
              asChild
              className="bg-lemonade-yellow hover:bg-lemonade-green text-black px-8"
            >
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
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

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Customers Say</h2>
            <p className="mt-2 text-gray-600">Don't just take our word for it</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-1 mb-4 text-lemonade-yellow">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.585l-7.07 3.716 1.35-7.874L.36 7.088l7.899-1.147L10 0l2.739 5.942 7.9 1.147-4.92 4.339 1.35 7.874z"
                    />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The mint lemonade is absolutely refreshing. It's my go-to drink during summer months!"
              </p>
              <p className="font-semibold">— Sarah J.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-1 mb-4 text-lemonade-yellow">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.585l-7.07 3.716 1.35-7.874L.36 7.088l7.899-1.147L10 0l2.739 5.942 7.9 1.147-4.92 4.339 1.35 7.874z"
                    />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "I tried the Jaljeera lemonade and was blown away by the complexity of flavors. Absolutely delicious!"
              </p>
              <p className="font-semibold">— Michael T.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-1 mb-4 text-lemonade-yellow">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.585l-7.07 3.716 1.35-7.874L.36 7.088l7.899-1.147L10 0l2.739 5.942 7.9 1.147-4.92 4.339 1.35 7.874z"
                    />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Fast shipping and the lemonades arrived perfectly packaged. The rose lemonade is my new favorite drink!"
              </p>
              <p className="font-semibold">— Emily R.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
