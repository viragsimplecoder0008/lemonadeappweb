import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { Slider } from "@/components/ui/slider";

const HeroSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Auto-advance the slider every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setCurrentImageIndex(Math.floor((value[0] / 100) * (products.length - 1)));
  };

  return (
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
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            {/* Product Image Showcase */}
            <div className="w-full h-80 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={products[currentImageIndex].imageUrl || `https://source.unsplash.com/400x400/?lemonade,${products[currentImageIndex].name.toLowerCase()}`}
                  alt={products[currentImageIndex].name} 
                  className="w-full h-full object-cover transition-opacity duration-500"
                  onError={(e) => {
                    e.currentTarget.src = `https://source.unsplash.com/400x400/?lemonade,${products[currentImageIndex].name.toLowerCase()}`;
                  }}
                />
              </div>
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <div className="bg-black/30 p-2 rounded-lg backdrop-blur-sm">
                  <p className="text-white text-center font-medium">
                    {products[currentImageIndex].name}
                  </p>
                  <Slider
                    value={[(currentImageIndex / (products.length - 1)) * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleSliderChange}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
