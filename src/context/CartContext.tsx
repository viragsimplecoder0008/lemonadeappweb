import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "../types";
import { toast } from "@/components/ui/sonner";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  addQuantityToCart: (product: Product, quantity: number, isBulkOrder?: boolean) => void;
  removeFromCart: (productId: string) => void;
  removeQuantityFromCart: (productId: string, amountToRemove: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("lemonade-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lemonade-cart", JSON.stringify(cartItems));
    
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(itemCount);
    
    const cartSubtotal = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity, 
      0
    );
    setSubtotal(cartSubtotal);
  }, [cartItems]);

  const addToCart = (product: Product) => {
    addQuantityToCart(product, 1, false);
  };

  const addQuantityToCart = (product: Product, quantityToAdd: number, isBulkOrder: boolean = false) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const targetQty = currentQty + quantityToAdd;

      if (!isBulkOrder && targetQty > 5) {
        toast("Maximum standard quantity reached", {
          description: `Without a Bulk Order, you can only get up to 5 ${product.name}s.`
        });
        const allowedAdd = Math.max(0, 5 - currentQty);
        if (allowedAdd <= 0) return prevItems;
        
        toast("Item added to cart", {
          description: `Added ${allowedAdd} ${product.name} to cart (capped at 5).`
        });
        return existingItem
          ? prevItems.map(i => i.product.id === product.id ? { ...i, quantity: 5 } : i)
          : [...prevItems, { product, quantity: 5 }];
      }

      if (isBulkOrder && targetQty > 50) {
        toast("Maximum bulk quantity reached", {
          description: "Bulk Orders are limited to any amount below 50 items."
        });
        return existingItem
          ? prevItems.map(i => i.product.id === product.id ? { ...i, quantity: 50 } : i)
          : [...prevItems, { product, quantity: 50 }];
      }

      toast("Item added to cart", {
        description: `Added ${quantityToAdd} ${product.name} to your cart.${isBulkOrder ? " (Bulk Order)" : ""}`
      });

      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      } else {
        return [...prevItems, { product, quantity: quantityToAdd }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.product.id !== productId)
    );
    
    toast("Item removed from cart");
  };

  const removeQuantityFromCart = (productId: string, amountToRemove: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === productId);
      if (!existingItem) return prevItems;

      const newQty = existingItem.quantity - amountToRemove;
      if (newQty <= 0) {
        toast("Item removed from cart", {
          description: `${existingItem.product.name} removed from your cart.`
        });
        return prevItems.filter(item => item.product.id !== productId);
      }

      toast("Cart updated", {
        description: `Removed ${amountToRemove} ${existingItem.product.name}(s) from cart.`
      });
      return prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQty }
          : item
      );
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity > 5) {
      toast("Maximum quantity reached", {
        description: "You can only add up to 5 of each product to your cart."
      });
      quantity = 5;
    }
    
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast("Cart cleared");
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity, 
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addQuantityToCart,
        removeFromCart,
        removeQuantityFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        getTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
