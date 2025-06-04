
import React from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, ShoppingBag, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { getOrderById } from "@/data/orders";
import OrderStatus from "@/components/orders/OrderStatus";

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? getOrderById(orderId) : null;
  
  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-6">
            The order you're looking for doesn't exist or you don't have access to view it.
          </p>
          <Button asChild>
            <Link to="/orders">View Your Orders</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Format date
  const orderDate = new Date(order.createdAt);
  const formattedDate = format(orderDate, "MMMM d, yyyy");
  
  // Function to handle image errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://via.placeholder.com/80x80?text=Lemonade";
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/orders" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
        </div>
        
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-600">{formattedDate}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status */}
            <div className="bg-white rounded-lg border">
              <div className="p-6">
                <OrderStatus order={order} />
              </div>
            </div>
            
            {/* Order Items */}
            <div className="bg-white rounded-lg border">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                
                <div className="divide-y">
                  {order.items.map((item, index) => (
                    <div key={index} className="py-4 flex items-center">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                        <img
                          src={item.product.imageUrl || "https://via.placeholder.com/80x80?text=Lemonade"}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <Link 
                          to={`/products/${item.product.id}`}
                          className="font-medium hover:text-lemonade-yellow"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-gray-500 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${(order.totalPrice * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(order.totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-medium mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">{order.shippingAddress.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">{order.shippingAddress.phoneNumber}</span>
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Shipping Address</h3>
                  <address className="text-gray-600 not-italic mt-1">
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </address>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <Button 
              asChild
              className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black"
            >
              <Link to="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="#">Need Help?</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetailPage;
