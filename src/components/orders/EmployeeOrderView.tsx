
import React from "react";
import { getUserOrders } from "@/data/orders";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import { toast } from "sonner";

export const EmployeeOrderView: React.FC = () => {
  const orders = getUserOrders();
  
  const openInMaps = (address: string, city: string, state: string, zipCode: string) => {
    const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    window.open(mapsUrl, '_blank');
  };

  const markFreeGift = (orderId: string, customer: string) => {
    // In a real app, this would update a database record
    toast.success(`${customer} marked for free lemonade next month!`);
  };
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No orders have been placed yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Customer Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const customer = order.shippingAddress.fullName;
            return (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{customer}</TableCell>
                <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <span className="capitalize">{order.status}</span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
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
