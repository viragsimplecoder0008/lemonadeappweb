import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { Slider } from "@/components/ui/slider";

const HeroSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance product showcase slider every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSliderChange = (value: number[]) => {
    setCurrentImageIndex(Math.floor((value[0] / 100) * (products.length - 1)));
  };

  return (
    <section className="relative">
      <div className="bg-lemonade-light/80 dark:bg-slate-900/90 transition-colors duration-300 h-[500px] flex items-center border-b border-gray-200/50 dark:border-slate-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-lemonade-dark dark:text-slate-100 leading-tight">
              Lemonade <br />
              <span className="text-lemonade-yellow">For Every Taste</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-slate-300 max-w-md">
              Experience the perfect blend of sweet and tart with our handcrafted* lemonade varieties.
            </p>
            <div className="flex space-x-4">
              <Button asChild className="bg-lemonade-yellow hover:bg-lemonade-green text-slate-950 font-semibold px-8 py-6 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md">
                <Link to="/products">Shop Now</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="w-full h-80 rounded-lg overflow-hidden relative shadow-xl border border-white/20 dark:border-slate-800">
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <img
                  src={
                    products[currentImageIndex]?.imageUrl ||
                    "/lovable-uploads/d7db3374-6ea0-4b1c-acc3-03ca449c70d0.png"
                  }
                  alt={products[currentImageIndex]?.name || "Lemonade"}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "/lovable-uploads/d7db3374-6ea0-4b1c-acc3-03ca449c70d0.png";
                  }}
                />
              </div>
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <div className="bg-black/60 p-3 rounded-lg backdrop-blur-md border border-white/10">
                  <p className="text-white text-center font-medium text-sm">
                    {products[currentImageIndex]?.name}
                  </p>
                  <Slider
                    value={[(currentImageIndex / Math.max(1, products.length - 1)) * 100]}
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