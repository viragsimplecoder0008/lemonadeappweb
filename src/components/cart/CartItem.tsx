
import React from "react";
import { CartItem as CartItemType } from "@/types";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductQuantity from "../products/ProductQuantity";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  // Fallback image function with dynamic placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `https://source.unsplash.com/100x100/?lemonade,${product.name.toLowerCase()}`;
  };

  const handleRemove = () => {
    removeFromCart(product.id);
    toast.success(`Removed ${product.name} from your cart`);
  };

  return (
    <div className="flex items-center py-4 border-b">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        <img
          src={product.imageUrl || `https://source.unsplash.com/100x100/?lemonade,${product.name.toLowerCase()}`}
          alt={product.name}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="font-medium text-base">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">₹{product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center ml-4">
        <ProductQuantity
          quantity={quantity}
          onChange={(newQuantity) => updateQuantity(product.id, newQuantity)}
        />
      </div>
      <div className="text-right ml-4 flex-shrink-0">
        <p className="font-medium">₹{(product.price * quantity).toFixed(2)}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="text-red-500 mt-1 h-6 w-6"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
