import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { Slider } from "@/components/ui/slider";
import LunarGravityCard from "@/components/ui/lunar-gravity-card";
import { History, Sparkles } from "lucide-react";

const HeroSection: React.FC = () => {
  const [useLegacyHero, setUseLegacyHero] = useState<boolean>(() => {
    return localStorage.getItem("useLegacyHero") === "true";
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance legacy slider every 5 seconds
  useEffect(() => {
    if (!useLegacyHero) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [useLegacyHero]);

  const toggleHero = () => {
    setUseLegacyHero((prev) => {
      const next = !prev;
      localStorage.setItem("useLegacyHero", String(next));
      return next;
    });
  };

  const handleSliderChange = (value: number[]) => {
    setCurrentImageIndex(Math.floor((value[0] / 100) * (products.length - 1)));
  };

  return (
    <section className="relative transition-colors duration-300">
      {/* Toggle Button Bar */}
      <div className="container mx-auto px-4 pt-4 pb-2 flex justify-end">
        <Button
          onClick={toggleHero}
          variant="outline"
          className="rounded-full bg-white/90 dark:bg-slate-900/90 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:scale-105 active:scale-95 transition-all duration-200 text-xs font-semibold shadow-md gap-2"
        >
          {useLegacyHero ? (
            <>
              <Sparkles className="h-3.5 w-3.5 text-lemonade-yellow" />
              <span>Switch to 3D Hero</span>
            </>
          ) : (
            <>
              <History className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>Switch to Legacy hero</span>
            </>
          )}
        </Button>
      </div>

      {useLegacyHero ? (
        /* Legacy Hero Section */
        <div className="bg-lemonade-light dark:bg-slate-900/90 transition-colors duration-300 h-[500px] flex items-center border-b border-gray-200/50 dark:border-slate-800">
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
              <div className="w-full h-80 rounded-lg overflow-hidden relative shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <img
                    src={
                      products[currentImageIndex]?.imageUrl ||
                      `https://source.unsplash.com/400x400/?lemonade,${products[currentImageIndex]?.name.toLowerCase()}`
                    }
                    alt={products[currentImageIndex]?.name || "Lemonade"}
                    className="w-full h-full object-cover transition-opacity duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/lovable-uploads/d7db3374-6ea0-4b1c-acc3-03ca449c70d0.png";
                    }}
                  />
                </div>
                <div className="absolute bottom-4 left-0 right-0 px-4">
                  <div className="bg-black/50 p-3 rounded-lg backdrop-blur-md border border-white/10">
                    <p className="text-white text-center font-medium text-sm">
                      {products[currentImageIndex]?.name}
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
      ) : (
        /* 3D Gravity Hero Section */
        <div className="py-4 md:py-8 bg-lemonade-light/40 dark:bg-slate-900/60 transition-colors duration-300 border-b border-gray-200/50 dark:border-slate-800">
          <div className="container mx-auto px-4 flex justify-center">
            <LunarGravityCard />
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;