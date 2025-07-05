
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders, subscribeToOrderChanges } from "@/data/orders";
import { Order } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Map, RefreshCw, Eye, Zap } from "lucide-react";
import { toast } from "sonner";

export const EmployeeOrderView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
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
      unsubscribe(); // Unsubscribe from order changes
      clearInterval(intervalId); // Clear interval
    };
  }, []);
  
  const refreshOrders = async () => {
    const freshOrders = await getUserOrders();
    setOrders(freshOrders);
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

  const viewOrderDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No orders have been placed yet.</p>
        <Button onClick={refreshOrders} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Check for New Orders
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Orders</h2>
        <Button onClick={refreshOrders} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh Orders
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const customer = order.shippingAddress.fullName;
            return (
              <TableRow 
                key={order.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => viewOrderDetails(order.id)}
              >
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{customer}</TableCell>
                <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <span className="capitalize">{order.status}</span>
                </TableCell>
                <TableCell>
                  {order.isQuickMode ? (
                    <div className="flex items-center text-orange-600">
                      <Zap className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Quick</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Normal</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => viewOrderDetails(order.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openInMaps(
                        order.shippingAddress.address,
                        order.shippingAddress.city,
                        order.shippingAddress.state,
                        order.shippingAddress.postalCode
                      )}
                    >
                      <Map className="h-4 w-4 mr-1" />
                      Map
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => markFreeGift(order.id, customer)}
                    >
                      Free Gift
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
