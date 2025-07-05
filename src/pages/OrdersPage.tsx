
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import OrdersList from "@/components/orders/OrdersList";
import { getUserOrders } from "@/data/orders";
import { Order } from "@/types";

const OrdersPage: React.FC = () => {
  const [orderIdInput, setOrderIdInput] = useState("");
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getUserOrders();
      setUserOrders(orders);
    };
    fetchOrders();
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderIdInput.trim()) {
      window.location.href = `/orders/${orderIdInput.trim()}`;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
              
              <OrdersList orders={userOrders} />
              
              {userOrders.length === 0 && (
                <div className="mt-8 text-center">
                  <Button 
                    asChild
                    className="bg-lemonade-yellow hover:bg-lemonade-green text-black"
                  >
                    <Link to="/products">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Start Shopping
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Track an Order</h2>
              <p className="text-gray-600 mb-4">
                Enter your order ID to check its status.
              </p>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="Enter order ID"
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    className="pr-10"
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black"
                >
                  Track Order
                </Button>
              </form>
            </div>
            
            <div className="bg-white rounded-lg border p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order, please contact our customer service.
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link to="#">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
