
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersFromBackend, subscribeToOrderChanges } from "@/data/backendApi";
import { Order } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Map, RefreshCw, Eye, Zap, Package, User, Calendar, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const EmployeeOrderView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();
  
  // Subscribe to order changes
  useEffect(() => {
    // Initial load
    refreshOrders();
    
    // Subscribe to changes
    const unsubscribe = subscribeToOrderChanges(() => {
      refreshOrders();
    });
    
    // Set up interval for polling as a fallback
    const intervalId = setInterval(() => {
      refreshOrders();
    }, 30000); // 30 seconds
    
    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);
  
  const refreshOrders = async () => {
    setLoading(true);
    try {
      console.log('Employee View: Fetching orders via backend API...');
      const freshOrders = await getOrdersFromBackend();
      setOrders(freshOrders);
      console.log(`Employee View: Successfully loaded ${freshOrders.length} orders`);
    } catch (error) {
      console.error('Employee View: Error fetching orders:', error);
      toast.error('Failed to refresh orders');
    } finally {
      setLoading(false);
    }
  };
  
  const openInMaps = (address: string, city: string, state: string, zipCode: string) => {
    const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    window.open(mapsUrl, '_blank');
  };

  const markFreeGift = (orderId: string, customer: string) => {
    // In a real app, this would update a database record
    toast.success(`${customer} marked for free lemonade next month!`);
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  if (orders.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No orders have been placed yet.</p>
        <Button onClick={refreshOrders} className="mt-4" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Check for New Orders
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Orders</h2>
        <Button onClick={refreshOrders} size="sm" variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh Orders
        </Button>
      </div>

      {loading && orders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading orders from backend...</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <div className="space-y-4">
          {orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((order) => {
                const customer = order.shippingAddress.fullName;
                return (
                  <Card 
                    key={order.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedOrder?.id === order.id ? 'ring-2 ring-lemonade-yellow' : ''
                    }`}
                    onClick={() => viewOrderDetails(order)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                          <p className="text-gray-600 flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {customer}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          {order.isQuickMode && (
                            <Badge variant="outline" className="text-orange-600 border-orange-300">
                              <Zap className="h-3 w-3 mr-1" />
                              Quick
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(order.createdAt), "MMM d, yyyy")}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₹{order.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Details Panel */}
        <div>
          {selectedOrder ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Details</span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openInMaps(
                        selectedOrder.shippingAddress.address,
                        selectedOrder.shippingAddress.city,
                        selectedOrder.shippingAddress.state,
                        selectedOrder.shippingAddress.postalCode
                      )}
                    >
                      <Map className="h-4 w-4 mr-1" />
                      Map
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => markFreeGift(selectedOrder.id, selectedOrder.shippingAddress.fullName)}
                    >
                      Free Gift
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Information */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Customer Information
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                    <p><strong>Name:</strong> {selectedOrder.shippingAddress.fullName}</p>
                    <p><strong>Email:</strong> {selectedOrder.shippingAddress.email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phoneNumber}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Order Items ({selectedOrder.items.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Information
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                    <p><strong>Total Amount:</strong> ₹{selectedOrder.totalPrice.toFixed(2)}</p>
                    <p><strong>Status:</strong> 
                      <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Badge>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Select an order to view details</p>
                  <p className="text-sm">Click on any order from the list to see full information</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
