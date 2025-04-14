
import React from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, ShoppingBag, Truck } from "lucide-react";

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Your order #{orderId} has been placed and is being processed.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-start mb-8">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-left text-yellow-700">
              Please note: This is a demonstration store. No real order has been placed and no payment has been processed.
            </p>
          </div>
          
          <div className="bg-white p-8 border rounded-lg mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-10 h-10 bg-lemonade-yellow rounded-full flex items-center justify-center">
                    <span className="font-bold text-black">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Order Processing</h3>
                  <p className="text-gray-600">
                    We'll begin processing your order right away. You'll receive an email confirmation shortly.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-10 h-10 bg-lemonade-yellow rounded-full flex items-center justify-center">
                    <span className="font-bold text-black">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Preparation</h3>
                  <p className="text-gray-600">
                    Our team will carefully prepare and package your lemonade selection.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-10 h-10 bg-lemonade-yellow rounded-full flex items-center justify-center">
                    <span className="font-bold text-black">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Shipping</h3>
                  <p className="text-gray-600">
                    Once shipped, you'll receive tracking information to monitor your delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-lemonade-yellow hover:bg-lemonade-green text-black">
              <Link to="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={`/orders/${orderId}`}>
                <Truck className="mr-2 h-4 w-4" />
                Track Your Order
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccessPage;
