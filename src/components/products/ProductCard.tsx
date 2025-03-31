
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Fallback image function with a more attractive placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `https://source.unsplash.com/300x300/?lemonade,${product.name.toLowerCase()}`;
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`Added ${product.name} to your cart`);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link to={`/products/${product.id}`} className="block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl || `https://source.unsplash.com/300x300/?lemonade,${product.name.toLowerCase()}`}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={handleImageError}
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        </Link>
        <div className="mt-2">
          <span className="font-bold text-lg">₹{product.price.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
