
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface ProductQuantityProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
  min?: number;
}

const ProductQuantity: React.FC<ProductQuantityProps> = ({ 
  quantity, 
  onChange, 
  max = 5, 
  min = 1 
}) => {
  const increment = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        onClick={decrement}
        disabled={quantity <= min}
        className="h-8 w-8"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-12 text-center font-medium">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={increment}
        disabled={quantity >= max}
        className="h-8 w-8"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default ProductQuantity;
