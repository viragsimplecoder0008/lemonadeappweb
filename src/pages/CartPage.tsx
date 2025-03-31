
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

const CartPage: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      Cart ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                    </h2>
                    <Button 
                      variant="ghost" 
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      Clear Cart
                    </Button>
                  </div>
                  
                  <div className="divide-y">
                    {cartItems.map(item => (
                      <CartItem key={item.product.id} item={item} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button asChild className="flex items-center">
                  <Link to="/products">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
            
            <div>
              <CartSummary showCheckoutButton={true} />
              
              <div className="mt-6 bg-white p-6 rounded-lg border">
                <h3 className="font-medium mb-4">Have a coupon?</h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-lemonade-yellow"
                  />
                  <Button className="rounded-l-none bg-lemonade-dark">Apply</Button>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  asChild
                  className="w-full flex items-center justify-center bg-lemonade-yellow hover:bg-lemonade-green text-black"
                >
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any lemonade to your cart yet.</p>
            <Button 
              asChild
              className="bg-lemonade-yellow hover:bg-lemonade-green text-black"
            >
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
