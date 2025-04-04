
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
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
  );
};

export default HeroSection;
