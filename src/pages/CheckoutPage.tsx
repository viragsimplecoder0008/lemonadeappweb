
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartSummary from "@/components/cart/CartSummary";
import CheckoutForm from "@/components/checkout/CheckoutForm";

const CheckoutPage: React.FC = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  
  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="mb-6">You need to add some items to your cart before checking out.</p>
          <Link 
            to="/products"
            className="inline-block px-6 py-3 bg-lemonade-yellow hover:bg-lemonade-green text-black rounded-md font-medium transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <CheckoutForm onOrderComplete={(orderId) => navigate(`/order-success/${orderId}`)} />
            </div>
          </div>
          
          <div>
            <CartSummary showCheckoutButton={false} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
