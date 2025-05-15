
import React from "react";
import { products } from "@/data/products";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const ProductBanner: React.FC = () => {
  return (
    <div className="w-full py-4 bg-gradient-to-r from-lemonade-light to-lemonade-yellow/50">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Our Lemonade Collection</h2>
        <Carousel
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <div className="overflow-hidden rounded-lg bg-white shadow-md h-[220px]">
                    <img
                      src={product.imageUrl || `https://source.unsplash.com/300x300/?lemonade,${product.name.toLowerCase()}`}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://source.unsplash.com/300x300/?lemonade,${product.name.toLowerCase()}`;
                      }}
                    />
                  </div>
                  <h3 className="mt-2 text-center text-sm font-medium">{product.name}</h3>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default ProductBanner;
